var _colors = undefined;

define([
  'util', 'const'
], function(util, cconst) {
  'use strict';
  
  var exports = _colors = {};
  var colors = exports.colors = [];

  //very crappy palette generator (it excludes purple, purple is evil!)
  
  exports.closest_map = undefined;
  exports.closest_size = undefined;
  
  exports.gen_closest_map = function gen_closest_map(size) {
    if (size == undefined)
      size = 40;
    
    console.log("generating color map of dim", "" + size + "...");
    
    var map = new Int32Array(size*size*size);
    
    exports.closest_map = map;
    exports.closest_size = size;
    
    var clr = [0, 0, 0];
    
    for (var i=0; i<size; i++) {
      for (var j=0; j<size; j++) {
        for (var k=0; k<size; k++) {
          var idx = k*size*size + j*size + i;
          
          var u = i / (size-1);
          var v = j / (size-1);
          var w = k / (size-1);
          
          clr[0] = u, clr[1] = v, clr[2] = w;
          
          map[idx] = exports.closest_color(clr);
        }
      }
    }
    
    /*
    for (var i=0; i<map.length; i++) {
      var x = i % size;
      var y = ~~((i % (size*size)) / size);
      var z = ~~(i / (size*size));
    }
    //*/
    
    console.log("done generating color map");
    
    return map;
  }
  
  exports.closest_color_fast = function closest_color_fast(clr) {
    if (exports.closest_size == undefined) {
      gen_closest_map();
    }
    
    var size = exports.closest_size;
    var map = exports.closest_map;
    
    var i = ~~(clr[0]*size+0.5);
    var j = ~~(clr[1]*size+0.5);
    var k = ~~(clr[2]*size+0.5);
    
    i = Math.min(Math.max(i, 0), size-1);
    j = Math.min(Math.max(j, 0), size-1);
    k = Math.min(Math.max(k, 0), size-1);
    
    var idx = k*size*size + j*size + i;
    
    return map[idx];
  }
  
  var _last_map = undefined;
  
  exports.gen_colors = function gen_colors() {
    colors.length = 0;
    
    /*
    
    //colors.push([0, 0, 0]);
    colors.push([1, 0, 0]);
    colors.push([0, 1, 0]);
    //colors.push([1, 1, 0]);
    colors.push([0, 0, 1]);
    //colors.push([0, 1, 1]);
    //colors.push([0, 0, 0.5]);
    //colors.push([0, 0.5, 0.5]);
    //colors.push([0.5, 0.5, 0]);
    
    return;
    
    //*/
    
    colors.length = 0;
    var base = PAL_COLORS;
    
    //teal 2
    for (var i=0; i<base; i++) {
      var clr = [0, 0.7, (i+1)/base]; 
      colors.push(clr)
    }
    
    //blue
    for (var i=0; i<base*2; i++) {
      var clr = [0, 0, (i+1)/(base*2)]; 
      colors.push(clr)
    }
    
    //evil!
    var totpurple = ALLOW_PURPLE ? base : 0;
    
    for (var i=0; i<totpurple; i++) {
      var clr = [(i+1)/totpurple, 0, (i+1)/totpurple]; 
      colors.push(clr)
    }
    
    //evil!
    for (var i=0; i<totpurple; i++) {
      var clr = [(i+1)/totpurple, 0, 1.0]; 
      colors.push(clr)
    }
    
    //red
    for (var i=0; i<base; i++) {
      var clr = [(i+1)/base, 0, 0]; 
      colors.push(clr)
    }
    
    //grey
    for (var i=0; i<base; i++) {
      var clr = [i/base, i/base, i/base]; 
      colors.push(clr)
    }
    
    //orange-yellow
    for (var i=0; i<base; i++) {
      var clr = [(i+1)/base, (i+1)/base, 0]; 
      colors.push(clr)
    }
    
    //orange-yellow 2
    for (var i=0; i<base; i++) {
      var clr = [0.7, (i+1)/base, 0]; 
      colors.push(clr)
    }
    
    //orange-yellow 3
    for (var i=0; i<base; i++) {
      var clr = [(i+1)/base, 0.7, 0]; 
      colors.push(clr)
    }
    
    //green
    for (var i=0; i<base; i++) {
      var clr = [0, (i+1)/base, 0]; 
      colors.push(clr)
    }
    
    //teal
    for (var i=0; i<base; i++) {
      var clr = [0, (i+1)/base, (i+1)/base]; 
      colors.push(clr)
    }
    
    var key = ""+PAL_COLORS+","+ALLOW_PURPLE;
    
    if (_last_map == undefined || _last_map != key) {
      exports.gen_closest_map();
    }
    
    _last_map = key;
  }
  
  exports.closest_color = function closest_color(c1) {
    var mindis = undefined;
    var ret = undefined;
    
    for (var i=0; i<colors.length; i++) {
      var c2 = colors[i];
      var dr = (c1[0]-c2[0]), dg = (c1[1]-c2[1]), db=(c1[2]-c2[2]);
      
      var dis = dr*dr + dg*dg + db*db;
      
      var w1 = 0.8;
      var w2 = 1.0;
      var w3 = 0.8;
      
      //w1=w2=w3=1.0;
      
      dis = (Math.abs(dr)*w1 + Math.abs(dg)*w2 + Math.abs(db)*w3)/(w1+w2+w3);
      //dis = dr*dr*w1*w1 + dg*dg*w2*w2 + db*db*w3*w3;
      //dis = dis == 0.0 ? 0.0 : Math.sqrt(dis)/((w1+w2+w3)*Math.sqrt(3.0));
      
      if (c2[0] == c2[1] && c2[0] == c2[2]) {
        var dis2 = dis != 0.0 ? Math.sqrt(dis) : 0.0; 
        
        dis = 0.5*dis2 + 0.5*dis;
      }
      
      if (DITHER_COLORS) { //small random factor
        dis += (Math.random()-0.5)*DITHER_RAND_FAC;
      }
      
      if (mindis == undefined || dis < mindis) {
        mindis = dis;
        ret = i;
      }
    }
    
    return ret;
  }

  exports.gen_colors();

  return exports;
});

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
  
  var colors_used = exports.colors_used = new Array();
  
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
    
    colors_used.length = colors.length;
    for (var i=0; i<colors.length; i++) {
      colors_used[i] = 0;
    }
  }
  
  exports.image_palette = function(maxcolor) {
    exports.gen_colors();
    
    if (maxcolor == undefined)
      maxcolor = 8;
    
    var cw = _appstate.image.width;
    var ch = _appstate.image.height;
    var idata = _appstate.image.data.data;
    
    var hist = new Int32Array(exports.colors.length);
    hist.fill(0, 0, hist.length);
    var clr = [0, 0, 0];
    
    var _i=0;
    for (var ix=0; ix<cw; ix += 4) {
      if (_i++ % 50 == 0) {
        console.log("doing column...", ix);
      }
      
      for (var iy=0; iy<ch; iy += 4) {
        var idx = (iy*cw + ix)*4;
        
        var r = idata[idx]/255;
        var g = idata[idx+1]/255;
        var b = idata[idx+2]/255;
        
        var a = idata[idx+3]/255;
        
        if (a < 0.1) {
          continue;
        } else {
          //r = 1.0 - r*a - a;
          //g = 1.0 - g*a - a;
          //b = 1.0 - b*a - a;
        }
        
        clr[0] = r;
        clr[1] = g;
        clr[2] = b;
        
        var ci = exports.closest_color(clr);
        hist[ci]++;
      }
    }
    
    var arr = [];
    for (var i=0; i<hist.length; i++) {
      arr.push([i, hist[i]]);
    }
    
    function weight(c) {
      var clr = exports.colors[c[0]];
      
      var w = c[1];
      var avg = (clr[0]+clr[1]+clr[2])/3.0;
      var sat = (Math.abs(clr[0]-avg) + Math.abs(clr[1]-avg) + Math.abs(clr[2]-avg))/3.0
      
      w = w*0.0001 + (sat)*w;
      
      return w;
    }
    
    arr.sort(function(a, b) {
      return weight(b) - weight(a);
    });
    
    arr = arr.slice(0, maxcolor);
    var newcolors = [];
    
    for (var i=0; i<arr.length; i++) {
      if (arr[i][1] == 0) {
        break;
      }
      
      newcolors.push(exports.colors[arr[i][0]]);
    }
    
    exports.colors = colors = newcolors;
    
    for (var i=0; i<colors.length; i++) {
      console.log(colors[i]);
    }
    
    exports.gen_closest_map();
    
    return colors;
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

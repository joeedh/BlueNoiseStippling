var _colors = undefined;

define([
  'util', 'const'
], function(util, cconst) {
  'use strict';
  
  var exports = _colors = {};
  var colors = exports.colors = [];

  //very crappy palette generator (it excludes purple, purple is evil!)
  
  exports.gen_colors = function gen_colors() {
    colors.length = 0;
    var base = PAL_COLORS;
    
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
    var totpurple = base;
    for (var i=0; i<totpurple; i++) {
      var clr = [0.25*(i+1)/totpurple, 0, 0.25*(i+1)/totpurple]; 
      //colors.push(clr)
    }
    
    //evil!
    var totpurple = base;
    for (var i=0; i<totpurple; i++) {
      var clr = [0.25*(i+1)/totpurple, 0, 1.0]; 
      //colors.push(clr)
    }
  }

  exports.closest_color = function closest_color(c1) {
    var mindis = undefined;
    var ret = undefined;
    
    for (var i=0; i<colors.length; i++) {
      var c2 = colors[i];
      var dr = (c1[0]-c2[0]), dg = (c1[1]-c2[1]), db=(c1[2]-c2[2]);
      
      var dis = dr*dr + dg*dg + db*db;
      
      var w1 = 1.0;
      var w2 = 1.0;
      var w3 = 1.0;
      
      //w1=w2=w3=1.0;
      
      dis = (Math.abs(dr)*w1 + Math.abs(dg)*w2 + Math.abs(db)*w3)/(w1+w2+w3);
      //dis = dr*dr*w1*w1 + dg*dg*w2*w2 + db*db*w3*w3;
      //dis = dis == 0.0 ? 0.0 : Math.sqrt(dis)/((w1+w2+w3)*Math.sqrt(3.0));
      
      if (c2[0] == c2[1] && c2[0] == c2[2]) {
        var dis2 = dis != 0.0 ? Math.sqrt(dis) : 0.0; 
        
        dis = 0.5*dis2 + 0.5*dis;
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

//argh! I hate doing this! but necassary!
//core data 'structures' are actually embedded in typed arrays. . . ger

//points
var PX=0, PY=1, PRADIUS=2, PINTEN=3, PID=4, PTOT=5;

window.DIMEN = 350;

window.DRAW_RMUL = 2.1;

window.SCALE = 1.0;
window.PANX = 0.0;
window.PANY = 0.0;
window.ACCUM_ALPHA = 0.3;
window.SHARPNESS = 0.5;

window.USE_MERSENNE = false;

Math._random = Math.random;
Math.random = function() {
  if (USE_MERSENNE) {
    return _util.random();
  } else {
    return Math._random();
  }
}

window.LOW_RES_CUBE = false;
window.GRID_MODE = false;
window.DRAW_TRANSPARENT = false;
window.STEPS = 5000;
window.RAND_FAC = 0.0;
window.DITHER_RAND_FAC = 0.05;

window.ALLOW_PURPLE = true;
window.CORRECT_FOR_SPACING = false;

window.HEXAGON_MODE = false;
window.ADAPTIVE_COLOR_DENSITY = true;

window.NO_IMAGE_FILTER = false;

window.RENDERED_IMAGE_SIZE = 1024;

window.DITHER_COLORS = 1;
window.PAL_COLORS = 8;
window.SHOW_COLORS = 1;

window._search_offs = new Array(64);
_search_offs[0] = [];

var _const = undefined;
define([
  "util", "mask_file"
], function(util, mask_file) {
  'use strict';
  
  var exports = _const = {};
  
  var get_searchoff = exports.get_searchoff = function get_searchoff(n, noreport) {
    var r = n, i=n;
    
    if (_search_offs.length <= n) {
      _search_offs.length = n+1;
    }
    
    if (_search_offs[n] != undefined) {
      return _search_offs[n];
    }
    
    if (!noreport)
      console.trace("generate search a off of radius", n, "...");
    
    var lst = [];
    for (var x=-i; x<i; x++) {
      for (var y=-i; y<i; y++) {
        var x2 = x < 0 ? x+1 : x;
        var y2 = y < 0 ? y+1 : y;
        
        var dis = x2*x2 + y2*y2;
        dis = dis != 0.0 ? Math.sqrt(dis) : 0.0;
        
        //console.log(dis.toFixed(3), r.toFixed(3));
        
        if (dis > r) {
          continue;
        }
        
        lst.push([x, y]);
      }
    }
    
    //sort by distance
    lst.sort(function(a, b) {
      return a[0]*a[0] + a[1]*a[1] - b[0]*b[0] - b[1]*b[1];
    });
    
    _search_offs[n] = lst;
    
    return lst;
  }

  for (var i=0; i<32; i++) {
      get_searchoff(i, true);
  }


  var spline = exports.spline = function spline() {
    var t = arguments[arguments.length-1];
    
    for (var i=arguments.length-3; i>=0; i -= 2) {
      if (t >= arguments[i]) {
        var ta = arguments[i];
        var tb = arguments[i < arguments.length-3 ? i + 2 : i];
        
        var a = arguments[i+1];
        var b = arguments[i < arguments.length-3 ? i+3 : i+1];
        
        t -= ta;
        if (tb != ta)
          t /= tb-ta;
        
        return a + (b - a)*t;
      }
    }
    
    return 0.0;
  }
  
  exports.sharpen_cache = new Array(256);
  
  var last_sharpness = -1;
  
  exports.get_sharpen_filter = function get_sharpen_filter(fwid) {
    if (last_sharpness != SHARPNESS) {
      last_sharpness = SHARPNESS;
      exports.sharpen_cache = {};
    }
    
    if (exports.sharpen_cache[fwid] != undefined) {
      return exports.sharpen_cache[fwid];
    }
    
    function bez4(a, b, c, d, t) {
      var r1 = a + (b - a)*t;
      var r2 = b + (c - b)*t;
      var r3 = c + (d - c)*t;
      
      var r4 = r1 + (r2 - r1)*t;
      var r5 = r2 + (r3 - r2)*t;
      
      return r4 + (r5 - r4)*t;
    }
    
    var ret = [];
    var totsample = fwid*fwid;
    for (var i=0; i<totsample; i++) {
      if (0 && totsample == 9) {
        var d = 2;
        
        ret = [
          -d, -d, -d,
          -d, 22, -d,
          -d, -d, -d,
        ]
        var tot=0;
        
        for (var j=0; j<totsample; j++) {
          tot += ret[j];
        }
        
        for (var j=0; j<totsample; j++) {
          ret[j] /= tot;
        }
        
        break
      }
      
      var fwid2 = fwid-1;
      var xoff = ((i) % fwid)/fwid2;
      var yoff = (~~((i)/fwid))/fwid2;
      
      xoff -= 0.5;
      yoff -= 0.5;
      
      var w = xoff*xoff + yoff*yoff;
      
      w = w == 0.0 ? 0.0 : Math.sqrt(w);
      w = 1.0 - 2.0*w/Math.sqrt(2.0);
      
      /*
      w = spline(
        0,0,
        0.3, -0.3,
        1.0, 1.3,
        w
      );
      //*/
      
      var fac = 1.3;
      
      var s = SHARPNESS;
      
      w = bez4(0, -0.75-s*2, (0.95+s*2)*fac, 1.0, w);
      
      ret.push(w);
    }
    
    exports.sharpen_cache[fwid] = ret;
    return ret;
  }
  
  return exports;
});

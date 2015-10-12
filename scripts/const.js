//argh! I hate doing this! but necassary!
//core data 'structures' are actually embedded in typed arrays. . . ger

//points
var PX=0, PY=1, PRADIUS=2, PINTEN=3, PID=4, PTOT=5;

window.DIMEN = 350;
window.DRAW_RMUL = 2.1;
window.SCALE = 1.0;
window.PANX = 0.0;
window.PANY = 0.0;
window.STEPS = 5000;
window.RAND_FAC = 0.55;

window.HEXAGON_MODE = true;
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
  
  return exports;
});

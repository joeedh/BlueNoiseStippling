//argh! I hate doing this! but necassary!
//core data 'structures' are actually embedded in typed arrays. . . ger

//points

//pox/poy are original positions at time of creation
//poldx/poldy are used by relax() to calculate velocity
var PX=0, PY=1, PRADIUS=2, PINTEN=3, PID=4, PLVL=5;
var POX=6, POY=7, PDX=8, PDY=9, POLDX=10, POLDY=11, PBAD=12, PRADIUS2=13;
var PTH=14, PTOT=15;

window.APP_VERSION = 0.5;

Math._random = Math.random;
Math.random = function() {
  if (USE_MERSENNE) {
    return _util.random();
  } else {
    return Math._random();
  }
}

window.RASTER_MODES = {
  DIFFUSION : 0,
  PATTERN   : 1,
  CMYK      : 2
}

window._search_offs = new Array(64);
_search_offs[0] = [];

var _const = undefined;
define([
  "util", "mask_file"
], function(util, mask_file) {
  'use strict';
  
  var exports = _const = {};

  exports.defaultConfig = {
    DIMEN : 165,
    ANISOTROPY : false,
    ANIS_W1 : 0.5,
    ANIS_W2 : 0.5,
    DRAW_STICKS : false,
    STICK_ROT : 0.0,
    STICK_WIDTH : 2,
    STICK_LENGTH : 2.0,
    
    SPECIAL_OFFSETS : false, //use encoded lower-level offsets, multiplied by intensity
    XLARGE_MASK : false,
    SMALL_MASK : false,
    SCALE_POINTS : false,
    SHOW_KDTREE : false,

    DRAW_RMUL : 1.3,
    BLACK_BG : false,

    SCALE : 1.0,
    PANX : 0.0,
    PANY : 0.0,
    ACCUM_ALPHA : 0.3,
    MAKE_NOISE : false,
    RELAX_SPEED : 1.0,

    SHARPNESS : 0.5,
    SHARPEN_LUMINENCE : true,
    SHARPEN : true,

    USE_LAB : true,
    RASTER_IMAGE : false,

    USE_MERSENNE : false,
    TRI_MODE : false,

  //used to allocate voronoi diagram
    MAX_VCELL_SIZE : 32,
    RASTER_MODE : RASTER_MODES.CMYK,
    
    TONE_CURVE   : undefined,
    LOW_RES_CUBE : true,
    GRID_MODE : false,
    DRAW_TRANSPARENT : false,
    STEPS : 5000,
    RAND_FAC : 0.0,
    DITHER_RAND_FAC : 0.0,

    BG_PALETTE : false,
    SIMPLE_PALETTE : false,
    ALLOW_PURPLE : true,
    CORRECT_FOR_SPACING : false,

    HEXAGON_MODE : false,
    ADAPTIVE_COLOR_DENSITY : true,

    NO_IMAGE_FILTER : false,

    RENDERED_IMAGE_SIZE : 1024,

    DITHER_COLORS : 1,
    PAL_COLORS : 8,
    SHOW_COLORS : 1,
  };
  
  exports.DefaultCurves = {
    TONE_CURVE : undefined
  };
  
  exports.toJSON = function() {
    let ret = {};
    
    for (let k in exports.defaultConfig) {
      ret[k] = window[k];
    }
    
    return ret;
  }
  
  exports.loadJSON = function(json) {
    for (let k in json) {
      window[k] = json[k];
    }
    
    return this;
  }
  
  //load config into window. need to refactor to use const directly.
  for (let k in exports.defaultConfig) {
    window[k] = exports.defaultConfig[k];
  }
  
  var _spotfuncs = exports._spotfuncs = {};

  var bez4 = exports.bez4 = function bez4(a, b, c, d, t) {
    var r1 = a + (b - a)*t;
    var r2 = b + (c - b)*t;
    var r3 = c + (d - c)*t;
    
    var r4 = r1 + (r2 - r1)*t;
    var r5 = r2 + (r3 - r2)*t;
    
    return r4 + (r5 - r4)*t;
  }
  
  var get_spotfunc = exports.get_spotfunc = function get_spotfunc(n, inten, noreport) {
    var r = n, i=n;
    
    if (_spotfuncs.length <= n) {
      _spotfuncs.length = n+1;
    }
    
    var key = n+","+inten.toFixed(2);
    
    if (_spotfuncs[key] != undefined) {
      return _spotfuncs[key];
    }
    
    if (!noreport)
      console.trace("generate search a off of radius", n, "...");
    
    var lst = [];
    for (var x=-i; x<=i; x++) {
      for (var y=-i; y<=i; y++) {
        var x2 = x < 0 ? x+0 : x;
        var y2 = y < 0 ? y+0 : y;
        
        var dis = x2*x2 + y2*y2;
        dis = dis != 0.0 ? Math.sqrt(dis) : 0.0;
        
        //*
        var sqrdis = Math.max(Math.abs(x2), Math.abs(y2))*Math.sqrt(2.0);
        
        //var f = 1.0-Math.sqrt(0.0001+inten);
        
        //f = 1.0-Math.abs(f-0.5)*2.0;
        //f *= f;
        
        var f = inten;
        f = f < 0.4 ? 1 : 0;
        
        if (n > 1) {
          dis = dis*(1.0-f) + sqrdis*f;
        }
        
        //dis = sqrdis;
        //*/
        
        if (dis > r+0.0001) {
          continue;
        }
        
        lst.push([x, y]);
      }
    }
    
    //sort by distance
    lst.sort(function(a, b) {
      return a[0]*a[0] + a[1]*a[1] - b[0]*b[0] - b[1]*b[1];
    });
    
    _spotfuncs[key] = lst;
    
    return lst;
  }
  
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
    for (var x=-i; x<=i; x++) {
      for (var y=-i; y<=i; y++) {
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
  exports.basic_cache = new Array(256);
  
  exports.get_sharpen_filter = function get_sharpen_filter(fwid, sharpness) {
    if (!window.SHARPEN) {
      if (exports.basic_cache[fwid] != undefined) {
        return exports.basic_cache[fwid];
      }
      
      var ret = [];
      for (var i=0; i<fwid*fwid; i++) {
        var fwid2 = fwid-1;
        
        var xoff = ((i) % fwid)/fwid2;
        var yoff = (~~((i)/fwid))/fwid2;
        
        xoff -= 0.5;
        yoff -= 0.5;

        var w = xoff*xoff + yoff*yoff;
        
        w = w == 0.0 ? 0.0 : Math.sqrt(w);
        w = 1.0 - w/Math.sqrt(2.0);
        w = Math.pow(w, 3.0);
        
        ret.push(w);
      }
      
      exports.basic_cache[fwid] = ret;
      return ret;
    }
    
    if (last_sharpness != sharpness) {
      last_sharpness = sharpness;
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
      
      var s = sharpness;
      
      w = bez4(0, -0.75-s*2, (0.95+s*2)*fac, 1.0, w);
      
      ret.push(w);
    }
    
    exports.sharpen_cache[fwid] = ret;
    return ret;
  }
  
  return exports;
});

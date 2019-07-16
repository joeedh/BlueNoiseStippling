var _colors = undefined;

define([
  'util', 'const'
], function(util, cconst) {
  'use strict';
  
  var exports = _colors = {};
  var colors = exports.colors = [];
  
  let DitherSampler = exports.DitherSampler = class DitherSampler extends Array {
    constructor(size=1024*32) {
      super();

      let rand = new util.MersenneRandom(0);

      for (let i=0; i<size; i++) {
        this.push(rand.random());
      }

      this.cur = 0;
    }

    seed(i) {
      i = ~~i;

      while (i < 0) {
        i += this.length;
      }

      this.cur = i % this.length;
      return this;
    }

    random() {
      let ret = this[this.cur];

      this.cur = (this.cur + 1) % this.length;
      return ret;
    }
  }

  exports.ditherSampler = new DitherSampler();

  //very crappy palette generator (it excludes purple, purple is evil!)
  
  let rgb_to_hsv_rets = new util.cachering(() => [0, 0, 0], 64);
  
  let rgb_to_hsv = exports.rgb_to_hsv = function rgb_to_hsv (r,g,b) {
    var computedH = 0;
    var computedS = 0;
    var computedV = 0;

    if ( r==null || g==null || b==null ||
       isNaN(r) || isNaN(g)|| isNaN(b) ) {
     throw new Error('Please enter numeric RGB values!');
     return;
    }
    /*
    if (r<0 || g<0 || b<0 || r>1.0 || g>1.0 || b>1.0) {
     throw new Error('RGB values must be in the range 0 to 1.0');
     return;
    }//*/

    var minRGB = Math.min(r,Math.min(g,b));
    var maxRGB = Math.max(r,Math.max(g,b));

    // Black-gray-white
    if (minRGB==maxRGB) {
      computedV = minRGB;
      
      let ret = rgb_to_hsv_rets.next();
      ret[0] = 0, ret[1] = 0, ret[2] = computedV;
      return ret;
    }

    // Colors other than black-gray-white:
    var d = (r==minRGB) ? g-b : ((b==minRGB) ? r-g : b-r);
    var h = (r==minRGB) ? 3 : ((b==minRGB) ? 1 : 5);
    
    computedH = (60*(h - d/(maxRGB - minRGB))) / 360.0;
    computedS = (maxRGB - minRGB)/maxRGB;
    computedV = maxRGB;
    
    let ret = rgb_to_hsv_rets.next();
    ret[0] = computedH, ret[1] = computedS, ret[2] = computedV;
    return ret;
  }

  let hsv_to_rgb_rets = new util.cachering(() => [0, 0, 0], 64);
  
  let hsv_to_rgb = exports.hsv_to_rgb = function hsv_to_rgb(h, s, v) {
    let c=0, m=0, x=0;
    let ret = hsv_to_rgb_rets.next();
    
    ret[0] = ret[1] = ret[2] = 0.0;
    h *= 360.0;
    
    c = v * s;
    x = c * (1.0 - Math.abs(((h / 60.0) % 2) - 1.0));
    m = v - c;
    let color;
    
    function RgbF_Create(r, g, b) {
      ret[0] = r;
      ret[1] = g;
      ret[2] = b;
      
      return ret;
    }
    
    if (h >= 0.0 && h < 60.0)
    {
        color = RgbF_Create(c + m, x + m, m);
    }
    else if (h >= 60.0 && h < 120.0)
    {
        color = RgbF_Create(x + m, c + m, m);
    }
    else if (h >= 120.0 && h < 180.0)
    {
        color = RgbF_Create(m, c + m, x + m);
    }
    else if (h >= 180.0 && h < 240.0)
    {
        color = RgbF_Create(m, x + m, c + m);
    }
    else if (h >= 240.0 && h < 300.0)
    {
        color = RgbF_Create(x + m, m, c + m);
    }
    else if (h >= 300.0 && h < 360.0)
    {
        color = RgbF_Create(c + m, m, x + m);
    }
    else
    {
        color = RgbF_Create(m, m, m);
    }
    
    return color;
}
  exports.closest_map = undefined;
  exports.closest_size = undefined;

  var rgb_to_xyz_rets = new util.cachering(function() {
    return [0, 0, 0];
  }, 512);
  var xyz_to_rgb_rets = new util.cachering(function() {
    return [0, 0, 0];
  }, 512);
  var xyz_to_lab_rets = new util.cachering(function() {
    return [0, 0, 0];
  }, 512);
  var lab_to_xyz_rets = new util.cachering(function() {
    return [0, 0, 0];
  }, 512);
  var lab_to_labch_rets = new util.cachering(function() {
    return [0, 0, 0];
  }, 512);
  var labch_to_lab_rets = new util.cachering(function() {
    return [0, 0, 0];
  }, 512);
  var rgb_to_lab_rets = new util.cachering(function() {
    return [0, 0, 0];
  }, 512);
  var lab_to_rgb_rets = new util.cachering(function() {
    return [0, 0, 0];
  }, 512);
  var rgb_to_cmyk_rets = new util.cachering(function() {
    return [0, 0, 0, 0];
  }, 512);
  
  var rgb_to_xyz = exports.rgb_to_xyz = function rgb_to_xyz(r, g, b) {
    var var_R = r; //( R / 255 )        //R from 0 to 255
    var var_G = g; //( G / 255 )        //G from 0 to 255
    var var_B = b; //( B / 255 )        //B from 0 to 255

    if ( var_R > 0.04045 ) var_R = Math.pow( ( var_R + 0.055 ) / 1.055, 2.4);
    else                   var_R = var_R / 12.92;
    if ( var_G > 0.04045 ) var_G = Math.pow( ( var_G + 0.055 ) / 1.055, 2.4);
    else                   var_G = var_G / 12.92;
    if ( var_B > 0.04045 ) var_B = Math.pow( ( var_B + 0.055 ) / 1.055, 2.4);
    else                   var_B = var_B / 12.92;

    /*
      on factor;
      off period;
      
      f1 := var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805 - X;
      f2 := var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722 - Y;
      f3 := var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505 - Z;
      
      f := solve({f1, f2, f3}, {var_r, var_g, var_b});
    */
    
    //Observer. = 2°, Illuminant = D65
    var X = var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805;
    var Y = var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722;
    var Z = var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505;
    
    var ret = rgb_to_xyz_rets.next();
    ret[0] = X*100;
    ret[1] = Y*100;
    ret[2] = Z*100;
    
    return ret;
  }
  
  var xyz_to_rgb = exports.xyz_to_rgb = function xyz_to_rgb(X, Y, Z) {
    var var_X = X / 100        //X from 0 to  95.047      (Observer = 2°, Illuminant = D65)
    var var_Y = Y / 100        //Y from 0 to 100.000
    var var_Z = Z / 100        //Z from 0 to 108.883

    var var_R = var_X *  3.240625  + var_Y * -1.53720797 + var_Z * -0.498628
    var var_G = var_X * -0.9689307 + var_Y *  1.87575606 + var_Z *  0.04151752
    var var_B = var_X *  0.0557101 + var_Y * -0.204021   + var_Z *  1.05699

    if ( var_R > 0.003130807 ) var_R = 1.055 * ( Math.pow(var_R,  1 / 2.4 ) ) - 0.055
    else                       var_R = 12.92 * var_R
    if ( var_G > 0.003130807 ) var_G = 1.055 * ( Math.pow(var_G,  1 / 2.4 ) ) - 0.055
    else                       var_G = 12.92 * var_G
    if ( var_B > 0.003130807 ) var_B = 1.055 * ( Math.pow(var_B,  1 / 2.4 ) ) - 0.055
    else                       var_B = 12.92 * var_B

    var ret = xyz_to_rgb_rets.next();
    
    ret[0] = var_R;
    ret[1] = var_G;
    ret[2] = var_B;
    
    return ret;
  }

  
  var lab_to_xyz = exports.lab_to_xyz = function lab_to_xyz(L, a, b) {
    var var_Y = ( L + 16 ) / 116;
    var var_X = a / 500 + var_Y;
    var var_Z = var_Y - b / 200;

    var X3 = var_X*var_X*var_X;
    var Y3 = var_Y*var_Y*var_Y;
    var Z3 = var_Z*var_Z*var_Z;
    
    if ( Y3 > 0.008856 ) var_Y = Y3
    else                 var_Y = ( var_Y - 16 / 116 ) / 7.787
    if ( X3 > 0.008856 ) var_X = X3
    else                 var_X = ( var_X - 16 / 116 ) / 7.787
    if ( Z3 > 0.008856 ) var_Z = Z3
    else                 var_Z = ( var_Z - 16 / 116 ) / 7.787

    var X = 95.047  * var_X;     //ref_X =  95.047     Observer= 2°, Illuminant= D65
    var Y = 100.000 * var_Y;     //ref_Y = 100.000
    var Z = 108.883 * var_Z;     //ref_Z = 108.883
    
    var ret = lab_to_xyz_rets.next();
    
    ret[0] = X;
    ret[1] = Y;
    ret[2] = Z;
    
    return ret;
  }
    
  var xyz_to_lab = exports.xyz_to_lab = function xyz_to_lab(X, Y, Z) {
    var var_X = X / 95.047          //ref_X =  95.047   Observer= 2°, Illuminant= D65
    var var_Y = Y / 100.000         //ref_Y = 100.000
    var var_Z = Z / 108.883         //ref_Z = 108.883

    if ( var_X > 0.008856 ) var_X = Math.cbrt(var_X);
    else                    var_X = ( 7.787 * var_X ) + ( 16 / 116 )
    if ( var_Y > 0.008856 ) var_Y = Math.cbrt(var_Y);
    else                    var_Y = ( 7.787 * var_Y ) + ( 16 / 116 )
    if ( var_Z > 0.008856 ) var_Z = Math.cbrt(var_Z);
    else                    var_Z = ( 7.787 * var_Z ) + ( 16 / 116 )
    
    var ret = xyz_to_rgb_rets.next();
    
    var L = ( 116 * var_Y ) - 16
    var a = 500 * ( var_X - var_Y )
    var b = 200 * ( var_Y - var_Z )
    
    ret[0] = L;
    ret[1] = a;
    ret[2] = b;
    
    return ret;
  }
  
  function lab_to_labch(L, a, b) {
    var var_H = Math.atan2( b, a )  //Quadrant by signs

    if ( var_H > 0 ) var_H = ( var_H / Math.PI ) * 180
    else             var_H = 360 - ( Math.abs( var_H ) / Math.PI ) * 180
  
    var L = L;
    var C = Math.sqrt( a * a + b * b )
    var H = var_H;
    
    var ret = lab_to_labch_rets.next();
    
    ret[0] = L;
    ret[1] = C;
    ret[2] = H;
    
    return ret;
    //var L = L
    //var C = sqrt( CIEa ** 2 + CIEb ** 2 )
    //var H = var_H
  }
  
  var labch_to_lab = exports.labch_to_lab = function labch_to_lab(L, c, h) {
    var ret = labch_to_lab_rets.next();
    
    var h = (h/180)*Math.PI;
    
    ret[0] = L;
    ret[1] = Math.cos(h) * c;
    ret[2] = Math.sin(h) * c;
    
    return ret;
  }
  
  var rgb_to_lab = exports.rgb_to_lab = function rgb_to_lab(r, g, b) {
    var xyz = rgb_to_xyz(r, g, b);
    //return xyz;
    
    return xyz_to_lab(xyz[0], xyz[1], xyz[2]);
  }
  
  var lab_to_rgb = exports.lab_to_rgb = function lab_to_rgb(l, a, b) {
    //return xyz_to_rgb(l, a, b);
    
    var xyz = lab_to_xyz(l, a, b);
    return xyz_to_rgb(xyz[0], xyz[1], xyz[2]);
  }
  
  var rgb_to_labch = exports.rgb_to_labch = function rgb_to_labch(r, g, b) {
    var lab = rgb_to_lab(r, g, b);
    //return xyz;
    
    return lab_to_labch(lab[0], lab[1], lab[2]);
  }
  
  var rgb_to_cmyk = exports.rgb_to_cmyk = function rgb_to_cmyk(r, g, b) {
        //CMYK and CMY values from 0 to 1
    var ret = rgb_to_cmyk_rets.next();
    
    var C = 1.0 - r;
    var M = 1.0 - g;
    var Y = 1.0 - b;
    
    var var_K = 1

    if ( C < var_K )   var_K = C
    if ( M < var_K )   var_K = M
    if ( Y < var_K )   var_K = Y
    if ( var_K == 1 ) { //Black
       C = 0
       M = 0
       Y = 0
    }
    else {
       C = ( C - var_K ) / ( 1 - var_K )
       M = ( M - var_K ) / ( 1 - var_K )
       Y = ( Y - var_K ) / ( 1 - var_K )
    }
    
    var K = var_K
    
    ret[0] = C;
    ret[1] = M;
    ret[2] = Y;
    ret[3] = K;
    
    return ret;
  }
  
  var labch_to_rgb = exports.labch_to_rgb = function labch_to_rgb(l, c, h) {
    var labch = labch_to_lab(l, c, h);
    
    return lab_to_rgb(labch[0], labch[1], labch[2]);
  }
  
  exports.test_lab_xyz = function test_lab_xyz() {
    util.seed(0);
    
    for (var i=0; i<5; i++) {
      //var rgb = [0.9, 0.1, 0.2];
      var rgb = [util.random(), util.random(), util.random()];
      
      var lab = rgb_to_lab(rgb[0], rgb[1], rgb[2]);
      
      console.log(rgb);
      //console.log(xyz);
      console.log(lab);
      //console.log(xyz_to_rgb(xyz[0], xyz[1], xyz[2]));
      
      rgb = lab_to_rgb(lab[0], lab[1], lab[2]);
      console.log(rgb);
      
      console.log("\n")
    }
  }
  
  exports.gen_closest_map = function gen_closest_map(size) {
    if (size == undefined)
      size = LOW_RES_CUBE ? 20 : 40;
    
    console.trace("generating color map of dim", "" + size + "...");
    
    var map = new Int32Array(size*size*size);
    var nextmap = new Int32Array(size*size*size);
    
    exports.closest_map = map;
    exports.closest_size = size;
    exports.next_closest_map = nextmap;
    
    var clr = [0, 0, 0];
    
    var nextout = [0];
    
    for (var i=0; i<size; i++) {
      for (var j=0; j<size; j++) {
        for (var k=0; k<size; k++) {
          var idx = k*size*size + j*size + i;
          
          var u = i / (size-1);
          var v = j / (size-1);
          var w = k / (size-1);
          
          clr[0] = u, clr[1] = v, clr[2] = w;
          
          map[idx] = exports.closest_color(clr, nextout);
          nextmap[idx] = nextout[0];
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
  
  exports.closest_color_fast = function closest_color_fast(clr, nextout) {
    if (exports.closest_size == undefined) {
      exports.gen_closest_map();
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
    
    if (nextout != undefined) {
      nextout[0] = exports.next_closest_map[idx];
    }
    
    return map[idx];
  }
  
  var _last_map = undefined;
  
  var colors_used = exports.colors_used = new Array();
  var lab_colors = exports.lab_colors = [];
  
  exports.gen_colors = function gen_colors() {
    lab_colors.length = 0;
    
    //generate rgb palette
    exports.gen_colors_intern();
    
    for (var i=0; i<colors.length; i++) {
      var c = colors[i];
      var l = rgb_to_lab(c[0], c[1], c[2]);
      lab_colors.push([l[0], l[1], l[2]]);
    }
  }
  
  exports.gen_colors_intern = function gen_colors_intern() {
    colors.length = 0;
    
    //XXX
    if (TRI_MODE || RASTER_MODE == RASTER_MODES.PATTERN || RASTER_MODE == RASTER_MODES.DIFFUSION) {
      colors.push([1, 1, 1]);
    }

    if (BG_PALETTE) {
      colors.push([0, 0, 0]);
      exports.gen_closest_map();
      return;
    }
    
    if (SIMPLE_PALETTE) {
      colors.push([0, 0, 0]);
      
      //colors.push([1, 1, 0]);
      //colors.push([1, 0, 1]);
      //colors.push([0, 1, 1]);
      
      colors.push([1, 0, 0]);
      colors.push([0, 1, 0]);
      colors.push([0, 0, 1]);
      
      if (ALLOW_PURPLE) {
        colors.push([1, 0, 1]);
      }
      
      exports.gen_closest_map();
      return;
    }
    
    /*
    for (var i=0; i<19; i++) {
      colors.push([i/19, i/19, i/19]);
    }
    return;
    //*/
    
    /*
    //colors.push([1, 1, 0]);
    //colors.push([0, 1, 1]);
    //colors.push([1, 0, 1]);
    
    colors.push([1, 0, 0]);
    colors.push([0, 1, 0]);
    colors.push([0, 0, 1]);
    
    colors.push([0, 0, 0]);
    //colors.push([1, 1, 0]);
    //colors.push([0, 1, 1]);
    //colors.push([0, 0, 1]);
    //colors.push([0, 1, 0]);
    //colors.push([1, 0, 0]);
    //colors.push([0, 0, 0]);
    
    return;
    //*/
    
    /*
    colors.push([1, 0, 0]);
    colors.push([0, 1, 0]);
    colors.push([1, 1, 0]);
    colors.push([0, 1, 1]);
    
    colors.push([0, 0, 1]);
    colors.push([1, 0, 1]);
    colors.push([0, 0, 0]);
    colors.push([0.9, 0.9, 0.9]);
    return;

    colors.push([1, 0, 0]);
    colors.push([0, 1, 0]);
    colors.push([1, 1, 0]);
    colors.push([0, 0, 1]);
    colors.push([0, 0, 0]);
    return;
    //*/
    
    /*
    colors.push([0.2, 0.2, 0.2]);
    colors.push([0.3, 0, 0]);
    //colors.push([0.5, 0, 0.25]);
    colors.push([0, 0.5, 0]);
    colors.push([0.6, 0.6, 0]);
    //colors.push([0.5, 0.5, 0.0]);
    
    //colors.push([1, 0.5, 0.0]);
    colors.push([0, 0, 0.9]);
    
    //colors.push([0, 0.5, 0.0]);
    
    return;
    
    //*/
    
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
    /*
    for (var i=0; i<base; i++) {
      var clr = [i/base, i/base, i/base]; 
      colors.push(clr)
    }
    //*/
    
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
      var clr = [0, (base==1?0.68:1.0)*(i+1)/base, 0]; 
      colors.push(clr)
    }
    
    //teal
    for (var i=0; i<base; i++) {
      var clr = [0, (i+1)/base, (i+1)/base]; 
      colors.push(clr)
    }
    
    var key = ""+PAL_COLORS+","+ALLOW_PURPLE+","+(RASTER_MODE==RASTER_MODES.PATTERN);
    
    if (_last_map == undefined || _last_map != key) {
      exports.gen_closest_map();
    }
    
    _last_map = key;
    
    colors_used.length = colors.length;
    for (var i=0; i<colors.length; i++) {
      colors_used[i] = 0;
    }
  }
  
  exports.image_palette = function image_palette(maxcolor) {
    exports.gen_colors();
    
    if (maxcolor == undefined)
      maxcolor = 8;
    
    var cw = _appstate.image.width;
    var ch = _appstate.image.height;
    var idata = _appstate.image.data.data;
    
    var hist = new Int32Array(exports.colors.length);
    hist.fill(0, 0, hist.length);
    var clr = [0, 0, 0];
    
    var dx = ~~(cw/DIMEN);
    var dy = ~~(ch/DIMEN);
    
    dx = dx == 0 ? 1 : dx;
    dy = dy == 0 ? 1 : dy;
    
    //XXX
    dx=dy=4;
    
    var _i=0;
    for (var ix=0; ix<cw; ix += dx) {
      if (_i++ % 50 == 0) {
        console.log("doing column...", ix);
      }
      
      for (var iy=0; iy<ch; iy += dy) {
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
    
    
    var csize = ~~Math.cbrt(maxcolor)+1;
    
    var cube = new Int32Array(csize*csize*csize);
    cube.fill(-1, 0, cube.length);
    
    var nextcube = new Int32Array(csize*csize*csize);
    nextcube.fill(-1, 0, nextcube.length);
    
    function cidx(r, g, b) {
      r = ~~(r*csize);
      g = ~~(g*csize);
      b = ~~(b*csize);
      
      return r*csize*csize + g*csize + b;
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
    
    var newcolors = [];
    
    for (var i=0; i<arr.length; i++) {
      if (newcolors.length >= maxcolor || arr[i][1] == 0) {
        break;
      }
      
      var clr = exports.colors[arr[i][0]];
      var idx = cidx(clr[0], clr[1], clr[2]);
      
      if (cube[idx] >= 0) {
        continue;
      }
      
      newcolors.push(exports.colors[arr[i][0]]);
      cube[idx] = arr[i][0];
    }
    
    exports.colors = colors = newcolors;
    
    for (var i=0; i<colors.length; i++) {
      console.log(colors[i]);
    }
    
    exports.gen_closest_map();
    
    return colors;
  }
  
  var twentyfive7 = Math.pow(25, 7.0);
  
  exports.test_lab_colordis = function() {
    var a = [0.8, 0.7, 0.6];
    var b = [0.75, 0.65, 0.55];
    var c = [0.25, 0.65, 0.85];
    
    a = rgb_to_lab(a[0], a[1], a[2]);
    b = rgb_to_lab(b[0], b[1], b[2]);
    c = rgb_to_lab(c[0], c[1], c[2]);
    
    console.log("a<->b", exports.lab_colordis(a, b), exports.lab_colordis(b, a));
    console.log("a<->c", exports.lab_colordis(a, c), exports.lab_colordis(c, a));
    console.log("b<->c", exports.lab_colordis(b, c), exports.lab_colordis(c, b));
  }
  
  function safe_sqrt(n) {
    return n > 0 ? Math.sqrt(n) : 0;
  }
  
  var lab_colordis = exports.lab_colordis = function lab_colordis(c1, c2) {
    var pow = Math.pow, cos = Math.cos, sin = Math.sin, atan2 = Math.atan2;
    var abs = Math.abs, exp = Math.exp, sqrt = safe_sqrt;
    
    //from wikipedia:
    //
    //https://en.wikipedia.org/wiki/Color_difference#CIEDE2000
    var l1 = c1, l2 = c2;
    
    c1 = lab_to_labch(c1[0], c1[1], c1[2]);
    c2 = lab_to_labch(c2[0], c2[1], c2[2]);
    
    var kL=1.0, kC=1.0, kH=1.0;
    
    var dL = c1[0]-c2[0];
    var L_ = (c1[0]+c2[0])*0.5;
    var C_ = (c1[1]+c2[1])*0.5;
    var C_7 = pow(C_7, 7.0);
    
    var da1 = l1[1] + 0.5*l1[1]*(1.0 - sqrt(C_7 / (C_7 + twentyfive7)));
    var da2 = l2[1] + 0.5*l2[1]*(1.0 - sqrt(C_7 / (C_7 + twentyfive7)));
    var dC1 = sqrt(c1[1]*c1[1] + c1[2]*c1[2]);
    var dC2 = sqrt(c2[1]*c2[1] + c2[2]*c2[2]);
    var dC_ = (dC1 + dC2)*0.5;
    var h1deg = (atan2(l1[1], l1[0])/Math.PI+1.0)*180;
    var h2deg = (atan2(l2[1], l2[0])/Math.PI+1.0)*180;
    var dC = dC2 - dC1;
    
    var dhdeg;
    var hdif = abs(h1deg, h2deg);
    if (hdif < 180) {
      dhdeg = h2deg - h1deg;
    } else if (hdif > 180 && h1deg < h2deg) {
      dhdeg = h2deg - h1deg + 360;
    } else {
      dhdeg = h2deg - h1deg - 360;
    }
    
    var dH = 2*sqrt(dC1*dC2)*sin(Math.PI*(dhdeg*0.5)/180);
    var H_;
    
    if (hdif > 180) {
      H_ = ((h1deg + h2deg + 360)*0.5);
    } else {
      H_ = (h1deg + h2deg)*0.5;
    }
    
    if (dC1 == 0 || dC2 == 0) {
      H_ *= (h1deg + h2deg);
    }
    
    var T = 1.0 - 0.17*cos(Math.PI*(H_-30)/180);
    T += 0.24*cos(Math.PI*(2*H_)/180);
    T += 0.32*cos(Math.PI*(3*H_+6)/180);
    T += -0.20*cos(Math.PI*(4*H_ - 63)/180);
    
    var SL = 1 + (0.015*(L_-50.0)*(L_-50.0))/(sqrt(20 + (L_-50)*(L_-50)));
    var SC = 1 + 0.045*C_;
    var SH = 1 + 0.015*C_*T;
    var RT = -2*sqrt((C_7/(C_7+twentyfive7)));
    RT *= sin(Math.PI*(60*exp(-(H_-275)/25))/180);
    
    var a = (dL/(kL*SL));
    var b = (dC/(kC*SC));
    var c = (dH/(kH*SH));
    var d = RT*(dC/(kC*SC))*(dH/(kH*SH));
    
    var dE00 = sqrt(a*a + b*b + c*c + d);
    return dE00/360.0;
  }
  
  var colordis_not_diffusing = exports.colordis_not_diffusing = function colordis_not_diffusing(c1, c2) {
    return colordis(c1, c2);
    //XXX
    
    var dr = (c1[0]-c2[0]), dg = (c1[1]-c2[1]), db=(c1[2]-c2[2]);
    var dis = dr*dr + dg*dg + db*db;

    var w1 = 0.8;
    var w2 = 0.6;
    var w3 = 0.8;
    
    //w1=w2=w3=1.0;
    
    dis = (Math.abs(dr)*w1 + Math.abs(dg)*w2 + Math.abs(db)*w3)/(w1+w2+w3);
    //dis = dr*dr*w1*w1 + dg*dg*w2*w2 + db*db*w3*w3;
    //dis = dis > 0 ? Math.sqrt(dis) : 0;
    
    //dis = dis == 0.0 ? 0.0 : Math.sqrt(dis)/((w1+w2+w3)*Math.sqrt(3.0));
    
    if (c2[0] == c2[1] && c2[0] == c2[2]) {
      var dis2 = dis != 0.0 ? Math.sqrt(dis) : 0.0; 
      
      dis = 0.5*dis2 + 0.5*dis;
    }
    
    if (DITHER_COLORS) { //small random factor
      dis += (exports.ditherSampler.random()-0.5)*DITHER_RAND_FAC*dis;
      dis = Math.max(dis, 0.0);
    }
    
    return dis;
  }
  
  var colordis = exports.colordis = function colordis(c1, c2) {
    let dis1 = (c1[0]-c2[0])**2 + (c1[1]-c2[1])**2 + (c1[2]-c2[2])**2;
    let dis;
    
    let hsv1 = rgb_to_hsv(c1[0], c1[1], c1[2]);
    let hsv2 = rgb_to_hsv(c2[0], c2[1], c2[2]);
    
    /*
    if (hsv1[1] < 0.3)
      hsv1[1] = Math.pow(hsv1[1], 0.5);
    if (hsv2[1] < 0.3)
      hsv2[1] = Math.pow(hsv1[2], 0.5);
    //*/
    
    c1 = hsv1;
    c2 = hsv2;
    
    //c1 = hsv_to_rgb(hsv1[0], hsv1[1], hsv1[2]);
    //c2 = hsv_to_rgb(hsv2[0], hsv2[1], hsv2[2]);
    
    var dr = (c1[0]-c2[0]), dg = (c1[1]-c2[1]), db=(c1[2]-c2[2]);
    
    var w1 = 1.0;
    var w2 = 1.0;
    var w3 = 1.0;
    
    let wsum = w1+w2+w3;
    //w1 /= wsum;
    //w2 /= wsum;
    //w3 /= wsum;

    dr *= w1;
    dg *= w2;
    db *= w3;
    
    //dis = (Math.abs(dr)*w1 + Math.abs(dg)*w2 + Math.abs(db)*w3)/(w1+w2+w3);
    //dis = Math.abs(dr) + Math.abs(dg) + Math.abs(db);
    dis = Math.sqrt(dr*dr + dg*dg + db*db);
    
    dis = dis*0.0 + dis1*0.75;
    
    //let sat = (Math.abs(dr-dis) + Math.abs(dg-dis) + Math.abs(db-dis))/3.0;
    //dis -= sat*0.4;

    /*
    //compare how saturated (close to greyscale) each color is, too
    let s1=0, s2=0;
    for (let i=0; i<2; i++) {
      let c = i ? c2 : c1;

      let avg = (c[0] + c[1] + c[2])/3.0;
      let sat = Math.sqrt((c[0]-avg)*(c[0]-avg) + (c[1]-avg)*(c[1]-avg) + (c[2]-avg)*(c[2]-avg));

      if (i)
        s2 = sat;
      else
        s1 = sat;
    }
    
    dis += Math.abs(s1-s2)*0.5;
    //*/
    
    /*
    if (c2[0] == c2[1] && c2[0] == c2[2]) {
      var dis2 = dr*dr + dg*dg + db*db;
      dis2 = dis2 != 0.0 ? Math.sqrt(dis2) : 0.0; 
      
      dis = 0.5*dis2 + 0.5*dis;
    }//*/
    
    if (DITHER_COLORS) { //small random factor
      dis += (exports.ditherSampler.random() - 0.5)*DITHER_RAND_FAC;
      //dis = Math.max(dis, 0.0);
    }
  
    return dis;
  }
  
  var _closest_color2_tmp = [0, 0, 0];
  var closest_color2_rets = new util.cachering(function() {
    return [0, 0, 0];
  }, 256);
  
  exports.closest_color2 = function closest_color2(f, c1, nextout, ditherfac) {
    var mindis = undefined;
    var mindis2 = undefined;
    var ret = undefined;
    var ret2 = undefined;
    var c4 = _closest_color2_tmp;
    var mindis = 1e17;
    var ret1 = -1, ret2 = -1;
    
    ditherfac = ditherfac == undefined ? 0.0 : ditherfac;
    
    for (var i=0; i<colors.length; i++) {
      var c2 = colors[i];
      
      for (var j=0; j<colors.length; j++) {
        var c3 = colors[j];

        //if (j == i)
        //    continue;
        
        for (var k=0; k<3; k++) {
          var w = f//c1[k];
          w = w;
          //w *= w*w*w*w;
          w = Math.min(Math.max(w, 0.0), 1.0);
          
          c4[k] = c2[k] + (c3[k] - c2[k])*w;
        }
        
        var dx = Math.abs(c1[0]-c4[0]);
        var dy = Math.abs(c1[1]-c4[1]);
        var dz = Math.abs(c1[2]-c4[2]);
        var dis = dx*dx + dy*dy + dz*dz;
        //dis = dx*0.3 + dy*0.5 + dz*0.2;
        
        var dis = colordis(c1, c4, ditherfac);
        if (isNaN(dis)) throw new Error("nan!");
        
        var dadd = 0.0;//(exports.ditherSampler.random()-0.5)*2.0*ditherfac;
        
        if (dis < mindis + dadd) {
          mindis = dis;
          ret1 = i;
          ret2 = j;
        }
      }
    }
    
    if (ret1 < 0) {
      console.trace("eek in closest_color2!");
      return undefined; //eek!
    }
    
    var ret = closest_color2_rets.next();

    ret[0] = ret1;
    ret[1] = ret2;
    ret[2] = mindis;
    
    return ret;
  }

  var _cwc = [0, 0, 0];
  /*
    on factor;
    off period;
    
    f1 := w1*r1 + w2*r2 + w3*r3 = cr;
    f2 := w1*g1 + w2*g2 + w3*g3 = cg;
    f3 := w1*b1 + w2*b2 + w3*b3 = cb;
    f := solve({f1, f2, f3}, {w1, w2, w3});
    
    part(f, 1, 1, 2);
    part(f, 1, 2, 2);
    
  */
  
  var _cc_tmp1 = new Array();
  var _cc_tmp2 = new Array();

  exports.closest_color_lab = function closest_color_lab(c1, nextout, ditherfac, not_diffusing) {
    var mindis = undefined;
    var mindis2 = undefined, mindis3=undefined, mindis4=undefined, mindis5=undefined;
    var ret = undefined;
    var ret2 = undefined,ret3=undefined,ret4=undefined,ret5=undefined;
    
    ditherfac = ditherfac == undefined ? 0.0 : ditherfac;
    var dfac = ditherfac;
    
    var minret = -1, minretdis = 1e17;
    
    c1 = rgb_to_lab(c1[0], c1[1], c1[2]);
    
    _cc_tmp1.length = lab_colors.length;
    _cc_tmp2.length = lab_colors.length;
    
    for (var i=0; i<lab_colors.length; i++) {
      var c2 = lab_colors[i];
      var dis = lab_colordis(c1, c2);
      
      _cc_tmp1[i] = i;
      _cc_tmp2[i] = dis; // - dfac;
    }
    
    _cc_tmp1.sort((a, b) => _cc_tmp2[a] - _cc_tmp2[b]);
    
    if (nextout) {
      let nlen = Math.min(nextout.length, _cc_tmp1.length);
      
      for (let i=0; i<nlen; i++) {
        nextout[i] = _cc_tmp1[i];
      }
    }
    
    return _cc_tmp1[0];
  }
  
  exports.closest_color = function closest_color(c1, nextout, ditherfac, not_diffusing) {
    var mindis = undefined;
    var mindis2 = undefined, mindis3=undefined, mindis4=undefined, mindis5=undefined;
    var ret = undefined;
    var ret2 = undefined,ret3=undefined,ret4=undefined,ret5=undefined;
    
    ditherfac = ditherfac == undefined ? 0.0 : ditherfac;
    var dfac = ditherfac;
    
    var minret = -1, minretdis = 1e17;

    _cc_tmp1.length = colors.length;
    _cc_tmp2.length = colors.length;
    
    let mini = undefined;

    for (var i=0; i<colors.length; i++) {
      var c2 = colors[i];
      var dis = not_diffusing ? colordis_not_diffusing(c1, c2) : colordis(c1, c2);
      
      dis += -dfac; //dfac != 0.0 ? Math.fract(dis + dfac) : dis;

      if (nextout !== undefined) {
        _cc_tmp1[i] = i;
        _cc_tmp2[i] = dis
      }

      if (mindis === undefined || (dis < mindis && dis > 0)) {
        mindis = dis;
        mini = i;
      }
    }
    
    //don't need fully sorted distance list?
    if (nextout === undefined) {
      return mini;  
    }

    for (let i=0; i<_cc_tmp2.length; i++) {
      //*
      if (_cc_tmp2[i] < 0) {
        _cc_tmp2.pop_i(i);
        _cc_tmp1.pop_i(i);
        i--;
      }//*/
    }
    
    _cc_tmp1.sort((a, b) => _cc_tmp2[a] - _cc_tmp2[b]);
    //_cc_tmp2.sort();

    if (nextout) {
      let nlen = Math.min(nextout.length, _cc_tmp1.length);
      
      for (let i=0; i<nlen; i++) {
        nextout[i] = _cc_tmp1[i];
      }
    }
    
    ditherfac = Math.max(Math.min(ditherfac, 0.999999), 0.0);

    let ci = 0;//~~(ditherfac*Math.min(colors.length, 3.0));
    
    return _cc_tmp1[ci];
  }
  
  var _cwc = [0, 0, 0];
  /*
    on factor;
    off period;
    
    f1 := w1*r1 + w2*r2 + w3*r3 = cr;
    f2 := w1*g1 + w2*g2 + w3*g3 = cg;
    f3 := w1*b1 + w2*b2 + w3*b3 = cb;
    f := solve({f1, f2, f3}, {w1, w2, w3});
    
    part(f, 1, 1, 2);
    part(f, 1, 2, 2);
    
  */
  
  var barycentric_rets = new util.cachering(function() {
    return [0, 0, 0];
  }, 32);
  
  var barycentric = exports.barycentric = function barycentric(c, c1, c2, c3) {
    var r1 = c1[0], g1 = c1[1], b1 = c1[2];
    var r2 = c2[0], g2 = c2[1], b2 = c2[2];
    var r3 = c3[0], g3 = c3[1], b3 = c3[2];
    var cr = c[0], cg = c[1], cb = c[2];
    
    var w1 = ((cg*r3-cr*g3)*b2-(g2*r3-g3*r2)*cb-(cg*r2-cr*g2)*b3)/(0.00001+(g1*
              r3-g3*r1)*b2-(g2*r3-g3*r2)*b1-(g1*r2-g2*r1)*b3);
    var w2 = (-((cg*r3-cr*g3)*b1-(g1*r3-g3*r1)*cb)+(cg*r1-cr*g1)*b3)/(0.00001+(
              g1*r3-g3*r1)*b2-(g2*r3-g3*r2)*b1-(g1*r2-g2*r1)*b3);
    var w3 = ((cg*r2-cr*g2)*b1-(g1*r2-g2*r1)*cb-(cg*r1-cr*g1)*b2)/(0.00001+(g1*
              r3-g3*r1)*b2-(g2*r3-g3*r2)*b1-(g1*r2-g2*r1)*b3);
    
    var ret = barycentric_rets.next();
    
    ret[0] = w1;
    ret[1] = w2;
    ret[2] = w3;
    
    return ret;
  }
  
  var colorweight = exports.colorweight = function colorweight(r, g, b) {
    var wr=0, wg=0, wb=0;
    var c = _cwc, tot=0;
    var ret = new Array(colors.length);
    
    ret.fill(0, 0, ret.length);
    
    c[0] = r;
    c[1] = g;
    c[2] = b;
    
    for (var i=0; i<colors.length; i++) {
      var i1 = (i+colors.length-1) % colors.length;
      var i2 = i, i3 = (i+1) % colors.length;
      
      var c1 = colors[i1];
      var c2 = colors[i2];
      var c3 = colors[i3];
      
      var w = barycentric(c, c1, c2, c3);
      var dis = colordis(c, c2);
      
      var w2 = 1.0 / (dis+0.0001);
      
      //ret[i1] += w[0]*w2;
      ret[i2] += w2*w2*w2;
      //ret[i3] += w[2]*w2;
      
      tot += w2*w2*w2;
    }
    
    //tot=0;
    for (var i=0; i<colors.length; i++) {
      //tot += ret[i];
    }
    
    for (var i=0; i<colors.length; i++) {
      ret[i] /= tot;
    }
    
    var sr=0, sg=0, sb=0;
    for (var i=0; i<colors.length; i++) {
      sr += colors[i][0]*ret[i];
      sg += colors[i][1]*ret[i];
      sb += colors[i][2]*ret[i];
    }
    
    //console.log(sr, sg, sb);
    //console.log(c);
    return ret;
  }
  
  let rgb_to_intensity = exports.rgb_to_intensity = function(r, g, b) {
    //const w1 = 0.8, s2 = 1.0, w3 = 0.6;
    const w1 = 0.4026, w2 = 0.405, w3 = 0.2022;
    return (r*w1 + g*w2 + b*w3) / (w1 + w2 + w3);
  }
  
  return exports;
});

let _sampler = undefined;
define([
    "util", "colors", "const"
], function(util, colors, cconst) {
    "use strict";
    
  let exports = _sampler = {};
  
  exports.fdataToData8 = function(fdata, idata) {
    for (let i=0; i<fdata.length; i += 4) {
      for (let k=0; k<4; k++) {
        let f = fdata[i+k];
        
        /*
        let ix = (i/4) % _appstate.image.width;
        let iy = ~~((i/4) / _appstate.image.width);
        let x = ix / _appstate.image.width;
        let y = iy / _appstate.image.height;

        x = Math.fract(x);

        f = x*0.1+0.17;
        f *= 255;
        
        if (k == 3)
          f = fdata[i+k];

        //f = ~~f;
        //*/

        f += (Math.random()-0.5)*2.0;

        idata[i+k] = ~~f;
      }
    }

    return idata;
  }

  exports.debandImage = function debandImage(image) {
    console.log("Debanding. . .");

    //return image;

    let image2 = exports.downsampleImage(image);
    image2 = exports.blurImage(image2);
    image2 = exports.upsampleImage(image2);
    
    console.log("Done");
    
    let fdata1 = image.fdata, fdata2 = image2.fdata;
  
    for (let i=0; i<fdata2.length; i += 4) {
      let i2 = i/4, ix = i2 % image2.width, iy = ~~(i2 / image2.width);

      let idx1 = (iy*image.width + ix)*4, idx2 = i;

      for (let j=0; j<4; j++) {
        let f = fdata1[idx1+j] + (fdata2[idx2+j] - fdata1[idx1+j])*DEBAND_BLEND;

        /*
        let fract1 = Math.fract(fdata1[idx1+j]);
        let fract2 = Math.fract(fdata2[idx2+j]);
        
        f += fract1 + (fract2 - fract1)*0.75;
        //f = Math.floor(fdata1[idx1+j]) + f;
        
        //*/

        //*
        f /= 255;
        let f2 = f*f*(3.0 - 2.0*f);
        f2 = f2*f2*(3.0 - 2.0*f2);
        f = f + (f2 - f)*0.3;
        f *= 255;
        //*/
        
        f = j == 3 ? fdata2[idx2+j] : f;
        fdata1[idx1+j] = f;
      }
    }

    return {
      width  : image.width,
      height : image.height,
      fdata  : image.fdata
    };
  }
  
  exports.upsampleImage = function upsampleImage(image) {
    let width = image.width<<1, height = image.height<<1;
    
    let fdata = new Float32Array(width*height*4);
    let fdata2 = image.fdata;
    
    for (let i=0; i<fdata.length; i += 4) {
      let i2 = i/4, ix = i2 % image.width, iy = ~~(i2 / image.width);
      
      let ix2 = Math.min(ix+1, image.width-1), iy2 = Math.min(iy, image.height-1);
      let i3 = (iy2*image.width + ix2)*4;
      
      ix2 = Math.min(ix, image.width-1), iy2 = Math.min(iy+1, image.height-1);
      let i4 = (iy2*image.width + ix2)*4;

      ix2 = Math.min(ix+1, image.width-1), iy2 = Math.min(iy+1, image.height-1);
      let i5 = (iy2*image.width + ix2)*4;
      
      for (let j=0; j<4; j++) {
        let jx = j % 2, jy = ~~(j / 2);
        let ix2 = 2*ix + jx, iy2 = 2*iy + jy;
        let idx = (iy2*width + ix2)*4;
        
        let u = jx*0.5, v = jy*0.5;
        
        for (let k=0; k<4; k++) {
          let a = fdata2[i+k] + (fdata2[i3+k] - fdata2[i+k])*u;
          let b = fdata2[i4+k] + (fdata2[i5+k] - fdata2[i4+k])*u;
          
          fdata[idx+k] = a + (b - a)*v;
        }
      }
    }
    
    return {
      width  : width,
      height : height,
      fdata  : fdata
    };
  }
  
  exports.downsampleImage = function downsampleImage(image) {
    let width = image.width>>1, height = image.height>>1;
    
    let fdata = new Float32Array(width*height*4);
    let idata = image.fdata !== undefined ? image.fdata : image.data;
    
    for (let i=0; i<fdata.length; i += 4) {
      let i2 = i/4, ix = i2 % width, iy = ~~(i2 / width);
      
      fdata[i] = fdata[i+1] = fdata[i+2] = fdata[i+3] = 0.0;

      for (let j=0; j<4; j++) {
        let ix2 = 2*ix + (j % 2), iy2 = 2*iy + ~~(j / 2);
        let idx = (iy2*image.width + ix2)*4;
        
        for (let k=0; k<4; k++) {
          fdata[i+k] += idata[idx+k];
        }
      }
      
      fdata[i] /= 4;
      fdata[i+1] /= 4;
      fdata[i+2] /= 4;
      fdata[i+3] /= 4;      
    }
    
    return {
      width  : width,
      height : height,
      fdata : fdata
    };
  }
  
  exports.blurImage = function blurImage(image) {
    let fdata = new Float32Array(image.width*image.height*4);
    let idata = image.fdata !== undefined ? image.fdata : image.data;
    let width = image.width, height = image.height;

    let ilen = width*height*4;
    for (let i=0; i<ilen; i++) {
      fdata[i] = idata[i];
    }
    
    let msize = DEBAND_RADIUS;

    let sumr = 0, sumg=0, sumb=0;
    
    //copy fdata
    let fdata2 = fdata.slice(0, fdata.length);

    for (let step3=0; step3<2; step3++) {
      for (let step2=0; step2<2; step2++) {
        let step = step3;
        let ylen = step ? width : height;

        for (let iy=0; iy<ylen; iy++) {
          let xlen = step ? height : width;
          
          //xlen = xlen>>1;
          
          sumr = sumg = sumb = 0;
          for (let ix2=0; ix2 < xlen+(msize>>1); ix2++) {
            let ix = Math.min(ix2, xlen-1);
            let i;

            if (step)
              i = (ix*width + iy)*4;
            else
              i = (iy*width + ix)*4;

            let ix3 = Math.min(ix2 - msize, xlen-1);
            if (ix3 >= 0) {
              let i2;

              if (step)
                i2 = (ix3*width + iy)*4;
              else
                i2 = (iy*width + ix3)*4;

              sumr -= fdata2[i2];
              sumg -= fdata2[i2+1];
              sumb -= fdata2[i2+2];
            }

            sumr += fdata2[i];
            sumg += fdata2[i+1];
            sumb += fdata2[i+2];
            
            let msize2 = Math.min(ix, msize>>1);
            
            ix3 = Math.min(ix2-msize2, xlen-1);
            if (1) {//ix2 >= msize2 && ix2 < xlen) {
              let i2;
              //*
              if (step)
                i2 = (ix3*width + iy)*4;
              else
                i2 = (iy*width + ix3)*4;
              
              //*/
              //i2 = i;

              let div = Math.min(ix2+1, msize);
              let t = 1;

              fdata[i2] += (sumr / div - fdata[i2])*t;
              fdata[i2+1] += (sumg / div - fdata[i2+1])*t;
              fdata[i2+2] += (sumb / div - fdata[i2+2])*t;
            }
          }
        }
        
        for (let i=0; i<fdata.length; i++) {
          fdata2[i] = fdata[i];
        }
      }
    }

    return {
      width  : image.width,
      height : image.height,
      fdata  : fdata
    }
  }
 
  var min = Math.min, max = Math.max, sqrt = Math.sqrt;
  var fract = Math.fract, tent = Math.tend, pow = Math.pow;
  
  var sampler_ret = [0, 0, 0, 0];
  var one255 = 1.0/255.0;
  
  var lab_to_rgb = colors.lab_to_rgb;
  var rgb_to_lab = colors.rgb_to_lab;
  
  let sampler_rets = new util.cachering(() => [0, 0, 0, 0], 512);
  
  exports.sampler = function sampler(x, y, size, rad, no_filter, use_debanded) {
    var img = _appstate.image;
    let ret;
    
    /*
    ret = sampler_rets.next();
    let f = Math.sqrt(x*x + y*y)/Math.sqrt(2);
    f = f*0.5 + 0.5;
    
    f = Math.floor(f*255)/255;

    ret[0] = ret[1] = ret[2] = f;
    ret[3] = 1.0;
    return ret;
    //*/
    
    var asp = img.width / img.height;
    
    x = (x*0.5)+0.5;
    y = (y*0.5)+0.5;
    
    /*
    sampler_ret[0] = sampler_ret[1] = sampler_ret[2] = 0;
    sampler_ret[3] = 1;
    
    //return colors.lab_to_rgb(100, 0, -80);
    sampler_ret[0] = 0;
    sampler_ret[1] = 2;
    sampler_ret[2] = 0.8;
    return sampler_ret;//*/
    
    //var use_lab = x > 0.5;
    //use_lab = use_lab && (SHARPEN_LUMINENCE||USE_LAB);
    
    var use_lab = (SHARPEN_LUMINENCE||USE_LAB);
    
    x = min(max(x, 0.0), 0.99999999);
    y = min(max(y, 0.0), 0.99999999);
    
    if (asp > 1.0) {
      y *= asp;
    } else {
      x /= asp;
    }
    
    var sum = 0.0;
    var tot = 0.0;
    
    if (NO_IMAGE_FILTER)
      no_filter=1;
    
    let pdata = (use_debanded && img.fdata !== undefined) ? img.fdata : img.data.data;
    
    if (no_filter) {
      var ix = ~~(x*img.width);
      var iy = ~~(y*img.height);
      ret = sampler_rets.next();
      
      if (ix < 0 || iy < 0 || ix >= img.width || iy >= img.height) {
        //discard sample if out of image bounds
        ret[0] = ret[1] = ret[2] = ret[3] = -1;
        return ret;
      }
      
      var idx = ~~((iy*img.width+ix)*4);
      var a = pdata[idx+3]*one255;
      
      if (a < 0.05) {
        //discard sample if on transparent pixel
        ret[0] = ret[1] = ret[2] = ret[3] = -1;
        return ret;
      }
      
      ret[0] = pdata[idx]*one255;
      ret[1] = pdata[idx+1]*one255;
      ret[2] = pdata[idx+2]*one255;
      ret[3] = pdata[idx+3]*one255;
      
      ret[0] = TONE_CURVE.evaluate(ret[0]);
      ret[1] = TONE_CURVE.evaluate(ret[1]);
      ret[2] = TONE_CURVE.evaluate(ret[2]);
      
      return ret;
    }
    
    var filterw = img.width/_appstate.bluenoise.gridsize;
    var filterh = img.height/_appstate.bluenoise.gridsize;
    var filter = Math.max(filterw*0.5, filterh*0.5)*1.5+2;
    
    if (isNaN(filter)) {
      //throw new Error("'filter' was NaN in sampler!");
      console.log("EEEK! 'filter' was NaN in sampler!", img.width, img.height,
                  _appstate.bluenoise.gridsize);
    }
    
    //filter = isNaN(filter) ? 3.0 : filter;
    
    var fwid = Math.ceil(filter);
    fwid = Math.max(fwid, 4.0);
    
    if (no_filter) {
      totsample = 3;
      fwid = 1;
      filter = 1.0;
    } else if (!SHARPEN) {
      fwid = 1;
      filter = 1;
      totsample = 1;
    }
    
    var totsample=fwid*fwid;
    var totsampled = 0;
    
    var sumr=0, sumg=0, sumb=0, suma=0;
    var totr=0, totg=0, totb=0, tota=0;
    
    window._totsample = totsample;
    
    var weights = cconst.get_sharpen_filter(fwid, SHARPNESS), weights2;
    if (use_lab) {
      weights2 = cconst.get_sharpen_filter(fwid, 0.45);
    }
    
    for (var i=0; i<totsample; i++) {
      var fwid2 = fwid == 1 ? 1 : fwid-1;
      var xoff = ((i) % fwid)/fwid2;
      var yoff = (~~((i)/fwid))/fwid2;
      
      xoff -= 0.5;
      yoff -= 0.5;
      
      var w = weights[i];
      
      xoff *= filter*(1.0/img.width);
      yoff *= filter*(1.0/img.height);
      
      var x2 = x+xoff;
      var y2 = y+yoff;
      
      if (x2 < 0 || x2 >= 1.0) {
        continue;
      }
      if (y2 < 0 || y2 >= 1.0) {
        continue;
      }
      
      totsampled++;
      
      var ix = ~~(x2*img.width);
      var iy = ~~(y2*img.height);
      
      var idx = (iy*img.width+ix)*4;
      
      var r = (pdata[idx]/255);
      var g = (pdata[idx+1]/255);
      var b = (pdata[idx+2]/255);
      var a = 1.0-(pdata[idx+3]/255);
      
      r = TONE_CURVE.evaluate(r);
      g = TONE_CURVE.evaluate(g);
      b = TONE_CURVE.evaluate(b);
      
      //un-srgb
      
      if (use_lab) {
        var lab = rgb_to_lab(r, g, b);
        r = lab[0], g = lab[1], b = lab[2];
      }
      
      //two options: either blend color with white using alpha,
      //or multiply with alpha;
      
      //blend with white?
      /*
      r += (1.0 - r)*a;
      g += (1.0 - g)*a;
      b += (1.0 - b)*a;
      //*/
      
      //mul with alpha.  we're assuming they're not already premul
      if (use_lab) {
        r *= 1.0 - a;
      } else {
        r *= 1.0-a;
        g *= 1.0-a;
        b *= 1.0-a;
      }
      
      if (a > 0.05) {
        ret = sampler_rets.next();
        ret[0] = -1;
        
        return ret;
      }
      
      var w2 = (use_lab && SHARPEN_LUMINENCE) ? weights2[i] : w;
      //w=w2=1;
      
      if (totsample == 1) {
        w = w2 = 1.0;
      }
      
      sumr += r*w;
      sumg += g*w2;
      sumb += b*w2;
      suma += a*w;
      
      totr += w;
      totg += w2;
      totb += w2;
      tota += w;
      
      //break;
    }
    
    if (!totsampled) {
      ret = sampler_rets.next();
      ret[0] = -1;
      
      return ret; //discard
    }
    
    sumr /= totr != 0.0 ? totr : 1.0;
    sumg /= totg != 0.0 ? totg : 1.0;
    sumb /= totb != 0.0 ? totb : 1.0;
    suma /= tota != 0.0 ? tota : 1.0;
    
    if (use_lab) {
      var rgb = lab_to_rgb(sumr, sumg, sumb);
      
      sumr = rgb[0];
      sumg = rgb[1];
      sumb = rgb[2];
    }

    ret = sampler_rets.next();
    
    ret[0] = Math.min(Math.max(sumr, 0.0), 1.0);
    ret[1] = Math.min(Math.max(sumg, 0.0), 1.0);
    ret[2] = Math.min(Math.max(sumb, 0.0), 1.0);
    ret[3] = Math.min(Math.max(suma, 0.0), 1.0);
    
    return ret;
  }
  
  return exports;
});

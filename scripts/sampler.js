let _sampler = undefined;
define([
  "util", "colors", "const", "vectormath"
], function (util, colors, cconst, vectormath) {
  "use strict";

  let exports = _sampler = {};

  exports.fdataToInternal = function (fdata) {
    let rgb_to_internal = colors.rgb_to_internal;
    let inv = 1.0/255.0;

    for (let i = 0; i < fdata.length; i += 4) {
      let c = rgb_to_internal(fdata[i]*inv, fdata[i + 1]*inv, fdata[i + 2]*inv);

      //c[0] = fdata[i]*inv;
      //c[1] = fdata[i+1]*inv;
      //c[2] = fdata[i+2]*inv;

      fdata[i + 0] = c[0]*255;
      fdata[i + 1] = c[1]*255;
      fdata[i + 2] = c[2]*255;
    }
  }

  exports.fdataFromInternal = function (fdata) {
    let internal_to_rgb = colors.internal_to_rgb;
    let inv = 1.0/255.0;

    for (let i = 0; i < fdata.length; i += 4) {
      let c = internal_to_rgb(fdata[i]*inv, fdata[i + 1]*inv, fdata[i + 2]*inv);

      fdata[i + 0] = c[0]*255;
      fdata[i + 1] = c[1]*255;
      fdata[i + 2] = c[2]*255;
    }
  }

  let Histogram = exports.Histogram = class Histogram extends Array {
    constructor(size = 256) {
      super();
      this.length = size;

      this.fill(0, 0, this.length);
    }

    reset() {
      this.fill(0, 0, this.length);
      return this;
    }

    add(f, weight = 1) {
      f = Math.min(Math.max(f, 0.0), 1.0)*0.99999999;
      let fi = ~~(f*this.length);

      this[fi] += weight;
    }

    finish() {
      //non-cumulative distribution function
      this.df = this.slice(0, this.length);

      for (let i = 1; i < this.length; i++) {
        this[i] += this[i - 1];
      }
    }

    calcIntensity(r, g, b) {
      return (r+g+b)/3.0;
      //return colors.xyz_to_intensity(r, g, b);

      /*
      let avg = (r+g+b)/3.0;
      let sat = Math.sqrt((r-avg)*(r-avg) + (g-avg)*(g-avg) + (b-avg)*(b-avg))/1.5;
      
      let w1 = 0.9, w2 = 0.5, w3 = 0.4;
      
      let colorf = (r*w1 + g*w2 + b*w3) / (w1 + w2 + w3);
      
      sat = Math.min(Math.max(sat, 0.0), 0.99999);
      sat = 1.0 - Math.pow(1.0 - sat, 4.0);
      
      //return colorf;
      return avg + (colorf - avg) * sat;
      
      //return Math.sqrt(r*r +  g*g + b*b) / Math.sqrt(3.0);//*/
    }

    doImage(image) {
      let fdata = image.fdata !== undefined ? image.fdata : image.data;

      for (let i = 0; i < fdata.length; i += 4) {
        let r = fdata[i], g = fdata[i + 1], b = fdata[i + 2], a = fdata[i + 3];

        if (a === 0.0) {
          continue;
        }

        r /= 255;
        g /= 255;
        b /= 255;

        let f = this.calcIntensity(r, g, b);

        this.add(f, a/255);
      }

      // try to corret for large areas of one shade
      //*
      let tot = 0.0;
      let max = 0.0;
      for (let i = 0; i < this.length; i++) {
        tot += this[i];
        max = Math.max(max, this[i]);
      }

      if (tot > 0) {
        for (let i = 0; i < this.length; i++) {
          let f = Math.abs(this[i] - tot);

          if (f > 0) {
            this[i] *= Math.pow(1.0 - this[i]/tot, 5.0);
          }
        }
      }
      //*/

      this.finish();
    }

    draw(canvas, g) {
      g.save();

      let x = 20, y = 140;
      let w = 500, h = 200;

      g.strokeStyle = "grey";

      g.beginPath();
      g.rect(x, y, w, h);
      g.stroke();

      let max = this[this.length - 1];
      if (max === 0.0) {
        return;
      }

      g.lineWidth *= 2;
      g.strokeStyle = "orange";

      g.beginPath();

      for (let i = 0; i < this.length; i++) {
        let x2 = x + (i/this.length)*w;
        let y2 = y + (1.0 - this[i]/max)*h;

        if (i === 0)
          g.moveTo(x2, y2);
        else
          g.lineTo(x2, y2);
      }
      g.stroke();
      g.restore();
    }
  }

  exports.histEqualize = function histEqualize(image) {
    for (let i = 0; i < 4; i++) {
      let {image2, err} = exports.histEqualize_intern(image, 0.4);

      image = image2;

      if (Math.abs(err) < 0.01) {
        break;
      }
    }

    return image;
  }

  exports.histEqualize_intern = function histEqualize_intern(image, factor) {
    image = Object.assign({}, image);

    if (image.fdata === undefined)
      image.fdata = new Float32Array(image.data);

    image.fdata = new Float32Array(image.fdata);

    let inv = 1.0 / 255.0;

    let fdata = image.fdata;
    for (let i=0; i<fdata.length; i += 4) {
      let r = fdata[i]*inv, g = fdata[i+1]*inv, b = fdata[i+2]*inv;

      let c = colors.internal_to_rgb(r, g, b);
      c = colors.rgb_to_xyz(c[0], c[1], c[2]);

      fdata[i] = c[0]*255;
      fdata[i+1] = c[1]*255;
      fdata[i+2] = c[2]*255;
    }

    let hist = new Histogram();

    hist.reset();
    hist.doImage(image);

    let max = hist[hist.length - 1];
    if (max === 0.0) {
      return;
    }

    let fdata2 = new Float32Array(fdata.length);
    fdata2.set(fdata);

    let err = 0.0;

    let c = [0, 0, 0];

    for (let i = 0; i < fdata.length; i += 4) {
      let r = fdata[i]*inv, g = fdata[i + 1]*inv, b = fdata[i + 2]*inv;
      let a = fdata[i + 3]*inv;

      if (a === 0.0)
        continue;

      //let c = colors.internal_to_rgb(r, g, b);
      let f = hist.calcIntensity(r, g, b);
      //let f = colors.xyz_to_intensity(r, g, b);
      //let f = (r+g+b)/3.0;

      c[0] = r;
      c[1] = g;
      c[2] = b;

      f = Math.min(Math.max(f, 0.0), 1.0)*0.9999999;

      let fi = ~~(f*hist.length);
      let hf = hist[fi]/max;
      let hgoal = fi / hist.length;

      hgoal = hgoal**0.5;

      let off = hf - hgoal;

      if (1) {
        let fac = 1.0 + off*3.0*factor * (2.0-fi/hist.length);

        c[0] *= fac;
        c[1] *= fac;
        c[2] *= fac;

        /*
        fac = off*factor*0.05*(2.0-fi/hist.length+1);
        c[0] += fac;
        c[1] += fac;
        c[2] += fac;
        //*/
      } else {
        let fac = off*factor;// * (2.0-fi/hist.length+1);
        c[0] += fac;
        c[1] += fac;
        c[2] += fac;
      }

      for (let j=0; j<3; j++) {
        c[j] = Math.min(Math.max(c[j], 0.0), 1.0);
      }

      c = colors.xyz_to_rgb(c[0], c[1], c[2]);
      c = colors.rgb_to_internal(c[0], c[1], c[2]);

      fdata2[i] = c[0]*255;
      fdata2[i + 1] = c[1]*255;
      fdata2[i + 2] = c[2]*255;

      err += Math.abs(off);
    }

    err /= (fdata.length/4);
    console.log("hist error:", err.toFixed(4));

    return {
      image2: {
        width : image.width,
        heigth: image.height,
        fdata : fdata2
      },
      err
    };
  }

  exports.fdataToData8 = function (fdata, idata) {
    let inv = 1.0/255;
    let internal_to_rgb = colors.internal_to_rgb;

    for (let i = 0; i < fdata.length; i += 4) {
      let r = (fdata[i + 0] + (Math.random() - 0.5)*2.0)*inv;
      let g = (fdata[i + 1] + (Math.random() - 0.5)*2.0)*inv;
      let b = (fdata[i + 2] + (Math.random() - 0.5)*2.0)*inv;

      //r = Math.min(Math.max(r, 0.0), 1.0)*255;
      //g = Math.min(Math.max(g, 0.0), 1.0)*255;
      //b = Math.min(Math.max(b, 0.0), 1.0)*255;

      if (!SHOW_RAW_IMAGE) {
        let c = internal_to_rgb(r, g, b);
        r = c[0];
        g = c[1];
        b = c[2];
      }

      let a = fdata[i + 3] + (Math.random() - 0.5)*2.0;
      a = Math.min(Math.max(a, 0.0), 255.0);

      idata[i + 0] = ~~(r*255);
      idata[i + 1] = ~~(g*255);
      idata[i + 2] = ~~(b*255);
      idata[i + 3] = ~~a;
    }

    return idata;
  }

  exports.debandImage = function debandImage(image) {
    console.log("Debanding. . .");

    //return image;

    let downSteps = Math.floor(image.width/2048);
    let image2 = image;

    console.log("downSteps", downSteps);

    console.log("Downsampling");
    for (let i = 0; i < downSteps; i++) {
      image2 = exports.downsampleImage(image2);
    }

    console.log("Blurring");
    image2 = exports.blurImage(image2);

    console.log("Upscaling");
    //for (let i=0; i<downSteps; i++) {
    if (downSteps > 0)
      image2 = exports.upsampleImage(image2, 1<<downSteps);
    //}

    console.log("Done");

    let fdata1 = image.fdata, fdata2 = image2.fdata;

    for (let i = 0; i < fdata2.length; i += 4) {
      let i2 = i/4, ix = i2%image2.width, iy = ~~(i2/image2.width);

      let idx1 = (iy*image.width + ix)*4, idx2 = i;

      for (let j = 0; j < 4; j++) {
        let f = fdata1[idx1 + j] + (fdata2[idx2 + j] - fdata1[idx1 + j])*DEBAND_BLEND;

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

        f = j === 3 ? fdata2[idx2 + j] : f;
        fdata1[idx1 + j] = f;
      }
    }

    return {
      width : image.width,
      height: image.height,
      fdata : image.fdata
    };
  }

  exports.upsampleImage = function upsampleImage(image, factor = 2) {
    let width = ~~(image.width*factor), height = ~~(image.height*factor);

    let fdata = new Float32Array((width*height)<<2);
    let fdata2 = image.fdata;

    let width2 = image.width, height2 = image.height;

    for (let i = 0; i < fdata2.length; i += 4) {
      let i2 = i/4, ix = i2%width2, iy = ~~(i2/width2);

      let ix2 = Math.min(ix + 1, width2 - 1), iy2 = Math.min(iy, height2 - 1);
      let i3 = (iy2*width2 + ix2)<<2;

      ix2 = Math.min(ix, width2 - 1), iy2 = Math.min(iy + 1, height2 - 1);
      let i4 = (iy2*width2 + ix2)<<2;

      ix2 = Math.min(ix + 1, width2 - 1), iy2 = Math.min(iy + 1, height2 - 1);
      let i5 = (iy2*width2 + ix2)<<2;

      let jlen = ~~(factor*factor);

      for (let j = 0; j < jlen; j++) {
        let jx = ~~(j%factor), jy = ~~(j/factor);
        let ix3 = ~~(factor*ix + jx), iy3 = ~~(factor*iy + jy);
        let idx = ~~((iy3*width + ix3)<<2);

        let u = jx/factor, v = jy/factor;

        for (let k = 0; k < 4; k++) {
          let a = fdata2[i + k] + (fdata2[i3 + k] - fdata2[i + k])*u;
          let b = fdata2[i4 + k] + (fdata2[i5 + k] - fdata2[i4 + k])*u;

          fdata[idx + k] = a + (b - a)*v;
        }
      }
    }

    return {
      width : width,
      height: height,
      fdata : fdata
    };
  }

  exports.downsampleImage = function downsampleImage(image) {
    let width = image.width>>1, height = image.height>>1;

    let fdata = new Float32Array(width*height*4);
    let idata = image.fdata !== undefined ? image.fdata : image.data;

    for (let i = 0; i < fdata.length; i += 4) {
      let i2 = i/4, ix = i2%width, iy = ~~(i2/width);

      fdata[i] = fdata[i + 1] = fdata[i + 2] = fdata[i + 3] = 0.0;

      for (let j = 0; j < 4; j++) {
        let ix2 = 2*ix + (j%2), iy2 = 2*iy + ~~(j/2);
        let idx = (iy2*image.width + ix2)*4;

        for (let k = 0; k < 4; k++) {
          fdata[i + k] += idata[idx + k];
        }
      }

      fdata[i] /= 4;
      fdata[i + 1] /= 4;
      fdata[i + 2] /= 4;
      fdata[i + 3] /= 4;
    }

    return {
      width : width,
      height: height,
      fdata : fdata
    };
  }

  exports.copyImage = function (image) {
    let image2;

    if (image instanceof ImageData) {
      image2 = new ImageData(image.width, image.height);
    } else {
      image2 = {
        width: image.width, height: image.height, data: undefined, fdata: undefined
      };

      image2.data = new Uint8Array(image.width*image.height*4);
      image2.data.set(image.data);
    }

    if (image.fdata) {
      image2.fdata = new Float64Array(image.width*image.height*4);
      image2.fdata.set(image.fdata);
    }

    image2.data.set(image.data);

    return image2;
  }

  exports.blurImage = function blurImage(image) {
    let fdata = new Float32Array(image.width*image.height*4);
    let idata = image.fdata !== undefined ? image.fdata : image.data;
    let width = image.width, height = image.height;

    let ilen = width*height*4;
    for (let i = 0; i < ilen; i++) {
      fdata[i] = idata[i];
    }

    let msize = DEBAND_RADIUS;

    let sumr = 0, sumg = 0, sumb = 0;

    //copy fdata
    let fdata2 = fdata.slice(0, fdata.length);

    for (let step3 = 0; step3 < 2; step3++) {
      for (let step2 = 0; step2 < 2; step2++) {
        let step = step3;
        let ylen = step ? width : height;

        for (let iy = 0; iy < ylen; iy++) {
          let xlen = step ? height : width;

          //xlen = xlen>>1;

          sumr = sumg = sumb = 0;
          for (let ix2 = 0; ix2 < xlen + (msize>>1); ix2++) {
            let ix = Math.min(ix2, xlen - 1);
            let i;

            if (step)
              i = (ix*width + iy)*4;
            else
              i = (iy*width + ix)*4;

            let ix3 = Math.min(ix2 - msize, xlen - 1);
            if (ix3 >= 0) {
              let i2;

              if (step)
                i2 = (ix3*width + iy)*4;
              else
                i2 = (iy*width + ix3)*4;

              sumr -= fdata2[i2];
              sumg -= fdata2[i2 + 1];
              sumb -= fdata2[i2 + 2];
            }

            sumr += fdata2[i];
            sumg += fdata2[i + 1];
            sumb += fdata2[i + 2];

            let msize2 = Math.min(ix, msize>>1);

            ix3 = Math.min(ix2 - msize2, xlen - 1);
            if (1) {//ix2 >= msize2 && ix2 < xlen) {
              let i2;
              //*
              if (step)
                i2 = (ix3*width + iy)*4;
              else
                i2 = (iy*width + ix3)*4;

              //*/
              //i2 = i;

              let div = Math.min(ix2 + 1, msize);
              let t = 1;

              fdata[i2] += (sumr/div - fdata[i2])*t;
              fdata[i2 + 1] += (sumg/div - fdata[i2 + 1])*t;
              fdata[i2 + 2] += (sumb/div - fdata[i2 + 2])*t;
            }
          }
        }

        for (let i = 0; i < fdata.length; i++) {
          fdata2[i] = fdata[i];
        }
      }
    }

    return {
      width : image.width,
      height: image.height,
      fdata : fdata
    }
  }

  let min = Math.min, max = Math.max, sqrt = Math.sqrt;
  let fract = Math.fract, tent = Math.tend, pow = Math.pow;

  let sampler_ret = [0, 0, 0, 0];
  let one255 = 1.0/255.0;

  let lab_to_rgb = colors.lab_to_rgb;
  let rgb_to_lab = colors.rgb_to_lab;

  let sampler_rets = new util.cachering(() => [0, 0, 0, 0], 512);

  exports.sampler = function sampler(x, y, size, rad, no_filter, use_debanded) {
    let img = use_debanded ? _appstate.bluenoise.dvimage : _appstate.image.data;
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

    let asp = img.width/img.height;

    x = (x*0.5) + 0.5;
    y = (y*0.5) + 0.5;

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

    const sharpen_lumin = SHARPEN_LUMINENCE && colors.internal_to_rgb === colors.lab_to_rgb;

    x = min(max(x, 0.0), 0.99999999);
    y = min(max(y, 0.0), 0.99999999);

    if (asp > 1.0) {
      y *= asp;
    } else {
      x /= asp;
    }

    let sum = 0.0;
    let tot = 0.0;

    if (NO_IMAGE_FILTER)
      no_filter = 1;

    let pdata = img.fdata ? img.fdata : img.data;

    if (no_filter) {
      let ix = ~~(x*img.width);
      let iy = ~~(y*img.height);
      ret = sampler_rets.next();

      if (ix < 0 || iy < 0 || ix >= img.width || iy >= img.height) {
        //discard sample if out of image bounds
        ret[0] = ret[1] = ret[2] = ret[3] = -1;
        return ret;
      }

      let idx = ~~((iy*img.width + ix)*4);
      let a = pdata[idx + 3]*one255;

      if (a < 0.05) {
        //discard sample if on transparent pixel
        ret[0] = ret[1] = ret[2] = ret[3] = -1;
        return ret;
      }

      ret[0] = pdata[idx]*one255;
      ret[1] = pdata[idx + 1]*one255;
      ret[2] = pdata[idx + 2]*one255;
      ret[3] = pdata[idx + 3]*one255;

      ret[0] = TONE_CURVE.evaluate(ret[0]);
      ret[1] = TONE_CURVE.evaluate(ret[1]);
      ret[2] = TONE_CURVE.evaluate(ret[2]);

      return ret;
    }

    let filterw = img.width/_appstate.bluenoise.gridsize;
    let filterh = img.height/_appstate.bluenoise.gridsize;
    let filter = Math.max(filterw*0.5, filterh*0.5)*1.5 + 2;

    if (isNaN(filter)) {
      //throw new Error("'filter' was NaN in sampler!");
      console.log("EEEK! 'filter' was NaN in sampler!", img.width, img.height,
        _appstate.bluenoise.gridsize);
    }

    //filter = isNaN(filter) ? 3.0 : filter;

    let fwid = Math.ceil(filter);
    fwid = Math.max(fwid, 4.0);

    if (no_filter) {
      fwid = 1;
      filter = 1.0;
    } else if (!SHARPEN) {
      fwid = 1;
      filter = 1;
    }

    let totsample = fwid*fwid;
    let totsampled = 0;

    let sumr = 0, sumg = 0, sumb = 0, suma = 0;
    let totr = 0, totg = 0, totb = 0, tota = 0;

    window._totsample = totsample;

    let weights = cconst.get_sharpen_filter(fwid, SHARPNESS), weights2;

    if (sharpen_lumin) {
      weights2 = cconst.get_sharpen_filter(fwid, 0.45);
    }

    for (var i = 0; i < totsample; i++) {
      let fwid2 = fwid === 1 ? 1 : fwid - 1;
      let xoff = ((i)%fwid)/fwid2;
      let yoff = (~~((i)/fwid))/fwid2;

      xoff -= 0.5;
      yoff -= 0.5;

      let w = weights[i];

      xoff *= filter*(1.0/img.width);
      yoff *= filter*(1.0/img.height);

      let x2 = x + xoff;
      let y2 = y + yoff;

      x2 = Math.min(Math.max(x2, 0.0), 0.99999);
      y2 = Math.min(Math.max(y2, 0.0), 0.99999);

      totsampled++;

      let ix = ~~(x2*img.width);
      let iy = ~~(y2*img.height);

      let idx = (iy*img.width + ix)*4;

      let r = (pdata[idx]/255);
      let g = (pdata[idx + 1]/255);
      let b = (pdata[idx + 2]/255);
      let a = 1.0 - (pdata[idx + 3]/255);

      r = TONE_CURVE.evaluate(r);
      g = TONE_CURVE.evaluate(g);
      b = TONE_CURVE.evaluate(b);

      //two options: either blend color with white using alpha,
      //or multiply with alpha;

      //blend with white?
      /*
      r += (1.0 - r)*a;
      g += (1.0 - g)*a;
      b += (1.0 - b)*a;
      //*/

      //mul with alpha.  we're assuming they're not already premul
      r *= 1.0 - a;
      if (!USE_LAB) {
        g *= 1.0 - a;
        b *= 1.0 - a;
      }

      if (a > 0.05) {
        ret = sampler_rets.next();
        ret[0] = -1;

        return ret;
      }

      if (totsample === 1) {
        w = 1.0;
      }

      let w2 = sharpen_lumin ? weights2[i] : w;

      sumr += r*w;
      sumg += g*w2;
      sumb += b*w2;
      suma += a*w2;

      //break;
    }

    if (!totsampled) {
      ret = sampler_rets.next();
      ret[0] = -1;

      return ret; //discard
    }

    ret = sampler_rets.next();

    /*
    ret[0] = sumr;
    ret[1] = sumg;
    ret[2] = sumb;
    ret[3] = suma;
    //*/

    //*
    ret[0] = Math.min(Math.max(sumr, 0.0), 1.0);
    ret[1] = Math.min(Math.max(sumg, 0.0), 1.0);
    ret[2] = Math.min(Math.max(sumb, 0.0), 1.0);
    ret[3] = Math.min(Math.max(suma, 0.0), 1.0);
    //*/
    return ret;
  }

  return exports;
});

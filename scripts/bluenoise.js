
var _bluenoise = undefined; 
define([
  'util', 'const', 'draw', 'colors', 'diffusion', 'delaunay', 
  'kdtree', 'kdtree2', 'smoothmask', "indexdb_store", "smoothmask_file",
  "sampler"
], function(util, cconst, draw, colors, diffusion,
            delaunay, kdtree, kdtree2, smoothmask, indexdb_store, 
            smoothmask_file, sampler) {
  "use strict";
  
  var exports = _bluenoise = {};
  var Class = util.Class;
  
  var rot_rets = new util.cachering(function() {
    return [0, 0];
  }, 256);
  
  function rot(x, y, th) {
    var ret = rot_rets.next();
    
    var sinth = Math.sin(th);
    var costh = Math.cos(th);
    
    ret[0] = costh*x - sinth*y;
    ret[1] = costh*y + sinth*x;
    
    return ret;
  }
  window.rot = rot;
  
  class InnerLoopArg {
        constructor() {
              this.x = this.y = this.offx = this.offy = this.ix = this.iy = 0.0;
        }

        load(x, y, ix, iy, offx, offy) {
              this.x = x;
              this.y = y;
              this.ix = ix;
              this.iy = iy;
              this.offx = offx;
              this.offy = offy;

              return this;
        }
  }
  
  var BlueNoise = exports.BlueNoise = Class([
    function constructor() {
      this.points = [];
      this.inner_loop_cachering = util.cachering.fromConstructor(InnerLoopArg, 64);

      this.errgrid = undefined;
      this.mask = undefined;
      
      //error diffusion filter
      this.filter = diffusion.basic_filter();
      
      this.cur = 0;
      this.gridsize = this.celldim = undefined;
      this.sampler = undefined;
      
      this.r = this.start_r = undefined;
    },
    
    function step_b(custom_steps, skip_points_display) {
      var raster_image = this.raster_image;
      var rdata = raster_image != undefined ? raster_image.data : undefined;
      
      if (this.sampler == undefined) {
        console.log("image hasn't loaded yet");
      }
      
      if (this.mask == undefined) {
        console.log("mask hasn't loaded yet");
        return;
      }
      
      var grid = this.errgrid;
      var size = this.gridsize;
      var iw = DIMEN, ih=DIMEN;
      
      var steps = custom_steps ? custom_steps : window.STEPS;
      var cw = this.mask.width;
      var ch = this.mask.height;
      
      if (this.mask.data == undefined) {
        console.log("WARNING: mask failed to load");
        return;
      }
      
      var mask = this.mask.data.data;
      var mscale = SMALL_MASK ? 1 : 4;
      
      var clr1 = [0.5, 0.5, 0.5];
      var clr3 = [0.5, 0.5, 0.5];
      var filter = this.filter;
      var points = this.points;
      var start_r = this.start_r;
      var sqrt3 = Math.sqrt(3.0);
      var size = this.gridsize;
      var ws = [0, 0, 0];
      
      var do_clrw = 0; //attempt at barycentric coloring
      var do_cmyk_raster = RASTER_MODE == RASTER_MODES.CMYK;
      
      var _dr_ret = [0, 0];
      var nextout = [0, 0, 0, 0, 0];
       
      if (rdata == undefined) {
        return;
      }
     
      for (var si=0; si<steps; si++, this.cur++) {
          if (this.cur >= size*size) {
            console.log("Done.");
            break;
          }
          
          var x = this.cur % size;
          var y = ~~(this.cur / size);
          
          var gx = x, gy = y;
          
          var ix = ~~(((x*mscale) % cw)+0.5);
          var iy = ~~(((y*mscale) % ch)+0.5);
          
          x /= size;
          y /= size;
          //x = (x-0.5)*2.0, y = (y-0.5)*2.0;
          
          var clr = this.sampler((x-0.5)*2, (y-0.5)*2, size, 1.0);
          if (clr[0] < 0) continue;
          
          clr1[0] = clr[0]; clr1[1] = clr[1]; clr1[2] = clr[2];
          clr = clr1;

          var rix = ~~(x*raster_image.width*0.99999), riy = ~~(y*raster_image.height*0.99999);
          
          var idx = (riy*raster_image.width+rix)*4;
          
          var f = this.calcIntensity(clr[0], clr[1], clr[2]);
          //var f = clr[0]*0.2 + clr[1]*0.7 + clr[2]*0.1; <-- hrm, weird weights. . .
          
          var fac=0, fac2=0, fac3=0;
          var tot=0, tot2=0, tot3=0;
          var mx, my;
          
          for (var j=0; j<mscale*mscale; j++) {
            var offx = j % mscale, offy = ~~(j / mscale);
            
            mx = (ix+offx) % cw, my = (iy+offy) % ch;
            var midx1 = (my*cw + mx)*4;
            
            mx = (ix+3+offx) % cw, my = (iy+offy) % ch;
            var midx2 = (my*cw+mx)*4;
            
            mx = (ix+3+offx) % cw, my = (iy+3+offy) % ch;
            var midx3 = (my*cw+mx)*4;
            
            if (mask[midx1] > 1) {
              fac += mask[midx1]/255.0;
              tot += 1;
            }
            if (mask[midx2] > 1) {
              fac2 += mask[midx2]/255.0;
              tot2 += 1;
            }
            if (mask[midx3] > 1) {
              fac3 += mask[midx3]/255.0;
              tot3 += 1;
            }
          }
          
          fac = tot ? fac / tot : fac;
          fac2 = tot2 ? fac2 / tot2 : fac2;
          fac3 = tot3 ? fac3 / tot3 : fac3;
          
          if (isNaN(fac)) {
            throw new Error("NaN!");
          }
          
          var dfac = 0.0;
          
          var use_lab = false;
          var dclr;
          
          if (!use_lab) {
            dclr = clr3;
            
            dclr[0] = clr[0]*0.9;
            dclr[1] = clr[1]*0.9;
            dclr[2] = clr[2]*1.1;
                        
            clr[0] = dclr[0];
            clr[1] = dclr[1];
            clr[2] = dclr[2];
          } else {
            dclr = colors.rgb_to_lab(clr[0], clr[1], clr[2]);
          }
          
          var closest_color_lab = use_lab ? colors.closest_color_lab : colors.closest_color;
          var lab_colors = use_lab ? colors.lab_colors : colors.colors;
          var lab_colordis = use_lab ? colors.lab_colordis : colors.colordis;
          
          if (DITHER_COLORS) {
            let hsv = colors.rgb_to_hsv(clr[0], clr[1], clr[2]);
            let clr2 = colors.hsv_to_rgb(hsv[0], 1.0, hsv[2]);
            
            var f1 = clr2[0]*0.4 + clr2[1]*0.6 + clr2[2]*0.2;
            
            nextout.length = 5;
            var ci = colors.closest_color(clr2, nextout, 0.0, true);
            
            if (ci === undefined) {
              ci = 0;
            }
            
            //let err = colors.colordis_not_diffusing(colors.colors[ci], clr)*0.97;
            let c2 = colors.colors[ci];
            let dx = c2[0]-clr2[0], dy = c2[1]-clr2[1], dz = c2[2]-clr2[2];
            let err = dx*dx + dy*dy + dz*dz;
            
            err = err != 0.0 ? Math.sqrt(err) : 0.0;
            
            err = Math.sqrt(colors.colordis_not_diffusing(clr2, c2));
            
            //err = colors.lab_colordis(colors.rgb_to_lab(clr2[0], clr2[1], clr2[2]), colors.rgb_to_lab(c2[0], c2[1], c2[2]));
            //err = Math.pow(Math.abs(err), 0.125);
            
            for (let k=0; k<nextout.length; k++) {
              if (nextout[k] === undefined) {
                nextout.length = k;
                break;
              }
            }
            
            let fac2 = Math.pow(fac, 1.0);
            fac2 = Math.pow(fac2, 1.0)/4.0;
            fac2 *= 1.0 + err*err*7.0*f1;
            
            fac2 = Math.min(Math.max(fac2, 0.0), 1.0);
            
            let fi = ~~(fac2*nextout.length*0.999999);
            //let fi = 0;
            
            /*
            if (err > fac) {
              fi = 1;
            } else {
              fi = 0;
            }
            fi = Math.min(Math.max(fi, 0.0), nextout.length-1);
            //*/
            
            ci = nextout[fi];
            let sat = 1.0 - hsv[1];
            
            if (hsv[2]*sat > fac) {
              ci = 0;
            }
            
            for (var k=0; k<3; k++) {
              clr[k] = colors.colors[ci][k];
            }
            
            //clr[0] = clr[1] = clr[2] = fac;
          } else {
            var ci = colors.closest_color(clr, nextout, 0.0, true);
            
            let clr2 = colors.colors[ci];
            let err = colors.colordis_simple(clr, clr2);
            let l = colors.colors.length/8 + 4;
            l = 5;
            if (window._l !== undefined) {
              l = window._l;
            }
            
            fac = 1.0 - fac;
            
            fac = (~~(fac*l))/l;
            
            //fac = Math.random();
            dfac = fac * (window._f !== undefined ? window._f : 1.0);
            dfac = (Math.fract(dfac)-0.5) * 2.0/l * (window._f2 !== undefined ? window._f2 : 1.0);;
            
            clr[0] += dfac;
            clr[1] += dfac;
            clr[2] += dfac;
            
            ci = colors.closest_color(clr, nextout, 0.0, true);

            
            let hsv = colors.rgb_to_hsv(clr[0], clr[1], clr[2]);
            let sat = 1.0 - hsv[1];
            
            if (ci===undefined || hsv[2]*sat > fac) {
              ci = 0;
            }
            
            for (var k=0; k<3; k++) {
              clr[k] = colors.colors[ci][k];
            }
            //clr[0]=clr[1]=clr[2]=fac>0.8;
          }            
          
          /*
          if (!ok) {
            continue;
          }//*/
          
          //clr[0] = clr[1] = clr[2] = 0;
          rdata[idx] = ~~(clr[0]*255);
          rdata[idx+1] = ~~(clr[1]*255);
          rdata[idx+2] = ~~(clr[2]*255);
          rdata[idx+3] = 255;
      }
    },
    
    function _inner_loop(args, refine) {
      let x = args.x, y = args.y, ix = args.ix, iy = args.iy, offx = args.offx, offy = args.offy;
      let points = this.points;
      var raster_image = this.raster_image;
      var size = this.gridsize;
      var iw = DIMEN, ih=DIMEN, cw=iw, ch=ih;
      var start_r = this.start_r;
      
      let colorout = new Array(16);

      if (this.sampler == undefined) {
        console.log("image hasn't loaded yet");
        return undefined;
      }

      const sqrt3 = Math.sqrt(3);

      var clr = this.sampler(x, y, size, 1.0);

      if (clr[0] < 0) {
        return undefined; //sampler requested we discard this sample
      }

      var f = this.calcIntensity(clr[0], clr[1], clr[2]);
      //var f = clr[0]*clr[0] + clr[1]*clr[1] + clr[2]*clr[2];
      //f = f != 0.0 ? Math.sqrt(f) / sqrt3 : 0.0;

      var sat = Math.abs(1.0-clr[0]) +  Math.abs(1.0-clr[1]) +  Math.abs(1.0-clr[2]);
      sat /= 3.0;

      if (ADAPTIVE_COLOR_DENSITY) {
        //scale spacing of points by saturation (how much color there is)
        f *= Math.pow(1.0-sat, 2);
      }

      if (window._f === undefined) {
          window._f = 0.0;
      }
      //f = 0.0;

      f = Math.min(Math.max(f, 0.0), 0.99999);
      let finten = f;

      f = MAKE_NOISE ? 0.65 : f;
      
      let ret = refine(f, clr, x, y);
      let threshold = ret[3];
      
      let linear_f = f;
      //let linear_f = f;
      //let linear_threshold = ret[4];
      
      f = ret[2];
      x = ret[0], y = ret[1], f = ret[2];
      
      let ok = 1.0-f >= threshold;

      if (!ok) {
        return undefined;
      }

      threshold = Math.min(Math.max(threshold, 0.0), 0.99999);
      
      if (isNaN(threshold)) {
        throw new Error("NaN");
      }
      
      if (DITHER_BLUE) colors.ditherSampler.seed(this.getPixelSeed(1.0 - threshold));

      //var ci = colors.closest_color_fast(clr, colorout, 0.0);
      var ci;
      if (DITHER_COLORS) {
        let ditherfac = DITHER_RAND_FAC*Math.random();

        ci = colors.closest_color(clr, undefined, 0.0);

        let clr2 = colors.colors[ci];
        let err = colors.colordis(clr, clr2);

        ci = colors.closest_color(clr, undefined, err);
      } else {
        ci = colors.closest_color_fast(clr);
      }
      //var ci = DITHER_COLORS ? colors.closest_color(clr) : colors.closest_color_fast(clr);
      
      /*
      if (DITHER_COLORS) {
        let ditherfac = Math.pow(threshold, 1.0/3.0);
        
        //ditherfac = f > 0.5 ? 1.0 - ditherfac : ditherfac;
        //ditherfac = Math.random();

        let clr2 = colors.colors[ci];
        
        for (let i=0; i<3; i++) {
          let err3 = -(clr2[i]-clr[i]);

          clr[i] += err3*(ditherfac-0.5)*6.0*DITHER_RAND_FAC;
        }
        ci = colors.closest_color(clr, undefined, 0.0);
      }//*/

      var pi = points.length;
      for (var j=0; j<PTOT; j++) {
        points.push(0);
      }
      
      if (GRID_MODE) {
        let gsize = size*4;
        
        let ix = Math.floor(x*gsize*0.5 + 0.5);
        let iy = Math.floor(y*gsize*0.5 + 0.5);
        
        x = ix * 2.0 / gsize;
        y = iy * 2.0 / gsize;
      }
      
      points[pi] = x;
      points[pi+1] = y;
      points[pi+PRADIUS] = start_r//*(1.0 + 0.25*(sat));
      points[pi+PINTEN] = finten;
      points[pi+PID] = ci;
      //points[pi+PLVL] = lvl;
      points[pi+PRADIUS2] = -1;//points[pi+PRADIUS];

      points[pi+POX] = points[pi+POLDX] = points[pi];
      points[pi+POY] = points[pi+POLDY] = points[pi+1];
      
      this.calc_theta(pi);
      
      return pi;
    },

    function step_smask(custom_steps) {
      let args = this.inner_loop_cachering.next();

      let points = this.points;
      var raster_image = this.raster_image;
      var steps = custom_steps ? custom_steps : window.STEPS;
      var size = this.gridsize;
      var smask = this.smask;
      var iw = DIMEN, ih=DIMEN, cw=iw, ch=ih;
      var start_r = this.start_r;
     
      if (this.sampler == undefined) {
        console.log("image hasn't loaded yet");
        return;
      }

      const sqrt3 = Math.sqrt(3);
      let size2 = Math.ceil(size / this.smask.blocksize);
      let size3 = size / this.smask.blocksize;

      steps = Math.ceil(steps / this.smask.blocksize / this.smask.blocksize);
      
      let refine_ret = [0, 0, 0, 0, 0];
      let p;
      let ix, iy;

      function refine(f, clr, x, y) {
        f = smask.evalInverseTone(f);
        
        if (SPECIAL_OFFSETS) {
          let co2 = p.evaluate(1.0-f);

          x = co2[0], y = co2[1];

          x = x / size3 + ix / size3;
          y = y / size3 + iy / size3;

          x = x*2.0 - 1.0;
          y = y*2.0 - 1.0;
        }
        
        refine_ret[0] = x;
        refine_ret[1] = y;
        refine_ret[2] = f
        refine_ret[3] = p.gen;
        refine_ret[4] = smask.evalInverseTone(p.gen);

        return refine_ret;
      }
      
      for (var si=0; si<steps; si++, this.cur++) {
          if (this.cur >= size2*size2) {
            console.log("Done.");
            break;
          }
          
          ix = this.cur % size2;
          iy = ~~(this.cur / size2);
          
          for (p of this.smask.points) {
                //let co = p.evaluate(0.99999);
                //let co = p.evaluate(0.05);
                //let x = Math.fract(co[0]), y = Math.fract(co[1]);
                //x = co[0], y = co[1];
                let x = p.startx, y = p.starty;
                
                x = x / size3 + ix / size3;
                y = y / size3 + iy / size3;
                
                x = x*2.0 - 1.0;
                y = y*2.0 - 1.0;
                
                if (x < -1 || y < -1 || x >= 1 || y >= 1)
                  continue;
               
               args.load(x, y, ix, iy, 0, 0);
               this._inner_loop(args, refine);
          }
      }
      
      //if (!skip_points_display) {
        console.log("points", points.length/PTOT);
        console.log("\n");
      //}
      
      this.calc_derivatives();

      if (TRI_MODE) {//} && !skip_points_display) {
        console.log("regenerating triangulation...");
        this.del();
      } else if (SCALE_POINTS) {//} && !skip_points_display) {
        this.calc_radii();
      }
    },

    function getPixelSeed(threshold) {
      //threshold = 1.0 - threshold;
      threshold = threshold**0.5;

      return ~~(threshold * DITHER_BLUE_STEPS); //colors.colors.length * 0.25);
    },

    function calcIntensity(r, g, b) {
      let f = colors.rgb_to_intensity(r, g, b);
      
      if (window.DENSITY_CURVE !== undefined) {
        f = window.DENSITY_CURVE.evaluate(f);
      }
      
      return f;
    },
    
    function step_diffusion(custom_steps, cur) {
      console.log("Step Diffusion");

      let steps = custom_steps === undefined ? window.STEPS : custom_steps;
      
      var raster_image = this.raster_image;
      var rdata = raster_image != undefined ? raster_image.data : undefined;
      
      if (this.sampler == undefined) {
        console.log("image hasn't loaded yet");
      }
      
      var grid = this.errgrid;
      var size = this.gridsize;
      var iw = DIMEN, ih=DIMEN;
      
      var ix, iy;
      var oks = new Array(colors.colors.length);
      var clrws = new Array(colors.colors.length);
      var clridxs = new Array(colors.colors.length);
      var wcolors = colors.colors;
      var totwclrs = colors.colors.length;
      
      var clr1 = [0.5, 0.5, 0.5];
      var filter = this.filter;
      var points = this.points;
      var start_r = this.start_r;
      var fil = filter.get(f);
      var sqrt3 = Math.sqrt(3.0);
      var size = this.gridsize;
      
      var do_clrw = 0; //attempt at barycentric coloring
      var do_cmyk_raster = RASTER_MODE == RASTER_MODES.CMYK;
      
      var _dr_ret = [0, 0];
      var nextout = [0, 0, 0, 0, 0];
            
      for (var si=0; si<steps; si++, cur++) {
        if (cur >= size*size) {
          console.log("Done.");
          break;
        }
        
        var x = cur % size;
        var y = ~~(cur / size);
        
        var flip = y%2==0;
        //flip=0;
        
        if (flip) {
          x = size - x - 1;
        }
        
        var gx = x, gy = y;
        
        var igx = x;
        var igy = y;
        
        x /= size;
        y /= size;
        
        x = (x-0.5)*2.0, y = (y-0.5)*2.0;
        
        var clr = this.sampler(x, y, size, 1.0);
        
        if (clr[0] < 0) {
          continue; //sampler requested we discard this sample
        }
        
        var f = this.calcIntensity(clr[0], clr[1], clr[2]);
        //var f = (clr[0]*0.4026 + clr[1]*0.4052 + clr[2]*0.2022)*0.8;
        //var f = clr[0]*clr[0] + clr[1]*clr[1] + clr[2]*clr[2];
        //f = f != 0.0 ? Math.sqrt(f) / sqrt3 : 0.0;
        
        var sat = Math.abs(1.0-clr[0]) +  Math.abs(1.0-clr[1]) +  Math.abs(1.0-clr[2]);
        sat /= 3.0;
        
        if (ADAPTIVE_COLOR_DENSITY) {
          //scale spacing of points by saturation (how much color there is)
          f *= Math.pow(1.0-sat, 2);
        }
        let finten = f;
        
        var rok=0, gok=0, bok=0, fok=0;
        var finalth = 0.0;
        
        var fr = clr[0], fg = clr[1], fb = clr[2];
        
        let ci = colors.closest_color_fast(clr);
        
        var rasterfac = raster_image != undefined ? ~~Math.ceil(raster_image.width / this.dimen) : 1;
        
        function dot2(rx2, ry2, c, m, y, k) {
          var rx = ~~(rx2/2);
          var ry = ~~(ry2/2);
          
          var ax = ~~(rx2 - rx);
          var ay = ~~(ry2 - ry);
          
          var size = 1;
          var offs = cconst.get_searchoff(size);
          
          var ridx = (ry*raster_image.width+rx)*4;
          var fac = 1.0;
          
          ridx += ax % 3;
          
          rdata[ridx] = 0;
          //rdata[ridx+1] = Math.max(rdata[ridx+1]-m*fac, 0);
          //rdata[ridx+2] = Math.max(rdata[ridx+2]-y*fac, 0);
          //rdata[ridx+3] = 255;
        }
        
        function dot(rx, ry, spotk, c, m, y, k) {
          var f1 = (1.0-spotk);
          if (c == m && c == y)
            f1 = spotk;
          
          f1 *= 0.5;
          
          dot_intern(rx, ry, spotk, c, m, y, k, 0.85);
          if (RASTER_MODE != RASTER_MODES.CMYK) {
            return;
          }
          
          f1 = 0.1;
          dot_intern(rx-1, ry, spotk, c, m, y, k, f1);
          dot_intern(rx, ry+1, spotk, c, m, y, k, f1);
          dot_intern(rx+1, ry, spotk, c, m, y, k, f1);
          dot_intern(rx, ry-1, spotk, c, m, y, k, f1);
        }
        
        function dot_intern(rx, ry, spotk, c, m, y, k, alpha) {
          alpha = alpha == undefined ? 1 : alpha;
          
          var size = ~~(rasterfac*0.25);
          size = 0;
          
          var offs = cconst.get_spotfunc(size, spotk);

          if (size == 0) {
            var ridx = (ry*raster_image.width+rx)*4;
            
            rdata[ridx] = Math.max(rdata[ridx]-c*alpha, 0)//*(1.0-k);
            rdata[ridx+1] = Math.max(rdata[ridx+1]-m*alpha, 0);
            rdata[ridx+2] = Math.max(rdata[ridx+2]-y*alpha, 0);
            rdata[ridx+3] = 255;
            
            return;
          }
          
          for (var i=0; i<offs.length; i++) {
            var rx2 = rx + offs[i][0];
            var ry2 = ry + offs[i][1];
            
            if (rx2 < 0 || ry2 < 0 || rx2 >= raster_image.width || ry2 >= raster_image.height) {
              continue;
            }
            
            var ridx = (ry2*raster_image.width+rx2)*4;
            
            rdata[ridx] = Math.max(rdata[ridx]-c*alpha, 0)//*(1.0-k);
            rdata[ridx+1] = Math.max(rdata[ridx+1]-m*alpha, 0);
            rdata[ridx+2] = Math.max(rdata[ridx+2]-y*alpha, 0);
            rdata[ridx+3] = 255;
          }
        }

        clr1[0] = clr[0]; clr1[1] = clr[1]; clr1[2] = clr[2];
        
        if (DITHER_COLORS) {
          var gidx = ~~((igy*size + igx)*3);
                    
          clr1[0] += grid[gidx];
          clr1[1] += grid[gidx+1];
          clr1[2] += grid[gidx+2];
        
          ci = colors.closest_color_fast(clr1);
          colors.colors_used[ci]++;
          
          var clr2 = colors.colors[ci];

          var dr = (clr1[0]-clr2[0]);
          var dg = (clr1[1]-clr2[1]);
          var db = (clr1[2]-clr2[2]);
          
          var sat = Math.abs(1.0-clr[0]) +  Math.abs(1.0-clr[1]) +  Math.abs(1.0-clr[2]);
          sat /= 3.0;
          
          //scale color error by spacing of points
          if (CORRECT_FOR_SPACING) {
            var avg = (clr[0]+clr[1]+clr[2])/3.0;
            var sat2 = Math.abs(avg-clr[0]) +  Math.abs(avg-clr[1]) +  Math.abs(avg-clr[2]);
            sat2 /= 3.0;
            
            var ffac = Math.pow(1.0-f, 0.5);
            ffac = 1.0 - f*f*sat2;
            
            dr *= ffac;
            dg *= ffac;
            db *= ffac;
          }
          
          //apply error diffusion to color
          for (var fi=0; fi<fil.length; fi++) {
            for (var fj=0; fj<fil[fi].length; fj++) {
              var fi2 = fi;
              var fj2 = fj - 2;
              
              var igx2 = igx + (flip ? -fj2 : fj2);
              var igy2 = igy + fi2;
              
              if (igx2 >= size || igy2 >= size) {
                continue;
              }
              if (igx2 < 0 || igy2 < 0) {
                continue;
              }
              
              var fmul = this.filter.wrand*(this.random()-0.5);
              fmul += (this.random()-0.5)*0.05;
              
              var gidx2 = (igy2*size + igx2)*3;

              grid[gidx2] += fil[fi][fj]*dr + fmul;
              grid[gidx2+1] += fil[fi][fj]*dg + fmul;
              grid[gidx2+2] += fil[fi][fj]*db + fmul;
              
              grid[gidx2] = Math.min(Math.max(grid[gidx2], -1.0), 1.0);
              grid[gidx2+1] = Math.min(Math.max(grid[gidx2+1], -1.0), 1.0);
              grid[gidx2+2] = Math.min(Math.max(grid[gidx2+2], -1.0), 1.0);
            }
          }
        } else {
          if (ci == undefined) {
            ci = colors.closest_color_fast(clr);
          }
          var clr2 = colors.colors[ci];
          
          if (clr2 == undefined) {
            console.log(ci);
            throw new Error("eek!");
          }
          
          clr1[0] = clr2[0];
          clr1[1] = clr2[1];
          clr1[2] = clr2[2];
          
          var sat = Math.abs(1.0-clr2[0]) +  Math.abs(1.0-clr2[1]) +  Math.abs(1.0-clr2[2]);
          sat /= 3.0;
        }

        var do_raster = RASTER_IMAGE && rdata != undefined;
        if (do_raster) {
          var clr2 = colors.colors[ci];
          
          var rix = ~~((x*0.5+0.5001)*raster_image.width*0.99999), riy = ~~((y*0.5+0.5001)*raster_image.height*0.99999);
          var ridx = (riy*raster_image.width + rix)*4;
          
          rdata[ridx] = ~~(clr2[0]*255);
          rdata[ridx+1] = ~~(clr2[1]*255);
          rdata[ridx+2] = ~~(clr2[2]*255);
          rdata[ridx+3] = 255;
        } 
      }
      
      return cur;
    },
    
    function colordiffuse() {
      let ps = this.points;
      let tree = this.calc_kdtree();
      var size = this.gridsize;
      
      let pi1, x1, y1, color1, gen1, r1;
      
      let errors = new Float64Array(4*ps.length/PTOT);
      let pcolors = new Float64Array(4*ps.length/PTOT);
      
      errors.fill(0, 0, errors.length);
      
      for (let pi=0; pi<ps.length; pi += PTOT) {
        let x = ps[pi], y = ps[pi+1];
        
        let i = (pi/PTOT)*4;
        
        let clr = this.sampler(x, y, size, 1.0);
        
        if (isNaN(clr[0]) || isNaN(clr[1]) || isNaN(clr[2])) {
          console.log("NaN in sampler!");
          clr[0] = clr[1] = clr[2] = clr[3] = 1.0;
        }
        
        if (clr[0] < 0) {
          //discard point?
          clr[0] = clr[1] = clr[2] = 0.0;
        }
        
        for (let j=0; j<4; j++) {
          pcolors[i+j] = clr[j];
        }
      }
      
      let radius = 7.0 / Math.sqrt(ps.length/PTOT+1);
      
      let callback = (pi2) => {
        if (pi2 == pi1) return;
        
        let x2 = ps[pi2], y2 = ps[pi2+1], color2 = ps[pi2+PID], r2 = ps[pi2+PRADIUS2], gen2 = ps[pi2+PLVL];
        let dx = x2-x1, dy = y2-y1;
        let dis = dx*dx + dy*dy;
        
        if (dis >= radius*radius) return;
        
        dis = Math.sqrt(dis);
        
        let w = 1.0 - dis / radius;
        
        if (isNaN(w)) {
          console.log(dis, dx, dy, x1, y1, x2, y2);
          throw new Error("nan!");
        }
        w = w*w*(3.0 - 2.0*w);
        
        let i1 = 4*pi1/PTOT;
        let i2 = 4*pi2/PTOT;
        
        for (let j=0; j<3; j++) {
          if (isNaN(errors[i1+j])) {
            console.log(errors, i1, j);
            throw new Error("NaN!");
          }
          
          if (isNaN(w) || isNaN(errors[i1+j])) {
            console.log(errors, i1, j, w);
            throw new Error("NaN again!");
          }
          
          pcolors[i2+j] += -errors[i1+j]*w;
        }
      }
      
      for (pi1=0; pi1<ps.length; pi1 += PTOT) {
        x1 = ps[pi1], y1 = ps[pi1+1], color1=ps[pi1+PID], r1 = ps[pi1+PRADIUS2], gen1=ps[pi1+PLVL];
        
        let i = (pi1/PTOT)*4;
        let color = colors.colors[color1];
        
        for (let j=0; j<3; j++) {
          if (isNaN(color[j])) {
            console.log(color, color1);
            throw new Error("nan!");
          }
          
          if (isNaN(pcolors[i+j])) {
            console.log(pcolors, i, j);
            throw new Error("nan!!");
          }
          
          errors[i+j] = (pcolors[i+j] - color[j]);
        }
        
        tree.forEachPoint(x1, y1, radius, callback);
      }
      
      let clr = [0, 0, 0, 1];
      
      for (pi1=0; pi1<ps.length; pi1 += PTOT) {
        let i = (pi1/PTOT)*4;
        
        for (let j=0; j<4; j++) {
          clr[j] = pcolors[i+j];
        }
        
        let ci = colors.closest_color_fast(clr);
        ps[pi1+PID] = ci;
      }
      
      console.log("done");
    },
    
    function step_cmyk_color_mask(custom_steps, skip_points_display) {
      if (this.mask === undefined || this.mask.data == undefined) {
        console.log("WARNING: mask failed to load");
        return;
      }
      
      var masksize = this.mask.width;
      var mask = this.mask.data.data;
      var points = this.points;
      var steps = custom_steps ? custom_steps : window.STEPS;
      var cw = this.mask.width;
      var ch = this.mask.height;
      let ix, iy;
      var size = this.gridsize;
      var iw = DIMEN, ih=DIMEN;

      var raster_image = this.raster_image;
      var rdata = raster_image !== undefined ? raster_image.data : undefined;
      
      var mask = this.mask.data.data;
      var mscale = SMALL_MASK ? 1 : (XLARGE_MASK ? 8 : 4);

          var rasterfac = raster_image != undefined ? ~~Math.ceil(raster_image.width / this.dimen) : 1;
          
      function dot2(rx2, ry2, c, m, y, k) {
        var rx = ~~(rx2/2);
        var ry = ~~(ry2/2);
        
        var ax = ~~(rx2 - rx);
        var ay = ~~(ry2 - ry);
        
        var size = 1;
        var offs = cconst.get_searchoff(size);
        
        var ridx = (ry*raster_image.width+rx)*4;
        var fac = 1.0;
        
        ridx += ax % 3;
        
        rdata[ridx] = 0;
        //rdata[ridx+1] = Math.max(rdata[ridx+1]-m*fac, 0);
        //rdata[ridx+2] = Math.max(rdata[ridx+2]-y*fac, 0);
        //rdata[ridx+3] = 255;
      }
      
      function dot(rx, ry, spotk, c, m, y, k) {
        var f1 = (1.0-spotk);
        if (c == m && c == y)
          f1 = spotk;
        
        f1 *= 0.5;
        
        dot_intern(rx, ry, spotk, c, m, y, k, 0.4);
        
        //crude simulation of ink bleeding
        f1 = 0.1;
        dot_intern(rx-1, ry, spotk, c, m, y, k, f1);
        dot_intern(rx, ry+1, spotk, c, m, y, k, f1);
        dot_intern(rx+1, ry, spotk, c, m, y, k, f1);
        dot_intern(rx, ry-1, spotk, c, m, y, k, f1);
      }
      
      function dot_intern(rx, ry, spotk, c, m, y, k, alpha) {
        alpha = alpha == undefined ? 1 : alpha;
        
        var size = ~~(rasterfac*0.25);
        size = 0;
        
        var offs = cconst.get_spotfunc(size, spotk);

        if (size == 0) {
          //rx = Math.min(Math.max(rx, 0), raster_image.width);
          //ry = Math.min(Math.max(ry, 0), raster_image.height);
          
          var ridx = (ry*raster_image.width+rx)*4;
          
          rdata[ridx] = Math.max(rdata[ridx]-c*alpha, 0)//*(1.0-k);
          rdata[ridx+1] = Math.max(rdata[ridx+1]-m*alpha, 0);
          rdata[ridx+2] = Math.max(rdata[ridx+2]-y*alpha, 0);
          rdata[ridx+3] = 255;
          
          return;
        }
        
        for (var i=0; i<offs.length; i++) {
          var rx2 = rx + offs[i][0];
          var ry2 = ry + offs[i][1];
          
          if (rx2 < 0 || ry2 < 0 || rx2 >= raster_image.width || ry2 >= raster_image.height) {
            continue;
          }
          
          var ridx = (ry2*raster_image.width+rx2)*4;
          
          rdata[ridx] = Math.max(rdata[ridx]-c*alpha, 0)//*(1.0-k);
          rdata[ridx+1] = Math.max(rdata[ridx+1]-m*alpha, 0);
          rdata[ridx+2] = Math.max(rdata[ridx+2]-y*alpha, 0);
          rdata[ridx+3] = 255;
        }
      }
      
      for (var si=0; si<steps; si++, this.cur++) {
          if (this.cur >= size*size) {
            console.log("Done.");
            break;
          }
          
          var x = this.cur % size;
          var y = ~~(this.cur / size);
          
          var flip = y%2==0;
          //flip=0;
          
          if (flip) {
            x = size - x - 1;
          }
          
          var gx = x, gy = y;
          
          ix = ~~(((x*mscale) % cw)+0.5);
          iy = ~~(((y*mscale) % ch)+0.5);
          
          var igx = x;
          var igy = y;
          
          x /= size;
          y /= size;
          
          x = (x-0.5)*2.0, y = (y-0.5)*2.0;
          
          var clr = this.sampler(x, y, size, 1.0);
          
          if (clr[0] < 0) {
            continue; //sampler requested we discard this sample
          }
          
          var f = this.calcIntensity(clr[0], clr[1], clr[2]);
          //var f = (clr[0]*0.4026 + clr[1]*0.4052 + clr[2]*0.2022)*0.8;
          //var f = clr[0]*clr[0] + clr[1]*clr[1] + clr[2]*clr[2];
          //f = f != 0.0 ? Math.sqrt(f) / sqrt3 : 0.0;
          
          var sat = Math.abs(1.0-clr[0]) +  Math.abs(1.0-clr[1]) +  Math.abs(1.0-clr[2]);
          sat /= 3.0;
          
          if (ADAPTIVE_COLOR_DENSITY) {
            //scale spacing of points by saturation (how much color there is)
            f *= Math.pow(1.0-sat, 2);
          }
          let finten = f;
          
          f = MAKE_NOISE ? 0.65 : f;
          
          var fr = clr[0], fg = clr[1], fb = clr[2];
          
          var cmyk = colors.rgb_to_cmyk(clr[0], clr[1], clr[2]);
          
          fr = cmyk[0];
          fg = cmyk[1];
          fb = cmyk[2];
          
          //fr *= 1.5;
          //fg *= 1.5;
          //fb *= 1.5;

          var rx = this.cur % size;
          var ry = ~~(this.cur / size);
          if (flip) {
            rx = size - rx - 1;
          }
          
          let rx2 = ~~(raster_image.width*rx/size);
          let ry2 = ~~(raster_image.height*ry/size);
          let idx = (ry2*raster_image.width + rx2)*4;

          //rdata[idx] = 255;
          //rdata[idx+1] = 0;
          //rdata[idx+3] = 255;
          
          for (let color=0; color<4; color++) {
            let masksize2 = ~~(masksize/2);

            //break;
            let ox = color%2, oy = ~~(color/2);
            
            ox *= masksize2;
            oy *= masksize2;
            
            var mx = rx % masksize2;
            var my = ry % masksize2;
            
            mx = ~~(mx + ox);
            my = ~~(my + oy);
            
            let idx2 = (my*masksize + mx)*4;
            
            let f = cmyk[color];
            //f = f*f*(3.0 - 2.0*f);
            //f = color == 3 ? 1.0 - f : f;
            
            if (f*255 < mask[idx2]) {
              continue;
            }
            
            //if (color != 3)
            //  continue;
            
            //rdata[idx] = rdata[idx+1] = rdata[idx+2] = 0;
            //dot(rx2, ry2, 1.0, cmyk[0]*255, cmyk[1]*255, cmyk[2]*255, cmyk[3]*255);
            
            //continue;
            switch (color) {
              case 0:
                dot(rx2, ry2, 1.0, 255, 0, 0, 0);
                
                //dot(x, y, f, 255, 0, 0, 255);
                //rdata[idx] = Math.max(rdata[idx]-255, 0);
                //rdata[idx+1] = Math.max(rdata[idx+1]-100, 0);
                break;
              case 1:
                dot(rx2, ry2, 1.0, 0, 255, 0, 0);
                //rdata[idx+1] = Math.max(rdata[idx+1]-255, 0);
                //rdata[idx+2] = Math.max(rdata[idx+2]-100, 0);
                break;
              case 2:
                dot(rx2, ry2, 1.0, 0, 0, 255, 0);
                //rdata[idx+2] = Math.max(rdata[idx+2]-255, 0);
                break;
              case 3:
                dot(rx2, ry2, 1.0, 255, 255, 255, 255);
                //rdata[idx+0] = Math.max(rdata[idx+0]-255, 0);
                //rdata[idx+1] = Math.max(rdata[idx+1]-255, 0);
                //rdata[idx+2] = Math.max(rdata[idx+2]-255, 0);
                break;
            }
            
            rdata[idx+3] = 255;
          }
          
          //dot(x, y, f, 0, 0, 0, 255);
      }
      
      if (!skip_points_display) {
        console.log("points", points.length/PTOT);
        console.log("\n");
      }
      
      if (TRI_MODE && !skip_points_display) {
        console.log("regenerating triangulation...");
        this.del();
      } else if (SCALE_POINTS && !skip_points_display) {
        this.calc_radii();
      }
    },
    
    //REFACTOR MUST HAPPEN!
    function step(custom_steps, skip_points_display) {
      if (RASTER_IMAGE && RASTER_MODE == RASTER_MODES.PATTERN) {
        this.step_b();
        this.calc_derivatives();
        return;
      }
      
      if (RASTER_IMAGE && RASTER_MODE == RASTER_MODES.CMYK && USE_CMYK_MASK) {
        this.step_cmyk_color_mask();
        this.calc_derivatives();
        return;
      }
      
      if (RASTER_IMAGE && RASTER_MODE == RASTER_MODES.DIFFUSION) {
        this.cur = this.step_diffusion(custom_steps, this.cur);
        this.calc_derivatives();
        return;
      } else if (this.smask !== undefined) {
        this.step_smask(custom_steps);
        return;
      }

      this.r = 1.0;
      
      var raster_image = this.raster_image;
      var rdata = raster_image !== undefined ? raster_image.data : undefined;
      
      if (this.sampler == undefined) {
        console.log("image hasn't loaded yet");
      }
      
      if (this.mask == undefined) {
        console.log("mask hasn't loaded yet");
        return;
      }
      
      var grid = this.errgrid;
      var size = this.gridsize;
      var iw = DIMEN, ih=DIMEN;
      
      var steps = custom_steps ? custom_steps : window.STEPS;
      var cw = this.mask.width;
      var ch = this.mask.height;

      if (this.mask.data == undefined) {
        console.log("WARNING: mask failed to load");
        return;
      }
      
      var mask = this.mask.data.data;
      var mscale = SMALL_MASK ? 1 : (XLARGE_MASK ? 8 : 4);
      
      var ix, iy;
      var oks = new Array(colors.colors.length);
      var clrws = new Array(colors.colors.length);
      var clridxs = new Array(colors.colors.length);
      var wcolors = colors.colors;
      var totwclrs = colors.colors.length;
      
      var clr1 = [0.5, 0.5, 0.5];
      var filter = this.filter;
      var points = this.points;
      var start_r = this.start_r;
      var fil = filter.get(f);
      var sqrt3 = Math.sqrt(3.0);
      var size = this.gridsize;
      
      var do_clrw = 0; //attempt at barycentric coloring
      var do_cmyk_raster = RASTER_MODE == RASTER_MODES.CMYK;
      
      var _dr_ret = [0, 0];
      var nextout = [0, 0, 0, 0, 0];
      
      function dorot(i, j, ix, iy, th) {
        var rt = rot(i, j, th);
        
        ix2 = ~~rt[0] + ix;
        iy2 = ~~rt[1] + iy;
        
        ix2 = ix2 % cw;
        iy2 = iy2 % cw;
        
        if (ix2 < 0) ix2 += cw;
        if (iy2 < 0) iy2 += cw;
        
        _dr_ret[0] = ix2;
        _dr_ret[1] = iy2;
        
        return _dr_ret;
      }
      
      for (var si=0; si<steps; si++, this.cur++) {
          if (this.cur >= size*size) {
            console.log("Done.");
            break;
          }
          
          var x = this.cur % size;
          var y = ~~(this.cur / size);
          
          var flip = y%2==0;
          //flip=0;
          
          if (flip) {
            x = size - x - 1;
          }
          
          var gx = x, gy = y;
          
          ix = ~~(((x*mscale) % cw)+0.5);
          iy = ~~(((y*mscale) % ch)+0.5);
          
          var igx = x;
          var igy = y;
          
          x /= size;
          y /= size;
          
          x = (x-0.5)*2.0, y = (y-0.5)*2.0;
          
          var clr = this.sampler(x, y, size, 1.0);
          
          if (clr[0] < 0) {
            continue; //sampler requested we discard this sample
          }
          
          var f = this.calcIntensity(clr[0], clr[1], clr[2]);
          //var f = (clr[0]*0.4026 + clr[1]*0.4052 + clr[2]*0.2022)*0.8;
          //var f = clr[0]*clr[0] + clr[1]*clr[1] + clr[2]*clr[2];
          //f = f != 0.0 ? Math.sqrt(f) / sqrt3 : 0.0;
          
          var sat = Math.abs(1.0-clr[0]) +  Math.abs(1.0-clr[1]) +  Math.abs(1.0-clr[2]);
          sat /= 3.0;
          
          if (ADAPTIVE_COLOR_DENSITY) {
            //scale spacing of points by saturation (how much color there is)
            f *= Math.pow(1.0-sat, 2);
          }
          let finten = f;
          
          f = MAKE_NOISE ? 0.65 : f;
          
          var idx = (iy*cw + ix)*4; 
          var threshold = mask[idx]/255.0;
          
          var ok = 0;
          var wid = mscale;
          var ditherfac = 0//(1.0/65)*(this.random()-0.5)//*(0.2 + 0.06*f*f);
          
          //blue noise mask has to be downsampled (this is by design,
          //to hopefully make it more accurate)
          var sumx = 0, sumy = 0;
          var lvl = (~~(f*64)) % 3;
          
          /*
          lvl = ~~(this.random()*2.99999999);
          lvl++
          //f=0;
          
          switch(lvl) {
            case 0:
              f = f*0.9;
              break;
            case 1:
              var tf = Math.max(clr[1], clr[2]);
              f *= 1.0-clr[0];
              //f = (1.0-clr[0])*(1.0-tf) + clr[0]*tf;
              
              break;
            case 2:
              var tf = Math.max(clr[0], clr[2]);
              f *= 1.0-clr[1];
              //f = (1.0-clr[1])*(1.0-tf) + clr[1]*tf;
              break;
            case 3:            
              var tf = Math.max(clr[1], clr[0]);
              f *= 1.0-clr[2];
              //f = (1.0-clr[2])*(1.0-tf) + clr[2]*tf;
              break;
          }
          //*/
          
          var rok=0, gok=0, bok=0, fok=0;
          var finalth = 0.0;
          
          var fr = clr[0], fg = clr[1], fb = clr[2];
          if (do_cmyk_raster && RASTER_IMAGE) {
            if (do_clrw) {
              clrws = colors.colorweight(clr[0], clr[1], clr[2]);
            }
            
            var cmyk = colors.rgb_to_cmyk(clr[0], clr[1], clr[2]);
            
            fr = cmyk[0];
            fg = cmyk[1];
            fb = cmyk[2];
            
            //fr *= 1.5;
            //fg *= 1.5;
            //fb *= 1.5;
            f  = 1.0  - cmyk[3];
            f *= f;
          }
          
          var rotmask = 1;
          let offx = 0, offy = 0;
          let stop = false;
          threshold = 0;
          
          for (var i=0; !stop && i<wid; i++) {
            for (var j=0; !stop && j<wid; j++) {
              var ix2 = (ix+i) % cw;
              var iy2 = (iy+j) % ch;
              
              var dd = SMALL_MASK ? 0 : 0;
              
              if (rotmask) {
                var ix3 = cw - 1 - ((ix+i+dd) % cw);
                var iy3 = (iy+j+dd) % ch;
                
                var iy4 = (ix+i+dd) % cw;
                var ix4 = (iy+j) % ch;

                var iy5 = (ix+i) % cw;
                var ix5 = cw - 1 - ((iy+j+dd) % ch);
                
                /*
                var rt = dorot(cw-1-i, j, ix, iy, Math.PI/4.0);
                ix3 = rt[0];
                iy3 = rt[1];
                
                var rt = dorot(j, cw-1-i, ix, iy, -Math.PI/5.0);
                ix4 = rt[0];
                iy4 = rt[1];
                
                var rt = dorot(j, i, ix, iy, Math.PI/3.0);
                ix5 = rt[0];
                iy5 = rt[1];
                //*/
              } else {
                var ix3 = (ix+i+dd) % cw;
                var iy3 = (iy+j+dd) % ch;

                var ix4 = (ix+i+dd) % cw;
                var iy4 = (iy+j) % ch;

                var ix5 = (ix+i) % cw;
                var iy5 = (iy+j+dd) % ch;
              }
              var idx2 = ~~((iy2*cw + ix2)*4);
              var idx3 = ~~((iy3*cw + ix3)*4);
              var idx4 = ~~((iy4*cw + ix4)*4);
              var idx5 = ~~((iy5*cw + ix5)*4);
              
              clridxs[0] = idx5;
              clridxs[1] = idx3;
              clridxs[2] = idx4;
              clridxs[3] = idx2;
              
              var aok2 = mask[idx2] > 1 || SMALL_MASK;
              var aok3 = mask[idx3] > 1 || SMALL_MASK;
              var aok4 = mask[idx4] > 1 || SMALL_MASK;
              var aok5 = mask[idx5] > 1 || SMALL_MASK;
              
              var fok2 = aok2 && f <= mask[idx2]/255.0 + ditherfac;
              fok |= fok2;
              
              var pass = fok2;

              //rok=gok=bok=0;
              
              if (do_clrw) {
                for (var k=0; k<totwclrs; k++) {
                  var idxk = clridxs[k & 3];
                  
                  oks[k] = clrws[k] < mask[idxk]/255.0;
                  
                  if (do_clrw)
                    pass = pass || oks[k];
                }
              }
              
              var rok2 = aok5 && 1.0-fr < mask[idx5]/255.0;
              var gok2 = aok3 && 1.0-fg < mask[idx3]/255.0;
              var bok2 = aok4 && 1.0-fb < mask[idx4]/255.0;
              
              rok |= rok2;
              gok |= gok2;
              bok |= bok2;
              
              if (do_cmyk_raster && RASTER_IMAGE) {
                pass = pass || rok2;
                pass = pass || gok2;
                pass = pass || bok2;
              }
                
              if (pass) {
                ok++;
                
                offx += ((mask[idx2+1]/255.0)*2.0 - 1.0)/cw;
                offy += ((mask[idx2+2]/255.0)*2.0 - 1.0)/cw;
                
                finalth += mask[idx2]/255.0 + ditherfac;
                sumx += i/size;
                sumy += j/size;

                threshold += mask[idx2]/255.0;
                //stop = true;
                //break;
              }
            }
          }
          
          if (ok > 0) {
            finalth /= ok;
            threshold /= ok;
          }

          if (SMALL_MASK) {
            var cix = (~~((x*0.5+0.5)*size+0.05)) % cw;
            var ciy = (~~((y*0.5+0.5)*size+0.05)) % ch;
            
            cix = gx % cw;
            ciy = gy % ch;
            
            var idx2 = (ciy*cw + cix)*4; 
            ok = f <= mask[idx2]/255.0 + ditherfac;
            
            if (do_cmyk_raster && RASTER_IMAGE) {
              ok = ok || f <= mask[idx2+1]/255.0 + ditherfac;
              ok = ok || f <= mask[idx2+2]/255.0 + ditherfac;
            }
          }
          
          var sat=0;
          var ci = 0;

          if (ok || RASTER_IMAGE) {
            if (DITHER_COLORS) {
              if (DITHER_BLUE) colors.ditherSampler.seed(this.getPixelSeed(1.0 - threshold));
              ci = colors.closest_color(clr);
            } else {
              ci = colors.closest_color_fast(clr);
            }
          }
          
          if (ok > 0) {
            offx /= ok;
            offy /= ok;
          }
          
          if (!SMALL_MASK && ok && !GRID_MODE) {
            sumx /= ok;
            sumy /= ok;
            
            var sf = XLARGE_MASK ? 0.25 : 0.4;//RASTER_IMAGE ? 0.8 : 0.501;
            sf = 2.0/mscale;
            
            //*
            x += sumx*sf;//*mscale*0.5;
            y += sumy*sf;//*mscale*0.5;
            //*/
          }
          
          if (!SMALL_MASK && SPECIAL_OFFSETS) {
            let ofac = Math.pow(Math.max(1.0-f, 0.0001), 3.0);
            
            ofac *= mscale/8;
            //ofac = 0.5;
            //ofac=0.25;
            //ofac = 1.0-f;
            x += offx*ofac;
            y += offy*ofac;
          }
          
          var rasterfac = raster_image != undefined ? ~~Math.ceil(raster_image.width / this.dimen) : 1;
          
          function dot2(rx2, ry2, c, m, y, k) {
            var rx = ~~(rx2/2);
            var ry = ~~(ry2/2);
            
            var ax = ~~(rx2 - rx);
            var ay = ~~(ry2 - ry);
            
            var size = 1;
            var offs = cconst.get_searchoff(size);
            
            var ridx = (ry*raster_image.width+rx)*4;
            var fac = 1.0;
            
            ridx += ax % 3;
            
            rdata[ridx] = 0;
            //rdata[ridx+1] = Math.max(rdata[ridx+1]-m*fac, 0);
            //rdata[ridx+2] = Math.max(rdata[ridx+2]-y*fac, 0);
            //rdata[ridx+3] = 255;
          }
          
          function dot(rx, ry, spotk, c, m, y, k) {
            var f1 = (1.0-spotk);
            if (c == m && c == y)
              f1 = spotk;
            
            f1 *= 0.5;
            
            dot_intern(rx, ry, spotk, c, m, y, k, 0.4);
            if (RASTER_MODE != RASTER_MODES.CMYK) {
              return;
            }
            
            f1 = 0.1;
            dot_intern(rx-1, ry, spotk, c, m, y, k, f1);
            dot_intern(rx, ry+1, spotk, c, m, y, k, f1);
            dot_intern(rx+1, ry, spotk, c, m, y, k, f1);
            dot_intern(rx, ry-1, spotk, c, m, y, k, f1);
          }
          
          function dot_intern(rx, ry, spotk, c, m, y, k, alpha) {
            alpha = alpha == undefined ? 1 : alpha;
            
            var size = ~~(rasterfac*0.25);
            size = 0;
            
            var offs = cconst.get_spotfunc(size, spotk);

            if (size == 0) {
              var ridx = (ry*raster_image.width+rx)*4;
              
              rdata[ridx] = Math.max(rdata[ridx]-c*alpha, 0)//*(1.0-k);
              rdata[ridx+1] = Math.max(rdata[ridx+1]-m*alpha, 0);
              rdata[ridx+2] = Math.max(rdata[ridx+2]-y*alpha, 0);
              rdata[ridx+3] = 255;
              
              return;
            }
            
            for (var i=0; i<offs.length; i++) {
              var rx2 = rx + offs[i][0];
              var ry2 = ry + offs[i][1];
              
              if (rx2 < 0 || ry2 < 0 || rx2 >= raster_image.width || ry2 >= raster_image.height) {
                continue;
              }
              
              var ridx = (ry2*raster_image.width+rx2)*4;
              
              rdata[ridx] = Math.max(rdata[ridx]-c*alpha, 0)//*(1.0-k);
              rdata[ridx+1] = Math.max(rdata[ridx+1]-m*alpha, 0);
              rdata[ridx+2] = Math.max(rdata[ridx+2]-y*alpha, 0);
              rdata[ridx+3] = 255;
            }
          }

          clr1[0] = clr[0]; clr1[1] = clr[1]; clr1[2] = clr[2];
          
          if (DITHER_COLORS && (RASTER_IMAGE && RASTER_MODE != RASTER_MODES.CMYK)) {
            //igx = ~~((x*0.5+0.5)*size);
            //igy = ~~((y*0.5+0.5)*size);
            
            var gidx = ~~((igy*size + igx)*3);
                      
            clr1[0] += grid[gidx];
            clr1[1] += grid[gidx+1];
            clr1[2] += grid[gidx+2];
          
            ci = colors.closest_color_fast(clr1);
            colors.colors_used[ci]++;
            
            var clr2 = colors.colors[ci];

            var dr = (clr1[0]-clr2[0]);
            var dg = (clr1[1]-clr2[1]);
            var db = (clr1[2]-clr2[2]);
            
            var sat = Math.abs(1.0-clr[0]) +  Math.abs(1.0-clr[1]) +  Math.abs(1.0-clr[2]);
            sat /= 3.0;
            
            //scale color error by spacing of points
            if (CORRECT_FOR_SPACING) {
              var avg = (clr[0]+clr[1]+clr[2])/3.0;
              var sat2 = Math.abs(avg-clr[0]) +  Math.abs(avg-clr[1]) +  Math.abs(avg-clr[2]);
              sat2 /= 3.0;
              
              var ffac = Math.pow(1.0-f, 0.5);
              ffac = 1.0 - f*f*sat2;
              
              dr *= ffac;
              dg *= ffac;
              db *= ffac;
            }
            
            //apply error diffusion to color
            
            for (var fi=0; fi<fil.length; fi++) {
              for (var fj=0; fj<fil[fi].length; fj++) {
                var fi2 = fi;
                var fj2 = fj - 2;
                
                var igx2 = igx + (flip ? -fj2 : fj2);
                var igy2 = igy + fi2;
                
                if (igx2 >= size || igy2 >= size) {
                  continue;
                }
                if (igx2 < 0 || igy2 < 0) {
                  continue;
                }
                
                var fmul = this.filter.wrand*(this.random()-0.5);
                fmul += (this.random()-0.5)*0.05;
                
                var gidx2 = (igy2*size + igx2)*3;

                grid[gidx2] += fil[fi][fj]*dr + fmul;
                grid[gidx2+1] += fil[fi][fj]*dg + fmul;
                grid[gidx2+2] += fil[fi][fj]*db + fmul;
                
                grid[gidx2] = Math.min(Math.max(grid[gidx2], -1.0), 1.0);
                grid[gidx2+1] = Math.min(Math.max(grid[gidx2+1], -1.0), 1.0);
                grid[gidx2+2] = Math.min(Math.max(grid[gidx2+2], -1.0), 1.0);
              }
            }
          } else {
            if (ci == undefined) {
              ci = colors.closest_color_fast(clr);
            }
            var clr2 = colors.colors[ci];
            
            if (clr2 == undefined) {
              //console.log(ci);
              //throw new Error("eek!");
              console.warn("eek!", ci);
              ci = 0;
              colors.colors[ci];
            }
            
            clr1[0] = clr2[0];
            clr1[1] = clr2[1];
            clr1[2] = clr2[2];
            
            var sat = Math.abs(1.0-clr2[0]) +  Math.abs(1.0-clr2[1]) +  Math.abs(1.0-clr2[2]);
            sat /= 3.0;
          }

          var do_raster = RASTER_IMAGE && rdata != undefined;
          if (do_raster && RASTER_MODE == RASTER_MODES.DIFFUSION) {
            var clr2 = colors.colors[ci];
            
            var rix = ~~((x*0.5+0.5001)*raster_image.width*0.99999), riy = ~~((y*0.5+0.5001)*raster_image.height*0.99999);
            var ridx = (riy*raster_image.width + rix)*4;
            
            rdata[ridx] = ~~(clr2[0]*255);
            rdata[ridx+1] = ~~(clr2[1]*255);
            rdata[ridx+2] = ~~(clr2[2]*255);
            rdata[ridx+3] = 255;
            
            ok=1;
          } else if (do_raster && do_cmyk_raster && ((rok || gok || bok) || ok)) {
            var rix = ~~((x*0.5+0.5001)*raster_image.width*0.99999), riy = ~~((y*0.5+0.5001)*raster_image.height*0.99999);
            var ridx = (riy*raster_image.width + rix)*4;

            var rix2 = ~~((x*0.5+0.5001)*2*raster_image.width*0.99999), riy2 = ~~(2*(y*0.5+0.5001)*raster_image.height*0.99999);
            //rdata[ridx] = rdata[ridx+1] = rdata[ridx+2] = 255;
            
            
            
            if (bok) {
              dot(rix, riy, fb, 0, 0, 255, 0);
            }
            
            //*
            if (rok) {
              dot(rix, riy, fr, 255, 0, 0, 0);
            }
            
            if (gok) {
              dot(rix, riy, fg, 0, 255, 0, 0);
            } 
            
            if (fok) {
              dot(rix, riy, f, 255, 255, 255, 0);
            }
            //*/
          }
          
          if (RASTER_IMAGE) {
            continue;
          }
          
          if (!ok) {
            continue;
          }
          
          var pi = points.length;
          for (var j=0; j<PTOT; j++) {
            points.push(0);
          }

          points[pi] = x;
          points[pi+1] = y;
          points[pi+2] = start_r//*(1.0 + 0.25*(sat));
          points[pi+PINTEN] = finten;
          points[pi+PID] = ci;
          points[pi+PLVL] = lvl;
          points[pi+PRADIUS2] = -1;//points[pi+PRADIUS];
          
          points[pi+POX] = points[pi+POLDX] = points[pi];
          points[pi+POY] = points[pi+POLDY] = points[pi+1];
          
          this.calc_theta(pi);
      }
      
      if (!skip_points_display) {
        console.log("points", points.length/PTOT);
        console.log("\n");
      }
      
      this.calc_derivatives();

      if (TRI_MODE && !skip_points_display) {
        console.log("regenerating triangulation...");
        this.del();
      } else if (SCALE_POINTS && !skip_points_display) {
        this.calc_radii();
      }
    },

    function init(size) {
      var diag = 1.00001 / DIMEN;
    
      diag = Math.sqrt(diag*diag + diag*diag);
      
      this.r = diag;
      this.cur = 0;
      this.start_r = this.r;
      this.gridsize = size;
      
      this.errgrid = new Float64Array(size*size*3);
      this.errgrid.fill(0, 0, this.errgrid.length);
      
      new indexdb_store.IndexDBStore("bluenoise_mask").read("data").then((result) => {
        if (result === undefined) {
          result = smoothmask_file;
        }
        
        this.load_mask(result);
      });
    },
    
    //maskdata is data url, url that has full image encoded in it
    function load_mask(maskdata) {
      if (maskdata.startsWith("SMOOTHMASK")) {
        maskdata = maskdata.slice(10, maskdata.length);
        
        this.smask = new smoothmask.PointSet().fromBinary(maskdata);
      } else {
        this.smask = undefined;
        
        this._mask = new Image();
        this._mask.src = maskdata;

        var this2 = this;
        this._mask.onload = function() {
          this.mask = this._mask;
          this2.on_image_read(this2._mask, 'mask');
        }
      }
    },

    function random() {
      if (this._random != undefined) {
        return this._random.random();
      }
      
      return Math.random();
    },
    
    //raster_image is optional
    function reset(raster_image) {
      if (USE_MERSENNE) {
        this._random = new util.MersenneRandom(0);
      } else {
        this._random = undefined;
      }
      
      this.raster_image = raster_image;
      this.dimen = DIMEN;
      
      this.cur = 0;
      this.points = [];
      this.errgrid.fill(0, 0, this.errgrid.length);
      
      if (_appstate.image !== undefined && _appstate.image.data !== undefined) {
        this.sampler = sampler.sampler;
        this.image = _appstate.image;
        
        if (this.image.data.orig === undefined) {
          this.image.data.orig = new Uint8Array(this.image.data.data.length);
          this.image.data.orig.set(this.image.data.data);
        }
        
        this.image.data.data.set(this.image.data.orig);
        this.image.fdata = new Float32Array(this.image.data.orig);
        
        if (HIST_EQUALIZE) {
          this.image.fdata = sampler.histEqualize(this.image).fdata;
          sampler.fdataToData8(this.image.fdata, this.image.data.data);
        }
        
        if (DEBAND_IMAGE) {
          this.image.fdata = sampler.debandImage(this.image).fdata;
        }
        
        this.dvimage = new ImageData(this.image.width, this.image.height);
        
        //this.image.data.data.fill(0, 0, this.image.data.data.length);
        sampler.fdataToData8(this.image.fdata, this.dvimage.data);
      }
      
      redraw_all();
    },
    
    function on_image_read(img, field) {
      console.log("got", field, "image")

      var this2 = this;
      
      if (img.width == 0) {
        console.log("Problem loading image. . .");
        
        var timer = window.setInterval(function() {
          if (img.width != 0) {
            window.clearInterval(timer);
            this2.on_image_read(img, field);
            console.log(". . .or not, image has (finally!) loaded");
          }
        }, 500);
        
        return;
      }

      //extract image data
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var g = canvas.getContext('2d')
      g.drawImage(img, 0, 0);
      
      this[field] = img;
      
      if (img.width == 0) {
        console.log("eek", img.width, img.height);
        return;
      }
      
      var data = g.getImageData(0, 0, img.width, img.height);
      this[field].data = data;
    },
    
    function calc_kdtree(orig_cos) {
      console.log("building kdtree. . .");
      
      let ps = this.points;
      let tree = this.kdtree2 = new kdtree2.KDTree([-2,-2,-2], [2,2,2]);
      let visit = {};
      let totdone = 0;
      
      while (totdone < ps.length/PTOT) {
        let pi = (~~(Math.random()*ps.length/PTOT*0.9999999))*PTOT;
        
        if (pi in visit) {
          continue;
        }
        
        visit[pi] = 1;
        totdone++;
        
        var x = ps[pi], y = ps[pi+1];
        
        if (orig_cos) {
          x = ps[pi+POX], y = ps[pi+POY];
        }
        
        tree.insert(x, y, pi);
      }
      
      /*
      for (let pi=0; pi<ps.length; pi += PTOT) {
        var x = ps[pi], y = ps[pi+1];
        
        if (orig_cos) {
          x = ps[pi+POX], y = ps[pi+POY];
        }
        
        tree.insert(x, y, pi);
      }*/

      //tree.balance();
      
      return tree;
      /*
      var kd = new kdtree.KDTree();
      var ps = this.points;
      
      for (var i=0; i<ps.length; i += PTOT) {
        var x = ps[i], y = ps[i+1];
        if (orig_cos) {
          x = ps[i+POX], y = ps[i+POY];
        }
        
        kd.insert(x*0.5+0.5, y*0.5+0.5, i/PTOT);
      }
      
      this.kdtree = kd;
      
      return kd;//*/
    },
    
    function calc_theta(pi) {
      let ps = this.points, isize = _appstate.image.width;
      
      let x = ps[pi], y = ps[pi+1];

      let dx, dy;
      
      /*
      try and correct for 8-bit alias errors
      by first sampling derivative, and then scaling
      the finite difference width by how small the derivative
      is
      */
      for (let step=0; step<1; step++) {
        let df = 8/isize;

        if (step) {
          let mag = Math.sqrt(dx*dx + dy*dy) / Math.sqrt(2.0);

          if (mag > 0.8) {
          //  break;
          }
          
          mag = 1.0 - mag;
          mag = Math.pow(mag, 4.0);

          let a = Math.pow(4, step);
          let b = Math.pow(4, (step+1));

          df = (a + (b - a)*mag)/isize;
        }

        let clr = this.sampler(x, y, this.gridsize, 1.0, undefined, true);

        if (clr[0] < 0) {
          return; //dropped point
        }
        
        let f1 = this.calcIntensity(clr[0], clr[1], clr[2]);

        clr = this.sampler(x+df, y, this.gridsize, 1.0, undefined, true);
        let f2 = this.calcIntensity(clr[0], clr[1], clr[2]);

        clr = this.sampler(x, y+df, this.gridsize, 1.0, undefined, true);
        let f3 = this.calcIntensity(clr[0], clr[1], clr[2]);

        dx = (f2 - f1) / df;
        dy = (f3 - f1) / df;
      }

      ps[pi+PTH] = -Math.atan2(dy, dx);
    },
    
    function calc_thetas() {
      let ps = this.points;
      
      let isize = _appstate.image.width;
      
      for (let pi=0; pi<ps.length; pi += PTOT) {
        this.calc_theta(pi);
      }
    },
    
    function calc_radii_old(use_orig_cos) {
      var ps = this.points;
      var kd = this.calc_kdtree(true);
      
      var GIDX = 0, GTOT = 1;
      
      var size = this.dimen;

      for (var i=0; i<ps.length; i += PTOT) {
        //ps[i+PRADIUS2] = -1;
      }
      
      for (var i=0; i<ps.length; i += PTOT) {
        var x, y;
        
        if (use_orig_cos) {
          x = ps[i+POX], y = ps[i+POY];
        } else {
          x = ps[i], y = ps[i+1];
        }
      }
      
      var minrad = 1 / (this.dimen*Math.sqrt(2));
      var minrad2 = 1e17;
      var tot, avgr, minr, maxr, x1, y1, ix, iy, ix1, iy1;
      
      //most masks have maximum radius
      //between 6 and 9.5 times minimum radius
      
      var maxrad = minrad*10.0;
      console.log("maxrad", maxrad, minrad);
      
      var rd = ~~(maxrad*size+2);
      var offs = cconst.get_searchoff(rd);
      
      var min = Math.min, max = Math.max;
      
      console.log("rd", rd, minrad, offs.length);
      
      function pointcallback(pi) {
        if (pi == i) return;
        
        var x2 = ps[pi+POX], y2 = ps[pi+POY];
        
        var dx = x2-x1, dy = y2-y1;
        var dis = dx*dx + dy*dy;
        dis = dis != 0.0 ? Math.sqrt(dis) : 0.0;
        
        var w = max(1.0 - dis/maxrad, 0.0);
        w *= w*w;
        
        minr = min(dis, minr);
        maxr = max(dis, maxr);
        minrad2 = min(dis, minrad2);
        
        avgr += dis*w;
        tot += w;
        
        //if (isNaN(w) || isNaN(tot)) {
        //  throw new Error("nan!");
        //}
      }
      
      for (var i=0; i<ps.length; i += PTOT) {
        var x = ps[i+POX], y = ps[i+POY];
       
        if (ps[i+PRADIUS2] != -1) {
          continue;
        }
        
        ix = (x*0.5+0.5)*size + 0.0001, iy = (y*0.5+0.5)*size + 0.0001;
        x1=x, y1=y, ix1=ix, iy1=iy;
        minr = 1e17, maxr = -1e17, avgr = 0;
        tot = 0;
        
        kd.forEachPoint(x, y, maxrad, pointcallback, this);

        if (tot == 0) {
          ps[i+PRADIUS2] = minrad*4.0;
          continue;
        }
        
        avgr /= tot;
        
        if (isNaN(tot) || isNaN(avgr)) {
          console.log(avgr, tot, x, y, maxrad);
          throw new Error("NaN!");
        }
        
        var r = avgr*0.5;
        
        ps[i+PRADIUS2] = r;
        //ps[i+PRADIUS] = r;
      }
      
      this.minr = minrad2;
      console.log("MINR2", this.minr);
    },
    
    function del() {
      this.tris = [];
      this.calc_radii();
      
      var ps2 = [], ps = this.points;
      for (var i=0; i<ps.length; i += PTOT) {
        ps2.push([ps[i], ps[i+1]]);
      }
      
      var tris = Delaunay.triangulate(ps2);
      
      this.tris = tris;
      
      var plen = this.points.length/PTOT;
      var vcells = this.vcells = new Float64Array(plen*MAX_VCELL_SIZE);
      
      vcells.fill(-1, 0, vcells.length);
      
      for (var i=0; i<tris.length; i += 3) {
        for (var j=0; j<3; j++) {
          var v1 = tris[i+j], v2 = tris[i + ((j+1)%3)];
          var v3 = tris[i + ((j+2)%3)];
          
          var vk = v1*MAX_VCELL_SIZE;
          var bad = 0;
          
          for (var k=0; k<MAX_VCELL_SIZE; k++, vk++) {
            if (vcells[vk] == v2) {
              bad = 1;
              break;
            } else if (vcells[vk] == -1) {
              break;
            }
          }
          
          if (bad || k >= MAX_VCELL_SIZE) {
            continue;
          }
          
          vcells[vk] = v2;
        }
      }
      
      var sortlst = new Float64Array(MAX_VCELL_SIZE);
      
      //closure communication vars
      var x, y;
      function sortcmp(a, b) {
        if (a == -1) return 1;
        else if (b == -1) return -1;
        
        var ang1 = Math.atan2(ps[a*PTOT+1]-y, ps[a*PTOT]-x);
        var ang2 = Math.atan2(ps[b*PTOT+1]-y, ps[b*PTOT]-x);
        
        return ang1 - ang2;
      }
      
      for (var i=0; i<vcells.length; i += MAX_VCELL_SIZE) {
        var pi = i / MAX_VCELL_SIZE;
        x = ps[pi*PTOT], y = ps[pi*PTOT+1];
        
        for (var j=0; j<MAX_VCELL_SIZE; j++) {
          sortlst[j] = vcells[i+j];
        }
        
        sortlst.sort(sortcmp);
        for (var j=0; j<MAX_VCELL_SIZE; j++) {
          vcells[i+j] = sortlst[j];
        }
      }
      
      console.log("total tris:", tris.length/3);
    },
    
    function getMaskPoints() {
      let ps = [];
      
      if (this.smask) {
        for (let path of this.smask.points) {
          let pi = ps.length;
          
          for (let i=0; i<PTOT; i++) {
            ps.push(0);
          }
          
          let co = path.evaluate(path.gen);
          
          ps[pi] = co[0];
          ps[pi+1] = co[1];
          ps[pi+PLVL] = path.gen;
        }
        
        return ps;
      } else {
        if (this.mask.data === undefined) {
          console.warn("Mask hasn't loaded yet");
          return [];
        }
        
        let ps = [];
        let size = this.mask.width;
        let mdata = this.mask.data.data;
        let ilen = size*size;
        
        for (let i=0; i<ilen; i++) {
          let ix = i % size, iy = ~~(i / size);
          let x = ix/size, y = iy/size;
          
          let idx = (iy*size + ix)*4;
          
          if (!SMALL_MASK && mdata[idx] == 0) {
            continue;
          }
          
          let pi = ps.length;
          for (let j=0; j<PTOT; j++) {
            ps.push(0);
          }
          
          ps[pi] = x;
          ps[pi+1] = y;
          ps[pi+PLVL] = 1.0 - mdata[idx]/255.0;
        }
        
        return ps;
      }
    },
    
    function getMaskCDF() {
      let cdf = new Float64Array(1024);
      let ps = this.getMaskPoints();

      cdf.fill(0, 0, cdf.length);

      for (let pi=0; pi<ps.length; pi += PTOT) {
        let gen = ps[pi+PLVL];

        let ci = ~~(gen*cdf.length*0.999999);
        cdf[ci]++;
      }

      for (let i=1; i<cdf.length; i++) {
            cdf[i] = cdf[i-1] + cdf[i];
      }

      return cdf;
    },

    function calc_radii() {
      console.log("updating radii");
      //this.calc_radii_old(false);
      
      let cdf = this.getMaskCDF();
      let masksize;

      if (this.smask !== undefined) {
          masksize = this.smask.blocksize;
      } else if (!SMALL_MASK) {
          masksize = this.mask.width;
          masksize = XLARGE_MASK ? masksize/8 : masksize/4;
      } else {
          masksize = this.mask.width;
      }

      let maskscale = masksize / this.dimen;

      let size = this.dimen;
      let ps = this.points;
      
      //let minrad = 2.5 / (Math.sqrt(2)*this.dimen);
      //let maxrad = minrad*6;
      let sqrt3 = Math.sqrt(3);

      let radmul = 0.85;

      let startgen = cdf[0];
      for (let i=0; i<cdf.length; i++) {
        if (cdf[i] != 0) {
          startgen = cdf[i];
          break;
        }
      }

      let minrad = radmul / Math.sqrt(cdf[cdf.length-1]+1) * maskscale;
      let maxrad = radmul / Math.sqrt(startgen + masksize*0.005) * maskscale; //ensure radius doesn't get too big by adding chunk of masksize
      
      //maxrad = 18 * 0.95 / Math.sqrt(this.dimen*this.dimen);

      /*
      console.log("building kdtree. . .");
      for (let pi=0; pi<ps.length; pi += PTOT) {
          tree.insert(ps[pi], ps[pi+1], pi);
      }//*/
      
      //*
      for (var i=0; i<ps.length; i += PTOT) {
        let f;
        if (0) { //resample
              let clr = this.sampler(ps[i], ps[i+1], this.gridsize, 1.0);

              if (clr[0] < 0) { //sampler requested we discard the point.  try original location
                clr = this.sampler(ps[i+POX], ps[i+POY], this.gridsize, 1.0);
                ps[i+PBAD] = 1;
              } else {
                ps[i+PBAD] = 0;
              }

              if (clr[0] < 0) { //point is still bad?
                ps[i+PRADIUS2] = minrad*0.5;
                ps[i+PBAD] = 1;
                continue;
              }

              f = this.calcIntensity(clr[0], clr[1], clr[2]);
              //f = clr[0]*clr[0] + clr[1]*clr[1] + clr[2]*clr[2];
              //f = f != 0.0 ? Math.sqrt(f) / sqrt3 : 0.0;

              let sat = Math.abs(1.0-clr[0]) +  Math.abs(1.0-clr[1]) +  Math.abs(1.0-clr[2]);
              sat /= 3.0;

              if (ADAPTIVE_COLOR_DENSITY) {
                //scale spacing of points by saturation (how much color there is)
                f *= Math.pow(1.0-sat, 2);
              }
        } else {
            f = ps[i+PINTEN];
        }

        //relax2() is naturally a blurring operation
        //make it sharpen instead by warping the radii.

        //f = Math.pow(f, 1.25);
        //or not

        //calculate final radius
        f = 1.0 - f;
        f = Math.min(Math.max(f, 0.0), 1.0)*0.999999; //clamp

        let ci = ~~(f*cdf.length);
        let g = cdf[ci];
        //g = f*size*size;
        let r = 2.0*radmul / Math.sqrt(g+masksize*0.005)*maskscale;
        //let r = minrad + (maxrad - minrad)*f;
        

        //r = Math.min(r, maxrad);

        ps[i+PRADIUS2] = r;
      }//*/

      return maxrad;
    },
    
    function calc_derivatives() {
      console.log("updating point derivatives with respect to the image");
      
      let size = this.dimen;
      let isize = _appstate.image.width;
      let ps = this.points;

      //calculate image gradients
      for (let pi=0; pi<ps.length; pi += PTOT) {
        let x = ps[pi], y = ps[pi+1];
        let clr = this.sampler(x, y, this.gridsize, 1.0);
        
        if (clr[0] < 0) { //dropped point?
          continue;
        }
        
        let f1 = (clr[0] + clr[1] + clr[2]) / 3.0;
        
        let df = 5/isize;

        clr = this.sampler(x + df, y, this.gridsize, 1.0);
        let f2 = (clr[0] + clr[1] + clr[2]) / 3.0;
        
        clr = this.sampler(x, y + df, this.gridsize, 1.0);
        let f3 = (clr[0] + clr[1] + clr[2]) / 3.0;
        
        let dx = f2 - f1, dy = f3 - f1;
        
        //let l = Math.sqrt(dx*dx + dy*dy);
        
        //if (l > 0) {
          //dx /= l;
          //dy /= l;
        //}

        ps[pi+PINTEN] = f1;
        ps[pi+PDX] = dx/df;
        ps[pi+PDY] = dy/df;
      }
    },
    
    function relax2() {
      let size = this.dimen;
      let ps = this.points;
      
      let minrad = 2.5 / (Math.sqrt(2)*this.dimen);
      let maxrad = minrad*6;
      
      let sumdx=0, sumdy=0, sumw=0, x1=0, y1=0, r1=0, pi1, searchr;
      let tree = this.calc_kdtree();
      
      let anis_w1 = ANIS_W1, anis_w2 = ANIS_W2;
      /*
      let asum = (anis_w1+anis_w2);
      
      if (asum != 0) {
        anis_w1 /= asum;
        anis_w2 /= asum;
      }
      //*/
      
      let p = [0, 0, 0];
      const searchfac = ANISOTROPY ? ANISOTROPY_FILTERWID : FILTERWID;
      const sqrt3 = Math.sqrt(3.0);

      maxrad = this.calc_radii();
      
      let isize = _appstate.image.width;

      //calculate image gradients
      this.calc_derivatives();
      
      function distmetric(pi1, pi2) {
        let x1 = ps[pi1], y1 = ps[pi1+1], x2=ps[pi2], y2 = ps[pi2+1];
        let gen1 = ps[pi1+PLVL], gen2=ps[pi2+PLVL], r1=ps[pi1+PRADIUS2], r2=ps[pi2+PRADIUS2];
        
        if (ANISOTROPY) {
          let dx = x1-x2, dy = y1-y2;
          let dis = Math.sqrt(dx*dx + dy*dy);
          let dx1 = ps[pi1+PDX], dy1 = ps[pi1+PDY];
          let dx2 = ps[pi2+PDX], dy2 = ps[pi2+PDY];

          /*
           on factor;
           off period;
          
           comment: taken from anisotropic blue noise paper(s);
           metric := mat((a1, a2), (b1, b2));
           dmat := mat((x1-x2), (y1-y2));
  
           ff := (tp dmat) * metric * dmat;
           ff := part(ff, 1, 0);

           comment: taken from anisotropic blue noise paper(s);
           fx := fx;
           fy := fy;
           fi := i(fx, fy);
          
           comment
           1       0     dx
           0       1     dy
           1/dx  1/dy    1
           ;

           metric := mat((1, 0, dx), (0, 1, dy), (1/dx, 1/dy, 1))*density;
           dmat := mat((x1-x2), (y1-y2), (i1-i2));
           
           ff := (tp dmat) * metric * dmat;
           ff := part(ff, 1, 0);
          */
          
          /*
          let dot2 = (dx1*(x2-x1)) + (dy1*(y2-y1));
          
          if (dot2 < 0) {
            dx1 = -dx1;
            dy1 = -dy1;
          }
          
          let dot = dx1*dx2 + dy1*dy2;
          
          if (dot < 0) {
            dx2 = -dx2;
            dy2 = -dy2;
          }
          //*/

          /*
          let a1 = dx1, a2 = dy1, b1 = dx2, b2 = dy2;

          dis = a1*x1**2-2.0*a1*x1*x2+a1*x2**2+a2*x1*y1-a2*x1*y2-a2*x2*y1+a2
                *x2*y2+b1*x1*y1-b1*x1*y2-b1*x2*y1+b1*x2*y2+b2*y1**2-2.0*b2*y1*
                y2+b2*y2**2;
         //*/

         /*
         let i1 = ps[pi1+PINTEN], i2 = ps[pi2+PINTEN];
         dx = dx1, dy = dy1;
         
         dx = dx != 0 ? 1.0 / dx : 0;
         dy = dy != 0 ? 1.0 / dy : 0;
         let density = 1.0 - i1;
         
         if (dx*dy == 0) {
           dis = 0;
         } else {
           //dis=(dx**2*dy*i1*x1-dx**2*dy*i1*x2-dx**2*dy*i2*x1+dx**2*dy*i2*
           //     x2+dx*dy**2*i1*y1-dx*dy**2*i1*y2-dx*dy**2*i2*y1+dx*dy**2*i2*y2
           //     +dx*dy*i1**2-2.0*dx*dy*i1*i2+dx*dy*i2**2+dx*dy*x1**2-2.0*dx*dy
           //     *x1*x2+dx*dy*x2**2+dx*dy*y1**2-2.0*dx*dy*y1*y2+dx*dy*y2**2+dx*
           //     i1*y1-dx*i1*y2-dx*i2*y1+dx*i2*y2+dy*i1*x1-dy*i1*x2-dy*i2*x1+dy
           //     *i2*x2)/(dx*dy);
                
           
           dis=(density*(dx**2*dy*i1*x1-dx**2*dy*i1*x2-dx**2*dy*i2*x1+dx**
                2*dy*i2*x2+dx*dy**2*i1*y1-dx*dy**2*i1*y2-dx*dy**2*i2*y1+dx*dy
                **2*i2*y2+dx*dy*i1**2-2.0*dx*dy*i1*i2+dx*dy*i2**2+dx*dy*x1**2-
                2.0*dx*dy*x1*x2+dx*dy*x2**2+dx*dy*y1**2-2.0*dx*dy*y1*y2+dx*dy*
                y2**2+dx*i1*y1-dx*i1*y2-dx*i2*y1+dx*i2*y2+dy*i1*x1-dy*i1*x2-dy
                *i2*x1+dy*i2*x2))/(dx*dy);
          }

          //return dis*0.0025*(1.0-i1*i1); //Math.max(dis * (0.25 + dis2), 0.0); //ps[pi1+PRADIUS2];// + 0.35*(2.0-tdis)*ps[pi1+PRADIUS2];
          //*/

          
          dx = (x2 - x1), dy = (y2 - y1);
          
          dx1 = Math.sin(ps[pi1+PTH] + (STICK_ROT/180.0*Math.PI) + Math.PI*0.5);
          dy1 = Math.cos(ps[pi1+PTH] + (STICK_ROT/180.0*Math.PI) + Math.PI*0.5);
          
          dis = Math.abs(dx*dy1 - dy*dx1);
          
          let dis2 = Math.sqrt(dx*dx + dy*dy);
          
          //let t = dx*dx1 + dy*dy1;
          //if (t > 0 && t < dis2)
          //  return Math.min(dis, dis2)*anis_w1;
          //return dis2*anis_w1;
          
          //dis = Math.sqrt(dis);
          return dis*anis_w1 + dis2*anis_w2;
        } else {
          let dx = x1-x2, dy = y1-y2;
          
          let dis = Math.sqrt(dx*dx + dy*dy);
          return dis;
        }
      }
      
      let callback = (pi2) => {
        let x2 = ps[pi2], y2 = ps[pi2+1], r2 = ps[pi2+PRADIUS2];
        let dx = x2-x1, dy = y2-y1;
        
        if (isNaN(dx) || isNaN(dy)) {
          throw new Error("nan!");
        }
        
        //let dis = dx*dx + dy*dy;
        
        let dis = distmetric(pi1, pi2);
        
        if (dis == 0.0 || dis > searchr) {
          return;
        }
        
        let w = 1.0 - dis / searchr;

        if (USE_SPH_CURVE) {
          w = SPH_CURVE.evaluate(w);
        } else {
          //guassian curve with std deviation of 0.37 to be a bit sharpening

          //let r = this.height * Math.exp(-((s-this.offset)*(s-this.offset)) / (2*this.deviation*this.deviation));
          w = Math.exp(-((w-1.0)**2) / (2*0.37**2));
          //w = Math.pow(w, ANISOTROPY ? 6.0 : 4.0);
          //w = w*w*(3.0 - 2.0*w);
        }

        //*
        //go a bit above top radius to avoid gaps from not having the perfect number of points
        //let r3 = Math.max(r1, r2)*2.0;//*1.5;
        let r3 = r1+r2;

        //r3 = 0.5*(r1 + r2); 

        dx *= (r3 - dis)/dis;
        dy *= (r3 - dis)/dis;
        //*/

        /*
        dx /= dis;
        dy /= dis;
         
        dis = Math.max(r1, r2)*4.0 - dis; //go a bit above r*2.0 to avoid gaps from not having the perfect number of points
        dx *= dis;
        dy *= dis;
        
        //w *= r2
        //*/

        /*
        let rf = r2/maxrad;
        rf = rf*rf*(3.0-2.0*rf);
        
        w *= rf*rf;
        //*/

        //if (ANISOTROPY) {
          //dx += -ps[pi2+PDY]*1.5*w;
          //dy += ps[pi2+PDX]*1.5*w;
        //}

        sumdx += -dx*w;
        sumdy += -dy*w;
        sumw  += w;
      }
      
      console.log("relaxing (sph). . .");
      for (pi1=0; pi1<ps.length; pi1 += PTOT) {
        x1 = ps[pi1], y1 = ps[pi1+1], r1 = ps[pi1+PRADIUS2];
        
        //r1 = minrad*0.5;
        searchr = r1*searchfac;
        sumdx = sumdy = sumw = 0.0;
        
        //tree.forEachPoint(x1, y1, searchr, callback, this);
        p[0] = x1, p[1] = y1;
        
        /*
        for (let pi2=0; pi2<ps.length; pi2 += PTOT) {
          callback(pi2);
        }
        //*/
        
        tree.search(p, searchr, callback);
        
        if (sumw == 0.0) {
          continue;
        }
        
        sumdx /= sumw;
        sumdy /= sumw;
        
        let fac = RELAX_SPEED*0.4625*(ANISOTROPY ? 0.4 : 1.0);
        if (ps[pi1+PBAD] > 0) {
          fac *= 0.15;
        }
                
        let startx = ps[pi1], starty = ps[pi1+1];

        ps[pi1] += sumdx*fac;
        ps[pi1+1] += sumdy*fac;
        
        //if on a transparent (undefined) part of the image, pull towards original location
        if (ps[pi1+PBAD] > 0) {
          let dx = ps[pi1+POX] - ps[pi1];
          let dy = ps[pi1+POY] - ps[pi1+1];
          
          let fac2 = RELAX_SPEED*0.1;

          ps[pi1] += dx*fac2;
          ps[pi1+1] += dy*fac2;
        }

        ps[pi1] = Math.min(Math.max(ps[pi1], -1.0), 1.0);
        ps[pi1+1] = Math.min(Math.max(ps[pi1+1], -1.0), 1.0);
        
      }

      if (RELAX_UPDATE_VECTORS) {
        for (let pi1=0; pi1<ps.length; pi1 += PTOT) {
          this.calc_theta(pi1);
        }
      }
      
      if (TRI_MODE) {
        console.log("regenerating triangulation...");
        this.del();
      }
      
      this.calc_radii();
      console.log("done");
    },
    
    function sample_radii() {
      let ps = this.points;
      var minrad = 2.5 / (Math.sqrt(2)*this.dimen);
      //most masks have maximum radius
      //between 6 and 9.5 times minimum radius
      
      var maxrad = minrad*6.0;
      
      for (var i=0; i<ps.length; i += PTOT) {
        //ps[i+PRADIUS2] *= 1.0;
      //*
        let clr = this.sampler(ps[i], ps[i+1], this.gridsize, 1.0);
        
        if (clr[0] < 0) { //sampler requested we discard the point
          continue;
        }
        
        let f = this.calcIntensity(clr[0], clr[1], clr[2]);
        //let f = clr[0]*clr[0] + clr[1]*clr[1] + clr[2]*clr[2];
        //f = f != 0.0 ? Math.sqrt(f) / Math.sqrt(3) : 0.0;
        
        let sat = Math.abs(1.0-clr[0]) +  Math.abs(1.0-clr[1]) +  Math.abs(1.0-clr[2]);
        sat /= 3.0;
        
        if (ADAPTIVE_COLOR_DENSITY) {
          //scale spacing of points by saturation (how much color there is)
          f *= Math.pow(1.0-sat, 2);
          //f = f*f;
        }
        
        f = Math.pow(f, 0.25);
        //t += (t*t - t)*t;
        
        let r = minrad + (maxrad - minrad)*f;
        //r = minrad;
        ps[i+PRADIUS2] = r;
        
        //ps[i+PRADIUS2] *= (2.0 - Math.pow(t, 0.1))*2.5*this.dimen/size;
        //ps[i+PRADIUS2] = 7.0/size;
        //*/
      }
    },
    
    function relax3() {
      this.sample_radii();
      console.log("relaxing");
      
      var GN=0, GDX=1, GDY=2, GSUM=3, GNUM=4, GW=5, GTOT=6;
      var size = this.dimen*2;
      
      var grid = new Float64Array(size*size*GTOT);
      
      function reset_grid() {
        grid.fill(0, 0, grid.length);
      }
      reset_grid();
      
      var ps = this.points;
      let totw = 0.0;
      
      let searchfac = 3.0;
      
      for (let pi=0; pi<ps.length; pi += PTOT) {
        let x = ps[pi], y = ps[pi+1], r = ps[pi+PRADIUS2];
        let searchr = r*searchfac;
        let n = Math.ceil(searchr*size);
        
        let ix = ((x*0.5+0.5)*size);
        let iy = ((y*0.5+0.5)*size);
        let dx = Math.fract(ix), dy = Math.fract(iy);
        
        ix = ~~ix;
        iy = ~~iy;
        
        let dis = dx*dx + dy*dy;
        dis = dis != 0.0 ? Math.sqrt(dis) : 0.0;
        let w = 1.0 - dis/Math.sqrt(2.0);
        w *= w;
        
        let idx = (iy*size + ix)*GTOT;
        
        grid[idx+GN] += n;
        grid[idx+GNUM] += 1.0;
        
        //w = 1.0;
        grid[idx+GW] += r*r*w*size;
        grid[idx+GSUM] += w;
      }
      
      function getw(idx) {
        if (grid[idx+GSUM] == 0.0)
          return 0.0
        
        return grid[idx+GW] / grid[idx+GSUM];
      }
      
      for (let si=0; si<2; si++) {
        let grid2 = grid.slice(0, grid.length);
        
        
        for (let gi=0; gi<grid.length; gi += GTOT) {
          grid[gi+GSUM] = grid[gi+GW] = 0.0;
          continue;
          
          if (grid[gi+GSUM] != 0.0) {
            grid[gi+GW] /= grid[gi+GSUM];
            grid[gi+GSUM] = 1.0;
          }
        }
        
        for (let ix=0; ix<size; ix++) {
          let n = 10;
          
          for (let iy=0; iy<size; iy++) {
            let idx = (iy*size + ix)*GTOT;
            
            for (let i=-n; i<= n; i++) {
              let w = 1.0 - (i + n + 1) / (2 * n + 1);
              w *= w*w;
              //w = w*w*(3.0 - 2.0*w);
              
              let ix2 = !si ? ix+i : ix;
              let iy2 =  si ? iy+i : iy;
              
              if (ix2 < 0 || ix2 >= size || iy2 < 0 || iy2 >= size) {
                continue;
              }
              
              let idx2 = (iy2*size + ix2)*GTOT;
              if (grid2[idx2+GSUM] == 0.0) {
                continue;
              }
              
              grid[idx+GW] += w*(grid2[idx2+GW] / grid2[idx2+GSUM]);
              grid[idx+GSUM] += w;
            }
          }
        }
      }
      
      for (let ix=0; ix<size-1; ix++) {
        for (let iy=0; iy<size-1; iy++) {
          let idx = (iy*size + ix)*GTOT;
          let idx2 = (iy*size + ix + 1)*GTOT;
          let idx3 = ((iy+1)*size + ix)*GTOT;
          
          if (isNaN(grid[idx+GSUM])) {
            console.warn("NaN again!");
            continue;
          }
          
          /*
          if (grid[idx+GSUM] == 0.0)
            continue;
          if (grid[idx2+GSUM] == 0.0)
            continue;
          if (grid[idx3+GSUM] == 0.0)
            continue;
          //*/
          
          let dx = getw(idx2) - getw(idx);
          let dy = getw(idx3) - getw(idx);
          
          if (isNaN(dx) || isNaN(dy)) {
            console.log("a NaN!");
            continue;
          }
          
          let fac = -5.0;
          grid[idx+GDX] = -dx*fac
          grid[idx+GDY] = -dy*fac
          totw += grid[idx+GSUM];
        }
      }
      
      grid.fill(0, 0, grid.length);
      totw = 0.0;
      
      let rd = 15;
      let offs = cconst.get_searchoff(rd);
      
      for (let pi=0; pi<ps.length; pi += PTOT) {
        let x = ps[pi], y = ps[pi+1], r = ps[pi+PRADIUS2];
        let searchr = r*searchfac;
        
        let ix = ~~((x*0.5 + 0.5)*size);
        let iy = ~~((y*0.5 + 0.5)*size);
        
        for (let off of offs) {
          let x2 = x + off[0]/size * 0.5, y2 = y + off[1] / size * 0.5;
          
          let ix2 = ix + off[0], iy2 = iy + off[1];
          if (ix2 < 0 || iy2 < 0 || ix2 >= size || iy2 >= size) continue;
          
          let idx = (iy2*size + ix2)*GTOT;
          let n2 = rd;
          let dx = off[0]/n2, dy = off[1]/n2;
          
          let w = dx*dx + dy*dy;
          
          w = w != 0.0 ? Math.sqrt(w) : 0.0;
          if (w > 1.0) {
            continue;
          }
          
          w = 1.0 - w;
          w *= w*w*w;
          w *= searchr;
          
          grid[idx+GW] += searchr*w;
          grid[idx+GSUM] += w;
          
          grid[idx+GDX] += dx*w;
          grid[idx+GDY] += dy*w;
          totw += w;
        }
      }

      console.log("totw:", totw);
      
      //apply filtered vectors
      for (let pi=0; pi<ps.length; pi += PTOT) {
        let x = ps[pi], y = ps[pi+1], r = ps[pi+PRADIUS2];
        let ix = ~~((x*0.5+0.5)*size), iy = ~~((y*0.5+0.5)*size);
        let idx = (iy*size + ix)*GTOT;
        
        let fac = RELAX_SPEED*0.5;
        
        if (isNaN(grid[idx+GSUM]) || isNaN(grid[idx+GDY]) || isNaN(grid[idx+GDX])) {
          console.warn("NaN!");
          continue;
          throw new Error("NaN!");
        }
        
        if (grid[idx+GSUM] == 0.0) {
          continue;
        }
        
        /*
        console.log(grid[idx+GSUM]);
        console.log(grid[idx+GDX]);
        console.log(grid[idx+GDY]);
        console.log("\n");
        //*/
        
        ps[pi] += fac*grid[idx+GDX] / grid[idx+GSUM];
        ps[pi+1] += fac*grid[idx+GDY] / grid[idx+GSUM];
        
        ps[pi] = Math.min(Math.max(ps[pi], -0.9999), 0.99999);
        ps[pi+1] = Math.min(Math.max(ps[pi+1], -0.9999), 0.9999);
      }
      
      if (TRI_MODE) {
        console.log("regenerating triangulation...");
        this.del();
      }
    },
    
    function relax() {
      this.relax2();
      //this.relax3();
      return;
      //return;
      
      //console.log("updating radii");
      //this.calc_radii(false);
      
      console.log("relaxing");
      
      var GW=0, GDX=1, GDY=2, GSUM=3, GTOT=4;
      var size = this.dimen*2;
      
      var grid = new Float64Array(size*size*GTOT);
      
      function reset_grid() {
        grid.fill(0, 0, grid.length);
      }
      reset_grid();
      
      var ps = this.points;
      
      var minrad = 2.5 / (Math.sqrt(2)*this.dimen);
      //most masks have maximum radius
      //between 6 and 9.5 times minimum radius
      
      var maxrad = minrad*6.0;
      var rd = ~~(minrad*size + 5);
      
      for (var i=0; i<ps.length; i += PTOT) {
        ps[i+PDX] = ps[i] - ps[i+POLDX];
        ps[i+PDY] = ps[i+1] - ps[i+POLDY];
        
        let fac = 0.99;
        ps[i] += ps[i+PDX]*fac;
        ps[i+1] += ps[i+PDY]*fac;
        
        ps[i+POLDX] = ps[i];
        ps[i+POLDY] = ps[i+1];
      }
      
      for (var i=0; i<ps.length; i += PTOT) {
        //ps[i+PRADIUS2] *= 1.0;
      //*
        let clr = this.sampler(ps[i], ps[i+1], this.gridsize, 1.0);
        
        if (clr[0] < 0) { //sampler requested we discard the point
          continue;
        }
        
        
        let f = this.calcIntensity(clr[0], clr[1], clr[2]);
        //let f = clr[0]*clr[0] + clr[1]*clr[1] + clr[2]*clr[2];
        //f = f != 0.0 ? Math.sqrt(f) / Math.sqrt(3) : 0.0;
        
        let sat = Math.abs(1.0-clr[0]) +  Math.abs(1.0-clr[1]) +  Math.abs(1.0-clr[2]);
        sat /= 3.0;
        
        if (ADAPTIVE_COLOR_DENSITY) {
          //scale spacing of points by saturation (how much color there is)
          f *= Math.pow(1.0-sat, 2);
          //f = f*f;
        }
        
        f = Math.pow(f, 0.25);
        //t += (t*t - t)*t;
        
        let r = minrad + (maxrad - minrad)*f;
        //r = minrad;
        ps[i+PRADIUS2] = r;
        
        //ps[i+PRADIUS2] *= (2.0 - Math.pow(t, 0.1))*2.5*this.dimen/size;
        //ps[i+PRADIUS2] = 7.0/size;
        //*/
      }
      
      var offs = cconst.get_searchoff(rd);
      for (var i=0; i<ps.length; i += PTOT) {
        var x = ps[i], y = ps[i+1];
        
        var ix = (x*0.5+0.5)*size + 0.0001;
        var iy = (y*0.5+0.5)*size + 0.0001;
        
        for (var j=0; j<offs.length; j++) {
          var ix2 = ~~(ix + offs[j][0]);
          var iy2 = ~~(iy + offs[j][1]);
          
          if (ix2 < 0 || iy2 < 0 || ix2 >= size || iy2 >= size)
            continue;
          
          var x2 = (ix+offs[j][0]+0.5)/size;
          var y2 = (iy+offs[j][1]+0.5)/size;
          var dx = offs[j][0]/size, dy = offs[j][1]/size;
          
          var dis = dx*dx + dy*dy;
          dis = dis != 0.0 ? Math.sqrt(dis) : 0.0;
          
          if (dis > maxrad) continue;
          
          var w = 1.0 - dis/maxrad;
          
          var s = 1.0;
          w = cconst.bez4(0, 0.5, 0.5, 1.0, w);
          w = Math.pow(w, 4.5);
          
          var idx = (iy2*size+ix2)*GTOT;
          
          //if (Math.random() > 0.993) {
            //console.log(w);
          //}
          
          //var dis2 = dis - ps[i+PRADIUS2];
          //dis2 *= 0.1;
          if (window._d == undefined)
            window._d = 0.7;
          
          var dis2 = dis - ps[i+PRADIUS2]*window._d;
          //dis2 = -dis2;
          
          if (dis != 0.0) {
            dx /= dis;
            dy /= dis;
          }
          
          grid[idx+GW] += w;
          grid[idx+GDX] += dx*dis2*w;
          grid[idx+GDY] += dy*dis2*w;
          grid[idx+GSUM] += w;
        }
      }
      
      for (var i=0; i<ps.length; i += PTOT) {
        var x = ps[i], y = ps[i+1];
        
        var ix = ~~((x*0.5+0.5)*size + 0.0001);
        var iy = ~~((y*0.5+0.5)*size + 0.0001);
        
        var idx = (iy*size+ix)*GTOT;
        
        if (grid[idx] == 0 || grid[idx+GSUM] == 0) continue;
        
        var w = grid[idx+GW] / grid[idx+GSUM];
        var sum = grid[idx+GSUM];
        
        let dx = grid[idx+GDX]/sum;
        let dy = grid[idx+GDY]/sum;
        
        /*
        let dis = dx*dx + dy*dy;
        if (dis == 0.0) continue;
        
        dx /= dis;
        dy /= dis;
        
        dis = Math.min(dis, 20.0/DIMEN);
        
        dx *= dis;
        dy *= dis;
        //*/
        
        x += -dx*0.62*RELAX_SPEED;
        y += -dy*0.62*RELAX_SPEED;
        
        x = Math.min(Math.max(x, -1), 1);
        y = Math.min(Math.max(y, -1), 1);
        
        //pull towards original starting positions
        dx = ps[i+POX] - x;
        dy = ps[i+POY] - y;
        
        ps[i] = x// + dx*0.15;
        ps[i+1] = y// + dy*0.15;
        
        if (Math.random() > 0.99) {
        //  console.log("w", grid[idx], "dx", grid[idx+1], "dy", grid[idx+2]);
        }
      }
      
      if (TRI_MODE) {
        console.log("regenerating triangulation...");
        this.del();
      }
      
      this.calc_kdtree();
      console.log("done relaxing");
    }
  ]);
  
  return exports;
});

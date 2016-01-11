
var _bluenoise = undefined; 
define([
  'util', 'const', 'draw', 'colors', 'diffusion',
  'delaunay', 'kdtree'
], function(util, cconst, draw, colors, diffusion,
            delaunay, kdtree) {
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
  
  var BlueNoise = exports.BlueNoise = Class([
    function constructor() {
      this.points = [];
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
      var nextout = [0];
       
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
          
          var f = clr[0]*0.2 + clr[1]*0.7 + clr[2]*0.1;
          
          var fac=0, fac2=0, fac3=0;
          var tot=0, tot2=0, tot3=0;
          
          for (var j=0; j<mscale*mscale; j++) {
            var offx = j % mscale, offy = ~~(j / mscale);
            
            var mx = (ix+offx) % cw, my = (iy+offy) % ch;
            var midx1 = (my*cw+mx)*4;
            var mx = (ix+3+offx) % cw, my = (iy+offy) % ch;
            var midx2 = (my*cw+mx)*4;
            var mx = (ix+3+offx) % cw, my = (iy+3+offy) % ch;
            var midx3 = (my*cw+mx)*4;

            var rok = clr[0] >= mask[midx1]/255.0;
            var gok = clr[1] >= mask[midx2]/255.0;
            var bok = clr[2] >= mask[midx3]/255.0;
            var ok = f < mask[midx1]/255.0;
            
            var fd = 0.1;
            if (mask[midx1+3] > 10) {
              fac += mask[midx1]/255.0-0.0-fd;
              tot += 1;
            }
            if (mask[midx2+3] > 10) {
              fac2 += mask[midx2]/255.0-0.0-fd;
              tot2 += 1;
            }
            if (mask[midx3+3] > 10) {
              fac3 += mask[midx3]/255.0-0.0-fd;
              tot3 += 1;
            }
          }
          
          fac = tot ? fac / tot : fac;
          fac2 = tot2 ? fac2 / tot2 : fac2;
          fac3 = tot3 ? fac3 / tot3 : fac3;
          
          var dfac = 0.0;
          
          var use_lab = false;
          var dclr;
          
          if (!use_lab) {
            dclr = clr3;
            var d = 1.0;
            
            dclr[0] = clr[0]*0.9*d;
            dclr[1] = clr[1]*0.9*d;//Math.pow(0.00001+clr[1], 2)*d;
            dclr[2] = clr[2]*1.1*d;
            
            /*
            var eps = 0.00001;
            dclr[0] = Math.pow(eps+dclr[0], 0.5);
            dclr[1] = Math.pow(eps+dclr[1], 0.5);
            dclr[2] = Math.pow(eps+dclr[2], 0.5);
            //*/
            
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
            for (var ki=0; ki < 1; ki++) {
              var ci = closest_color_lab(dclr, nextout, 0, true, true);
              var c2 = lab_colors[ci];
              
              /*
              var f1 = (c2[0]+c2[1]+c2[2])/3.0;
              ci = f1 < fac ? nextout[0] : ci;
              
              if (ci != undefined) {
                var c2 = lab_colors[ci];
                
                //console.log(nextout)
                dclr[0] = c2[0];
                dclr[1] = c2[1];
                dclr[2] = c2[2];
              }//*/
              
              /* 13  : 0.6 */
              /* 61  : 0.3 */
              /* 217 : 0.3 */
              
              var prec = 0.2; //7.0/colors.colors.length; //-0.0*lab_colordis(c2, dclr); //colors.colors[nextout[0]]);
              var prec2= prec;
              
              var dx = (dclr[0]-c2[0]), dy = (dclr[1]-c2[1]), dz = (dclr[2]-c2[2]);
              
              fac2 = fac3 = fac; //XXX
              
              if (use_lab) {
                prec *= 180.25;
                dclr[0] += prec*fac;
                dclr[1] += prec*fac2;
                dclr[2] += prec*fac3;
              } else {              
                //prec = 5*Math.sqrt(0.0001+prec);
                //if (prec != 0)
                //  prec = Math.pow(prec, 0.2)*0.25;
                //prec *= 2.0;
                //prec += 0.5;
                
                var d = 0.15;
                
                dclr[0] += (fac-d)*prec2*4;
                dclr[1] += (fac2-d)*prec2*4;
                dclr[2] += (fac3-d)*prec2*4;
              }
            }
            
            for (var k=0; k<3; k++) {
              //dclr[k] = Math.min(dclr[k], 1.0);
              //dclr[k] = Math.fract(dclr[k]);
            }
            
            var ff = fac > 0 ? Math.sqrt(0.00001+fac): fac;
            //dfac = ff*ff*(3.0-2.0*ff); //1+0.1*(1-fac)*prec2*prec2;
            dfac = 0;//(ff-0.5)*0.75*prec;//ff/(1.0+5*prec)*0.2;
            
            //for (var k=0; k<3; k++) {
            //  clr[k] = Math.min(Math.max(clr[k], 0.0), 1.0);
            //}
            
            if (use_lab) {
              clr = colors.lab_to_rgb(dclr[0], dclr[1], dclr[2]);
            } else {
              clr[0] = dclr[0];
              clr[1] = dclr[1];
              clr[2] = dclr[2];
            }
            
            var f1 = clr[0]*0.4 + clr[1]*0.6 + clr[2]*0.2;
            
            var ci = colors.closest_color(clr, nextout, dfac, true);
            //if (nextout[0] >= 0)
            //  ci = f1 >= fac ? nextout[0] : ci;
            
            for (var k=0; k<3; k++) {
              clr[k] = colors.colors[ci][k];
            }
          } else {
            var ci = colors.closest_color(clr, nextout, dfac, true);
            for (var k=0; k<3; k++) {
              clr[k] = colors.colors[ci][k];
            }
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
    
    function step(custom_steps, skip_points_display) {
      if (RASTER_IMAGE && RASTER_MODE == RASTER_MODES.PATTERN) {
        this.step_b();
        return;
      }
      
      this.r = 1.0;
      
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
      var nextout = [0];
      
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
          
          var ix = ~~(((x*mscale) % cw)+0.5);
          var iy = ~~(((y*mscale) % ch)+0.5);
          
          var igx = x;
          var igy = y;
          
          x /= size;
          y /= size;
          
          x = (x-0.5)*2.0, y = (y-0.5)*2.0;
          
          var clr = this.sampler(x, y, size, 1.0);
          
          //var f = (clr[0]*0.4026 + clr[1]*0.4052 + clr[2]*0.2022)*0.8;
          var f = clr[0]*clr[0] + clr[1]*clr[1] + clr[2]*clr[2];
          f = f != 0.0 ? Math.sqrt(f) / sqrt3 : 0.0;
          
          if (clr[0] < 0) {
            continue; //sampler requested we discard this sample
          }
          
          var sat = Math.abs(1.0-clr[0]) +  Math.abs(1.0-clr[1]) +  Math.abs(1.0-clr[2]);
          sat /= 3.0;
          
          if (ADAPTIVE_COLOR_DENSITY) {
            //scale spacing of points by saturation (how much color there is)
            f *= Math.pow(1.0-sat, 2);
          }
          
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
          
          for (var i=0; i<wid; i++) {
            for (var j=0; j<wid; j++) {
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
              
              var aok2 = mask[idx2+3] > 10 || SMALL_MASK;
              var aok3 = mask[idx3+3] > 10 || SMALL_MASK;
              var aok4 = mask[idx4+3] > 10 || SMALL_MASK;
              var aok5 = mask[idx5+3] > 10 || SMALL_MASK;
              
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
              var gok2 = aok3 && 1.0-fg < mask[idx3+1]/255.0;
              var bok2 = aok4 && 1.0-fb < mask[idx4+2]/255.0;
              
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
                
                finalth += mask[idx2]/255.0 + ditherfac;
                sumx += i/size;
                sumy += j/size;
              }
            }
          }
          
          if (ok > 0)
            finalth /= ok;
          
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
          var ci = colors.closest_color_fast(clr);
          
          if (!SMALL_MASK && ok && !GRID_MODE) {
            sumx /= ok;
            sumy /= ok;
            
            var sf = 0.75;//RASTER_IMAGE ? 0.8 : 0.501;
            
            x += sumx*sf;//*mscale*0.5;
            y += sumy*sf;//*mscale*0.5;
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
          
          if (DITHER_COLORS && (!RASTER_IMAGE || RASTER_MODE != RASTER_MODES.CMYK)) {
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
            
            //*
            if (rok) {
              dot(rix, riy, fr, 255, 0, 0, 0);
            }
            
            if (gok) {
              dot(rix, riy, fg, 0, 255, 0, 0);
            } 
            
            if (bok) {
              dot(rix, riy, fb, 0, 0, 255, 0);
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
          points[pi+2] = start_r*(1.0 + 0.25*(sat));
          points[pi+3] = f;
          points[pi+4] = ci;
          points[pi+5] = lvl;
          points[pi+PRADIUS2] = -1;//points[pi+PRADIUS];
          
          points[pi+POX] = points[pi];
          points[pi+POY] = points[pi+1];
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

    function init(size) {
      var diag = 1.00001 / DIMEN;
    
      diag = Math.sqrt(diag*diag + diag*diag);
      
      this.r = diag;
      this.cur = 0;
      this.start_r = this.r;
      this.gridsize = size;
      
      this.errgrid = new Float64Array(size*size*3);
      this.errgrid.fill(0, 0, this.errgrid.length);
      
      if ("startup_mask_bn4" in localStorage) {
        this.load_mask(localStorage.startup_mask_bn4);
      } else {
        this.load_mask(blue_mask_file);
      }
    },
    
    //maskdata is data url, url that has full image encoded in it
    function load_mask(maskdata) {
      this._mask = new Image();
      this._mask.src = maskdata;
      
      var this2 = this;
      this._mask.onload = function() {
        this.mask = this._mask;
        this2.on_image_read(this2._mask, 'mask');
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
      
      return kd;
    },
    
    function calc_radii(use_orig_cos) {
      var ps = this.points;
      var kd = this.calc_kdtree(true);
      
      var GIDX = 0, GTOT = 1;
      
      var size = this.dimen;
      var grid = new Float64Array(size*size*GTOT);
      grid.fill(-1, 0, grid.length);
      
      for (var i=0; i<ps.length; i += PTOT) {
        var x, y;
        
        if (use_orig_cos) {
          x = ps[i+POX], y = ps[i+POY];
        } else {
          x = ps[i], y = ps[i+1];
        }
        
        var ix = ~~((x*0.5+0.5)*size+0.0001), iy = ~~((y*0.5+0.5)*size+0.0001);
        
        var idx = (iy*size+ix)*GTOT;
        grid[idx] = i/PTOT;
      }
      
      var minrad = 1 / (this.dimen*Math.sqrt(2));
      var minrad2 = 1e17;
      
      //most masks have maximum radius
      //between 6 and 9.5 times minimum radius
      
      var maxrad = minrad*10.0;
      console.log("maxrad", maxrad, minrad);
      
      var rd = ~~(maxrad*size+2);
      var offs = cconst.get_searchoff(rd);
      
      var min = Math.min, max = Math.max;
      
      console.log("rd", rd, minrad, offs.length);
      
      function pointcallback(pi) {
        pi = ~~(pi*PTOT);
        
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
        
        var ix = (x*0.5+0.5)*size + 0.0001, iy = (y*0.5+0.5)*size + 0.0001;
        var x1=x, y1=y, ix1=ix, iy1=iy;
        var minr = 1e17, maxr = -1e17, avgr = 0;
        var tot = 0;
        
        kd.forEachPoint(x*0.5+0.5, y*0.5+0.5, maxrad, pointcallback, this);
        
        for (var j=0; j<offs.length; j++) {
          break;
          
          var ix2 = ~~(ix1 + offs[j][0]), iy2 = ~~(iy1 + offs[j][1]);
          var idx = (iy2*size+ix2)*GTOT;
          
          if (ix2 < 0 || iy2 < 0 || ix2 >= size || iy2 >= size)
            continue;
          
          if (grid[idx] < 0 || grid[idx] == i/PTOT)
            continue;
          
          var pi = grid[idx];
          pointcallback(pi);
          /*
          
          pi = ~~(pi*PTOT);
          if (pi == i) continue;
          
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

          //*/
        }
        
        if (tot == 0) continue;
        avgr /= tot;
        
        var r = avgr;
        
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
    
    function relax() {
      console.log("updating radii");
      this.calc_radii(false);
      
      console.log("relaxing");
      
      var GW=0, GDX=1, GDY=2, GSUM=3, GTOT=4;
      var size = this.dimen*2;
      
      var grid = new Float64Array(size*size*GTOT);
      
      function reset_grid() {
        grid.fill(0, 0, grid.length);
      }
      reset_grid();
      
      var ps = this.points;
      
      var minrad = 1.0 / (Math.sqrt(2)*this.dimen);
      //most masks have maximum radius
      //between 6 and 9.5 times minimum radius
      
      var maxrad = minrad*15.0;
      var rd = ~~(minrad*size+2);
      
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
          
          var idx = (iy2*size+ix2)*GTOT;
          
          //if (Math.random() > 0.993) {
            //console.log(w);
          //}
          
          //var dis2 = dis - ps[i+PRADIUS2];
          //dis2 *= 0.1;
          if (window._d == undefined)
            window._d = 0.7;
          
          var dis2 = dis - ps[i+PRADIUS2]*window._d;
          
          if (dis != 0.0) {
            dx /= dis;
            dy /= dis;
          }
          
          grid[idx] += w;
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
        
        x += -(grid[idx+GDX]/sum)*0.62;
        y += -(grid[idx+GDY]/sum)*0.62;
        
        x = Math.min(Math.max(x, -1), 1);
        y = Math.min(Math.max(y, -1), 1);
        
        ps[i] = x;
        ps[i+1] = y;
        
        if (Math.random() > 0.99) {
        //  console.log("w", grid[idx], "dx", grid[idx+1], "dy", grid[idx+2]);
        }
      }
      
      if (TRI_MODE) {
        console.log("regenerating triangulation...");
        this.del();
      }
      
      console.log("done relaxing");
    }
  ]);
  
  return exports;
});

var _bluenoise = undefined; 
define([
  'util', 'const', 'draw', 'colors', 'diffusion'
], function(util, cconst, draw, colors, diffusion) {
  "use strict";
  
  var exports = _bluenoise = {};
  var Class = util.Class;
  
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
    
    function step(custom_steps, skip_points_display) {
      this.r = 1.0;
      
      if (this.sampler == undefined) {
        console.log("image hasn't loaded yet");
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
      var mscale = 4;
      
      for (var si=0; si<steps; si++, this.cur++) {
          var x = this.cur % size;
          var y = ~~(this.cur / size);
          
          var gx = x, gy = y;
          
          //add some randomness
          x += (Math.random()-0.5)*RAND_FAC;
          y += (Math.random()-0.5)*RAND_FAC;
          
          var ix = ~~(((x*mscale) % cw)+0.5);
          var iy = ~~(((y*mscale) % ch)+0.5);
          
          //uncomment for hexagon pattern
          if ((~~x)%2 == 0) {
          //  y -= 0.5;
          }
          
          x /= size;
          y /= size;
          
          x = (x-0.5)*2.0, y = (y-0.5)*2.0;
          
          var clr = this.sampler(x, y, this.gridsize, 1.0);
          
          if (clr[0] < 0) {
            continue; //sampler requested we discard this sample
          }
          
          var ix2 = ~~((x*0.5+0.5)*size);
          var iy2 = ~~((y*0.5+0.5)*size);
          
          var gidx = (iy2*size+ix2)*3;
          
          //var f = (clr[0]*0.4026 + clr[1]*0.4052 + clr[2]*0.2022)*0.8;
          var f = clr[0]*clr[0] + clr[1]*clr[1] + clr[2]*clr[2];
          f = f != 0.0 ? Math.sqrt(f) / Math.sqrt(3.0) : 0.0;
          
          var clr1 = [clr[0], clr[1], clr[2]];
          
          if (DITHER_COLORS) {
            clr1[0] += grid[gidx];
            clr1[1] += grid[gidx+1];
            clr1[2] += grid[gidx+2];
          }
          
          var ci = colors.closest_color(clr1);
          var clr2 = colors.colors[ci];

          var dr = (clr1[0]-clr2[0]);
          var dg = (clr1[1]-clr2[1]);
          var db = (clr1[2]-clr2[2]);
          
          var avg = (clr[0]+clr[1]+clr[2])/3.0;
          var sat = Math.abs(avg-clr[0]) +  Math.abs(avg-clr[1]) +  Math.abs(avg-clr[2]);
          sat /= 3.0;
          
          var ffac = Math.pow(1.0-f, 0.5);
          ffac = 1.0 - f*f;
          
          //scale color error by spacing of points
          dr *= ffac;
          dg *= ffac;
          db *= ffac;
          
          var sat = Math.abs(1.0-clr[0]) +  Math.abs(1.0-clr[1]) +  Math.abs(1.0-clr[2]);
          sat /= 3.0;
          
          //scale spacing of points by saturation (how much color there is)
          f *= 1.0-sat;
         
          //apply error diffusion to color
          var fil = this.filter.get(f);
          
          for (var fi=0; fi<fil.length; fi++) {
            for (var fj=0; fj<fil[fi].length; fj++) {
              var fi2 = fi;
              var fj2 = fj - 2;
              
              if (ix2+fi2 >= size || iy2+fj2 >= size) {
                continue;
              }
              if (ix2+fi2 < 0 || iy2+fj2 < 0) {
                continue;
              }
              
              var fmul = 1.0 //4 * Math.random();
              
              var gidx2 = ((iy2+fi2)*size + ix2+fj2)*3;

              grid[gidx2] += fil[fi][fj]*dr*fmul;
              grid[gidx2+1] += fil[fi][fj]*dg*fmul;
              grid[gidx2+2] += fil[fi][fj]*db*fmul;
              
              grid[gidx2] = Math.min(Math.max(grid[gidx2], -1.0), 1.0);
              grid[gidx2+1] = Math.min(Math.max(grid[gidx2+1], -1.0), 1.0);
              grid[gidx2+2] = Math.min(Math.max(grid[gidx2+2], -1.0), 1.0);
            }
          }
          
          var idx = (iy*cw + ix)*4; 
          
          var threshold = mask[idx]/255.0;
          
          var ok = 0;
          var ditherfac = 0.2*(Math.random()-0.5)*(0.2 + 0.06*f*f);
          
          var wid = mscale;
          
          //blue noise mask has to be downsampled (this is by design,
          //to hopefully make it more accurate)
          for (var i=0; i<wid; i++) {
            for (var j=0; j<wid; j++) {
              var ix2 = (ix+i) % cw;
              var iy2 = (iy+j) % ch;
              
              var idx2 = (iy2*cw + ix2)*4;
              
              if (mask[idx2+3] < 70) {
                continue;
              }
              
              ok += !!(f < mask[idx2]/255.0 + ditherfac);
              
              continue;
            }
          }
          
          if (!ok) {
            continue;
          }
          
          //x += (1.0-f)*1.25*(Math.random()-0.5)/size;
          //y += (1.0-f)*1.25*(Math.random()-0.5)/size;
          
          this.points.push(x);
          this.points.push(y);
          this.points.push(this.start_r*(1.0 + 0.25*(sat)));
          this.points.push(f);
          this.points.push(ci);
      }
      
      if (!skip_points_display) {
        console.log("points", this.points.length/PTOT);
        console.log("\n");
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
        this.mask = new Image();
        this.mask.src = localStorage.startup_mask_bn4;
        var this2 = this;
        
        this.mask.onload = function() {
          this2.on_image_read(this2.mask, 'mask');
        }
      } else { //use built in mask
        this.mask = new Image();
        this.mask.src = blue_mask_file;
        var this2 = this;
        
        this.mask.onload = function() {
          this2.on_image_read(this2.mask, 'mask');
        }
      }
    },
    
    function reset() {
      this.cur = 0;
      this.points = [];
      this.errgrid.fill(0, 0, this.errgrid.length);
      
      redraw_all();
    },
    
    function on_image_read(img, field) {
      console.log("got", field, "image")

      var this2 = this;
      
      if (img.width == 0) {
        var timer = window.setInterval(function() {
          if (img.width != 0) {
            window.clearInterval(timer);
            this2.on_image_read(img, field);
            console.log("image finally loaded");
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
    }
  ]);
  
  return exports;
});

var __appstate = undefined;

define([
  "util", "const", "bluenoise", "draw", "colors", "ui", "spectrum"
], function(util, cconst, bluenoise, draw, colors, ui, spectrum) {
  "use strict";
  
  var exports = __appstate = {};
  var Class = util.Class;
  
  window.save_buffer = function(buf) {
    var blob = new Blob([buf], {type : "text/plain"});
    var url = URL.createObjectURL(blob);
    
    window.open(url);
  }
  
  window.newline_data_url = function(s) {
    var maxcol = 0;
    var ret = "[\""
    
    for (var i=0; i<s.length; i++) {
      if ((i+1) % 65 == 0) {
        ret += "\",\n\"";
      }
      
      ret += s[i];
    }
    
    ret += "\"].join(\"\");\n"
    
    return ret;
  }
  
  var AppState = exports.AppState = Class([
    function constructor(g, canvas) {
      this.bluenoise = new bluenoise.BlueNoise();
      this.drawer = new draw.Drawer(this);
      this.image = undefined;
      this.outimage = undefined;
      
      this.canvas = canvas;
      this.g = g;
      this.channel = 0;
      this.color = "black";
      
      this.drawlines = [];
    },
    
    Class.getter(function gridsize() {
      throw new Error("Refactor error!");
    }),
    Class.getter(function cells() {
      throw new Error("Refactor error!");
    }),
    Class.getter(function grid() {
      throw new Error("Refactor error!");
    }),
    Class.getter(function celldim() {
      throw new Error("Refactor error!");
    }),
    Class.getter(function depth() {
      throw new Error("Refactor error!");
    }),
    
    function make_drawline(v1, v2) {
      this.drawlines.push(v1[0]);
      this.drawlines.push(v1[1]);
      this.drawlines.push(v2[0]);
      this.drawlines.push(v2[1]);
    },
    
    function reset_drawlines() {
      this.drawlines = [];
    },
    
    function on_load() {
      this.cur_raster_i = 0;
      
      var indexmap = [];
      
      if (this.image == undefined && "startup_image_bn4" in localStorage) {
        this.image = new Image();
        this.image.src = localStorage.startup_image_bn4;
        var this2 = this;
        
        this.image.onload = function() {
          this2.on_image_read(this2.image, function() {
            this2.source_image_read(this2.image);
          });
        }
      }
      
      this.bluenoise.init(DIMEN);
    },
    
    function init() {
      this.bluenoise.init(DIMEN);
    },
    
    function reset() {
      if (RASTER_IMAGE)  {
        var size = ~~(SCALE*Math.min(canvas.width, canvas.height));
        size = DIMEN;
        
        var size2 = size;
        
        this.outimage = new ImageData(size2, size2);
        var img = this.outimage;
        
        var iview = new Int32Array(img.data.buffer);
        
        img.data[0] = img.data[1] = img.data[2] = 255;
        img.data[3] = 255;
        
        iview.fill(iview[0], 0, iview.length);
      }
      
      this.bluenoise.reset(RASTER_IMAGE ? this.outimage : undefined);
      this.drawer.reset(RASTER_IMAGE ? this.outimage : undefined);
    },
    
    function draw() {
      this.drawer.draw(this.g);
    },
    
    function on_keydown(e) {
      console.log(e.keyCode);
      switch (e.keyCode) {
        case 75: //kkey
          console.log("relax");
          this.bluenoise.relax();
          //console.log("spectrum");
          //this.calc_spectrum();
          redraw_all();
          break;
        case 82: //rkey
          this.init()
          this.reset()
          colors.gen_colors();
          
          redraw_all();
          break;
          
        case 68: //dkey
          this.bluenoise.step();
          
          redraw_all();
          
          console.log("DONE");
          break;
      }
    },
    
    function renderImage() {
      var size = RENDERED_IMAGE_SIZE;
      var oldscale = window.SCALE;
      
      window.SCALE = 1.0;
      
      console.log("rendering image. . .");
      
      var asp = _appstate.image.width / _appstate.image.height;
      var w, h;
      
      if (RASTER_IMAGE) {
        size = _appstate.outimage.width;
      }
      
      if (asp > 1.0) {
        w = size;
        h = size/asp;
      } else {
        w = size*asp;
        h = size;
      }
      
      var canvas = document.createElement("canvas");
      var g = canvas.getContext("2d");
      
      canvas.width = w;
      canvas.height = h;
      
      //make sure we have white background, not zero alpha
      g.beginPath();
      g.rect(0, 0, w, h);
      g.fillStyle = BLACK_BG ? "black " : "white";
      g.fill();
      
      var scale = 0.5*Math.max(w, h); //canvas.width, canvas.height);
      
      g.scale(scale, scale);
      if (asp > 1.0) {
        g.translate(1.0, 1.0);
      } else {
        g.translate(1.0, 1.0);
      }
      
      if (RASTER_IMAGE) {
        g.putImageData(_appstate.outimage, 0, 0);
      } else if (TRI_MODE) {
        _appstate.drawer.tri_mode_draw(g);
      } else {
        _appstate.drawer.draw_points(g);
      }
      
      console.log("finished rendering image")
      window.SCALE = oldscale;
      
      return new Promise((accept, reject) => {
        accept(canvas);
      });
    },
    
    function store_bluenoise_mask() {
      localStorage.startup_mask_bn4 = _image_url;
    },
    
    function  on_filechange(e, files) {
      console.log("got file", e, files)
      if (files.length == 0) return;
      
      var reader = new FileReader();
      var this2 = this;
      reader.onload = function(e) {
        var img = new Image();
        img.src = e.target.result;
        
        window._image_url = e.target.result;
        
        this2.on_image_read(img, function() {
          this2.source_image_read(img);
        });
      };
      
      reader.readAsDataURL(files[0]);
    },

    function on_mask_filechange(e, files) {
      console.log("got file", e, files)
      
      if (files.length == 0) return;
      
      var reader = new FileReader();
      var this2 = this;
      
      reader.onload = function(e) {
        localStorage.startup_mask_bn4 = e.target.result;
        _appstate.bluenoise.load_mask(e.target.result);
      };
      
      reader.readAsDataURL(files[0]);
    },
    
    function on_image_read(img, cb, thisvar) {
      console.log("got image")
      var this2 = this;
      
      if (img.width == 0) {
        var timer = window.setInterval(function() {
          if (img.width != 0) {
            window.clearInterval(timer);
            this2.on_image_read(img, cb, thisvar);
            
            console.log("delay load imaged");
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
      
      if (img.width == 0) {
        console.log("eek", img.width, img.height);
        return;
      }
      
      var data = g.getImageData(0, 0, img.width, img.height);
      img.data = data;
      
      if (cb == undefined)
        return;
      
      if (thisvar == undefined)
        cb(img);
      else
        cb.call(thisvar, img);
    },
    
    function source_image_read(img) {
      this.bluenoise.reset();
      this.image = img;
      
      try {
        localStorage.startup_image_bn4 = img.src;
      } catch (error) {
        console.log("Failed to cache image data");
      }
      
      console.log("make image sampler");
      
      var data = img.data;
      
      var min = Math.min, max = Math.max, sqrt = Math.sqrt;
      var fract = Math.fract, tent = Math.tend, pow = Math.pow;
      
      var asp = img.width / img.height;
      var this2 = this;
      
      var sampler_ret = [0, 0, 0, 0];
      var one255 = 1.0/255.0;
      
      var lab_to_rgb = colors.lab_to_rgb;
      var rgb_to_lab = colors.rgb_to_lab;
      
      this.bluenoise.sampler = function sampler(x, y, size, rad, no_filter) {
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
        
        if (no_filter) {
          var ix = ~~(x*img.width);
          var iy = ~~(y*img.height);
          var ret = sampler_ret;
          
          if (ix < 0 || iy < 0 || ix >= img.width || iy >= img.height) {
            //discard sample if out of image bounds
            ret[0] = ret[1] = ret[2] = ret[3] = -1;
            return ret;
          }
          
          var idx = ~~((iy*img.width+ix)*4);
          var a = data.data[idx+3]*one255;
          
          if (a < 0.05) {
            //discard sample if on transparent pixel
            ret[0] = ret[1] = ret[2] = ret[3] = -1;
            return ret;
          }
          
          ret[0] = data.data[idx]*one255;
          ret[1] = data.data[idx+1]*one255;
          ret[2] = data.data[idx+2]*one255;
          ret[3] = data.data[idx+3]*one255;
          
          return ret;
        }
        
        var filterw = img.width/this2.bluenoise.gridsize;
        var filterh = img.height/this2.bluenoise.gridsize;
        var filter = Math.max(filterw*0.5, filterh*0.5)*1.5+2;
        
        if (isNaN(filter)) {
          //throw new Error("'filter' was NaN in sampler!");
          console.log("EEEK! 'filter' was NaN in sampler!", img.width, img.height,
                      this2.bluenoise.gridsize);
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
          
          var r = (data.data[idx]/255);
          var g = (data.data[idx+1]/255);
          var b = (data.data[idx+2]/255);
          var a = 1.0-(data.data[idx+3]/255);
          
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
            sampler_ret[0] = -1;
            
            return sampler_ret;
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
          sampler_ret[0] = -1;
          return sampler_ret; //discard
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
        
        sampler_ret[0] = Math.min(Math.max(sumr, 0.0), 1.0);
        sampler_ret[1] = Math.min(Math.max(sumg, 0.0), 1.0);
        sampler_ret[2] = Math.min(Math.max(sumb, 0.0), 1.0);
        sampler_ret[3] = Math.min(Math.max(suma, 0.0), 1.0);
        
        //var inten = sampler_ret[0]*0.2126 + sampler_ret[1]*0.7152 + sampler_ret[2]*0.0722;
        
        //if (inten > 0.85) {
        //  sampler_ret[0] = -1; //discard sample;
        //}
        //var rr = sampler_ret;
        //var inten = 0.2126*rr[0] + 0.7152*rr[1] + 0.0722*rr[2];
        
        //if (inten > 0.9){
          //sampler_ret[0] = -1;
        //}
        
        return sampler_ret;
      }
      
      this.reset();
      window.redraw_all();
    }
  ]);
  
  function save_setting(key, val) {
    var settings = localStorage.startup_file_bn4;
    
    if (settings == undefined) {
        settings = {};
    } else {
      try {
        settings = JSON.parse(settings);
      } catch (error) {
        console.log("Warning, failed to parse cached settings");
        settings = {};
      }
    }
    
    settings[key] = val;
    localStorage.startup_file_bn4 = JSON.stringify(settings);
  }
  
  function load_setting(key) {
    var settings = localStorage.startup_file_bn4;
    
    if (settings == undefined) {
        settings = {};
    } else {
      try {
        settings = JSON.parse(settings);
      } catch (error) {
        console.log("Warning, failed to parse cached settings");
        settings = {};
      }
    }
    
    return settings[key];
  }
  
  var lowrescube = load_setting("LOW_RES_CUBE");
  
  if (lowrescube !== undefined) {
    window.LOW_RES_CUBE = true;
  }
  
  window.addEventListener("keydown", function(e) {
    _appstate.on_keydown(e);
  });

  exports.onload1 = function() {
    console.log("loaded!");
    
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth-30;
    canvas.height = window.innerHeight-25;
    
    var g = canvas.getContext("2d");
    
    window._appstate = new AppState(g, canvas);
    
    var animreq = undefined;
    
    window.redraw_all = function() {
      if (animreq != undefined) 
        return;
      
      animreq = requestAnimationFrame(function() {
        animreq = undefined;
        
        var g = _appstate.g;
        var canvas = _appstate.canvas;
        g.clearRect(0, 0, canvas.width, canvas.height);
        
        _appstate.draw();
      });
      
      redraw_all();
    }
    
    //these bind functions bind constants from const.js.
    //they typically take the constant name (converted to lowercase)
    //as their first argument
    var gui2 = new ui.UI();
    var gui = new ui.UI();
    
    window.gui = gui;
    
    gui.button('load_image', "Load Image", function() {
      var input = document.getElementById("input");
      input.click();
    });
    
    gui.button('load_mask', "Load Mask", function() {
      var input = document.getElementById("input2");
      input.click();
    });
    
    gui.button("reset", "Reset", function() {
      colors.gen_colors();
      _appstate.init();
      _appstate.reset();
      
      redraw_all();
    });
    
    gui.button("step", "Generate Points", function() {
      _appstate.bluenoise.step();
      redraw_all();
    });
    
    gui.button("relax", "Relax", () => {
      _appstate.bluenoise.relax();
      redraw_all();
    });
    
    gui.button("relax_loop", "Toggle Relax Loop", () => {
      if (_appstate.relaxtimer !== undefined) {
        console.log("stopping timer");
        
        window.clearInterval(_appstate.relaxtimer);
        _appstate.relaxtimer = undefined;
        
        return;
      }
      
      _appstate.relaxtimer = window.setInterval(() => {
        _appstate.bluenoise.relax();
        redraw_all();
      }, 100);
    });

    var panel = gui.panel("Settings");
    
    panel.slider("dimen", "Density", 1, 2048, 1, true);
    panel.slider("steps", "Points Per Step", 1, 50000, 1, true);
    panel.slider("draw_rmul", "Point Size", 0.1, 8.0, 0.01, false, true);
    panel.slider("rand_fac", "Added Random", 0.0, 3.0, 0.005, false, true);
    
    panel.slider("relax_speed", "Relax Speed", 0.001, 8.0, 0.001, true);

    panel.check("show_kdtree", "Show kdtree");
    panel.check('scale_points', 'Radius Scale');
    panel.check('tri_mode', "Triangle Mode");
    
    //panel.slider("dither_rand_fac", "Dither Random", 0.0, 3.0,0.005, false);
    panel.check("sharpen", "Sharpen");
    panel.slider("sharpness", "Sharpness", 0.0, 3.5, 0.001, false);
    panel.check('sharpen_luminence', 'Luminence Only');
    panel.check('use_lab', 'Use Lab Space');
    panel.open();
    
    panel = gui.panel("Save Tool")
    panel.button("save_img", "Save Image", () => {
      _appstate.renderImage().then((canvas) => {
        canvas.toBlob((blob) => {
          let url = URL.createObjectURL(blob);
          
          window.open(url);
        });
      });
    });
    
    panel.slider("rendered_image_size", "Rendered Image Size", 1, 4096, 1, true);

    panel = panel.panel("Canvas Position");
    panel.slider("scale", "Scale", 0.05, 5.0, 0.01, false, true);
    panel.slider("panx", "Pan X", -1.5, 1.5, 0.01, false, true);
    panel.slider("pany", "Pan Y", -1.5, 1.5, 0.01, false, true);
    
    panel = gui2.panel("More Options");
    var panel2 = panel.panel("General");
    
    panel2.check("dither_colors", "Dither Colors");
    panel2.check("show_colors", "Show Colors");
    panel2.check("adaptive_color_density", "Denser For Color")
    panel2.check("hexagon_mode", "Hexagonish");
    panel2.check("grid_mode", "Be More Grid Like");
    
    var panel3 = panel2.panel("Simple Raster");
    panel3.check("raster_image", "Enable");
    
    var val = ui.load_setting('raster_mode');
    val = val == undefined ? RASTER_MODE : parseInt(val);
    window.RASTER_MODE = val;
    
    panel3.listenum("Mode", RASTER_MODES, val, function(value) {
      window.RASTER_MODE = parseInt(value);
      console.log("setting raster_mode to", RASTER_MODE, typeof RASTER_MODE)
      ui.save_setting("raster_mode", RASTER_MODE);
    });
    
    panel2.check("make_noise", "Make Noise (to test relax)");
    panel2.check("small_mask", "Small Mask Mode");
    panel2.check("xlarge_mask", "Extra Large Mask Mode");
    panel2.check("special_offsets", "Use Encoded Offsets");
    
    panel2.check("use_mersenne", "Psuedo Random");
    panel2.check("black_bg", "Black BG");
    
    panel2 = panel.panel("Palette");
    panel2.slider("pal_colors", "Number of Colors (Times 9)", 1, 32, 1, true);
    panel2.check("allow_purple", "Include Purple In Palette");
    panel2.check("simple_palette", "Simple Palette");
    panel2.check("bg_palette", "Black/white only");
    
    var load_value = 'built-in';
    
    panel2 = panel.panel("Blue Noise Mask");
    panel2.listenum('Mask', {
      'Built In'                 : 'built-in',
      'Large 2'                  : 'mask_large_2.png',
      'Large 2 (smoothed)'       : 'mask_large_2_smoothed.png',
      'Large 1 (only 16 levels)' : 'mask_large.png',
      'Small 1 (only 16 levels)' : 'mask.png',
      'Weighted Sample Removal'  : 'weighted_sample_removal_mask_1.png',
    }, 'built-in', function(value) {
      load_value = value;
      console.log("yay, value", value);
    });
    
    panel2.button('load_mask', 'Load', function() {
      var value = load_value;
      
      if (value == 'built-in') {
        console.log("Reloading built-in blue noise mask. . .");
        localStorage.startup_mask_bn4 = blue_mask_file;
        _appstate.bluenoise.load_mask(blue_mask_file);
      } else {
        var path = "examples/"+value;
        var base = document.location.pathname;
        
        while (base.length > 0 && !base.endsWith("/")) {
          base = base.slice(0, base.length-1);
        }
        
        if (base.length != 0) {
          base = base.slice(1, base.length);
        }
        
        path = base + path;
        var promise = util.fetch_file(path, true);
        
        promise.then(function(data) {
          //turn into data url
          console.log("DATA LEN1", data.byteLength);
          data = new Uint8Array(data);
          
          var s = "";
          for (var i=0; i<data.length; i++) {
            s += String.fromCharCode(data[i]);
          }
          
          data = btoa(s);
          console.log(data.slice(0, 100));
          
          data = "data:image/png;base64," + data;
          localStorage.startup_mask_bn4 = data;
          _appstate.bluenoise.load_mask(data);
        });
      }
    });
    
    panel2 = panel.panel("Misc")
    panel2.check("draw_transparent", "Accumulation Mode");
    panel2.slider("accum_alpha", "Accum Alpha", 0.001, 1.0, 0.001, false, true);
    panel2.check("correct_for_spacing", "Correct_For_Spacing");
    panel2.check("low_res_cube", "Low Res Cube");
    
    //.slider will have loaded store setting from localStorage,
    //if it exists
    colors.gen_colors();
    
    
    _appstate.init();
    
    document.getElementById("input").addEventListener("change", function(e) {
      console.log("file!", e, this.files);
      
      _appstate.on_filechange(e, this.files);
    });
    
    document.getElementById("input2").addEventListener("change", function(e) {
      console.log("file!", e, this.files);
      
      _appstate.on_mask_filechange(e, this.files);
    });
  }
  
  exports.onload1();
  
  //main initialization for appstate
  _appstate.on_load();
  redraw_all();

  return exports;
});



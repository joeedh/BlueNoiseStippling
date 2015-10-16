var __appstate = undefined;

define([
  "util", "const", "bluenoise", "draw", "colors", "ui"
], function(util, cconst, bluenoise, draw, colors, ui) {
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
          this2.on_image_read(this2.image);
        }
      }
      
      this.bluenoise.init(DIMEN);
    },
    
    function init() {
      this.bluenoise.init(DIMEN);
    },
    
    function reset() {
      this.bluenoise.reset();
      this.drawer.reset();
    },
    
    function draw() {
      this.drawer.draw(this.g);
    },
    
    function on_keydown(e) {
      console.log(e.keyCode);
      switch (e.keyCode) {
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
        
        this2.on_image_read(img, 'image');
      };
      
      reader.readAsDataURL(files[0]);
    },

    function on_image_read(img) {
      console.log("got image")
      var this2 = this;
      
      if (img.width == 0) {
        var timer = window.setInterval(function() {
          if (img.width != 0) {
            window.clearInterval(timer);
            this2.on_image_read(img);
            console.log("delay load imaged");
          }
        }, 500);
        
        return;
      }
      
      this.bluenoise.reset();

      //extract image data
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var g = canvas.getContext('2d')
      g.drawImage(img, 0, 0);
      
      this.image = img;
      if (img.width == 0) {
        console.log("eek", img.width, img.height);
        return;
      }
      
      var data = g.getImageData(0, 0, img.width, img.height);
      this.image.data = data;
      
      try {
        localStorage.startup_image_bn4 = img.src;
      } catch (error) {
        console.log("Failed to cache image data");
      }
      
      console.log("make image sampler");
      
      var min = Math.min, max = Math.max, sqrt = Math.sqrt;
      var fract = Math.fract, tent = Math.tend, pow = Math.pow;
      
      var asp = img.width / img.height;
      var this2 = this;
      
      var sampler_ret = [0, 0, 0, 0];
      this.bluenoise.sampler = function(x, y, size, rad, no_filter) {
        x = (x*0.5)+0.5;
        y = (y*0.5)+0.5;
        
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
        fwid = Math.max(fwid, 3.0);
        
        var totsample=fwid*fwid;
        var totsampled = 0;
        
        if (no_filter) {
          totsample = 3;
          fwid = 1;
          filter = 1.0;
        }
        
        var sumr=0, sumg=0, sumb=0, suma=0;
        
        window._totsample = totsample;
        
        var weights = cconst.get_sharpen_filter(fwid);
        
        for (var i=0; i<totsample; i++) {
          var fwid2 = fwid-1;
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
          
          //two options: either blend color with white using alpha,
          //or multiply with alpha;
          
          //blend with white
          /*
          r += (1.0 - r)*a;
          g += (1.0 - g)*a;
          b += (1.0 - b)*a;
          //*/
          
          //mul with alpha.  we're assuming they're not already premul
          r *= 1.0-a;
          g *= 1.0-a;
          b *= 1.0-a;
          
          if (a > 0.05) {
            sampler_ret[0] = -1;
            return sampler_ret;
          }
          
          sumr += r*w;
          sumg += g*w;
          sumb += b*w;
          suma += a*w;
          
          tot += w;
        }
        
        if (!totsampled || tot == 0.0) {
          sampler_ret[0] = -1;
          return sampler_ret; //discard
        }
        
        sumr /= tot;
        sumg /= tot;
        sumb /= tot;
        suma /= tot;
        
        sampler_ret[0] = Math.max(sumr, 0.0);
        sampler_ret[1] = Math.max(sumg, 0.0);
        sampler_ret[2] = Math.max(sumb, 0.0);
        sampler_ret[3] = Math.max(suma, 0.0);
        
        var inten = sampler_ret[0]*0.2126 + sampler_ret[1]*0.7152 + sampler_ret[2]*0.0722;
        
        //if (inten > 0.85) {
        //  sampler_ret[0] = -1; //discard sample;
        //}
        var rr = sampler_ret;
        var inten = 0.2126*rr[0] + 0.7152*rr[1] + 0.0722*rr[2];
        
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
    
    var panel = gui.panel("Settings");
    
    panel.slider("dimen", "Density", 1, 2048, 1, true);
    panel.slider("steps", "Points Per Step", 1, 50000, 1, true);
    panel.slider("draw_rmul", "Point Size", 0.1, 8.0, 0.01, false, true);
    panel.slider("rand_fac", "Added Random", 0.0, 3.0,0.005, false, true);
    panel.slider("dither_rand_fac", "Dither Random", 0.0, 3.0,0.005, false);
    panel.open();
    
    panel = gui.panel("Save Tool")
    panel.button("save_img", "Save Image", function() {
      var size = RENDERED_IMAGE_SIZE;
      var oldscale = window.SCALE;
      
      window.SCALE = 1.0;
      
      console.log("rendering image. . .");
      
      var asp = _appstate.image.width / _appstate.image.height;
      var w, h;
      
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
      g.fillStyle = "white";
      g.fill();
      
      var scale = 0.5*Math.max(w, h); //canvas.width, canvas.height);
      
      g.scale(scale, scale);
      if (asp > 1.0) {
        g.translate(1.0, 1.0);
      } else {
        g.translate(1.0, 1.0);
      }
      
      _appstate.drawer.draw_points(g);
      
      console.log("finished rendering image")
      window.SCALE = oldscale;

      var url = canvas.toDataURL();
      window.open(url);
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
    
    panel2 = panel.panel("Palette");
    panel2.slider("pal_colors", "Number of Colors (Times 9)", 1, 32, 1, true);
    panel2.check("allow_purple", "Include Purple In Palette");
    
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
  }
  
  exports.onload1();
  
  //main initialization for appstate
  _appstate.on_load();
  redraw_all();

  return exports;
});



var __appstate = undefined;

define([
  "util", "const", "bluenoise", "draw", "colors", "ui", "spectrum", "indexdb_store", "smoothmask_file",
  "render", "exportsvg"
], function(util, cconst, bluenoise, draw, colors, ui, spectrum, indexdb_store, smoothmask_file,
            render, exportsvg)
{
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
  
  var AppState = exports.AppState = class {
    constructor(g, canvas) {
      this.bluenoise = new bluenoise.BlueNoise();
      this.drawer = new draw.Drawer(this);
      this.image = undefined;
      this.outimage = undefined;
      
      this.canvas = canvas;
      this.g = g;
      this.channel = 0;
      this.color = "black";
      
      this.drawlines = [];
    }
    
    get gridsize() {
      throw new Error("Refactor error!");
    }
    get cells() {
      throw new Error("Refactor error!");
    }
    get grid() {
      throw new Error("Refactor error!");
    }
    get celldim() {
      throw new Error("Refactor error!");
    }
    get depth() {
      throw new Error("Refactor error!");
    }
    
    make_drawline(v1, v2) {
      this.drawlines.push(v1[0]);
      this.drawlines.push(v1[1]);
      this.drawlines.push(v2[0]);
      this.drawlines.push(v2[1]);
    }
    
    reset_drawlines() {
      this.drawlines = [];
    }
    
    on_load() {
      this.cur_raster_i = 0;
      
      var indexmap = [];
      
      if (this.image === undefined && "startup_image_bn4" in localStorage) {
        this.image = new Image();
        this.image.src = localStorage.startup_image_bn4;
        var this2 = this;
        
        this.image.onload = function() {
          this2.on_image_read(this2.image, function() {
            this2.source_image_read(this2.image);
          });
        }
      } else if (!("startup_image_bn4" in localStorage)) {
        this.loadFlowerSvg();
      }
      
      this.bluenoise.init(DIMEN);
    }
    
    init() {
      this.bluenoise.init(DIMEN);
    }
    
    reset() {
      colors.gen_closest_map();
      
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
      } else if (HIGH_QUALITY_RASTER) {
        this.hqrender = new render.CircleRender(this.canvas.width, this.canvas.height);
      }
      
      this.bluenoise.reset(RASTER_IMAGE ? this.outimage : undefined);
      this.drawer.reset(RASTER_IMAGE ? this.outimage : undefined);
    }
    
    draw() {
      if (HIGH_QUALITY_RASTER && this.hqrender === undefined) {
        this.hqrender = new render.CircleRender(this.canvas.width, this.canvas.height);
      } else if (HIGH_QUALITY_RASTER) {
        this.hqrender.reset();
      }
      
      this.drawer.draw(HIGH_QUALITY_RASTER ? this.hqrender : this.g);
      
      if (HIGH_QUALITY_RASTER) {
        this.hqrender.render();
        this.g.putImageData(this.hqrender.image, 0, 0);
      }
      
      if (SHOW_IMAGE && this.image !== undefined && this.image.data !== undefined) {
        this.g.putImageData(this.image.data, 25, 25);
      }
      
      if (SHOW_DVIMAGE && this.bluenoise.dvimage !== undefined) {
        this.g.putImageData(this.bluenoise.dvimage, 25, 25);
      }
    }
    
    on_keydown(e) {
      console.log(e.keyCode);
      switch (e.keyCode) {
        case 68: //dkey
          this.bluenoise.step();
          
          redraw_all();
          
          console.log("DONE");
          break;
        case 75: //kkey
          console.log("relax");
          this.bluenoise.relax();
          //console.log("spectrum");
          //this.calc_spectrum();
          redraw_all();
          break;
        case 76: //lkey
          this.bluenoise.colordiffuse();
          redraw_all();
          break;
        case 82: //rkey
          this.init()
          this.reset()
          colors.gen_colors();
          
          redraw_all();
          break;
      }
    }
    
    renderImage(canvas, g, drawBG=true) {
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

      if (!canvas) {
        canvas = document.createElement("canvas");
        g = canvas.getContext("2d");
      }

      canvas.width = w;
      canvas.height = h;
      
      //make sure we have white background, not zero alpha
      if (drawBG) {
        g.beginPath();
        g.rect(0, 0, w, h);
        g.fillStyle = BLACK_BG ? "black " : "white";
        g.fill();
      }
      
      var scale = 0.5*Math.max(w, h); //canvas.width, canvas.height);
      
      g.scale(scale, scale);
      if (asp > 1.0) {
        g.translate(1.0, 1.0);
      } else {
        g.translate(1.0, 1.0);
      }
      
      if (RASTER_IMAGE) {
        g.putImageData(_appstate.outimage, 0, 0);
      } else if (DRAW_STICKS) {
        _appstate.drawer.draw_sticks(g);
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
    }

    toJSON() {
      return {
        APP_VERSION : APP_VERSION,
        settings : cconst.toJSON()
      };
    }
    
    loadJSON(json) {
      cconst.loadJSON(json.settings);

      if (json.APP_VERSION < 0.6) {
        json.STICK_ROT = (json.STICK_ROT/180.0) * Math.PI;
      }
    }
    
    save() {
      localStorage.startup_file_bn6 = JSON.stringify(this);
    }
    
    load() {
      try {
        this.loadJSON(JSON.parse(localStorage.startup_file_bn6));
      } catch (error) {
        util.print_stack(error);
      }
    }
    
    store_bluenoise_mask() {
      new indexdb_store.IndexDBStore("bluenoise_mask").write("data", _image_url);

      //localStorage.startup_mask_bn4 = _image_url;
    }
    
    on_filechange(e, files) {
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
    }

    on_mask_filechange(e, files) {
      console.log("got file", e, files)
      
      if (files.length == 0) return;
      
      var reader = new FileReader();
      var this2 = this;
      
      reader.onload = function(e) {
        let buf = e.target.result;
        let str = "";
        let view = new Uint8Array(buf);

        for (let i=0; i<view.length; i++) {
            str += String.fromCharCode(view[i]);
        }

        if (!str.startsWith("SMOOTHMASK")) {
            str = btoa(str);
            str = "data:image/png;base64," + str;
        }
        
        //localStorage.startup_mask_bn4 = e.target.result;
        new indexdb_store.IndexDBStore("bluenoise_mask").write("data", str);
        _appstate.bluenoise.load_mask(str);
      };
      
      reader.readAsArrayBuffer(files[0]);
    }
    
    on_image_read(img, cb, thisvar) {
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
    }

    clearData() {
      new indexdb_store.IndexDBStore("bluenoise_mask").clear();
      delete localStorage.startup_image_bn4;
      delete localStorage.startup_file_bn6;

      this.gui.clearData();
      this.gui2.clearData();

      console.log("Cleared saved data");
    }

    loadFlowerSvg() {
      requirejs(["flowersData"], (svg) => {
        let img = document.createElement("img");
        svg = "data:image/svg+xml," + escape(svg);

        console.log(img);
        img.src = svg;

        img.onload = () => {
          console.log("Loaded flower image!");
          this.image = img;
          this.on_image_read(this.image, () => {
            this.source_image_read(this.image);
          });
        }
      });
    }

    source_image_read(img) {
      this.bluenoise.reset();
      this.image = img;
      
      try {
        localStorage.startup_image_bn4 = img.src;
      } catch (error) {
        console.log("Failed to cache image data");
      }
      
      this.reset();
      window.redraw_all();
    }
    
    on_tick() {
      this.gui.on_tick();
      this.gui2.on_tick();
    }
    
    makeGUI() {
      //these bind functions bind constants from const.js.
      //they typically take the constant name (converted to lowercase)
      //as their first argument
      var gui2 = this.gui2 = new ui.UI("ui2_bn6", window);
      var gui = this.gui = new ui.UI("ui1_bn6", window);
      
      window.gui = gui;
      
      let cpanel = gui.panel("Actions");

      cpanel.button("step", "Run", function() {
        _appstate.bluenoise.step();
        redraw_all();
      });

      cpanel.button('load_image', "Load Image", function() {
        var input = document.getElementById("input");
        input.click();
      });
      
      cpanel.button('load_mask', "Load Mask", function() {
        var input = document.getElementById("input2");
        input.click();
      });
      
      cpanel.button("reset", "Reset", function() {
        colors.gen_colors();
        _appstate.init();
        _appstate.reset();
        
        redraw_all();
      });

      cpanel.button("clear", "Clear Saved Data", () => {
        this.clearData();
      });

      let rpanel = gui.panel("Relaxation");

      let sphc = rpanel.panel("Custom SPH Curve");

      window.SPH_CURVE = sphc.curve("SPH_CURVE", "Custom SPH Curve").curve;
      sphc.check("USE_SPH_CURVE", "Use SPH Curve");
      sphc.close();

      rpanel.button("relax", "Relax", () => {
        _appstate.bluenoise.relax();
        redraw_all();
      });

      let relaxbut = rpanel.button("relax_loop", "Start Loop", () => {
        if (_appstate.relaxtimer !== undefined) {
          relaxbut.domElement.parentNode.children[0].innerHTML = "Start Loop";
          console.log("stopping timer");
          
          window.clearInterval(_appstate.relaxtimer);
          _appstate.relaxtimer = undefined;
          
          return;
        }
        
        relaxbut.domElement.parentNode.children[0].innerHTML = "Stop Loop";
        
        _appstate.relaxtimer = window.setInterval(() => {
          _appstate.bluenoise.relax();
          redraw_all();
        }, 100);
      });
      
      window.relaxbut = relaxbut;
      
      rpanel.check("ANISOTROPY", "Anisotropic");
      rpanel.slider("FILTERWID", "Filter Wid", 3.0, 0.001, 7.0, 0.001, false, false);
      rpanel.slider("ANISOTROPY_FILTERWID", "AnisotropicFilterWid", 3.0, 0.001, 7.0, 0.001, false, false);
      rpanel.slider("RELAX_SPEED", "Relax Speed", 1.0, 0.001, 8.0, 0.001, true);
      rpanel.check("RELAX_UPDATE_VECTORS", "Update Vectors");
      
      var spanel = gui.panel("Settings");
      var panel = gui;

      spanel.slider("DIMEN", "Density", 32, 1, 2048, 1, true);
      spanel.slider("STEPS", "Points Per Step", 32, 1, 50000, 1, true);
      spanel.slider("DRAW_RMUL", "Point Size", 1.0, 0.1, 8.0, 0.01, false, true);
      spanel.slider("RAND_FAC", "Added Random", 0.0, 0.0, 3.0, 0.005, false, true);
      spanel.check("HIGH_QUALITY_RASTER", "HQ Renderer");
      
      spanel.check("SHOW_KDTREE", "Show kdtree");
      spanel.check("SCALE_POINTS", "Radius Scale");
      spanel.check('TRI_MODE', "Triangle Mode");
      
      let apanel = panel.panel("Stick Mode")
      apanel.check("DRAW_STICKS", "Draw Sticks");
      apanel.check("FANCY_STICKS", "Fancy Strokes");
      apanel.check("STICK_ARROWS", "Use Arrows");
      apanel.slider("STICK_ROT", "StickRot", 0.0, -180, 180, 0.0001, false, true);
      apanel.slider("STICK_WIDTH", "StickWidth", 0.0, 0.0001, 12.0, 0.0001, false, true);
      apanel.slider("STICK_LENGTH", "StickLength", 0.0, 0.0001, 12.0, 0.0001, false, true);
      apanel.slider("ANIS_W1", "W1", 0.0, -2.0, 2.0, 0.0001, false, false);
      apanel.slider("ANIS_W2", "W2", 0.0, -2.0, 2.0, 0.0001, false, false);
      apanel.close();
      
      let dpanel = panel.panel("Dithering");
      dpanel.check("DITHER_COLORS", "Dither Colors");
      dpanel.slider("DITHER_RAND_FAC", "Dither Random", 0.0, 0.0, 9.0,0.005, false, false);
      dpanel.check("DITHER_BLUE", "Blue Noise");
      dpanel.slider("DITHER_BLUE_STEPS", "Dither Uniformity", 6.0, 0.0, 256.0, 0.005, true, false);
      
      let fpanel = panel.panel("Image Filtering");
      fpanel.check("HIST_EQUALIZE", "EqualizeHistogram");
      fpanel.check("DEBAND_IMAGE", "Blur Derivatives");
      fpanel.slider("DEBAND_RADIUS", "Blur Radius", 15, 1, 90, 1, true, false);
      fpanel.slider("DEBAND_BLEND", "BlendWithOriginal", 0.0, 0, 1, 0.0001, false, false);
      
      fpanel.check("SHARPEN", "Sharpen");
      fpanel.slider("SHARPNESS", "Sharpness", 0.5, 0.0, 3.5, 0.001, false);
      fpanel.check('SHARPEN_LUMINENCE', 'Luminence Only');
      fpanel.check('USE_LAB', 'Use Lab Space');
      fpanel.close();
      
      var panel2 = gui.panel("Save Tool")
      panel2.button("save_img", "Save Image", () => {
        _appstate.renderImage().then((canvas) => {
          canvas.toBlob((blob) => {
            let url = URL.createObjectURL(blob);
            
            window.open(url);
          });
        });
      });
      
      panel2.slider("RENDERED_IMAGE_SIZE", "Rendered Image Size", 1024, 1, 4096, 1, true);

      panel2 = gui.panel("Canvas Position");
      panel2.slider("SCALE", "Scale", 1.0, 0.05, 5.0, 0.01, false, true);
      panel2.slider("PANX", "Pan X", 0.0, -1.5, 1.5, 0.01, false, true);
      panel2.slider("PANY", "Pan Y", 0.0, -1.5, 1.5, 0.01, false, true);

      var panel3 = gui.panel("Export SVG");
      panel3.button("save_svg", "Save SVG", () => {
        console.log("Export SVG!");

        let data = exportsvg.exportSVG(this);


        let a = document.createElement("a");

        //data = "data:image/svg;charset=US-ASCII," + encodeURI(data);
        //a.setAttribute("href", data);

        let blob = new Blob([data], {type : "image/svg"});
        let url = URL.createObjectURL(blob);

        a.setAttribute("download", "render.svg");
        a.setAttribute("href", url);

        a.click();
      });


      panel = gui2.panel("More Options");
      var panel2 = panel.panel("General");
      
      var panel3 = panel2.panel("Tone Curve");
      window.TONE_CURVE = panel3.curve("TONE_CURVE", "Tone Curve", cconst.DefaultCurves.TONE_CURVE).curve;
      panel3.close();
      
      var panel3 = panel2.panel("Density Curve");
      window.DENSITY_CURVE = panel3.curve("DENSITY_CURVE", "Density Curve", cconst.DefaultCurves.DENSITY_CURVE).curve;
      panel3.close();
      
      panel2.check("SHOW_IMAGE", "Show Image");
      panel2.check("SHOW_DVIMAGE", "Show DvImage");
      panel2.check("SHOW_COLORS", "Show Colors");
      panel2.check("ADAPTIVE_COLOR_DENSITY", "Denser For Color")
      panel2.check("HEXAGON_MODE", "Hexagonish");
      panel2.check("GRID_MODE", "Grid Like");
      
      var panel3 = panel2.panel("Simple Raster");
      panel3.check("RASTER_IMAGE", "Enable");
      
      let rastermode = "";
      for (let k in RASTER_MODES) {
        if (RASTER_MODES[k] == RASTER_MODE) {
          rastermode = k;
          break;
        }
      }
      
      console.log("SDFSDFSDF", rastermode);
      
      panel3.listenum("RASTER_MODE", "Mode", RASTER_MODES, rastermode);
      panel3.check("USE_CMYK_MASK", "CMYK Masksheet")
      
      panel2.check("MAKE_NOISE", "Make Noise (to test relax)");
      panel2.check("SMALL_MASK", "Small Mask Mode");
      panel2.check("XLARGE_MASK", "Extra Large Mask Mode");
      panel2.check("SPECIAL_OFFSETS", "Use Encoded Offsets");
      
      panel2.check("USE_MERSENNE", "Psuedo Random");
      panel2.check("BLACK_BG", "Black BG");
      
      panel2 = panel.panel("Palette");
      panel2.slider("PAL_COLORS", "Number of Colors (Times 9)", 4, 1, 32, 1, true);
      panel2.check("ALLOW_PURPLE", "Include Purple In Palette");
      panel2.check("ALLOW_GREY", "Include Grey In Palette");
      panel2.check("SIMPLE_PALETTE", "Simple Palette");
      panel2.check("BG_PALETTE", "Black/white only");
      
      var load_value = 'built-in-smooth';
      
      panel2 = panel.panel("Blue Noise Mask");
      panel2.listenum(undefined, 'Mask', {
        'Built In Smooth'          : 'built-in-smooth',
        'Built In'                 : 'built-in',
        'Large 2'                  : 'mask_large_2.png',
        'Large 2 (smoothed)'       : 'mask_large_2_smoothed.png',
        'Large 1 (only 16 levels)' : 'mask_large.png',
        'Small 1 (only 16 levels)' : 'mask.png',
        'Weighted Sample Removal'  : 'weighted_sample_removal_mask_1.png',
      }, 'built-in-smooth', function(value) {
        load_value = value;
      });
      
      panel2.button('load_mask', 'Load', function() {
        var value = load_value;
        
        if (value == 'built-in-smooth') {
          console.log("Reloading built-in blue noise mask. . .");
          
          //localStorage.startup_mask_bn4 = blue_mask_file;
          new indexdb_store.IndexDBStore("bluenoise_mask").write("data", smoothmask_file);

          _appstate.bluenoise.load_mask(smoothmask_file);
        } else if (value == 'built-in') {
          console.log("Reloading built-in blue noise mask. . .");
          //localStorage.startup_mask_bn4 = blue_mask_file;
          new indexdb_store.IndexDBStore("bluenoise_mask").write("data", blue_mask_file);

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
            
            if (!data.startsWith("SMOOTHMASK"))
                data = "data:image/png;base64," + data;
            
            //localStorage.startup_mask_bn4 = data;
            new indexdb_store.IndexDBStore("bluenoise_mask").write("data", data);
            _appstate.bluenoise.load_mask(data);
          });
        }
      });
      
      panel2 = panel.panel("Misc")
      panel2.check("DRAW_TRANSPARENT", "Accumulation Mode");
      panel2.slider("ACCUM_ALPHA", "Accum Alpha", 1.0, 0.001, 1.0, 0.001, false, true);
      panel2.check("CORRECT_FOR_SPACING", "Correct_For_Spacing");
      panel2.check("LOW_RES_CUBE", "Low Res Cube");
      
      //.slider will have loaded store setting from localStorage,
      //if it exists
      colors.gen_colors();
      
      gui.load();
      gui2.load();
    }
  };
 
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
    _appstate.load();
    
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
    
    _appstate.makeGUI();
    _appstate.init();
    
    _appstate.tick_timer = window.setInterval(() => {
      _appstate.on_tick();
    }, 400);
    
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



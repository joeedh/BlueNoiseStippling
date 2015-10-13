var __appstate = undefined;

define([
  "util", "const", "bluenoise", "draw", "colors"
], function(util, cconst, bluenoise, draw, colors) {
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
        var filter = Math.max(filterw*0.5, filterh*0.5)*0.8+0.16725;
        
        var fwid = Math.ceil(filter);
        fwid = Math.max(fwid, 1.0);
        
        var totsample=fwid*fwid;
        
        totsample=Math.max(totsample, 4);
        var totsampled = 0;
        
        if (no_filter) {
          totsample = 3;
          fwid = 1;
          filter = 1.0;
        }
        
        var sumr=0, sumg=0, sumb=0, suma=0;
        
        for (var i=0; i<totsample; i++) {
          var xoff = ((i % fwid)/fwid-0.5)*2;
          var yoff = ((~~(i/fwid))/fwid-0.5)*2;
          
          var w = xoff*xoff + yoff*yoff;
          w = w == 0.0 ? 0.0 : Math.sqrt(w);
          w = 1.0 - w/Math.sqrt(2.0);
          
          w *= w*w*w;
          
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
  
  window.addEventListener("keydown", function(e) {
    _appstate.on_keydown(e);
  });
  
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

  exports.onload1 = function() {
    console.log("loaded!");
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
    
    function bind_check(checkid, textlabel) {
      var div = document.getElementById('form');
      
      var check = document.createElement("input");
      
      var stored_val = load_setting(checkid.toUpperCase());
      
      if (stored_val != undefined) {
        window[checkid.toUpperCase()] = stored_val;
      }
      
      if (!(checkid.toUpperCase() in window)) {
          window[checkid.toUpperCase()] = 0;
      } else {
          check.checked = !!window[checkid.toUpperCase()];
      }
      
      check.type = "checkbox";
      check.id = checkid;

      var tn = document.createTextNode(textlabel);
      var label = document.createElement("label")

      label.appendChild(check);
      label.appendChild(tn);
      
      var li = document.createElement("li");
      li.appendChild(label);
      div.appendChild(li);
      
      check.onclick = function(e) {
        var val = check.checked;
        
        window[checkid.toUpperCase()] = check.checked;
        
        save_setting(checkid.toUpperCase(), check.checked);
        redraw_all();
      }
    }
    
    function bind_button(id, name, callback, thisvar) {
      var div = document.getElementById('form');
      var button = document.createElement("input")
      var label = document.createElement("label");
      
      label.appendChild(button);
      button.type = "button";
      button.value = name;
      
      button.onclick = function() {
          if (thisvar != undefined) {
              callback.apply(thisvar, this);
          } else {
              callback(this);
          }
      }
      
      var li = document.createElement("li");
      li.appendChild(label);
      div.appendChild(li);
      
      //label.appendChild(document.createTextNode(name));
    }
    
    function bind_slider(name, textlabel, min, max, step, is_int) {
      var div = document.getElementById('form');
      var slider = document.createElement("input")
      var label = document.createElement("label");
      
      var valtext = document.createTextNode("")
      
      var sid = name.toUpperCase();
      
      label.appendChild(valtext);
      label.appendChild(slider);
      label.appendChild(document.createTextNode(textlabel));
      
      slider.type = "range";
      slider.min = min;
      slider.max = max;
      slider.value = name;
      slider.id = name

      if (step != undefined)
        slider.step  = step;
      
      window._slider = slider;
      
      var sid = name.toUpperCase();
      
      var val2 = load_setting(sid);
      
      if (val2 != undefined) {
        slider.value = val2;
        window[sid] = slider.valueAsNumber;
      } else if (window[sid] != undefined) {
        slider.value = window[sid]
      }
      
      var col = 4;
      function pad_number(str, n) {
          while (str.length < n) {
            str = "0" + str;
          }
          
          return str;
      }

      valtext.textContent =  is_int ? ~~slider.value : slider.valueAsNumber.toFixed(3);
      valtext.textContent = pad_number(valtext.textContent, col);
      
      slider.onchange = function() {
          var val = this.valueAsNumber;
          val = is_int ? ~~val : val;
          
          window[sid] = this.valueAsNumber;
          
          console.log("Setting", sid, "to", val);
          save_setting(sid, val);
          slider.value = val;
          
          valtext.textContent = is_int ? ~~slider.value : slider.valueAsNumber.toFixed(3);
          valtext.textContent = pad_number(valtext.textContent, col);
          
          redraw_all();
      }
      
      var li = document.createElement("li")
      li.appendChild(label);
      
      div.appendChild(li);
    }
    
    bind_button("reset", "Reset", function() {
      colors.gen_colors();
      _appstate.init();
      _appstate.reset();
      
      redraw_all();
    });
    
    bind_button("step", "Generate Points", function() {
      _appstate.bluenoise.step();
      redraw_all();
    });
    
    bind_slider("dimen", "Density", 1, 2048, 1, true);
    bind_slider("steps", "Points Per Step", 1, 50000, 1, true);
    bind_slider("draw_rmul", "Point Size", 0.1, 15.0, 0.01, false);
    bind_slider("rand_fac", "Added Random", 0.0, 3.0,0.005, false);
    bind_slider("dither_rand_fac", "Dither Random", 0.0, 3.0,0.005, false);
    
    bind_button("save_img", "Save Rendered Image", function() {
      var size = RENDERED_IMAGE_SIZE;
      
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
      
      var scale = Math.min(canvas.width, canvas.height);
      
      g.scale(scale, scale);
      g.translate(1.0, 1.0);
      
      _appstate.drawer.draw_points(g);
      
      console.log("finished rendering image")
      
      var url = canvas.toDataURL();
      
      console.log("done.");
      
      window.open(url);
    });
    
    bind_slider("rendered_image_size", "Rendered Image Size", 1, 4096, 1, true);

    bind_check("dither_colors", "Dither Colors");
    bind_check("show_colors", "Show Colors");
    bind_check("adaptive_color_density", "More Dense In Colored Areas")
    bind_check("hexagon_mode", "Arrange Points As Hexagons");
    bind_check("allow_purple", "Include Purple In Palette");
    bind_check("grid_mode", "Be More Grid Like");
    
    bind_check("draw_transparent", "Accumulation Mode");
    bind_slider("accum_alpha", "Accum Alpha", 0.001, 1.0, 0.001, false);
    
    //function bind_slider(name, textlabel, min, max, step, is_int)
    bind_slider("pal_colors", "Number of Colors (Times 9)", 1, 32, 1, true);
    
    //bind_slider will have loaded store setting from localStorage,
    //if it exists
    colors.gen_colors();
    
    bind_slider("scale", "Scale", 0.05, 5.0, 0.01, false);
    bind_slider("panx", "Pan X", -1.5, 1.5, 0.01, false);
    bind_slider("pany", "Pan Y", -1.5, 1.5, 0.01, false);
    
    bind_check("correct_for_spacing", "Correct For Spacing");
    
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



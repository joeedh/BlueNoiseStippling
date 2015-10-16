//bind module to global var to get at it in console.
//
//note that require has an api for handling circular 
//module refs, in such cases do not use these vars.

var _ui = undefined;

define([
  'util', 'dat.gui', 'const'
], function(util, dat1, cconst) {
  'use strict';
  
  var exports = _ui = {};
  var Class = util.Class;
  
  function save_setting(key, val) {
    var settings = localStorage.startup_file_bn6;
    
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
    localStorage.startup_file_bn6 = JSON.stringify(settings);
  }
  
  function load_setting(key) {
    var settings = localStorage.startup_file_bn6;
    
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
  
  var UI = exports.UI = Class([
    function constructor(dat_obj) {
      this.dat = dat_obj == undefined ? new dat.GUI() : dat_obj;
    },
    
    function panel(name) {
      var f = this.dat.addFolder(name);
      f.open();
      
      return new UI(f);
    },
    
    function close() {
      this.dat.close();
    },
    
    function open() {
      this.dat.open();
    },
    
    function button(id, label, cb, thisvar) {
      return this.dat.add({cb : function() {
        if (thisvar != undefined)
          cb.call(thisvar);
        else
          cb();
      }}, 'cb').name(label);
    },
    
    function check(id, name, is_param) {
      var ret = {};
      
      var upperid = id.toUpperCase();
      
      var val = load_setting(upperid);
      if (val != undefined) {
        window[upperid] = val;
      }
      
      Object.defineProperty(ret, id, {
        get : function() {
          return !!window[upperid];
        },
        
        set : function(val) {
          if (!!window[upperid] != !!val) {
            save_setting(upperid, val);
            window[upperid] = val;
            window.redraw_all();
          }
        }
      });
      
      return this.dat.add(ret, id).name(name);
    },
    
    function slider(id, name, min, max, step, is_int, do_redraw) {
      var ret = {};

      var upperid = id.toUpperCase();
      
      var val = load_setting(upperid);
      if (val != undefined) {
        window[upperid] = val;
      }
      
      Object.defineProperty(ret, id, {
        get : function() {
          return Number(window[upperid]);
        },
        
        set : function(val) {
          if (do_redraw && window[upperid] != val) {
            window.redraw_all();
          }
          
          save_setting(upperid, val);
          window[upperid] = val;
        }
      });
      
      return this.dat.add(ret, id).name(name).min(min).max(max).step(step).name(name);
    }
  ]);
  
  return exports;
});

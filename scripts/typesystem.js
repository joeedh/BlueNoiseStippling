var _typesystem = undefined;

/*
This module implements ES6 classes in ES5 syntax, since
(aggrevatingly) only Google Chrome supports ES6 classes natively
at this time (I was going to throw it away when ES6
was released, but alas, it's implementation has been slow. . .)
*/

define([
], function() {
  'use strict';
  
  var exports = _typesystem = {};
  
  function ClassGetter(func) {
    this.func = func;
  }
  function ClassSetter(func) {
    this.func = func;
  }

  var prototype_idgen = 1;
  var defined_classes = exports.defined_classes = [];

  var StaticMethod = function StaticMethod(func) {
    this.func = func;
  }
    
  var handle_statics = function(cls, parent) {
    for (var k in cls.prototype) {
      if (cls.prototype[k] instanceof StaticMethod) {
        var func = cls.prototype[k];
        
        delete cls.prototype[k];
        cls[k] = func.func;
      }
    }
    
    if (parent != undefined) {
      for (var k in parent) {
        var v = parent[k];
        
        //only inherit static methods added to parent with this module
        if ((v == undefined || "_is_static_method" in v) && !(k in cls)) {
          cls[k] = v;
        }
      }
    }
  }

  var Class = exports.Class = function Class(methods) {
    var construct = undefined;
    var parent = undefined;
    
    if (arguments.length > 1) {
      //a parent was passed in
      
      parent = methods;
      methods = arguments[1];
    }
    
    for (var i=0; i<methods.length; i++) {
      var f = methods[i];
      var name = f._typesystem_name != undefined ? f._typesystem_name : f.name;
      
      if (name == "constructor") {
        construct = f;
        break;
      }
    }
    
    if (construct == undefined) {
      console.log("Warning, constructor was not defined", methods);
      
      if (parent != undefined) {
        construct = function() {
          parent.apply(this, arguments);
        }
      } else {
        construct = function() {
        }
      }
    }
    
    if (parent != undefined) {
      construct.prototype = Object.create(parent.prototype);
    }
    
    construct.prototype.__prototypeid__ = prototype_idgen++;
    construct[Symbol.keystr] = function() {
      return this.prototype.__prototypeid__;
    }
    
    construct.__parent__ = parent;
    construct.__statics__ = [];
    
    var getters = {};
    var setters = {};
    var getset = {};
    
    var statics = {}
    
    //handle getters/setters
    for (var i=0; i<methods.length; i++) {
      var f = methods[i];
      
      var name;
      
      if (f.func != undefined) {
        name = f.func._typesystem_name != undefined ? f.func._typesystem_name : f.func.name;
      }
      
      if (f instanceof ClassSetter) {
        setters[name] = f.func;
        getset[name] = 1;
      } else if (f instanceof ClassGetter) {
        getters[name] = f.func;
        getset[name] = 1;
      } else if (f instanceof StaticMethod) {
        statics[name] = f.func;
      }
    }
    
    for (var k in statics) {
      construct[k] = statics[k];
    }
    
    for (var k in getset) {
      var def = {
        enumerable   : false,
        configurable : true,
        get : getters[k],
        set : setters[k]
      }
      
    //  console.log("k", "\""+k+"\"", def, getters[k]);
      Object.defineProperty(construct.prototype, k, def);
    }
    
    handle_statics(construct, parent);
    
    if (parent != undefined)
      construct.__parent__ = parent;
    
    for (var i=0; i<methods.length; i++) {
      var f = methods[i];
      
      var name = f._typesystem_name != undefined ? f._typesystem_name : f.name;
      
      if (f instanceof ClassGetter || f instanceof ClassSetter)
        continue;

      construct.prototype[name] = f;
    }
    
    return construct;
  }

  Class.getter = Class.get = function(func) {
    return new ClassGetter(func);
  }
  Class.setter = Class.set = function(func) {
    return new ClassSetter(func);
  }

  var static_method = exports.static_method = function static_method(func) {
    func._is_static_method = true;
    return new StaticMethod(func);
  }

  Class.static = Class.static_method = function(func) {
    func._is_static_method = true;
    return new StaticMethod(func);
  }

  Class.symbol = function(func) {
    func._typesystem_name = Symbol[func.name];
    
    return func;
  }
  
  var mixin = exports.mixin = function mixin(cls, parent) {
    for (var k in parent.prototype) {
      if (!(k in cls.prototype)) {
        cls.prototype[k] = parent.prototype[k];
      }
    }
  }
  
  return exports;
});

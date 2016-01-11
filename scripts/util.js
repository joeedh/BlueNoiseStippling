var _util = undefined;
define([
  'polyfill',
  'typesystem'
], function(_polyfill, typesystem) {
  "use strict";
  
  var exports = _util = {};
  
  for (var k in typesystem) {
      exports[k] = typesystem[k];
  }
    
  var Class = typesystem.Class;
  
  window.tm = 0.0;

  var time_ms = exports.time_ms = function time_ms() {
    if (window.performance)
      return window.performance.now();
    else
      return new Date().getMilliseconds();
  }
  
  //unordered array
  var RandomArray = exports.RandomArray = typesystem.Class([
    function constructor() {
      Array.apply(this, arguments);
    },
    
    //pop by swapping with last item in unordered array
    function pop_i(i) {
      if (this.length < 2) {
        var ret = this[i];
        
        this.length = 0;
        return ret;
      }
      
      var ret = this[i];
      this[i] = this[this.length-1];
      this.length--;
      
      return ret;
    },
    
    function remove(item, no_error) {
      var i = this.indexOf(item);
      
      if (i < 0) {
        if (!no_error) {
          console.trace("WARNING: item not in array!", item);
          return;
        } else {
          throw new Error("Item not in array: " + item);
        }
      }
      
      this.pop_i(item);
    }
  ]);

  var cachering = exports.cachering = Class(Array, [
    function constructor(func, size) {
      Array.call(this); //super()
      
      this.cur = 0;
      
      for (var i=0; i<size; i++) {
        this.push(func());
      }
    },
    
    Class.static(function fromConstructor(cls, size) {
      var func = function() {
        return new cls();
      }
      
      return new exports.cachering(func, size);
    }),
    
    function next() {
      var ret = this[this.cur];
      this.cur = (this.cur+1)%this.length;
      
      return ret;
    }
  ]);

  var SetIter = exports.SetIter = Class([
    function constructor(set) {
      this.set = set;
      this.i   = 0;
      this.ret = {done : false, value : undefined};
    },

    Class.symbol(function iterator() {
      return this;
    }),
    
    function next() {
      var ret = this.ret;

      while (this.i < this.set.items.length && this.set.items[this.i] === EmptySlot) {
        this.i++;
      }
      
      if (this.i >= this.set.items.length) {
        ret.done = true;
        ret.value = undefined;
        
        return ret;
      }
      
      
      ret.value = this.set.items[this.i++];
      return ret;
    }
  ]);

  var EmptySlot = {};

  var set = exports.set = Class([
    function constructor(input) {
      this.items = [];
      this.keys = {};
      this.freelist = [];
      
      this.length = 0;
      
      if (typeof input == "string") {
        input = new String(input);
      }
      
      if (input != undefined) {
        if (Symbol.iterator in input) {
          for (var item of input) {
            this.add(item);
          }
        } else if ("forEach" in input) {
          input.forEach(function(item) {
            this.add(item);
          }, this);
        } else if (input instanceof Array) {
          for (var i=0; i<input.length; i++) {
            this.add(input[i]);
          }
        }
      }
    },
    
    Class.symbol(function iterator() {
      return new SetIter(this);
    }),
    
    function add(item) {
      var key = item[Symbol.keystr]();
      
      if (key in this.keys) return;
      
      if (this.freelist.length > 0) {
        var i = this.freelist.pop();
        
        this.keys[key] = i;
        this.items[i] = item;
      } else {
        var i = this.items.length;
        
        this.keys[key] = i;
        this.items.push(item);
      }
      
      this.length++;
    },
    
    function remove(item) {
      var key = item[Symbol.keystr]();
      
      if (!(key in this.keys)) {
        console.trace("Warning, item", item, "is not in set");
        return;
      }
      
      var i = this.keys[key];
      this.freelist.push(i);
      this.items[i] = EmptySlot;
      
      delete this.keys[key];
      
      this.length--;
    },
    
    function has(item) {
      return item[Symbol.keystr]() in this.keys;
    },
    
    function forEach(func, thisvar) {
      for (var i=0; i<this.items.length; i++) {
        var item = this.items[i];
        
        if (item === EmptySlot) 
          continue;
          
        thisvar != undefined ? func.call(thisvar, item) : func(item);
      }
    }
  ]);

  var _hash_null = {};

  var hashtable = exports.hashtable = Class([
    function constructor() {
      this.items = [];
      this._keys = {};
      this.length = 0;
    },
    
    function set(key, val) {
      key = key[Symbol.keystr]();
      
      var i;
      if (!(key in this._keys)) {
        i = this.items.length;
        this.items.push(0);
        this._keys[key] = i;
        
        this.length++;
      } else {
        i = this._keys[key];
      }
      
      this.items[i] = val;
    },
    
    function remove(key) {
      key = key[Symbol.keystr]();
      
      if (!(key in this._keys)) {
        console.trace("Warning, key not in hashtable:", key);
        return;
      }
      
      var i = this._keys[key];
      this.items[i] = _hash_null;
      delete this._keys[key];
      this.length--;
    },
    
    function has(key) {
      key = key[Symbol.keystr]();
      
      return key in this._keys;
    },
    
    function get(key) {
      key = key[Symbol.keystr]();
      if (!(key in this._keys)) {
        console.trace("Warning, item not in hash", key);
        return undefined;
      }
      
      return this.items[this._keys[key]];
    },
    
    function add(key, val) {
      return this.set(key, val);
    },
    
    function keys() {
      return Object.keys(this._keys);
    },
    
    function values() {
      var ret = [];
      var len = this.items.length;
      
      for (var i=0; i<len; i++) {
        var item = this.items[i];
        if (item !== _hash_null)
          ret.push(item);
      }
      
      return ret;
    },
    
    function forEach(cb, thisvar) {
      if (thisvar == undefined)
        thisvar = self;
      
      for (var k in this._keys) {
        var i = this._keys[k];
        cb.call(thisvar, k, this.items[i]);
      }
    }
  ]);

  var IDGen = exports.IDGen = Class([
    function constructor() {
      this._cur = 1;
    },
    
    function next() {
      return this._cur++;
    },
    
    function max_cur(id) {
      this._cur = Math.max(this._cur, id+1);
    },
    
    function toJSON() {
      return {
        _cur : this._cur
      };
    },
    
    Class.static(function fromJSON(obj) {
      var ret = new IDGen();
      ret._cur = obj._cur;
      return ret;
    })
  ]);


  function get_callstack(err) {
    var callstack = [];
    var isCallstackPopulated = false;

    var err_was_undefined = err == undefined;

    if (err == undefined) {
      try {
        _idontexist.idontexist+=0; //doesn't exist- that's the point
      } catch(err1) {
        err = err1;
      }
    }

    if (err != undefined) {
      if (err.stack) { //Firefox
        var lines = err.stack.split('\n');
        var len=lines.length;
        for (var i=0; i<len; i++) {
          if (1) {
            lines[i] = lines[i].replace(/@http\:\/\/.*\//, "|")
            var l = lines[i].split("|")
            lines[i] = l[1] + ": " + l[0]
            lines[i] = lines[i].trim()
            callstack.push(lines[i]);
          }
        }
        
        //Remove call to printStackTrace()
        if (err_was_undefined) {
          //callstack.shift();
        }
        isCallstackPopulated = true;
      }
      else if (window.opera && e.message) { //Opera
        var lines = err.message.split('\n');
        var len=lines.length;
        for (var i=0; i<len; i++) {
          if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
            var entry = lines[i];
            //Append next line also since it has the file info
            if (lines[i+1]) {
              entry += ' at ' + lines[i+1];
              i++;
            }
            callstack.push(entry);
          }
        }
        //Remove call to printStackTrace()
        if (err_was_undefined) {
          callstack.shift();
        }
        isCallstackPopulated = true;
      }
     }

      var limit = 24;
      if (!isCallstackPopulated) { //IE and Safari
        var currentFunction = arguments.callee.caller;
        var i = 0;
        while (currentFunction && i < 24) {
          var fn = currentFunction.toString();
          var fname = fn.substring(fn.indexOf("function") + 8, fn.indexOf('')) || 'anonymous';
          callstack.push(fname);
          currentFunction = currentFunction.caller;
          
          i++;
        }
      }
    
    return callstack;
  }

  var print_stack = exports.print_stack = function print_stack(err) {
    try {
      var cs = get_callstack(err);
    } catch (err2) {
      console.log("Could not fetch call stack.");
      return;
    }
    
    console.log("Callstack:");
    for (var i=0; i<cs.length; i++) {
      console.log(cs[i]);
    }
  }
  
  //return_arraybuffer is optional, false
  var fetch_file = exports.fetch_file = function fetch_file(path, return_arraybuffer) {
      var url = location.origin + "/" + path
      
      var req = new XMLHttpRequest(
      );
      
      if (return_arraybuffer) {
        req.responseType = "arraybuffer";
      }
      
      return new Promise(function(accept, reject) {
        req.open("GET", url)
        req.onreadystatechange = function(e) {
          if (req.status == 200 && req.readyState == 4) {
            accept(req.response);
          } else if (req.status >= 400) {
            reject(req.status, req.statusText);
          }
        }
        req.send();
      });
  }
  
  
  //from: https://en.wikipedia.org/wiki/Mersenne_Twister
  function _int32(x) {
      // Get the 31 least significant bits.
      return ~~(((1<<30)-1) & (~~x))
  }

  var MersenneRandom = exports.MersenneRandom = Class([
    function constructor(seed) {
          // Initialize the index to 0
          this.index = 624;
          this.mt = new Uint32Array(624);
          
          this.seed(seed);
      },
      
      function save() {
        var mt = new Uint32Array(this.mt.length);
        
        for (var i=0; i<mt.length; i++) {
          mt[i] = this.mt[i];
        }
        
        return {
          index : this.index,
          mt    : mt,
        }
      },
      
      function load(mt) {
        this.mt = mt.mt;
        this.index = mt.index;
        
        return this;
      },
      
      function seed(seed) {
          // Initialize the index to 0
          this.index = 624;
          this.mt.fill(0, 0, this.mt.length);
          
          this.mt[0] = seed;  // Initialize the initial state to the seed
          
          for (var i=1; i<624; i++) {
              this.mt[i] = _int32(
                  1812433253 * (this.mt[i - 1] ^ this.mt[i - 1] >> 30) + i);
          }
      },
      
      function extract_number() {
          if (this.index >= 624)
              this.twist();

          var y = this.mt[this.index];

          // Right shift by 11 bits
          y = y ^ y >> 11;
          // Shift y left by 7 and take the bitwise and of 2636928640
          y = y ^ y << 7 & 2636928640;
          // Shift y left by 15 and take the bitwise and of y and 4022730752
          y = y ^ y << 15 & 4022730752;
          // Right shift by 18 bits
          y = y ^ y >> 18;

          this.index = this.index + 1;

          return _int32(y);
      },
      
      function random() {
        return this.extract_number() / (1<<30);
      },
      
      function twist() {
          for (var i=0; i<624; i++) {
              // Get the most significant bit and add it to the less significant
              // bits of the next number
              var y = _int32((this.mt[i] & 0x80000000) +
                         (this.mt[(i + 1) % 624] & 0x7fffffff));
              this.mt[i] = this.mt[(i + 397) % 624] ^ y >> 1;

              if (y % 2 != 0)
                  this.mt[i] = this.mt[i] ^ 0x9908b0df;
          }
          
          this.index = 0;
    }
  ]);

  var _mt = new MersenneRandom(0);
  exports.random = function() {
    return _mt.extract_number() / (1<<30);
  }
  
  exports.seed = function(n) {
    _mt.seed(n);
  }
  
  var _seedstack = exports._seedstack = [];
  exports.seed.push = function(seed) {
    _seedstack.push(_mt.save());
    
    _mt.seed(seed == undefined ? 0 : seed);
  }
  
  exports.seed.pop = function() {
    _mt.load(_seedstack.pop());
  }
  
  return exports;
});

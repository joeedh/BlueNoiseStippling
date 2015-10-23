var _spectrum = undefined;

define([
  "util", "const"
], function(util, cconst) {
  'use strict';
  
  var exports = _spectrum = {};
  
  var Class = util.Class;
  var set = util.set;
  
  var Hist2d = exports.Hist2d = Class([
    function constructor(size) {
      this.gridsize = size;
      this.grid = new Int32Array(size*size);
      this.grid.fill(0, 0, this.grid.length);
      
      this.min = this.max = -1;
    },
    
  ]);
  
  return exports;
});

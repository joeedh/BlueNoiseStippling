var _draw = undefined;

define([
  "util", 'colors'
], function(util, colors) {
  'use strict';
  
  var exports = _draw = {};
  var Class = util.Class;
  
  var Drawer = exports.Drawer = Class([
    function constructor(appstate) {
      this.appstate = appstate;
      this.bluenoise = appstate.bluenoise;
    },
  
    function reset() {
    },
    
    function draw_transform(g) {
      var canvas = this.appstate.canvas;
      
      var scale = Math.min(canvas.width, canvas.height)*0.5;
      
      g.scale(scale, scale);
      g.translate(1.0, 1.0);
      
      var s2 = window.SCALE;
      g.scale(s2, s2);
      
      g.translate(s2*window.PANX, s2*window.PANY);
    },
    
    function draw_points(g) {
      var points = this.bluenoise.points, size = this.bluenoise.gridsize;

      for (var si=0; si<colors.colors.length; si++) {
        var c = colors.colors[si];
        
        var r = ~~(c[0]*255);
        var g1 = ~~(c[1]*255);
        var b = ~~(c[2]*255);
        
        if (!SHOW_COLORS) {
          r=g1=b=1.0;
        }
        
        g.fillStyle = "rgba(" + r + "," + g1 + "," + b + ",1.0)";
        g.beginPath();
        
        util.seed.push(0);
        var szfac = 1.0 / this.bluenoise.gridsize;
        
        for (var i=0; i<points.length; i += PTOT) {
          var x = points[i];
          var y = points[i+1];
          var radius = points[i+PRADIUS];
          var colorid = points[i+PID];
          
          x += (util.random()-0.5)*RAND_FAC*szfac;
          y += (util.random()-0.5)*RAND_FAC*szfac;
          
          if (colorid != si) {
            continue;
          }

          var w = radius/2.0;
          
          g.moveTo(x, y);
          g.arc(x, y, w*DRAW_RMUL, 0, Math.PI*2);
        }      
        
        g.fill();
      }
      
      util.seed.pop();
    },
    
    function draw(g) {
      g.save();
      
      this.draw_transform(g);
      this.draw_points(g);
      
      g.restore();
    }
  ]);
  
  return exports;
});

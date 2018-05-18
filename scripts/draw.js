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
  
    function reset(raster_image) {
      this.raster_image = raster_image; //can be undefined
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
    
    function scale_point_r(r) {
      var maxr = 15 / (Math.sqrt(2)*this.bluenoise.dimen);
      let minr = 4.0 / (Math.sqrt(2)*this.bluenoise.dimen);
      
      r = 1.0 / (1 + 9.0*r/maxr);
      r *= minr*0.9;
      //r = Math.min(Math.max(maxr-r, 0.0001), minr)*0.5;

      return Math.max(r, minr*0.01);
    },
    
    function tri_mode_draw(g) {
      var ps = this.bluenoise.points;
      var ts = this.bluenoise.tris;
      var vcells = this.bluenoise.vcells;
      
      if (ts == undefined || vcells == undefined) return;
      
      g.lineWidth = 0.001;
      /*
      g.beginPath();
      for (var i=0; i<ts.length; i += 3) {
        var v1 = ts[i]*PTOT, v2 = ts[i+1]*PTOT, v3 = ts[i+2]*PTOT;
        g.moveTo(ps[v1], ps[v1+1]);
        g.lineTo(ps[v2], ps[v2+1]);
        g.lineTo(ps[v3], ps[v3+1]);
        g.lineTo(ps[v1], ps[v1+1]);
      }
      g.rect(0, 0, 0.7, 0.4);
      g.stroke();
      //*/
      
      g.beginPath();
      //var minr = this.bluenoise.minr;
      var minr = 1.0 / (Math.sqrt(2)*this.bluenoise.dimen);
      
      console.log("MINR", minr);
      
      var totcolor = colors.colors.length;
      for (var ci=0; ci<totcolor; ci++) {
        var clr = colors.colors[ci];
        
        var r  = ~~(clr[0]*255);
        var g1 = ~~(clr[1]*255);
        var b  = ~~(clr[2]*255);
        
        g.fillStyle = "rgba("+r+","+g1+","+b+", 1)";
        g.strokeStyle = "white"; //g.fillStyle
          
        g.beginPath();
          
        for (var i=0; i<ps.length; i += PTOT) {
          var i1 = i;
          var x = ps[i], y = ps[i+1], r = ps[i+PRADIUS2];
          var pi = i/PTOT;
          
          //if (r > minr*5.0) {
          //  continue;
          //}
          
          if (ps[i+PID] != ci)
            continue;
          
          //if (pi % 4 != 0) continue;
          
          var vj = pi*MAX_VCELL_SIZE;
          var lastvpi = undefined;
          
          var fx=undefined, fy=undefined;
          var rad = ps[i+PRADIUS]*0.9;
          
          if (SCALE_POINTS) {
            rad = this.scale_point_r(ps[i+PRADIUS2]);
          }
          
          var fac = (1.0/r)*rad;
          
          fac *= DRAW_RMUL;
          
          for (var j=0; j<MAX_VCELL_SIZE; j++, vj++) {
            var vpi = vcells[vj];
            
            if (vpi == -1) break;
            
            var x2 = ps[lastvpi*PTOT], y2 = ps[lastvpi*PTOT+1];
            var x3 = ps[vpi*PTOT], y3 = ps[vpi*PTOT+1];
            var cx, cy;
            
            lastvpi = vpi;
            
            if (j == 0) {
              continue;
            }

            cx = (x+x2+x3)/3;
            cy = (y+y2+y3)/3;
            
            cx = (cx - x)*fac + x;
            cy = (cy - y)*fac + y;
            
            if (fx == undefined) {
              fx = x2;
              fy = y2;
              
              g.moveTo(cx, cy);
            } else {
              g.lineTo(cx, cy);
            }
          }
          
          var x2 = ps[lastvpi*PTOT], y2 = ps[lastvpi*PTOT+1];
          var x3 = ps[vpi*PTOT], y3 = ps[vpi*PTOT+1];
          
          cx = (x+x2+fx)/3;
          cy = (y+y2+fy)/3;
          cx = (cx - x)*fac + x;
          cy = (cy - y)*fac + y;
          
          g.lineTo(cx, cy);
        }
        
        //g.stroke();
        g.fill();
      }      
//      g.stroke();
    },
    
    function draw_points(g) {
      var points = this.bluenoise.points, size = this.bluenoise.gridsize;
      
      //g.globalCompositeOperation = "darken";
      
      for (var si=0; si<colors.colors.length; si++) {
        var c = colors.colors[si];
        
        var r  = ~~(c[0]*255);
        var g1 = ~~(c[1]*255);
        var b  = ~~(c[2]*255);
        var alpha = 1.0;
        
        if (DRAW_TRANSPARENT) {
          alpha = ACCUM_ALPHA;
        }
        
        if (!SHOW_COLORS) {
          r=g1=b=1.0;
        }
        
        g.fillStyle = "rgba(" + r + "," + g1 + "," + b + ","+alpha+")";
        
        g.beginPath();
        
        util.seed.push(0);
        var szfac = 1.0 / this.bluenoise.gridsize;
        
        for (var i=0; i<points.length; i += PTOT) {
          var colorid = points[i+PID];
          
          if (colorid != si) {
            continue;
          }
          
          var x = points[i];
          var y = points[i+1];
          var radius = points[i+PRADIUS];
          
          var inten = points[i+PINTEN];
          
          var ix = ~~((x*0.5+0.5)*size);
          
          if (HEXAGON_MODE && ix%2==0) {
            y -= 0.5/size;
          }
          
          //increase randomness in dark areas
          x += (util.random()-0.5)*RAND_FAC*(2.0 - inten)*szfac;
          y += (util.random()-0.5)*RAND_FAC*(2.0 - inten)*szfac;

          var w = radius/2.0;
          if (SCALE_POINTS) {
            w = this.scale_point_r(points[i+PRADIUS2])*0.5;
          }
          
          if (DRAW_TRANSPARENT) {
            g.beginPath()
          }
          
          g.moveTo(x, y);
          g.arc(x, y, w*DRAW_RMUL, 0, Math.PI*2);
          
          //var w2 = w*DRAW_RMUL;
          //g.rect(x-w2*0.5, y-w2*0.5, w2, w2);
          
          if (DRAW_TRANSPARENT) {
            g.fill();
          }
        }      
        
        if (!DRAW_TRANSPARENT) {
          g.fill();
        }
      }
      
      util.seed.pop();
    },
    
    function draw_points2(g) {
      var points = this.bluenoise.points, size = this.bluenoise.gridsize;

      for (var si=0; si<4; si++) {
        //var c = colors.colors[si];
        var c = [0, 0, 0];
        if (si > 0) {
          if (si == 2)
            c[si-1] = 0.7;
          else
            c[si-1] = 1;
        }
        
        var r = ~~(c[0]*255);
        var g1 = ~~(c[1]*255);
        var b = ~~(c[2]*255);
        var alpha = 1.0;
        
        if (DRAW_TRANSPARENT) {
          alpha = ACCUM_ALPHA;
        }
        
        if (!SHOW_COLORS) {
          r=g1=b=1.0;
        }
        
        g.fillStyle = "rgba(" + r + "," + g1 + "," + b + ","+alpha+")";
        
        g.beginPath();
        
        util.seed.push(0);
        var szfac = 1.0 / this.bluenoise.gridsize;
        
        for (var i=0; i<points.length; i += PTOT) {
          var colorid = points[i+PLVL];
          
          if (colorid != si) {
            continue;
          }
          
          var x = points[i];
          var y = points[i+1];
          var radius = points[i+PRADIUS];
          
          var inten = points[i+PINTEN];
          
          var ix = ~~((x*0.5+0.5)*size);
          
          if (HEXAGON_MODE && ix%2==0) {
            y -= 0.5/size;
          }
          
          //increase randomness in dark areas
          x += (util.random()-0.5)*RAND_FAC*(2.0 - inten)*szfac;
          y += (util.random()-0.5)*RAND_FAC*(2.0 - inten)*szfac;

          var w = radius/2.0;
          
          if (DRAW_TRANSPARENT) {
            g.beginPath()
          }
          
          g.moveTo(x, y);
          g.arc(x, y, w*DRAW_RMUL, 0, Math.PI*2);
          
          //var w2 = w*DRAW_RMUL;
          //g.rect(x-w2*0.5, y-w2*0.5, w2, w2);
          
          if (DRAW_TRANSPARENT) {
            g.fill();
          }
        }      
        
        if (!DRAW_TRANSPARENT) {
          g.fill();
        }
      }
      
      util.seed.pop();
    },
    
    function draw(g) {
      g.save();
      
      g.clearRect(0, 0, this.appstate.canvas.width, this.appstate.canvas.height);
      g.beginPath();
      g.rect(0, 0, this.appstate.canvas.width, this.appstate.canvas.height);
      
      g.fillStyle = BLACK_BG ? "black" : "white";
      g.fill();
      g.fillStyle = "white";
      
      if (RASTER_IMAGE && this.raster_image != undefined) {
        g.putImageData(this.raster_image, 20, 20);
      } else if (TRI_MODE) {
        this.draw_transform(g);
        this.tri_mode_draw(g);
      } else {
        this.draw_transform(g);
        this.draw_points(g);
      }
      
      if (SHOW_KDTREE) {
        g.lineWidth = 0.001;
        _appstate.bluenoise.calc_kdtree();
        _appstate.bluenoise.kdtree2.draw(g);
      }
      
      g.restore();
    }
  ]);
  
  return exports;
});

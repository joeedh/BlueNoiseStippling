var _draw = undefined;

define([
  "util", "colors", "render"
], function (util, colors, render) {
  'use strict';

  let exports = _draw = {};

  exports.Drawer = class Drawer {
    constructor(appstate) {
      this.appstate = appstate;
      this.bluenoise = appstate.bluenoise;
    }

    reset(raster_image) {
      this.raster_image = raster_image; //can be undefined
    }

    draw_transform(g) {
      let canvas = this.appstate.canvas;

      let scale = Math.min(canvas.width, canvas.height)*0.5;

      g.scale(scale, scale);
      g.translate(1.0, 1.0);

      let s2 = window.SCALE;
      g.scale(s2, s2);

      g.translate(s2*window.PANX, s2*window.PANY);
    }

    scale_point_r(r) {
      let maxr = 15/(Math.sqrt(2)*this.bluenoise.dimen);
      let minr = 4.0/(Math.sqrt(2)*this.bluenoise.dimen);

      r = 1.0/(1 + 9.0*r/maxr);
      r *= minr*0.9;
      //r = Math.min(Math.max(maxr-r, 0.0001), minr)*0.5;

      return Math.max(r, minr*0.01);
    }

    tri_mode_draw(g) {
      let ps = this.bluenoise.points;
      let ts = this.bluenoise.tris;
      let vcells = this.bluenoise.vcells;

      if (ts === undefined || vcells === undefined) return;

      g.lineWidth = 0.001;
      /*
      g.beginPath();
      for (var i=0; i<ts.length; i += 3) {
        let v1 = ts[i]*PTOT, v2 = ts[i+1]*PTOT, v3 = ts[i+2]*PTOT;
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
      let minr = 1.0/(Math.sqrt(2)*this.bluenoise.dimen);

      console.log("MINR", minr);

      let totcolor = colors.colors.length;
      for (var ci = 0; ci < totcolor; ci++) {
        let clr = colors.colors[ci];

        let r = ~~(clr[0]*255);
        let g1 = ~~(clr[1]*255);
        let b = ~~(clr[2]*255);

        g.fillStyle = "rgba(" + r + "," + g1 + "," + b + ", 1)";
        g.strokeStyle = "white"; //g.fillStyle

        g.beginPath();

        for (var i = 0; i < ps.length; i += PTOT) {
          let i1 = i;
          let x = ps[i], y = ps[i + 1], r = ps[i + PRADIUS2];
          let pi = i/PTOT;

          //if (r > minr*5.0) {
          //  continue;
          //}

          if (ps[i + PID] !== ci)
            continue;

          //if (pi % 4 !== 0) continue;

          let vj = pi*MAX_VCELL_SIZE;
          let lastvpi = undefined;

          let fx = undefined, fy = undefined;
          let rad = ps[i + PRADIUS]*0.9;

          if (SCALE_POINTS) {
            rad = this.scale_point_r(ps[i + PRADIUS2]);
          }

          let fac = 0.6;//rad/r;

          fac *= DRAW_RMUL;

          for (var j = 0; j < MAX_VCELL_SIZE; j++, vj++) {
            let vpi = vcells[vj];

            if (vpi === -1) break;

            let x2 = ps[lastvpi*PTOT], y2 = ps[lastvpi*PTOT + 1];
            let x3 = ps[vpi*PTOT], y3 = ps[vpi*PTOT + 1];
            let cx, cy;

            lastvpi = vpi;

            if (j === 0) {
              continue;
            }

            cx = (x + x2 + x3)/3;
            cy = (y + y2 + y3)/3;

            cx = (cx - x)*fac + x;
            cy = (cy - y)*fac + y;

            if (fx === undefined) {
              fx = x2;
              fy = y2;

              g.moveTo(cx, cy);
            } else {
              g.lineTo(cx, cy);
            }
          }

          let x2 = ps[lastvpi*PTOT], y2 = ps[lastvpi*PTOT + 1];
          let x3 = ps[vpi*PTOT], y3 = ps[vpi*PTOT + 1];

          cx = (x + x2 + fx)/3;
          cy = (y + y2 + fy)/3;
          cx = (cx - x)*fac + x;
          cy = (cy - y)*fac + y;

          g.lineTo(cx, cy);
        }

        //g.stroke();
        g.fill();
      }
//      g.stroke();
    }

    draw_points(g) {
      let points = this.bluenoise.points, size = this.bluenoise.gridsize;

      //g.globalCompositeOperation = "darken";

      for (var si = 0; si < colors.colors.length; si++) {
        let c = colors.colors[si];

        let r = ~~(c[0]*255);
        let g1 = ~~(c[1]*255);
        let b = ~~(c[2]*255);
        let alpha = 1.0;

        if (DRAW_TRANSPARENT) {
          alpha = ACCUM_ALPHA;
        }

        if (!SHOW_COLORS) {
          r = g1 = b = BLACK_BG ? 255 : 1;
        }

        g.fillStyle = "rgba(" + r + "," + g1 + "," + b + "," + alpha + ")";

        g.beginPath();

        util.seed.push(0);
        let szfac = 1.0/this.bluenoise.gridsize;

        for (var i = 0; i < points.length; i += PTOT) {
          let colorid = points[i + PID];

          if (colorid !== si) {
            continue;
          }

          let x = points[i];
          let y = points[i + 1];
          let radius = points[i + PRADIUS];

          let inten = points[i + PINTEN];

          let ix = ~~((x*0.5 + 0.5)*size);

          if (HEXAGON_MODE && ix%2 === 0) {
            y -= 0.5/size;
          }

          //increase randomness in dark areas
          x += (util.random() - 0.5)*RAND_FAC*(2.0 - inten)*szfac;
          y += (util.random() - 0.5)*RAND_FAC*(2.0 - inten)*szfac;

          let w = radius/2.0;
          if (SCALE_POINTS) {
            w = this.scale_point_r(points[i + PRADIUS2])*0.5;
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
    }

    draw_points2(g) {
      let points = this.bluenoise.points, size = this.bluenoise.gridsize;

      for (var si = 0; si < 4; si++) {
        //var c = colors.colors[si];
        let c = [0, 0, 0];
        if (si > 0) {
          if (si === 2)
            c[si - 1] = 0.7;
          else
            c[si - 1] = 1;
        }

        let r = ~~(c[0]*255);
        let g1 = ~~(c[1]*255);
        let b = ~~(c[2]*255);
        let alpha = 1.0;

        if (DRAW_TRANSPARENT) {
          alpha = ACCUM_ALPHA;
        }

        if (!SHOW_COLORS) {
          r = g1 = b = 1.0;
        }

        g.fillStyle = "rgba(" + r + "," + g1 + "," + b + "," + alpha + ")";

        g.beginPath();

        util.seed.push(0);
        let szfac = 1.0/this.bluenoise.gridsize;

        for (var i = 0; i < points.length; i += PTOT) {
          let colorid = points[i + PLVL];

          if (colorid !== si) {
            continue;
          }

          let x = points[i];
          let y = points[i + 1];
          let radius = points[i + PRADIUS];

          let inten = points[i + PINTEN];

          let ix = ~~((x*0.5 + 0.5)*size);

          if (HEXAGON_MODE && ix%2 === 0) {
            y -= 0.5/size;
          }

          //increase randomness in dark areas
          x += (util.random() - 0.5)*RAND_FAC*(2.0 - inten)*szfac;
          y += (util.random() - 0.5)*RAND_FAC*(2.0 - inten)*szfac;

          let w = radius/2.0;

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
    }

    draw_fancy_stick(g, x1, y1, x2, y2, nx, ny, w, dx, dy) {
      nx *= 1.5;
      ny *= 1.5;

      g.moveTo(x1 - nx, y1 - ny);
      g.lineTo(x1 + nx, y1 + ny);

      let ax = x1 + (x2 - x1)/3.0;
      let ay = y1 + (y2 - y1)/3.0;
      let bx = x1 + (x2 - x1)*2.0/3.0;
      let by = y1 + (y2 - y1)*2.0/3.0;


      let fac = 4.0;


      if (STICK_ARROWS) {
        let tscale = 1.0/(w*0.75 + 0.25);
        let t = 2*tscale, t2 = 4*tscale;

        g.bezierCurveTo(ax + nx*fac, ay + ny*fac, bx + nx* -fac, by + ny* -fac, x2 + nx, y2 + ny);

        g.lineTo(x2 + nx, y2 + ny);
        g.lineTo(x2 + nx*t, y2 + ny*t);
        g.lineTo(x2 + dx*t2, y2 + dy*t2);
        g.lineTo(x2 - nx*t, y2 - ny*t);
        g.lineTo(x2 - nx, y2 - ny);

        //g.lineTo(x2+nx, y2+ny);
        g.lineTo(x2 - nx, y2 - ny);

        //g.bezierCurveTo(x2-nx*fac, y2-ny*fac, x1-nx*-fac, y1-ny*-fac, x1-nx, y1-ny);
        g.bezierCurveTo(bx - nx*fac, by - ny*fac, ax - nx* -fac, ay - ny* -fac, x1 - nx, y1 - ny);

      } else {
        g.bezierCurveTo(ax + nx*fac, ay + ny*fac, bx + nx* -fac, by + ny* -fac, x2 + nx, y2 + ny);

        //g.lineTo(x2+nx, y2+ny);
        g.lineTo(x2 - nx, y2 - ny);

        //g.bezierCurveTo(x2-nx*fac, y2-ny*fac, x1-nx*-fac, y1-ny*-fac, x1-nx, y1-ny);
        g.bezierCurveTo(bx - nx*fac, by - ny*fac, ax - nx* -fac, ay - ny* -fac, x1 - nx, y1 - ny);
      }

    }

    draw_sticks(g) {
      let stickrot = (STICK_ROT/180.0*Math.PI);

      let points = this.bluenoise.points, size = this.bluenoise.gridsize;

      g.save();
      g.lineWidth = g.lineWidth/this.bluenoise.gridsize*STICK_WIDTH*0.5;

      let swid = 0.25*STICK_WIDTH/this.bluenoise.gridsize;

      for (var si = 0; si < colors.colors.length; si++) {
        let c = colors.colors[si];

        let r = ~~(c[0]*255);
        let g1 = ~~(c[1]*255);
        let b = ~~(c[2]*255);
        let alpha = 1.0;

        if (DRAW_TRANSPARENT) {
          alpha = ACCUM_ALPHA;
        }

        if (!SHOW_COLORS) {
          r = g1 = b = 1.0;
        }

        g.strokeStyle = "rgba(" + r + "," + g1 + "," + b + "," + alpha + ")";
        g.fillStyle = "rgba(" + r + "," + g1 + "," + b + "," + alpha + ")";

        g.beginPath();

        util.seed.push(0);
        let szfac = 1.0/this.bluenoise.gridsize;

        for (var i = 0; i < points.length; i += PTOT) {
          let colorid = points[i + PID];

          if (colorid !== si) {
            continue;
          }

          let x = points[i];
          let y = points[i + 1];
          let radius = points[i + PRADIUS];
          let th = points[i + PTH];
          let inten = points[i + PINTEN];

          let ix = ~~((x*0.5 + 0.5)*size);

          if (HEXAGON_MODE && ix%2 === 0) {
            y -= 0.5/size;
          }

          //increase randomness in dark areas
          x += (util.random() - 0.5)*RAND_FAC*(2.0 - inten)*szfac;
          y += (util.random() - 0.5)*RAND_FAC*(2.0 - inten)*szfac;

          let w = 1.0;
          if (SCALE_POINTS) {
            //w = this.scale_point_r(points[i+PRADIUS2])/points[i+PRADIUS2];
            w = 1.0 - points[i + PINTEN];
            w = w**0.5;
          }

          if (DRAW_TRANSPARENT) {
            g.beginPath()
          }

          let thfac = 1.0 + inten;//(1.0 - inten)**0.15;

          let dx = Math.sin(th + stickrot)*szfac*thfac*STICK_LENGTH;
          let dy = Math.cos(th + stickrot)*szfac*thfac*STICK_LENGTH;

          let nx = -dy, ny = dx;
          let len = Math.sqrt(nx*nx + ny*ny);

          if (len === 0) {
            continue;
          }

          nx *= w*swid/len;
          ny *= w*swid/len;

          let x1 = x - dx, y1 = y - dy;
          let x2 = x + dx, y2 = y + dy;

          dx *= w*swid/len;
          dy *= w*swid/len;

          //*
          if (FANCY_STICKS) {
            this.draw_fancy_stick(g, x1, y1, x2, y2, nx, ny, w, dx, dy);
          } else {
            g.moveTo(x1 - nx, y1 - ny);
            g.lineTo(x1 + nx, y1 + ny);

            if (STICK_ARROWS) {
              let tscale = 1.0/(w*0.75 + 0.25);
              let t = 3*tscale, t2 = 7*tscale;

              g.lineTo(x2 + nx, y2 + ny);
              g.lineTo(x2 + nx*t, y2 + ny*t);
              g.lineTo(x2 + dx*t2, y2 + dy*t2);
              g.lineTo(x2 - nx*t, y2 - ny*t);
              g.lineTo(x2 - nx, y2 - ny);
            } else {
              g.lineTo(x2 + nx, y2 + ny);
              g.lineTo(x2 - nx, y2 - ny);
            }
            g.closePath();
          }
          //*/

          /*
          g.moveTo(x1, y1);
          g.lineTo(x2, y2);
          //*/

          if (DRAW_TRANSPARENT) {
            g.fill();
          }
        }

        if (!DRAW_TRANSPARENT) {
          g.fill();
        }
      }

      g.restore();
      util.seed.pop();
    }

    draw(g) {
      g.save();

      g.clearRect(0, 0, this.appstate.canvas.width, this.appstate.canvas.height);
      g.beginPath();
      g.rect(0, 0, this.appstate.canvas.width, this.appstate.canvas.height);

      g.fillStyle = BLACK_BG ? "black" : "white";
      g.fill();
      g.fillStyle = "white";

      if (RASTER_IMAGE && this.raster_image !== undefined) {
        g.putImageData(this.raster_image, 20, 20);
      } else if (DRAW_STICKS) {
        this.draw_transform(g);
        this.draw_sticks(g);
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
  };

  return exports;
});

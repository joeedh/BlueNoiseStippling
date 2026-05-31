import * as util from "./util.js";
import * as colors from "./colors.js";
import * as render from "./render.js";
import {
  config,
  PTOT,
  PID,
  PLVL,
  PRADIUS,
  PRADIUS2,
  PINTEN,
  PTH,
} from "./const.js";
import type { AppState } from "./appstate.js";
import type { BlueNoise } from "./bluenoise.js";

export class Drawer {
  appstate: AppState;
  bluenoise: BlueNoise;
  raster_image: ImageData | undefined;

  constructor(appstate: AppState) {
    this.appstate = appstate;
    this.bluenoise = appstate.bluenoise;
  }

  reset(raster_image: ImageData | undefined): void {
    this.raster_image = raster_image; //can be undefined
  }

  draw_transform(g: CanvasRenderingContext2D): void {
    let canvas = this.appstate.canvas;

    let scale = Math.min(canvas.width, canvas.height) * 0.5;

    g.scale(scale, scale);
    g.translate(1.0, 1.0);

    let s2 = config.SCALE;
    g.scale(s2, s2);

    g.translate(s2 * config.PANX, s2 * config.PANY);
  }

  scale_point_r(r: number): number {
    let maxr = 15 / (Math.sqrt(2) * this.bluenoise.dimen);
    let minr = 4.0 / (Math.sqrt(2) * this.bluenoise.dimen);

    r = 1.0 / (1 + (9.0 * r) / maxr);
    r *= minr * 0.9;
    //r = Math.min(Math.max(maxr-r, 0.0001), minr)*0.5;

    return Math.max(r, minr * 0.01);
  }

  tri_mode_draw(g: CanvasRenderingContext2D): void {
    let ps = this.bluenoise.points;
    let ts = this.bluenoise.tris;
    let vcells = this.bluenoise.vcells;

    if (ts === undefined || vcells === undefined) return;

    g.lineWidth = 0.001;
    /*
    g.beginPath();
    for (let i=0; i<ts.length; i += 3) {
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
    //let minr = this.bluenoise.minr;
    let minr = 1.0 / (Math.sqrt(2) * this.bluenoise.dimen);

    console.log("MINR", minr);

    let totcolor = colors.colors.length;
    for (let ci = 0; ci < totcolor; ci++) {
      let clr = colors.colors[ci];

      clr = colors.internal_to_rgb(clr[0], clr[1], clr[2]);

      let r1 = ~~(clr[0] * 255);
      let g1 = ~~(clr[1] * 255);
      let b1 = ~~(clr[2] * 255);

      g.fillStyle = "rgba(" + r1 + "," + g1 + "," + b1 + ", 1)";
      g.strokeStyle = "white"; //g.fillStyle

      g.beginPath();

      for (let i = 0; i < ps.length; i += PTOT) {
        let i1 = i;
        let x = ps[i],
          y = ps[i + 1],
          r = ps[i + PRADIUS2];
        let pi = i / PTOT;

        //if (r > minr*5.0) {
        //  continue;
        //}

        if (ps[i + PID] !== ci) continue;

        //if (pi % 4 !== 0) continue;

        let vj = pi * config.MAX_VCELL_SIZE;
        let lastvpi: number | undefined;

        let fx: number | undefined, fy: number | undefined;
        let rad = ps[i + PRADIUS] * 0.9;

        if (config.SCALE_POINTS) {
          rad = this.scale_point_r(ps[i + PRADIUS2]);
        }

        let fac = 0.6; //rad/r;

        fac *= config.DRAW_RMUL;

        let cx: number, cy: number;
        // Outer `vpi` is intentionally never written in the loop below (the loop
        // declares its own block-scoped `vpi`), so at line ~151 it is always
        // `undefined` at runtime -- preserved exactly via the casts there.
        let vpi: number | undefined;

        for (let j = 0; j < config.MAX_VCELL_SIZE; j++, vj++) {
          let vpi = vcells[vj];

          if (vpi === -1) break;

          // On the first iteration `lastvpi` is undefined; `undefined*PTOT` is
          // NaN and `ps[NaN]` is undefined at runtime -- original behavior kept
          // via the `as number` coercion (legacy code relied on this).
          let x2 = ps[(lastvpi as number) * PTOT],
            y2 = ps[(lastvpi as number) * PTOT + 1];
          let x3 = ps[vpi * PTOT],
            y3 = ps[vpi * PTOT + 1];

          lastvpi = vpi;

          if (j === 0) {
            continue;
          }

          cx = (x + x2 + x3) / 3;
          cy = (y + y2 + y3) / 3;

          cx = (cx - x) * fac + x;
          cy = (cy - y) * fac + y;

          if (fx === undefined) {
            fx = x2;
            fy = y2;

            g.moveTo(cx, cy);
          } else {
            g.lineTo(cx, cy);
          }
        }

        // `vpi` (outer) is always undefined here and `lastvpi`/`fx`/`fy` may be
        // undefined; the `as number` casts preserve the original undefined->NaN
        // arithmetic exactly (canvas ignores NaN coordinates).
        let x2 = ps[(lastvpi as number) * PTOT],
          y2 = ps[(lastvpi as number) * PTOT + 1];
        let x3 = ps[(vpi as number) * PTOT],
          y3 = ps[(vpi as number) * PTOT + 1];

        cx = (x + x2 + (fx as number)) / 3;
        cy = (y + y2 + (fy as number)) / 3;
        cx = (cx - x) * fac + x;
        cy = (cy - y) * fac + y;

        g.lineTo(cx, cy);
      }

      //g.stroke();
      g.fill();
    }
    //      g.stroke();
  }

  draw_points(g: CanvasRenderingContext2D): void {
    let points = this.bluenoise.points,
      size = this.bluenoise.gridsize;

    //g.globalCompositeOperation = "darken";

    for (let si = 0; si < colors.colors.length; si++) {
      let c = colors.colors[si];
      c = colors.internal_to_rgb(c[0], c[1], c[2]);

      let r1 = ~~(c[0] * 255);
      let g1 = ~~(c[1] * 255);
      let b1 = ~~(c[2] * 255);
      let alpha = 1.0;

      if (config.DRAW_TRANSPARENT) {
        alpha = config.ACCUM_ALPHA;
      }

      if (!config.SHOW_COLORS) {
        r1 = g1 = b1 = config.BLACK_BG ? 255 : 1;
      }

      g.fillStyle = "rgba(" + r1 + "," + g1 + "," + b1 + "," + alpha + ")";

      g.beginPath();

      util.seed.push(0);
      let szfac = 1.0 / this.bluenoise.gridsize;

      for (let i = 0; i < points.length; i += PTOT) {
        let colorid = points[i + PID];

        if (colorid !== si) {
          continue;
        }

        let x = points[i];
        let y = points[i + 1];
        let radius = points[i + PRADIUS];

        let inten = points[i + PINTEN];

        let ix = ~~((x * 0.5 + 0.5) * size);

        if (config.HEXAGON_MODE && ix % 2 === 0) {
          y -= 0.5 / size;
        }

        //increase randomness in dark areas
        x += (util.random() - 0.5) * config.RAND_FAC * (2.0 - inten) * szfac;
        y += (util.random() - 0.5) * config.RAND_FAC * (2.0 - inten) * szfac;

        let w = radius / 2.0;
        if (config.SCALE_POINTS) {
          w = this.scale_point_r(points[i + PRADIUS2]) * 0.5;
        }

        if (config.DRAW_TRANSPARENT) {
          g.beginPath();
        }

        g.moveTo(x, y);
        g.arc(x, y, w * config.DRAW_RMUL, 0, Math.PI * 2);

        //let w2 = w*DRAW_RMUL;
        //g.rect(x-w2*0.5, y-w2*0.5, w2, w2);

        if (config.DRAW_TRANSPARENT) {
          g.fill();
        }
      }

      if (!config.DRAW_TRANSPARENT) {
        g.fill();
      }
    }

    util.seed.pop();
  }

  draw_points2(g: CanvasRenderingContext2D): void {
    let points = this.bluenoise.points,
      size = this.bluenoise.gridsize;

    for (let si = 0; si < 4; si++) {
      //let c = colors.colors[si];
      let c = [0, 0, 0];
      if (si > 0) {
        if (si === 2) c[si - 1] = 0.7;
        else c[si - 1] = 1;
      }

      let r = ~~(c[0] * 255);
      let g1 = ~~(c[1] * 255);
      let b = ~~(c[2] * 255);
      let alpha = 1.0;

      if (config.DRAW_TRANSPARENT) {
        alpha = config.ACCUM_ALPHA;
      }

      if (!config.SHOW_COLORS) {
        r = g1 = b = config.BLACK_BG ? 255 : 1.0;
      }

      g.fillStyle = "rgba(" + r + "," + g1 + "," + b + "," + alpha + ")";

      g.beginPath();

      util.seed.push(0);
      let szfac = 1.0 / this.bluenoise.gridsize;

      for (let i = 0; i < points.length; i += PTOT) {
        let colorid = points[i + PLVL];

        if (colorid !== si) {
          continue;
        }

        let x = points[i];
        let y = points[i + 1];
        let radius = points[i + PRADIUS];

        let inten = points[i + PINTEN];

        let ix = ~~((x * 0.5 + 0.5) * size);

        if (config.HEXAGON_MODE && ix % 2 === 0) {
          y -= 0.5 / size;
        }

        //increase randomness in dark areas
        x += (util.random() - 0.5) * config.RAND_FAC * (2.0 - inten) * szfac;
        y += (util.random() - 0.5) * config.RAND_FAC * (2.0 - inten) * szfac;

        let w = radius / 2.0;

        if (config.DRAW_TRANSPARENT) {
          g.beginPath();
        }

        g.moveTo(x, y);
        g.arc(x, y, w * config.DRAW_RMUL, 0, Math.PI * 2);

        //let w2 = w*DRAW_RMUL;
        //g.rect(x-w2*0.5, y-w2*0.5, w2, w2);

        if (config.DRAW_TRANSPARENT) {
          g.fill();
        }
      }

      if (!config.DRAW_TRANSPARENT) {
        g.fill();
      }
    }

    util.seed.pop();
  }

  draw_fancy_stick(
    g: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    nx: number,
    ny: number,
    w: number,
    dx: number,
    dy: number,
  ): void {
    nx *= 1.5;
    ny *= 1.5;

    g.moveTo(x1 - nx, y1 - ny);
    g.lineTo(x1 + nx, y1 + ny);

    let ax = x1 + (x2 - x1) / 3.0;
    let ay = y1 + (y2 - y1) / 3.0;
    let bx = x1 + ((x2 - x1) * 2.0) / 3.0;
    let by = y1 + ((y2 - y1) * 2.0) / 3.0;

    let fac = 3.0;

    if (config.STICK_ARROWS) {
      let tscale = 1.0 / (w * 0.75 + 0.25);
      let t = 0.5 * tscale,
        t2 = tscale;

      g.bezierCurveTo(
        ax + nx * fac,
        ay + ny * fac,
        bx + nx * -fac,
        by + ny * -fac,
        x2 + nx,
        y2 + ny,
      );

      g.lineTo(x2 + nx, y2 + ny);
      g.lineTo(x2 + nx * t, y2 + ny * t);
      g.lineTo(x2 + dx * t2, y2 + dy * t2);
      g.lineTo(x2 - nx * t, y2 - ny * t);
      g.lineTo(x2 - nx, y2 - ny);

      //g.lineTo(x2+nx, y2+ny);
      g.lineTo(x2 - nx, y2 - ny);

      //g.bezierCurveTo(x2-nx*fac, y2-ny*fac, x1-nx*-fac, y1-ny*-fac, x1-nx, y1-ny);
      g.bezierCurveTo(
        bx - nx * fac,
        by - ny * fac,
        ax - nx * -fac,
        ay - ny * -fac,
        x1 - nx,
        y1 - ny,
      );
    } else {
      g.bezierCurveTo(
        ax + nx * fac,
        ay + ny * fac,
        bx + nx * -fac,
        by + ny * -fac,
        x2 + nx,
        y2 + ny,
      );

      //g.lineTo(x2+nx, y2+ny);
      g.lineTo(x2 - nx, y2 - ny);

      //g.bezierCurveTo(x2-nx*fac, y2-ny*fac, x1-nx*-fac, y1-ny*-fac, x1-nx, y1-ny);
      g.bezierCurveTo(
        bx - nx * fac,
        by - ny * fac,
        ax - nx * -fac,
        ay - ny * -fac,
        x1 - nx,
        y1 - ny,
      );
    }
  }

  draw_sticks(g: CanvasRenderingContext2D): void {
    let stickrot = (config.STICK_ROT / 180.0) * Math.PI;

    let points = this.bluenoise.points,
      size = this.bluenoise.gridsize;

    g.save();
    g.lineWidth =
      (g.lineWidth / this.bluenoise.gridsize) * config.STICK_WIDTH * 0.5;

    let swid = (0.25 * config.STICK_WIDTH) / this.bluenoise.gridsize;

    for (let si = 0; si < colors.colors.length; si++) {
      let c = colors.colors[si];
      c = colors.internal_to_rgb(c[0], c[1], c[2]);

      let r1 = ~~(c[0] * 255);
      let g1 = ~~(c[1] * 255);
      let b1 = ~~(c[2] * 255);
      let alpha = 1.0;

      if (config.DRAW_TRANSPARENT) {
        alpha = config.ACCUM_ALPHA;
      }

      if (!config.SHOW_COLORS) {
        r1 = g1 = b1 = config.BLACK_BG ? 255 : 1.0;
      }

      g.strokeStyle = "rgba(" + r1 + "," + g1 + "," + b1 + "," + alpha + ")";
      g.fillStyle = "rgba(" + r1 + "," + g1 + "," + b1 + "," + alpha + ")";

      g.beginPath();

      util.seed.push(0);
      let szfac = 1.0 / this.bluenoise.gridsize;

      for (let i = 0; i < points.length; i += PTOT) {
        let colorid = points[i + PID];

        if (colorid !== si) {
          continue;
        }

        let x = points[i];
        let y = points[i + 1];
        let radius = points[i + PRADIUS];
        let th = points[i + PTH];
        let inten = points[i + PINTEN];

        let ix = ~~((x * 0.5 + 0.5) * size);

        if (config.HEXAGON_MODE && ix % 2 === 0) {
          y -= 0.5 / size;
        }

        //increase randomness in dark areas
        x += (util.random() - 0.5) * config.RAND_FAC * (2.0 - inten) * szfac;
        y += (util.random() - 0.5) * config.RAND_FAC * (2.0 - inten) * szfac;

        let w = 1.0;
        if (config.SCALE_POINTS) {
          //w = this.scale_point_r(points[i+PRADIUS2])/points[i+PRADIUS2];
          w = 1.0 - points[i + PINTEN];
          w = w ** 0.5;
        }

        if (config.DRAW_TRANSPARENT) {
          g.beginPath();
        }

        let thfac = 1.0 + inten; //(1.0 - inten)**0.15;

        let dx = Math.sin(th + stickrot) * szfac * thfac * config.STICK_LENGTH;
        let dy = Math.cos(th + stickrot) * szfac * thfac * config.STICK_LENGTH;

        let nx = -dy,
          ny = dx;
        let len = Math.sqrt(nx * nx + ny * ny);

        if (len === 0) {
          continue;
        }

        nx *= (w * swid) / len;
        ny *= (w * swid) / len;

        let x1 = x - dx,
          y1 = y - dy;
        let x2 = x + dx,
          y2 = y + dy;

        dx *= (w * swid) / len;
        dy *= (w * swid) / len;

        //*
        if (config.FANCY_STICKS) {
          this.draw_fancy_stick(g, x1, y1, x2, y2, nx, ny, w, dx, dy);
        } else {
          g.moveTo(x1 - nx, y1 - ny);
          g.lineTo(x1 + nx, y1 + ny);

          if (config.STICK_ARROWS) {
            let tscale = 1.0 / (w * 0.75 + 0.25);
            let t = 3 * tscale,
              t2 = 7 * tscale;

            g.lineTo(x2 + nx, y2 + ny);
            g.lineTo(x2 + nx * t, y2 + ny * t);
            g.lineTo(x2 + dx * t2, y2 + dy * t2);
            g.lineTo(x2 - nx * t, y2 - ny * t);
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

        if (config.DRAW_TRANSPARENT) {
          g.fill();
        }
      }

      if (!config.DRAW_TRANSPARENT) {
        g.fill();
      }
    }

    g.restore();
    util.seed.pop();
  }

  draw(g: CanvasRenderingContext2D): void {
    g.save();

    g.clearRect(0, 0, this.appstate.canvas.width, this.appstate.canvas.height);
    g.beginPath();
    g.rect(0, 0, this.appstate.canvas.width, this.appstate.canvas.height);

    g.fillStyle = config.BLACK_BG ? "black" : "white";
    g.fill();
    g.fillStyle = "white";

    if (config.RASTER_IMAGE && this.raster_image !== undefined) {
      g.putImageData(this.raster_image, 20, 20);
    } else if (config.DRAW_STICKS) {
      this.draw_transform(g);
      this.draw_sticks(g);
    } else if (config.TRI_MODE) {
      this.draw_transform(g);
      this.tri_mode_draw(g);
    } else {
      this.draw_transform(g);
      this.draw_points(g);
    }

    if (config.SHOW_KDTREE) {
      g.lineWidth = 0.001;
      window._appstate.bluenoise.calc_kdtree();
      window._appstate.bluenoise.kdtree2.draw(g);
    }

    g.restore();
  }
}

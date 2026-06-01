// PATTERN raster mode: step_b(). Samples the image per grid cell, quantizes to
// the palette (with optional dithering), and writes pixels to the raster buffer.
// Creates no stipple points.
import { config, RASTER_MODES } from "../const.js";
import * as colors from "../colors.js";
import type { BlueNoise } from "../bluenoise.js";
import { ditherColor } from "./dither.js";

export function stepB(
  bn: BlueNoise,
  custom_steps?: number,
  skip_points_display?: boolean,
): void {
  let raster_image = bn.raster_image;

  if (bn.sampler === undefined) {
    console.log("image hasn't loaded yet");
  }

  if (bn.mask === undefined) {
    console.log("mask hasn't loaded yet");
    return;
  }

  let grid = bn.errgrid;
  let size = bn.gridsize;
  let iw = config.DIMEN,
    ih = config.DIMEN;

  let steps = custom_steps ? custom_steps : config.STEPS;
  let cw = bn.mask.width;
  let ch = bn.mask.height;

  if (bn.mask.data === undefined) {
    console.log("WARNING: mask failed to load");
    return;
  }

  let mask = bn.mask.data.data;
  let mscale = config.SMALL_MASK ? 1 : 4;

  let clr1 = [0.5, 0.5, 0.5];
  let clr3 = [0.5, 0.5, 0.5];
  let filter = bn.filter;
  let points = bn.points;
  let start_r = bn.start_r;
  let sqrt3 = Math.sqrt(3.0);
  let ws = [0, 0, 0];

  let do_clrw = 0; //attempt at barycentric coloring
  let do_cmyk_raster = config.RASTER_MODE === RASTER_MODES.CMYK;

  let _dr_ret = [0, 0];
  let nextout = [0, 0, 0, 0, 0];

  if (raster_image === undefined || raster_image.data === undefined) {
    return;
  }
  let rdata = raster_image.data;

  for (let si = 0; si < steps; si++, bn.cur++) {
    if (bn.cur >= size * size) {
      console.log("Done.");
      break;
    }

    let x = bn.cur % size;
    let y = ~~(bn.cur / size);

    let gx = x,
      gy = y;

    let ix = ~~(((x * mscale) % cw) + 0.5);
    let iy = ~~(((y * mscale) % ch) + 0.5);

    x /= size;
    y /= size;
    //x = (x-0.5)*2.0, y = (y-0.5)*2.0;

    // sampler is logged-but-not-returned above; assert non-null to preserve the
    // original (latent) behavior of proceeding even when unset.
    let clr = bn.sampler!((x - 0.5) * 2, (y - 0.5) * 2, size, 1.0);
    if (clr[0] < 0) continue;

    clr1[0] = clr[0];
    clr1[1] = clr[1];
    clr1[2] = clr[2];
    clr = clr1;

    let rix = ~~(x * raster_image.width * 0.99999),
      riy = ~~(y * raster_image.height * 0.99999);

    let idx = (riy * raster_image.width + rix) * 4;

    let f = bn.calcIntensity(clr[0], clr[1], clr[2]);
    //let f = clr[0]*0.2 + clr[1]*0.7 + clr[2]*0.1; <-- hrm, weird weights. . .

    let fac = 0,
      fac2 = 0,
      fac3 = 0;
    let tot = 0,
      tot2 = 0,
      tot3 = 0;
    let mx, my;

    for (let j = 0; j < mscale * mscale; j++) {
      let offx = j % mscale,
        offy = ~~(j / mscale);

      (mx = (ix + offx) % cw), (my = (iy + offy) % ch);
      let midx1 = (my * cw + mx) * 4;

      (mx = (ix + 3 + offx) % cw), (my = (iy + offy) % ch);
      let midx2 = (my * cw + mx) * 4;

      (mx = (ix + 3 + offx) % cw), (my = (iy + 3 + offy) % ch);
      let midx3 = (my * cw + mx) * 4;

      if (mask[midx1] > 1) {
        fac += mask[midx1] / 255.0;
        tot += 1;
      }
      if (mask[midx2] > 1) {
        fac2 += mask[midx2] / 255.0;
        tot2 += 1;
      }
      if (mask[midx3] > 1) {
        fac3 += mask[midx3] / 255.0;
        tot3 += 1;
      }
    }

    fac = tot ? fac / tot : fac;
    fac2 = tot2 ? fac2 / tot2 : fac2;
    fac3 = tot3 ? fac3 / tot3 : fac3;

    if (isNaN(fac)) {
      throw new Error("NaN!");
    }

    let dfac = 0.0;

    let use_lab = false;
    let dclr;

    if (!use_lab) {
      dclr = clr3;

      dclr[0] = clr[0] * 0.9;
      dclr[1] = clr[1] * 0.9;
      dclr[2] = clr[2] * 1.1;

      clr[0] = dclr[0];
      clr[1] = dclr[1];
      clr[2] = dclr[2];
    } else {
      dclr = colors.rgb_to_lab(clr[0], clr[1], clr[2]);
    }

    // Unified palette dithering (was step_b's own HSV/brightness branches).
    let ci = ditherColor(bn, clr, fac);
    for (let k = 0; k < 3; k++) {
      clr[k] = colors.colors[ci][k];
    }

    /*
    if (!ok) {
      continue;
    }//*/

    //clr[0] = clr[1] = clr[2] = 0;
    rdata[idx] = ~~(clr[0] * 255);
    rdata[idx + 1] = ~~(clr[1] * 255);
    rdata[idx + 2] = ~~(clr[2] * 255);
    rdata[idx + 3] = 255;
  }
}

// The shared per-sample inner loop used by stepSmask() (and historically stepB):
// samples the image, applies the caller's `refine` callback, and on success
// appends a stipple point. Returns the new point index, or undefined if the
// sample was discarded.
import {
  config,
  PTOT,
  PRADIUS,
  PINTEN,
  PID,
  PRADIUS2,
  POX,
  POY,
  POLDX,
  POLDY,
} from "../const.js";
import * as colors from "../colors.js";
import type { BlueNoise } from "../bluenoise.js";
import type { InnerLoopArg, Vec } from "./internal.js";
import { ditherColor } from "./dither.js";
import { calcTheta } from "./spatial.js";

export function innerLoop(
  bn: BlueNoise,
  args: InnerLoopArg,
  refine: (f: number, clr: Vec, x: number, y: number) => number[],
): number | undefined {
  let x = args.x,
    y = args.y,
    ix = args.ix,
    iy = args.iy,
    offx = args.offx,
    offy = args.offy;
  let points = bn.points;
  let raster_image = bn.raster_image;
  let size = bn.gridsize;
  let iw = config.DIMEN,
    ih = config.DIMEN,
    cw = iw,
    ch = ih;
  let start_r = bn.start_r;

  let colorout = new Array(16);

  if (bn.sampler === undefined) {
    console.log("image hasn't loaded yet");
    return undefined;
  }

  const sqrt3 = Math.sqrt(3);

  let clr = bn.sampler!(x, y, size, 1.0);

  if (clr[0] < 0) {
    return undefined; //sampler requested we discard this sample
  }

  let f = bn.calcIntensity(clr[0], clr[1], clr[2]);
  //let f = clr[0]*clr[0] + clr[1]*clr[1] + clr[2]*clr[2];
  //f = f !== 0.0 ? Math.sqrt(f) / sqrt3 : 0.0;

  //let sat = 1.0 - colors.internal_to_intensity(clr[0], clr[1], clr[2]);
  //let sat = Math.abs(1.0 - clr[0]) + Math.abs(1.0 - clr[1]) + Math.abs(1.0 - clr[2]);
  //sat /= 3.0;

  //let sat = 1.0 - f;
  let sat = colors.internal_to_saturation(clr[0], clr[1], clr[2]);

  if (config.ADAPTIVE_COLOR_DENSITY) {
    //scale spacing of points by saturation (how much color there is)
    f *= Math.pow(1.0 - sat, 2);
  }

  if (window._f === undefined) {
    window._f = 0.0;
  }
  //f = 0.0;

  f = Math.min(Math.max(f, 0.0), 0.99999);
  let finten = f;

  f = config.MAKE_NOISE ? 0.65 : f;

  let ret = refine(f, clr, x, y);
  let threshold = ret[3];

  let linear_f = f;
  //let linear_f = f;
  //let linear_threshold = ret[4];

  f = ret[2];
  (x = ret[0]), (y = ret[1]), (f = ret[2]);

  let ok = 1.0 - f >= threshold;

  if (!ok) {
    return undefined;
  }

  threshold = Math.min(Math.max(threshold, 0.0), 0.99999);

  if (isNaN(threshold)) {
    throw new Error("NaN");
  }

  if (config.DITHER_BLUE)
    colors.ditherSampler.seed(bn.getPixelSeed(1.0 - threshold));

  //let ci = colors.closest_color_fast(clr, colorout, 0.0);
  let ci;
  if (config.DITHER_COLORS) {
    // Unified palette dithering (shared with PATTERN / default step).
    ci = ditherColor(bn, clr, f);
  } else {
    ci = colors.closest_color_fast(clr);
  }
  //let ci = DITHER_COLORS ? colors.closest_color(clr) : colors.closest_color_fast(clr);

  /*
  if (DITHER_COLORS) {
    let ditherfac = Math.pow(threshold, 1.0/3.0);

    //ditherfac = f > 0.5 ? 1.0 - ditherfac : ditherfac;
    //ditherfac = Math.random();

    let clr2 = colors.colors[ci];

    for (let i=0; i<3; i++) {
      let err3 = -(clr2[i]-clr[i]);

      clr[i] += err3*(ditherfac-0.5)*6.0*DITHER_RAND_FAC;
    }
    ci = colors.closest_color(clr, undefined, 0.0);
  }//*/

  let pi = points.length;
  for (let j = 0; j < PTOT; j++) {
    points.push(0);
  }

  if (config.GRID_MODE) {
    let gsize = size * 4;

    let ix = Math.floor(x * gsize * 0.5 + 0.5);
    let iy = Math.floor(y * gsize * 0.5 + 0.5);

    x = (ix * 2.0) / gsize;
    y = (iy * 2.0) / gsize;
  }

  points[pi] = x;
  points[pi + 1] = y;
  points[pi + PRADIUS] = start_r; //*(1.0 + 0.25*(sat));
  points[pi + PINTEN] = finten;
  points[pi + PID] = ci;
  //points[pi+PLVL] = lvl;
  points[pi + PRADIUS2] = -1; //points[pi+PRADIUS];

  points[pi + POX] = points[pi + POLDX] = points[pi];
  points[pi + POY] = points[pi + POLDY] = points[pi + 1];

  calcTheta(bn, pi);

  return pi;
}

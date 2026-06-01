// Smooth-mask stepping: walk the smooth-mask blocks and point sets, driving each
// through innerLoop() to place stipple points.
import { config, PTOT } from "../const.js";
import * as smoothmask from "../smoothmask.js";
import type { BlueNoise } from "../bluenoise.js";
import type { Vec } from "./internal.js";
import { innerLoop } from "./inner-loop.js";

export function stepSmask(bn: BlueNoise, custom_steps?: number): void {
  let args = bn.inner_loop_cachering.next();

  let points = bn.points;
  let raster_image = bn.raster_image;
  let steps = custom_steps ? custom_steps : config.STEPS;
  let size = bn.gridsize;
  const smask = bn.smask;
  let iw = config.DIMEN,
    ih = config.DIMEN,
    cw = iw,
    ch = ih;
  let start_r = bn.start_r;

  if (bn.sampler === undefined) {
    console.log("image hasn't loaded yet");
    return;
  }

  if (smask === undefined) {
    console.log("mask hasn't loaded yet");
    return;
  }

  const sqrt3 = Math.sqrt(3);
  let size2 = Math.ceil(size / smask.blocksize);
  let size3 = size / smask.blocksize;

  steps = Math.ceil(steps / smask.blocksize / smask.blocksize);

  let refine_ret = [0, 0, 0, 0, 0];
  let p: smoothmask.MaskPoint;
  let ix: number, iy: number;

  // `smask` is narrowed above; capture as a non-null const for the closure.
  const smaskNN = smask;
  function refine(f: number, clr: Vec, x: number, y: number): number[] {
    f = smaskNN.evalInverseTone(f);

    if (config.SPECIAL_OFFSETS) {
      let co2 = p.evaluate(1.0 - f);

      (x = co2[0]), (y = co2[1]);

      x = x / size3 + ix / size3;
      y = y / size3 + iy / size3;

      x = x * 2.0 - 1.0;
      y = y * 2.0 - 1.0;
    }

    refine_ret[0] = x;
    refine_ret[1] = y;
    refine_ret[2] = f;
    refine_ret[3] = p.gen;
    refine_ret[4] = smaskNN.evalInverseTone(p.gen);

    return refine_ret;
  }

  for (let si = 0; si < steps; si++, bn.cur++) {
    if (bn.cur >= size2 * size2) {
      console.log("Done.");
      break;
    }

    ix = bn.cur % size2;
    iy = ~~(bn.cur / size2);

    for (p of smask.points) {
      //let co = p.evaluate(0.99999);
      //let co = p.evaluate(0.05);
      //let x = Math.fract(co[0]), y = Math.fract(co[1]);
      //x = co[0], y = co[1];
      let x = p.startx,
        y = p.starty;

      x = x / size3 + ix / size3;
      y = y / size3 + iy / size3;

      x = x * 2.0 - 1.0;
      y = y * 2.0 - 1.0;

      if (x < -1 || y < -1 || x >= 1 || y >= 1) continue;

      args.load(x, y, ix, iy, 0, 0);
      innerLoop(bn, args, refine);
    }
  }

  //if (!skip_points_display) {
  console.log("points", points.length / PTOT);
  console.log("\n");
  //}

  bn.calc_derivatives();

  if (config.TRI_MODE) {
    //} && !skip_points_display) {
    console.log("regenerating triangulation...");
    bn.del();
  } else if (config.SCALE_POINTS) {
    //} && !skip_points_display) {
    bn.calc_radii();
  }
}

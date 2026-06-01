// Color diffusion: spread per-point palette-quantization error across spatial
// neighbors (via the kd-tree) so the overall color balance is preserved.
import { PTOT, PID, PLVL, PRADIUS2 } from "../const.js";
import * as colors from "../colors.js";
import type { BlueNoise } from "../bluenoise.js";
import { calcKdtree } from "./spatial.js";

export function colordiffuse(bn: BlueNoise): void {
  let ps = bn.points;
  let tree = calcKdtree(bn);
  let size = bn.gridsize;

  let pi1: number,
    x1: number,
    y1: number,
    color1: number,
    gen1: number,
    r1: number;

  let errors = new Float64Array((4 * ps.length) / PTOT);
  let pcolors = new Float64Array((4 * ps.length) / PTOT);

  errors.fill(0, 0, errors.length);

  for (let pi = 0; pi < ps.length; pi += PTOT) {
    let x = ps[pi],
      y = ps[pi + 1];

    let i = (pi / PTOT) * 4;

    let clr = bn.sampler!(x, y, size, 1.0);

    if (isNaN(clr[0]) || isNaN(clr[1]) || isNaN(clr[2])) {
      console.log("NaN in sampler!");
      clr[0] = clr[1] = clr[2] = clr[3] = 1.0;
    }

    if (clr[0] < 0) {
      //discard point?
      clr[0] = clr[1] = clr[2] = 0.0;
    }

    for (let j = 0; j < 4; j++) {
      pcolors[i + j] = clr[j];
    }
  }

  let radius = 7.0 / Math.sqrt(ps.length / PTOT + 1);

  let callback = (pi2: number) => {
    if (pi2 === pi1) return;

    let x2 = ps[pi2],
      y2 = ps[pi2 + 1],
      color2 = ps[pi2 + PID],
      r2 = ps[pi2 + PRADIUS2],
      gen2 = ps[pi2 + PLVL];
    let dx = x2 - x1,
      dy = y2 - y1;
    let dis = dx * dx + dy * dy;

    if (dis >= radius * radius) return;

    dis = Math.sqrt(dis);

    let w = 1.0 - dis / radius;

    if (isNaN(w)) {
      console.log(dis, dx, dy, x1, y1, x2, y2);
      throw new Error("nan!");
    }
    w = w * w * (3.0 - 2.0 * w);

    let i1 = (4 * pi1) / PTOT;
    let i2 = (4 * pi2) / PTOT;

    for (let j = 0; j < 3; j++) {
      if (isNaN(errors[i1 + j])) {
        console.log(errors, i1, j);
        throw new Error("NaN!");
      }

      if (isNaN(w) || isNaN(errors[i1 + j])) {
        console.log(errors, i1, j, w);
        throw new Error("NaN again!");
      }

      pcolors[i2 + j] += -errors[i1 + j] * w;
    }
  };

  for (pi1 = 0; pi1 < ps.length; pi1 += PTOT) {
    (x1 = ps[pi1]),
      (y1 = ps[pi1 + 1]),
      (color1 = ps[pi1 + PID]),
      (r1 = ps[pi1 + PRADIUS2]),
      (gen1 = ps[pi1 + PLVL]);

    let i = (pi1 / PTOT) * 4;
    let color = colors.colors[color1];

    for (let j = 0; j < 3; j++) {
      if (isNaN(color[j])) {
        console.log(color, color1);
        throw new Error("nan!");
      }

      if (isNaN(pcolors[i + j])) {
        console.log(pcolors, i, j);
        throw new Error("nan!!");
      }

      errors[i + j] = pcolors[i + j] - color[j];
    }

    tree.forEachPoint(x1, y1, radius, callback);
  }

  let clr = [0, 0, 0, 1];

  for (pi1 = 0; pi1 < ps.length; pi1 += PTOT) {
    let i = (pi1 / PTOT) * 4;

    for (let j = 0; j < 4; j++) {
      clr[j] = pcolors[i + j];
    }

    let ci = colors.closest_color_fast(clr);
    ps[pi1 + PID] = ci;
  }

  console.log("done");
}

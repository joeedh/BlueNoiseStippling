// Spatial / geometry helpers: kd-tree construction, per-point gradient (theta)
// and derivative computation, and Delaunay triangulation + voronoi adjacency.
import { config, PTOT, POX, POY, PDX, PDY, PINTEN, PTH } from "../const.js";
import * as kdtree2 from "../kdtree2.js";
import "../delaunay.js"; // side-effect: installs the global `Delaunay` used by del()
import { calcRadii } from "./radii.js";
import type { BlueNoise } from "../bluenoise.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const _appstate: any;
declare const Delaunay: {
  triangulate(points: number[][]): number[];
};

export function calcKdtree(bn: BlueNoise, orig_cos?: boolean): kdtree2.KDTree {
  console.log("building kdtree. . .");

  let ps = bn.points;
  let tree = (bn.kdtree2 = new kdtree2.KDTree([-2, -2, -2], [2, 2, 2]));
  let visit: Record<number, number> = {};
  let totdone = 0;

  while (totdone < ps.length / PTOT) {
    let pi = ~~(((Math.random() * ps.length) / PTOT) * 0.9999999) * PTOT;

    if (pi in visit) {
      continue;
    }

    visit[pi] = 1;
    totdone++;

    let x = ps[pi],
      y = ps[pi + 1];

    if (orig_cos) {
      (x = ps[pi + POX]), (y = ps[pi + POY]);
    }

    tree.insert(x, y, pi);
  }

  return tree;
}

export function calcTheta(bn: BlueNoise, pi: number): void {
  let ps = bn.points,
    isize = _appstate.image.width;

  let x = ps[pi],
    y = ps[pi + 1];

  let dx = 0,
    dy = 0;

  /*
  try and correct for 8-bit alias errors
  by first sampling derivative, and then scaling
  the finite difference width by how small the derivative
  is
  */
  for (let step = 0; step < 1; step++) {
    let df = 8 / isize;

    if (step) {
      let mag = Math.sqrt(dx * dx + dy * dy) / Math.sqrt(2.0);

      if (mag > 0.8) {
        //  break;
      }

      mag = 1.0 - mag;
      mag = Math.pow(mag, 4.0);

      let a = Math.pow(4, step);
      let b = Math.pow(4, step + 1);

      df = (a + (b - a) * mag) / isize;
    }

    let clr = bn.sampler!(x, y, bn.gridsize, 1.0, undefined, true);

    if (clr[0] < 0) {
      return; //dropped point
    }

    let f1 = bn.calcIntensity(clr[0], clr[1], clr[2]);

    clr = bn.sampler!(x + df, y, bn.gridsize, 1.0, undefined, true);
    let f2 = bn.calcIntensity(clr[0], clr[1], clr[2]);

    clr = bn.sampler!(x, y + df, bn.gridsize, 1.0, undefined, true);
    let f3 = bn.calcIntensity(clr[0], clr[1], clr[2]);

    dx = (f2 - f1) / df;
    dy = (f3 - f1) / df;
  }

  ps[pi + PTH] = -Math.atan2(dy, dx);
}

export function del(bn: BlueNoise): void {
  bn.tris = [];
  calcRadii(bn);

  let ps2 = [],
    ps = bn.points;
  for (let i = 0; i < ps.length; i += PTOT) {
    ps2.push([ps[i], ps[i + 1]]);
  }

  let tris = Delaunay.triangulate(ps2);

  bn.tris = tris;

  let plen = bn.points.length / PTOT;
  let vcells = (bn.vcells = new Float64Array(plen * config.MAX_VCELL_SIZE));

  vcells.fill(-1, 0, vcells.length);

  for (let i = 0; i < tris.length; i += 3) {
    for (let j = 0; j < 3; j++) {
      let v1 = tris[i + j],
        v2 = tris[i + ((j + 1) % 3)];
      let v3 = tris[i + ((j + 2) % 3)];

      let vk = v1 * config.MAX_VCELL_SIZE;
      let bad = 0;
      let k = 0;

      for (k = 0; k < config.MAX_VCELL_SIZE; k++, vk++) {
        if (vcells[vk] === v2) {
          bad = 1;
          break;
        } else if (vcells[vk] === -1) {
          break;
        }
      }

      if (bad || k >= config.MAX_VCELL_SIZE) {
        continue;
      }

      vcells[vk] = v2;
    }
  }

  let sortlst = new Float64Array(config.MAX_VCELL_SIZE);

  //closure communication vars
  let x: number, y: number;

  function sortcmp(a: number, b: number): number {
    if (a === -1) return 1;
    else if (b === -1) return -1;

    let ang1 = Math.atan2(ps[a * PTOT + 1] - y, ps[a * PTOT] - x);
    let ang2 = Math.atan2(ps[b * PTOT + 1] - y, ps[b * PTOT] - x);

    return ang1 - ang2;
  }

  for (let i = 0; i < vcells.length; i += config.MAX_VCELL_SIZE) {
    let pi = i / config.MAX_VCELL_SIZE;
    (x = ps[pi * PTOT]), (y = ps[pi * PTOT + 1]);

    for (let j = 0; j < config.MAX_VCELL_SIZE; j++) {
      sortlst[j] = vcells[i + j];
    }

    sortlst.sort(sortcmp);
    for (let j = 0; j < config.MAX_VCELL_SIZE; j++) {
      vcells[i + j] = sortlst[j];
    }
  }

  console.log("total tris:", tris.length / 3);
}

export function calcDerivatives(bn: BlueNoise): void {
  console.log("updating point derivatives with respect to the image");

  let size = bn.dimen;
  let isize = _appstate.image.width;
  let ps = bn.points;

  /* Calculate image gradients. */
  for (let pi = 0; pi < ps.length; pi += PTOT) {
    let x = ps[pi],
      y = ps[pi + 1];
    let clr = bn.sampler!(x, y, bn.gridsize, 1.0, undefined, true);

    /* Have we already done this point? */
    if (ps[pi + PDX] !== 0 || ps[pi + PDY] !== 0) {
      continue;
    }

    if (clr[0] < 0) {
      /* Dropped point? */
      continue;
    }

    let f1 = (clr[0] + clr[1] + clr[2]) / 3.0;
    let df = 5 / isize;

    clr = bn.sampler!(x + df, y, bn.gridsize, 1.0, undefined, true);
    let f2 = (clr[0] + clr[1] + clr[2]) / 3.0;

    clr = bn.sampler!(x, y + df, bn.gridsize, 1.0, undefined, true);
    let f3 = (clr[0] + clr[1] + clr[2]) / 3.0;

    let dx = f2 - f1,
      dy = f3 - f1;

    ps[pi + PINTEN] = f1;
    ps[pi + PDX] = dx / df;
    ps[pi + PDY] = dy / df;
  }
}

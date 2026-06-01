// Point relaxation. relax() is the public entry (delegates to relax2, the
// SPH-style kd-tree relaxation); relax3 is the grid-based alternative; sampleRadii
// feeds relax3. These call back into the BlueNoise instance for kd-tree / radii /
// derivative / triangulation updates.
import cconst, {
  config,
  PTOT,
  PLVL,
  PRADIUS2,
  PDX,
  PDY,
  PTH,
  PBAD,
  POX,
  POY,
} from "../const.js";
import type { BlueNoise } from "../bluenoise.js";
import { calcKdtree, calcTheta, calcDerivatives, del } from "./spatial.js";
import { calcRadii } from "./radii.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const _appstate: any;

export function relax(bn: BlueNoise): void {
  relax2(bn);
}

export function relax2(bn: BlueNoise): void {
  let size = bn.dimen;
  let ps = bn.points;

  let minrad = 2.5 / (Math.sqrt(2) * bn.dimen);
  let maxrad = minrad * 6;

  let sumdx = 0,
    sumdy = 0,
    sumw = 0,
    x1 = 0,
    y1 = 0,
    r1 = 0,
    pi1 = 0,
    searchr = 0;
  let tree = calcKdtree(bn);

  let anis_w1 = config.ANIS_W1,
    anis_w2 = config.ANIS_W2;

  let p = [0, 0, 0];
  const searchfac = config.ANISOTROPY
    ? config.ANISOTROPY_FILTERWID
    : config.FILTERWID;
  const sqrt3 = Math.sqrt(3.0);

  maxrad = calcRadii(bn);

  let isize = _appstate.image.width;

  //calculate image gradients
  calcDerivatives(bn);

  function distmetric(pi1: number, pi2: number): number {
    let x1 = ps[pi1],
      y1 = ps[pi1 + 1],
      x2 = ps[pi2],
      y2 = ps[pi2 + 1];
    let gen1 = ps[pi1 + PLVL],
      gen2 = ps[pi2 + PLVL],
      r1 = ps[pi1 + PRADIUS2],
      r2 = ps[pi2 + PRADIUS2];

    if (config.ANISOTROPY) {
      let dx = x1 - x2,
        dy = y1 - y2;
      let dis = Math.sqrt(dx * dx + dy * dy);
      let dx1 = ps[pi1 + PDX],
        dy1 = ps[pi1 + PDY];
      let dx2 = ps[pi2 + PDX],
        dy2 = ps[pi2 + PDY];

      (dx = x2 - x1), (dy = y2 - y1);

      dx1 = Math.sin(
        ps[pi1 + PTH] + (config.STICK_ROT / 180.0) * Math.PI + Math.PI * 0.5,
      );
      dy1 = Math.cos(
        ps[pi1 + PTH] + (config.STICK_ROT / 180.0) * Math.PI + Math.PI * 0.5,
      );

      dis = Math.abs(dx * dy1 - dy * dx1);

      let dis2 = Math.sqrt(dx * dx + dy * dy);

      return dis * anis_w1 + dis2 * anis_w2;
    } else {
      let dx = x1 - x2,
        dy = y1 - y2;

      let dis = Math.sqrt(dx * dx + dy * dy);
      return dis;
    }
  }

  let callback = (pi2: number) => {
    let x2 = ps[pi2],
      y2 = ps[pi2 + 1],
      r2 = ps[pi2 + PRADIUS2];
    let dx = x2 - x1,
      dy = y2 - y1;

    if (isNaN(dx) || isNaN(dy)) {
      throw new Error("nan!");
    }

    let dis = distmetric(pi1, pi2);

    if (dis === 0.0 || dis > searchr) {
      return;
    }

    let w = 1.0 - dis / searchr;

    if (config.USE_SPH_CURVE && config.SPH_CURVE !== undefined) {
      w = config.SPH_CURVE.evaluate(w);
    } else {
      //guassian curve with std deviation of 0.37 to be a bit sharpening
      w = Math.exp(-((w - 1.0) ** 2) / (2 * 0.37 ** 2));
    }

    //go a bit above top radius to avoid gaps from not having the perfect number of points
    let r3 = r1 + r2;

    dx *= (r3 - dis) / dis;
    dy *= (r3 - dis) / dis;

    sumdx += -dx * w;
    sumdy += -dy * w;
    sumw += w;
  };

  console.log("relaxing (sph). . .");
  for (pi1 = 0; pi1 < ps.length; pi1 += PTOT) {
    (x1 = ps[pi1]), (y1 = ps[pi1 + 1]), (r1 = ps[pi1 + PRADIUS2]);

    searchr = r1 * searchfac;
    sumdx = sumdy = sumw = 0.0;

    (p[0] = x1), (p[1] = y1);

    tree.search(p, searchr, callback);

    if (sumw === 0.0) {
      continue;
    }

    sumdx /= sumw;
    sumdy /= sumw;

    let fac = config.RELAX_SPEED * 0.4625 * (config.ANISOTROPY ? 0.4 : 1.0);
    if (ps[pi1 + PBAD] > 0) {
      fac *= 0.15;
    }

    let startx = ps[pi1],
      starty = ps[pi1 + 1];

    ps[pi1] += sumdx * fac;
    ps[pi1 + 1] += sumdy * fac;

    //if on a transparent (undefined) part of the image, pull towards original location
    if (ps[pi1 + PBAD] > 0) {
      let dx = ps[pi1 + POX] - ps[pi1];
      let dy = ps[pi1 + POY] - ps[pi1 + 1];

      let fac2 = config.RELAX_SPEED * 0.1;

      ps[pi1] += dx * fac2;
      ps[pi1 + 1] += dy * fac2;
    }

    ps[pi1] = Math.min(Math.max(ps[pi1], -1.0), 1.0);
    ps[pi1 + 1] = Math.min(Math.max(ps[pi1 + 1], -1.0), 1.0);
  }

  if (config.RELAX_UPDATE_VECTORS) {
    for (let pi1 = 0; pi1 < ps.length; pi1 += PTOT) {
      calcTheta(bn, pi1);
    }
  }

  if (config.TRI_MODE) {
    console.log("regenerating triangulation...");
    del(bn);
  }

  calcRadii(bn);
  console.log("done");
}

export function sampleRadii(bn: BlueNoise): void {
  let ps = bn.points;
  let minrad = 2.5 / (Math.sqrt(2) * bn.dimen);
  //most masks have maximum radius
  //between 6 and 9.5 times minimum radius

  let maxrad = minrad * 6.0;

  for (let i = 0; i < ps.length; i += PTOT) {
    let clr = bn.sampler!(ps[i], ps[i + 1], bn.gridsize, 1.0);

    if (clr[0] < 0) {
      //sampler requested we discard the point
      continue;
    }

    let f = bn.calcIntensity(clr[0], clr[1], clr[2]);

    let sat =
      Math.abs(1.0 - clr[0]) + Math.abs(1.0 - clr[1]) + Math.abs(1.0 - clr[2]);
    sat /= 3.0;

    if (config.ADAPTIVE_COLOR_DENSITY) {
      //scale spacing of points by saturation (how much color there is)
      f *= Math.pow(1.0 - sat, 2);
    }

    f = Math.pow(f, 0.25);

    let r = minrad + (maxrad - minrad) * f;
    ps[i + PRADIUS2] = r;
  }
}

export function relax3(bn: BlueNoise): void {
  sampleRadii(bn);
  console.log("relaxing");

  let GN = 0,
    GDX = 1,
    GDY = 2,
    GSUM = 3,
    GNUM = 4,
    GW = 5,
    GTOT = 6;
  let size = bn.dimen * 2;

  let grid = new Float64Array(size * size * GTOT);

  function reset_grid() {
    grid.fill(0, 0, grid.length);
  }

  reset_grid();

  let ps = bn.points;
  let totw = 0.0;

  let searchfac = 3.0;

  for (let pi = 0; pi < ps.length; pi += PTOT) {
    let x = ps[pi],
      y = ps[pi + 1],
      r = ps[pi + PRADIUS2];
    let searchr = r * searchfac;
    let n = Math.ceil(searchr * size);

    let ix = (x * 0.5 + 0.5) * size;
    let iy = (y * 0.5 + 0.5) * size;
    let dx = Math.fract(ix),
      dy = Math.fract(iy);

    ix = ~~ix;
    iy = ~~iy;

    let dis = dx * dx + dy * dy;
    dis = dis !== 0.0 ? Math.sqrt(dis) : 0.0;
    let w = 1.0 - dis / Math.sqrt(2.0);
    w *= w;

    let idx = (iy * size + ix) * GTOT;

    grid[idx + GN] += n;
    grid[idx + GNUM] += 1.0;

    //w = 1.0;
    grid[idx + GW] += r * r * w * size;
    grid[idx + GSUM] += w;
  }

  function getw(idx: number): number {
    if (grid[idx + GSUM] === 0.0) return 0.0;

    return grid[idx + GW] / grid[idx + GSUM];
  }

  for (let si = 0; si < 2; si++) {
    let grid2 = grid.slice(0, grid.length);

    for (let gi = 0; gi < grid.length; gi += GTOT) {
      grid[gi + GSUM] = grid[gi + GW] = 0.0;
      continue;

      if (grid[gi + GSUM] !== 0.0) {
        grid[gi + GW] /= grid[gi + GSUM];
        grid[gi + GSUM] = 1.0;
      }
    }

    for (let ix = 0; ix < size; ix++) {
      let n = 10;

      for (let iy = 0; iy < size; iy++) {
        let idx = (iy * size + ix) * GTOT;

        for (let i = -n; i <= n; i++) {
          let w = 1.0 - (i + n + 1) / (2 * n + 1);
          w *= w * w;

          let ix2 = !si ? ix + i : ix;
          let iy2 = si ? iy + i : iy;

          if (ix2 < 0 || ix2 >= size || iy2 < 0 || iy2 >= size) {
            continue;
          }

          let idx2 = (iy2 * size + ix2) * GTOT;
          if (grid2[idx2 + GSUM] === 0.0) {
            continue;
          }

          grid[idx + GW] += w * (grid2[idx2 + GW] / grid2[idx2 + GSUM]);
          grid[idx + GSUM] += w;
        }
      }
    }
  }

  for (let ix = 0; ix < size - 1; ix++) {
    for (let iy = 0; iy < size - 1; iy++) {
      let idx = (iy * size + ix) * GTOT;
      let idx2 = (iy * size + ix + 1) * GTOT;
      let idx3 = ((iy + 1) * size + ix) * GTOT;

      if (isNaN(grid[idx + GSUM])) {
        console.warn("NaN again!");
        continue;
      }

      let dx = getw(idx2) - getw(idx);
      let dy = getw(idx3) - getw(idx);

      if (isNaN(dx) || isNaN(dy)) {
        console.log("a NaN!");
        continue;
      }

      let fac = -5.0;
      grid[idx + GDX] = -dx * fac;
      grid[idx + GDY] = -dy * fac;
      totw += grid[idx + GSUM];
    }
  }

  grid.fill(0, 0, grid.length);
  totw = 0.0;

  let rd = 15;
  let offs = cconst.get_searchoff(rd);

  for (let pi = 0; pi < ps.length; pi += PTOT) {
    let x = ps[pi],
      y = ps[pi + 1],
      r = ps[pi + PRADIUS2];
    let searchr = r * searchfac;

    let ix = ~~((x * 0.5 + 0.5) * size);
    let iy = ~~((y * 0.5 + 0.5) * size);

    for (let off of offs) {
      let x2 = x + (off[0] / size) * 0.5,
        y2 = y + (off[1] / size) * 0.5;

      let ix2 = ix + off[0],
        iy2 = iy + off[1];
      if (ix2 < 0 || iy2 < 0 || ix2 >= size || iy2 >= size) continue;

      let idx = (iy2 * size + ix2) * GTOT;
      let n2 = rd;
      let dx = off[0] / n2,
        dy = off[1] / n2;

      let w = dx * dx + dy * dy;

      w = w !== 0.0 ? Math.sqrt(w) : 0.0;
      if (w > 1.0) {
        continue;
      }

      w = 1.0 - w;
      w *= w * w * w;
      w *= searchr;

      grid[idx + GW] += searchr * w;
      grid[idx + GSUM] += w;

      grid[idx + GDX] += dx * w;
      grid[idx + GDY] += dy * w;
      totw += w;
    }
  }

  console.log("totw:", totw);

  //apply filtered vectors
  for (let pi = 0; pi < ps.length; pi += PTOT) {
    let x = ps[pi],
      y = ps[pi + 1],
      r = ps[pi + PRADIUS2];
    let ix = ~~((x * 0.5 + 0.5) * size),
      iy = ~~((y * 0.5 + 0.5) * size);
    let idx = (iy * size + ix) * GTOT;

    let fac = config.RELAX_SPEED * 0.5;

    if (
      isNaN(grid[idx + GSUM]) ||
      isNaN(grid[idx + GDY]) ||
      isNaN(grid[idx + GDX])
    ) {
      console.warn("NaN!");
      continue;
    }

    if (grid[idx + GSUM] === 0.0) {
      continue;
    }

    ps[pi] += (fac * grid[idx + GDX]) / grid[idx + GSUM];
    ps[pi + 1] += (fac * grid[idx + GDY]) / grid[idx + GSUM];

    ps[pi] = Math.min(Math.max(ps[pi], -0.9999), 0.99999);
    ps[pi + 1] = Math.min(Math.max(ps[pi + 1], -0.9999), 0.9999);
  }

  if (config.TRI_MODE) {
    console.log("regenerating triangulation...");
    del(bn);
  }
}

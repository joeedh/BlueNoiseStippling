// Per-point radius computation, driven by the mask's tone distribution (CDF).
import {
  config,
  PTOT,
  PLVL,
  PINTEN,
  PRADIUS2,
  POX,
  POY,
  PBAD,
} from "../const.js";
import type { BlueNoise } from "../bluenoise.js";

export function getMaskPoints(bn: BlueNoise): number[] {
  let ps: number[] = [];

  if (bn.smask) {
    for (let path of bn.smask.points) {
      let pi = ps.length;

      for (let i = 0; i < PTOT; i++) {
        ps.push(0);
      }

      let co = path.evaluate(path.gen);

      ps[pi] = co[0];
      ps[pi + 1] = co[1];
      ps[pi + PLVL] = path.gen;
    }

    return ps;
  } else {
    if (bn.mask === undefined || bn.mask.data === undefined) {
      console.warn("Mask hasn't loaded yet");
      return [];
    }

    let ps: number[] = [];
    let size = bn.mask.width;
    let mdata = bn.mask.data.data;
    let ilen = size * size;

    for (let i = 0; i < ilen; i++) {
      let ix = i % size,
        iy = ~~(i / size);
      let x = ix / size,
        y = iy / size;

      let idx = (iy * size + ix) * 4;

      if (!config.SMALL_MASK && mdata[idx] === 0) {
        continue;
      }

      let pi = ps.length;
      for (let j = 0; j < PTOT; j++) {
        ps.push(0);
      }

      ps[pi] = x;
      ps[pi + 1] = y;
      ps[pi + PLVL] = 1.0 - mdata[idx] / 255.0;
    }

    return ps;
  }
}

export function getMaskCDF(bn: BlueNoise): Float64Array {
  let cdf = new Float64Array(1024);
  let ps = getMaskPoints(bn);

  cdf.fill(0, 0, cdf.length);

  for (let pi = 0; pi < ps.length; pi += PTOT) {
    let gen = ps[pi + PLVL];

    let ci = ~~(gen * cdf.length * 0.999999);
    cdf[ci]++;
  }

  for (let i = 1; i < cdf.length; i++) {
    cdf[i] = cdf[i - 1] + cdf[i];
  }

  return cdf;
}

export function calcRadii(bn: BlueNoise): number {
  console.log("updating radii");
  //this.calc_radii_old(false);

  let cdf = getMaskCDF(bn);
  let masksize: number;

  if (bn.smask !== undefined) {
    masksize = bn.smask.blocksize;
  } else if (!config.SMALL_MASK) {
    masksize = bn.mask!.width;
    masksize = config.XLARGE_MASK ? masksize / 8 : masksize / 4;
  } else {
    masksize = bn.mask!.width;
  }

  let maskscale = masksize / bn.dimen;

  let size = bn.dimen;
  let ps = bn.points;

  let sqrt3 = Math.sqrt(3);

  let radmul = 0.85;

  let startgen = cdf[0];
  for (let i = 0; i < cdf.length; i++) {
    if (cdf[i] !== 0) {
      startgen = cdf[i];
      break;
    }
  }

  let minrad = (radmul / Math.sqrt(cdf[cdf.length - 1] + 1)) * maskscale;
  let maxrad = (radmul / Math.sqrt(startgen + masksize * 0.005)) * maskscale; //ensure radius doesn't get too big by adding chunk of masksize

  for (let i = 0; i < ps.length; i += PTOT) {
    let f;
    if (0) {
      //resample
      let clr = bn.sampler!(ps[i], ps[i + 1], bn.gridsize, 1.0);

      if (clr[0] < 0) {
        //sampler requested we discard the point.  try original location
        clr = bn.sampler!(ps[i + POX], ps[i + POY], bn.gridsize, 1.0);
        ps[i + PBAD] = 1;
      } else {
        ps[i + PBAD] = 0;
      }

      if (clr[0] < 0) {
        //point is still bad?
        ps[i + PRADIUS2] = minrad * 0.5;
        ps[i + PBAD] = 1;
        continue;
      }

      f = bn.calcIntensity(clr[0], clr[1], clr[2]);

      let sat =
        Math.abs(1.0 - clr[0]) +
        Math.abs(1.0 - clr[1]) +
        Math.abs(1.0 - clr[2]);
      sat /= 3.0;

      if (config.ADAPTIVE_COLOR_DENSITY) {
        //scale spacing of points by saturation (how much color there is)
        f *= Math.pow(1.0 - sat, 2);
      }
    } else {
      f = ps[i + PINTEN];
    }

    //relax2() is naturally a blurring operation
    //make it sharpen instead by warping the radii.

    //calculate final radius
    f = 1.0 - f;
    f = Math.min(Math.max(f, 0.0), 1.0) * 0.999999; //clamp

    let ci = ~~(f * cdf.length);
    let g = cdf[ci];
    let r = ((2.0 * radmul) / Math.sqrt(g + masksize * 0.005)) * maskscale;

    ps[i + PRADIUS2] = r;
  }

  return maxrad;
}

// The main step() dispatcher plus the default (mask-dithering) stepping path.
// step() routes to the specialized rasterizers by RASTER_MODE; stepDefault()
// handles the general blue-noise mask path, broken into evalMaskCell() (the
// per-cell mask evaluation) and appendStepPoint() (point-record creation).
import {
  config,
  PTOT,
  PINTEN,
  PID,
  PLVL,
  POX,
  POY,
  PDX,
  PDY,
  POLDX,
  POLDY,
  PBAD,
  PRADIUS2,
  PTH,
  RASTER_MODES,
} from "../const.js";
import * as colors from "../colors.js";
import type { BlueNoise } from "../bluenoise.js";
import { writeDot } from "./raster.js";
import { ditherColor } from "./dither.js";
import { stepB } from "./step-pattern.js";
import { stepSmask } from "./step-smask.js";
import { stepDiffusion } from "./step-diffusion.js";
import { stepCmykColorMask } from "./step-cmyk.js";

// Per-cell mask-evaluation result accumulated by evalMaskCell().
interface MaskCellResult {
  ok: number;
  offx: number;
  offy: number;
  sumx: number;
  sumy: number;
  threshold: number;
  finalth: number;
  rok: number;
  gok: number;
  bok: number;
  fok: number;
}

// Evaluate the (downsampled) blue-noise mask over a wid x wid neighborhood and
// accumulate the per-cell pass/offset/threshold state used to place a point.
function evalMaskCell(
  mask: Uint8ClampedArray,
  ix: number,
  iy: number,
  cw: number,
  ch: number,
  wid: number,
  size: number,
  f: number,
  fr: number,
  fg: number,
  fb: number,
  ditherfac: number,
  do_clrw: number,
  do_cmyk_raster: boolean,
  clrws: number[],
  oks: number[],
  clridxs: number[],
  totwclrs: number,
): MaskCellResult {
  let rotmask = 1;
  let ok = 0;
  let offx = 0,
    offy = 0;
  let sumx = 0,
    sumy = 0;
  let threshold = 0;
  let finalth = 0.0;
  let rok = 0,
    gok = 0,
    bok = 0,
    fok = 0;
  let stop = false;

  for (let i = 0; !stop && i < wid; i++) {
    for (let j = 0; !stop && j < wid; j++) {
      let ix2 = (ix + i) % cw;
      let iy2 = (iy + j) % ch;

      let dd = config.SMALL_MASK ? 0 : 0;
      let ix3, iy3, iy4, ix4, ix5, iy5;

      if (rotmask) {
        ix3 = cw - 1 - ((ix + i + dd) % cw);
        iy3 = (iy + j + dd) % ch;

        iy4 = (ix + i + dd) % cw;
        ix4 = (iy + j) % ch;

        iy5 = (ix + i) % cw;
        ix5 = cw - 1 - ((iy + j + dd) % ch);
      } else {
        ix3 = (ix + i + dd) % cw;
        iy3 = (iy + j + dd) % ch;

        ix4 = (ix + i + dd) % cw;
        iy4 = (iy + j) % ch;

        ix5 = (ix + i) % cw;
        iy5 = (iy + j + dd) % ch;
      }
      let idx2 = ~~((iy2 * cw + ix2) * 4);
      let idx3 = ~~((iy3 * cw + ix3) * 4);
      let idx4 = ~~((iy4 * cw + ix4) * 4);
      let idx5 = ~~((iy5 * cw + ix5) * 4);

      clridxs[0] = idx5;
      clridxs[1] = idx3;
      clridxs[2] = idx4;
      clridxs[3] = idx2;

      let aok2 = mask[idx2] > 1 || config.SMALL_MASK;
      let aok3 = mask[idx3] > 1 || config.SMALL_MASK;
      let aok4 = mask[idx4] > 1 || config.SMALL_MASK;
      let aok5 = mask[idx5] > 1 || config.SMALL_MASK;

      let fok2 = aok2 && f <= mask[idx2] / 255.0 + ditherfac;
      fok |= +fok2;

      let pass = fok2;

      //rok=gok=bok=0;

      if (do_clrw) {
        for (let k = 0; k < totwclrs; k++) {
          let idxk = clridxs[k & 3];

          oks[k] = clrws[k] < mask[idxk] / 255.0 ? 1 : 0;

          if (do_clrw) pass = pass || !!oks[k];
        }
      }

      let rok2 = aok5 && 1.0 - fr < mask[idx5] / 255.0;
      let gok2 = aok3 && 1.0 - fg < mask[idx3] / 255.0;
      let bok2 = aok4 && 1.0 - fb < mask[idx4] / 255.0;

      rok |= +rok2;
      gok |= +gok2;
      bok |= +bok2;

      if (do_cmyk_raster && config.RASTER_IMAGE) {
        pass = pass || rok2;
        pass = pass || gok2;
        pass = pass || bok2;
      }

      if (pass) {
        ok++;

        offx += ((mask[idx2 + 1] / 255.0) * 2.0 - 1.0) / cw;
        offy += ((mask[idx2 + 2] / 255.0) * 2.0 - 1.0) / cw;

        finalth += mask[idx2] / 255.0 + ditherfac;
        sumx += i / size;
        sumy += j / size;

        threshold += mask[idx2] / 255.0;
        //stop = true;
        //break;
      }
    }
  }

  return { ok, offx, offy, sumx, sumy, threshold, finalth, rok, gok, bok, fok };
}

// Append a stipple point record for the default stepping path.
function appendStepPoint(
  bn: BlueNoise,
  x: number,
  y: number,
  start_r: number,
  finten: number,
  ci: number,
  lvl: number,
): void {
  let points = bn.points;
  let pi = points.length;
  for (let j = 0; j < PTOT; j++) {
    points.push(0);
  }

  points[pi] = x;
  points[pi + 1] = y;
  points[pi + 2] = start_r; //*(1.0 + 0.25*(sat));
  points[pi + PINTEN] = finten;
  points[pi + PID] = ci;
  points[pi + PLVL] = lvl;
  points[pi + PRADIUS2] = -1; //points[pi+PRADIUS];

  points[pi + POX] = points[pi + POLDX] = points[pi];
  points[pi + POY] = points[pi + POLDY] = points[pi + 1];

  bn.calc_theta(pi);
}

export function step(
  bn: BlueNoise,
  custom_steps?: number,
  skip_points_display?: boolean,
): void {
  if (config.RASTER_IMAGE && config.RASTER_MODE === RASTER_MODES.PATTERN) {
    stepB(bn);
    bn.calc_derivatives();
    return;
  }

  if (
    config.RASTER_IMAGE &&
    config.RASTER_MODE === RASTER_MODES.CMYK &&
    config.USE_CMYK_MASK
  ) {
    stepCmykColorMask(bn);
    bn.calc_derivatives();
    return;
  }

  if (config.RASTER_IMAGE && config.RASTER_MODE === RASTER_MODES.DIFFUSION) {
    bn.cur = stepDiffusion(bn, custom_steps, bn.cur);
    bn.calc_derivatives();
    return;
  } else if (bn.smask !== undefined) {
    stepSmask(bn, custom_steps);
    return;
  }

  stepDefault(bn, custom_steps, skip_points_display);
}

function stepDefault(
  bn: BlueNoise,
  custom_steps?: number,
  skip_points_display?: boolean,
): void {
  bn.r = 1.0;

  let raster_image = bn.raster_image;
  let rdata = raster_image !== undefined ? raster_image.data : undefined;

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
  let mscale = config.SMALL_MASK ? 1 : config.XLARGE_MASK ? 8 : 4;

  let ix, iy;
  let oks = new Array(colors.colors.length);
  let clrws = new Array(colors.colors.length);
  let clridxs = new Array(colors.colors.length);
  let wcolors = colors.colors;
  let totwclrs = colors.colors.length;

  let clr1 = [0.5, 0.5, 0.5];
  let filter = bn.filter;
  let points = bn.points;
  let start_r = bn.start_r;
  // Latent bug preserved: Filter.get() ignores its argument, so passing the
  // Filter object itself (rather than a number) is harmless at runtime.
  let fil = filter.get(filter as unknown as number);
  let sqrt3 = Math.sqrt(3.0);

  let do_clrw = 0; //attempt at barycentric coloring
  let do_cmyk_raster = config.RASTER_MODE === RASTER_MODES.CMYK;

  let _dr_ret = [0, 0];
  let nextout = [0, 0, 0, 0, 0];

  for (let si = 0; si < steps; si++, bn.cur++) {
    if (bn.cur >= size * size) {
      console.log("Done.");
      break;
    }

    let x = bn.cur % size;
    let y = ~~(bn.cur / size);

    let flip = y % 2 === 0;
    //flip=0;

    if (flip) {
      x = size - x - 1;
    }

    let gx = x,
      gy = y;

    ix = ~~(((x * mscale) % cw) + 0.5);
    iy = ~~(((y * mscale) % ch) + 0.5);

    let igx = x;
    let igy = y;

    x /= size;
    y /= size;

    (x = (x - 0.5) * 2.0), (y = (y - 0.5) * 2.0);

    let clr = bn.sampler!(x, y, size, 1.0);

    if (clr[0] < 0) {
      continue; //sampler requested we discard this sample
    }

    let f = bn.calcIntensity(clr[0], clr[1], clr[2]);
    //let f = (clr[0]*0.4026 + clr[1]*0.4052 + clr[2]*0.2022)*0.8;

    let sat =
      Math.abs(1.0 - clr[0]) + Math.abs(1.0 - clr[1]) + Math.abs(1.0 - clr[2]);
    sat /= 3.0;

    if (config.ADAPTIVE_COLOR_DENSITY) {
      //scale spacing of points by saturation (how much color there is)
      f *= Math.pow(1.0 - sat, 2);
    }
    let finten = f;

    f = config.MAKE_NOISE ? 0.65 : f;

    let idx = (iy * cw + ix) * 4;
    let threshold = mask[idx] / 255.0;

    let wid = mscale;
    let ditherfac = 0; //(1.0/65)*(this.random()-0.5)//*(0.2 + 0.06*f*f);

    let lvl = ~~(f * 64) % 3;

    let fr = clr[0],
      fg = clr[1],
      fb = clr[2];
    if (do_cmyk_raster && config.RASTER_IMAGE) {
      if (do_clrw) {
        clrws = colors.colorweight(clr[0], clr[1], clr[2]);
      }

      let cmyk = colors.rgb_to_cmyk(clr[0], clr[1], clr[2]);

      fr = cmyk[0];
      fg = cmyk[1];
      fb = cmyk[2];

      f = 1.0 - cmyk[3];
      f *= f;
    }

    let cell = evalMaskCell(
      mask,
      ix,
      iy,
      cw,
      ch,
      wid,
      size,
      f,
      fr,
      fg,
      fb,
      ditherfac,
      do_clrw,
      do_cmyk_raster,
      clrws,
      oks,
      clridxs,
      totwclrs,
    );

    let ok = cell.ok;
    let offx = cell.offx,
      offy = cell.offy;
    let sumx = cell.sumx,
      sumy = cell.sumy;
    let finalth = cell.finalth;
    let rok = cell.rok,
      gok = cell.gok,
      bok = cell.bok,
      fok = cell.fok;
    threshold = cell.threshold;

    if (ok > 0) {
      finalth /= ok;
      threshold /= ok;
    }

    if (config.SMALL_MASK) {
      let cix = ~~((x * 0.5 + 0.5) * size + 0.05) % cw;
      let ciy = ~~((y * 0.5 + 0.5) * size + 0.05) % ch;

      cix = gx % cw;
      ciy = gy % ch;

      let idx2 = (ciy * cw + cix) * 4;
      ok = f <= mask[idx2] / 255.0 + ditherfac ? 1 : 0;

      if (do_cmyk_raster && config.RASTER_IMAGE) {
        ok = ok || f <= mask[idx2 + 1] / 255.0 + ditherfac ? 1 : 0;
        ok = ok || f <= mask[idx2 + 2] / 255.0 + ditherfac ? 1 : 0;
      }
    }

    sat = 0;
    let ci = 0;

    if (ok || config.RASTER_IMAGE) {
      if (config.DITHER_COLORS) {
        if (config.DITHER_BLUE)
          colors.ditherSampler.seed(bn.getPixelSeed(1.0 - threshold));
        // Unified palette dithering (shared with PATTERN / point placement).
        ci = ditherColor(bn, clr, f);
      } else {
        ci = colors.closest_color_fast(clr);
      }
    }

    if (ok > 0) {
      offx /= ok;
      offy /= ok;
    }

    if (!config.SMALL_MASK && ok && !config.GRID_MODE) {
      sumx /= ok;
      sumy /= ok;

      let sf = config.XLARGE_MASK ? 0.25 : 0.4; //RASTER_IMAGE ? 0.8 : 0.501;
      sf = 2.0 / mscale;

      //*
      x += sumx * sf; //*mscale*0.5;
      y += sumy * sf; //*mscale*0.5;
      //*/
    }

    if (!config.SMALL_MASK && config.SPECIAL_OFFSETS) {
      let ofac = Math.pow(Math.max(1.0 - f, 0.0001), 3.0);

      ofac *= mscale / 8;
      x += offx * ofac;
      y += offy * ofac;
    }

    let rasterfac =
      raster_image !== undefined
        ? ~~Math.ceil(raster_image.width / bn.dimen)
        : 1;

    clr1[0] = clr[0];
    clr1[1] = clr[1];
    clr1[2] = clr[2];

    if (
      config.DITHER_COLORS &&
      config.RASTER_IMAGE &&
      config.RASTER_MODE !== RASTER_MODES.CMYK
    ) {
      let gidx = ~~((igy * size + igx) * 3);

      clr1[0] += grid[gidx];
      clr1[1] += grid[gidx + 1];
      clr1[2] += grid[gidx + 2];

      ci = colors.closest_color_fast(clr1);
      colors.colors_used[ci]++;

      let clr2 = colors.colors[ci];

      let dr = clr1[0] - clr2[0];
      let dg = clr1[1] - clr2[1];
      let db = clr1[2] - clr2[2];

      let sat =
        Math.abs(1.0 - clr[0]) + Math.abs(1.0 - clr[1]) + Math.abs(1.0 - clr[2]);
      sat /= 3.0;

      //scale color error by spacing of points
      if (config.CORRECT_FOR_SPACING) {
        let avg = (clr[0] + clr[1] + clr[2]) / 3.0;
        let sat2 =
          Math.abs(avg - clr[0]) +
          Math.abs(avg - clr[1]) +
          Math.abs(avg - clr[2]);
        sat2 /= 3.0;

        let ffac = Math.pow(1.0 - f, 0.5);
        ffac = 1.0 - f * f * sat2;

        dr *= ffac;
        dg *= ffac;
        db *= ffac;
      }

      //apply error diffusion to color

      for (let fi = 0; fi < fil.length; fi++) {
        for (let fj = 0; fj < fil[fi].length; fj++) {
          let fi2 = fi;
          let fj2 = fj - 2;

          let igx2 = igx + (flip ? -fj2 : fj2);
          let igy2 = igy + fi2;

          if (igx2 >= size || igy2 >= size) {
            continue;
          }
          if (igx2 < 0 || igy2 < 0) {
            continue;
          }

          let fmul = bn.filter.wrand * (bn.random() - 0.5);
          fmul += (bn.random() - 0.5) * 0.05;

          let gidx2 = (igy2 * size + igx2) * 3;

          grid[gidx2] += fil[fi][fj] * dr + fmul;
          grid[gidx2 + 1] += fil[fi][fj] * dg + fmul;
          grid[gidx2 + 2] += fil[fi][fj] * db + fmul;

          grid[gidx2] = Math.min(Math.max(grid[gidx2], -1.0), 1.0);
          grid[gidx2 + 1] = Math.min(Math.max(grid[gidx2 + 1], -1.0), 1.0);
          grid[gidx2 + 2] = Math.min(Math.max(grid[gidx2 + 2], -1.0), 1.0);
        }
      }
    } else {
      if (ci === undefined) {
        ci = colors.closest_color_fast(clr);
      }
      let clr2 = colors.colors[ci];

      if (clr2 === undefined) {
        console.warn("eek!", ci);
        ci = 0;
        colors.colors[ci];
      }

      clr1[0] = clr2[0];
      clr1[1] = clr2[1];
      clr1[2] = clr2[2];

      let sat =
        Math.abs(1.0 - clr2[0]) +
        Math.abs(1.0 - clr2[1]) +
        Math.abs(1.0 - clr2[2]);
      sat /= 3.0;
    }

    let do_raster = config.RASTER_IMAGE && rdata !== undefined;
    if (
      do_raster &&
      raster_image !== undefined &&
      rdata !== undefined &&
      config.RASTER_MODE === RASTER_MODES.DIFFUSION
    ) {
      let clr2 = colors.colors[ci];

      let rix = ~~((x * 0.5 + 0.5001) * raster_image.width * 0.99999),
        riy = ~~((y * 0.5 + 0.5001) * raster_image.height * 0.99999);
      let ridx = (riy * raster_image.width + rix) * 4;

      rdata[ridx] = ~~(clr2[0] * 255);
      rdata[ridx + 1] = ~~(clr2[1] * 255);
      rdata[ridx + 2] = ~~(clr2[2] * 255);
      rdata[ridx + 3] = 255;

      ok = 1;
    } else if (
      do_raster &&
      raster_image !== undefined &&
      do_cmyk_raster &&
      (rok || gok || bok || ok)
    ) {
      let rix = ~~((x * 0.5 + 0.5001) * raster_image.width * 0.99999),
        riy = ~~((y * 0.5 + 0.5001) * raster_image.height * 0.99999);

      if (bok) {
        writeDot(bn, rix, riy, fb, 0, 0, 255, 0, rasterfac);
      }

      //*
      if (rok) {
        writeDot(bn, rix, riy, fr, 255, 0, 0, 0, rasterfac);
      }

      if (gok) {
        writeDot(bn, rix, riy, fg, 0, 255, 0, 0, rasterfac);
      }

      if (fok) {
        writeDot(bn, rix, riy, f, 255, 255, 255, 0, rasterfac);
      }
      //*/
    }

    if (config.RASTER_IMAGE) {
      continue;
    }

    if (!ok) {
      continue;
    }

    appendStepPoint(bn, x, y, start_r, finten, ci, lvl);
  }

  if (!skip_points_display) {
    console.log("points", points.length / PTOT);
    console.log("\n");
  }

  bn.calc_derivatives();

  if (config.TRI_MODE && !skip_points_display) {
    console.log("regenerating triangulation...");
    bn.del();
  } else if (config.SCALE_POINTS && !skip_points_display) {
    bn.calc_radii();
  }
}

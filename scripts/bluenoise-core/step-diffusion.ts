// DIFFUSION raster mode: Floyd-Steinberg error diffusion of palette color across
// the grid. Writes pixels directly to the raster buffer; creates no points.
// Returns the advanced `cur` cursor.
import { config, RASTER_MODES } from "../const.js";
import * as colors from "../colors.js";
import type { BlueNoise } from "../bluenoise.js";

export function stepDiffusion(
  bn: BlueNoise,
  custom_steps: number | undefined,
  cur: number,
): number {
  console.log("Step Diffusion");

  let steps = custom_steps === undefined ? config.STEPS : custom_steps;

  let raster_image = bn.raster_image;
  let rdata = raster_image !== undefined ? raster_image.data : undefined;

  if (bn.sampler === undefined) {
    console.log("image hasn't loaded yet");
  }

  let grid = bn.errgrid;
  let size = bn.gridsize;
  let iw = config.DIMEN,
    ih = config.DIMEN;

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
  let fil = filter.get(0.0);
  let sqrt3 = Math.sqrt(3.0);

  let do_clrw = 0; //attempt at barycentric coloring
  let do_cmyk_raster = config.RASTER_MODE === RASTER_MODES.CMYK;

  let _dr_ret = [0, 0];
  let nextout = [0, 0, 0, 0, 0];

  for (let si = 0; si < steps; si++, cur++) {
    if (cur >= size * size) {
      console.log("Done.");
      break;
    }

    let x = cur % size;
    let y = ~~(cur / size);

    let flip = y % 2 === 0;
    //flip=0;

    if (flip) {
      x = size - x - 1;
    }

    let gx = x,
      gy = y;

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
    //let f = clr[0]*clr[0] + clr[1]*clr[1] + clr[2]*clr[2];
    //f = f !== 0.0 ? Math.sqrt(f) / sqrt3 : 0.0;

    let sat =
      Math.abs(1.0 - clr[0]) + Math.abs(1.0 - clr[1]) + Math.abs(1.0 - clr[2]);
    sat /= 3.0;

    if (config.ADAPTIVE_COLOR_DENSITY) {
      //scale spacing of points by saturation (how much color there is)
      f *= Math.pow(1.0 - sat, 2);
    }
    let finten = f;

    let rok = 0,
      gok = 0,
      bok = 0,
      fok = 0;
    let finalth = 0.0;

    let fr = clr[0],
      fg = clr[1],
      fb = clr[2];

    let ci = colors.closest_color_fast(clr);

    clr1[0] = clr[0];
    clr1[1] = clr[1];
    clr1[2] = clr[2];

    if (config.DITHER_COLORS) {
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
        Math.abs(1.0 - clr[0]) +
        Math.abs(1.0 - clr[1]) +
        Math.abs(1.0 - clr[2]);
      sat /= 3.0;

      //scale color error by spacing of points
      if (config.CORRECT_FOR_SPACING) {
        let sat2 = colors.internal_to_saturation(clr[0], clr[1], clr[2]);

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
        console.log(ci);
        throw new Error("eek!");
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
    if (do_raster && raster_image !== undefined && rdata !== undefined) {
      let clr2 = colors.colors[ci];

      let rix = ~~((x * 0.5 + 0.5001) * raster_image.width * 0.99999),
        riy = ~~((y * 0.5 + 0.5001) * raster_image.height * 0.99999);
      let ridx = (riy * raster_image.width + rix) * 4;

      rdata[ridx] = ~~(clr2[0] * 255);
      rdata[ridx + 1] = ~~(clr2[1] * 255);
      rdata[ridx + 2] = ~~(clr2[2] * 255);
      rdata[ridx + 3] = 255;
    }
  }

  return cur;
}

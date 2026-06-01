// CMYK mask mode: per-channel halftoning against a 4-quadrant mask, stamping
// inked dots into the raster buffer via writeDot().
import { config, PTOT } from "../const.js";
import * as colors from "../colors.js";
import type { BlueNoise } from "../bluenoise.js";
import { writeDot } from "./raster.js";
import { del } from "./spatial.js";
import { calcRadii } from "./radii.js";

export function stepCmykColorMask(
  bn: BlueNoise,
  custom_steps?: number,
  skip_points_display?: boolean,
): void {
  if (bn.mask === undefined || bn.mask.data === undefined) {
    console.log("WARNING: mask failed to load");
    return;
  }

  let masksize = bn.mask.width;
  let mask = bn.mask.data.data;
  let points = bn.points;
  let steps = custom_steps ? custom_steps : config.STEPS;
  let cw = bn.mask.width;
  let ch = bn.mask.height;
  let ix: number, iy: number;
  let size = bn.gridsize;
  let iw = config.DIMEN,
    ih = config.DIMEN;

  let raster_image = bn.raster_image;
  let rdata = raster_image !== undefined ? raster_image.data : undefined;

  if (raster_image === undefined || rdata === undefined) {
    console.log("WARNING: raster image not set");
    return;
  }

  let mscale = config.SMALL_MASK ? 1 : config.XLARGE_MASK ? 8 : 4;

  let rasterfac =
    raster_image !== undefined ? ~~Math.ceil(raster_image.width / bn.dimen) : 1;

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

    f = config.MAKE_NOISE ? 0.65 : f;

    let fr = clr[0],
      fg = clr[1],
      fb = clr[2];

    let cmyk = colors.rgb_to_cmyk(clr[0], clr[1], clr[2]);

    fr = cmyk[0];
    fg = cmyk[1];
    fb = cmyk[2];

    //fr *= 1.5;
    //fg *= 1.5;
    //fb *= 1.5;

    let rx = bn.cur % size;
    let ry = ~~(bn.cur / size);
    if (flip) {
      rx = size - rx - 1;
    }

    let rx2 = ~~((raster_image.width * rx) / size);
    let ry2 = ~~((raster_image.height * ry) / size);
    let idx = (ry2 * raster_image.width + rx2) * 4;

    //rdata[idx] = 255;
    //rdata[idx+1] = 0;
    //rdata[idx+3] = 255;

    for (let color = 0; color < 4; color++) {
      let masksize2 = ~~(masksize / 2);

      //break;
      let ox = color % 2,
        oy = ~~(color / 2);

      ox *= masksize2;
      oy *= masksize2;

      let mx = rx % masksize2;
      let my = ry % masksize2;

      mx = ~~(mx + ox);
      my = ~~(my + oy);

      let idx2 = (my * masksize + mx) * 4;

      let f = cmyk[color];
      //f = f*f*(3.0 - 2.0*f);
      //f = color === 3 ? 1.0 - f : f;

      if (f * 255 < mask[idx2]) {
        continue;
      }

      //if (color !== 3)
      //  continue;

      //rdata[idx] = rdata[idx+1] = rdata[idx+2] = 0;
      //dot(rx2, ry2, 1.0, cmyk[0]*255, cmyk[1]*255, cmyk[2]*255, cmyk[3]*255);

      //continue;
      switch (color) {
        case 0:
          writeDot(bn, rx2, ry2, 1.0, 255, 0, 0, 0, rasterfac);

          //dot(x, y, f, 255, 0, 0, 255);
          //rdata[idx] = Math.max(rdata[idx]-255, 0);
          //rdata[idx+1] = Math.max(rdata[idx+1]-100, 0);
          break;
        case 1:
          writeDot(bn, rx2, ry2, 1.0, 0, 255, 0, 0, rasterfac);
          //rdata[idx+1] = Math.max(rdata[idx+1]-255, 0);
          //rdata[idx+2] = Math.max(rdata[idx+2]-100, 0);
          break;
        case 2:
          writeDot(bn, rx2, ry2, 1.0, 0, 0, 255, 0, rasterfac);
          //rdata[idx+2] = Math.max(rdata[idx+2]-255, 0);
          break;
        case 3:
          writeDot(bn, rx2, ry2, 1.0, 255, 255, 255, 255, rasterfac);
          //rdata[idx+0] = Math.max(rdata[idx+0]-255, 0);
          //rdata[idx+1] = Math.max(rdata[idx+1]-255, 0);
          //rdata[idx+2] = Math.max(rdata[idx+2]-255, 0);
          break;
      }

      rdata[idx + 3] = 255;
    }

    //dot(x, y, f, 0, 0, 0, 255);
  }

  if (!skip_points_display) {
    console.log("points", points.length / PTOT);
    console.log("\n");
  }

  if (config.TRI_MODE && !skip_points_display) {
    console.log("regenerating triangulation...");
    del(bn);
  } else if (config.SCALE_POINTS && !skip_points_display) {
    calcRadii(bn);
  }
}

// The shared CMYK/spot "dot" rasterizer. The original code defined identical
// `dot`/`dot_intern` closures inside step(), step_diffusion(), and
// step_cmyk_color_mask(); they are unified here as free functions taking the
// BlueNoise instance. (step_diffusion's copies were dead — it writes rdata
// directly — so only step() and step_cmyk_color_mask() use these.)
import cconst, { config, RASTER_MODES } from "../const.js";
import type { BlueNoise } from "../bluenoise.js";

// Subtract an inked dot (CMYK channel) into the raster buffer at (rx, ry).
// `rasterfac` is retained from the original for faithfulness but is inert: `size`
// is forced to 0 below, so the spot-function (size>0) branch never runs.
export function writeDotIntern(
  bn: BlueNoise,
  rx: number,
  ry: number,
  spotk: number,
  c: number,
  m: number,
  y: number,
  k: number,
  alpha: number | undefined,
  rasterfac: number,
): void {
  const raster_image = bn.raster_image;
  const rdata = raster_image !== undefined ? raster_image.data : undefined;
  if (raster_image === undefined || rdata === undefined) return;
  alpha = alpha === undefined ? 1 : alpha;

  let size = ~~(rasterfac * 0.25);
  size = 0;

  let offs = cconst.get_spotfunc(size, spotk);

  if (size === 0) {
    let ridx = (ry * raster_image.width + rx) * 4;

    rdata[ridx] = Math.max(rdata[ridx] - c * alpha, 0); //*(1.0-k);
    rdata[ridx + 1] = Math.max(rdata[ridx + 1] - m * alpha, 0);
    rdata[ridx + 2] = Math.max(rdata[ridx + 2] - y * alpha, 0);
    rdata[ridx + 3] = 255;

    return;
  }

  for (let i = 0; i < offs.length; i++) {
    let rx2 = rx + offs[i][0];
    let ry2 = ry + offs[i][1];

    if (
      rx2 < 0 ||
      ry2 < 0 ||
      rx2 >= raster_image.width ||
      ry2 >= raster_image.height
    ) {
      continue;
    }

    let ridx = (ry2 * raster_image.width + rx2) * 4;

    rdata[ridx] = Math.max(rdata[ridx] - c * alpha, 0); //*(1.0-k);
    rdata[ridx + 1] = Math.max(rdata[ridx + 1] - m * alpha, 0);
    rdata[ridx + 2] = Math.max(rdata[ridx + 2] - y * alpha, 0);
    rdata[ridx + 3] = 255;
  }
}

// Stamp a dot plus (in CMYK mode) a crude ink-bleed into the 4 neighbors.
export function writeDot(
  bn: BlueNoise,
  rx: number,
  ry: number,
  spotk: number,
  c: number,
  m: number,
  y: number,
  k: number,
  rasterfac: number,
): void {
  let f1 = 1.0 - spotk;
  if (c === m && c === y) f1 = spotk;

  f1 *= 0.5;

  writeDotIntern(bn, rx, ry, spotk, c, m, y, k, 0.4, rasterfac);
  if (config.RASTER_MODE !== RASTER_MODES.CMYK) {
    return;
  }

  //crude simulation of ink bleeding
  f1 = 0.1;
  writeDotIntern(bn, rx - 1, ry, spotk, c, m, y, k, f1, rasterfac);
  writeDotIntern(bn, rx, ry + 1, spotk, c, m, y, k, f1, rasterfac);
  writeDotIntern(bn, rx + 1, ry, spotk, c, m, y, k, f1, rasterfac);
  writeDotIntern(bn, rx, ry - 1, spotk, c, m, y, k, f1, rasterfac);
}

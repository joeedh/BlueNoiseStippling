// Shared, BlueNoise-free internals for the bluenoise-core modules: the small
// types the algorithm passes around, the `InnerLoopArg` scratch object, and the
// `rot()` helper. Kept dependency-free (no import of the BlueNoise facade) so the
// cluster modules and the facade can all import it without an import cycle.
import * as util from "../util.js";

// A point's data lives in a flat array indexed by `i*PTOT + Pxxx`.
export type PointArray = number[];
// Color/sample tuples returned by the sampler and color routines.
export type Vec = number[];

// The image sampler. The underlying `sampler.sampler` has implicit-any params and
// no optional markers; callers here pass 4-6 args, so we describe the trailing two
// as optional. Returns an [r,g,b,a] tuple (r<0 signals "discard this sample").
export type SamplerFn = (
  x: number,
  y: number,
  size: number,
  rad: number,
  no_filter?: boolean,
  use_debanded?: boolean,
) => number[];

// The render target: an ImageData-like object whose `data` is the raw RGBA byte
// array written by the rasterizer.
export interface RasterImage {
  width: number;
  height: number;
  data?: Uint8ClampedArray;
}

// Loaded mask image: an <img> element with decoded pixel data attached.
export type MaskImage = HTMLImageElement & {
  data?: ImageData;
};

const rot_rets = new util.cachering<number[]>(function () {
  return [0, 0];
}, 256);

export function rot(x: number, y: number, th: number): number[] {
  let ret = rot_rets.next();

  let sinth = Math.sin(th);
  let costh = Math.cos(th);

  ret[0] = costh * x - sinth * y;
  ret[1] = costh * y + sinth * x;

  return ret;
}

window.rot = rot;

export class InnerLoopArg {
  x: number;
  y: number;
  offx: number;
  offy: number;
  ix: number;
  iy: number;

  constructor() {
    this.x = this.y = this.offx = this.offy = this.ix = this.iy = 0.0;
  }

  load(
    x: number,
    y: number,
    ix: number,
    iy: number,
    offx: number,
    offy: number,
  ): this {
    this.x = x;
    this.y = y;
    this.ix = ix;
    this.iy = iy;
    this.offx = offx;
    this.offy = offy;

    return this;
  }
}

import * as util from "./util.js";
import { config } from "./const.js";
import * as colors from "./colors.js";
import * as diffusion from "./diffusion.js";
import * as kdtree2 from "./kdtree2.js";
import * as smoothmask from "./smoothmask.js";
import * as indexdb_store from "./indexdb_store.js";
import smoothmask_file from "./smoothmask_file.js";
import * as sampler from "./sampler.js";
import {
  InnerLoopArg,
  type PointArray,
  type RasterImage,
  type MaskImage,
  type SamplerFn,
} from "./bluenoise-core/internal.js";
import { step as stepImpl } from "./bluenoise-core/step.js";
import { relax as relaxImpl } from "./bluenoise-core/relax.js";
import { colordiffuse as colordiffuseImpl } from "./bluenoise-core/color.js";
import { calcKdtree as calcKdtreeImpl } from "./bluenoise-core/spatial.js";

// `_appstate` and `redraw_all` are bare globals installed on window at runtime
// (see appstate.ts). The app reads them as bare identifiers. `_appstate` is the
// dynamic app-state bag (typed `any` on the Window interface too), so `any` is
// the appropriate boundary type here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const _appstate: any;
declare const redraw_all: () => void;

export class BlueNoise {
  points: PointArray;
  inner_loop_cachering: util.cachering<InnerLoopArg>;
  errgrid: Float64Array;
  mask: MaskImage | undefined;
  smask: smoothmask.PointSet | undefined;
  filter: diffusion.Filter;
  cur: number;
  gridsize: number;
  celldim: number | undefined;
  sampler: SamplerFn | undefined;
  r: number;
  start_r: number;
  dimen!: number;
  raster_image: RasterImage | undefined;
  minr!: number;
  tris!: number[];
  vcells!: Float64Array;
  kdtree2: kdtree2.KDTree | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dvimage: any;
  _random: util.MersenneRandom | undefined;
  _mask: MaskImage | undefined;

  constructor() {
    this.points = [];
    this.inner_loop_cachering = util.cachering.fromConstructor<InnerLoopArg>(
      InnerLoopArg,
      64,
    );

    this.errgrid = undefined as unknown as Float64Array; // assigned in init()
    this.mask = undefined;

    //error diffusion filter
    this.filter = diffusion.basic_filter();

    this.cur = 0;
    this.gridsize = this.celldim = undefined as unknown as number; // assigned in init()
    this.sampler = undefined;

    this.r = this.start_r = undefined as unknown as number; // assigned in init()
  }

  getPixelSeed(threshold: number): number {
    //threshold = 1.0 - threshold;
    threshold = threshold ** 0.5;

    return ~~(threshold * config.DITHER_BLUE_STEPS); //colors.colors.length * 0.25);
  }

  calcIntensity(r: number, g: number, b: number): number {
    let f = colors.internal_to_intensity(r, g, b);

    if (config.DENSITY_CURVE !== undefined) {
      f = config.DENSITY_CURVE.evaluate(f);
    }

    if (config.BLACK_BG) {
      //f = f**5;
      f = 1.0 - f ** 0.5;
      //f = f**2.0;
    } else {
      f *= f ** 0.25;
    }

    return f;
  }

  step(custom_steps?: number, skip_points_display?: boolean): void {
    stepImpl(this, custom_steps, skip_points_display);
  }

  colordiffuse(): void {
    colordiffuseImpl(this);
  }

  relax(): void {
    relaxImpl(this);
  }

  init(size: number): void {
    let diag = 1.00001 / config.DIMEN;

    diag = Math.sqrt(diag * diag + diag * diag);

    this.r = diag;
    this.cur = 0;
    this.start_r = this.r;
    this.gridsize = size;

    this.errgrid = new Float64Array(size * size * 3);
    this.errgrid.fill(0, 0, this.errgrid.length);

    // read() resolves to `unknown` (stored value or undefined); narrow to string.
    new indexdb_store.IndexDBStore("bluenoise_mask")
      .read("data", undefined)
      .then((value) => {
        let result = value as string | undefined;
        if (result === undefined) {
          result = smoothmask_file;
        }

        this.load_mask(result);
      });
  }

  //maskdata is data url, url that has full image encoded in it
  load_mask(maskdata: string): void {
    if (maskdata.startsWith("SMOOTHMASK")) {
      maskdata = maskdata.slice(10, maskdata.length);

      this.smask = new smoothmask.PointSet().fromBinary(maskdata);
    } else {
      this.smask = undefined;

      this._mask = new Image();
      this._mask.src = maskdata;

      let this2 = this;
      this._mask.onload = function (this: GlobalEventHandlers, _ev: Event) {
        // Latent bug preserved: inside this handler `this` is the <img>, so these
        // assignments write to the image element, not the BlueNoise instance.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any).mask = (this as any)._mask;
        this2.on_image_read(this2._mask!, "mask");
      };
    }
  }

  random(): number {
    if (this._random !== undefined) {
      return this._random.random();
    }

    return Math.random();
  }

  //raster_image is optional
  reset(raster_image?: RasterImage): void {
    if (config.USE_MERSENNE) {
      this._random = new util.MersenneRandom(0);
    } else {
      this._random = undefined;
    }

    this.raster_image = raster_image;
    this.dimen = config.DIMEN;

    this.cur = 0;
    this.points = [];
    this.errgrid.fill(0, 0, this.errgrid.length);

    if (_appstate.image !== undefined && _appstate.image.data !== undefined) {
      // sampler.sampler has implicit-any params/no optionals; SamplerFn describes
      // the call surface actually used here.
      this.sampler = sampler.sampler as unknown as SamplerFn;
      this.image = _appstate.image.data;

      if (this.image.orig === undefined) {
        this.image.orig = new Uint8Array(this.image.data.length);
        this.image.orig.set(this.image.data);
      }

      this.image.data.set(this.image.orig);
      this.image.fdata = this.image.fdata = new Float32Array(this.image.orig);

      sampler.fdataToInternal(this.image.fdata);

      if (config.HIST_EQUALIZE) {
        this.image.fdata = sampler.histEqualize(this.image).fdata;
      }

      sampler.fdataToData8(this.image.fdata, this.image.data);

      this.dvimage = sampler.copyImage(this.image);

      if (config.DEBAND_IMAGE) {
        this.dvimage.fdata = sampler.debandImage(this.dvimage).fdata;
      } else {
        this.dvimage.fdata = this.image.fdata;
      }

      sampler.fdataToData8(this.dvimage.fdata, this.dvimage.data);
    }

    redraw_all();
  }

  on_image_read(img: MaskImage, field: string): void {
    console.log("got", field, "image");

    let this2 = this;

    if (img.width === 0) {
      console.log("Problem loading image. . .");

      let timer = window.setInterval(function () {
        if (img.width !== 0) {
          window.clearInterval(timer);
          this2.on_image_read(img, field);
          console.log(". . .or not, image has (finally!) loaded");
        }
      }, 500);

      return;
    }

    //extract image data
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let g = canvas.getContext("2d");
    if (g === null) {
      return;
    }
    g.drawImage(img as unknown as CanvasImageSource, 0, 0);

    // `field` is a dynamic member name ('mask'); index `this` as a record for it.
    let self = this as unknown as Record<string, MaskImage>;
    self[field] = img;

    if (img.width === 0) {
      console.log("eek", img.width, img.height);
      return;
    }

    let data = g.getImageData(0, 0, img.width, img.height);
    self[field].data = data;
  }

  calc_kdtree(orig_cos?: boolean): kdtree2.KDTree {
    return calcKdtreeImpl(this, orig_cos);
  }
}

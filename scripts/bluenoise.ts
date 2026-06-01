import * as util from "./util.js";
import cconst, {
  config,
  PTOT,
  PRADIUS,
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
} from "./const.js";
import * as draw from "./draw.js";
import * as colors from "./colors.js";
import * as diffusion from "./diffusion.js";
import "./delaunay.js";
import * as kdtree from "./kdtree.js";
import * as kdtree2 from "./kdtree2.js";
import * as smoothmask from "./smoothmask.js";
import * as indexdb_store from "./indexdb_store.js";
import smoothmask_file from "./smoothmask_file.js";
import * as sampler from "./sampler.js";
import {
  InnerLoopArg,
  type PointArray,
  type Vec,
  type RasterImage,
  type MaskImage,
  type SamplerFn,
} from "./bluenoise-core/internal.js";
import { step as stepImpl } from "./bluenoise-core/step.js";
import { relax as relaxImpl } from "./bluenoise-core/relax.js";
import { colordiffuse as colordiffuseImpl } from "./bluenoise-core/color.js";

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
    console.log("building kdtree. . .");

    let ps = this.points;
    let tree = (this.kdtree2 = new kdtree2.KDTree([-2, -2, -2], [2, 2, 2]));
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

    /*
    for (let pi=0; pi<ps.length; pi += PTOT) {
      let x = ps[pi], y = ps[pi+1];

      if (orig_cos) {
        x = ps[pi+POX], y = ps[pi+POY];
      }

      tree.insert(x, y, pi);
    }*/

    //tree.balance();

    return tree;
    /*
    let kd = new kdtree.KDTree();
    let ps = this.points;

    for (let i=0; i<ps.length; i += PTOT) {
      let x = ps[i], y = ps[i+1];
      if (orig_cos) {
        x = ps[i+POX], y = ps[i+POY];
      }

      kd.insert(x*0.5+0.5, y*0.5+0.5, i/PTOT);
    }

    this.kdtree = kd;

    return kd;//*/
  }

  calc_theta(pi: number): void {
    let ps = this.points,
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

      let clr = this.sampler!(x, y, this.gridsize, 1.0, undefined, true);

      if (clr[0] < 0) {
        return; //dropped point
      }

      let f1 = this.calcIntensity(clr[0], clr[1], clr[2]);

      clr = this.sampler!(x + df, y, this.gridsize, 1.0, undefined, true);
      let f2 = this.calcIntensity(clr[0], clr[1], clr[2]);

      clr = this.sampler!(x, y + df, this.gridsize, 1.0, undefined, true);
      let f3 = this.calcIntensity(clr[0], clr[1], clr[2]);

      dx = (f2 - f1) / df;
      dy = (f3 - f1) / df;
    }

    ps[pi + PTH] = -Math.atan2(dy, dx);
  }

  calc_thetas(): void {
    let ps = this.points;

    let isize = _appstate.image.width;

    for (let pi = 0; pi < ps.length; pi += PTOT) {
      this.calc_theta(pi);
    }
  }

  calc_radii_old(use_orig_cos?: boolean): void {
    let ps = this.points;
    let kd = this.calc_kdtree(true);

    let GIDX = 0,
      GTOT = 1;

    let size = this.dimen;

    for (let i = 0; i < ps.length; i += PTOT) {
      //ps[i+PRADIUS2] = -1;
    }

    for (let i = 0; i < ps.length; i += PTOT) {
      let x, y;

      if (use_orig_cos) {
        (x = ps[i + POX]), (y = ps[i + POY]);
      } else {
        (x = ps[i]), (y = ps[i + 1]);
      }
    }

    let minrad = 1 / (this.dimen * Math.sqrt(2));
    let minrad2 = 1e17;
    let tot: number, avgr: number, minr: number, maxr: number;
    let x1: number,
      y1: number,
      ix: number,
      iy: number,
      ix1: number,
      iy1: number;
    // Latent bug preserved: pointcallback() below references this `i`, which was an
    // undefined free variable in the original JS (the loop uses its own block `let i`).
    let i = -1;

    //most masks have maximum radius
    //between 6 and 9.5 times minimum radius

    let maxrad = minrad * 10.0;
    console.log("maxrad", maxrad, minrad);

    let rd = ~~(maxrad * size + 2);
    let offs = cconst.get_searchoff(rd);

    let min = Math.min,
      max = Math.max;

    console.log("rd", rd, minrad, offs.length);

    function pointcallback(pi: number) {
      if (pi === i) return;

      let x2 = ps[pi + POX],
        y2 = ps[pi + POY];

      let dx = x2 - x1,
        dy = y2 - y1;
      let dis = dx * dx + dy * dy;
      dis = dis !== 0.0 ? Math.sqrt(dis) : 0.0;

      let w = max(1.0 - dis / maxrad, 0.0);
      w *= w * w;

      minr = min(dis, minr);
      maxr = max(dis, maxr);
      minrad2 = min(dis, minrad2);

      avgr += dis * w;
      tot += w;

      //if (isNaN(w) || isNaN(tot)) {
      //  throw new Error("nan!");
      //}
    }

    for (let i = 0; i < ps.length; i += PTOT) {
      let x = ps[i + POX],
        y = ps[i + POY];

      if (ps[i + PRADIUS2] !== -1) {
        continue;
      }

      (ix = (x * 0.5 + 0.5) * size + 0.0001),
        (iy = (y * 0.5 + 0.5) * size + 0.0001);
      (x1 = x), (y1 = y), (ix1 = ix), (iy1 = iy);
      (minr = 1e17), (maxr = -1e17), (avgr = 0);
      tot = 0;

      kd.forEachPoint(x, y, maxrad, pointcallback, this);

      if (tot === 0) {
        ps[i + PRADIUS2] = minrad * 4.0;
        continue;
      }

      avgr /= tot;

      if (isNaN(tot) || isNaN(avgr)) {
        console.log(avgr, tot, x, y, maxrad);
        throw new Error("NaN!");
      }

      let r = avgr * 0.5;

      ps[i + PRADIUS2] = r;
      //ps[i+PRADIUS] = r;
    }

    this.minr = minrad2;
    console.log("MINR2", this.minr);
  }

  del(): void {
    this.tris = [];
    this.calc_radii();

    let ps2 = [],
      ps = this.points;
    for (let i = 0; i < ps.length; i += PTOT) {
      ps2.push([ps[i], ps[i + 1]]);
    }

    let tris = Delaunay.triangulate(ps2);

    this.tris = tris;

    let plen = this.points.length / PTOT;
    let vcells = (this.vcells = new Float64Array(plen * config.MAX_VCELL_SIZE));

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

  getMaskPoints(): number[] {
    let ps: number[] = [];

    if (this.smask) {
      for (let path of this.smask.points) {
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
      if (this.mask === undefined || this.mask.data === undefined) {
        console.warn("Mask hasn't loaded yet");
        return [];
      }

      let ps: number[] = [];
      let size = this.mask.width;
      let mdata = this.mask.data.data;
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

  getMaskCDF(): Float64Array {
    let cdf = new Float64Array(1024);
    let ps = this.getMaskPoints();

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

  calc_radii(): number {
    console.log("updating radii");
    //this.calc_radii_old(false);

    let cdf = this.getMaskCDF();
    let masksize: number;

    if (this.smask !== undefined) {
      masksize = this.smask.blocksize;
    } else if (!config.SMALL_MASK) {
      masksize = this.mask!.width;
      masksize = config.XLARGE_MASK ? masksize / 8 : masksize / 4;
    } else {
      masksize = this.mask!.width;
    }

    let maskscale = masksize / this.dimen;

    let size = this.dimen;
    let ps = this.points;

    //let minrad = 2.5 / (Math.sqrt(2)*this.dimen);
    //let maxrad = minrad*6;
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

    //maxrad = 18 * 0.95 / Math.sqrt(this.dimen*this.dimen);

    /*
    console.log("building kdtree. . .");
    for (let pi=0; pi<ps.length; pi += PTOT) {
        tree.insert(ps[pi], ps[pi+1], pi);
    }//*/

    //*
    for (let i = 0; i < ps.length; i += PTOT) {
      let f;
      if (0) {
        //resample
        let clr = this.sampler!(ps[i], ps[i + 1], this.gridsize, 1.0);

        if (clr[0] < 0) {
          //sampler requested we discard the point.  try original location
          clr = this.sampler!(ps[i + POX], ps[i + POY], this.gridsize, 1.0);
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

        f = this.calcIntensity(clr[0], clr[1], clr[2]);
        //f = clr[0]*clr[0] + clr[1]*clr[1] + clr[2]*clr[2];
        //f = f !== 0.0 ? Math.sqrt(f) / sqrt3 : 0.0;

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

      //f = Math.pow(f, 1.25);
      //or not

      //calculate final radius
      f = 1.0 - f;
      f = Math.min(Math.max(f, 0.0), 1.0) * 0.999999; //clamp

      let ci = ~~(f * cdf.length);
      let g = cdf[ci];
      //g = f*size*size;
      let r = ((2.0 * radmul) / Math.sqrt(g + masksize * 0.005)) * maskscale;
      //let r = minrad + (maxrad - minrad)*f;

      //r = Math.min(r, maxrad);

      ps[i + PRADIUS2] = r;
    } //*/

    return maxrad;
  }

  calc_derivatives(): void {
    console.log("updating point derivatives with respect to the image");

    let size = this.dimen;
    let isize = _appstate.image.width;
    let ps = this.points;

    /* Calculate image gradients. */
    for (let pi = 0; pi < ps.length; pi += PTOT) {
      let x = ps[pi],
        y = ps[pi + 1];
      let clr = this.sampler!(x, y, this.gridsize, 1.0, undefined, true);

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

      clr = this.sampler!(x + df, y, this.gridsize, 1.0, undefined, true);
      let f2 = (clr[0] + clr[1] + clr[2]) / 3.0;

      clr = this.sampler!(x, y + df, this.gridsize, 1.0, undefined, true);
      let f3 = (clr[0] + clr[1] + clr[2]) / 3.0;

      let dx = f2 - f1,
        dy = f3 - f1;

      ps[pi + PINTEN] = f1;
      ps[pi + PDX] = dx / df;
      ps[pi + PDY] = dy / df;
    }
  }

}

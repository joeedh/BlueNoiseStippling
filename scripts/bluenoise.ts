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

  colordiffuse(): void {
    let ps = this.points;
    let tree = this.calc_kdtree();
    let size = this.gridsize;

    let pi1: number,
      x1: number,
      y1: number,
      color1: number,
      gen1: number,
      r1: number;

    let errors = new Float64Array((4 * ps.length) / PTOT);
    let pcolors = new Float64Array((4 * ps.length) / PTOT);

    errors.fill(0, 0, errors.length);

    for (let pi = 0; pi < ps.length; pi += PTOT) {
      let x = ps[pi],
        y = ps[pi + 1];

      let i = (pi / PTOT) * 4;

      let clr = this.sampler!(x, y, size, 1.0);

      if (isNaN(clr[0]) || isNaN(clr[1]) || isNaN(clr[2])) {
        console.log("NaN in sampler!");
        clr[0] = clr[1] = clr[2] = clr[3] = 1.0;
      }

      if (clr[0] < 0) {
        //discard point?
        clr[0] = clr[1] = clr[2] = 0.0;
      }

      for (let j = 0; j < 4; j++) {
        pcolors[i + j] = clr[j];
      }
    }

    let radius = 7.0 / Math.sqrt(ps.length / PTOT + 1);

    let callback = (pi2: number) => {
      if (pi2 === pi1) return;

      let x2 = ps[pi2],
        y2 = ps[pi2 + 1],
        color2 = ps[pi2 + PID],
        r2 = ps[pi2 + PRADIUS2],
        gen2 = ps[pi2 + PLVL];
      let dx = x2 - x1,
        dy = y2 - y1;
      let dis = dx * dx + dy * dy;

      if (dis >= radius * radius) return;

      dis = Math.sqrt(dis);

      let w = 1.0 - dis / radius;

      if (isNaN(w)) {
        console.log(dis, dx, dy, x1, y1, x2, y2);
        throw new Error("nan!");
      }
      w = w * w * (3.0 - 2.0 * w);

      let i1 = (4 * pi1) / PTOT;
      let i2 = (4 * pi2) / PTOT;

      for (let j = 0; j < 3; j++) {
        if (isNaN(errors[i1 + j])) {
          console.log(errors, i1, j);
          throw new Error("NaN!");
        }

        if (isNaN(w) || isNaN(errors[i1 + j])) {
          console.log(errors, i1, j, w);
          throw new Error("NaN again!");
        }

        pcolors[i2 + j] += -errors[i1 + j] * w;
      }
    };

    for (pi1 = 0; pi1 < ps.length; pi1 += PTOT) {
      (x1 = ps[pi1]),
        (y1 = ps[pi1 + 1]),
        (color1 = ps[pi1 + PID]),
        (r1 = ps[pi1 + PRADIUS2]),
        (gen1 = ps[pi1 + PLVL]);

      let i = (pi1 / PTOT) * 4;
      let color = colors.colors[color1];

      for (let j = 0; j < 3; j++) {
        if (isNaN(color[j])) {
          console.log(color, color1);
          throw new Error("nan!");
        }

        if (isNaN(pcolors[i + j])) {
          console.log(pcolors, i, j);
          throw new Error("nan!!");
        }

        errors[i + j] = pcolors[i + j] - color[j];
      }

      tree.forEachPoint(x1, y1, radius, callback);
    }

    let clr = [0, 0, 0, 1];

    for (pi1 = 0; pi1 < ps.length; pi1 += PTOT) {
      let i = (pi1 / PTOT) * 4;

      for (let j = 0; j < 4; j++) {
        clr[j] = pcolors[i + j];
      }

      let ci = colors.closest_color_fast(clr);
      ps[pi1 + PID] = ci;
    }

    console.log("done");
  }

  step(custom_steps?: number, skip_points_display?: boolean): void {
    stepImpl(this, custom_steps, skip_points_display);
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

  relax2(): void {
    let size = this.dimen;
    let ps = this.points;

    let minrad = 2.5 / (Math.sqrt(2) * this.dimen);
    let maxrad = minrad * 6;

    let sumdx = 0,
      sumdy = 0,
      sumw = 0,
      x1 = 0,
      y1 = 0,
      r1 = 0,
      pi1 = 0,
      searchr = 0;
    let tree = this.calc_kdtree();

    let anis_w1 = config.ANIS_W1,
      anis_w2 = config.ANIS_W2;
    /*
    let asum = (anis_w1+anis_w2);

    if (asum !== 0) {
      anis_w1 /= asum;
      anis_w2 /= asum;
    }
    //*/

    let p = [0, 0, 0];
    const searchfac = config.ANISOTROPY
      ? config.ANISOTROPY_FILTERWID
      : config.FILTERWID;
    const sqrt3 = Math.sqrt(3.0);

    maxrad = this.calc_radii();

    let isize = _appstate.image.width;

    //calculate image gradients
    this.calc_derivatives();

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

        /*
         on factor;
         off period;

         comment: taken from anisotropic blue noise paper(s);
         metric := mat((a1, a2), (b1, b2));
         dmat := mat((x1-x2), (y1-y2));

         ff := (tp dmat) * metric * dmat;
         ff := part(ff, 1, 0);

         comment: taken from anisotropic blue noise paper(s);
         fx := fx;
         fy := fy;
         fi := i(fx, fy);

         comment
         1       0     dx
         0       1     dy
         1/dx  1/dy    1
         ;

         metric := mat((1, 0, dx), (0, 1, dy), (1/dx, 1/dy, 1))*density;
         dmat := mat((x1-x2), (y1-y2), (i1-i2));

         ff := (tp dmat) * metric * dmat;
         ff := part(ff, 1, 0);
        */

        /*
        let dot2 = (dx1*(x2-x1)) + (dy1*(y2-y1));

        if (dot2 < 0) {
          dx1 = -dx1;
          dy1 = -dy1;
        }

        let dot = dx1*dx2 + dy1*dy2;

        if (dot < 0) {
          dx2 = -dx2;
          dy2 = -dy2;
        }
        //*/

        /*
        let a1 = dx1, a2 = dy1, b1 = dx2, b2 = dy2;

        dis = a1*x1**2-2.0*a1*x1*x2+a1*x2**2+a2*x1*y1-a2*x1*y2-a2*x2*y1+a2
              *x2*y2+b1*x1*y1-b1*x1*y2-b1*x2*y1+b1*x2*y2+b2*y1**2-2.0*b2*y1*
              y2+b2*y2**2;
       //*/

        /*
        let i1 = ps[pi1+PINTEN], i2 = ps[pi2+PINTEN];
        dx = dx1, dy = dy1;

        dx = dx !== 0 ? 1.0 / dx : 0;
        dy = dy !== 0 ? 1.0 / dy : 0;
        let density = 1.0 - i1;

        if (dx*dy === 0) {
          dis = 0;
        } else {
          //dis=(dx**2*dy*i1*x1-dx**2*dy*i1*x2-dx**2*dy*i2*x1+dx**2*dy*i2*
          //     x2+dx*dy**2*i1*y1-dx*dy**2*i1*y2-dx*dy**2*i2*y1+dx*dy**2*i2*y2
          //     +dx*dy*i1**2-2.0*dx*dy*i1*i2+dx*dy*i2**2+dx*dy*x1**2-2.0*dx*dy
          //     *x1*x2+dx*dy*x2**2+dx*dy*y1**2-2.0*dx*dy*y1*y2+dx*dy*y2**2+dx*
          //     i1*y1-dx*i1*y2-dx*i2*y1+dx*i2*y2+dy*i1*x1-dy*i1*x2-dy*i2*x1+dy
          //     *i2*x2)/(dx*dy);


          dis=(density*(dx**2*dy*i1*x1-dx**2*dy*i1*x2-dx**2*dy*i2*x1+dx**
               2*dy*i2*x2+dx*dy**2*i1*y1-dx*dy**2*i1*y2-dx*dy**2*i2*y1+dx*dy
               **2*i2*y2+dx*dy*i1**2-2.0*dx*dy*i1*i2+dx*dy*i2**2+dx*dy*x1**2-
               2.0*dx*dy*x1*x2+dx*dy*x2**2+dx*dy*y1**2-2.0*dx*dy*y1*y2+dx*dy*
               y2**2+dx*i1*y1-dx*i1*y2-dx*i2*y1+dx*i2*y2+dy*i1*x1-dy*i1*x2-dy
               *i2*x1+dy*i2*x2))/(dx*dy);
         }

         //return dis*0.0025*(1.0-i1*i1); //Math.max(dis * (0.25 + dis2), 0.0); //ps[pi1+PRADIUS2];// + 0.35*(2.0-tdis)*ps[pi1+PRADIUS2];
         //*/

        (dx = x2 - x1), (dy = y2 - y1);

        dx1 = Math.sin(
          ps[pi1 + PTH] + (config.STICK_ROT / 180.0) * Math.PI + Math.PI * 0.5,
        );
        dy1 = Math.cos(
          ps[pi1 + PTH] + (config.STICK_ROT / 180.0) * Math.PI + Math.PI * 0.5,
        );

        dis = Math.abs(dx * dy1 - dy * dx1);

        let dis2 = Math.sqrt(dx * dx + dy * dy);

        //let t = dx*dx1 + dy*dy1;
        //if (t > 0 && t < dis2)
        //  return Math.min(dis, dis2)*anis_w1;
        //return dis2*anis_w1;

        //dis = Math.sqrt(dis);
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

      //let dis = dx*dx + dy*dy;

      let dis = distmetric(pi1, pi2);

      if (dis === 0.0 || dis > searchr) {
        return;
      }

      let w = 1.0 - dis / searchr;

      if (config.USE_SPH_CURVE && config.SPH_CURVE !== undefined) {
        w = config.SPH_CURVE.evaluate(w);
      } else {
        //guassian curve with std deviation of 0.37 to be a bit sharpening

        //let r = this.height * Math.exp(-((s-this.offset)*(s-this.offset)) / (2*this.deviation*this.deviation));
        w = Math.exp(-((w - 1.0) ** 2) / (2 * 0.37 ** 2));
        //w = Math.pow(w, ANISOTROPY ? 6.0 : 4.0);
        //w = w*w*(3.0 - 2.0*w);
      }

      //*
      //go a bit above top radius to avoid gaps from not having the perfect number of points
      //let r3 = Math.max(r1, r2)*2.0;//*1.5;
      let r3 = r1 + r2;

      //r3 = 0.5*(r1 + r2);

      dx *= (r3 - dis) / dis;
      dy *= (r3 - dis) / dis;
      //*/

      /*
      dx /= dis;
      dy /= dis;

      dis = Math.max(r1, r2)*4.0 - dis; //go a bit above r*2.0 to avoid gaps from not having the perfect number of points
      dx *= dis;
      dy *= dis;

      //w *= r2
      //*/

      /*
      let rf = r2/maxrad;
      rf = rf*rf*(3.0-2.0*rf);

      w *= rf*rf;
      //*/

      //if (ANISOTROPY) {
      //dx += -ps[pi2+PDY]*1.5*w;
      //dy += ps[pi2+PDX]*1.5*w;
      //}

      sumdx += -dx * w;
      sumdy += -dy * w;
      sumw += w;
    };

    console.log("relaxing (sph). . .");
    for (pi1 = 0; pi1 < ps.length; pi1 += PTOT) {
      (x1 = ps[pi1]), (y1 = ps[pi1 + 1]), (r1 = ps[pi1 + PRADIUS2]);

      //r1 = minrad*0.5;
      searchr = r1 * searchfac;
      sumdx = sumdy = sumw = 0.0;

      //tree.forEachPoint(x1, y1, searchr, callback, this);
      (p[0] = x1), (p[1] = y1);

      /*
      for (let pi2=0; pi2<ps.length; pi2 += PTOT) {
        callback(pi2);
      }
      //*/

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
        this.calc_theta(pi1);
      }
    }

    if (config.TRI_MODE) {
      console.log("regenerating triangulation...");
      this.del();
    }

    this.calc_radii();
    console.log("done");
  }

  sample_radii(): void {
    let ps = this.points;
    let minrad = 2.5 / (Math.sqrt(2) * this.dimen);
    //most masks have maximum radius
    //between 6 and 9.5 times minimum radius

    let maxrad = minrad * 6.0;

    for (let i = 0; i < ps.length; i += PTOT) {
      //ps[i+PRADIUS2] *= 1.0;
      //*
      let clr = this.sampler!(ps[i], ps[i + 1], this.gridsize, 1.0);

      if (clr[0] < 0) {
        //sampler requested we discard the point
        continue;
      }

      let f = this.calcIntensity(clr[0], clr[1], clr[2]);
      //let f = clr[0]*clr[0] + clr[1]*clr[1] + clr[2]*clr[2];
      //f = f !== 0.0 ? Math.sqrt(f) / Math.sqrt(3) : 0.0;

      let sat =
        Math.abs(1.0 - clr[0]) +
        Math.abs(1.0 - clr[1]) +
        Math.abs(1.0 - clr[2]);
      sat /= 3.0;

      if (config.ADAPTIVE_COLOR_DENSITY) {
        //scale spacing of points by saturation (how much color there is)
        f *= Math.pow(1.0 - sat, 2);
        //f = f*f;
      }

      f = Math.pow(f, 0.25);
      //t += (t*t - t)*t;

      let r = minrad + (maxrad - minrad) * f;
      //r = minrad;
      ps[i + PRADIUS2] = r;

      //ps[i+PRADIUS2] *= (2.0 - Math.pow(t, 0.1))*2.5*this.dimen/size;
      //ps[i+PRADIUS2] = 7.0/size;
      //*/
    }
  }

  relax3(): void {
    this.sample_radii();
    console.log("relaxing");

    let GN = 0,
      GDX = 1,
      GDY = 2,
      GSUM = 3,
      GNUM = 4,
      GW = 5,
      GTOT = 6;
    let size = this.dimen * 2;

    let grid = new Float64Array(size * size * GTOT);

    function reset_grid() {
      grid.fill(0, 0, grid.length);
    }

    reset_grid();

    let ps = this.points;
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
            //w = w*w*(3.0 - 2.0*w);

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

        /*
        if (grid[idx+GSUM] === 0.0)
          continue;
        if (grid[idx2+GSUM] === 0.0)
          continue;
        if (grid[idx3+GSUM] === 0.0)
          continue;
        //*/

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
        throw new Error("NaN!");
      }

      if (grid[idx + GSUM] === 0.0) {
        continue;
      }

      /*
      console.log(grid[idx+GSUM]);
      console.log(grid[idx+GDX]);
      console.log(grid[idx+GDY]);
      console.log("\n");
      //*/

      ps[pi] += (fac * grid[idx + GDX]) / grid[idx + GSUM];
      ps[pi + 1] += (fac * grid[idx + GDY]) / grid[idx + GSUM];

      ps[pi] = Math.min(Math.max(ps[pi], -0.9999), 0.99999);
      ps[pi + 1] = Math.min(Math.max(ps[pi + 1], -0.9999), 0.9999);
    }

    if (config.TRI_MODE) {
      console.log("regenerating triangulation...");
      this.del();
    }
  }

  relax(): void {
    this.relax2();
    //this.relax3();
    return;
    //return;

    //console.log("updating radii");
    //this.calc_radii(false);

    console.log("relaxing");

    let GW = 0,
      GDX = 1,
      GDY = 2,
      GSUM = 3,
      GTOT = 4;
    let size = this.dimen * 2;

    let grid = new Float64Array(size * size * GTOT);

    function reset_grid() {
      grid.fill(0, 0, grid.length);
    }

    reset_grid();

    let ps = this.points;

    let minrad = 2.5 / (Math.sqrt(2) * this.dimen);
    //most masks have maximum radius
    //between 6 and 9.5 times minimum radius

    let maxrad = minrad * 6.0;
    let rd = ~~(minrad * size + 5);

    for (let i = 0; i < ps.length; i += PTOT) {
      ps[i + PDX] = ps[i] - ps[i + POLDX];
      ps[i + PDY] = ps[i + 1] - ps[i + POLDY];

      let fac = 0.99;
      ps[i] += ps[i + PDX] * fac;
      ps[i + 1] += ps[i + PDY] * fac;

      ps[i + POLDX] = ps[i];
      ps[i + POLDY] = ps[i + 1];
    }

    for (let i = 0; i < ps.length; i += PTOT) {
      //ps[i+PRADIUS2] *= 1.0;
      //*
      let clr = this.sampler!(ps[i], ps[i + 1], this.gridsize, 1.0);

      if (clr[0] < 0) {
        //sampler requested we discard the point
        continue;
      }

      let f = this.calcIntensity(clr[0], clr[1], clr[2]);
      //let f = clr[0]*clr[0] + clr[1]*clr[1] + clr[2]*clr[2];
      //f = f !== 0.0 ? Math.sqrt(f) / Math.sqrt(3) : 0.0;

      let sat =
        Math.abs(1.0 - clr[0]) +
        Math.abs(1.0 - clr[1]) +
        Math.abs(1.0 - clr[2]);
      sat /= 3.0;

      if (config.ADAPTIVE_COLOR_DENSITY) {
        //scale spacing of points by saturation (how much color there is)
        f *= Math.pow(1.0 - sat, 2);
        //f = f*f;
      }

      f = Math.pow(f, 0.25);
      //t += (t*t - t)*t;

      let r = minrad + (maxrad - minrad) * f;
      //r = minrad;
      ps[i + PRADIUS2] = r;

      //ps[i+PRADIUS2] *= (2.0 - Math.pow(t, 0.1))*2.5*this.dimen/size;
      //ps[i+PRADIUS2] = 7.0/size;
      //*/
    }

    let offs = cconst.get_searchoff(rd);
    for (let i = 0; i < ps.length; i += PTOT) {
      let x = ps[i],
        y = ps[i + 1];

      let ix = (x * 0.5 + 0.5) * size + 0.0001;
      let iy = (y * 0.5 + 0.5) * size + 0.0001;

      for (let j = 0; j < offs.length; j++) {
        let ix2 = ~~(ix + offs[j][0]);
        let iy2 = ~~(iy + offs[j][1]);

        if (ix2 < 0 || iy2 < 0 || ix2 >= size || iy2 >= size) continue;

        let x2 = (ix + offs[j][0] + 0.5) / size;
        let y2 = (iy + offs[j][1] + 0.5) / size;
        let dx = offs[j][0] / size,
          dy = offs[j][1] / size;

        let dis = dx * dx + dy * dy;
        dis = dis !== 0.0 ? Math.sqrt(dis) : 0.0;

        if (dis > maxrad) continue;

        let w = 1.0 - dis / maxrad;

        let s = 1.0;
        w = cconst.bez4(0, 0.5, 0.5, 1.0, w);
        w = Math.pow(w, 4.5);

        let idx = (iy2 * size + ix2) * GTOT;

        //if (Math.random() > 0.993) {
        //console.log(w);
        //}

        //let dis2 = dis - ps[i+PRADIUS2];
        //dis2 *= 0.1;
        if (window._d === undefined) window._d = 0.7;

        let dis2 = dis - ps[i + PRADIUS2] * window._d;
        //dis2 = -dis2;

        if (dis !== 0.0) {
          dx /= dis;
          dy /= dis;
        }

        grid[idx + GW] += w;
        grid[idx + GDX] += dx * dis2 * w;
        grid[idx + GDY] += dy * dis2 * w;
        grid[idx + GSUM] += w;
      }
    }

    for (let i = 0; i < ps.length; i += PTOT) {
      let x = ps[i],
        y = ps[i + 1];

      let ix = ~~((x * 0.5 + 0.5) * size + 0.0001);
      let iy = ~~((y * 0.5 + 0.5) * size + 0.0001);

      let idx = (iy * size + ix) * GTOT;

      if (grid[idx] === 0 || grid[idx + GSUM] === 0) continue;

      let w = grid[idx + GW] / grid[idx + GSUM];
      let sum = grid[idx + GSUM];

      let dx = grid[idx + GDX] / sum;
      let dy = grid[idx + GDY] / sum;

      /*
      let dis = dx*dx + dy*dy;
      if (dis === 0.0) continue;

      dx /= dis;
      dy /= dis;

      dis = Math.min(dis, 20.0/DIMEN);

      dx *= dis;
      dy *= dis;
      //*/

      x += -dx * 0.62 * config.RELAX_SPEED;
      y += -dy * 0.62 * config.RELAX_SPEED;

      x = Math.min(Math.max(x, -1), 1);
      y = Math.min(Math.max(y, -1), 1);

      //pull towards original starting positions
      dx = ps[i + POX] - x;
      dy = ps[i + POY] - y;

      ps[i] = x; // + dx*0.15;
      ps[i + 1] = y; // + dy*0.15;

      if (Math.random() > 0.99) {
        //  console.log("w", grid[idx], "dx", grid[idx+1], "dy", grid[idx+2]);
      }
    }

    if (config.TRI_MODE) {
      console.log("regenerating triangulation...");
      this.del();
    }

    this.calc_kdtree();
    console.log("done relaxing");
  }
}

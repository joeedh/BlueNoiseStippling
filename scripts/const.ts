//argh! I hate doing this! but necassary!
//core data 'structures' are actually embedded in typed arrays. . . ger

//points

//pox/poy are original positions at time of creation
//poldx/poldy are used by relax() to calculate velocity

import "./mask_file.js";
import * as util from "./util.js";

// Immutable typed-array field offsets ("point" record layout). These used to be
// broadcast onto window; they are now named exports imported where needed.
export const PX = 0,
  PY = 1,
  PRADIUS = 2,
  PINTEN = 3,
  PID = 4,
  PLVL = 5,
  POX = 6,
  POY = 7,
  PDX = 8,
  PDY = 9,
  POLDX = 10,
  POLDY = 11,
  PBAD = 12,
  PRADIUS2 = 13,
  PTH = 14,
  PTOT = 15;

export const APP_VERSION = 0.6;

export const RASTER_MODES = {
  DIFFUSION: 0,
  PATTERN: 1,
  CMYK: 2,
};

// A 2D offset pair [x, y] used by the search-offset / spot-function caches.
type Offset = [number, number];

// Minimal structural type for the curve objects assigned into `config` elsewhere
// (e.g. appstate.ts). The full `Curve` class lives in ui.ts, but importing it
// here would create a circular dependency with this foundational module, so we
// describe only the surface consumers actually use: `evaluate(t)`.
interface Curve {
  evaluate(t: number): number;
}

// The live, mutable runtime config singleton (replaces the old window globals).
interface Config {
  DIMEN: number;

  HIGH_QUALITY_RASTER: boolean;

  ANISOTROPY: boolean;
  ANIS_W1: number;
  ANIS_W2: number;
  HIST_EQUALIZE: boolean;
  DEBAND_IMAGE: boolean;
  DEBAND_RADIUS: number;
  DEBAND_BLEND: number;
  DRAW_STICKS: boolean;
  FANCY_STICKS: boolean;
  STICK_ARROWS: boolean;
  STICK_ROT: number;
  STICK_WIDTH: number;
  STICK_LENGTH: number;
  FILTERWID: number;
  ANISOTROPY_FILTERWID: number;
  RELAX_UPDATE_VECTORS: boolean;

  SHOW_RAW_IMAGE: boolean;
  SHOW_IMAGE: boolean;
  SHOW_DVIMAGE: boolean;

  SPECIAL_OFFSETS: boolean;
  XLARGE_MASK: boolean;
  SMALL_MASK: boolean;
  SCALE_POINTS: boolean;
  SHOW_KDTREE: boolean;

  DRAW_RMUL: number;
  BLACK_BG: boolean;

  SCALE: number;
  PANX: number;
  PANY: number;
  ACCUM_ALPHA: number;
  MAKE_NOISE: boolean;
  RELAX_SPEED: number;

  SHARPNESS: number;
  SHARPEN_LUMINENCE: boolean;
  SHARPEN: boolean;

  USE_LAB: boolean;
  RASTER_IMAGE: boolean;

  USE_MERSENNE: boolean;
  TRI_MODE: boolean;

  MAX_VCELL_SIZE: number;
  RASTER_MODE: number;
  USE_CMYK_MASK: boolean;

  USE_SPH_CURVE: boolean;
  // Curve fields: default to undefined, populated with Curve objects elsewhere.
  SPH_CURVE: Curve | undefined;
  TONE_CURVE: Curve | undefined;
  DENSITY_CURVE: Curve | undefined;
  LOW_RES_CUBE: boolean;
  GRID_MODE: boolean;
  DRAW_TRANSPARENT: boolean;
  STEPS: number;
  RAND_FAC: number;
  DITHER_RAND_FAC: number;
  DITHER_BLUE: boolean;
  DITHER_BLUE_STEPS: number;

  BG_PALETTE: boolean;
  SIMPLE_PALETTE: boolean;
  ALLOW_PURPLE: boolean;
  ALLOW_GREY: boolean;
  CORRECT_FOR_SPACING: boolean;

  HEXAGON_MODE: boolean;
  ADAPTIVE_COLOR_DENSITY: boolean;

  NO_IMAGE_FILTER: boolean;

  RENDERED_IMAGE_SIZE: number;

  DITHER_COLORS: boolean;
  PAL_COLORS: number;
  SHOW_COLORS: boolean;
  IMAGE_PALETTE: boolean;
  COLOR_SPACE: number;
}

// Shape of the default-export `cconst` helper object. Properties are assigned
// incrementally below, so the variable is typed and seeded with an empty object.
interface CConst {
  defaultConfig: Config;
  DefaultCurves: {
    TONE_CURVE: Curve | undefined;
    DENSITY_CURVE: Curve | undefined;
  };
  toJSON(): Partial<Record<keyof Config, Config[keyof Config]>>;
  loadJSON(json: Record<string, unknown>): CConst;
  // Keyed by "<n>,<inten>"; the legacy code also probes/sets `.length`
  // (always undefined at runtime, so that branch is inert -- preserved as-is).
  _spotfuncs: Record<string, Offset[]> & { length?: number };
  bez4(a: number, b: number, c: number, d: number, t: number): number;
  get_spotfunc(n: number, inten: number, noreport?: boolean): Offset[];
  get_searchoff(n: number, noreport?: boolean): Offset[];
  spline(...args: number[]): number;
  // Caches keyed by filter width (fwid). Initialized as sparse arrays and, for
  // sharpen_cache, reset to a plain `{}` when sharpness changes -- both honored
  // by the Record type.
  sharpen_cache: Record<number, number[]>;
  basic_cache: Record<number, number[]>;
  get_sharpen_filter(fwid: number, sharpness: number): number[];
}

// Search-offset cache, internal to this module (was window._search_offs).
let _search_offs: Offset[][] = new Array(64);
_search_offs[0] = [];

// Single justified cast: properties are assigned incrementally after creation,
// so we seed an empty object and let the assignments below populate every field.
const exports: CConst = {} as CConst;
export default exports;

exports.defaultConfig = {
  DIMEN: 235,

  HIGH_QUALITY_RASTER: false,

  ANISOTROPY: false,
  ANIS_W1: 0.6,
  ANIS_W2: 0.6,
  HIST_EQUALIZE: true,
  DEBAND_IMAGE: true,
  DEBAND_RADIUS: 15,
  DEBAND_BLEND: 1,
  DRAW_STICKS: false,
  FANCY_STICKS: false,
  STICK_ARROWS: false,
  STICK_ROT: 0.0,
  STICK_WIDTH: 2,
  STICK_LENGTH: 2.0,
  FILTERWID: 3.0,
  ANISOTROPY_FILTERWID: 2.0,
  RELAX_UPDATE_VECTORS: false,

  SHOW_RAW_IMAGE: false,
  SHOW_IMAGE: false,
  SHOW_DVIMAGE: false,

  SPECIAL_OFFSETS: true, //use encoded lower-level offsets, multiplied by intensity
  XLARGE_MASK: false,
  SMALL_MASK: false,
  SCALE_POINTS: false,
  SHOW_KDTREE: false,

  DRAW_RMUL: 1.3,
  BLACK_BG: false,

  SCALE: 1.0,
  PANX: 0.0,
  PANY: 0.0,
  ACCUM_ALPHA: 0.3,
  MAKE_NOISE: false,
  RELAX_SPEED: 1.0,

  SHARPNESS: 0.5,
  SHARPEN_LUMINENCE: true,
  SHARPEN: true,

  USE_LAB: true,
  RASTER_IMAGE: false,

  USE_MERSENNE: false,
  TRI_MODE: false,

  //used to allocate voronoi diagram
  MAX_VCELL_SIZE: 32,
  RASTER_MODE: RASTER_MODES.CMYK,
  USE_CMYK_MASK: false,

  USE_SPH_CURVE: false,
  SPH_CURVE: undefined,
  TONE_CURVE: undefined,
  DENSITY_CURVE: undefined,
  LOW_RES_CUBE: true,
  GRID_MODE: false,
  DRAW_TRANSPARENT: false,
  STEPS: 5000,
  RAND_FAC: 0.0,
  DITHER_RAND_FAC: 0.0,
  DITHER_BLUE: true,
  DITHER_BLUE_STEPS: 6,

  BG_PALETTE: false,
  SIMPLE_PALETTE: false,
  ALLOW_PURPLE: true,
  ALLOW_GREY: false,
  CORRECT_FOR_SPACING: false,

  HEXAGON_MODE: false,
  ADAPTIVE_COLOR_DENSITY: true,

  NO_IMAGE_FILTER: false,

  RENDERED_IMAGE_SIZE: 1024,

  DITHER_COLORS: true,
  PAL_COLORS: 8,
  SHOW_COLORS: true,
  IMAGE_PALETTE: false,
  COLOR_SPACE: 0, //XYZ
};

exports.DefaultCurves = {
  TONE_CURVE: undefined,
  DENSITY_CURVE: undefined,
};

exports.toJSON = function () {
  let ret: Partial<Record<keyof Config, Config[keyof Config]>> = {};

  for (let k in exports.defaultConfig) {
    let key = k as keyof Config;
    ret[key] = config[key];
  }

  return ret;
};

exports.loadJSON = function (json: Record<string, unknown>) {
  let writable = config as unknown as Record<string, unknown>;
  for (let k in json) {
    // loadJSON loads arbitrary serialized config (values are `unknown`); copy
    // each key through the writable view of config.
    writable[k] = json[k];
  }

  return exports;
};

let defaults = {
  COLOR_SPACE: 0,
  SHOW_RAW_IMAGE: false,
  DIMEN: 550,
  IMAGE_PALETTE: false,
  ANISOTROPY: true,
  ANIS_W1: 0.7,
  ANIS_W2: 0.9,
  DEBAND_IMAGE: false,
  DRAW_STICKS: true,
  STICK_ROT: 0.0,
  STICK_WIDTH: 3.5,
  STICK_LENGTH: 1.5,
  FILTERWID: 2,
  DEBAND_RADIUS: 5,
  DEBAND_BLEND: 1.0,
  ANISOTROPY_FILTERWID: 2.0,
  RELAX_UPDATE_VECTORS: false,
  SHOW_IMAGE: false,
  SHOW_DVIMAGE: false,
  SPECIAL_OFFSETS: true,
  XLARGE_MASK: false,
  SMALL_MASK: false,
  SCALE_POINTS: false,
  SHOW_KDTREE: false,
  DRAW_RMUL: 1.5,
  BLACK_BG: false,
  SCALE: 2,
  PANX: 0.22,
  PANY: 0.23,
  ACCUM_ALPHA: 0.3,
  MAKE_NOISE: false,
  RELAX_SPEED: 5.4030000000000005,
  SHARPNESS: 0.1,
  SHARPEN_LUMINENCE: false,
  SHARPEN: false,
  USE_LAB: false,
  RASTER_IMAGE: false,
  USE_MERSENNE: false,
  TRI_MODE: false,
  MAX_VCELL_SIZE: 32,
  RASTER_MODE: 0,
  TONE_CURVE: {
    is_new_curve: true,
    setting_id: "ui2_bn6_More Options_General_Tone CurveTONE_CURVE",
    generators: [
      {
        type: 1,
        points: [
          { "0": 0, "1": 0, eid: 24, flag: 0, deg: 3, tangent: 1 },
          {
            "0": 0.29374999999999996,
            "1": 0,
            eid: 176,
            flag: 0,
            deg: 3,
            tangent: 1,
          },
          { "0": 0.80625, "1": 1, eid: 180, flag: 1, deg: 3, tangent: 1 },
          { "0": 1, "1": 1, eid: 41, flag: 0, deg: 3, tangent: 1 },
        ],
        deg: 6,
        eidgen: { _cur: 181 },
      },
      { type: 2, equation: "x" },
      { type: 4, height: 1, offset: 1, deviation: 0.3 },
    ],
    version: 0.5,
    active_generator: 0,
  },
  LOW_RES_CUBE: true,
  GRID_MODE: false,
  DRAW_TRANSPARENT: false,
  STEPS: 4498,
  RAND_FAC: 0,
  DITHER_RAND_FAC: 0.5,
  DITHER_BLUE: true,
  DITHER_BLUE_STEPS: 14,
  BG_PALETTE: false,
  SIMPLE_PALETTE: false,
  ALLOW_PURPLE: true,
  CORRECT_FOR_SPACING: false,
  HEXAGON_MODE: false,
  ADAPTIVE_COLOR_DENSITY: true,
  NO_IMAGE_FILTER: false,
  RENDERED_IMAGE_SIZE: 2048,
  DITHER_COLORS: true,
  PAL_COLORS: 4,
  SHOW_COLORS: true,
};

// The live, mutable runtime config singleton (replaces the old window globals).
// Imported by reference everywhere, so a loadJSON() mutation is immediately
// visible to all readers.
export const config: Config = { ...exports.defaultConfig };

// Preserve the original startup init order exactly: apply `defaults`, then
// re-copy `defaultConfig` on top (which clobbers the `defaults` overrides for
// every shared key -- so the net effective startup config is `defaultConfig`).
exports.loadJSON(defaults);
for (let k in exports.defaultConfig) {
  let key = k as keyof Config;
  (config as Record<keyof Config, Config[keyof Config]>)[key] =
    exports.defaultConfig[key];
}

// Replace Math.random with the optional mersenne generator, gated on config.
Math._random = Math.random;
Math.random = function () {
  if (config.USE_MERSENNE) {
    return util.random();
  } else {
    return Math._random();
  }
};

let _spotfuncs: CConst["_spotfuncs"] = (exports._spotfuncs = {});

let bez4 = (exports.bez4 = function bez4(
  a: number,
  b: number,
  c: number,
  d: number,
  t: number,
) {
  let r1 = a + (b - a) * t;
  let r2 = b + (c - b) * t;
  let r3 = c + (d - c) * t;

  let r4 = r1 + (r2 - r1) * t;
  let r5 = r2 + (r3 - r2) * t;

  return r4 + (r5 - r4) * t;
});

let get_spotfunc = (exports.get_spotfunc = function get_spotfunc(
  n: number,
  inten: number,
  noreport?: boolean,
) {
  let r = n,
    i = n;

  // Legacy array-style probe: at runtime `_spotfuncs.length` is undefined, so
  // `undefined <= n` is false and this branch never runs. The `as number` cast
  // keeps that exact behavior while satisfying the type checker.
  if ((_spotfuncs.length as number) <= n) {
    _spotfuncs.length = n + 1;
  }

  let key = n + "," + inten.toFixed(2);

  if (_spotfuncs[key] !== undefined) {
    return _spotfuncs[key];
  }

  if (!noreport) console.trace("generate search a off of radius", n, "...");

  let lst: Offset[] = [];
  for (let x = -i; x <= i; x++) {
    for (let y = -i; y <= i; y++) {
      let x2 = x < 0 ? x + 0 : x;
      let y2 = y < 0 ? y + 0 : y;

      let dis = x2 * x2 + y2 * y2;
      dis = dis !== 0.0 ? Math.sqrt(dis) : 0.0;

      //*
      let sqrdis = Math.max(Math.abs(x2), Math.abs(y2)) * Math.sqrt(2.0);

      //let f = 1.0-Math.sqrt(0.0001+inten);

      //f = 1.0-Math.abs(f-0.5)*2.0;
      //f *= f;

      let f = inten;
      f = f < 0.4 ? 1 : 0;

      if (n > 1) {
        dis = dis * (1.0 - f) + sqrdis * f;
      }

      //dis = sqrdis;
      //*/

      if (dis > r + 0.0001) {
        continue;
      }

      lst.push([x, y]);
    }
  }

  //sort by distance
  lst.sort(function (a, b) {
    return a[0] * a[0] + a[1] * a[1] - b[0] * b[0] - b[1] * b[1];
  });

  _spotfuncs[key] = lst;

  return lst;
});

let get_searchoff = (exports.get_searchoff = function get_searchoff(
  n: number,
  noreport?: boolean,
) {
  let r = n,
    i = n;

  if (_search_offs.length <= n) {
    _search_offs.length = n + 1;
  }

  if (_search_offs[n] !== undefined) {
    return _search_offs[n];
  }

  if (!noreport) console.trace("generate search a off of radius", n, "...");

  let lst: Offset[] = [];
  for (let x = -i; x <= i; x++) {
    for (let y = -i; y <= i; y++) {
      //why did I write these next two lines again?
      //let x2 = x < 0 ? x+1 : x;
      //let y2 = y < 0 ? y+1 : y;
      let x2 = x,
        y2 = y;

      let dis = x2 * x2 + y2 * y2;
      //dis = dis !== 0.0 ? Math.sqrt(dis) : 0.0;

      //console.log(dis.toFixed(3), r.toFixed(3));

      if (dis > r * r) {
        continue;
      }

      lst.push([x, y]);
    }
  }

  //sort by distance
  lst.sort(function (a, b) {
    return a[0] * a[0] + a[1] * a[1] - b[0] * b[0] - b[1] * b[1];
  });

  _search_offs[n] = lst;

  return lst;
});

for (let i = 0; i < 32; i++) {
  get_searchoff(i, true);
}

let spline = (exports.spline = function spline() {
  let t = arguments[arguments.length - 1];

  for (let i = arguments.length - 3; i >= 0; i -= 2) {
    if (t >= arguments[i]) {
      let ta = arguments[i];
      let tb = arguments[i < arguments.length - 3 ? i + 2 : i];

      let a = arguments[i + 1];
      let b = arguments[i < arguments.length - 3 ? i + 3 : i + 1];

      t -= ta;
      if (tb !== ta) t /= tb - ta;

      return a + (b - a) * t;
    }
  }

  return 0.0;
});

exports.sharpen_cache = new Array(256);

let last_sharpness = -1;
exports.basic_cache = new Array(256);

exports.get_sharpen_filter = function get_sharpen_filter(
  fwid: number,
  sharpness: number,
) {
  if (!config.SHARPEN) {
    if (exports.basic_cache[fwid] !== undefined) {
      return exports.basic_cache[fwid];
    }

    let ret = [];
    let totw = 0.0;

    for (let i = 0; i < fwid * fwid; i++) {
      let fwid2 = fwid - 1;

      let xoff = (i % fwid) / fwid2;
      let yoff = ~~(i / fwid) / fwid2;

      xoff -= 0.5;
      yoff -= 0.5;

      let w = xoff * xoff + yoff * yoff;

      w = w === 0.0 ? 0.0 : Math.sqrt(w);
      w = 1.0 - w / Math.sqrt(2.0);
      w = Math.pow(w, 3.0);

      totw += w;
      ret.push(w);
    }

    totw = 1.0 / totw;

    for (let i = 0; i < ret.length; i++) {
      ret[i] *= totw;
    }

    exports.basic_cache[fwid] = ret;
    return ret;
  }

  if (last_sharpness !== sharpness) {
    last_sharpness = sharpness;
    exports.sharpen_cache = {};
  }

  if (exports.sharpen_cache[fwid] !== undefined) {
    return exports.sharpen_cache[fwid];
  }

  function bez4(a: number, b: number, c: number, d: number, t: number) {
    let r1 = a + (b - a) * t;
    let r2 = b + (c - b) * t;
    let r3 = c + (d - c) * t;

    let r4 = r1 + (r2 - r1) * t;
    let r5 = r2 + (r3 - r2) * t;

    return r4 + (r5 - r4) * t;
  }

  let ret = [];
  let totsample = fwid * fwid;
  for (let i = 0; i < totsample; i++) {
    if (0 && totsample === 9) {
      let d = 2;

      ret = [-d, -d, -d, -d, 22, -d, -d, -d, -d];
      let tot = 0;

      for (let j = 0; j < totsample; j++) {
        tot += ret[j];
      }

      for (let j = 0; j < totsample; j++) {
        ret[j] /= tot;
      }

      break;
    }

    let fwid2 = fwid - 1;
    let xoff = (i % fwid) / fwid2;
    let yoff = ~~(i / fwid) / fwid2;

    xoff -= 0.5;
    yoff -= 0.5;

    let w = xoff * xoff + yoff * yoff;

    w = w === 0.0 ? 0.0 : Math.sqrt(w);
    w = 1.0 - (2.0 * w) / Math.sqrt(2.0);

    /*
    w = spline(
      0,0,
      0.3, -0.3,
      1.0, 1.3,
      w
    );
    //*/

    let fac = 1.3;

    let s = sharpness;

    w = bez4(0, -0.75 - s * 2, (0.95 + s * 2) * fac, 1.0, w);

    ret.push(w);
  }

  exports.sharpen_cache[fwid] = ret;
  return ret;
};

// Pure curve math engine, extracted from ui.ts (which was welded to dat.gui).
//
// This module is DOM-free and GUI-free: it owns the evaluation math, the
// control-point data, and JSON (de)serialization. Rendering and pointer
// interaction live in scripts/svelte/CurveEditor.svelte, which drives these
// classes. The solver consumes a `Curve` purely through `evaluate(t)` (see the
// structural `Curve` interface in const.ts), so the public surface here keeps
// `evaluate`/`derivative`/`inverse`/`toJSON`/`loadJSON` intact.
//
// It intentionally has NO `config` import to avoid a circular dependency with
// the foundational const.ts module.

import * as util from "./util.js";
import { Vector2 } from "./vectormath.js";

let bin_cache: { [key: string]: number } = {};

let eval2_rets = util.cachering.fromConstructor(Vector2, 32);

export const CURVE_VERSION = 0.5;

export function binomial(n: number, i: number): number {
  if (i > n) {
    throw new Error("Bad call to binomial(n, i), i was > than n");
  }

  if (i === 0 || i === n) {
    return 1;
  }

  let key = "" + n + "," + i;

  if (key in bin_cache) return bin_cache[key];

  let ret: number = binomial(n - 1, i - 1) + binomial(n - 1, i);
  bin_cache[key] = ret;

  return ret;
}

export const TangentModes = {
  SMOOTH: 1,
  BREAK: 2,
};

//when in doubt I prefer to make enums bitmasks
export const CurveTypes = {
  BSPLINE: 1,
  CUSTOM: 2,
  GUASSIAN: 4,
};

export const CurveFlags = {
  SELECT: 1,
};

// Serialized form shared by all curve generators.
export interface CurveTypeJSON {
  type: number;
  [key: string]: unknown;
}

// Serialized form of a Curve.
export interface CurveJSON {
  is_new_curve?: boolean;
  setting_id: string;
  generators: CurveTypeJSON[];
  version: number;
  active_generator: number;
  type?: number;
}

type RedrawHook = () => void;
type SaveHook = () => void;

/*
  Base class for every curve generator. The widget hierarchy is:

    CurveTypeData (base: shared hooks, numeric solvers)
      ├─ BSplineCurve  (interactive b-spline with draggable control points)
      ├─ CustomCurve   (equation string evaluated via eval())
      └─ GuassianCurve (parametric gaussian)

  Each generator exposes a structural `evaluate(t:number):number` surface so it
  stays compatible with const.ts's minimal `Curve` interface.
*/
export class CurveTypeData {
  type: number;
  _redraw_hook?: RedrawHook;
  _save_hook?: SaveHook;
  // fastmode is toggled by the owning Curve during interactive transforms.
  fastmode = false;

  constructor(type: number) {
    this.type = type;
  }

  toJSON(): CurveTypeJSON {
    return {
      type: this.type,
    };
  }

  loadJSON(obj: CurveTypeJSON): this {
    this.type = obj.type;

    return this;
  }

  redraw(): void {
    if (this._redraw_hook) {
      this._redraw_hook();
    }
  }

  setRedrawHook(cb: RedrawHook): this {
    this._redraw_hook = cb;
    return this;
  }

  doSave(): void {
    if (this._save_hook) {
      this._save_hook();
    }
  }

  //sets a callback so gui code can trigger saves
  setSaveHook(cb: SaveHook): this {
    this._save_hook = cb;
    return this;
  }

  evaluate(s: number): number {
    throw new Error("implement me!");
  }

  derivative(s: number): number {
    let df = 0.0001;

    if (s > 1.0 - df * 3) {
      return (this.evaluate(s) - this.evaluate(s - df)) / df;
    } else if (s < df * 3) {
      return (this.evaluate(s + df) - this.evaluate(s)) / df;
    } else {
      return (this.evaluate(s + df) - this.evaluate(s - df)) / (2 * df);
    }
  }

  derivative2(s: number): number {
    let df = 0.0001;

    if (s > 1.0 - df * 3) {
      return (this.derivative(s) - this.derivative(s - df)) / df;
    } else if (s < df * 3) {
      return (this.derivative(s + df) - this.derivative(s)) / df;
    } else {
      return (this.derivative(s + df) - this.derivative(s - df)) / (2 * df);
    }
  }

  inverse(y: number): number {
    let steps = 9;
    let ds = 1.0 / steps,
      s = 0.0;
    let best: number | undefined = undefined;
    let ret: number | undefined = undefined;

    for (let i = 0; i < steps; i++, s += ds) {
      let s1 = s,
        s2 = s + ds;

      let mid = (s1 + s2) * 0.5;

      for (let j = 0; j < 11; j++) {
        let y1 = this.evaluate(s1);
        let y2 = this.evaluate(s2);
        mid = (s1 + s2) * 0.5;

        if (Math.abs(y1 - y) < Math.abs(y2 - y)) {
          s2 = mid;
        } else {
          s1 = mid;
        }
      }

      let ymid = this.evaluate(mid);

      if (best === undefined || Math.abs(y - ymid) < best) {
        best = Math.abs(y - ymid);
        ret = mid;
      }
    }

    return ret === undefined ? 0.0 : ret;
  }

  onActive(parent: Curve): void {}

  onInactive(parent: Curve): void {}

  reset(): this | void {}

  destroy(): void {}

  update(): void {}
}

export interface CurvePointJSON {
  0: number;
  1: number;
  eid: number;
  flag: number;
  deg: number;
  tangent: number;
}

export class CurvePoint extends Vector2 {
  deg: number;
  rco: Vector2;
  sco: Vector2;
  startco: Vector2;
  eid: number;
  flag: number;
  tangent: number;

  constructor(co?: ArrayLike<number> | CurvePointJSON) {
    // CurvePointJSON has numeric `0`/`1` members; Vector2 only reads those.
    super(co as ArrayLike<number> | undefined);

    this.deg = 3;
    this.rco = new Vector2(co as ArrayLike<number> | undefined);
    this.sco = new Vector2(co as ArrayLike<number> | undefined);

    //for transform
    this.startco = new Vector2();
    this.eid = -1;
    this.flag = 0;

    this.tangent = TangentModes.SMOOTH;
  }

  copy(): CurvePoint {
    let ret = new CurvePoint(this);

    ret.tangent = this.tangent;
    ret.rco.load(ret);

    return ret;
  }

  toJSON(): CurvePointJSON {
    return {
      0: this[0],
      1: this[1],
      eid: this.eid,
      flag: this.flag,
      deg: this.deg,
      tangent: this.tangent,
    };
  }

  static fromJSON(obj: CurvePointJSON): CurvePoint {
    let ret = new CurvePoint(obj);

    ret.eid = obj.eid;
    ret.flag = obj.flag;
    ret.deg = obj.deg;
    ret.tangent = obj.tangent;

    return ret;
  }

  basis(
    t: number,
    kprev: number,
    knext: number,
    is_end: number,
    totp: number,
    pi: number,
  ): number {
    let wid = (knext - kprev) * 0.5;
    let k = this.rco[0];

    this.deg = 3;

    kprev -= this.deg * wid;
    knext += this.deg * wid;

    if (is_end !== 1) {
      kprev = Math.max(kprev, 0.0);
    }
    if (is_end !== 2) {
      knext = Math.min(knext, 1.0);
    }

    let w;
    if (t > k) {
      w = 1.0 + (k - t) / (knext - k + 0.00001);
      w = 2.0 - w;
    } else {
      w = (t - kprev) / (k - kprev + 0.00001);
    }
    w *= 0.5;

    w = (t - kprev) / (knext - kprev);
    let n = totp;
    let v = pi;

    w = Math.min(Math.max(w, 0.0), 1.0);
    let bernstein = binomial(n, v) * Math.pow(w, v) * Math.pow(1.0 - w, n - v);
    return bernstein;
  }
}

// Control-point array carrying the extra ad-hoc properties the bspline code
// hangs off of it (highlight pointer + a recalc dirty flag).
export interface CurvePointArray extends Array<CurvePoint> {
  highlight?: CurvePoint;
  recalc?: number;
}

export class BSplineCurve extends CurveTypeData {
  points: CurvePointArray;
  length: number;
  _ps: CurvePoint[];
  hermite: number[];
  deg: number;
  recalc: number;
  basis_tables: number[][];
  eidgen: util.IDGen;

  constructor() {
    super(CurveTypes.BSPLINE);

    this.fastmode = false;
    this.points = [];
    this.length = 0;

    this._ps = [];
    this.hermite = [];
    this.fastmode = false;

    this.deg = 6;
    this.recalc = 1;
    this.basis_tables = [];
    this.eidgen = new util.IDGen();

    this.add(0, 0);
    this.add(1, 1);
  }

  remove(p: CurvePoint): void {
    this.points.remove(p);
    this.length = this.points.length;
  }

  add(x: number, y: number): CurvePoint {
    let p = new CurvePoint();
    this.recalc = 1;

    p.eid = this.eidgen.next();

    p[0] = x;
    p[1] = y;

    p.sco.load(p);
    p.rco.load(p);

    this.points.push(p);
    this.update();

    this.length = this.points.length;

    return p;
  }

  // Removes every selected control point; returns true if any were removed.
  removeSelected(): boolean {
    let removed = false;

    for (let i = 0; i < this.points.length; i++) {
      let p = this.points[i];

      if (p.flag & CurveFlags.SELECT) {
        this.points.remove(p);
        i--;
        removed = true;
      }
    }

    if (removed) {
      this.update();
    }

    return removed;
  }

  update() {
    this.recalc = 1;

    for (let i = 0; i < this.points.length; i++) {
      this.points[i].rco.load(this.points[i]);
    }

    this.points.sort(function (a, b) {
      return a[0] - b[0];
    });

    this._ps = [];
    if (this.points.length < 2) return;

    for (let i = 0; i < this.points.length - 1; i++) {
      this._ps.push(this.points[i]);
    }

    if (this.points.length < 3) return;

    let l1 = this.points[this.points.length - 1];
    let l2 = this.points[this.points.length - 2];

    let p = l1.copy();
    p.rco[0] = l1.rco[0] - 0.00001;
    p.rco[1] = l2.rco[1] + ((l1.rco[1] - l2.rco[1]) * 1.0) / 3.0;
    this._ps.push(p);

    p = l1.copy();
    p.rco[0] = l1.rco[0] - 0.00001;
    p.rco[1] = l2.rco[1] + ((l1.rco[1] - l2.rco[1]) * 2.0) / 3.0;
    this._ps.push(p);

    this._ps.push(l1);

    for (let i = 0; i < this._ps.length; i++) {
      this._ps[i].rco.load(this._ps[i]);
    }

    for (let i = 0; i < this.points.length; i++) {
      let p = this.points[i];
      let x = p[0],
        y = p[1];

      p.sco[0] = x;
      p.sco[1] = y;
    }
  }

  toJSON(): CurveTypeJSON {
    let ret = super.toJSON();

    let ps: CurvePointJSON[] = [];
    for (let i = 0; i < this.points.length; i++) {
      ps.push(this.points[i].toJSON());
    }

    return Object.assign(ret, {
      points: ps,
      deg: this.deg,
      eidgen: this.eidgen.toJSON(),
    });
  }

  loadJSON(obj: CurveTypeJSON): this {
    super.loadJSON(obj);

    this.length = 0;
    this.points = [];
    this._ps = [];

    this.eidgen = util.IDGen.fromJSON(obj.eidgen as { _cur: number });
    this.recalc = 1;

    if (obj.deg !== undefined) this.deg = obj.deg as number;

    let pts = obj.points as CurvePointJSON[];
    for (let i = 0; i < pts.length; i++) {
      this.points.push(CurvePoint.fromJSON(pts[i]));
    }

    this.length = this.points.length;
    this.redraw();
    return this;
  }

  basis(t: number, i: number): number {
    if (this.recalc) {
      this.regen_basis();
    }

    i = Math.min(Math.max(i, 0), this._ps.length - 1);
    t = Math.min(Math.max(t, 0.0), 1.0) * 0.999999999;

    let table = this.basis_tables[i];

    let s = t * (table.length / 4) * 0.99999;

    let j = ~~s;
    s -= j;

    j *= 4;
    return table[j] + (table[j + 3] - table[j]) * s;
  }

  reset(): this {
    this.length = 0;
    this.points = [];
    this._ps = [];

    this.add(0, 0);
    this.add(0.5, 0.5);
    this.add(1, 1);

    this.update();

    return this;
  }

  regen_hermite(steps?: number): void {
    steps = steps === undefined ? 240 : steps;

    this.hermite = new Array(steps);
    let table = this.hermite;

    let eps = 0.00001;
    let dt = (1.0 - eps * 8) / (steps - 1);
    let t = eps * 4;
    let lastdv1 = 0,
      lastf3 = 0;

    for (let j = 0; j < steps; j++, t += dt) {
      let f3 = this._evaluate(t);
      let f2 = this._evaluate(t - eps);
      let f4 = this._evaluate(t + eps);

      let dv1 = (f4 - f2) / (eps * 2);
      dv1 /= steps;

      if (j > 0) {
        let j2 = j - 1;

        table[j2 * 4] = lastf3;
        table[j2 * 4 + 1] = lastf3 + lastdv1 / 3.0;
        table[j2 * 4 + 2] = f3 - dv1 / 3.0;
        table[j2 * 4 + 3] = f3;
      }

      lastdv1 = dv1;
      lastf3 = f3;
    }
  }

  regen_basis(): void {
    this.recalc = 0;

    let steps = this.fastmode ? 64 : 128;

    this.basis_tables = new Array(this._ps.length);

    for (let i = 0; i < this._ps.length; i++) {
      let table = (this.basis_tables[i] = new Array((steps - 1) * 4));

      let eps = 0.00001;
      let dt = (1.0 - eps * 8) / (steps - 1);
      let t = eps * 4;
      let lastdv1 = 0,
        lastf3 = 0;

      for (let j = 0; j < steps; j++, t += dt) {
        let f3 = this._basis(t, i);
        let f2 = this._basis(t - eps, i);
        let f4 = this._basis(t + eps, i);

        let dv1 = (f4 - f2) / (eps * 2);
        dv1 /= steps;

        if (j > 0) {
          let j2 = j - 1;

          table[j2 * 4] = lastf3;
          table[j2 * 4 + 1] = lastf3 + lastdv1 / 3.0;
          table[j2 * 4 + 2] = f3 - dv1 / 3.0;
          table[j2 * 4 + 3] = f3;
        }

        lastdv1 = dv1;
        lastf3 = f3;
      }
    }

    this.regen_hermite();
  }

  _basis(t: number, i: number): number {
    let len = this._ps.length;
    let ps = this._ps;

    function safe_inv(n: number): number {
      return n === 0 ? 0 : 1.0 / n;
    }

    function bas(s: number, i: number, n: number): number {
      let kn = Math.min(Math.max(i + 1, 0), len - 1);
      let knn = Math.min(Math.max(i + n, 0), len - 1);
      let knn1 = Math.min(Math.max(i + n + 1, 0), len - 1);
      let ki = Math.min(Math.max(i, 0), len - 1);

      if (n === 0) {
        return s >= ps[ki].rco[0] && s < ps[kn].rco[0] ? 1 : 0;
      } else {
        let a =
          (s - ps[ki].rco[0]) *
          safe_inv(ps[knn].rco[0] - ps[ki].rco[0] + 0.0001);
        let b =
          (ps[knn1].rco[0] - s) *
          safe_inv(ps[knn1].rco[0] - ps[kn].rco[0] + 0.0001);

        let ret = a * bas(s, i, n - 1) + b * bas(s, i + 1, n - 1);

        return ret;
      }
    }

    let deg = this.deg;

    let b = bas(t, i - deg, deg);

    return b;
  }

  evaluate(t: number): number {
    let a = this.points[0].rco,
      b = this.points[this.points.length - 1].rco;

    if (t < a[0]) return a[1];
    if (t > b[0]) return b[1];

    if (this.points.length === 2) {
      t = (t - a[0]) / (b[0] - a[0]);
      return a[1] + (b[1] - a[1]) * t;
    }

    if (this.recalc) {
      this.regen_basis();
    }

    t *= 0.999999;

    let table = this.hermite;
    let s = t * (table.length / 4);

    let i = Math.floor(s);
    s -= i;

    i *= 4;

    return table[i] + (table[i + 3] - table[i]) * s;
  }

  _evaluate(t: number): number {
    let start_t = t;

    if (this.points.length > 1) {
      let a = this.points[0],
        b = this.points[this.points.length - 1];

      if (t < a[0]) return a[1];
      if (t >= b[0]) return b[1];
    }

    for (let i = 0; i < 35; i++) {
      let df = 0.0001;
      let ret1 = this._evaluate2(t < 0.5 ? t : t - df);
      let ret2 = this._evaluate2(t < 0.5 ? t + df : t);

      let f1 = Math.abs(ret1[0] - start_t);
      let f2 = Math.abs(ret2[0] - start_t);
      let g = (f2 - f1) / df;

      if (f1 === f2) break;

      if (f1 === 0.0 || g === 0.0) return this._evaluate2(t)[1];

      let fac = -(f1 / g) * 0.5;
      if (fac === 0.0) {
        fac = 0.01;
      } else if (Math.abs(fac) > 0.1) {
        fac = 0.1 * Math.sign(fac);
      }

      t += fac;
      let eps = 0.00001;
      t = Math.min(Math.max(t, eps), 1.0 - eps);
    }

    return this._evaluate2(t)[1];
  }

  _evaluate2(t: number): Vector2 {
    let ret = eval2_rets.next();

    t *= 0.9999999;

    let totbasis = 0;
    let sumx = 0;
    let sumy = 0;

    for (let i = 0; i < this._ps.length; i++) {
      let p = this._ps[i].rco;
      let b = this.basis(t, i);

      sumx += b * p[0];
      sumy += b * p[1];

      totbasis += b;
    }

    if (totbasis !== 0.0) {
      sumx /= totbasis;
      sumy /= totbasis;
    }

    ret[0] = sumx;
    ret[1] = sumy;

    return ret;
  }
}

export class CustomCurve extends CurveTypeData {
  equation: string;
  _haserror = false;

  constructor() {
    super(CurveTypes.CUSTOM);

    this.equation = "x";
  }

  toJSON(): CurveTypeJSON {
    let ret = super.toJSON();

    return Object.assign(ret, {
      equation: this.equation,
    });
  }

  loadJSON(obj: CurveTypeJSON): this {
    super.loadJSON(obj);

    if (obj.equation !== undefined) {
      this.equation = obj.equation as string;
    }

    return this;
  }

  evaluate(s: number): number {
    let sin = Math.sin,
      cos = Math.cos,
      pi = Math.PI,
      PI = Math.PI,
      e = Math.E,
      E = Math.E,
      tan = Math.tan,
      abs = Math.abs,
      floor = Math.floor,
      ceil = Math.ceil,
      acos = Math.acos,
      asin = Math.asin,
      atan = Math.atan,
      cosh = Math.cos,
      sinh = Math.sinh,
      log = Math.log,
      pow = Math.pow,
      exp = Math.exp,
      sqrt = Math.sqrt,
      cbrt = Math.cbrt,
      min = Math.min,
      max = Math.max;

    try {
      let x = s;
      // eval() returns `any`; the equation is expected to evaluate to a number.
      let ret = eval(this.equation) as number;

      this._haserror = false;

      return ret;
    } catch (error) {
      this._haserror = true;
      return 0.0;
    }
  }
}

export class GuassianCurve extends CurveTypeData {
  height: number;
  offset: number;
  deviation: number;

  constructor() {
    super(CurveTypes.GUASSIAN);

    this.height = 1.0;
    this.offset = 1.0;
    this.deviation = 0.3; //standard deviation
  }

  toJSON(): CurveTypeJSON {
    let ret = super.toJSON();

    return Object.assign(ret, {
      height: this.height,
      offset: this.offset,
      deviation: this.deviation,
    });
  }

  loadJSON(obj: CurveTypeJSON): this {
    super.loadJSON(obj);

    this.height = obj.height !== undefined ? (obj.height as number) : 1.0;
    this.offset = obj.offset as number;
    this.deviation = obj.deviation as number;

    return this;
  }

  evaluate(s: number): number {
    let r =
      this.height *
      Math.exp(
        -((s - this.offset) * (s - this.offset)) /
          (2 * this.deviation * this.deviation),
      );
    return r;
  }
}

// Constructs a concrete generator (used to populate Curve.generators).
type CurveGeneratorCtor = new () => CurveTypeData;

export const CurveConstructors: { [key: number]: CurveGeneratorCtor } = {
  [CurveTypes.BSPLINE]: BSplineCurve,
  [CurveTypes.CUSTOM]: CustomCurve,
  [CurveTypes.GUASSIAN]: GuassianCurve,
};

// The list of generators carries an `active` pointer to the current one.
interface GeneratorArray extends Array<CurveTypeData> {
  active: CurveTypeData;
}

export class Curve {
  generators: GeneratorArray;
  setting_id: string;
  _fastmode: boolean;
  _redraw_hook?: RedrawHook;
  _save_hook?: SaveHook;
  overlay_curvefunc?: (t: number) => number;

  constructor(setting_id: string) {
    this.generators = [] as unknown as GeneratorArray;
    this.setting_id = setting_id;
    this._fastmode = false;

    if (setting_id === undefined) {
      throw new Error("setting_id cannot be undefined");
    }

    for (let k in CurveConstructors) {
      let gen = new CurveConstructors[k as unknown as number]();

      this.generators.push(gen);
    }

    this.generators.active = this.generators[0];
  }

  redraw(): void {
    if (this._redraw_hook !== undefined) {
      this._redraw_hook();
    }
  }

  setRedrawHook(cb: RedrawHook): void {
    for (let gen of this.generators) {
      gen.setRedrawHook(cb);
    }

    this._redraw_hook = cb;
  }

  doSave(): void {
    if (this._save_hook) {
      this._save_hook();
    }
  }

  setSaveHook(cb: SaveHook): this {
    this._save_hook = cb;

    for (let gen of this.generators) {
      gen.setSaveHook(cb);
    }

    return this;
  }

  get fastmode(): boolean {
    return this._fastmode;
  }

  set fastmode(val: boolean) {
    this._fastmode = val;

    for (let gen of this.generators) {
      gen.fastmode = val;
    }
  }

  toJSON(): CurveJSON {
    let ret: CurveJSON = {
      is_new_curve: true,
      setting_id: this.setting_id,
      generators: [],
      version: CURVE_VERSION,
      active_generator: this.generators.indexOf(this.generators.active),
    };

    for (let gen of this.generators) {
      ret.generators.push(gen.toJSON());
    }

    return ret;
  }

  getGenerator(type: number): CurveTypeData {
    for (let gen of this.generators) {
      if (gen.type === type) {
        return gen;
      }
    }

    throw new Error("Unknown generator " + type + ".");
  }

  switchGenerator(type: number): CurveTypeData {
    let gen = this.getGenerator(type);

    if (gen !== this.generators.active) {
      let old = this.generators.active;

      this.generators.active = gen;

      old.onInactive(this);
      gen.onActive(this);
    }

    return gen;
  }

  loadJSON(obj: CurveJSON): this {
    if (obj.is_new_curve === undefined) {
      // Legacy (pre-"new curve") format: a bare bspline dump.
      let gen = this.switchGenerator(CurveTypes.BSPLINE);

      this.generators.active = gen;

      obj.type = CurveTypes.BSPLINE;

      gen.reset();
      gen.loadJSON(obj as unknown as CurveTypeJSON);

      this.update();
      this.redraw();

      return this;
    }

    if (this.setting_id === undefined) {
      console.warn(
        "Warning, setting setting_id in Curve.loadJSON(); you forgot to pass it to the constructor",
      );
      this.setting_id = obj.setting_id;
    }

    for (let gen of obj.generators) {
      if (!(gen.type in CurveConstructors)) {
        throw new Error("Bad generator type " + gen.type);
      }

      this.getGenerator(gen.type).loadJSON(gen).update();
    }

    this.generators.active = this.generators[obj.active_generator];

    this.update();
    this.redraw();

    return this;
  }

  evaluate(s: number): number {
    return this.generators.active.evaluate(s);
  }

  derivative(s: number): number {
    return this.generators.active.derivative(s);
  }

  derivative2(s: number): number {
    return this.generators.active.derivative2(s);
  }

  inverse(s: number): number {
    return this.generators.active.inverse(s);
  }

  reset(): void {
    this.generators.active.reset();
  }

  update(): void {
    return this.generators.active.update();
  }

  destroy_all_settings(): this {
    delete localStorage[this.setting_id];

    return this;
  }
}

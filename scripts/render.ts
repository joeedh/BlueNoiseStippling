import * as util from "./util.js";
import * as vectormath from "./vectormath.js";
import * as math from "./math.js";
import cconst, { config } from "./const.js";

import { Matrix4, Vector3 } from "./vectormath.js";

const CX = 0,
  CY = 1,
  CRAD = 2,
  CR = 3,
  CG = 4,
  CB = 5,
  CA = 6,
  CTOT = 7;

let colormap: Record<string, number[]> = {
  black: [0, 0, 0, 1],
  grey: [0.5, 0.5, 0.5, 1],
  orange: [1, 0.7, 0.1, 1],
  white: [1, 1, 1, 1],
};

let css_validater =
  /(rgb|rgba)\([0-9]+\,[0-9]+\,[0-9]+\,(([0-9]*\.[0-9]+)|([0-9]+))\)/;

export function test_validator(css: string): boolean {
  return css_validater.test(css);
}

export function test_fillStyle_parse(css: string): string {
  let render = new CircleRender(1024, 1024);
  render.fillStyle = css;
  return render.fillStyle;
}

let mat_tmps = util.cachering.fromConstructor(vectormath.Vector3, 64);

export class CircleRender {
  circles: number[];
  width: number;
  height: number;
  buffer: Float32Array;
  image: ImageData;
  mat: Matrix4;
  matstack: Matrix4[];
  _color: number[];

  constructor(width: number, height: number) {
    this.circles = [];
    this.width = width;
    this.height = height;
    this.buffer = new Float32Array(width * height * 4);
    this.image = new ImageData(width, height);

    this.mat = new Matrix4();
    this.matstack = [];

    this._color = [0, 0, 0, 1];
  }

  //assumes full circles
  arc(x: number, y: number, r: number, th1: number, th2: number): void {
    let p = mat_tmps.next().zero();
    (p[0] = x), (p[1] = y);

    r *= this.mat.$matrix.m11;
    //r = 8;

    p.multVecMatrix(this.mat);
    (x = p[0]), (y = p[1]);

    let cs = this.circles;

    let ci = cs.length;
    for (let i = 0; i < CTOT; i++) {
      cs.push(0.0);
    }

    cs[ci] = x;
    cs[ci + 1] = y;
    cs[ci + CRAD] = r;
    cs[ci + CR] = this._color[0];
    cs[ci + CG] = this._color[1];
    cs[ci + CB] = this._color[2];
    cs[ci + CA] = this._color[3];
  }

  scale(x: number, y: number): void {
    this.mat.scale(x, y, 1.0);
  }

  translate(x: number, y: number): void {
    this.mat.translate(x, y, 0.0);
  }

  clearRect(x: number, y: number, w: number, h: number): void {
    //ignore
  }

  reset() {
    this.circles.length = 0;
  }

  lineTo(): void {
    //ignore
  }

  _transform(x: number, y: number): Vector3 {
    let p = mat_tmps.next().zero();
    (p[0] = x), (p[1] = y);
    p.multVecMatrix(this.mat);

    return p;
  }

  rect(x: number, y: number, w: number, h: number): void {
    //ignore
  }

  beginPath(): void {
    //ignore
  }

  moveTo(x: number, y: number): void {} //ignore

  save(): void {
    this.matstack.push(new Matrix4(this.mat));
  }

  restore(): void {
    let m = this.matstack.pop();
    if (m !== undefined) {
      this.mat.load(m);
    }
  }

  set fillStyle(val: string) {
    if (val === undefined) {
      throw new Error("fillStyle cannot be undefined");
    }

    //make lowercase and remove whitespace
    val = val.toLowerCase().replace(/[ \t\n\r]/g, "");

    let color: number[];

    if (val in colormap) {
      color = colormap[val];
    } else {
      if (!css_validater.test(val)) {
        throw new Error("invalid css color: " + val);
      }

      let has_a = val.startsWith("rgba");
      let prefix = has_a ? "rgba(" : "rgb(";

      val = val.slice(prefix.length, val.length - 1);
      let parts = val.split(",");

      color = [
        parseInt(parts[0]),
        parseInt(parts[1]),
        parseInt(parts[2]),
        has_a ? parseFloat(parts[3]) : 1.0,
      ];

      // Preserves original behavior: isNaN coerces the string component to a
      // number (NaN when the alpha part is missing), defaulting alpha to 1.0.
      if (isNaN(parts[3] as unknown as number)) {
        //hrm, I think CSS silently allows missing alpha even with rgba prefix
        color[3] = 1.0;
      }

      color[0] /= 255;
      color[1] /= 255;
      color[2] /= 255;
    }

    for (let i = 0; i < 4; i++) {
      this._color[i] = color[i];
    }
  }

  get fillStyle(): string {
    let r = ~~(this._color[0] * 255);
    let g = ~~(this._color[1] * 255);
    let b = ~~(this._color[2] * 255);

    return "rgba(" + r + "," + g + "," + b + "," + this._color[3] + ")";
  }

  fill(): void {
    //ignore
  }

  render(): ImageData {
    let cs = this.circles,
      width = this.width,
      height = this.height;
    let buf = this.buffer;

    buf.fill(0, 0, buf.length);

    let fwid = 0.55,
      swid = 4;
    let offs = cconst.get_searchoff(swid);
    let totw = 0.0;

    //*
    if (swid != 0) {
      for (let off of offs) {
        let x = (off[0] / swid) * fwid,
          y = (off[1] / swid) * fwid;
        let w = 1.0 - Math.sqrt(x * x + y * y) / Math.sqrt(2.0 * fwid);

        w *= w;
        w = w * 0.95 + 0.05;

        this.render_intern(x, y, w);
        totw += w;
      } //*/
    } else {
      this.render_intern(0, 0, 1.0);
      totw = 1.0;
    }

    let idata = this.image.data;

    for (let i = 0; i < buf.length; i++) {
      buf[i] /= totw;
    }

    if (!config.BLACK_BG) {
      for (let i = 0; i < buf.length; i += 4) {
        for (let j = 0; j < 3; j++) {
          buf[j] += (1.0 - buf[j]) * (1.0 - buf[3]);
        }

        buf[3] = 1.0;
      }
    }

    for (let i = 0; i < buf.length; i++) {
      let f = ~~(buf[i] * 255.0 + (Math.random() - 0.5) * 1.75);
      f = Math.min(Math.max(f, 0.0), 255);

      idata[i] = f;
    }

    return this.image;
  }

  render_intern(dx: number, dy: number, w: number): void {
    let cs = this.circles,
      width = this.width,
      height = this.height;
    let buf = this.buffer;
    let dimen = Math.sqrt(width * height);

    let covered = new Uint8Array(width * height);

    for (let ci = 0; ci < cs.length; ci += CTOT) {
      let x = cs[ci],
        y = cs[ci + 1],
        rad = cs[ci + CRAD];
      let cr = cs[ci + CR],
        cg = cs[ci + CG],
        cb = cs[ci + CB],
        ca = cs[ci + CA];

      let ix1 = x + dx + 0.5,
        iy1 = y + dy + 0.5;

      let irad = Math.floor(rad + 0.5);
      irad = Math.max(irad, 1);

      let offs = cconst.get_searchoff(irad + 1);
      for (let off of offs) {
        let ox = off[0] + Math.fract(ix1),
          oy = off[1] + Math.fract(iy1);
        //let ox = off[0], oy = off[1];
        let ix2 = ~~(ix1 + off[0] + 0.5),
          iy2 = ~~(iy1 + off[1] + 0.5);

        let w2 = w;

        if (ox * ox + oy * oy >= rad * rad * 1.01) {
          continue;
        }

        if (ix2 < 0 || iy2 < 0 || ix2 >= width || iy2 >= height) continue;

        let cvidx = iy2 * width + ix2;
        let idx = cvidx * 4;

        if (covered[cvidx]) {
          continue;
        }
        covered[cvidx] = 1;

        //cr=cg=cb=0.0;
        //ca=1.0;

        buf[idx] += cr * w2;
        buf[idx + 1] += cg * w2;
        buf[idx + 2] += cb * w2;
        buf[idx + 3] += ca * w2;
      }
    }
  }
}

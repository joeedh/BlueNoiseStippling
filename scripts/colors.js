import * as util from './util.js';
import cconst from './const.js';
import * as vectormath from './vectormath.js';
import {Vector3, Vector4} from './vectormath.js';

export var colors = [];

export const ColorSpaces = {
  XYZ: 0,
  LAB: 1,
  RGB: 2
};

function getDitherFac() {
  if (RASTER_IMAGE && RASTER_MODE === RASTER_MODES.DIFFUSION) {
    return 0.0;
  }

  return DITHER_RAND_FAC;
}

export class DitherSampler extends Array {
  constructor(size = 1024*32) {
    super();

    let rand = new util.MersenneRandom(0);

    for (let i = 0; i < size; i++) {
      this.push(rand.random());
    }

    this.cur = 0;
  }

  seed(i) {
    i = ~~i;

    while (i < 0) {
      i += this.length;
    }

    this.cur = i%this.length;
    return this;
  }

  random() {
    let ret = this[this.cur];

    this.cur = (this.cur + 1)%this.length;
    return ret;
  }
}

export const ditherSampler = new DitherSampler();

//very crappy palette generator (it excludes purple, purple is evil!)

let rgb_to_hsv_rets = new util.cachering(() => [0, 0, 0], 64);

export function rgb_to_hsv(r, g, b) {
  let computedH = 0;
  let computedS = 0;
  let computedV = 0;

  if (r == null || g == null || b == null ||
    isNaN(r) || isNaN(g) || isNaN(b)) {
    throw new Error('Please enter numeric RGB values!');
    return;
  }
  /*
  if (r<0 || g<0 || b<0 || r>1.0 || g>1.0 || b>1.0) {
   throw new Error('RGB values must be in the range 0 to 1.0');
   return;
  }//*/

  let minRGB = Math.min(r, Math.min(g, b));
  let maxRGB = Math.max(r, Math.max(g, b));

  // Black-gray-white
  if (minRGB == maxRGB) {
    computedV = minRGB;

    let ret = rgb_to_hsv_rets.next();
    ret[0] = 0, ret[1] = 0, ret[2] = computedV;
    return ret;
  }

  // Colors other than black-gray-white:
  let d = (r == minRGB) ? g - b : ((b == minRGB) ? r - g : b - r);
  let h = (r == minRGB) ? 3 : ((b == minRGB) ? 1 : 5);

  computedH = (60*(h - d/(maxRGB - minRGB)))/360.0;
  computedS = (maxRGB - minRGB)/maxRGB;
  computedV = maxRGB;

  let ret = rgb_to_hsv_rets.next();
  ret[0] = computedH, ret[1] = computedS, ret[2] = computedV;
  return ret;
}

let hsv_to_rgb_rets = new util.cachering(() => [0, 0, 0], 64);

export function hsv_to_rgb(h, s, v) {
  let c = 0, m = 0, x = 0;
  let ret = hsv_to_rgb_rets.next();

  ret[0] = ret[1] = ret[2] = 0.0;
  h *= 360.0;

  c = v*s;
  x = c*(1.0 - Math.abs(((h/60.0)%2) - 1.0));
  m = v - c;
  let color;

  function RgbF_Create(r, g, b) {
    ret[0] = r;
    ret[1] = g;
    ret[2] = b;

    return ret;
  }

  if (h >= 0.0 && h < 60.0) {
    color = RgbF_Create(c + m, x + m, m);
  } else if (h >= 60.0 && h < 120.0) {
    color = RgbF_Create(x + m, c + m, m);
  } else if (h >= 120.0 && h < 180.0) {
    color = RgbF_Create(m, c + m, x + m);
  } else if (h >= 180.0 && h < 240.0) {
    color = RgbF_Create(m, x + m, c + m);
  } else if (h >= 240.0 && h < 300.0) {
    color = RgbF_Create(x + m, m, c + m);
  } else if (h >= 300.0 && h < 360.0) {
    color = RgbF_Create(c + m, m, x + m);
  } else {
    color = RgbF_Create(m, m, m);
  }

  return color;
}

export var closest_map = undefined;
export var closest_size = undefined;
export var next_closest_map = undefined;

const rgb_to_xyz_rets = util.cachering.fromConstructor(Vector3, 512);
const xyz_to_rgb_rets = util.cachering.fromConstructor(Vector3, 512);
const xyz_to_lab_rets = util.cachering.fromConstructor(Vector3, 512);
const lab_to_xyz_rets = util.cachering.fromConstructor(Vector3, 512);
const lab_to_labch_rets = util.cachering.fromConstructor(Vector3, 512);
const labch_to_lab_rets = util.cachering.fromConstructor(Vector3, 512);
const rgb_to_lab_rets = util.cachering.fromConstructor(Vector3, 512);
const lab_to_rgb_rets = util.cachering.fromConstructor(Vector3, 512);
const rgb_to_cmyk_rets = util.cachering.fromConstructor(Vector3, 512);

export function xyz_to_intensity(x, y, z) {
  return xyz_to_lab(x, y, z)[0];
  let f = 0.5;
  x = x**f;
  y = y**f;
  z = z**f;

  return (x + y + z)/3.0;
}

export function xyz_to_saturation(x, y, z) {
  let avg = (x + y + z)/3.0;

  let dr = Math.abs(x - avg);
  let dg = Math.abs(y - avg);
  let db = Math.abs(z - avg);

  return (dr + dg + db)/3.0;
}

export function rgb_to_xyz(r, g, b) {
  let var_R = r;
  let var_G = g;
  let var_B = b;

  if (var_R > 0.04045) var_R = Math.pow((var_R + 0.055)/1.055, 2.4);
  else var_R = var_R/12.92;
  if (var_G > 0.04045) var_G = Math.pow((var_G + 0.055)/1.055, 2.4);
  else var_G = var_G/12.92;
  if (var_B > 0.04045) var_B = Math.pow((var_B + 0.055)/1.055, 2.4);
  else var_B = var_B/12.92;

  /*
    on factor;
    off period;

    f1 := var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805 - X;
    f2 := var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722 - Y;
    f3 := var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505 - Z;

    f := solve({f1, f2, f3}, {var_r, var_g, var_b});
  */

  //Observer. = 2°, Illuminant = D65
  let X = var_R*0.4124 + var_G*0.3576 + var_B*0.1805;
  let Y = var_R*0.2126 + var_G*0.7152 + var_B*0.0722;
  let Z = var_R*0.0193 + var_G*0.1192 + var_B*0.9505;

  let ret = rgb_to_xyz_rets.next();
  ret[0] = X;
  ret[1] = Y;
  ret[2] = Z;

  return ret;
}

const mulx = 1.0/95.047;
const muly = 0.01
const mulz = 1.0/108.08883;

export function xyz_to_rgb(X, Y, Z) {

  let var_X = X;       //X from 0 to  95.047      (Observer = 2°, Illuminant = D65)
  let var_Y = Y;      //Y from 0 to 100.000
  let var_Z = Z;       //Z from 0 to 108.883

  let var_R = var_X*3.240625 + var_Y* -1.53720797 + var_Z* -0.498628
  let var_G = var_X* -0.9689307 + var_Y*1.87575606 + var_Z*0.04151752
  let var_B = var_X*0.0557101 + var_Y* -0.204021 + var_Z*1.05699

  if (var_R > 0.003130807)
    var_R = 1.055*(Math.pow(var_R, 1.0/2.4)) - 0.055;
  else
    var_R = 12.92*var_R;

  if (var_G > 0.003130807)
    var_G = 1.055*(Math.pow(var_G, 1.0/2.4)) - 0.055;
  else
    var_G = 12.92*var_G;

  if (var_B > 0.003130807)
    var_B = 1.055*(Math.pow(var_B, 1.0/2.4)) - 0.055;
  else
    var_B = 12.92*var_B;

  let ret = xyz_to_rgb_rets.next();

  ret[0] = var_R;
  ret[1] = var_G;
  ret[2] = var_B;

  return ret;
}


export function lab_to_xyz(L, a, b) {
  L *= 100.0;
  a *= 100.0;
  b *= 100.0;

  let var_Y = (L + 16)/116;
  let var_X = a/500 + var_Y;
  let var_Z = var_Y - b/200;

  let X3 = var_X*var_X*var_X;
  let Y3 = var_Y*var_Y*var_Y;
  let Z3 = var_Z*var_Z*var_Z;

  if (Y3 > 0.008856) var_Y = Y3
  else var_Y = (var_Y - 16/116)/7.787
  if (X3 > 0.008856) var_X = X3
  else var_X = (var_X - 16/116)/7.787
  if (Z3 > 0.008856) var_Z = Z3
  else var_Z = (var_Z - 16/116)/7.787

  let X = 0.95047*var_X;     //ref_X =  95.047     Observer= 2°, Illuminant= D65
  let Y = var_Y;     //ref_Y = 100.000
  let Z = 1.08883*var_Z;     //ref_Z = 108.883

  let ret = lab_to_xyz_rets.next();

  ret[0] = X;
  ret[1] = Y;
  ret[2] = Z;

  return ret;
}

export function xyz_to_lab(X, Y, Z) {
  let var_X = X/0.95047          //ref_X =  95.047   Observer= 2°, Illuminant= D65
  let var_Y = Y//100.000         //ref_Y = 100.000
  let var_Z = Z/1.08883         //ref_Z = 108.883

  if (var_X > 0.008856) var_X = Math.cbrt(var_X);
  else var_X = (7.787*var_X) + (16/116)
  if (var_Y > 0.008856) var_Y = Math.cbrt(var_Y);
  else var_Y = (7.787*var_Y) + (16/116)
  if (var_Z > 0.008856) var_Z = Math.cbrt(var_Z);
  else var_Z = (7.787*var_Z) + (16/116)

  let ret = xyz_to_lab_rets.next();

  let L = (1.16*var_Y) - .016
  let a = 5.00*(var_X - var_Y)
  let b = 2.00*(var_Y - var_Z)

  ret[0] = L;
  ret[1] = a;
  ret[2] = b;

  return ret;
}

export function xyz_colordis(c1, c2) {
  let dx = Math.abs(c1[0] - c2[0]);
  let dy = Math.abs(c1[1] - c2[1]);
  let dz = Math.abs(c1[2] - c2[2]);

  let f = Math.sqrt(dx*dx + dy*dy + dz*dz)/(3**0.5);
  //let f = (dx+dy+dz)/3.0;

  return f;
}

function lab_to_labch(L, a, b) {
  L *= 100.0;
  a *= 100.0;
  b *= 100.0;

  let var_H = Math.atan2(b, a)  //Quadrant by signs

  if (var_H > 0) var_H = (var_H/Math.PI)*180
  else var_H = 360 - (Math.abs(var_H)/Math.PI)*180

  //L = L;
  let C = Math.sqrt(a*a + b*b)
  let H = var_H;

  let ret = lab_to_labch_rets.next();

  ret[0] = L*0.01;
  ret[1] = C*0.01;
  ret[2] = H*0.01;

  return ret;
  //var L = L
  //var C = sqrt( CIEa ** 2 + CIEb ** 2 )
  //var H = var_H
}

export function labch_to_lab(L, c, h) {
  let ret = labch_to_lab_rets.next();

  L *= 100.0;
  c *= 100.0;
  h *= 100.0;

  h = (h/180)*Math.PI;

  ret[0] = L;
  ret[1] = Math.cos(h)*c;
  ret[2] = Math.sin(h)*c;

  return ret;
}

export function rgb_to_lab(r, g, b) {
  let xyz = rgb_to_xyz(r, g, b);
  //return xyz;

  return xyz_to_lab(xyz[0], xyz[1], xyz[2]);
}

export function lab_to_rgb(l, a, b) {
  //return xyz_to_rgb(l, a, b);

  let xyz = lab_to_xyz(l, a, b);
  return xyz_to_rgb(xyz[0], xyz[1], xyz[2]);
}

export function lab_to_intensity(l, a, b) {
  return l;
}

export function lab_to_saturation(l, a, b) {
  let labch = lab_to_labch(l, a, b);
  return labch[1];
}

export function rgb_to_labch(r, g, b) {
  let lab = rgb_to_lab(r, g, b);
  //return xyz;

  return lab_to_labch(lab[0], lab[1], lab[2]);
}

export function rgb_to_cmyk(r, g, b) {
  //CMYK and CMY values from 0 to 1
  let ret = rgb_to_cmyk_rets.next();

  let C = 1.0 - r;
  let M = 1.0 - g;
  let Y = 1.0 - b;

  let var_K = 1

  if (C < var_K) var_K = C
  if (M < var_K) var_K = M
  if (Y < var_K) var_K = Y
  if (var_K === 1) { //Black
    C = 0
    M = 0
    Y = 0
  } else {
    C = (C - var_K)/(1 - var_K)
    M = (M - var_K)/(1 - var_K)
    Y = (Y - var_K)/(1 - var_K)
  }

  let K = var_K

  ret[0] = C;
  ret[1] = M;
  ret[2] = Y;
  ret[3] = K;

  return ret;
}

export function labch_to_rgb(l, c, h) {
  let labch = labch_to_lab(l, c, h);

  return lab_to_rgb(labch[0], labch[1], labch[2]);
}

export function test_lab_xyz() {
  util.seed(0);

  for (let i = 0; i < 5; i++) {
    //var rgb = [0.9, 0.1, 0.2];
    let rgb = [util.random(), util.random(), util.random()];

    let lab = rgb_to_lab(rgb[0], rgb[1], rgb[2]);

    console.log(rgb);
    //console.log(xyz);
    console.log(lab);
    //console.log(xyz_to_rgb(xyz[0], xyz[1], xyz[2]));

    rgb = lab_to_rgb(lab[0], lab[1], lab[2]);
    console.log(rgb);

    console.log("\n")
  }
}

export function gen_closest_map(size) {
  if (size === undefined)
    size = window.LOW_RES_CUBE ? 20 : 40;

  console.warn("generating color map of dim", "" + size + "...");

  let map = new Int32Array(size*size*size);
  let nextmap = new Int32Array(size*size*size);

  closest_map = map;
  closest_size = size;
  next_closest_map = nextmap;

  let clr = [0, 0, 0];

  let nextout = [0];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      for (let k = 0; k < size; k++) {
        let idx = k*size*size + j*size + i;

        let u = i/(size - 1);
        let v = j/(size - 1);
        let w = k/(size - 1);

        clr[0] = u, clr[1] = v, clr[2] = w;

        map[idx] = closest_color(clr, nextout);
        nextmap[idx] = nextout[0];
      }
    }
  }

  /*
  for (let i=0; i<map.length; i++) {
    let x = i % size;
    let y = ~~((i % (size*size)) / size);
    let z = ~~(i / (size*size));
  }
  //*/

  console.log("done generating color map");

  return map;
}

export function closest_color_fast(clr, nextout, fr = 0, fg = 0, fb = 0) {
  if (closest_size === undefined) {
    gen_closest_map();
  }

  let size = closest_size;
  let map = closest_map;

  let i = ~~(clr[0]*size + 0.5 + fr);
  let j = ~~(clr[1]*size + 0.5 + fg);
  let k = ~~(clr[2]*size + 0.5 + fb);

  i = Math.min(Math.max(i, 0), size - 1);
  j = Math.min(Math.max(j, 0), size - 1);
  k = Math.min(Math.max(k, 0), size - 1);

  let idx = k*size*size + j*size + i;

  if (nextout !== undefined) {
    nextout[0] = next_closest_map[idx];
  }

  return map[idx];
}

let _last_map = undefined;

let colors_used = new Array();
let lab_colors = [];


let palrand = new util.MersenneRandom();

export function palette_from_image(maxcolor = PAL_COLORS*24) {
  colors.length = 0;

  palrand.seed();

  let image = _appstate.image.data;
  let fdata = image.fdata;

  let samples = 512 + ~~(image.width*image.height*0.1);
  let inv = 1.0/255.0;

  let map = new Map();

  for (let i = 0; i < samples; i++) {
    let idx = ~~(palrand.random()*image.width*image.height*0.9999);
    idx *= 4;

    let r = fdata[idx];
    let g = fdata[idx + 1];
    let b = fdata[idx + 2];

    let fr = r*inv, fg = g*inv, fb = b*inv;

    let key = ~~(r*32*32*32 + g*32*32 + b*32);
    let j = map.get(key);

    if (j === undefined && colors.length >= maxcolor) {
      continue;
    }

    if (j === undefined) {
      map.set(key, colors.length);
      colors.push([r, g, b, 1.0]);
    } else {
      let c = colors[j];

      c[0] += r;
      c[1] += g;
      c[2] += b;
      c[3] += 1.0;
    }
  }

  for (let i = 0; i < colors.length; i++) {
    let c = colors[i];
    c[3] = 1.0/(c[3]*255.0);

    for (let j = 0; j < 3; j++) {
      colors[i][j] *= c[3];
    }

    colors[i].length = 3;
  }
};

export function gen_colors() {
  lab_colors.length = 0;

  //generate rgb palette
  if (IMAGE_PALETTE && _appstate.image && _appstate.image.data.fdata) {
    palette_from_image();
  } else {
    gen_colors_intern();
  }

  for (let i = 0; i < colors.length; i++) {
    let c = colors[i];
    c = internal_to_rgb(c[0], c[1], c[2]);

    let l = rgb_to_lab(c[0], c[1], c[2]);
    lab_colors.push([l[0], l[1], l[2]]);
  }
}

export function gen_colors_intern() {
  colors.length = 0;

  //XXX
  if (TRI_MODE || RASTER_MODE === RASTER_MODES.PATTERN || RASTER_MODE === RASTER_MODES.DIFFUSION) {
    colors.push([1, 1, 1]);
  }

  if (BG_PALETTE) {
    colors.push([0, 0, 0]);
    gen_closest_map();
    return;
  }

  if (SIMPLE_PALETTE) {
    colors.push([0, 0, 0]);

    //colors.push([1, 1, 0]);
    //colors.push([1, 0, 1]);
    //colors.push([0, 1, 1]);

    colors.push([1, 0, 0]);
    colors.push([0, 1, 0]);
    colors.push([0, 0, 1]);

    if (ALLOW_PURPLE) {
      colors.push([1, 0, 1]);
    }

    gen_closest_map();
    return;
  }

  /*
  for (let i=0; i<19; i++) {
    colors.push([i/19, i/19, i/19]);
  }
  return;
  //*/

  /*
  //colors.push([1, 1, 0]);
  //colors.push([0, 1, 1]);
  //colors.push([1, 0, 1]);

  colors.push([1, 0, 0]);
  colors.push([0, 1, 0]);
  colors.push([0, 0, 1]);

  colors.push([0, 0, 0]);
  //colors.push([1, 1, 0]);
  //colors.push([0, 1, 1]);
  //colors.push([0, 0, 1]);
  //colors.push([0, 1, 0]);
  //colors.push([1, 0, 0]);
  //colors.push([0, 0, 0]);

  return;
  //*/

  /*
  colors.push([1, 0, 0]);
  colors.push([0, 1, 0]);
  colors.push([1, 1, 0]);
  colors.push([0, 1, 1]);

  colors.push([0, 0, 1]);
  colors.push([1, 0, 1]);
  colors.push([0, 0, 0]);
  colors.push([0.9, 0.9, 0.9]);
  return;

  colors.push([1, 0, 0]);
  colors.push([0, 1, 0]);
  colors.push([1, 1, 0]);
  colors.push([0, 0, 1]);
  colors.push([0, 0, 0]);
  return;
  //*/

  /*
  colors.push([0.2, 0.2, 0.2]);
  colors.push([0.3, 0, 0]);
  //colors.push([0.5, 0, 0.25]);
  colors.push([0, 0.5, 0]);
  colors.push([0.6, 0.6, 0]);
  //colors.push([0.5, 0.5, 0.0]);

  //colors.push([1, 0.5, 0.0]);
  colors.push([0, 0, 0.9]);

  //colors.push([0, 0.5, 0.0]);

  return;

  //*/

  let base = PAL_COLORS;

  if (1) {
    let tot = base*10;
    let rand = new util.MersenneRandom();

    for (let i = 0; i < tot; i++) {
      let r = rand.random();
      let g = rand.random();
      let b = rand.random();

      colors.push([r, g, b]);
    }
  }
  //teal 2
  for (let i = 0; i < base; i++) {
    let clr = [0, 0.7, (i + 1)/base];
    colors.push(clr)
  }

  //blue
  for (let i = 0; i < base*2; i++) {
    let clr = [0, 0, (i + 1)/(base*2)];
    colors.push(clr)
  }

  //evil!
  let totpurple = ALLOW_PURPLE ? base : 0;

  for (let i = 0; i < totpurple; i++) {
    let clr = [(i + 1)/totpurple, 0, (i + 1)/totpurple];
    colors.push(clr)
  }

  //evil!
  for (let i = 0; i < totpurple; i++) {
    let clr = [(i + 1)/totpurple, 0, 1.0];
    colors.push(clr)
  }

  //red
  for (let i = 0; i < base; i++) {
    let clr = [(i + 1)/base, 0, 0];
    colors.push(clr)
  }

  for (let i = 0; i < base; i++) {
    let clr = [(i + 1)/base, 0.4, 0.25];
    colors.push(clr)
  }

  //grey
  //*
  if (ALLOW_GREY) {
    for (let i = 0; i < base; i++) {
      let clr = [i/base, i/base, i/base];
      colors.push(clr)
    }
  }
  //*/

  //orange-yellow
  for (let i = 0; i < base; i++) {
    let clr = [(i + 1)/base, (i + 1)/base, 0];
    colors.push(clr)
  }

  //orange-yellow 2
  for (let i = 0; i < base; i++) {
    let clr = [0.7, (i + 1)/base, 0];
    colors.push(clr)
  }

  //orange-yellow 3
  for (let i = 0; i < base; i++) {
    let clr = [(i + 1)/base, 0.7, 0];
    colors.push(clr)
  }

  //brown
  for (let i = 0; i < base; i++) {
    let t = (i + 1)/base;

    let clr = new Vector3([0.5, 0.35, 0.25*(1.0 - t)]);
    let clr2 = new Vector3(clr);

    clr.interp([1, 1, 1], t);


    colors.push(clr);
  }

  //green
  for (let i = 0; i < base; i++) {
    let clr = [0, (base == 1 ? 0.68 : 1.0)*(i + 1)/base, 0];
    colors.push(clr)
  }

  //teal
  for (let i = 0; i < base; i++) {
    let clr = [0, (i + 1)/base, (i + 1)/base];
    colors.push(clr)
  }

  for (let i = 0; i < colors.length; i++) {
    let c = colors[i];
    let c2 = rgb_to_internal(c[0], c[1], c[2]);

    c[0] = c2[0];
    c[1] = c2[1];
    c[2] = c2[2];
  }

  let key = "" + PAL_COLORS + "," + ALLOW_PURPLE + "," + (RASTER_MODE == RASTER_MODES.PATTERN);

  if (_last_map === undefined || _last_map !== key) {
    gen_closest_map();
  }

  _last_map = key;

  colors_used.length = colors.length;
  for (let i = 0; i < colors.length; i++) {
    colors_used[i] = 0;
  }
}

export function image_palette(maxcolor) {
  gen_colors();

  if (maxcolor === undefined)
    maxcolor = 8;

  let cw = _appstate.image.width;
  let ch = _appstate.image.height;
  let idata = _appstate.image.data.data;

  let hist = new Int32Array(colors.length);
  hist.fill(0, 0, hist.length);
  let clr = [0, 0, 0];

  let dx = ~~(cw/DIMEN);
  let dy = ~~(ch/DIMEN);

  dx = dx === 0 ? 1 : dx;
  dy = dy === 0 ? 1 : dy;

  //XXX
  dx = dy = 4;

  let _i = 0;
  for (let ix = 0; ix < cw; ix += dx) {
    if (_i++%50 === 0) {
      console.log("doing column...", ix);
    }

    for (let iy = 0; iy < ch; iy += dy) {
      let idx = (iy*cw + ix)*4;

      let r = idata[idx]/255;
      let g = idata[idx + 1]/255;
      let b = idata[idx + 2]/255;

      let a = idata[idx + 3]/255;

      if (a < 0.1) {
        continue;
      } else {
        //r = 1.0 - r*a - a;
        //g = 1.0 - g*a - a;
        //b = 1.0 - b*a - a;
      }

      clr[0] = r;
      clr[1] = g;
      clr[2] = b;

      let ci = closest_color(clr);
      hist[ci]++;
    }
  }

  let arr = [];
  for (let i = 0; i < hist.length; i++) {
    arr.push([i, hist[i]]);
  }


  let csize = ~~Math.cbrt(maxcolor) + 1;

  let cube = new Int32Array(csize*csize*csize);
  cube.fill(-1, 0, cube.length);

  let nextcube = new Int32Array(csize*csize*csize);
  nextcube.fill(-1, 0, nextcube.length);

  function cidx(r, g, b) {
    r = ~~(r*csize);
    g = ~~(g*csize);
    b = ~~(b*csize);

    return r*csize*csize + g*csize + b;
  }

  function weight(c) {
    let clr = colors[c[0]];

    let w = c[1];
    let avg = (clr[0] + clr[1] + clr[2])/3.0;
    let sat = (Math.abs(clr[0] - avg) + Math.abs(clr[1] - avg) + Math.abs(clr[2] - avg))/3.0

    w = w*0.0001 + (sat)*w;

    return w;
  }

  arr.sort(function (a, b) {
    return weight(b) - weight(a);
  });

  let newcolors = [];

  for (let i = 0; i < arr.length; i++) {
    if (newcolors.length >= maxcolor || arr[i][1] === 0) {
      break;
    }

    let clr = colors[arr[i][0]];
    let idx = cidx(clr[0], clr[1], clr[2]);

    if (cube[idx] >= 0) {
      continue;
    }

    newcolors.push(colors[arr[i][0]]);
    cube[idx] = arr[i][0];
  }

  colors = newcolors;

  for (let i = 0; i < colors.length; i++) {
    console.log(colors[i]);
  }

  gen_closest_map();

  return colors;
}

let twentyfive7 = Math.pow(25, 7.0);

export function test_lab_colordis() {
  let a = [0.8, 0.7, 0.6];
  let b = [0.75, 0.65, 0.55];
  let c = [0.25, 0.65, 0.85];

  a = rgb_to_lab(a[0], a[1], a[2]);
  b = rgb_to_lab(b[0], b[1], b[2]);
  c = rgb_to_lab(c[0], c[1], c[2]);

  console.log("a<->b", lab_colordis(a, b), lab_colordis(b, a));
  console.log("a<->c", lab_colordis(a, c), lab_colordis(c, a));
  console.log("b<->c", lab_colordis(b, c), lab_colordis(c, b));
}

function safe_sqrt(n) {
  return n > 0 ? Math.sqrt(n) : 0;
}

export function lab_saturation(l, a, b) {
  let ch = lab_to_labch(l, a, b);

  return ch[1];
}

export function lab_colordis(c1, c2) {
  if (1) {
    let dl = Math.abs(c1[0] - c2[0]);
    let da = Math.abs(c1[1] - c2[1]);
    let db = Math.abs(c1[2] - c2[2]);

    return Math.sqrt(dl**2 + da**2 + db**2)/(3**0.5);
    //return (dl+da+db);
  }

  let pow = Math.pow, cos = Math.cos, sin = Math.sin, atan2 = Math.atan2;
  let abs = Math.abs, exp = Math.exp, sqrt = safe_sqrt;

  //from wikipedia:
  //
  //https://en.wikipedia.org/wiki/Color_difference#CIEDE2000
  let l1 = c1, l2 = c2;

  c1 = lab_to_labch(c1[0], c1[1], c1[2]);
  c2 = lab_to_labch(c2[0], c2[1], c2[2]);

  c1.mulScalar(100.0);
  c2.mulScalar(100.0);

  let kL = 1.0, kC = 1.0, kH = 1.0;

  let dL = c1[0] - c2[0];
  let L_ = (c1[0] + c2[0])*0.5;
  let C_ = (c1[1] + c2[1])*0.5;
  let C_7 = pow(C_, 7.0);

  let da1 = l1[1] + 0.5*l1[1]*(1.0 - sqrt(C_7/(C_7 + twentyfive7)));
  let da2 = l2[1] + 0.5*l2[1]*(1.0 - sqrt(C_7/(C_7 + twentyfive7)));
  let dC1 = sqrt(c1[1]*c1[1] + c1[2]*c1[2]);
  let dC2 = sqrt(c2[1]*c2[1] + c2[2]*c2[2]);
  let dC_ = (dC1 + dC2)*0.5;
  let h1deg = (atan2(l1[1], l1[0])/Math.PI + 1.0)*180;
  let h2deg = (atan2(l2[1], l2[0])/Math.PI + 1.0)*180;
  let dC = dC2 - dC1;

  let dhdeg;
  let hdif = abs(h1deg, h2deg);
  if (hdif < 180) {
    dhdeg = h2deg - h1deg;
  } else if (hdif > 180 && h1deg < h2deg) {
    dhdeg = h2deg - h1deg + 360;
  } else {
    dhdeg = h2deg - h1deg - 360;
  }

  let dH = 2*sqrt(dC1*dC2)*sin(Math.PI*(dhdeg*0.5)/180);
  let H_;

  if (hdif > 180) {
    H_ = ((h1deg + h2deg + 360)*0.5);
  } else {
    H_ = (h1deg + h2deg)*0.5;
  }

  if (dC1 === 0 || dC2 === 0) {
    H_ *= (h1deg + h2deg);
  }

  let T = 1.0 - 0.17*cos(Math.PI*(H_ - 30)/180);
  T += 0.24*cos(Math.PI*(2*H_)/180);
  T += 0.32*cos(Math.PI*(3*H_ + 6)/180);
  T += -0.20*cos(Math.PI*(4*H_ - 63)/180);

  let SL = 1 + (0.015*(L_ - 50.0)*(L_ - 50.0))/(sqrt(20 + (L_ - 50)*(L_ - 50)));
  let SC = 1 + 0.045*C_;
  let SH = 1 + 0.015*C_*T;
  let RT = -2*sqrt((C_7/(C_7 + twentyfive7)));
  RT *= sin(Math.PI*(60*exp(-(H_ - 275)/25))/180);

  let a = (dL/(kL*SL));
  let b = (dC/(kC*SC));
  let c = (dH/(kH*SH));
  let d = RT*(dC/(kC*SC))*(dH/(kH*SH));

  let dE00 = sqrt(a*a + b*b + c*c + d);
  return dE00/360.0;
}

export function colordis_not_diffusing(c1, c2) {
  return colordis(c1, c2);
  //XXX

  let dr = (c1[0] - c2[0]), dg = (c1[1] - c2[1]), db = (c1[2] - c2[2]);
  let dis = dr*dr + dg*dg + db*db;

  let w1 = 0.8;
  let w2 = 0.6;
  let w3 = 0.8;

  //w1=w2=w3=1.0;

  dis = (Math.abs(dr)*w1 + Math.abs(dg)*w2 + Math.abs(db)*w3)/(w1 + w2 + w3);
  //dis = dr*dr*w1*w1 + dg*dg*w2*w2 + db*db*w3*w3;
  //dis = dis > 0 ? Math.sqrt(dis) : 0;

  //dis = dis === 0.0 ? 0.0 : Math.sqrt(dis)/((w1+w2+w3)*Math.sqrt(3.0));

  if (c2[0] === c2[1] && c2[0] === c2[2]) {
    let dis2 = dis !== 0.0 ? Math.sqrt(dis) : 0.0;

    dis = 0.5*dis2 + 0.5*dis;
  }

  if (DITHER_COLORS) { //small random factor
    dis += (ditherSampler.random() - 0.5)*getDitherFac()*dis;
    dis = Math.max(dis, 0.0);
  }

  return dis;
}

export function colordis_simple(c1, c2) {
  return exports.colordis(c1, c2);
  let a = Math.abs(c1[0] - c2[0]);
  let b = Math.abs(c1[1] - c2[1]);
  let c = Math.abs(c1[2] - c2[2]);

  //const w1 = 100.0, w2 = 2.0, w3 = 3;
  const w1 = 3.0, w2 = 2.0, w3 = 3;

  return (a*w1 + b*w2 + c*w3)/(w1 + w2 + w3);
  //return Math.sqrt(a*a + b*b + c*c) / Math.sqrt(3.0);
}

export function rgb_colordis(c1, c2) {
  let w1 = 1, w2 = 0.8, w3 = 0.6;
  w1 = w2 = w3 = 1.0;

  let totw = 1.0/(w1 + w2 + w3);

  let dr = Math.abs(c1[0] - c2[0])*w1*totw;
  let dg = Math.abs(c1[1] - c2[1])*w2*totw;
  let db = Math.abs(c1[2] - c2[2])*w3*totw;

  return dr + dg + db;
}

export function old_rgb_colordis(c1, c2) {
  let dis1 = (c1[0] - c2[0])**2 + (c1[1] - c2[1])**2 + (c1[2] - c2[2])**2;
  let dis;

  let hsv1 = rgb_to_hsv(c1[0], c1[1], c1[2]);
  let hsv2 = rgb_to_hsv(c2[0], c2[1], c2[2]);

  /*
  if (hsv1[1] < 0.3)
    hsv1[1] = Math.pow(hsv1[1], 0.5);
  if (hsv2[1] < 0.3)
    hsv2[1] = Math.pow(hsv1[2], 0.5);
  //*/

  c1 = hsv1;
  c2 = hsv2;

  //c1 = hsv_to_rgb(hsv1[0], hsv1[1], hsv1[2]);
  //c2 = hsv_to_rgb(hsv2[0], hsv2[1], hsv2[2]);

  let dr = (c1[0] - c2[0]), dg = (c1[1] - c2[1]), db = (c1[2] - c2[2]);

  let w1 = 1.0;
  let w2 = 1.0;
  let w3 = 1.0;

  let wsum = w1 + w2 + w3;
  w1 /= wsum;
  w2 /= wsum;
  w3 /= wsum;

  dr *= w1;
  dg *= w2;
  db *= w3;

  //dis = Math.sqrt(dr*dr + dg*dg + db*db);
  dis = (Math.abs(dr) + Math.abs(dg) + Math.abs(db));

  //let sat = (Math.abs(dr-dis) + Math.abs(dg-dis) + Math.abs(db-dis))/3.0;
  //dis -= sat*0.4;

  /*
  //compare how saturated (close to greyscale) each color is, too
  let s1=0, s2=0;
  for (let i=0; i<2; i++) {
    let c = i ? c2 : c1;

    let avg = (c[0] + c[1] + c[2])/3.0;
    let sat = Math.sqrt((c[0]-avg)*(c[0]-avg) + (c[1]-avg)*(c[1]-avg) + (c[2]-avg)*(c[2]-avg));

    if (i)
      s2 = sat;
    else
      s1 = sat;
  }

  dis += Math.abs(s1-s2)*0.5;
  //*/

  /*
  if (c2[0] === c2[1] && c2[0] === c2[2]) {
    let dis2 = dr*dr + dg*dg + db*db;
    dis2 = dis2 !== 0.0 ? Math.sqrt(dis2) : 0.0;

    dis = 0.5*dis2 + 0.5*dis;
  }//*/

  return dis;
}

let _closest_color2_tmp = [0, 0, 0];
let closest_color2_rets = new util.cachering(function () {
  return [0, 0, 0];
}, 256);

export function closest_color2(f, c1, nextout, ditherfac) {
  let c4 = _closest_color2_tmp;
  let mindis = 1e17;
  let ret1 = -1, ret2 = -1;

  ditherfac = ditherfac === undefined ? 0.0 : ditherfac;

  for (let i = 0; i < colors.length; i++) {
    let c2 = colors[i];

    for (let j = 0; j < colors.length; j++) {
      let c3 = colors[j];

      //if (j === i)
      //    continue;

      for (let k = 0; k < 3; k++) {
        let w = f//c1[k];
        w = w;
        //w *= w*w*w*w;
        w = Math.min(Math.max(w, 0.0), 1.0);

        c4[k] = c2[k] + (c3[k] - c2[k])*w;
      }

      let dis;

      if (0) {
        let dx = Math.abs(c1[0] - c4[0]);
        let dy = Math.abs(c1[1] - c4[1]);
        let dz = Math.abs(c1[2] - c4[2]);

        dis = dx*dx + dy*dy + dz*dz;
        //dis = dx*0.3 + dy*0.5 + dz*0.2;
      }

      dis = colordis(c1, c4, ditherfac);
      if (isNaN(dis)) throw new Error("nan!");

      let dadd = 0.0;//(exports.ditherSampler.random()-0.5)*2.0*ditherfac;

      if (dis < mindis + dadd) {
        mindis = dis;
        ret1 = i;
        ret2 = j;
      }
    }
  }

  if (ret1 < 0) {
    console.trace("eek in closest_color2!");
    return undefined; //eek!
  }

  let ret = closest_color2_rets.next();

  ret[0] = ret1;
  ret[1] = ret2;
  ret[2] = mindis;

  return ret;
}

let _cwc = [0, 0, 0];
/*
  on factor;
  off period;

  f1 := w1*r1 + w2*r2 + w3*r3 = cr;
  f2 := w1*g1 + w2*g2 + w3*g3 = cg;
  f3 := w1*b1 + w2*b2 + w3*b3 = cb;
  f := solve({f1, f2, f3}, {w1, w2, w3});

  part(f, 1, 1, 2);
  part(f, 1, 2, 2);

*/

let _cc_tmp1 = new Array();
let _cc_tmp2 = new Array();

export function closest_color_lab(c1, nextout, ditherfac, not_diffusing) {
  let mindis = undefined;
  let mindis2 = undefined, mindis3 = undefined, mindis4 = undefined, mindis5 = undefined;
  let ret = undefined;
  let ret2 = undefined, ret3 = undefined, ret4 = undefined, ret5 = undefined;

  ditherfac = ditherfac === undefined ? 0.0 : ditherfac;
  let dfac = ditherfac;

  let minret = -1, minretdis = 1e17;

  c1 = rgb_to_lab(c1[0], c1[1], c1[2]);

  _cc_tmp1.length = lab_colors.length;
  _cc_tmp2.length = lab_colors.length;

  for (let i = 0; i < lab_colors.length; i++) {
    let c2 = lab_colors[i];
    let dis = lab_colordis(c1, c2);

    _cc_tmp1[i] = i;
    _cc_tmp2[i] = dis; // - dfac;
  }

  _cc_tmp1.sort((a, b) => _cc_tmp2[a] - _cc_tmp2[b]);

  if (nextout) {
    let nlen = Math.min(nextout.length, _cc_tmp1.length);

    for (let i = 0; i < nlen; i++) {
      nextout[i] = _cc_tmp1[i];
    }
  }

  return _cc_tmp1[0];
}

export function closest_color(c1, nextout, ditherfac, not_diffusing) {
  let mindis = undefined;
  let mindis2 = undefined, mindis3 = undefined, mindis4 = undefined, mindis5 = undefined;
  let ret = undefined;
  let ret2 = undefined, ret3 = undefined, ret4 = undefined, ret5 = undefined;

  ditherfac = ditherfac === undefined ? 0.0 : ditherfac;
  let dfac = ditherfac;

  let minret = -1, minretdis = 1e17;

  _cc_tmp1.length = colors.length;
  _cc_tmp2.length = colors.length;

  let mini = undefined;

  for (let i = 0; i < colors.length; i++) {
    let c2 = colors[i];
    let dis = not_diffusing ? colordis_not_diffusing(c1, c2) : colordis(c1, c2);

    //dis += -dfac; //dfac !== 0.0 ? Math.fract(dis + dfac) : dis;
    dis += (ditherSampler.random() - 0.5)*getDitherFac()*dfac;
    dis = Math.max(dis, 0.0);

    if (nextout !== undefined) {
      _cc_tmp1[i] = i;
      _cc_tmp2[i] = dis
    }

    if (mindis === undefined || (dis < mindis && dis > 0)) {
      mindis = dis;
      mini = i;
    }
  }

  //don't need fully sorted distance list?
  if (nextout === undefined) {
    return mini;
  }

  for (let i = 0; i < _cc_tmp2.length; i++) {
    //*
    if (_cc_tmp2[i] < 0) {
      _cc_tmp2.pop_i(i);
      _cc_tmp1.pop_i(i);
      i--;
    }//*/
  }

  _cc_tmp1.sort((a, b) => _cc_tmp2[a] - _cc_tmp2[b]);
  //_cc_tmp2.sort();

  if (nextout) {
    let nlen = Math.min(nextout.length, _cc_tmp1.length);

    for (let i = 0; i < nlen; i++) {
      nextout[i] = _cc_tmp1[i];
    }
  }

  ditherfac = Math.max(Math.min(ditherfac, 0.999999), 0.0);

  let ci = 0;//~~(ditherfac*Math.min(colors.length, 3.0));

  return _cc_tmp1[ci];
}

_cwc = [0, 0, 0];
/*
  on factor;
  off period;

  f1 := w1*r1 + w2*r2 + w3*r3 = cr;
  f2 := w1*g1 + w2*g2 + w3*g3 = cg;
  f3 := w1*b1 + w2*b2 + w3*b3 = cb;
  f := solve({f1, f2, f3}, {w1, w2, w3});

  part(f, 1, 1, 2);
  part(f, 1, 2, 2);

*/

let barycentric_rets = new util.cachering(function () {
  return [0, 0, 0];
}, 32);

export function barycentric(c, c1, c2, c3) {
  let r1 = c1[0], g1 = c1[1], b1 = c1[2];
  let r2 = c2[0], g2 = c2[1], b2 = c2[2];
  let r3 = c3[0], g3 = c3[1], b3 = c3[2];
  let cr = c[0], cg = c[1], cb = c[2];

  let w1 = ((cg*r3 - cr*g3)*b2 - (g2*r3 - g3*r2)*cb - (cg*r2 - cr*g2)*b3)/(0.00001 + (g1*
    r3 - g3*r1)*b2 - (g2*r3 - g3*r2)*b1 - (g1*r2 - g2*r1)*b3);
  let w2 = (-((cg*r3 - cr*g3)*b1 - (g1*r3 - g3*r1)*cb) + (cg*r1 - cr*g1)*b3)/(0.00001 + (
    g1*r3 - g3*r1)*b2 - (g2*r3 - g3*r2)*b1 - (g1*r2 - g2*r1)*b3);
  let w3 = ((cg*r2 - cr*g2)*b1 - (g1*r2 - g2*r1)*cb - (cg*r1 - cr*g1)*b2)/(0.00001 + (g1*
    r3 - g3*r1)*b2 - (g2*r3 - g3*r2)*b1 - (g1*r2 - g2*r1)*b3);

  let ret = barycentric_rets.next();

  ret[0] = w1;
  ret[1] = w2;
  ret[2] = w3;

  return ret;
}

export function colorweight(r, g, b) {
  let wr = 0, wg = 0, wb = 0;
  let c = _cwc, tot = 0;
  let ret = new Array(colors.length);

  ret.fill(0, 0, ret.length);

  c[0] = r;
  c[1] = g;
  c[2] = b;

  for (let i = 0; i < colors.length; i++) {
    let i1 = (i + colors.length - 1)%colors.length;
    let i2 = i, i3 = (i + 1)%colors.length;

    let c1 = colors[i1];
    let c2 = colors[i2];
    let c3 = colors[i3];

    let w = barycentric(c, c1, c2, c3);
    let dis = colordis(c, c2);

    let w2 = 1.0/(dis + 0.0001);

    //ret[i1] += w[0]*w2;
    ret[i2] += w2*w2*w2;
    //ret[i3] += w[2]*w2;

    tot += w2*w2*w2;
  }

  //tot=0;
  for (let i = 0; i < colors.length; i++) {
    //tot += ret[i];
  }

  for (let i = 0; i < colors.length; i++) {
    ret[i] /= tot;
  }

  let sr = 0, sg = 0, sb = 0;
  for (let i = 0; i < colors.length; i++) {
    sr += colors[i][0]*ret[i];
    sg += colors[i][1]*ret[i];
    sb += colors[i][2]*ret[i];
  }

  //console.log(sr, sg, sb);
  //console.log(c);
  return ret;
}

export function rgb_to_intensity(r, g, b) {
  //const w1 = 0.8, s2 = 1.0, w3 = 0.6;
  const w1 = 0.4026, w2 = 0.405, w3 = 0.2022;
  return (r*w1 + g*w2 + b*w3)/(w1 + w2 + w3);
}

let rgb_to_rgb_rets = util.cachering.fromConstructor(Vector3, 512);
let rgb_to_rgb = function (r, g, b) {
  let c = rgb_to_rgb_rets.next();

  c[0] = r;
  c[1] = g;
  c[2] = b;

  return c;
};


export function rgb_to_saturation(r, g, b) {
  let w1 = 1, w2 = 0.8, w3 = 0.7;
  let totw = 1.0/(w1 + w2 + w3);

  r *= w1*totw;
  g *= w2*totw;
  b *= w3*totw;

  let avg = (r + g + b)/3.0;

  let dr = Math.abs(r - avg);
  let dg = Math.abs(g - avg);
  let db = Math.abs(b - avg);

  return (dr + dg + db)/3.0;
};

let colorspace = 0;
let spacestack = [];

export function pushColorSpace(space) {
  spacestack.push(colorspace);
  setColorSpace(space);
}

export function popColorSpace() {
  let space = spacestack.pop();

  setColorSpace(space);

  return space;
}

export var rgb_to_internal;
export var internal_to_rgb;
export var internal_to_intensity;
export var internal_to_saturation;
export var colordis;

export function setColorSpace(space) {
  colorspace = space;

  switch (space) {
    case ColorSpaces.XYZ:
      rgb_to_internal = rgb_to_xyz;
      internal_to_rgb = xyz_to_rgb;
      internal_to_intensity = xyz_to_intensity;
      internal_to_saturation = xyz_to_saturation;
      colordis = xyz_colordis;
      break;
    case ColorSpaces.LAB:
      rgb_to_internal = rgb_to_lab;
      internal_to_rgb = lab_to_rgb;
      internal_to_intensity = lab_to_intensity;
      internal_to_saturation = lab_to_saturation;
      colordis = lab_colordis;
      break;
    case ColorSpaces.RGB:
      rgb_to_internal = rgb_to_rgb;
      internal_to_rgb = rgb_to_rgb;
      internal_to_intensity = rgb_to_intensity;
      internal_to_saturation = rgb_to_saturation;
      colordis = rgb_colordis;
      break;
  }
}

setColorSpace(ColorSpaces.XYZ);

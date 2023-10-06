import * as util from './util.js';
import * as vectormath from './vectormath.js';

//XXX refactor to use es6 classes,
//    or at last the class system in typesystem.js
function init_prototype(cls, proto) {
  for (let k in proto) {
    cls.prototype[k] = proto[k];
  }

  return cls.prototype;
}

function inherit(cls, parent, proto) {
  cls.prototype = Object.create(parent.prototype);

  for (let k in proto) {
    cls.prototype[k] = proto[k];
  }

  return cls.prototype;
}

let Vector2 = vectormath.Vector2, Vector3 = vectormath.Vector3;
let Vector4 = vectormath.Vector4, Matrix4 = vectormath.Matrix4;

let set = util.set;

//everything below here was compiled from es6 code
//variables starting with $ are function static local vars,
//like in C.  don't use them outside their owning functions.
//
//except for $_mh and $_swapt.  they were used with a C macro
//preprocessor.
let $_mh, $_swapt;

export const feps = 2.22e-16;

export const COLINEAR = 1;
export const LINECROSS = 2;
export const COLINEAR_ISECT = 3;

let _cross_vec1 = new Vector3();
let _cross_vec2 = new Vector3();

export const SQRT2 = Math.sqrt(2);
export const FEPS_DATA = {
  F16: 1.11e-16,
  F32: 5.96e-08,
  F64: 4.88e-04
};

/*use 32 bit epsilon by default, since we're often working from
  32-bit float data.  note that javascript uses 64-bit doubles
  internally.*/
export const FEPS = FEPS_DATA.F32;
export let FLOAT_MIN = -1e+21;
export let FLOAT_MAX = 1e+22;
export const Matrix4UI = Matrix4;

/*
let Matrix4UI=exports.Matrix4UI = function(loc, rot, size) {
  if (rot==undefined) {
      rot = undefined;
  }

  if (size==undefined) {
      size = undefined;
  }

  Object.defineProperty(this, "loc", {get: function() {
    let t=new Vector3();
    this.decompose(t);
    return t;
  }, set: function(loc) {
    let l=new Vector3(), r=new Vector3(), s=new Vector3();
    this.decompose(l, r, s);
    this.calc(loc, r, s);
  }});

  Object.defineProperty(this, "size", {get: function() {
    let t=new Vector3();
    this.decompose(undefined, undefined, t);
    return t;
  }, set: function(size) {
    let l=new Vector3(), r=new Vector3(), s=new Vector3();
    this.decompose(l, r, s);
    this.calc(l, r, size);
  }});

  Object.defineProperty(this, "rot", {get: function() {
    let t=new Vector3();
    this.decompose(undefined, t);
    return t;
  }, set: function(rot) {
    let l=new Vector3(), r=new Vector3(), s=new Vector3();
    this.decompose(l, r, s);
    this.calc(l, rot, s);
  }});

  if (loc instanceof Matrix4) {
      this.load(loc);
      return ;
  }

  if (rot==undefined)
    rot = [0, 0, 0];
  if (size==undefined)
    size = [1.0, 1.0, 1.0];
  this.makeIdentity();
  this.calc(loc, rot, size);
}

Matrix4UI.prototype = inherit(Matrix4UI, Matrix4, {
  calc : function(loc, rot, size) {
    this.rotate(rot[0], rot[1], rot[2]);
    this.scale(size[0], size[1], size[2]);
    this.translate(loc[0], loc[1], loc[2]);
  }

});
*/

if (FLOAT_MIN !== FLOAT_MIN || FLOAT_MAX !== FLOAT_MAX) {
  FLOAT_MIN = 1e-05;
  FLOAT_MAX = 1000000.0;
  console.log("Floating-point 16-bit system detected!");
}

let _static_grp_points4 = new Array(4);
let _static_grp_points8 = new Array(8);

export function get_rect_points(p, size) {
  let cs;
  if (p.length === 2) {
    cs = _static_grp_points4;
    cs[0] = p;
    cs[1] = [p[0] + size[0], p[1]];
    cs[2] = [p[0] + size[0], p[1] + size[1]];
    cs[3] = [p[0], p[1] + size[1]];
  } else if (p.length === 3) {
    cs = _static_grp_points8;
    cs[0] = p;
    cs[1] = [p[0] + size[0], p[1], p[2]];
    cs[2] = [p[0] + size[0], p[1] + size[1], p[2]];
    cs[3] = [p[0], p[1] + size[0], p[2]];
    cs[4] = [p[0], p[1], p[2] + size[2]];
    cs[5] = [p[0] + size[0], p[1], p[2] + size[2]];
    cs[6] = [p[0] + size[0], p[1] + size[1], p[2] + size[2]];
    cs[7] = [p[0], p[1] + size[0], p[2] + size[2]];
  } else {
    throw "get_rect_points has no implementation for " + p.length + "-dimensional data";
  }
  return cs;
}

export function get_rect_lines(p, size) {
  let ps = get_rect_points(p, size);
  if (p.length === 2) {
    return [[ps[0], ps[1]], [ps[1], ps[2]], [ps[2], ps[3]], [ps[3], ps[0]]];
  } else if (p.length === 3) {
    let l1 = [[ps[0], ps[1]], [ps[1], ps[2]], [ps[2], ps[3]], [ps[3], ps[0]]];
    let l2 = [[ps[4], ps[5]], [ps[5], ps[6]], [ps[6], ps[7]], [ps[7], ps[4]]];
    l1.concat(l2);
    l1.push([ps[0], ps[4]]);
    l1.push([ps[1], ps[5]]);
    l1.push([ps[2], ps[6]]);
    l1.push([ps[3], ps[7]]);
    return l1;
  } else {
    throw "get_rect_points has no implementation for " + p.length + "-dimensional data";
  }
}

let $vs_simple_tri_aabb_isect = [0, 0, 0];

export function simple_tri_aabb_isect(v1, v2, v3, min, max) {
  $vs_simple_tri_aabb_isect[0] = v1;
  $vs_simple_tri_aabb_isect[1] = v2;
  $vs_simple_tri_aabb_isect[2] = v3;
  for (let i = 0; i < 3; i++) {
    let isect = true;
    for (let j = 0; j < 3; j++) {
      if ($vs_simple_tri_aabb_isect[j][i] < min[i] || $vs_simple_tri_aabb_isect[j][i] >= max[i])
        isect = false;
    }
    if (isect)
      return true;
  }
  return false;
}

export class MinMax {
  constructor(totaxis) {
    if (totaxis === undefined) {
      totaxis = 1;
    }
    this.totaxis = totaxis;
    if (totaxis !== 1) {
      this._min = new Array(totaxis);
      this._max = new Array(totaxis);
      this.min = new Array(totaxis);
      this.max = new Array(totaxis);
    } else {
      this.min = this.max = 0;
      this._min = FLOAT_MAX;
      this._max = FLOAT_MIN;
    }
    this.reset();
    this._static_mr_co = new Array(this.totaxis);
    this._static_mr_cs = new Array(this.totaxis*this.totaxis);
  }

  load(mm) {
    if (this.totaxis === 1) {
      this.min = mm.min;
      this.max = mm.max;
      this._min = mm.min;
      this._max = mm.max;
    } else {
      this.min = new Vector3(mm.min);
      this.max = new Vector3(mm.max);
      this._min = new Vector3(mm._min);
      this._max = new Vector3(mm._max);
    }
  }

  reset() {
    let totaxis = this.totaxis;
    if (totaxis === 1) {
      this.min = this.max = 0;
      this._min = FLOAT_MAX;
      this._max = FLOAT_MIN;
    } else {
      for (let i = 0; i < totaxis; i++) {
        this._min[i] = FLOAT_MAX;
        this._max[i] = FLOAT_MIN;
        this.min[i] = 0;
        this.max[i] = 0;
      }
    }
  }

  minmax_rect(p, size) {
    let totaxis = this.totaxis;
    let cs = this._static_mr_cs;
    if (totaxis === 2) {
      cs[0] = p;
      cs[1] = [p[0] + size[0], p[1]];
      cs[2] = [p[0] + size[0], p[1] + size[1]];
      cs[3] = [p[0], p[1] + size[1]];
    } else if (totaxis = 3) {
      cs[0] = p;
      cs[1] = [p[0] + size[0], p[1], p[2]];
      cs[2] = [p[0] + size[0], p[1] + size[1], p[2]];
      cs[3] = [p[0], p[1] + size[0], p[2]];
      cs[4] = [p[0], p[1], p[2] + size[2]];
      cs[5] = [p[0] + size[0], p[1], p[2] + size[2]];
      cs[6] = [p[0] + size[0], p[1] + size[1], p[2] + size[2]];
      cs[7] = [p[0], p[1] + size[0], p[2] + size[2]];
    } else {
      throw "Minmax.minmax_rect has no implementation for " + totaxis + "-dimensional data";
    }
    for (let i = 0; i < cs.length; i++) {
      this.minmax(cs[i]);
    }
  }

  minmax(p) {
    let totaxis = this.totaxis;

    if (totaxis === 1) {
      this._min = this.min = Math.min(this._min, p);
      this._max = this.max = Math.max(this._max, p);
    } else if (totaxis === 2) {
      this._min[0] = this.min[0] = Math.min(this._min[0], p[0]);
      this._min[1] = this.min[1] = Math.min(this._min[1], p[1]);
      this._max[0] = this.max[0] = Math.max(this._max[0], p[0]);
      this._max[1] = this.max[1] = Math.max(this._max[1], p[1]);
    } else if (totaxis === 3) {
      this._min[0] = this.min[0] = Math.min(this._min[0], p[0]);
      this._min[1] = this.min[1] = Math.min(this._min[1], p[1]);
      this._min[2] = this.min[2] = Math.min(this._min[2], p[2]);
      this._max[0] = this.max[0] = Math.max(this._max[0], p[0]);
      this._max[1] = this.max[1] = Math.max(this._max[1], p[1]);
      this._max[2] = this.max[2] = Math.max(this._max[2], p[2]);
    } else {
      for (let i = 0; i < totaxis; i++) {
        this._min[i] = this.min[i] = Math.min(this._min[i], p[i]);
        this._max[i] = this.max[i] = Math.max(this._max[i], p[i]);
      }
    }
  }

  static fromSTRUCT(reader) {
    let ret = new MinMax();
    reader(ret);
    return ret;
  }
}

MinMax.STRUCT = "\n  math.MinMax {\n    min     : vec3;\n    max     : vec3;\n    _min    : vec3;\n    _max    : vec3;\n    totaxis : int;\n  }\n";

export function winding(a, b, c, zero_z, tol) {
  let dx1 = b[0] - a[0];
  let dy1 = b[1] - a[1];
  let dx2 = c[0] - a[0];
  let dy2 = c[1] - a[1];

  return (dx1*dy2 - dx2*dy1) > 0.0;
}

export function inrect_2d(p, pos, size) {
  if (p === undefined || pos === undefined || size === undefined) {
    console.trace();
    console.log("Bad paramters to inrect_2d()");
    console.log("p: ", p, ", pos: ", pos, ", size: ", size);
    return false;
  }
  return p[0] >= pos[0] && p[0] <= pos[0] + size[0] && p[1] >= pos[1] && p[1] <= pos[1] + size[1];
}

let $smin_aabb_isect_line_2d = new Vector2();
let $ssize_aabb_isect_line_2d = new Vector2();
let $sv1_aabb_isect_line_2d = new Vector2();
let $ps_aabb_isect_line_2d = [new Vector2(), new Vector2(), new Vector2()];
let $l1_aabb_isect_line_2d = [0, 0];
let $smax_aabb_isect_line_2d = new Vector2();
let $sv2_aabb_isect_line_2d = new Vector2();
let $l2_aabb_isect_line_2d = [0, 0];

export function aabb_isect_line_2d(v1, v2, min, max) {
  for (let i = 0; i < 2; i++) {
    $smin_aabb_isect_line_2d[i] = Math.min(min[i], v1[i]);
    $smax_aabb_isect_line_2d[i] = Math.max(max[i], v2[i]);
  }
  $smax_aabb_isect_line_2d.sub($smin_aabb_isect_line_2d);
  $ssize_aabb_isect_line_2d.load(max).sub(min);
  if (!aabb_isect_2d($smin_aabb_isect_line_2d, $smax_aabb_isect_line_2d, min, $ssize_aabb_isect_line_2d))
    return false;
  for (let i = 0; i < 4; i++) {
    if (inrect_2d(v1, min, $ssize_aabb_isect_line_2d))
      return true;
    if (inrect_2d(v2, min, $ssize_aabb_isect_line_2d))
      return true;
  }
  $ps_aabb_isect_line_2d[0] = min;
  $ps_aabb_isect_line_2d[1][0] = min[0];
  $ps_aabb_isect_line_2d[1][1] = max[1];
  $ps_aabb_isect_line_2d[2] = max;
  $ps_aabb_isect_line_2d[3][0] = max[0];
  $ps_aabb_isect_line_2d[3][1] = min[1];
  $l1_aabb_isect_line_2d[0] = v1;
  $l1_aabb_isect_line_2d[1] = v2;
  for (let i = 0; i < 4; i++) {
    let a = $ps_aabb_isect_line_2d[i], b = $ps_aabb_isect_line_2d[(i + 1)%4];
    $l2_aabb_isect_line_2d[0] = a;
    $l2_aabb_isect_line_2d[1] = b;
    if (line_line_cross($l1_aabb_isect_line_2d, $l2_aabb_isect_line_2d))
      return true;
  }
  return false;
}

export function aabb_isect_2d(pos1, size1, pos2, size2) {
  let ret = 0;
  for (let i = 0; i < 2; i++) {
    let a = pos1[i];
    let b = pos1[i] + size1[i];
    let c = pos2[i];
    let d = pos2[i] + size2[i];
    if (b >= c && a <= d)
      ret += 1;
  }
  return ret === 2;
}
;

export function expand_rect2d(pos, size, margin) {
  pos[0] -= Math.floor(margin[0]);
  pos[1] -= Math.floor(margin[1]);
  size[0] += Math.floor(margin[0]*2.0);
  size[1] += Math.floor(margin[1]*2.0);
}
;

export function expand_line(l, margin) {
  let c = new Vector3();
  c.add(l[0]);
  c.add(l[1]);
  c.mulScalar(0.5);
  l[0].sub(c);
  l[1].sub(c);
  let l1 = l[0].vectorLength();
  let l2 = l[1].vectorLength();
  l[0].normalize();
  l[1].normalize();
  l[0].mulScalar(margin + l1);
  l[1].mulScalar(margin + l2);
  l[0].add(c);
  l[1].add(c);
  return l;
}


export function colinear(a, b, c) {
  for (let i = 0; i < 3; i++) {
    _cross_vec1[i] = b[i] - a[i];
    _cross_vec2[i] = c[i] - a[i];
  }
  let limit = 2.2e-16;
  if (a.vectorDistance(b) < feps*100 && a.vectorDistance(c) < feps*100) {
    return true;
  }
  if (_cross_vec1.dot(_cross_vec1) < limit || _cross_vec2.dot(_cross_vec2) < limit)
    return true;
  _cross_vec1.cross(_cross_vec2);
  return _cross_vec1.dot(_cross_vec1) < limit;
}

let _llc_l1 = [new Vector3(), new Vector3()];
let _llc_l2 = [new Vector3(), new Vector3()];
let _llc_l3 = [new Vector3(), new Vector3()];
let _llc_l4 = [new Vector3(), new Vector3()];

let lli_v1 = new Vector3(), lli_v2 = new Vector3(), lli_v3 = new Vector3(), lli_v4 = new Vector3();

let _zero_cn = new Vector3();
let _tmps_cn = util.cachering.fromConstructor(Vector3, 64);
let _rets_cn = util.cachering.fromConstructor(Vector3, 64);

//vec1, vec2 should both be normalized
export function corner_normal(vec1, vec2, width) {
  let ret = _rets_cn.next().zero();

  let vec = _tmps_cn.next().zero();
  vec.load(vec1).add(vec2).normalize();

  /*
  ret.load(vec).mulScalar(width);
  return ret;
  */

  //handle colinear case
  if (Math.abs(vec1.normalizedDot(vec2)) > 0.9999) {
    if (vec1.dot(vec2) > 0.0001) {
      ret.load(vec1).add(vec2).normalize();
    } else {
      ret.load(vec1).normalize();
    }

    ret.mulScalar(width);

    return ret;
  } else { //XXX
    //ret.load(vec).mulScalar(width);
    //return ret;
  }

  vec1 = _tmps_cn.next().load(vec1).mulScalar(width);
  vec2 = _tmps_cn.next().load(vec2).mulScalar(width);

  let p1 = _tmps_cn.next().load(vec1);
  let p2 = _tmps_cn.next().load(vec2);

  vec1.addFac(vec1, 0.01);
  vec2.addFac(vec2, 0.01);

  let sc = 1.0;

  p1[0] += vec1[1]*sc;
  p1[1] += -vec1[0]*sc;

  p2[0] += -vec2[1]*sc;
  p2[1] += vec2[0]*sc;

  let p = line_line_isect(vec1, p1, vec2, p2, false);

  if (p === undefined || p === COLINEAR_ISECT || p.dot(p) < 0.000001) {
    ret.load(vec1).add(vec2).normalize().mulScalar(width);
  } else {
    ret.load(p);

    if (vec.dot(vec) > 0 && vec.dot(ret) < 0) {
      ret.load(vec).mulScalar(width);
    }
  }

  return ret;
}

//test_segment is optional, true
export function line_line_isect(v1, v2, v3, v4, test_segment) {
  test_segment = test_segment === undefined ? true : test_segment;

  if (!line_line_cross(v1, v2, v3, v4)) {
    return undefined;
  }

  /*
  on factor;
  off period;

  xa := xa1 + (xa2 - xa1)*t1;
  xb := xb1 + (xb2 - xb1)*t2;
  ya := ya1 + (ya2 - ya1)*t1;
  yb := yb1 + (yb2 - yb1)*t2;

  f1 := xa - xb;
  f2 := ya - yb;

  f := solve({f1, f2}, {t1, t2});
  ft1 := part(f, 1, 1, 2);
  ft2 := part(f, 1, 2, 2);

  */

  let xa1 = v1[0], xa2 = v2[0], ya1 = v1[1], ya2 = v2[1];
  let xb1 = v3[0], xb2 = v4[0], yb1 = v3[1], yb2 = v4[1];

  let div = ((xa1 - xa2)*(yb1 - yb2) - (xb1 - xb2)*(ya1 - ya2));
  if (div < 0.00000001) { //parallel but intersecting lines.
    return COLINEAR_ISECT;
  } else { //intersection exists
    let t1 = (-((ya1 - yb2)*xb1 - (yb1 - yb2)*xa1 - (ya1 - yb1)*xb2))/div;

    return lli_v1.load(v1).interp(v2, t1);
  }
}

export function line_line_cross(v1, v2, v3, v4) {
  let l1 = _llc_l3, l2 = _llc_l4;
  l1[0].load(v1), l1[1].load(v2), l2[0].load(v3), l2[1].load(v4);

  /*
  let limit=feps*1000;
  if (Math.abs(l1[0].vectorDistance(l2[0])+l1[1].vectorDistance(l2[0])-l1[0].vectorDistance(l1[1]))<limit) {
      return true;
  }
  if (Math.abs(l1[0].vectorDistance(l2[1])+l1[1].vectorDistance(l2[1])-l1[0].vectorDistance(l1[1]))<limit) {
      return true;
  }
  if (Math.abs(l2[0].vectorDistance(l1[0])+l2[1].vectorDistance(l1[0])-l2[0].vectorDistance(l2[1]))<limit) {
      return true;
  }
  if (Math.abs(l2[0].vectorDistance(l1[1])+l2[1].vectorDistance(l1[1])-l2[0].vectorDistance(l2[1]))<limit) {
      return true;
  }
  //*/

  let a = l1[0];
  let b = l1[1];
  let c = l2[0];
  let d = l2[1];
  let w1 = winding(a, b, c);
  let w2 = winding(c, a, d);
  let w3 = winding(a, b, d);
  let w4 = winding(c, b, d);
  return (w1 === w2) && (w3 === w4) && (w1 !== w3);
}

let _asi_v1 = new Vector3();
let _asi_v2 = new Vector3();
let _asi_v3 = new Vector3();
let _asi_v4 = new Vector3();
let _asi_v5 = new Vector3();
let _asi_v6 = new Vector3();

export function point_in_aabb_2d(p, min, max) {
  return p[0] >= min[0] && p[0] <= max[0] && p[1] >= min[1] && p[1] <= max[1];
}

let _asi2d_v1 = new Vector2();
let _asi2d_v2 = new Vector2();
let _asi2d_v3 = new Vector2();
let _asi2d_v4 = new Vector2();
let _asi2d_v5 = new Vector2();
let _asi2d_v6 = new Vector2();

export function aabb_sphere_isect_2d(p, r, min, max) {
  let v1 = _asi2d_v1, v2 = _asi2d_v2, v3 = _asi2d_v3, mvec = _asi2d_v4;
  let v4 = _asi2d_v5;

  p = _asi2d_v6.load(p);
  v1.load(p);
  v2.load(p);

  min = _asi_v5.load(min);
  max = _asi_v6.load(max);

  mvec.load(max).sub(min).normalize().mulScalar(r + 0.0001);

  v1.sub(mvec);
  v2.add(mvec);
  v3.load(p);

  let ret = point_in_aabb_2d(v1, min, max) || point_in_aabb_2d(v2, min, max)
    || point_in_aabb_2d(v3, min, max);

  if (ret)
    return ret;

  /*
  v1.load(min).add(max).mulScalar(0.5);
  ret = ret || v1.vectorDistance(p) < r;

  v1.load(min);
  ret = ret || v1.vectorDistance(p) < r;

  v1.load(max);
  ret = ret || v1.vectorDistance(p) < r;

  v1[0] = min[0], v1[1] = max[1];
  ret = ret || v1.vectorDistance(p) < r;

  v1[0] = max[0], v1[1] = min[1];
  ret = ret || v1.vectorDistance(p) < r;
  */
  //*
  v1.load(min);
  v2[0] = min[0];
  v2[1] = max[1];
  ret = ret || dist_to_line_2d(p, v1, v2) < r;

  v1.load(max);
  v2[0] = max[0];
  v2[1] = max[1];
  ret = ret || dist_to_line_2d(p, v1, v2) < r;

  v1.load(max);
  v2[0] = max[0];
  v2[1] = min[1];
  ret = ret || dist_to_line_2d(p, v1, v2) < r;

  v1.load(max);
  v2[0] = min[0];
  v2[1] = min[1];
  ret = ret || dist_to_line_2d(p, v1, v2) < r;
  //*/
  return ret;
}

export function point_in_aabb(p, min, max) {
  return p[0] >= min[0] && p[0] <= max[0] && p[1] >= min[1] && p[1] <= max[1]
    && p[2] >= min[2] && p[2] <= max[2];
}

export function aabb_sphere_isect(p, r, min, max) {
  let v1 = _asi_v1, v2 = _asi_v2, v3 = _asi_v3, mvec = _asi_v4;
  min = _asi_v5.load(min);
  max = _asi_v6.load(max);

  if (min.length === 2) {
    min[2] = max[2] = 0.0;
  }

  mvec.load(max).sub(min).normalize().mulScalar(r + 0.0001);
  v1.sub(mvec);
  v2.add(mvec);
  v3.load(p);

  //prevent NaN on 2d vecs
  if (p.length === 2) {
    mvec[2] = v1[2] = v2[2] = v3[2] = 0.0;
  }

  return point_in_aabb(v1, min, max) || point_in_aabb(v2, min, max) ||
    point_in_aabb(v3, min, max);
}

export function point_in_tri(p, v1, v2, v3) {
  let w1 = winding(p, v1, v2);
  let w2 = winding(p, v2, v3);
  let w3 = winding(p, v3, v1);
  return w1 === w2 && w2 === w3;
}

export function convex_quad(v1, v2, v3, v4) {
  return line_line_cross([v1, v3], [v2, v4]);
}

let $e1_normal_tri = new Vector3();
let $e3_normal_tri = new Vector3();
let $e2_normal_tri = new Vector3();

export function normal_tri(v1, v2, v3) {
  $e1_normal_tri[0] = v2[0] - v1[0];
  $e1_normal_tri[1] = v2[1] - v1[1];
  $e1_normal_tri[2] = v2[2] - v1[2];
  $e2_normal_tri[0] = v3[0] - v1[0];
  $e2_normal_tri[1] = v3[1] - v1[1];
  $e2_normal_tri[2] = v3[2] - v1[2];
  $e3_normal_tri[0] = $e1_normal_tri[1]*$e2_normal_tri[2] - $e1_normal_tri[2]*$e2_normal_tri[1];
  $e3_normal_tri[1] = $e1_normal_tri[2]*$e2_normal_tri[0] - $e1_normal_tri[0]*$e2_normal_tri[2];
  $e3_normal_tri[2] = $e1_normal_tri[0]*$e2_normal_tri[1] - $e1_normal_tri[1]*$e2_normal_tri[0];

  let _len = Math.sqrt(($e3_normal_tri[0]*$e3_normal_tri[0] + $e3_normal_tri[1]*$e3_normal_tri[1] + $e3_normal_tri[2]*$e3_normal_tri[2]));
  if (_len > 1e-05)
    _len = 1.0/_len;
  $e3_normal_tri[0] *= _len;
  $e3_normal_tri[1] *= _len;
  $e3_normal_tri[2] *= _len;
  return $e3_normal_tri;
}

let $n2_normal_quad = new Vector3();

export function normal_quad(v1, v2, v3, v4) {
  let n = normal_tri(v1, v2, v3);
  $n2_normal_quad[0] = n[0];
  $n2_normal_quad[1] = n[1];
  $n2_normal_quad[2] = n[2];
  n = normal_tri(v1, v3, v4);
  $n2_normal_quad[0] = $n2_normal_quad[0] + n[0];
  $n2_normal_quad[1] = $n2_normal_quad[1] + n[1];
  $n2_normal_quad[2] = $n2_normal_quad[2] + n[2];
  let _len = Math.sqrt(($n2_normal_quad[0]*$n2_normal_quad[0] + $n2_normal_quad[1]*$n2_normal_quad[1] + $n2_normal_quad[2]*$n2_normal_quad[2]));
  if (_len > 1e-05)
    _len = 1.0/_len;
  $n2_normal_quad[0] *= _len;
  $n2_normal_quad[1] *= _len;
  $n2_normal_quad[2] *= _len;
  return $n2_normal_quad;
}

let _li_vi = new Vector3();

//calc_t is optional, false
export function line_isect(v1, v2, v3, v4, calc_t) {
  if (calc_t === undefined) {
    calc_t = false;
  }
  let div = (v2[0] - v1[0])*(v4[1] - v3[1]) - (v2[1] - v1[1])*(v4[0] - v3[0]);
  if (div === 0.0)
    return [new Vector3(), COLINEAR, 0.0];
  let vi = _li_vi;
  vi[0] = 0;
  vi[1] = 0;
  vi[2] = 0;
  vi[0] = ((v3[0] - v4[0])*(v1[0]*v2[1] - v1[1]*v2[0]) - (v1[0] - v2[0])*(v3[0]*v4[1] - v3[1]*v4[0]))/div;
  vi[1] = ((v3[1] - v4[1])*(v1[0]*v2[1] - v1[1]*v2[0]) - (v1[1] - v2[1])*(v3[0]*v4[1] - v3[1]*v4[0]))/div;
  if (calc_t || v1.length === 3) {
    let n1 = new Vector2(v2).sub(v1);
    let n2 = new Vector2(vi).sub(v1);
    let t = n2.vectorLength()/n1.vectorLength();
    n1.normalize();
    n2.normalize();
    if (n1.dot(n2) < 0.0) {
      t = -t;
    }
    if (v1.length === 3) {
      vi[2] = v1[2] + (v2[2] - v1[2])*t;
    }
    return [vi, LINECROSS, t];
  }
  return [vi, LINECROSS];
}

let dt2l_v1 = new Vector2();
let dt2l_v2 = new Vector2();
let dt2l_v3 = new Vector2();
let dt2l_v4 = new Vector2();
let dt2l_v5 = new Vector2();

export function dist_to_line_2d(p, v1, v2, clip) {
  if (clip === undefined) {
    clip = true;
  }

  v1 = dt2l_v4.load(v1);
  v2 = dt2l_v5.load(v2);

  let n = dt2l_v1;
  let vec = dt2l_v3;

  n.load(v2).sub(v1).normalize();
  vec.load(p).sub(v1);

  let t = vec.dot(n);
  if (clip) {
    t = Math.min(Math.max(t, 0.0), v1.vectorDistance(v2));
  }

  n.mulScalar(t).add(v1);

  return n.vectorDistance(p);
}

let dt3l_v1 = new Vector3();
let dt3l_v2 = new Vector3();
let dt3l_v3 = new Vector3();
let dt3l_v4 = new Vector3();
let dt3l_v5 = new Vector3();

export function dist_to_line(p, v1, v2, clip) {
  if (clip === undefined) {
    clip = true;
  }

  v1 = dt3l_v4.load(v1);
  v2 = dt3l_v5.load(v2);

  let n = dt3l_v1;
  let vec = dt3l_v3;

  n.load(v2).sub(v1).normalize();
  vec.load(p).sub(v1);

  let t = vec.dot(n);
  if (clip) {
    t = Math.min(Math.max(t, 0.0), v1.vectorDistance(v2));
  }

  n.mulScalar(t).add(v1);

  return n.vectorDistance(p);
}

//p cam be 2d, 3d, or 4d point, v1/v2 however must be full homogenous coordinates
let _cplw_vs4 = util.cachering.fromConstructor(Vector4, 64);
let _cplw_vs3 = util.cachering.fromConstructor(Vector3, 64);
let _cplw_vs2 = util.cachering.fromConstructor(Vector2, 64);

function wclip(x1, x2, w1, w2, near) {
  let r1 = near*w1 - x1;
  let r2 = (w1 - w2)*near - (x1 - x2);

  if (r2 === 0.0) return 0.0;

  return r1/r2;
}

function clip(a, b, znear) {
  if (a - b === 0.0) return 0.0;

  return (a - znear)/(a - b);
}

/*clips v1 and v2 to lie within homogenous projection range
  v1 and v2 are assumed to be projected, pre-division Vector4's
  returns a positive number (how much the line was scaled) if either _v1 or _v2 are
  in front of the near clipping plane otherwise, returns 0
 */
export function clip_line_w(_v1, _v2, znear, zfar) {
  let v1 = _cplw_vs4.next().load(_v1);
  let v2 = _cplw_vs4.next().load(_v2);

  //are we fully behind the view plane?
  if ((v1[2] < 1.0 && v2[2] < 1.0))
    return false;

  function doclip1(v1, v2, axis) {
    if (v1[axis]/v1[3] < -1) {
      let t = wclip(v1[axis], v2[axis], v1[3], v2[3], -1);
      v1.interp(v2, t);
    } else if (v1[axis]/v1[3] > 1) {
      let t = wclip(v1[axis], v2[axis], v1[3], v2[3], 1);
      v1.interp(v2, t);
    }
  }

  function doclip(v1, v2, axis) {
    doclip1(v1, v2, axis);
    doclip1(v2, v1, axis);
  }

  function dozclip(v1, v2) {
    if (v1[2] < 1) {
      let t = clip(v1[2], v2[2], 1);
      v1.interp(v2, t);
    } else if (v2[2] < 1) {
      let t = clip(v2[2], v1[2], 1);
      v2.interp(v1, t);
    }
  }

  dozclip(v1, v2, 1);
  doclip(v1, v2, 0);
  doclip(v1, v2, 1);

  for (let i = 0; i < 4; i++) {
    _v1[i] = v1[i];
    _v2[i] = v2[i];
  }

  return !(v1[0]/v1[3] === v2[0]/v2[3] || v1[1]/v2[3] === v2[1]/v2[3]);
}

//clip is optional, true.  clip point to lie within line segment v1->v2
let _closest_point_on_line_cache = util.cachering.fromConstructor(Vector3, 64);
let _closest_point_rets = new util.cachering(function () {
  return [0, 0];
}, 64);

let _closest_tmps = [new Vector3(), new Vector3(), new Vector3()];

export function closest_point_on_line(p, v1, v2, clip) {
  if (clip === undefined)
    clip = true;
  let l1 = _closest_tmps[0], l2 = _closest_tmps[1];

  l1.load(v2).sub(v1).normalize();
  l2.load(p).sub(v1);

  let t = l2.dot(l1);
  if (clip) {
    t = t*(t < 0.0) + t*(t > 1.0) + (t > 1.0);
  }

  p = _closest_point_on_line_cache.next();
  p.load(l1).mulScalar(t).add(v1);
  let ret = _closest_point_rets.next();

  ret[0] = p;
  ret[1] = t;

  return ret;
}

/*given input line (a,d) and tangent t,
  returns a circle that goes through both
  a and d, whose normalized tangent at a is the same
  as normalized t.

  note that t need not be normalized, this function
  does that itself*/
let _circ_from_line_tan_vs = util.cachering.fromConstructor(Vector3, 32);
let _circ_from_line_tan_ret = new util.cachering(function () {
  return [new Vector3(), 0];
});

export function circ_from_line_tan(a, b, t) {
  let p1 = _circ_from_line_tan_vs.next();
  let t2 = _circ_from_line_tan_vs.next();
  let n1 = _circ_from_line_tan_vs.next();

  p1.load(a).sub(b);
  t2.load(t).normalize();
  n1.load(p1).normalize().cross(t2).cross(t2).normalize();

  let ax = p1[0], ay = p1[1], az = p1[2], nx = n1[0], ny = n1[1], nz = n1[2];
  let r = -(ax*ax + ay*ay + az*az)/(2*(ax*nx + ay*ny + az*nz));

  let ret = _circ_from_line_tan_ret.next();
  ret[0].load(n1).mulScalar(r).add(a)
  ret[1] = r;

  return ret;
}

let _gtc_e1 = new Vector3();
let _gtc_e2 = new Vector3();
let _gtc_e3 = new Vector3();
let _gtc_p1 = new Vector3();
let _gtc_p2 = new Vector3();
let _gtc_v1 = new Vector3();
let _gtc_v2 = new Vector3();
let _gtc_p12 = new Vector3();
let _gtc_p22 = new Vector3();
let _get_tri_circ_ret = new util.cachering(function () {
  return [0, 0]
});

export function get_tri_circ(a, b, c) {
  let v1 = _gtc_v1;
  let v2 = _gtc_v2;
  let e1 = _gtc_e1;
  let e2 = _gtc_e2;
  let e3 = _gtc_e3;
  let p1 = _gtc_p1;
  let p2 = _gtc_p2;

  for (let i = 0; i < 3; i++) {
    e1[i] = b[i] - a[i];
    e2[i] = c[i] - b[i];
    e3[i] = a[i] - c[i];
  }

  for (let i = 0; i < 3; i++) {
    p1[i] = (a[i] + b[i])*0.5;
    p2[i] = (c[i] + b[i])*0.5;
  }

  e1.normalize();

  v1[0] = -e1[1];
  v1[1] = e1[0];
  v1[2] = e1[2];

  v2[0] = -e2[1];
  v2[1] = e2[0];
  v2[2] = e2[2];

  v1.normalize();
  v2.normalize();

  let cent;
  let type;
  for (let i = 0; i < 3; i++) {
    _gtc_p12[i] = p1[i] + v1[i];
    _gtc_p22[i] = p2[i] + v2[i];
  }

  ret = line_isect(p1, _gtc_p12, p2, _gtc_p22);
  cent = ret[0];
  type = ret[1];

  e1.load(a);
  e2.load(b);
  e3.load(c);

  let r = e1.sub(cent).vectorLength();
  if (r < feps)
    r = e2.sub(cent).vectorLength();
  if (r < feps)
    r = e3.sub(cent).vectorLength();

  let ret = _get_tri_circ_ret.next();
  ret[0] = cent;
  ret[1] = r;

  return ret;
}

export function gen_circle(m, origin, r, stfeps) {
  let pi = Math.PI;
  let f = -pi/2;
  let df = (pi*2)/stfeps;
  let verts = new Array();
  for (let i = 0; i < stfeps; i++) {
    let x = origin[0] + r*Math.sin(f);
    let y = origin[1] + r*Math.cos(f);
    let v = m.make_vert(new Vector3([x, y, origin[2]]));
    verts.push(v);
    f += df;
  }
  for (let i = 0; i < verts.length; i++) {
    let v1 = verts[i];
    let v2 = verts[(i + 1)%verts.length];
    m.make_edge(v1, v2);
  }
  return verts;
}

let cos = Math.cos;
let sin = Math.sin;

//axis is optional, 0
export function rot2d(v1, A, axis) {
  let x = v1[0];
  let y = v1[1];

  if (axis === 1) {
    v1[0] = x*cos(A) + y*sin(A);
    v1[2] = y*cos(A) - x*sin(A);
  } else {
    v1[0] = x*cos(A) - y*sin(A);
    v1[1] = y*cos(A) + x*sin(A);
  }
}

export function makeCircleMesh(gl, radius, stfeps) {
  let mesh = new Mesh();
  let verts1 = gen_circle(mesh, new Vector3(), radius, stfeps);
  let verts2 = gen_circle(mesh, new Vector3(), radius/1.75, stfeps);
  mesh.make_face_complex([verts1, verts2]);
  return mesh;
}

export function minmax_verts(verts) {
  let min = new Vector3([1000000000000.0, 1000000000000.0, 1000000000000.0]);
  let max = new Vector3([-1000000000000.0, -1000000000000.0, -1000000000000.0]);
  let __iter_v = __get_iter(verts);
  let v;
  while (1) {
    let __ival_v = __iter_v.next();
    if (__ival_v.done) {
      break;
    }
    v = __ival_v.value;
    for (let i = 0; i < 3; i++) {
      min[i] = Math.min(min[i], v.co[i]);
      max[i] = Math.max(max[i], v.co[i]);
    }
  }
  return [min, max];
}

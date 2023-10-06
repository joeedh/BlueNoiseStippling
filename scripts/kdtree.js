import * as util from './util.js';
import cconst from './const.js';

let SQRT2 = Math.sqrt(2);

export class KDTree {
  constructor(is_child) {
    this.ps = [];
    this.children = [];

    this.is_root = !is_child;
    this.stack = this.is_root ? new Array(1024) : undefined;

    this.nodemap = {};

    let eps = 0.000001;
    this.min = [-eps - 2, -eps - 2];
    this.max = [2 + eps, 2 + eps];

    this.depth = 0;
    this.axis = 0;

    this.limit = 15;
  }

  draw(g) {
    if (this.children.length !== 0) {
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].draw(g);
      }

      return;
    }

    let pad = 0.005;

    g.beginPath();

    g.rect(this.min[0] + pad, this.min[1] + pad, this.max[0] - this.min[0] - pad*2, this.max[1] - this.min[1] - pad*2);
    g.stroke();
    g.fillStyle = "orange";
    g.fill();

    g.beginPath();
    for (let i = 0; i < this.ps.length; i += 3) {
      let pi = this.ps[i], x = this.ps[i + 1], y = this.ps[i + 2];

      let w = 0.002//*this.depth*0.1;
      g.rect(x - w*0.5, y - w*0.5, w, w);
    }
    g.stroke();
  }

  forEachPoint(x, y, r, cb, thisvar) {
    let n = this;
    let rsqr = r*r;

    let eps = 0.000001;
    x = Math.min(Math.max(x, eps), 1.0 - eps);
    y = Math.min(Math.max(y, eps), 1.0 - eps);

    thisvar = thisvar === undefined ? window : thisvar;
    let stack = this.stack;
    let si = 0;

    stack[si++] = this;
    while (si > 0) {
      let n = stack[--si];
      let startn = n;
      let abs = Math.abs;

      for (let i = 0; i < n.children.length; i++) {
        let c = n.children[i];

        let ix = abs(c.min[0] - x) < abs(c.max[0] - x) ? c.min[0] : c.max[0];
        let iy = abs(c.min[1] - y) < abs(c.max[1] - y) ? c.min[1] : c.max[1];
        ix -= x, iy -= y;

        let rd = r*SQRT2;
        let ok = x >= c.min[0] - rd && x < c.max[0] + rd && y >= c.min[1] - rd && y < c.max[1] + rd;

        if (ok) {
          stack[si++] = c;
        }
      }

      if (n.children.length !== 0) {
        continue;
      }

      for (let i = 0; i < n.ps.length; i += 3) {
        let pi = n.ps[i], x2 = n.ps[i + 1] - x, y2 = n.ps[i + 2] - y;

        if (x2*x2 + y2*y2 < rsqr) {
          cb.call(thisvar, pi);
        }
      }
    }
  }

  forEachPoint1(x, y, r, cb, thisvar) {
    // return this.forEachPoint2.apply(this, arguments);

    let rsqr = r*r;

    let eps = 0.000001;
    x = Math.min(Math.max(x, eps), 1.0 - eps);
    y = Math.min(Math.max(y, eps), 1.0 - eps);

    thisvar = thisvar === undefined ? window : thisvar;

    for (let i = 0; i < this.children.length; i++) {
      let c = this.children[i];

      let ix = Math.abs(c.min[0] - x) < Math.abs(c.max[0] - x) ? c.min[0] : c.max[0];
      let iy = Math.abs(c.min[1] - y) < Math.abs(c.max[1] - y) ? c.min[1] : c.max[1];
      ix -= x, iy -= y;

      let rd = r*SQRT2;
      let ok = x >= c.min[0] - rd && x < c.max[0] + rd && y >= c.min[1] - rd && y < c.max[1] + rd;

      //if (ok) {
      c.forEachPoint(x, y, r, cb, thisvar);
      //}
    }

    if (this.children.length !== 0) {
      return;
    }

    for (let i = 0; i < this.ps.length; i += 3) {
      let pi = this.ps[i], x2 = this.ps[i + 1] - x, y2 = this.ps[i + 2] - y;

      if (x2*x2 + y2*y2 < rsqr) {
        cb.call(thisvar, pi);
      }
    }
  }

  remove(pi) {
    let node = this.nodemap[pi];

    if (node === undefined) {
      //console.log("eek! kdtree error!");
      return;
    }

    for (let i = 0; i < node.ps.length; i += 3) {
      if (node.ps[i] === pi) {
        if (node.ps.length > 3) {
          node.ps[i] = node.ps[node.ps.length - 3];
          node.ps[i + 1] = node.ps[node.ps.length - 2];
          node.ps[i + 2] = node.ps[node.ps.length - 1];
        }
        node.ps.length -= 3;
      }
    }
  }

  insert(px, py, pi) {
    if (this.children.length > 0) {
      let found = 0;

      for (let i = 0; i < this.children.length; i++) {
        let n = this.children[i];

        //console.log(px, py, n.min, n.max);
        if (px >= n.min[0] && px < n.max[0] &&
          py >= n.min[1] && py < n.max[1]) {
          n.insert(px, py, pi);

          found = 1;
          break;
        }
      }

      if (!found) {
        console.log("eek!", px, py, pi);
        //throw new Error("eek!");
      }
      //console.log("found", found);

      return;
    }

    if (this.ps.length/3 > this.limit && this.depth < 18 && this.children.length === 0) {
      let axis = this.axis ^ 1, min = 1e17, max = -1e17;

      for (let i = 0; i < this.ps.length; i += 3) {
        let pi2 = this.ps[i], px2 = this.ps[i + 1], py2 = this.ps[i + 2];

        min = Math.min(min, axis ? py2 : px2);
        max = Math.max(max, axis ? py2 : px2);
      }

      let mid = (min + max)*0.5;

      let cx = (this.max[0] - this.min[0])/2;
      let cy = (this.max[1] - this.min[1])/2;

      for (let i = 0; i < 2; i++) {
        let u = !axis ? this.min[0] + i*cx : this.min[0];
        let v = axis ? this.min[1] + i*cy : this.min[1];

        let c = new KDTree(true);

        c.stack = this.stack;
        c.nodemap = this.nodemap;

        //c.min = [0, 0];
        //c.max = [0, 0];

        c.min[0] = u;
        c.min[1] = v;

        c.max[0] = !axis ? u + cx : this.max[0];
        c.max[1] = axis ? v + cy : this.max[1];

        c.depth = this.depth + 1;
        c.axis = axis;

        this.children.push(c);
      }

      let ps = this.ps;
      this.ps = [];
      //console.log("splitting...", this.depth);

      this.insert(px, py, pi);

      for (let i = 0; i < ps.length; i += 3) {
        let pib = ps[i], xb = ps[i + 1], yb = ps[i + 2];

        this.insert(xb, yb, pib);
      }

      return;
      //return this.insert(px, py, pi);
    }

    this.nodemap[pi] = this;

    this.ps.push(pi);
    this.ps.push(px);
    this.ps.push(py);
  }
}

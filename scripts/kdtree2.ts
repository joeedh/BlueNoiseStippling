import * as util from "./util.js";
import * as vectormath from "./vectormath.js";
import { Vector3, Matrix4, Vector2 } from "./vectormath.js";

/* 'ni' is shorthand for 'nodeindex', a point into the typed array data structure */

type VectorLike = ArrayLike<number>;

/* Cached point object yielded by iterAllPoints/forEachPoint. */
interface PointResult {
  co: Vector3;
  id: number | undefined;
}

/* Cached node object yielded by forEachNode. */
interface NodeResult {
  min: Vector3;
  max: Vector3;
  splitpos: number | undefined;
  splitplane: number | undefined;
  id: number | undefined;
}

type PointCallback = (id: number) => boolean | void;
type PointResultCallback = (p: PointResult) => void;
type NodeResultCallback = (n: NodeResult) => void;

//maximum points per node before splitting
//make sure to raise this after testing
let MAXPOINTS = 16;
let MAXDEPTH = 512;

let log_everything = false;

/*seems like embedding the points in the nodes, while wasteful of memory,
  should be more cache efficient than referencing another typed array*/
let NXMIN = 0,
  NYMIN = 1,
  NZMIN = 2,
  NXMAX = 3,
  NYMAX = 4,
  NZMAX = 5,
  NSPLITPLANE = 6,
  NSPLITPOS = 7,
  NCHILDA = 8,
  NCHILDB = 9,
  NTOTPOINT = 10,
  TOTN = 11 + MAXPOINTS * 4;

//points are stored (x, y, z, id);

let _insert_split_out = [0, 0];
let _split_tmps = util.cachering.fromConstructor(Vector3, 1024);
let _insert_tmps = util.cachering.fromConstructor(Vector3, 1024);
let _split_tmps_2 = util.cachering.fromConstructor(Vector3, 1024);
let _foreach_tmp = new Vector3();
let _tmp = new Vector3();
let _search2_tmp = new Vector3();

let search_stack = new Int32Array(MAXDEPTH * 8);

export class KDTree {
  min: Vector3;
  max: Vector3;
  last_warn_time: number;
  _point_cachering: util.cachering<PointResult>;
  _node_cachering: util.cachering<NodeResult>;
  _search_cachering: util.cachering<Vector3>;
  usednodes: number;
  data: Float64Array;
  maxdepth: number;
  totpoint: number;
  root: number;

  constructor(min: VectorLike, max: VectorLike) {
    this.min = new Vector3(min);
    this.max = new Vector3(max);

    this.last_warn_time = util.time_ms();

    this._point_cachering = new util.cachering((): PointResult => {
      return { co: new Vector3(), id: undefined };
    }, 512);
    this._node_cachering = new util.cachering((): NodeResult => {
      return {
        min: new Vector3(),
        max: new Vector3(),
        splitpos: undefined,
        splitplane: undefined,
        id: undefined,
      };
    }, 512);
    this._search_cachering = util.cachering.fromConstructor(Vector3, 64);

    this.usednodes = 0;
    this.data = new Float64Array(TOTN * 32);
    this.maxdepth = MAXDEPTH;
    this.totpoint = 0;

    this.root = this.newNode(min, max);
  }

  clear() {
    this.usednodes = this.totpoint = 0;
    this.root = this.newNode(this.min, this.max);

    return this;
  }

  newNode(min: VectorLike, max: VectorLike): number {
    let maxnodes = this.data.length / TOTN;

    if (this.usednodes >= maxnodes) {
      let newdata = new Float64Array(this.data.length * 2);
      let data = this.data;
      let ilen = data.length;

      for (let i = 0; i < ilen; i++) {
        newdata[i] = data[i];
      }

      this.data = newdata;
    }

    let ni = this.usednodes * TOTN;
    let data = this.data;

    for (let j = ni; j < ni + TOTN; j++) {
      data[j] = 0;
    }

    data[ni + NXMIN] = min[0];
    data[ni + NYMIN] = min[1];
    data[ni + NZMIN] = min[2];

    data[ni + NXMAX] = max[0];
    data[ni + NYMAX] = max[1];
    data[ni + NZMAX] = max[2];

    this.usednodes++;

    return ni;
  }

  insert(x: number, y: number, z: number, id?: number): void {
    if (id === undefined) {
      id = z;
      z = 0.0;
    }

    return this.insert_intern(x, y, z, id, 0);
  }

  insert_intern(
    x: number,
    y: number,
    z: number,
    id: number,
    depth: number,
  ): void {
    let recurse = (ni: number, depth: number): void => {
      let data = this.data;

      if (depth >= this.maxdepth) {
        if (log_everything || util.time_ms() - this.last_warn_time > 500) {
          console.log(depth);
          console.warn(
            "Malformed data: 3 to insert point",
            depth,
            x.toFixed(4),
            y.toFixed(4),
            z.toFixed(4),
            "id=",
            id,
          );
          this.last_warn_time = util.time_ms();
        }
        return;
      }

      //not a leaf node?
      if (data[ni + NCHILDA] !== 0) {
        let axis = data[ni + NSPLITPLANE];
        let split = data[ni + NSPLITPOS];

        let paxis = axis === 0 ? x : axis === 1 ? y : z;

        if (paxis === split) {
          //handle case of points exactly on boundary
          //distribute point randomly to children

          let child = Math.random() > 0.5 ? 1 : 0;
          //console.log("exact!", child, p[axis], split, axis);

          recurse(data[ni + NCHILDA + child], depth + 1);
        } else if (paxis < split) {
          recurse(data[ni + NCHILDA], depth + 1);
        } else {
          recurse(data[ni + NCHILDB], depth + 1);
        }

        //a full leaf node?
      } else if (data[ni + NTOTPOINT] >= MAXPOINTS) {
        this.split(ni, _insert_split_out);

        this.insert_intern(x, y, z, id, depth + 1);
      } else {
        //add point
        let i = ni + NTOTPOINT + 1 + data[ni + NTOTPOINT] * 4;

        data[i++] = x;
        data[i++] = y;
        data[i++] = z;
        data[i++] = id;

        data[ni + NTOTPOINT]++;
      }
    };

    recurse(this.root, depth + 1);
    this.totpoint++;
  }

  forEachNode(cb: NodeResultCallback, thisvar?: unknown): void {
    let cachering = this._node_cachering;
    let data = this.data;

    let recurse = (ni: number): void => {
      let n = cachering.next();

      for (var i = 0; i < 3; i++) {
        n.min[i] = data[ni + i];
        n.max[i] = data[ni + 3 + i];
      }

      n.id = ni;
      n.splitplane = data[ni + NSPLITPLANE];
      n.splitpos = data[ni + NSPLITPOS];

      if (thisvar !== undefined) {
        cb.call(thisvar, n);
      } else {
        cb(n);
      }

      if (data[ni + NCHILDA] !== 0) {
        recurse(data[ni + NCHILDA]);
        recurse(data[ni + NCHILDB]);
      }
    };

    recurse(this.root);
  }

  iterAllPoints(cb: PointResultCallback, thisvar?: unknown): void {
    let cachering = this._point_cachering;

    let recurse = (ni: number): void => {
      let data = this.data;

      if (data[ni + NCHILDA] !== 0) {
        recurse(data[ni + NCHILDA]);
        recurse(data[ni + NCHILDB]);
      } else {
        let totpoint = data[ni + NTOTPOINT];
        let j = ni + NTOTPOINT + 1;

        for (let i = 0; i < totpoint; i++) {
          let p = cachering.next();

          p.co[0] = data[j++];
          p.co[1] = data[j++];
          p.co[2] = data[j++];
          p.id = data[j++];

          if (thisvar !== undefined) {
            cb.call(thisvar, p);
          } else {
            cb(p);
          }
        }
      }
    };

    recurse(this.root);
  }

  //this._point_cachering

  //new_nodes_out is an array
  split(ni: number, new_nodes_out?: number[]): void {
    //find split point
    let data = this.data;
    let startk = ni + NTOTPOINT + 1;
    let totp = data[ni + NTOTPOINT];

    let bestaxis: number | undefined = undefined;
    let bestsplit: number | undefined = undefined;
    let bestfit: number | undefined = undefined;

    if (totp === 0) {
      console.warn("TRIED TO SPLIT AN EMPTY NODE!");
    }

    //find best split axis
    for (let axis = 0; axis < 3; axis++) {
      let centroid = 0;
      let amin = 1e17,
        amax = -1e17;

      for (let j = 0, k = startk; j < totp; j++, k += 4) {
        centroid += data[k + axis];

        amin = Math.min(data[k + axis], amin);
        amax = Math.max(data[k + axis], amax);
      }

      if (amax - amin < 0.0001) {
        continue;
      }

      centroid /= totp;
      let fit = 0;

      for (let j = 0, k = startk; j < totp; j++, k += 4) {
        fit += data[k + axis] < centroid ? -1 : 1;
      }
      fit = Math.abs(fit);

      let size = 0;
      for (let k = 0; k < 3; k++) {
        size += Math.max(data[ni + 3 + k], data[ni + k]);
      }

      let aspect = (data[ni + 3 + axis] - data[ni + axis]) / size;

      if (aspect > 0 && aspect < 1) aspect = 1 / aspect;

      if (fit !== totp && aspect > 0.001) {
        fit += aspect * 7.0;
      }

      //console.log("A2", aspect);

      // bestfit is assigned together with bestaxis, so it is defined whenever
      // bestaxis is not undefined (the only branch that reads bestfit).
      if (bestaxis === undefined || fit < bestfit!) {
        bestfit = fit;
        bestsplit = centroid;
        bestaxis = axis;
      }
    }

    if (bestaxis === undefined) {
      if (util.time_ms() - this.last_warn_time > 500) {
        console.warn(
          "Failed to split node; points were probably all duplicates of each other",
        );
        this.last_warn_time = util.time_ms();
      }

      return;
    }

    //      console.log(bestsplit, bestaxis, ni);

    //split
    let min1 = _split_tmps.next().zero(),
      max1 = _split_tmps.next().zero();
    let min2 = _split_tmps.next().zero(),
      max2 = _split_tmps.next().zero();

    for (let i = 0; i < 3; i++) {
      min1[i] = data[ni + i];
      max1[i] = data[ni + NXMAX + i];
    }

    min2.load(min1);
    max2.load(max1);

    // bestsplit is always assigned together with bestaxis above, so it is
    // non-undefined here (guarded by the bestaxis === undefined early return).
    max1[bestaxis] = bestsplit!;
    min2[bestaxis] = bestsplit!;

    let c1 = this.newNode(min1, max1);
    let c2 = this.newNode(min2, max2);

    data = this.data;

    data[ni + NCHILDA] = c1;
    data[ni + NCHILDB] = c2;
    data[ni + NSPLITPOS] = bestsplit!; // see note above: defined whenever bestaxis is
    data[ni + NSPLITPLANE] = bestaxis;

    totp = data[ni + NTOTPOINT];
    startk = ni + NTOTPOINT + 1;

    data[ni + NTOTPOINT] = 0;

    if (new_nodes_out !== undefined) {
      new_nodes_out[0] = c1;
      new_nodes_out[1] = c2;
    }

    for (let k = startk, j = 0; j < totp; j++, k += 4) {
      this.insert(data[k], data[k + 1], data[k + 2], data[k + 3]);
    }
  }

  forEachPoint(
    x: number,
    y: number,
    r: number,
    callback: PointCallback,
    thisvar?: unknown,
  ): void {
    let p = _foreach_tmp;

    p[0] = x;
    p[1] = y;
    p[2] = 0;

    return this.search(p, r, callback, thisvar);
  }

  //manually stacked version
  search_2(
    p: VectorLike,
    r: number,
    callback: PointCallback,
    thisvar?: unknown,
  ): void {
    let si = 0;
    let stack = search_stack;
    let data = this.data;
    let co = _search2_tmp;

    let rsqr = r * r;

    stack[si++] = this.root;

    while (si > 0) {
      if (si > this.maxdepth) {
        break;
      }

      let ni = stack[--si];

      if (data[ni + NCHILDA] !== 0.0) {
        for (let step = 0; step < 2; step++) {
          let ni2 = data[ni + NCHILDA + step];
          let ok = 0;

          for (let i = 0; i < 3; i++) {
            let a = data[ni2 + i],
              b = data[ni2 + i + 3];

            //console.log(a, b, p[i], r);
            ok += p[i] + 1.01 * r >= a && p[i] - 1.01 * r <= b ? 1 : 0;
          }

          if (ok === 3) {
            stack[si++] = ni2;
          }
        }
      } else {
        let totp = data[ni + NTOTPOINT];
        let k = ni + NTOTPOINT + 1;

        for (let j = 0; j < totp; j++, k += 4) {
          co[0] = data[k];
          co[1] = data[k + 1];
          co[2] = data[k + 2];

          let dx = co[0] - p[0];
          let dy = co[1] - p[1];
          let dz = p.length > 2 ? co[2] - p[2] : 0;

          if (dx * dx + dy * dy + dz * dz < rsqr) {
            let dostop;

            if (thisvar) {
              dostop = callback.call(thisvar, data[k + 3]);
            } else {
              dostop = callback(data[k + 3]);
            }

            if (dostop) {
              return;
            }
          }
        }
      }
    }
  }

  //if callback returns true then the search will stop
  search(
    p: VectorLike,
    r: number,
    callback: PointCallback,
    thisvar?: unknown,
  ): void {
    return this.search_2(p, r, callback, thisvar);

    let stop = false;

    let data = this.data;
    let cachering = this._point_cachering;
    let co = this._search_cachering.next();

    let recurse = (ni: number): void => {
      if (stop) {
        return;
      }

      if (data[ni + NCHILDA] !== 0) {
        for (let si = 0; si < 2; si++) {
          let ni2 = data[ni + NCHILDA + si];
          let ok = 0;

          for (let i = 0; i < 3; i++) {
            let a = data[ni2 + i],
              b = data[ni2 + i + 3];

            //console.log(a, b, p[i], r);
            ok += p[i] + 2 * r >= a && p[i] - 2 * r <= b ? 1 : 0;
          }

          if (ok === 3) {
            recurse(ni2);
          }
        }
      } else if (data[ni + NCHILDA] === 0) {
        let totp = data[ni + NTOTPOINT];
        let k = ni + NTOTPOINT + 1;

        for (let j = 0; j < totp; j++, k += 4) {
          co[0] = data[k];
          co[1] = data[k + 1];
          co[2] = data[k + 2];

          let dx = co[0] - p[0];
          let dy = co[1] - p[1];
          let dz = p.length > 2 ? co[2] - p[2] : 0;

          if (dx * dx + dy * dy + dz * dz < r * r) {
            let dostop;

            if (thisvar) {
              dostop = callback.call(thisvar, data[k + 3]);
            } else {
              dostop = callback(data[k + 3]);
            }

            if (dostop) {
              stop = true;
              break;
            }
          }
        }
      }
    };

    recurse(this.root);
  }

  draw(g: CanvasRenderingContext2D): void {
    let d = this.data;

    let recurse = (ni: number): void => {
      g.beginPath();
      g.rect(
        d[ni + NXMIN],
        d[ni + NYMIN],
        d[ni + NXMAX] - d[ni + NXMIN],
        d[ni + NYMAX] - d[ni + NYMIN],
      );
      g.strokeStyle = "orange";
      g.fillStyle = "rgba(255, 150, 50, 0.25)";
      g.stroke();

      if (d[ni + NCHILDA] === 0.0) {
        //leaf node?
        g.fill();

        let r = (0.25 * (this.max[0] - this.min[0])) / Math.sqrt(this.totpoint);
        let totpoint = d[ni + NTOTPOINT];

        g.beginPath();

        for (let i = 0; i < totpoint * 4; i += 4) {
          let i2 = ni + NTOTPOINT + 1 + i;

          let x = d[i2],
            y = d[i2 + 1],
            z = d[i2 + 2],
            id = d[i2 + 3];

          g.moveTo(x, y);
          g.arc(x, y, r, -Math.PI, Math.PI);
        }

        g.fillStyle = "rgba(100, 150, 250, 0.5)";
        g.fill();
      }

      if (d[ni + NCHILDA] !== 0) {
        recurse(d[ni + NCHILDA]);
        recurse(d[ni + NCHILDB]);
      }
    };

    recurse(this.root);
  }

  balance() {
    //return;
    /*
    balance tree.  idea is to do one level at a time, insert all points, subdivide all nodes in that
    level that needs subdivision and only then recurse.

    we can't do that with this data structure which is optimized for speed of memory access.
    so we have to build a temporary structure.
    */

    class Node extends Array<number> {
      min: Vector3;
      max: Vector3;
      bestpos: number | undefined;
      bestaxis: number | undefined;
      bestfit: number | undefined;
      nodes: [Node | undefined, Node | undefined];

      constructor(min: VectorLike, max: VectorLike) {
        super();

        this.min = new Vector3(min);
        this.max = new Vector3(max);
        this.bestpos = undefined;
        this.bestaxis = undefined;
        this.bestfit = undefined;

        this.nodes = [undefined, undefined];
      }
    }

    let min = new Vector3();
    let max = new Vector3();

    for (var i = 0; i < 3; i++) {
      min[i] = this.data[this.root + i];
      max[i] = this.data[this.root + 3 + i];
    }

    let root = new Node(min, max);

    this.iterAllPoints((p) => {
      for (var j = 0; j < 3; j++) {
        root.push(p.co[j]);
      }

      // p.id is populated from the typed-array data, always a number here.
      root.push(p.id!);
    });

    for (let i = 0; i < root.length; i += 4) {
      let i2 = ~~((Math.random() * root.length) / 4) * 4;

      for (let j = 0; j < 4; j++) {
        let t = root[i + j];
        root[i + j] = root[i2 + j];
        root[i2 + j] = t;
      }
    }

    this.clear();
    for (let i = 0; i < root.length; i += 4) {
      this.insert(root[i], root[i + 1], root[i + 2], root[i + 3]);
    }

    return;
    let recurse = (node: Node, depth: number): void => {
      if (depth >= this.maxdepth) {
        if (log_everything || util.time_ms() - this.last_warn_time > 500) {
          console.warn(
            "Malformed data: failed to insert point during balancing, depth:",
            depth,
          );
          this.last_warn_time = util.time_ms();
        }

        return;
      }

      if (node.length / 4 < MAXPOINTS) {
        return;
      }

      let bestfit: number | undefined = undefined,
        bestpos: number | undefined = undefined,
        bestaxis: number | undefined = undefined;
      let size = 0;

      for (let axis = 0; axis < 3; axis++) {
        size = Math.max(size, node.max[axis] - node.min[axis]);
      }

      for (let axis = 0; axis < 3; axis++) {
        let centroid = 0;
        let amin = 1e17,
          amax = -1e17;

        for (let i = 0; i < node.length; i += 4) {
          centroid += node[i + axis];

          amin = Math.min(amin, node[i + axis]);
          amax = Math.max(amax, node[i + axis]);
        }

        //points lie in axis's plane?
        if (amax - amin < 0.00001) {
          continue;
        }

        centroid /= node.length / 4;

        let fit = 0;

        for (let i = 0; i < node.length; i += 4) {
          fit += node[i + axis] < centroid ? -1 : 1;
        }
        fit = Math.abs(fit);

        let aspect = (node.max[axis] - node.min[axis]) / size;

        if (aspect > 0 && aspect < 1) aspect = 1 / aspect;

        if (fit !== node.length / 4 && aspect > 0.001) {
          fit += aspect * 7.0;
        }

        if (bestfit === undefined || fit < bestfit) {
          bestfit = fit;
          bestpos = centroid;
          bestaxis = axis;
        }
      }

      if (bestfit === undefined) {
        console.warn(
          "data integrity error in balance(), node was fill with duplicate points",
        );
        return;
      }

      // bestpos/bestaxis are always assigned together with bestfit above, so the
      // bestfit !== undefined check guarantees they are defined here.
      const bestpos_ = bestpos!;
      const bestaxis_ = bestaxis!;

      node.bestpos = bestpos;
      node.bestaxis = bestaxis;
      node.bestfit = bestfit;

      //console.log(bestaxis, bestpos, bestfit);

      min.load(node.min);
      max.load(node.max);

      max[bestaxis_] = bestpos_;
      let n1 = new Node(min, max);

      max.load(node.max);
      min[bestaxis_] = bestpos_;
      let n2 = new Node(min, max);

      for (let i = 0; i < node.length; i += 4) {
        let child = node[i + bestaxis_] < bestpos_ ? n1 : n2;

        for (let j = 0; j < 4; j++) {
          child.push(node[i + j]);
        }
      }

      node.nodes[0] = n1;
      node.nodes[1] = n2;

      node.length = 0;

      recurse(n1, depth + 1);
      recurse(n2, depth + 1);
    };

    recurse(root, 0);

    this.data.fill(0, 0, this.data.length);
    this.usednodes = 0;
    this.root = this.newNode(root.min, root.max);

    let recurse2 = (node: Node, ni: number): void => {
      let child0 = node.nodes[0];
      let child1 = node.nodes[1];

      if (child0 !== undefined && child1 !== undefined) {
        // bestaxis/bestpos are assigned whenever a node was split (i.e. has children).
        this.data[ni + NSPLITPLANE] = node.bestaxis!;
        this.data[ni + NSPLITPOS] = node.bestpos!;

        let n1 = this.newNode(child0.min, child0.max);
        let n2 = this.newNode(child1.min, child1.max);

        this.data[ni + NCHILDA] = n1;
        this.data[ni + NCHILDB] = n2;

        recurse2(child0, n1);
        recurse2(child1, n2);
      } else {
        //console.log("yay, found points", ni, node.length/4);
        let data = this.data;

        data[ni + NTOTPOINT] = node.length / 4;

        let j = ni + NTOTPOINT + 1;

        for (let i = 0; i < node.length; i += 4) {
          if (i / 4 >= MAXPOINTS) {
            console.warn("ran over MAXPOINTS in balance!", node.length / 4);
            break;
          }

          for (let k = 0; k < 4; k++) {
            data[j++] = node[i + k];
          }
        }
      }
    };

    recurse2(root, this.root);

    return this;
  }
}

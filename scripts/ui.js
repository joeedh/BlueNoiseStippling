//bind module to global var to get at it in console.
//
//note that require has an api for handling circular 
//module refs, in such cases do not use these vars.

var _ui = undefined;

define([
  'util', 'dat.gui', 'vectormath'
], function(util, dat1, vectormath) {
  'use strict';
  
  var exports = _ui = {};
  var Class = util.Class;
  
    var Vector2 = vectormath.Vector2;
  
  var bin_cache = {};
  window._bin_cache = bin_cache;
  
  var eval2_rets = util.cachering.fromConstructor(Vector2, 32);
  
  /*
    I hate these stupid curve widgets.  This horrible one here works by
    root-finding the x axis on a two dimensional b-spline (which works
    surprisingly well).
  */
  
  function bez3(a, b, c, t) {
    var r1 = a + (b - a)*t;
    var r2 = b + (c - b)*t;
    
    return r1 + (r2 - r1)*t;
  }
  
  function bez4(a, b, c, d, t) {
    var r1 = bez3(a, b, c, t);
    var r2 = bez3(b, c, d, t);
    
    return r1 + (r2 - r1)*t;
  }
  
  var binomial = exports.binomial = function binomial(n, i) {
    if (i > n) {
      throw new Error("Bad call to binomial(n, i), i was > than n");
    }
    
    if (i == 0 || i == n) {
      return 1;
    }
    
    var key = "" + n + "," + i;
    
    if (key in bin_cache) 
      return bin_cache[key];
    
    var ret = binomial(n-1, i-1) + bin(n-1, i);
    bin_cache[key] = ret;
    
    return ret;
  }
  window.bin = binomial;
  
  var TangentModes = {
    SMOOTH : 1,
    BREAK  : 2
  };
  
  var CurveFlags = {
    SELECT : 1
  };
  
  var CurvePoint = exports.CurvePoint = class CurvePoint extends Vector2 {
    constructor(co) {
      super(co);
      
      this.deg = 3;
      this.rco = new Vector2(co);
      this.sco = new Vector2(co);
      
      //for transform
      this.startco = new Vector2();
      this.eid = -1;
      this.flag = 0;
      
      this.tangent = TangentModes.SMOOTH;
    }
    
    copy() {
      var ret = new CurvePoint(this);
      
      ret.tangent = this.tangent;
      ret.rco.load(ret);
      
      return ret;
    }
    
    toJSON() {
      return {
        0       : this[0],
        1       : this[1],
        eid     : this.eid,
        flag    : this.flag,
        deg     : this.deg,
        tangent : this.tangent
      };
    }
    
    static fromJSON(obj) {
      var ret = new CurvePoint(obj);
      
      ret.eid = obj.eid;
      ret.flag = obj.flag;
      ret.deg = obj.deg;
      ret.tangent = obj.tangent;
      
      return ret;
    }
    
    basis(t, kprev, knext, is_end, totp, pi) {
      var wid = (knext-kprev)*0.5;
      var k = this.rco[0];
      
      this.deg = 3;
      
      kprev -= (this.deg)*wid;
      knext += (this.deg)*wid;
      
      if (is_end != 1) {
        kprev = Math.max(kprev, 0.0);
      }
      if (is_end != 2) {
        knext = Math.min(knext, 1.0);
      }
      
      if (t <= kprev || t > knext) {
        //return 0;
      }
      
      var w;
      if (t > k) {
        w = 1.0+(k - t) / (knext - k + 0.00001);
        w = 2.0 - w;
      } else {
        w = (t - kprev) / (k - kprev + 0.00001);
      }
      w *= 0.5;
      
      var w = (t - kprev) / (knext - kprev);
      var n = totp;
      var v = pi;
      
      w = Math.min(Math.max(w, 0.0), 1.0);
      var bernstein = binomial(n, v)*Math.pow(w, v)*Math.pow(1.0-w, n-v);
      return bernstein;
      
      if (w == 0) return 0;
      
      w *= w*w;
      w = 1.0 - Math.pow(1.0-w, 2.0);
      
      return w;
    }
  };
  
  var Curve = exports.Curve = Class(Array, [
    function constructor(widget) {
      Array.call(this);
      
      this._nocache = 0;
      this.widget = widget;
      this._ps = [];
      this.hermite = [];
      this.fastmode = false;
      
      this.deg = 6;
      this.recalc = 1;
      this.basis_tables = [];
      this.eidgen = new util.IDGen();
    },
    
    function add(x, y) {
      var p = new CurvePoint();
      this.recalc = 1;
      
      p.eid = this.eidgen.next();
      
      p[0] = x;
      p[1] = y;
      
      p.sco.load(p);
      p.rco.load(p);
      
      this.push(p);
      this.update();
      
      return p;
    },
    
    function update() {
      this.recalc = 1;
      
      for (var i=0; i<this.length; i++) {
        this[i].rco.load(this[i]);
      }
      
      this.sort(function(a, b) {
        return a[0] - b[0];
      });
      
      this._ps = [];
      if (this.length < 2) return;
      var a = this[0][0], b = this[this.length-1][0];
      
      for (var i=0; i<this.length-1; i++) {
        this._ps.push(this[i]);
      }
      
      if (this.length < 3) return;

      var l1 = this[this.length-1];
      var l2 = this[this.length-2];
      
      var p = l1.copy();
      p.rco[0] = l1.rco[0] - 0.00004;
      p.rco[1] = l2.rco[1] + (l1.rco[1] - l2.rco[1])*1.0/3.0;
      //this._ps.push(p);
      
      var p = l1.copy();
      p.rco[0] = l1.rco[0] - 0.00003;
      p.rco[1] = l2.rco[1] + (l1.rco[1] - l2.rco[1])*1.0/3.0;
      //this._ps.push(p);
      
      var p = l1.copy();
      p.rco[0] = l1.rco[0] - 0.00001;
      p.rco[1] = l2.rco[1] + (l1.rco[1] - l2.rco[1])*1.0/3.0;
      this._ps.push(p);
      
      var p = l1.copy();
      p.rco[0] = l1.rco[0] - 0.00001;
      p.rco[1] = l2.rco[1] + (l1.rco[1] - l2.rco[1])*2.0/3.0;
      this._ps.push(p);
      
      this._ps.push(l1);
      
      for (var i=0; i<this._ps.length; i++) {
        this._ps[i].rco.load(this._ps[i]);
      }
      
      for (var i=0; i<this.length; i++) {
        var p = this[i];
        var x = p[0], y = p[1];//this.evaluate(x);
        
        p.sco[0] = x;
        p.sco[1] = y;
      }
    },
    
    function derivative(t) {
      var df = 0.001;
      
      if (t > df*2) {
        return (this.evaluate(t+df) - this.evaluate(t-df)) / (df*2);
      } else if (t > 0.5) {
        return (this.evaluate(t) - this.evaluate(t-df)) / df;
      } else {
        return (this.evaluate(t+df) - this.evaluate(t)) / df;
      }
    },

    function destroy_all_settings() {
      delete localStorage[this.widget.setting_id];
    },
    
    function derivative2(t) {
      var df = 0.0003;
      
      if (t > df*2) {
        return (this.derivative(t+df) - this.derivative(t-df)) / (df*2);
      } else if (t > 0.5) {
        return (this.derivative(t) - this.derivative(t-df)) / df;
      } else {
        return (this.derivative(t+df) - this.derivative(t)) / df;
      }
    },
    
    function toJSON() {
      var ps = [];
      for (var i=0; i<this.length; i++) {
        ps.push(this[i].toJSON());
      }
      
      var ret = {
        points : ps,
        //deg    : this.deg,
        eidgen : this.eidgen.toJSON()
      };
      
      return ret;
    },
    
    function loadJSON(obj) {
      this.length = 0;
      this.hightlight = undefined;
      this.eidgen = util.IDGen.fromJSON(obj.eidgen);
      this.recalc = 1;
      
      //if (obj.deg != undefined) 
      //  this.deg = obj.deg;
      
      for (var i=0; i<obj.points.length; i++) {
        this.push(CurvePoint.fromJSON(obj.points[i]));
      }
      
      return this;
    },
    
    function basis(t, i) {
      if (this.recalc) {
        this.regen_basis();
      }
      
      i = Math.min(Math.max(i, 0), this._ps.length-1);
      t = Math.min(Math.max(t, 0.0), 1.0)*0.999999999;
      
      var table = this.basis_tables[i];
     
      var s = t*(table.length/4)*0.99999;
      
      var j = ~~s;
      s -= j;
       
      j *= 4;
      return table[j] + (table[j+3] - table[j])*s;
      
      return bez4(table[j], table[j+1], table[j+2], table[j+3], s);
    },
    
    function reset() {
      this.length = 0;
      this.add(0, 0);
      this.add(0.5, 0.5);
      this.add(1, 1);
    },
    
    function regen_hermite(steps) {
      console.log("building spline approx");
      
      steps = steps == undefined ? 256 : steps;
      
      this.hermite = new Array(steps);
      var table =this.hermite;
      
      var eps = 0.00001;
      var dt = (1.0-eps*8)/(steps-1);
      var t=eps*4;
      var lastdv1, lastf3;
      
      for (var j=0; j<steps; j++, t += dt) {
        //var f1 = this._evaluate(t-eps*2);
        //var f2 = this._evaluate(t-eps);
        var f3 = this._evaluate(t);
        //var f4 = this._evaluate(t+eps);
        //var f5 = this._evaluate(t+eps*2);
        
        //var dv1 = (f4-f2) / (eps*2);
        //dv1 /= steps;
        
        if (j > 0) {
          var j2 = j-1;
          
          table[j2*4]   = lastf3;
          //table[j2*4+1] = lastf3 + lastdv1/3.0;
          //table[j2*4+2] = f3 - dv1/3.0;
          table[j2*4+3] = f3;
        }
        
        //lastdv1 = dv1;
        lastf3 = f3;
      }
    },
    
    function regen_basis() {
      console.log("building basis functions");
      this.recalc = 0;
      
      var steps = this.fastmode ? 256 : 512;
      
      this.basis_tables = new Array(this._ps.length);
      
      for (var i=0; i<this._ps.length; i++) {
        var table = this.basis_tables[i] = new Array((steps-1)*4);
        
        var eps = 0.00001;
        var dt = (1.0-eps*8)/(steps-1);
        var t=eps*4;
        var lastdv1, lastf3;
        
        //okay, perhaps the cubic hermite interpolation idea wasn't so good after all.
        //reaaaallly slow to calculate
        for (var j=0; j<steps; j++, t += dt) {
          //var f1 = this._basis(t-eps*2, i);
          //var f2 = this._basis(t-eps, i);
          var f3 = this._basis(t, i);
          //var f4 = this._basis(t+eps, i);
          //var f5 = this._basis(t+eps*2, i);
          
          //var dv1 = (f4-f2) / (eps*2);
          //dv1 /= steps;
          
          if (j > 0) {
            var j2 = j-1;
            
            table[j2*4]   = lastf3;
            //table[j2*4+1] = lastf3 + lastdv1/3.0;
            //table[j2*4+2] = f3 - dv1/3.0;
            table[j2*4+3] = f3;
          }
          
          //lastdv1 = dv1;
          lastf3 = f3;
        }
      }
      
      this.regen_hermite();
    },
    
    function _basis(t, i) {
      var len = this._ps.length;
      var ps = this._ps;
      
      function safe_inv(n) {
        return n == 0 ? 0 : 1.0 / n;
      }
      
      function bas(s, i, n) {
        var kp = Math.min(Math.max(i-1, 0), len-1);
        var kn = Math.min(Math.max(i+1, 0), len-1);
        var knn = Math.min(Math.max(i+n, 0), len-1);
        var knn1 = Math.min(Math.max(i+n+1, 0), len-1);
        var ki = Math.min(Math.max(i, 0), len-1);
        
        if (n == 0) {
           return s >= ps[ki].rco[0] && s < ps[kn].rco[0] ? 1 : 0;
        } else {
          
          var a = (s-ps[ki].rco[0]) * safe_inv(ps[knn].rco[0]-ps[ki].rco[0]+0.0001);
          var b = (ps[knn1].rco[0] - s) * safe_inv(ps[knn1].rco[0] - ps[kn].rco[0] + 0.0001);
          
          var ret = a*bas(s, i, n-1) + b*bas(s, i+1, n-1);
          
          /*
          if (isNaN(ret)) {
            console.log(a, b, s, i, n, len);
            throw new Error();
          }
          //*/
          
          //if (Math.random() > 0.99) {
            //console.log(ret, a, b, n, i);
          //}
          return ret;
        }
      }
      
      var p = this._ps[i].rco, nk, pk;
      var deg = this.deg;
      
      var b = bas(t, i-deg, deg);
      
      return b;
    },
    
    function evaluate(t) {
      if (this._nocache)
        return this._evaluate(t);
      
      var a = this[0].rco, b = this[this.length-1].rco;
      if (t <= a[0]) return a[1];
      if (t >= b[0]) return b[1];

      if (this.length == 2) {
        t = (t - a[0]) / (b[0] - a[0]);
        return a[1] + (b[1] - a[1])*t;
      }
      
      if (this.recalc) {
        this.regen_basis();
      }
      
      t *= 0.999999;
      
      var table = this.hermite;
      var s = t*(table.length/4);

      var i = Math.floor(s);
      s -= i;

      i *= 4;
      
      return table[i] + (table[i+3] - table[i])*s; 
    },

    function inverse(y) {
      let steps = 42;
      let ds = 1.0 / steps, s = 0.0;
      let best = undefined;
      let ret = undefined;
      
      for (let i=0; i<steps; i++, s += ds) {
        let s1 = s, s2 = s+ds;
        
        let mid;
        
        for (let j=0; j<11; j++) {
          let y1 = this.evaluate(s1);
          let y2 = this.evaluate(s2);
          mid = (s1+s2)*0.5;
          
          if (Math.abs(y1-y) < Math.abs(y2-y)) {
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
    },
    
    function _evaluate(t) {
      var start_t = t;
      
      if (this.length > 1) {
        var a = this[0], b = this[this.length-1];
        
        if (t < a[0]) return a[1];
        if (t >= b[0]) return b[1];
      }
      
      for (var i=0; i<35; i++) {
        var df = 0.0001;
        var ret1 = this._evaluate2(t < 0.5 ? t : t-df);
        var ret2 = this._evaluate2(t < 0.5 ? t+df : t);
        
        var f1 = Math.abs(ret1[0]-start_t);
        var f2 = Math.abs(ret2[0]-start_t);
        var g = (f2-f1) / df;
        
        if (f1 == f2) break;
        
        //if (f1 < 0.0005) break;
        
        if (f1 == 0.0 || g == 0.0)
          return this._evaluate2(t)[1];
        
        var fac = -(f1/g)*0.5;
        if (fac == 0.0) {
          fac = 0.01;
        } else if (Math.abs(fac) > 0.1) {
          fac = 0.1*Math.sign(fac);
        }
        
        t += fac;
        var eps = 0.00001;
        t = Math.min(Math.max(t, eps), 1.0-eps);
      }
      
      return this._evaluate2(t)[1];
    },
    
    function _evaluate2(t) {
      var ret = eval2_rets.next();
      
      t *= 0.9999999;
      
      var totbasis = 0;
      var sumx = 0;
      var sumy = 0;
      
      for (var i=0; i<this._ps.length; i++) {
        var p = this._ps[i].rco;
        var b = this.basis(t, i);
        
        sumx += b*p[0];
        sumy += b*p[1];
        
        totbasis += b;
      }
      
      if (totbasis != 0.0) {
        sumx /= totbasis;
        sumy /= totbasis;
      }
      
      ret[0] = sumx;
      ret[1] = sumy;
      
      return ret;
    }
  ]);
  
  var CurveWidget = exports.CurveWidget = Class([
    function constructor(setting_id) {
      this.curve = new Curve(this);
      this.setting_id = setting_id;
      
      this.curve.add(0, 0);
      this.curve.add(1, 1);
      this.curve.add(1, 1);
      this._closed = false;
      
      this.start_mpos = new Vector2();
      this.transpoints = this.transforming = this.transmode = undefined;
      
      this.domparent = undefined;
      this.canvas = undefined;
      this.g = undefined;
      
      this.overlay_curvefunc = undefined;
    },
    
    function save() {
      localStorage[this.setting_id] = JSON.stringify(this.curve);
      window[this.setting_id.toUpperCase()] = this.curve;
    },
        
    //default_preset is optional, undefined
    function load(default_preset) {
      if (this.setting_id in localStorage) {
        this.curve.loadJSON(JSON.parse(localStorage[this.setting_id]));
      } else if (default_preset !== undefined) {
        this.curve.loadJSON(default_preset);
      }
      
      this.curve.update();
      this.draw();
      window[this.setting_id.toUpperCase()] = this.curve;
    },
    
    function on_mousedown(e) {
      console.log("canvas mdown");
      
      this.start_mpos.load(this.transform_mpos(e.x, e.y));
      this.curve.fastmode = true;
      
      if (this.curve.highlight != undefined) {
        for (var i=0; i<this.curve.length; i++) {
          this.curve[i].flag &= ~CurveFlags.SELECT;
        }
        this.curve.highlight.flag |= CurveFlags.SELECT;
        
        this.transforming = true;
        this.transpoints = [this.curve.highlight];
        this.transpoints[0].startco.load(this.transpoints[0]);
        
        this.draw();
        return;
      } else {
        var p = this.curve.add(this.start_mpos[0], this.start_mpos[1]);
        this.curve.highlight = p;

        this.curve.update();
        this.draw();
        
        this.curve.highlight.flag |= CurveFlags.SELECT;
        this.transforming = true;
        this.transpoints = [this.curve.highlight];
        this.transpoints[0].startco.load(this.transpoints[0]);
        
        this
      }
    },
    
    function do_highlight(x, y) {
      var trans = this.draw_transform();
      var mindis = 1e17, minp=undefined;
      var limit = 19/trans[0], limitsqr = limit*limit;
      
      for (var i=0; i<this.curve.length; i++) {
        var p = this.curve[i];
        var dx = x-p.sco[0], dy = y-p.sco[1], dis = dx*dx + dy*dy;
        
        if (dis < mindis && dis < limitsqr) {
          mindis = dis;
          minp = p;
        }
      }
      
      if (this.curve.highlight != minp) {
        this.curve.highlight = minp;
        this.draw();
      }
      //console.log(x, y, minp);
    },
    
    function do_transform(x, y) {
      var off = new Vector2([x, y]).sub(this.start_mpos);
      this.curve.recalc = 1;
      
      for (var i=0; i<this.transpoints.length; i++) {
        var p = this.transpoints[i];
        p.load(p.startco).add(off);
        
        p[0] = Math.min(Math.max(p[0], 0), 1);
        p[1] = Math.min(Math.max(p[1], 0), 1);
      }
      
      this.curve.update();
      this.draw();
    },
    
    function transform_mpos(x, y){ 
      var r = this.canvas.getClientRects()[0];
      
      x -= parseInt(r.left);
      y -= parseInt(r.top);
      
      var trans = this.draw_transform();
      
      x = x/trans[0] - trans[1][0];
      y = -y/trans[0] - trans[1][1];
      
      return [x, y];
    },
    
    function on_mousemove(e) {
      var mpos = this.transform_mpos(e.x, e.y);
      var x=mpos[0], y = mpos[1];
      
      if (this.transforming) {
        this.do_transform(x, y);
        this.save();
      } else {
        this.do_highlight(x, y);
      }
    },
    
    function on_mouseup(e) {
      this.transforming = false;
      this.curve.fastmode = false;
      this.curve.update();
      
      window.redraw_all();
    },
    
    function on_keydown(e) {
      console.log(e.keyCode);
      
      switch (e.keyCode) {
        case 88: //xkeey
        case 46: //delete
          console.log(this.curve.highlight);
          if (this.curve.highlight != undefined) {
            this.curve.remove(this.curve.highlight);
            this.recalc = 1;
            
            this.curve.highlight = undefined;
            this.curve.update();
            this.save();
            
            redraw_all();
          }
          break;
      }
    },
    
    function bind(dom) {
      this.canvas = document.createElement("canvas");
      this.canvas.width = 200;
      this.canvas.height = 200;
      this.g = this.canvas.getContext("2d");
      
      this.canvas.style["height"] = this.canvas.height + "px";
      
      this.domparent = dom;
      
      this.canvas.addEventListener("mousedown", this.on_mousedown.bind(this));
      this.canvas.addEventListener("mousemove", this.on_mousemove.bind(this));
      this.canvas.addEventListener("mouseup", this.on_mouseup.bind(this));
      this.canvas.addEventListener("keydown", this.on_keydown.bind(this));
      
      dom.appendChild(this.canvas);
      
      var button = document.createElement("button")
      button.innerHTML = "x";
      
      dom.appendChild(button);
      this.button = button;
      
      var this2 = this;
      button.addEventListener("click", function(e) {
        console.log("delete point");
        
        for (var i=0; i<this2.curve.length; i++) {
          var p = this2.curve[i];
          
          if (p.flag & CurveFlags.SELECT) {
            this2.curve.remove(p);
            i--;
          }
        }
        
        this2.curve.update();
        this2.draw();
        this2.save();
      });
    },
    
    function draw_transform(g) {
      var sz = Math.min(this.canvas.width, this.canvas.height);
      sz *= 0.8;
      
      var pan = [0.1, -1.1];
      
      if (g != undefined) {
        g.lineWidth /= sz;
        g.scale(sz, -sz);
        g.translate(pan[0], pan[1]);
      }
      
      return [sz, pan];
    },
    
    Class.getter(function closed() {
      return this._closed;
    }),
    
    Class.setter(function closed(val) {
      //this.canvas.style["visibility"] = val ? "collapse" : "visible"
      if (val && !this._closed) {
        this.canvas.remove();
        this.button.remove();
      } else if (!val && this._closed) {
        this.domparent.appendChild(this.canvas);
        this.domparent.appendChild(this.button);
      }
      
      this._closed = val;
    }),
    
    function draw() {
      if (this.canvas === undefined) {
        return;
      }
      
      var g = this.g;
      var w=this.canvas.width, h=this.canvas.height;
      
      g.clearRect(0, 0, w, h);
      
      g.save();
      var sz = this.draw_transform(g)[0];
      
      g.beginPath();
      g.rect(0, 0, 1, 1);
      g.fillStyle = "rgb(50, 50, 50)";
      g.fill();
      
      var f=0, steps=64;
      var df = 1/(steps-1);
      var w = 6.0/sz;
      
      g.beginPath();
      for (var i=0; i<steps; i++, f += df) {
        var val = this.curve.evaluate(f);
        
        (i==0 ? g.moveTo : g.lineTo).call(g, f, val, w, w);
      }
      
      g.strokeStyle = "grey";
      //g.lineWidth *= 3.0;
      g.stroke();
      //g.lineWidth /= 3.0;
      
      if (this.overlay_curvefunc !== undefined) {
        g.beginPath();
        f = 0.0;
        
        for (var i=0; i<steps; i++, f += df) {
          var val = this.overlay_curvefunc(f);
          
          (i==0 ? g.moveTo : g.lineTo).call(g, f, val, w, w);
        }
        
        g.strokeStyle = "green";
        g.stroke();
      }
      
      g.lineWidth *= 3.0;
      for (var ssi=0; ssi<2; ssi++) {
        break; //uncomment to draw basis functions
        for (var si=0; si<this.curve.length; si++) {
          g.beginPath();
          
          var f = 0;
          for (var i=0; i<steps; i++, f += df) {
            var totbasis = 0;
            
            for (var j=0; j<this.curve.length; j++) {
              totbasis += this.curve.basis(f, j);
            }
            
            var val = this.curve.basis(f, si);
            
            if (ssi)
              val /= (totbasis == 0 ? 1 : totbasis);
            
            (i==0 ? g.moveTo : g.lineTo).call(g, f, ssi ? val : val*0.5, w, w);
          }
          
          var color, alpha = this.curve[si] === this.curve.highlight ? 1.0 : 0.7;
          
          if (ssi) {
            color = "rgba(105, 25, 5,"+alpha+")";
          } else {
            color = "rgba(25, 145, 45,"+alpha+")";
          }
          g.strokeStyle = color;
          g.stroke();
        }
      }
      g.lineWidth /= 3.0;
      
      g.beginPath();
      for (var i=0; i<this.curve.length; i++) {
        var p = this.curve[i];
        //console.log(p);
        
        g.beginPath();
        g.fillStyle = "orange";
        if (p == this.curve.highlight) {
          g.fillStyle = "green";
        } else if (p.flag & CurveFlags.SELECT) {
          g.fillStyle = "red";
        }
        
        g.rect(p.sco[0]-w/2, p.sco[1]-w/2, w, w);
        g.fill();
      }
      
      g.lineWidth /= 2;
      g.stroke();
      g.restore();
    }
    
  ]);

  class ObjectPath extends Array {
      constructor(path) {
          super();
          
          path = path.split(".");
          
          for (var key of path) {
              this.push(key);
          }
      }
  }
  
  var UI = exports.UI = class UI {
    constructor(storagePrefix, stateobj, _name, _parent, _datobj) {
        this.state = stateobj;
        this.parent = _parent;
        this.name = _name !== undefined ? _name : "undefined";
        this.storagePrefix = storagePrefix;
        
        this.dat = _datobj ? _datobj : new dat.GUI();
        this.controls = [];
        this.curve_widgets = [];
        
        this.panelmap = {};
        this._last_closed = true;
    }
    
    save() {
      this.saveVisibility();
      this.saveCurves();
    }
    
    load() {
      this.loadVisibility();
      this.loadCurves();
    }
    
    loadCurves() {
      for (let p of this.controls) {
        if (p instanceof UI)
          p.loadCurves();
      }
      
      for (let cw of this.curve_widgets) {
        cw.load();
      }
      
      return this;
    }
    
    saveCurves() {
      for (let p of this.controls) {
        if (p instanceof UI)
          p.loadCurves();
      }
      
      for (let cw of this.curve_widgets) {
        cw.save();
      }
      
      return this;
    }
    
    saveVisibility() {
      let key = this.storagePrefix + "_settings";
      console.log("saving visibility", key);
      
      localStorage[key] = JSON.stringify(this);
      return this;
    }
    
    loadVisibility() {
      let key = this.storagePrefix + "_settings";
      let ok = true;
      
      console.log("loading gui visibility", key);
      
      if (key in localStorage) {
        console.log("loading UI visibility state. . .");
        
        try {
          this.loadJSON(JSON.parse(localStorage[key]));
        } catch (error) {
          util.print_stack(error);
          ok = false;
        }
      }
      
      return ok;
    }
    
    toJSON() {
      let ret = {
        panels : {},
        opened : !this.dat.closed
      };
      
      for (let c of this.controls) {
        if (!(c instanceof UI))
          continue;
        
        ret.panels[c.name] = c.toJSON();
      }
      
      return ret;
    }
    
    loadJSON(obj) {
      console.log(obj);
      
      if (obj.opened)
        this.open();
      else
        this.close();
      
      for (let k in obj.panels) {
        let p = obj.panels[k];
        
        if (!(k in this.panelmap)) {
          console.warn("Warning, panel", k, "not in panelmap!");
          continue;
        }
        
        this.panelmap[k].loadJSON(p);
      }
      
      return this;
    }
    
    redrawCurves() {
      if (this.dat.closed)
        return;
      
      for (let cw of this.curve_widgets) {
        cw.draw();
      }
      
      for (let control of this.controls) {
        if (control instanceof UI) {
          control.redrawCurves();
        }
      }
    }
    
    update() {
      for (let control of this.controls) {
        if (control instanceof UI) {
          control.update();
        } else {
          control.updateDisplay();
        }
      }
    }
    
    destroy() {
      this.dat.destroy();
    }
    
    panel(name) {
      var f = this.dat.addFolder(name);
      f.open();
      
      f = new UI(this.storagePrefix + "_" + name, this.state, name, this, f);
      this.controls.push(f);
      
      this.panelmap[name] = f;
      
      return f;
    }
    
    close() {
      this.dat.close();
    }
    
    open() {
      this.dat.open();
    }
    
    button(id, label, cb, thisvar) {
      let b = this.dat.add({cb : function() {
        if (thisvar != undefined)
          cb.call(thisvar);
        else
          cb();
      }}, 'cb').name(label);
      
      this.controls.push(b);
      return b;
    }
    
    _path_get(path) {
      if (typeof path == "string" || path instanceof String) {
        path = new ObjectPath(path);
      }
      
      var obj = this.state;
      var parentobj = undefined;
      
      for (var key of path) {
        parentobj = obj;
        
        obj = obj[key];
      }
      
      return [obj, parentobj];
    }
    
    _path_set(path, val) {
      var obj = this.state;
      
      for (var i=0; i<path.length-1; i++) {
        obj = obj[path[i]];
      }
      
      obj[path[path.length-1]] = val;
      
      _appstate.save();
    }
    
    check(path, name, doredraw=true) {
        path = new ObjectPath(path);
        var id = name.replace(/ /g, "_");
        
        //ensure we are true/false booleans
        let val = this._path_get(path)[0];
        this._path_set(path, !!val);
        
        var iface = {};
        var this2 = this;
        
        Object.defineProperty(iface, id, {
          get : function() {
            return this2._path_get(path)[0];
          },
          
          set : function(val) {
            this2._path_set(path, val);
            
            if (doredraw) {
              window.redraw_all();
            }
          }
        });
        
        let c = this.dat.add(iface, id).name(name);
        this.controls.push(c);
    }
  
    /*
      enummap is an object that maps
      ui names to keys, e.g.:
      
      ui.listenum("color", "Color", {
        RED   : 0,
        GREEN : 1,
        BLUE  : 2
      });
      
      path can be undefined
    */
    listenum(path, name, enummap, defaultval, callback) {
        if (path != undefined) { //we allow path to be undefined, e.g. a more generalized menu
          path = new ObjectPath(path);
        }
        
        var id = name.replace(/ /g, "_");
        
        var iface = {};
        var this2 = this;
        var is_num = false;
        
        for (var k in enummap) {
          if (typeof enummap[k] == "number") {
            is_num = true;
          }
        }
        
        if (defaultval === undefined) {
          throw new Error("missing parameter: defaultval can't be undefined");
        }
        
        if (path !== undefined) {
          if (this2._path_get(path)[0] === undefined) {
            this2._path_set(path, defaultval);
          }
          
          Object.defineProperty(iface, id, {
            get : () => { 
              return this._path_get(path)[0];
            },
            
            set : (val) => {
              if (is_num) {
                val = parseInt(val);
              }
              
              this._path_set(path, val);
            }
          });
        } else {
          iface[id] = defaultval;
        }
        
        var list = enummap;
        
        var option = this.dat.add(iface, id, list).name(name);
        option.listen();
        this.controls.push(option);
        
        if (callback !== undefined) {
          option.onChange(callback);
        }
        
        return option;
    }
    
    getroot() {
      let p = this;
      
      while (p.parent !== undefined) {
        p = p.parent;
      }
      
      return p;
    }
    
    on_tick() {
      if (this.dat == undefined) {
        console.log("warning, dead ui panel");
        return;
      }
      
      if (this.dat.closed != this._last_closed) {
        this._last_closed = this.dat.closed;
        
        this.getroot().saveVisibility();
      }
      
      for (var i=0; i<this.controls.length; i++) {
        if (!(this.controls[i] instanceof UI)) {
          continue;
        }
        
        this.controls[i].on_tick();
      }
      
      //update visibility of curve widgets
      var closed = this.dat.closed;
      for (var i=0; i<this.curve_widgets.length; i++) {
        var cvw = this.curve_widgets[i];
        
        cvw.closed = closed;
      }
    }
    
    curve(id, name, default_preset) {
      var cw = new CurveWidget(this.storagePrefix + id);
      
      if (default_preset !== undefined)
        cw.load(default_preset);
      
      var l = this.dat.add({bleh : "name"}, "bleh");
      
      var parent = l.domElement.parentElement.parentElement.parentElement;
      
      let li = document.createElement("li");
      li.className = "folder";
      
      parent.appendChild(li);
      
      cw.bind(li);
      cw.draw();
      
      l.remove();
      
      this.curve_widgets.push(cw);
      
      return cw;
    }

    slider(path, name, defaultval, min, max, step, is_int, do_redraw) {
        path = new ObjectPath(path);
        var id = name.replace(/ /g, "_");
        
        var iface = {};
        var this2 = this;
        
        if (defaultval === undefined) {
          throw new Error("missing parameter: defaultval can't be undefined");
        }
        
        if (this2._path_get(path)[0] === undefined) {
          this2._path_set(path, defaultval);
        }
        
        Object.defineProperty(iface, id, {
          get : function() {
            return this2._path_get(path)[0];
          },
          
          set : function(val) {
            this2._path_set(path, val);
            
            if (do_redraw) {
              window.redraw_all();
            }
          }
        });
      
      let ret = this.dat.add(iface, id).name(name).min(min).max(max).step(step).name(name);
      this.controls.push(ret);
      return ret;
    }
  };

  return exports;
});

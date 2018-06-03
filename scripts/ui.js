//bind module to global var to get at it in console.
//
//note that require has an api for handling circular 
//module refs, in such cases do not use these vars.

var _ui = undefined;

define([
  './util', './dat.gui', './vectormath'
], function(util, dat1, vectormath) {
  'use strict';
  
  var exports = _ui = {};
  var Class = util.Class;
  
    var Vector2 = vectormath.Vector2;
  
  var bin_cache = {};
  window._bin_cache = bin_cache;
  
  var eval2_rets = util.cachering.fromConstructor(Vector2, 32);
  
  let CURVE_VERSION = exports.CURVE_VERSION = 0.5;
  
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
  
  //when in doubt I prefer to make enums bitmasks
  var CurveTypes = exports.CurveTypes = {
    BSPLINE  : 1,
    CUSTOM   : 2,
    GUASSIAN : 4
  };
  
  class CurveTypeData {
    constructor(type) {
      this.type = type;
    }

    toJSON() {
      return {
        type : this.type
      }
    }

    loadJSON(obj) {
      this.type = obj.type;
      
      return this;
    }
    
    redraw() {
      if (this._redraw_hook) {
        this._redraw_hook();
      }
    }
    
    setRedrawHook(cb) {
      this._redraw_hook = cb;
      return this;
    }

    doSave() {
      if (this._save_hook) {
        this._save_hook();
      }
    }
    
    //sets a callback so gui code can trigger saves
    setSaveHook(cb) {
      this._save_hook = cb;
      return this;
    }
    
    get hasGUI() {
      throw new Error("get hasGUI(): implement me!");
    }
    
    makeGUI(dom, gui, canvas, g, draw_transform) {
    
    }

    killGUI(dom, gui, canvas, g, draw_transform) {
    }
    
    evaluate(s) {
      throw new Error("implement me!");
    }

    derivative(s) {
      let df = 0.0001;

      if (s > 1.0 - df*3) {
        return (this.evaluate(s) - this.evaluate(s - df)) / df;
      } else if (s < df*3) {
        return (this.evaluate(s+df) - this.evaluate(s)) / df;
      } else {
        return (this.evaluate(s+df) - this.evaluate(s-df)) / (2 * df);
      }
    }

    derivative2(s) {
      let df = 0.0001;

      if (s > 1.0 - df*3) {
        return (this.derivative(s) - this.derivative(s - df)) / df;
      } else if (s < df*3) {
        return (this.derivative(s+df) - this.derivative(s)) / df;
      } else {
        return (this.derivative(s+df) - this.derivative(s-df)) / (2 * df);
      }
    }

    inverse(y) {
      let steps = 9;
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
    }

    onActive(parent, draw_transform) {
    }
    
    onInactive(parent, draw_transform) {
    }
    
    reset() {

    }

    destroy() {
    }
    
    update() {
      
    }
    
    draw(canvas, g, draw_transform) {
    }
  }

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
  
  class BSplineCurve extends CurveTypeData {
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
      
      this.on_mousedown = this.on_mousedown.bind(this);
      this.on_mousemove = this.on_mousemove.bind(this);
      this.on_mouseup = this.on_mouseup.bind(this);
      this.on_keydown = this.on_keydown.bind(this);
      this.on_touchstart = this.on_touchstart.bind(this);
      this.on_touchmove = this.on_touchmove.bind(this);
      this.on_touchend = this.on_touchend.bind(this);
      this.on_touchcancel = this.on_touchcancel.bind(this);
    }
    
    remove(p) {
      let ret = this.points.remove(p);
      this.length = this.points.length;
      
      return ret;
    }
    
    add(x, y) {
      var p = new CurvePoint();
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
    
    update() {
      this.recalc = 1;
      
      for (var i=0; i<this.points.length; i++) {
        this.points[i].rco.load(this.points[i]);
      }
      
      this.points.sort(function(a, b) {
        return a[0] - b[0];
      });
      
      this._ps = [];
      if (this.points.length < 2) return;
      var a = this.points[0][0], b = this.points[this.points.length-1][0];
      
      for (var i=0; i<this.points.length-1; i++) {
        this._ps.push(this.points[i]);
      }
      
      if (this.points.length < 3) return;

      var l1 = this.points[this.points.length-1];
      var l2 = this.points[this.points.length-2];
      
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
      
      for (var i=0; i<this.points.length; i++) {
        var p = this.points[i];
        var x = p[0], y = p[1];//this.evaluate(x);
        
        p.sco[0] = x;
        p.sco[1] = y;
      }
    }

    toJSON() {
      let ret = super.toJSON();
      
      var ps = [];
      for (var i=0; i<this.points.length; i++) {
        ps.push(this.points[i].toJSON());
      }
      
      ret = Object.assign(ret, {
        points : ps,
        deg    : this.deg,
        eidgen : this.eidgen.toJSON()
      });
      
      return ret;
    }
    
    loadJSON(obj) {
      super.loadJSON(obj);
      
      this.length = 0;
      this.points = [];
      this._ps = [];

      this.hightlight = undefined;
      this.eidgen = util.IDGen.fromJSON(obj.eidgen);
      this.recalc = 1;
      this.mpos = [0, 0];

      if (obj.deg != undefined) 
        this.deg = obj.deg;
      
      for (var i=0; i<obj.points.length; i++) {
        this.points.push(CurvePoint.fromJSON(obj.points[i]));
      }
      
      this.redraw();
      return this;
    }
    
    basis(t, i) {
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
    }
    
    reset() {
      this.length = 0;
      this.points = [];
      this._ps = [];
      
      this.add(0, 0);
      this.add(0.5, 0.5);
      this.add(1, 1);

      this.update();

      return this;
    }
    
    regen_hermite(steps) {
      console.log("building spline approx");
      
      steps = steps == undefined ? 240 : steps;
      
      this.hermite = new Array(steps);
      var table =this.hermite;
      
      var eps = 0.00001;
      var dt = (1.0-eps*8)/(steps-1);
      var t=eps*4;
      var lastdv1, lastf3;
      
      for (var j=0; j<steps; j++, t += dt) {
        var f1 = this._evaluate(t-eps*2);
        var f2 = this._evaluate(t-eps);
        var f3 = this._evaluate(t);
        var f4 = this._evaluate(t+eps);
        var f5 = this._evaluate(t+eps*2);
        
        var dv1 = (f4-f2) / (eps*2);
        dv1 /= steps;
        
        if (j > 0) {
          var j2 = j-1;
          
          table[j2*4]   = lastf3;
          table[j2*4+1] = lastf3 + lastdv1/3.0;
          table[j2*4+2] = f3 - dv1/3.0;
          table[j2*4+3] = f3;
        }
        
        lastdv1 = dv1;
        lastf3 = f3;
      }
    }
    
    regen_basis() {
      console.log("building basis functions");
      this.recalc = 0;
      
      var steps = this.fastmode ? 64 : 128;
      
      this.basis_tables = new Array(this._ps.length);
      
      for (var i=0; i<this._ps.length; i++) {
        var table = this.basis_tables[i] = new Array((steps-1)*4);
        
        var eps = 0.00001;
        var dt = (1.0-eps*8)/(steps-1);
        var t=eps*4;
        var lastdv1, lastf3;
        
        for (var j=0; j<steps; j++, t += dt) {
          var f1 = this._basis(t-eps*2, i);
          var f2 = this._basis(t-eps, i);
          var f3 = this._basis(t, i);
          var f4 = this._basis(t+eps, i);
          var f5 = this._basis(t+eps*2, i);
          
          var dv1 = (f4-f2) / (eps*2);
          dv1 /= steps;
          
          if (j > 0) {
            var j2 = j-1;
            
            table[j2*4]   = lastf3;
            table[j2*4+1] = lastf3 + lastdv1/3.0;
            table[j2*4+2] = f3 - dv1/3.0;
            table[j2*4+3] = f3;
          }
          
          lastdv1 = dv1;
          lastf3 = f3;
        }
      }
      
      this.regen_hermite();
    }
    
    _basis(t, i) {
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
    }
    
    evaluate(t) {
      var a = this.points[0].rco, b = this.points[this.points.length-1].rco;
      
      if (t < a[0]) return a[1];
      if (t > b[0]) return b[1];

      if (this.points.length == 2) {
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
    }

    _evaluate(t) {
      var start_t = t;
      
      if (this.points.length > 1) {
        var a = this.points[0], b = this.points[this.points.length-1];
        
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
    }
    
    _evaluate2(t) {
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

    get hasGUI() {
      return this.uidata !== undefined;
    }

    on_touchstart(e) {
      this.mpos[0] = e.touches[0].pageX;
      this.mpos[1] = e.touches[0].pageY;

      this.on_mousedown({
        x          : e.touches[0].pageX,
        y          : e.touches[0].pageY,
        button     : 0,
        shiftKey   : e.shiftKey,
        altKey     : e.altKey,
        ctrlKey    : e.ctrlKey,
        isTouch    : true,
        commandKey : e.commandKey
      });
    }
    
    on_touchmove(e) {
      this.mpos[0] = e.touches[0].pageX;
      this.mpos[1] = e.touches[0].pageY;

      this.on_mousemove({
        x          : e.touches[0].pageX,
        y          : e.touches[0].pageY,
        button     : 0,
        shiftKey   : e.shiftKey,
        altKey     : e.altKey,
        ctrlKey    : e.ctrlKey,
        commandKey : e.commandKey,
        preventDefault : () => e.preventDefault(),
        stopPropagation : () => e.stopPropagation(),
        isTouch : true,
      });
    }

    on_touchend(e) {
      this.on_mouseup({
        x          : this.mpos[0],
        y          : this.mpos[1],
        button     : 0,
        shiftKey   : e.shiftKey,
        altKey     : e.altKey,
        ctrlKey    : e.ctrlKey,
        isTouch : true,
        commandKey : e.commandKey
      });
    }
    
    on_touchcancel(e) {
      this.on_touchend(e);
    }
    
    makeGUI(dom, gui, canvas, g, draw_transform) {
      this.uidata = {
        start_mpos  : new Vector2(),
        transpoints : [],
        
        dom         : dom,
        gui         : gui,
        canvas      : canvas,
        g           : g,
        transforming: false,
        draw_trans  : draw_transform
      };
      
      canvas.addEventListener("touchstart", this.on_touchstart);
      canvas.addEventListener("touchmove", this.on_touchmove);
      canvas.addEventListener("touchend", this.on_touchend);
      canvas.addEventListener("touchcancel", this.on_touchcancel);
      
      canvas.addEventListener("mousedown", this.on_mousedown);
      canvas.addEventListener("mousemove", this.on_mousemove);
      canvas.addEventListener("mouseup", this.on_mouseup);
      canvas.addEventListener("keydown", this.on_keydown);
      
      var button = document.createElement("button")
      
      button.innerHTML = "Delete Point";
      
      dom.appendChild(button);
      this.button = button;
      
      button.addEventListener("click", (e) => {
        console.log("delete point");
        
        for (var i=0; i<this.points.length; i++) {
          var p = this.points[i];
          
          if (p.flag & CurveFlags.SELECT) {
            this.points.remove(p);
            i--;
          }
        }
        
        this.update();
        this.redraw();
        this.doSave();
      });
      
      this.uidata.button = button;
      
      return this;
    }

    killGUI(dom, gui, canvas, g, draw_transform) {
      if (this.uidata !== undefined) {
        let ud = this.uidata;
        this.uidata = undefined;

        ud.button.remove();

        console.log("removing event handlers for bspline curve");
        
        canvas.removeEventListener("touchstart", this.on_touchstart);
        canvas.removeEventListener("touchmove", this.on_touchmove);
        canvas.removeEventListener("touchend", this.on_touchend);
        canvas.removeEventListener("touchcancel", this.on_touchcancel);

        canvas.removeEventListener("mousedown", this.on_mousedown);
        canvas.removeEventListener("mousemove", this.on_mousemove);
        canvas.removeEventListener("mouseup", this.on_mouseup);
        canvas.removeEventListener("keydown", this.on_keydown);
      }

      return this;
    }
    
    start_transform() {
      this.uidata.transpoints = [];

      for (let p of this.points) {
        if (p.flag & CurveFlags.SELECT) {
          this.uidata.transpoints.push(p);
          p.startco.load(p);
        }
      }
    }

    on_mousedown(e) {
      console.log("bspline mdown");
      
      this.uidata.start_mpos.load(this.transform_mpos(e.x, e.y));
      this.fastmode = true;
      
      var mpos = this.transform_mpos(e.x, e.y);
      var x=mpos[0], y = mpos[1];
      this.do_highlight(x, y);
      
      if (this.points.highlight != undefined) {
        if (!e.shiftKey) {
          for (var i=0; i<this.points.length; i++) {
            this.points[i].flag &= ~CurveFlags.SELECT;
          }

          this.points.highlight.flag |= CurveFlags.SELECT;
        } else {
          this.points.highlight.flag ^= CurveFlags.SELECT;
        }

        
        this.uidata.transforming = true;
        
        this.start_transform();
        
        this.redraw();
        return;
      } else if (!e.isTouch) {
        var p = this.add(this.uidata.start_mpos[0], this.uidata.start_mpos[1]);
        this.points.highlight = p;

        this.update();
        this.redraw();
        
        this.points.highlight.flag |= CurveFlags.SELECT;
        
        this.uidata.transforming = true;
        this.uidata.transpoints = [this.points.highlight];
        this.uidata.transpoints[0].startco.load(this.uidata.transpoints[0]);
      }
    }
    
    do_highlight(x, y) {
      var trans = this.uidata.draw_trans;
      var mindis = 1e17, minp=undefined;
      var limit = 19/trans[0], limitsqr = limit*limit;
      
      for (var i=0; i<this.points.length; i++) {
        var p = this.points[i];
        var dx = x-p.sco[0], dy = y-p.sco[1], dis = dx*dx + dy*dy;
        
        if (dis < mindis && dis < limitsqr) {
          mindis = dis;
          minp = p;
        }
      }
      
      if (this.points.highlight != minp) {
        this.points.highlight = minp;
        this.redraw()
      }
      //console.log(x, y, minp);
    }
    
    do_transform(x, y) {
      var off = new Vector2([x, y]).sub(this.uidata.start_mpos);
      this.points.recalc = 1;
      
      for (var i=0; i<this.uidata.transpoints.length; i++) {
        var p = this.uidata.transpoints[i];
        p.load(p.startco).add(off);
        
        p[0] = Math.min(Math.max(p[0], 0), 1);
        p[1] = Math.min(Math.max(p[1], 0), 1);
      }
      
      this.update();
      this.redraw();
    }
    
    transform_mpos(x, y){ 
      var r = this.uidata.canvas.getClientRects()[0];
      
      x -= parseInt(r.left);
      y -= parseInt(r.top);
      
      var trans = this.uidata.draw_trans;
      
      x = x/trans[0] - trans[1][0];
      y = -y/trans[0] - trans[1][1];
      
      return [x, y];
    }
    
    on_mousemove(e) {
      //console.log("bspline mmove");
      
      if (e.isTouch && this.uidata.transforming) {
        e.preventDefault();
      }
      
      var mpos = this.transform_mpos(e.x, e.y);
      var x=mpos[0], y = mpos[1];
      
      if (this.uidata.transforming) {
        this.do_transform(x, y);
        this.doSave();
      } else {
        this.do_highlight(x, y);
      }
    }
    
    on_mouseup(e) {
      console.log("bspline mup");

      this.uidata.transforming = false;
      this.fastmode = false;
      this.update();
      
      window.redraw_all();
    }
    
    on_keydown(e) {
      console.log(e.keyCode);
      
      switch (e.keyCode) {
        case 88: //xkeey
        case 46: //delete
          console.log(this.points.highlight);
          if (this.points.highlight != undefined) {
            this.points.remove(this.points.highlight);
            this.recalc = 1;
            
            this.points.highlight = undefined;
            this.update();
            
            if (this._save_hook !== undefined) {
              this._save_hook();
            }
            
            redraw_all();
          }
          break;
      }
    }
    
    draw(canvas, g, draw_trans) {
      g.save();

      this.uidata.canvas = canvas;
      this.uidata.g = g;
      this.uidata.draw_trans = draw_trans;
      
      let sz = draw_trans[0], pan = draw_trans[1];
      g.lineWidth *= 3.0;
      
      for (var ssi=0; ssi<2; ssi++) {
        break; //uncomment to draw basis functions
        for (var si=0; si<this.points.length; si++) {
          g.beginPath();
          
          var f = 0;
          for (var i=0; i<steps; i++, f += df) {
            var totbasis = 0;
            
            for (var j=0; j<this.points.length; j++) {
              totbasis += this.basis(f, j);
            }
            
            var val = this.basis(f, si);
            
            if (ssi)
              val /= (totbasis == 0 ? 1 : totbasis);
            
            (i==0 ? g.moveTo : g.lineTo).call(g, f, ssi ? val : val*0.5, w, w);
          }
          
          var color, alpha = this.points[si] === this.points.highlight ? 1.0 : 0.7;
          
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
      
      let w = 0.03;
      
      for (let p of this.points) {  
        g.beginPath();
        
        if (p === this.points.highlight) {
          g.fillStyle = "green";
        } else if (p.flag & CurveFlags.SELECT) {
          g.fillStyle = "red";
        } else {
          g.fillStyle = "orange";
        }
        
        g.rect(p.sco[0]-w/2, p.sco[1]-w/2, w, w);
        
        g.fill();
      }
      
      g.restore();
    }
  }
  
  class CustomCurve extends CurveTypeData {
    constructor(type) {
      super(CurveTypes.CUSTOM);
      
      this.equation = "x";
    }
    
    toJSON() {
      let ret = super.toJSON();
      
      return Object.assign(ret, {
        equation : this.equation
      });
    }

    loadJSON(obj) {
      super.loadJSON(obj);
      
      if (obj.equation !== undefined) {
        this.equation = obj.equation;
      }
      
      return this;
    }
    
    get hasGUI() {
      return this.uidata !== undefined;
    }
    
    makeGUI(dom, gui, canvas, g, draw_transform) {
      this.uidata = {
        dom        : dom,
        gui        : gui,
        canvas     : canvas,
        g          : g,
        draw_trans : draw_transform,
      };
      
      let text = document.createElement("input");
      text.type = "text";
      text.value = this.equation;
      
      this.uidata.textbox = text;
      
      text.addEventListener("change", (e) => {
        this.equation = text.value;
        this.update();
        this.redraw();
        this.doSave();
      });
      
      dom.appendChild(text);
    }

    killGUI(dom, gui, canvas, g, draw_transform) {
      if (this.uidata !== undefined) {
        this.uidata.textbox.remove();
      }
      
      this.uidata = undefined;
    }
    
    evaluate(s) {
      let sin = Math.sin, cos = Math.cos, pi = Math.PI, PI = Math.PI,
          e = Math.E, E = Math.E, tan = Math.tan, abs = Math.abs,
          floor = Math.floor, ceil = Math.ceil, acos = Math.acos,
          asin = Math.asin, atan = Math.atan, cosh = Math.cos,
          sinh = Math.sinh, log = Math.log, pow = Math.pow,
          exp = Math.exp, sqrt = Math.sqrt, cbrt = Math.cbrt, 
          min = Math.min, max = Math.max;
          
      try {
        let x = s;
        let ret = eval(this.equation);
        
        this._haserror = false;
        
        return ret;
      } catch (error) {
        this._haserror = true;
        console.log("ERROR!");
        return 0.0;
      }
    }

    derivative(s) {
      let df = 0.0001;

      if (s > 1.0 - df*3) {
        return (this.evaluate(s) - this.evaluate(s - df)) / df;
      } else if (s < df*3) {
        return (this.evaluate(s+df) - this.evaluate(s)) / df;
      } else {
        return (this.evaluate(s+df) - this.evaluate(s-df)) / (2 * df);
      }
    }

    derivative2(s) {
      let df = 0.0001;

      if (s > 1.0 - df*3) {
        return (this.derivative(s) - this.derivative(s - df)) / df;
      } else if (s < df*3) {
        return (this.derivative(s+df) - this.derivative(s)) / df;
      } else {
        return (this.derivative(s+df) - this.derivative(s-df)) / (2 * df);
      }
    }

    inverse(y) {
      let steps = 9;
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
    }

    onActive(parent, draw_transform) {
    }
    
    onInactive(parent, draw_transform) {
    }
    
    reset() {

    }

    destroy() {
    }
    
    update() {
      
    }
    
    draw(canvas, g, draw_transform) {
      g.save();
      if (this._haserror) {

        g.fillStyle = g.strokeStyle = "rgba(255, 50, 0, 0.25)";
        g.beginPath();
        g.rect(0, 0, 1, 1);
        g.fill();

        g.beginPath();
        g.moveTo(0, 0);
        g.lineTo(1, 1);
        g.moveTo(0, 1);
        g.lineTo(1, 0);

        g.lineWidth *= 3;
        g.stroke();

        g.restore();
        return;
      }
      
      g.restore();
    }
  }


  class GuassianCurve extends CurveTypeData {
    constructor(type) {
      super(CurveTypes.GUASSIAN);
      
      this.height = 1.0;
      this.offset = 1.0;
      this.deviation = 0.3; //standard deviation
    }
    
    toJSON() {
      let ret = super.toJSON();
      
      return Object.assign(ret, {
        height    : this.height,
        offset    : this.offset,
        deviation : this.deviation
      });
    }

    loadJSON(obj) {
      super.loadJSON(obj);
      
      this.height = obj.height !== undefined ? obj.height : 1.0;
      this.offset = obj.offset;
      this.deviation = obj.deviation;
      
      return this;
    }
    
    get hasGUI() {
      return this.uidata !== undefined;
    }
    
    makeGUI(dom, gui, canvas, g, draw_transform) {
      this.uidata = {
        dom        : dom,
        gui        : gui,
        canvas     : canvas,
        g          : g,
        draw_trans : draw_transform,
      };
      
      this.uidata.hslider = gui.slider(undefined, "Height", this.height, 
        -10, 10, 0.0001, false, false, (val) => {this.height = val, this.update(), this.redraw();});
      this.uidata.oslider = gui.slider(undefined, "Offset", this.offset, 
        -2.5, 2.5, 0.0001, false, false, (val) => {this.offset = val, this.update(), this.redraw();});
      this.uidata.dslider = gui.slider(undefined, "STD Deviation", this.deviation, 
        0.0001, 1.25, 0.0001, false, false, (val) => {this.deviation = val, this.update(), this.redraw();});

    }

    killGUI(dom, gui, canvas, g, draw_transform) {
      if (this.uidata !== undefined) {
        this.uidata.hslider.remove();
        this.uidata.oslider.remove();
        this.uidata.dslider.remove();
      }
      
      this.uidata = undefined;
    }
    
    evaluate(s) {
      let r = this.height * Math.exp(-((s-this.offset)*(s-this.offset)) / (2*this.deviation*this.deviation));
      return r;
    }

    derivative(s) {
      let df = 0.0001;

      if (s > 1.0 - df*3) {
        return (this.evaluate(s) - this.evaluate(s - df)) / df;
      } else if (s < df*3) {
        return (this.evaluate(s+df) - this.evaluate(s)) / df;
      } else {
        return (this.evaluate(s+df) - this.evaluate(s-df)) / (2 * df);
      }
    }

    derivative2(s) {
      let df = 0.0001;

      if (s > 1.0 - df*3) {
        return (this.derivative(s) - this.derivative(s - df)) / df;
      } else if (s < df*3) {
        return (this.derivative(s+df) - this.derivative(s)) / df;
      } else {
        return (this.derivative(s+df) - this.derivative(s-df)) / (2 * df);
      }
    }

    inverse(y) {
      let steps = 9;
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
    }

    onActive(parent, draw_transform) {
    }
    
    onInactive(parent, draw_transform) {
    }
    
    reset() {

    }

    destroy() {
    }
    
    update() {
      
    }
  }
  var CurveConstructors = exports.CurveConstructors = {
    [CurveTypes.BSPLINE]    : BSplineCurve,
    [CurveTypes.CUSTOM]     : CustomCurve,
    [CurveTypes.GUASSIAN]   : GuassianCurve
  };
  
  let Curve = exports.Curve = class Curve {
    constructor(setting_id) {
      this.generators = [];
      this.setting_id = setting_id;
      this.uidata = undefined;
      this._fastmode = false;
      
      if (setting_id === undefined) {
        throw new Error("setting_id cannot be undefined");
      }
      
      for (let k in CurveConstructors) {
        let gen = new CurveConstructors[k];
        
        this.generators.push(gen);
      }
      
      this.generators.active = this.generators[0];
    }
    
    redraw() {
      if (this._redraw_hook !== undefined) {
        this._redraw_hook();
      }
    }
    
    /*
    new isolation strategy I'm trying.  Instead of keeping reference
    to CurveWidget in Curve and CurveDataType, I'll have CurveWidget feed
    in special callback functions.  
    
    this is necessary for redrawing and auto saving.
    */
    setRedrawHook(cb) {
      for (let gen of this.generators) {
        gen.setRedrawHook(cb);
      }
      
      this._redraw_hook = cb;
    }
    
    doSave() {
      if (this._save_hook) {
        this._save_hook();
      }
    }
    
    setSaveHook(cb) {
      this._save_hook = cb;
      
      for (let gen of this.generators) {
        gen.setSaveHook(cb);
      }
      
      return this;
    }
    
    get fastmode() {
      return this._fastmode;
    }
    
    set fastmode(val) {
      this._fastmode = val;
      
      for (let gen of this.generators) {
        gen.fastmode = val;
      }
    }
    
    toJSON() {
      let ret = {
        is_new_curve     : true,
        setting_id       : this.setting_id,
        generators       : [],
        version          : CURVE_VERSION,
        active_generator : this.generators.indexOf(this.generators.active)
      };
      
      for (let gen of this.generators) {
        ret.generators.push(gen.toJSON());
      }
      
      return ret;
    }
    
    getGenerator(type) {
      for (let gen of this.generators) {
        if (gen.type === type) {
          return gen;
        }
      }
      
      throw new Error("Unknown generator " + type + ".");
    }
    
    switchGenerator(type) {
      let gen = this.getGenerator(type);
      
      if (gen !== this.generators.active) {
        let old = this.generators.active;

        this.generators.active = gen;
        
        if (this.uidata !== undefined) {
          let ud = this.uidata;
          old.killGUI(ud.dom, ud.gui, ud.canvas, ud.g, ud.draw_trans);
        }
        
        old.onInactive(this);
        gen.onActive(this);
        
        if (this.uidata !== undefined) {
          let ud = this.uidata;
          gen.makeGUI(ud.dom, ud.gui, ud.canvas, ud.g, ud.draw_trans);
        }
      }
      
      return gen;
    }
    
    destroy() {
      if (this.uidata !== undefined) {
        let ud = this.uidata;
        
        this.killGUI(ud.dom, ud.gui, ud.canvas, ud.g, ud.draw_trans);
        
        for (let gen of this.generators) {
          gen.destroy();
        }
      }
      
      return this;
    }
    
    loadJSON(obj) {
      if (obj.is_new_curve === undefined) {
        let hasGUI = this.uidata !== undefined;
        let olduidata = this.uidata;
        
        if (hasGUI) {
          let ud = olduidata;
          this.killGUI(ud.dom, ud.gui, ud.canvas, ud.g, ud.draw_trans);
        }

        let gen = this.switchGenerator(CurveTypes.BSPLINE);
        
        this.generators.active = gen;
        
        obj.type = CurveTypes.BSPLINE;
        
        gen.reset();
        gen.loadJSON(obj);
        
        if (hasGUI) {
          let ud = olduidata;
          this.makeGUI(ud.dom, ud.gui, ud.canvas, ud.g, ud.draw_trans);
        }

        this.update();
        this.redraw();
        
        return this;
      }
      
      let hasGUI = this.uidata !== undefined;
      let olduidata = this.uidata;
      
      if (hasGUI) {
        let ud = olduidata;
        this.killGUI(ud.dom, ud.gui, ud.canvas, ud.g, ud.draw_trans);
      }
      
      if (this.setting_id === undefined) {
        console.warn("Warning, setting setting_id in Curve.loadJSON(); you forgot to pass it to the constructor");
        this.setting_id = obj.setting_id;
      }
      
      for (let gen of obj.generators) {
        if (!(gen.type in CurveConstructors)) {
          throw new Error("Bad generator type " + gen.type);
          //console.warn("Bad generator type", gen.type, gen);
          continue;
        }
        
        this.getGenerator(gen.type).loadJSON(gen).update();
      }
      
      this.generators.active = this.generators[obj.active_generator];

      if (hasGUI) {
        let ud = olduidata;
        this.makeGUI(ud.dom, ud.gui, ud.canvas, ud.g, ud.draw_trans);
      }
      
      this.update();
      this.redraw();
      
      return this;
    }
    
    evaluate(s) {
      return this.generators.active.evaluate(s);
    }
    
    derivative(s) {
      return this.generators.active.derivative(s);
    }
    
    derivative2(s) {
      return this.generators.active.derivative2(s);
    }
    
    inverse(s) {
      return this.generators.active.inverse(s);
    }
    
    reset() {
      this.generators.active.reset();
    }
    
    update() {
      return this.generators.active.update();
    }
    
    destroy_all_settings() {
      delete localStorage[this.setting_id];
      
      return this;
    }
    
    makeGUI(dom, gui, canvas, g, draw_transform) {
      this.uidata = {
        dom        : dom,
        gui        : gui,
        canvas     : canvas,
        g          : g,
        draw_trans : draw_transform
      };

      if (this.generators.active.hasGUI) {
        this.generators.active.killGUI(dom, gui, canvas, g, draw_transform);
      }
      
      let uinames = {};
      for (let k in CurveTypes) {
        let v = CurveTypes[k];

        k = k[0].toUpperCase() + k.slice(1, k.length).toLowerCase();
        k = k.replace(/_/g, " ");

        uinames[k] = v;
      }

      //listenum(path, name, enummap, defaultval, callback)
      this.uidata.listenum = gui.listenum(undefined, "Type", uinames, this.generators.active.type, (type) => {
        this.switchGenerator(type);
        this.doSave();
        this.redraw();
      });
      
      this.generators.active.makeGUI(dom, gui, canvas, g, draw_transform);
      
      return this;
    }
    
    get hasGUI() {
      return this.uidata !== undefined;
    }

    killGUI(dom, gui, canvas, g, draw_transform) {
      this.uidata.listenum.remove();

      for (let gen of this.generators) {
        this.generators.active.killGUI(dom, gui, canvas, g, draw_transform);
      }
      
      this.uidata = undefined;
      
      return this;
    }
    
    draw(canvas, g, draw_transform) {
      if (this.uidata === undefined) {
        return;
      }
      
      this.uidata.canvas = canvas;
      this.uidata.g = g;
      this.uidata.draw_trans = draw_transform;
      
      var w=canvas.width, h=canvas.height;
      
      g.save();
      
      let sz = draw_transform[0], pan = draw_transform[1];
      
      g.beginPath();
      g.moveTo(-1, 0);
      g.lineTo(1, 0);
      g.strokeStyle = "red";
      g.stroke();
      
      g.beginPath();
      g.moveTo(0, -1);
      g.lineTo(0, 1);
      g.strokeStyle = "green";
      g.stroke();
      
      //g.rect(0, 0, 1, 1);
      //g.fillStyle = "rgb(50, 50, 50)";
      //g.fill();
      
      var f=0, steps=64;
      var df = 1/(steps-1);
      var w = 6.0/sz;
      
      let curve = this.generators.active;
      
      g.beginPath();
      for (var i=0; i<steps; i++, f += df) {
        var val = curve.evaluate(f);
        
        (i==0 ? g.moveTo : g.lineTo).call(g, f, val, w, w);
      }
      
      g.strokeStyle = "grey";
      g.stroke();
      
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
      
      this.generators.active.draw(canvas, g, draw_transform);
      
      g.restore();
      return this;
    }
  }

  var CurveWidget = exports.CurveWidget = class CurveWidget {
    constructor(setting_id) {
      this.curve = new Curve(setting_id);
      this.setting_id = setting_id;
      
      this._closed = false;
      this.mpos = [0, 0];
      
      this.domparent = undefined;
      this.canvas = undefined;
      this.g = undefined;
      
      this.overlay_curvefunc = undefined;
      
      this.curve.setSaveHook(this.save.bind(this));
      this.curve.setRedrawHook(this.redraw.bind(this));
    }
    
    redraw() {
      this.draw();
    }
    
    save() {
      //console.warn("Temporarily disabled curve saving!");
      localStorage[this.setting_id] = JSON.stringify(this.curve);
      //window[this.setting_id.toUpperCase()] = this.curve;
    }
        
    //default_preset is optional, undefined
    load(default_preset) {
      if (this.setting_id in localStorage) {
        this.curve.loadJSON(JSON.parse(localStorage[this.setting_id]));
      } else if (default_preset !== undefined) {
        this.curve.loadJSON(default_preset);
      }
      
      this.curve.update();
      this.draw();
    }
    
    bind(dom, gui) {
      this.canvas = document.createElement("canvas");
      this.canvas.width = 200;
      this.canvas.height = 200;
      this.g = this.canvas.getContext("2d");
      
      this.gui = gui;
      this.domparent = dom;
      
      this.canvas["class"] = "closed";
      this.canvas.style["class"] = "closed";
      
      dom.appendChild(this.canvas);
      
      this.curve.makeGUI(dom, gui, this.canvas, this.g, this.draw_transform());
    }
    
    draw_transform(g) {
      var sz = Math.min(this.canvas.width, this.canvas.height);
      sz *= 0.8;
      
      var pan = [0.1, -1.1];
      
      if (g != undefined) {
        g.lineWidth /= sz;
        g.scale(sz, -sz);
        g.translate(pan[0], pan[1]);
      }
      
      return [sz, pan];
    }
    
    get closed() {
      return this._closed;
    }
    
    set closed(val) {
      //this.canvas.style["visibility"] = val ? "collapse" : "visible"
      if (val && !this._closed) {
        this.curve.killGUI(this.domparent, this.gui, this.canvas, this.g, this.draw_transform());
        this.canvas.remove();
      } else if (!val && this._closed) {
        this.domparent.appendChild(this.canvas);
        this.curve.makeGUI(this.domparent, this.gui, this.canvas, this.g, this.draw_transform());
        this.redraw();
      }
      
      this._closed = val;
    }
    
    draw() {
      if (this.canvas === undefined) {
        return;
      }
      
      var g = this.g;
      var w=this.canvas.width, h=this.canvas.height;
      
      g.clearRect(0, 0, w, h);
      
      g.fillStyle = "rgb(50, 50, 50)";
      g.beginPath();
      g.rect(0, 0, w, h);
      g.fill();
      
      g.save();
      
      var trans = this.draw_transform(g);
      
      //XXX draw min/max bounds here
      g.strokeStyle = "rgb(100,100,100)";
      g.beginPath();
      g.rect(0, 0, 1, 1);
      g.stroke();
      
      this.curve.draw(this.canvas, this.g, trans);
      
      g.restore();
    }
  }
  
  var save_setting = exports.save_setting = function save_setting(key, val) {
    var settings = localStorage.startup_file_bn6;
    
    if (settings == undefined) {
        settings = {};
    } else {
      try {
        settings = JSON.parse(settings);
      } catch (error) {
        console.log("Warning, failed to parse cached settings");
        settings = {};
      }
    }
    
    settings[key] = val;
    localStorage.startup_file_bn6 = JSON.stringify(settings);
  }
  
  var load_setting = exports.load_setting = function load_setting(key) {
    var settings = localStorage.startup_file_bn6;
    
    if (settings == undefined) {
        settings = {};
    } else {
      try {
        settings = JSON.parse(settings);
      } catch (error) {
        console.log("Warning, failed to parse cached settings");
        settings = {};
      }
    }
    
    return settings[key];
  }
  
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
      localStorage[this.storagePrefix + "_settings"] = JSON.stringify(this);
      return this;
    }
    
    loadVisibility() {
      let key = this.storagePrefix + "_settings";
      let ok = true;
      
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
    
    check(path, name) {
        path = new ObjectPath(path);
        var id = name.replace(/ /g, "_");
        
        var iface = {};
        var this2 = this;
        
        Object.defineProperty(iface, id, {
          get : function() {
            return this2._path_get(path)[0];
          },
          
          set : function(val) {
            this2._path_set(path, val);
            window.redraw_all();
          }
        });
        
        let c = this.dat.add(iface, id).name(name);
        
        return this._add_control(c);
    }
  
    /*
      enummap is an object that maps
      ui names to keys, e.g.:
      
      ui.listenum("color", "Color", {
        RED   : 0,
        GREEN : 1,
        BLUE  : 2
      });

      path can be undefined, in which case, use callback,
      which gets the current enum as an argument

      defaultval cannot be undefined
    */
    listenum(path, name, enummap, defaultval, callback) {
        path = path !== undefined ? new ObjectPath(path) : undefined;
        
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
        
        if (path === undefined) {
          iface._val = defaultval;
        }
        
        if (path !== undefined && this2._path_get(path)[0] === undefined) {
          this2._path_set(path, defaultval);
        }
        
        Object.defineProperty(iface, id, {
          get : function() {
            return path !== undefined ? this2._path_get(path)[0] : this._val;
          },
          
          set : function(val) {
            if (is_num) {
              val = parseInt(val);
            }
            
            if (path !== undefined) {
              this2._path_set(path, val);
            } else {
              this._val = val;
            }
            
            if (callback !== undefined) {
              callback(val);
            }
          }
        });
        
        var list = enummap;
        
        var option = this.dat.add(iface, id, list).name(name);
        option.listen();

        return this._add_control(option);
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
      
      parent["class"] = parent.style["class"] = "closed";
      
      cw.bind(parent, this);
      cw.draw();
      
      l.remove();
      
      this.curve_widgets.push(cw);
      
      return cw;
    }

    slider(path, name, defaultval, min, max, step, is_int, do_redraw, callback) {
        path = path !== undefined ? new ObjectPath(path) : undefined;
        var id = name.replace(/ /g, "_");
        
        var iface = {};
        var this2 = this;
        
        if (defaultval === undefined) {
          throw new Error("missing parameter: defaultval can't be undefined");
        }
        
        if (path !== undefined && this2._path_get(path)[0] === undefined) {
          this2._path_set(path, defaultval);
        }
        
        if (path === undefined) {
          iface._val = defaultval;
        }
        
        Object.defineProperty(iface, id, {
          get : function() {
            if (path !== undefined)
              return this2._path_get(path)[0];
            else
              return this._val;
          },
          
          set : function(val) {
            if (do_redraw) {
              window.redraw_all();
            }
            if (path !== undefined)
              this2._path_set(path, val);
            else
              this._val = val;
            
            if (callback !== undefined) {
              callback(val);
            }
          }
        });
        
      let ret = this.dat.add(iface, id).name(name).min(min).max(max).step(step).name(name);
      
      return this._add_control(ret);
    }
    
    _add_control(control) {
      let remove = control.remove;
      let this2 = this;
      
      control.remove = function() {
        if (this2.controls.indexOf(control) >= 0) {
          this2.controls.remove(control);
        }
        
        remove.apply(control, arguments);
      }
      
      this.controls.push(control);
      return control;
    }
  };

  /*
  function listenum(id, list, defaultval, callback, thisvar) {
      var ret = {};
      ret[id] = defaultval;
      
      var option = this.dat.add(ret, id, list);
      
      option.onChange(function(value) {
        if (thisvar !== undefined) {
          callback.call(thisvar, value);
        } else {
          callback(value);
        }
      });
  }*/
      
  /*
  var UI = exports.UI = Class([
    function constructor(dat_obj) {
      this.dat = dat_obj == undefined ? new dat.GUI() : dat_obj;
    },
    
    function panel(name) {
      var f = this.dat.addFolder(name);
      f.open();
      
      return new UI(f.storagePrefix, f);
    },
    
    function close() {
      this.dat.close();
    },
    
    function open() {
      this.dat.open();
    },
    
    function button(id, label, cb, thisvar) {
      return this.dat.add({cb : function() {
        if (thisvar != undefined)
          cb.call(thisvar);
        else
          cb();
      }}, 'cb').name(label);
    },
    
    function listenum(id, list, defaultval, callback, thisvar) {
      var ret = {};
      ret[id] = defaultval;
      
      var option = this.dat.add(ret, id, list);
      
      option.onChange(function(value) {
        if (thisvar !== undefined) {
          callback.call(thisvar, value);
        } else {
          callback(value);
        }
      });
    },
    
    //creates global variable window.[uppercase id]
    function check(id, name) {
      var ret = {};
      
      var upperid = id.toUpperCase();
      
      var val = load_setting(upperid);
      if (val != undefined) {
        window[upperid] = val;
      }
      
      Object.defineProperty(ret, id, {
        get : function() {
          return !!window[upperid];
        },
        
        set : function(val) {
          if (!!window[upperid] != !!val) {
            save_setting(upperid, val);
            window[upperid] = val;
            window.redraw_all();
          }
        }
      });
      
      return this.dat.add(ret, id).name(name);
    },
    
    function slider(id, name, min, max, step, is_int, do_redraw) {
      var ret = {};

      var upperid = id.toUpperCase();
      
      var val = load_setting(upperid);
      if (val != undefined) {
        window[upperid] = val;
      }
      
      Object.defineProperty(ret, id, {
        get : function() {
          return Number(window[upperid]);
        },
        
        set : function(val) {
          if (do_redraw && window[upperid] != val) {
            window.redraw_all();
          }
          
          save_setting(upperid, val);
          window[upperid] = val;
        }
      });
      
      return this.dat.add(ret, id).name(name).min(min).max(max).step(step).name(name);
    }
  ]);
  */
  return exports;
});

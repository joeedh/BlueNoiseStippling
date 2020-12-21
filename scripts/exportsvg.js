let _exportsvg = undefined;
let SVG_URL = "http://www.w3.org/2000/svg";

define([
'util', 'const', 'vectormath', 'math', 'bluenoise'
], function(util, cconst, vectormath, math, bluenoise) {
  "use strict";

  let exports = _exportsvg = {};

  let Matrix4 = vectormath.Matrix4;
  let Vector2 = vectormath.Vector2;
  let Vector3 = vectormath.Vector3;
  let Vector4 = vectormath.Vector4;
  let Quat = vectormath.Quat;

  let rgbaPat = /rgba\(\d+,\d+,\d+,\d+(\.?\d+)?\)$/;
  window._rgbaPath = rgbaPat;

  let isRGBA = exports.isRGBA = function(s) {
    s = s.toLowerCase().replace(/[ \t\n\r]/g, '');
    return !!rgbaPat.exec(s);
  }

  window._isRGBA = isRGBA;

  let parseRGBA = exports.parseRGBA = function(s) {
    if (!isRGBA(s)) {
      throw new Error("not rgba pattern");
    }

    s = s.toLowerCase();
    s = s.replace(/[ \t\n\r]/g, '').replace(/rgba\(/, '');
    s = s.replace(/\)/, '');
    s = s.split(",");

    s = s.map(p => parseFloat(p));

    return s;
  }
  window._parseRGBA = parseRGBA;

  function p(f) {
    return f.toFixed(4);
  }

  let trets = util.cachering.fromConstructor(Vector2, 32);

  let SVGExporter = exports.SVGExporter = class SVGExporter {
    constructor() {
      this.svg = document.createElementNS(SVG_URL, "svg");

      this.svg.setAttribute("xmlns", SVG_URL);

      this.width = this.height = 512;

      this.fillStyle = "black";
      this.strokeStyle = "black";
      this.lineWidth = 1.0;
      this.stack = [];
      this.matrix = new Matrix4();

      this.start = new Vector2();
      this.hasStart = false;
      this.p1 = new Vector2();
      this.p2 = new Vector2();

      this.path = "";
      this.output = "";
    }

    set width(w) {
      this.svg.setAttributeNS(SVG_URL, "width", w);
      this._width = w;
    }

    set height(h) {
      this.svg.setAttributeNS(SVG_URL, "height", h);
      this._height = h;
    }

    get width() {
      return this._width;
    }

    get height() {
      return this._height;
    }
    getContext() {
      return this;
    }

    putImageData() {
      //do nothing
    }

    drawImage() {
      //do nothing
    }

    copyState() {
      return {
        fillStyle : this.fillStyle,
        strokeStyle : this.strokeStyle,
        lineWidth : this.lineWidth,
        matrix : new Matrix4(this.matrix)
      }
    }

    loadState(s) {
      for (let k in s) {
        this[k] = s[k];
      }

      return this;
    }

    _doStart(x, y) {
      if (!this.hasStart) {
        this.hasStart = true;

        this.start[0] = x;
        this.start[1] = y;
      }
    }
    save() {
      this.stack.push(this.copyState());

      return this;
    }

    restore() {
      this.loadState(this.stack.pop());

      return this;
    }

    _t(x, y) {
      let ret = trets.next();

      ret[0] = x;
      ret[1] = y;

      ret.multVecMatrix(this.matrix);

      let w = this.width > this.height ? this.width : this.height;

      ret[0] -= w/2;
      ret[1] -= w/2;

      return ret;
    }

    beginPath() {
      this.hasStart = false;
      this.path = "";
      this.node = document.createElementNS(SVG_URL, "path");
    }

    moveTo(x, y) {
      [x, y] = this._t(x, y);
      this._doStart(x, y);

      this.path += `M ${p(x)} ${p(y)} `;
      this.p1[0] = x;
      this.p1[1] = y;
    }

    lineTo(x, y) {
      [x, y] = this._t(x, y);
      this._doStart(x, y);

      this.path += `L ${p(x)} ${p(y)} `;
      this.p1[0] = x;
      this.p1[1] = y;
    }

    arc(x, y, r, a1, a2) {
      [x, y] = this._t(x, y);
      this._doStart(x, y);

      r *= this.matrix.$matrix.m11;

      this.path += `A ${p(r)} ${p(r)} `;
      this.path += `${p(a2-a1)} 1 1 ${p(x)} ${p(y)} `;
      this.p1[0] = x;
      this.p1[1] = y;
    }

    closePath() {
      this.path += "Z ";
    }

    _checkNode() {
      if (this.path.length > 0 && !this.node.parentNode) {
        this.svg.appendChild(this.node);
      }
    }

    rect(x, y, w, h) {
      [x, y] = this._t(x, y);

      w *= this.matrix.$matrix.m11;
      h *= this.matrix.$matrix.m22;

      this.moveTo(x, y);
      this.lineTo(x, y+h);
      this.lineTo(x+h, y+h);
      this.lineTo(x+h, y);
      this.lineTo(x, y);
    }

    scale(x, y) {
      /*
      let mat = new Matrix4();
      mat.scale(x, y, 1.0);
      this.matrix.preMultiply(mat);
      //*/
      this.matrix.scale(x, y, 1.0);
    }

    translate(x, y) {
      /*
      let mat = new Matrix4();
      mat.translate(x, y, 1.0);
      this.matrix.preMultiply(mat);
      //*/
      this.matrix.translate(x, y, 1.0);
    }

    fill() {
      this._checkNode();
      let alpha = 1.0;

      if (0&&isRGBA(this.fillStyle)) {
        let c = parseRGBA(this.fillStyle);
        this.node.setAttributeNS(SVG_URL,"fill", `rgb(${c[0]},${c[0]},${c[0]})`);
        alpha = c[3];
      } else {
        this.node.setAttributeNS(SVG_URL, "fill", this.fillStyle);
      }

      this.node.setAttributeNS(SVG_URL,"fill-opacity", ""+alpha);
      this.node.setAttributeNS(SVG_URL, "d", this.path);
    }

    stroke() {
      this._checkNode();
      let alpha = 1.0;

      if (0&&isRGBA(this.strokeStyle)) {
        let c = parseRGBA(this.strokeStyle);
        this.node.setAttributeNS(SVG_URL,"stroke", `rgb(${c[0]},${c[0]},${c[0]})`);
        alpha = c[3];
      } else {
        this.node.setAttributeNS(SVG_URL, "stroke", this.strokeStyle);
      }

      let w = this.lineWidth * this.matrix.$matrix.m11;

      this.node.setAttributeNS(SVG_URL, "stroke-width", w + "px");
      this.node.setAttributeNS(SVG_URL,"stroke-opacity", ""+alpha);

      this.node.setAttributeNS(SVG_URL, "d", this.path);
    }
  }

  let exportSVG = exports.exportSVG = function exportSVG(appstate) {
    let svg = new SVGExporter();

    appstate.renderImage(svg, svg, false);
    console.log("SVG", svg);

    window._svg = svg;
    console.log(svg.svg.outerHTML);

    return svg.svg.outerHTML;
  }
  return exports;
});

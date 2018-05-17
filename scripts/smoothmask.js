let _smoothmask = undefined;

define([
  "util"
], function(util) {
  "use strict";
  
  let exports = _smoothmask = {};
  
  let CurveTypes = exports.CurveTypes = {
    LINEAR            : 0,
    LINEAR_NONUNIFORM : 1
  };
  
  let OffsetsType = exports.OffsetsType = {
    FLOAT32 : 0,
    UINT16  : 1
  };

  let OFFX=0, OFFY=1, OFFTOT=2;
  let NX=0, NY=1, NT=2, NTOT=3;

  let fieldLens = exports.fieldLens = {
    [CurveTypes.LINEAR] : OFFTOT,
    [CurveTypes.LINEAR_NONUNIFORM] : NTOT  
  };

  let VERSION = 0.001;
  let eval_rets = new util.cachering(() => [0, 0], 64);
  
  class BinaryEncoder extends Array {
    constructor() {
      super();

      this.buffer = new ArrayBuffer(8);
      
      this.u8view = new Uint8Array(this.buffer);
      this.u16view = new Uint16Array(this.buffer);
      this.i32view = new Int32Array(this.buffer);
      this.f32view = new Float32Array(this.buffer);
      this.f64view = new Float64Array(this.buffer);
    }
    
    int32(f) {
      this.i32view[0] = f;
      
      for (let i=0; i<4; i++) {
        this.push(this.u8view[i]);
      }
      
      return this;
    }
    
    uint16(f) {
      this.u16view[0] = f;
      
      for (let i=0; i<2; i++) {
        this.push(this.u8view[i]);
      }
      
      return this;
    }
    
    byte(f) {
      this.push(f);
    }
    
    float32(f) {
      this.f32view[0] = f;
      
      for (let i=0; i<4; i++) {
        this.push(this.u8view[i]);
      }
      
      return this;
    }
    
    float64(f) {
      this.f64view[0] = f;
      
      for (let i=0; i<8; i++) {
        this.push(this.u8view[i]);
      }
      
      return this;
    }
    
    toString() {
      let buf = "";
      
      for (let i=0; i<this.length; i++) {
        buf += String.fromCharCode(this[i]);
      }
      
      return btoa(buf);
    }
  }
  
  class BinaryDecoder {
    constructor(buffer) {
      this.view = new DataView(buffer);
      this.i = 0;
      this.endian = true; //assum little endian for now
    }
    
    int32() {
      this.i += 4;
      return this.view.getInt32(this.i - 4, this.endian);
    }
    
    uint16() {
      this.i += 2;
      return this.view.getUint16(this.i - 2, this.endian);
    }
    
    byte() {
      this.i += 1;
      return this.view.getInt8(this.i - 1);
    }
    
    float32() {
      this.i += 4;
      return this.view.getFloat32(this.i - 4, this.endian);
    }

    float64() {
      this.i += 8;
      return this.view.getFloat64(this.i - 8, this.endian);
    }
  }
  
  let MaskPoint = exports.MaskPoint = class MaskPoint {
    constructor(id, gen, r, curvetype) {
      this.id = id;
      this.gen = gen;
      this.r = r;
      
      this.curvetype = curvetype === undefined ? CurveTypes.LINEAR : curvetype;
      this.offsets = [];
      this.fieldlen = fieldLens[this.curvetype];
    }
    
    fromBinary(decoder) {
      this.curvetype = decoder.int32();
      this.id = decoder.int32();
      this.gen = decoder.float64();
      this.r = decoder.float64();
      
      this.fieldlen = fieldLens[this.curvetype];

      this.decode16(decoder);

      /*
      let len = decoder.int32();
      decoder.int32(); //drop padding bytes
      
      this.offsets.length = 0;
            
      for (let i=0; i<len; i++) {
        this.offsets.push(decoder.float32());
      }
      //*/

      return this;
    }
    
    encode16(encoder) {
      let min = 1e17, max = -1e17;
      for (let i=0; i<this.offsets.length; i++) {
        min = Math.min(min, this.offsets[i]);
        max = Math.max(max, this.offsets[i]);
      }
      
      this.min = min;
      this.max = max;
      
      encoder.int32(this.offsets.length);
      encoder.int32(OffsetsType.UINT16);

      encoder.float32(min);
      encoder.float32(max);
      
      for (let i=0; i<this.offsets.length; i++) {
        let f = this.offsets[i];
        
        f = (f - min) / (max - min);
        f = ~~(f * 65535);
        
        encoder.uint16(f);
      }
      
      return this;
    }
    
    decode16(decoder) {
      let len = decoder.int32();
      let datatype = decoder.int32();
      
      //legacy float32 data
      if (datatype == OffsetsType.FLOAT32) {
        this.offsets.length = 0;
        for (let i=0; i<len; i++) {
          this.offsets.push(decoder.float32());
        }

        return;
      }
      
      let min = this.min = decoder.float32();
      let max = this.max = decoder.float32();
      
      this.offsets.length = 0;
      
      for (let i=0; i<len; i++) {
        let f = decoder.uint16() / 65535;
        
        f = f*(max - min) + min;
        
        this.offsets.push(f);
      }
      
      return this;
    }
    
    toBinary(encoder) {
      encoder.int32(this.curvetype); //maintain 8-byte alignment for floats
      encoder.int32(this.id);

      encoder.float64(this.gen);
      encoder.float64(this.r);
      
      this.encode16(encoder);
      /*
      encoder.int32(this.offsets.length);
      encoder.int32(0); //padding
      
      for (let f of this.offsets) {
        encoder.float32(f);
      }
      //*/
    }
    
    toJSON() {
      return {
        curvetype : this.curvetype,
        id        : this.id,
        gen       : this.gen,
        r         : this.r,
        offsets   : this.offsets
      }
    }
    
    loadJSON(obj) {
      for (let k in obj) {
        this[k] = obj[k];
      }
      
      this.fieldlen = fieldLens[this.curvetype];

      return this;
    }
    
    compress() {
      let offs = this.offsets;
      let offs2 = [];
      
      let fieldlen = this.fieldlen;

      //do simple downsample for uniform linear 
      if (this.curvetype == CurveTypes.LINEAR) {
        for (let j=0; j<fieldlen; j++) {
          offs2.push(offs[j]);
        }

        for (let i=fieldlen; i<offs.length-fieldlen; i += fieldlen*2) {
          for (let j=0; j<fieldlen; j++) {
            offs2.push(offs[i+j]*0.5 + offs[i+fieldlen+j]*0.5);
          }
        }

        for (let j=0; j<fieldlen; j++) {
          offs2.push(offs[offs.length - fieldlen + j]);
        }

        this.offsets = offs2;
      }

      //collapse points for nonuniform linear
      if (this.curvetype != CurveTypes.LINEAR_NONUNIFORM) {
        return;
      }

      //*
      for (let j=0; j<fieldlen; j++) {
        offs2.push(offs[j]);
      }

      for (let i=fieldlen; i<offs.length-fieldlen; i += fieldlen) {
        let ax = offs2[offs2.length-fieldlen], ay = offs2[offs2.length-fieldlen+1];
        let bx = offs[i], by = offs[i+1];
        let cx = offs[i+fieldlen], cy = offs[i+fieldlen+1];
        
        //let t1 = offs2[offs2.length-fieldlen+NT];
        //let t2 = offs[i+NT];
        //let t3 = offs[i+fieldlen+NT];
        //t2 = t3 != t1 ? (t2 - t1) / (t3 - t1) : 0.5;

        let dx1 = cx-ax, dy1 = cy-ay;
        let dx2 = bx-ax, dy2 = by-ay;
        
        let d1 = dx1*dx1 + dy1*dy1;
        let d2 = dx2*dx2 + dy2*dy2;

        if (d1 > 0.000001) {
          d1 = Math.sqrt(d1);
          dx1 /= d1;
          dy1 /= d1;
        }
        
        if (d2 > 0.000001) {
          //d2 = Math.sqrt(d2);
          //dx2 /= d2;
          //dy2 /= d2;
        }

        let err = Math.abs(dx1*dy2 - dy1*dx2);
        
        if (err < 0.00005 && d1 > 0.001) {
          continue;
        }

        for (let j=0; j<fieldlen; j++) {
          offs2.push(offs[i+j]);
        }
      }

      for (let j=0; j<fieldlen; j++) {
        offs2.push(offs[offs.length-fieldlen+j]);
      }

      this.offsets = offs2;
      //*/
    }
    
    evaluate(t) {
      switch (this.curvetype) {
        case CurveTypes.LINEAR:
          return this.evaluate_linear_uniform(t);
        case CurveTypes.LINEAR_NONUNIFORM:
          return this.evaluate_linear_nonuniform(t);
        default:
          console.log(this);
          throw new Error("Bad curvetype " + this.curvetype);
      }
    }

    
    linear_nonuniform_search(t) {
      let offs = this.offsets;

      let start = 0, end = 0.9999999;
      let mid;

      for (let i=0; i<16; i++) {
        mid = (start + end)*0.5;

        let a = (~~(start*offs.length/PTOT))*PTOT;
        let b = (~~(mid*offs.length/PTOT))*PTOT;
        let c = (~~(end*offs.length/PTOT))*PTOT;

        if (offs[b+NT] > t) {
          end = mid;
        } else {
          start = mid;
        }
      }

      let ni = (~~(mid*offs.length/PTOT))*PTOT;
      return ni;
    }

    evaluate_linear_nonuniform(t) {
      let offs = this.offsets;
      let ret = eval_rets.next();

      if (offs.length == 0) {
        ret[0] = ret[1] = 0.0;
        return ret;
      }

      let a = this.linear_nonuniform_search(t);

      if (a > 0 && offs[a+NT] > t) { //paranoia check for off-by-one errors
        a -= NTOT;
      }

      if (a == offs.length - NTOT || offs.length == NTOT) {
        ret[0] = offs[a];
        ret[1] = offs[a+1];

        return ret;
      }

      let b = a + NTOT;
      let s = (t - offs[a+NT]) / (offs[b+NT] - offs[a+NT]);

      ret[0] = offs[a] + (offs[b] - offs[a])*s;
      ret[1] = offs[a+1] + (offs[b+1] - offs[a+1])*s;

      return ret;
    }

    evaluate_linear_uniform(t) {
      t = Math.min(Math.max(t, 0.0), 0.999999999);
      let totpoint = this.offsets.length / OFFTOT;
      
      let a = (~~(t*totpoint))*OFFTOT;
      
      let ret = eval_rets.next();
      
      if (a == 0 || a == this.offsets.length - OFFTOT) {
        ret[0] = this.offsets[a];
        ret[1] = this.offsets[a+1];
        
        return ret;
      }
      
      let b = a + OFFTOT;
      let ta = a / this.offsets.length;
      let s = (t - ta)*totpoint;
      
      ret[0] = this.offsets[a] + (this.offsets[b] - this.offsets[a])*s;
      ret[1] = this.offsets[a+1] + (this.offsets[b+1] - this.offsets[a+1])*s;
      
      return ret;
    }
  };
  
  exports.PointSet = class PointSet {
    constructor(blocksize) {
      this.blocksize = blocksize;
      this.points = [];
    }
    
    fromBinary(buf) {
      buf = atob(buf);
      let bytes = new Uint8Array(buf.length);
      
      for (let i=0; i<buf.length; i++) {
        bytes[i] = buf.charCodeAt(i);
      }
      
      let decoder = new BinaryDecoder(bytes.buffer);
      
      let version = decoder.float64();
      
      let len = decoder.int32();
      this.blocksize = decoder.int32();

      this.points.length = 0;
      for (let i=0; i<len; i++) {
        let p = new MaskPoint();

        p.fromBinary(decoder);
        this.points.push(p);
      }

      return this;
    }

    toBinary() {
      let encoder = new BinaryEncoder();
      
      encoder.float64(VERSION);
      
      encoder.int32(this.points.length);
      encoder.int32(this.blocksize);
      
      for (let p of this.points) {
        p.toBinary(encoder);
      }
      
      return encoder;
    }
    
    loadJSON(obj) {
      this.points = obj.points;
      this.blocksize = obj.blocksize;
      
      for (let i=0; i<this.points; i++) {
        let p = new MaskPoint();
        p.loadJSON(obj);
        
        this.points[i] = p;
      }
    }
    
    toJSON() {
      return {
        version        : VERSION,
        points         : this.points,
        blocksize      : this.blocksize,
        offsets_fields : {
          LINEAR : {
            OFFX : OFFX,
            OFFY : OFFY
          },

          LINEAR_NONUNIFORM : {
            NX : NX,
            NY : NY,
            NT : NT
          }
        }
      }
    }
  };
  
  return exports;
});

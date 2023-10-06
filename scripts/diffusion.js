import * as util from './util.js';
import cconst from './const.js';

export class Filter {
  constructor(data) {
    this.wrand = data[2];
    this.rand = data[3];

    //matrix of weight, random-factor, tuples
    this.filter = [];
    this.inten = 0.0;

    let fil = data[1];

    for (let i = 0; i < fil.length; i++) {
      let row = [];
      this.filter.push(row);

      for (let j = 0; j < fil[i].length; j++) {
        row.push([fil[i][j], 0.0]);
      }
    }

    this.get_cache = new Array(32);

    for (let i = 0; i < this.get_cache.length; i++) {
      let fil = new Array(this.filter.length);

      for (let j = 0; j < fil.length; j++) {
        fil[j] = new Array(this.filter[j].length);
      }

      this.get_cache[i] = fil;
    }

    this.get_cache.cur = 0;
  }

  copy() {
    let fl = this.get(0);

    let f = new Filter([this.inten, fl, this.wrand, this.rand]);
    f.inten = this.inten;
    f.rand = this.rand;
    f.wrand = this.wrand;

    return f;
  }

  get(f) {
    let ret = this.get_cache[this.get_cache.cur];
    this.get_cache.cur = (this.get_cache.cur + 1)%this.get_cache.length;
    let tot = 0.0;

    for (let i = 0; i < ret.length; i++) {
      for (let j = 0; j < ret[i].length; j++) {
        let a = this.filter[i][j][0];
        let r = this.filter[i][j][1];

        if (r !== 0.0) {
          a += Math.random()*r;
        }

        ret[i][j] = a;
        tot += a;
      }
    }

    tot = tot !== 0.0 ? 1.0/tot : 0.0;

    for (let i = 0; i < ret.length; i++) {
      for (let j = 0; j < ret[i].length; j++) {
        ret[i][j] *= tot;
      }
    }

    return ret;
  }
}

export function basic_filter() {
  //floyd steinberg
  let fil = [
    [0, 0, 0, 7, 0],
    [0, 3, 5, 1, 0],
    [0, 0.75, 1.25, 0.25, 0]
  ];

  //shiau fan
  /*
  let fil = [
    [0, 0, 0, 8, 0],
    [1, 2, 4, 1, 0],
    [1/2, 1, 2, 1/2, 0],
  ];
  //*/

  let ret = new Filter([0.0, fil, 0.0, 0.0]);
  ret.wrand = 0.0;

  return ret;
}

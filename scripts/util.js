import './polyfill.js';

window.tm = 0.0;

export function time_ms() {
  if (window.performance)
    return window.performance.now();
  else
    return new Date().getMilliseconds();
}

//unordered array
export class RandomArray {
  constructor() {
    Array.apply(this, arguments);
  }

  //pop by swapping with last item in unordered array
  pop_i(i) {
    if (this.length < 2) {
      let ret = this[i];

      this.length = 0;
      return ret;
    }

    let ret = this[i];
    this[i] = this[this.length - 1];
    this.length--;

    return ret;
  }

  remove(item, no_error) {
    let i = this.indexOf(item);

    if (i < 0) {
      if (!no_error) {
        console.trace("WARNING: item not in array!", item);
        return;
      } else {
        throw new Error("Item not in array: " + item);
      }
    }

    this.pop_i(item);
  }
}

export class cachering extends Array {
  constructor(func, size) {
    super();

    this.cur = 0;

    for (let i = 0; i < size; i++) {
      this.push(func());
    }
  }

  static fromConstructor(cls, size) {
    let func = function () {
      return new cls();
    }

    return new cachering(func, size);
  }

  next() {
    let ret = this[this.cur];
    this.cur = (this.cur + 1)%this.length;

    return ret;
  }
}

export class SetIter {
  constructor(set) {
    this.set = set;
    this.i = 0;
    this.ret = {done: false, value: undefined};
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    let ret = this.ret;

    while (this.i < this.set.items.length && this.set.items[this.i] === EmptySlot) {
      this.i++;
    }

    if (this.i >= this.set.items.length) {
      ret.done = true;
      ret.value = undefined;

      return ret;
    }


    ret.value = this.set.items[this.i++];
    return ret;
  }
}

let EmptySlot = {};

export class set {
  constructor(input) {
    this.items = [];
    this.keys = {};
    this.freelist = [];

    this.length = 0;

    if (typeof input === "string") {
      input = new String(input);
    }

    if (input !== undefined) {
      if (Symbol.iterator in input) {
        for (let item of input) {
          this.add(item);
        }
      } else if ("forEach" in input) {
        input.forEach(function (item) {
          this.add(item);
        }, this);
      } else if (input instanceof Array) {
        for (let i = 0; i < input.length; i++) {
          this.add(input[i]);
        }
      }
    }
  }

  [Symbol.iterator]() {
    return new SetIter(this);
  }

  add(item) {
    let key = item[Symbol.keystr]();

    if (key in this.keys) return;

    if (this.freelist.length > 0) {
      let i = this.freelist.pop();

      this.keys[key] = i;
      this.items[i] = item;
    } else {
      let i = this.items.length;

      this.keys[key] = i;
      this.items.push(item);
    }

    this.length++;
  }

  remove(item) {
    let key = item[Symbol.keystr]();

    if (!(key in this.keys)) {
      console.trace("Warning, item", item, "is not in set");
      return;
    }

    let i = this.keys[key];
    this.freelist.push(i);
    this.items[i] = EmptySlot;

    delete this.keys[key];

    this.length--;
  }

  has(item) {
    return item[Symbol.keystr]() in this.keys;
  }

  forEach(func, thisvar) {
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];

      if (item === EmptySlot)
        continue;

      thisvar !== undefined ? func.call(thisvar, item) : func(item);
    }
  }
}

let _hash_null = {};

export class hashtable {
  constructor() {
    this.items = [];
    this._keys = {};
    this.length = 0;
  }

  set(key, val) {
    key = key[Symbol.keystr]();

    let i;
    if (!(key in this._keys)) {
      i = this.items.length;
      this.items.push(0);
      this._keys[key] = i;

      this.length++;
    } else {
      i = this._keys[key];
    }

    this.items[i] = val;
  }

  remove(key) {
    key = key[Symbol.keystr]();

    if (!(key in this._keys)) {
      console.trace("Warning, key not in hashtable:", key);
      return;
    }

    let i = this._keys[key];
    this.items[i] = _hash_null;
    delete this._keys[key];
    this.length--;
  }

  has(key) {
    key = key[Symbol.keystr]();

    return key in this._keys;
  }

  get(key) {
    key = key[Symbol.keystr]();
    if (!(key in this._keys)) {
      console.trace("Warning, item not in hash", key);
      return undefined;
    }

    return this.items[this._keys[key]];
  }

  add(key, val) {
    return this.set(key, val);
  }

  keys() {
    return Object.keys(this._keys);
  }

  values() {
    let ret = [];
    let len = this.items.length;

    for (let i = 0; i < len; i++) {
      let item = this.items[i];
      if (item !== _hash_null)
        ret.push(item);
    }

    return ret;
  }

  forEach(cb, thisvar) {
    if (thisvar === undefined)
      thisvar = self;

    for (let k in this._keys) {
      let i = this._keys[k];
      cb.call(thisvar, k, this.items[i]);
    }
  }
}

export class IDGen {
  constructor() {
    this._cur = 1;
  }

  next() {
    return this._cur++;
  }

  max_cur(id) {
    this._cur = Math.max(this._cur, id + 1);
  }

  toJSON() {
    return {
      _cur: this._cur
    };
  }

  static fromJSON(obj) {
    let ret = new IDGen();
    ret._cur = obj._cur;
    return ret;
  }
}


function get_callstack(err) {
  if (err === undefined) {
    try {
      throw new Error();
    } catch (err1) {
      err = err1;
    }
  }

  return err.stack.split("\n");
}

export function print_stack(err) {
  let cs;

  try {
    cs = get_callstack(err);
  } catch (err2) {
    console.log("Could not fetch call stack.");
    return;
  }

  console.log("Callstack:");
  for (let i = 0; i < cs.length; i++) {
    console.log(cs[i]);
  }
}

//return_arraybuffer is optional, false
export function fetch_file(path, return_arraybuffer) {
  let url = location.origin + "/" + path

  let req = new XMLHttpRequest(
  );

  if (return_arraybuffer) {
    req.responseType = "arraybuffer";
  }

  return new Promise(function (accept, reject) {
    req.open("GET", url)
    req.onreadystatechange = function (e) {
      if (req.status === 200 && req.readyState === 4) {
        accept(req.response);
      } else if (req.status >= 400) {
        reject(req.status, req.statusText);
      }
    }
    req.send();
  });
}


//from: https://en.wikipedia.org/wiki/Mersenne_Twister
function _int32(x) {
  // Get the 31 least significant bits.
  return ~~(((1<<30) - 1) & (~~x))
}

export class MersenneRandom {
  constructor(seed) {
    // Initialize the index to 0
    this.index = 624;
    this.mt = new Uint32Array(624);

    this.seed(seed);
  }

  save() {
    let mt = new Uint32Array(this.mt.length);

    for (let i = 0; i < mt.length; i++) {
      mt[i] = this.mt[i];
    }

    return {
      index: this.index,
      mt   : mt,
    }
  }

  load(mt) {
    this.mt = mt.mt;
    this.index = mt.index;

    return this;
  }

  seed(seed) {
    // Initialize the index to 0
    this.index = 624;
    this.mt.fill(0, 0, this.mt.length);

    this.mt[0] = seed;  // Initialize the initial state to the seed

    for (let i = 1; i < 624; i++) {
      this.mt[i] = _int32(
        1812433253*(this.mt[i - 1] ^ this.mt[i - 1]>>30) + i);
    }
  }

  extract_number() {
    if (this.index >= 624)
      this.twist();

    let y = this.mt[this.index];

    // Right shift by 11 bits
    y = y ^ y>>11;
    // Shift y left by 7 and take the bitwise and of 2636928640
    y = y ^ y<<7 & 2636928640;
    // Shift y left by 15 and take the bitwise and of y and 4022730752
    y = y ^ y<<15 & 4022730752;
    // Right shift by 18 bits
    y = y ^ y>>18;

    this.index = this.index + 1;

    return _int32(y);
  }

  random() {
    return this.extract_number()/(1<<30);
  }

  twist() {
    for (let i = 0; i < 624; i++) {
      // Get the most significant bit and add it to the less significant
      // bits of the next number
      let y = _int32((this.mt[i] & 0x80000000) +
        (this.mt[(i + 1)%624] & 0x7fffffff));
      this.mt[i] = this.mt[(i + 397)%624] ^ y>>1;

      if (y%2 !== 0)
        this.mt[i] = this.mt[i] ^ 0x9908b0df;
    }

    this.index = 0;
  }
}

let _mt = new MersenneRandom(0);

export function random() {
  return _mt.extract_number()/(1<<30);
}

export function seed(n) {
  _mt.seed(n);
}

const seedstack = [];
seed.push = function(seed) {
  seedstack.push(_mt.save());
}

seed.pop = function() {
  _mt.load(seedstack.pop());
}



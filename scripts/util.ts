import "./polyfill.js";

window.tm = 0.0;

export function time_ms() {
  if (window.performance) return window.performance.now();
  else return new Date().getMilliseconds();
}

// An object that can produce a stable string hash key via the custom
// `Symbol.keystr` method installed by polyfill.ts.
export interface Keyable {
  [key: symbol]: () => string;
}

//unordered array
export class RandomArray<T = unknown> extends Array<T> {
  constructor() {
    super();
    Array.apply(this, arguments as unknown as []);
  }

  //pop by swapping with last item in unordered array
  pop_i(i: number): T {
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

  remove(item: T, no_error?: boolean): void {
    let i = this.indexOf(item);

    if (i < 0) {
      if (!no_error) {
        console.trace("WARNING: item not in array!", item);
        return;
      } else {
        throw new Error("Item not in array: " + item);
      }
    }

    this.pop_i(item as unknown as number);
  }
}

export class cachering<T = unknown> extends Array<T> {
  cur: number;

  constructor(func: () => T, size: number) {
    super();

    this.cur = 0;

    for (let i = 0; i < size; i++) {
      this.push(func());
    }
  }

  static fromConstructor<U>(cls: new () => U, size: number): cachering<U> {
    let func = function (): U {
      return new cls();
    };

    return new cachering(func, size);
  }

  next(): T {
    let ret = this[this.cur];
    this.cur = (this.cur + 1) % this.length;

    return ret;
  }
}

interface IterResult<T> {
  done: boolean;
  value: T | undefined;
}

export class SetIter<T extends Keyable> {
  set: set<T>;
  i: number;
  ret: IterResult<T>;

  constructor(set: set<T>) {
    this.set = set;
    this.i = 0;
    this.ret = { done: false, value: undefined };
  }

  [Symbol.iterator]() {
    return this;
  }

  next(): IterResult<T> {
    let ret = this.ret;

    while (
      this.i < this.set.items.length &&
      this.set.items[this.i] === EmptySlot
    ) {
      this.i++;
    }

    if (this.i >= this.set.items.length) {
      ret.done = true;
      ret.value = undefined;

      return ret;
    }

    ret.value = this.set.items[this.i++] as T;
    return ret;
  }
}

let EmptySlot = {};

export class set<T extends Keyable = Keyable> {
  items: (T | typeof EmptySlot)[];
  keys: { [key: string]: number };
  freelist: number[];
  length: number;

  constructor(
    input?:
      | Iterable<T>
      | { forEach: (cb: (item: T) => void, thisArg?: unknown) => void }
      | T[]
      | string,
  ) {
    this.items = [];
    this.keys = {};
    this.freelist = [];

    this.length = 0;

    let inp:
      | Iterable<T>
      | { forEach: (cb: (item: T) => void, thisArg?: unknown) => void }
      | T[]
      | object
      | string
      | undefined = input;

    if (typeof input === "string") {
      inp = new String(input);
    }

    if (inp !== undefined && typeof inp === "object") {
      if (Symbol.iterator in inp) {
        for (let item of inp as Iterable<T>) {
          this.add(item);
        }
      } else if ("forEach" in inp) {
        inp.forEach(function (this: set<T>, item: T) {
          this.add(item);
        }, this);
      } else if (inp instanceof Array) {
        for (let i = 0; i < inp.length; i++) {
          this.add(inp[i]);
        }
      }
    }
  }

  [Symbol.iterator]() {
    return new SetIter(this);
  }

  add(item: T): void {
    let key = item[Symbol.keystr]();

    if (key in this.keys) return;

    if (this.freelist.length > 0) {
      let i = this.freelist.pop()!;

      this.keys[key] = i;
      this.items[i] = item;
    } else {
      let i = this.items.length;

      this.keys[key] = i;
      this.items.push(item);
    }

    this.length++;
  }

  remove(item: T): void {
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

  has(item: T): boolean {
    return item[Symbol.keystr]() in this.keys;
  }

  forEach(func: (item: T) => void, thisvar?: unknown): void {
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];

      if (item === EmptySlot) continue;

      thisvar !== undefined ? func.call(thisvar, item as T) : func(item as T);
    }
  }
}

let _hash_null = {};

export class hashtable<K extends Keyable = Keyable, V = unknown> {
  items: (V | typeof _hash_null)[];
  _keys: { [key: string]: number };
  length: number;

  constructor() {
    this.items = [];
    this._keys = {};
    this.length = 0;
  }

  set(key: K, val: V): void {
    let keystr = key[Symbol.keystr]();

    let i;
    if (!(keystr in this._keys)) {
      i = this.items.length;
      this.items.push(0);
      this._keys[keystr] = i;

      this.length++;
    } else {
      i = this._keys[keystr];
    }

    this.items[i] = val;
  }

  remove(key: K): void {
    let keystr = key[Symbol.keystr]();

    if (!(keystr in this._keys)) {
      console.trace("Warning, key not in hashtable:", keystr);
      return;
    }

    let i = this._keys[keystr];
    this.items[i] = _hash_null;
    delete this._keys[keystr];
    this.length--;
  }

  has(key: K): boolean {
    let keystr = key[Symbol.keystr]();

    return keystr in this._keys;
  }

  get(key: K): V | undefined {
    let keystr = key[Symbol.keystr]();
    if (!(keystr in this._keys)) {
      console.trace("Warning, item not in hash", keystr);
      return undefined;
    }

    return this.items[this._keys[keystr]] as V;
  }

  add(key: K, val: V): void {
    return this.set(key, val);
  }

  keys(): string[] {
    return Object.keys(this._keys);
  }

  values(): V[] {
    let ret: V[] = [];
    let len = this.items.length;

    for (let i = 0; i < len; i++) {
      let item = this.items[i];
      if (item !== _hash_null) ret.push(item as V);
    }

    return ret;
  }

  forEach(cb: (key: string, val: V) => void, thisvar?: unknown): void {
    if (thisvar === undefined) thisvar = self;

    for (let k in this._keys) {
      let i = this._keys[k];
      cb.call(thisvar, k, this.items[i] as V);
    }
  }
}

export class IDGen {
  _cur: number;

  constructor() {
    this._cur = 1;
  }

  next(): number {
    return this._cur++;
  }

  max_cur(id: number): void {
    this._cur = Math.max(this._cur, id + 1);
  }

  toJSON() {
    return {
      _cur: this._cur,
    };
  }

  static fromJSON(obj: { _cur: number }): IDGen {
    let ret = new IDGen();
    ret._cur = obj._cur;
    return ret;
  }
}

function get_callstack(err?: Error): string[] {
  if (err === undefined) {
    try {
      throw new Error();
    } catch (err1) {
      err = err1 as Error;
    }
  }

  return err!.stack!.split("\n");
}

export function print_stack(err?: Error): void {
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
export function fetch_file(
  path: string,
  return_arraybuffer?: boolean,
): Promise<unknown> {
  let url = location.origin + "/" + path;

  let req = new XMLHttpRequest();

  if (return_arraybuffer) {
    req.responseType = "arraybuffer";
  }

  return new Promise(function (accept, reject) {
    req.open("GET", url);
    req.onreadystatechange = function (e) {
      if (req.status === 200 && req.readyState === 4) {
        accept(req.response);
      } else if (req.status >= 400) {
        reject(req.statusText);
      }
    };
    req.send();
  });
}

//from: https://en.wikipedia.org/wiki/Mersenne_Twister
function _int32(x: number): number {
  // Get the 31 least significant bits.
  return ~~(((1 << 30) - 1) & ~~x);
}

export interface MersenneState {
  index: number;
  mt: Uint32Array;
}

export class MersenneRandom {
  index: number;
  mt: Uint32Array;

  constructor(seed: number) {
    // Initialize the index to 0
    this.index = 624;
    this.mt = new Uint32Array(624);

    this.seed(seed);
  }

  save(): MersenneState {
    let mt = new Uint32Array(this.mt.length);

    for (let i = 0; i < mt.length; i++) {
      mt[i] = this.mt[i];
    }

    return {
      index: this.index,
      mt: mt,
    };
  }

  load(mt: MersenneState): this {
    this.mt = mt.mt;
    this.index = mt.index;

    return this;
  }

  seed(seed: number): void {
    // Initialize the index to 0
    this.index = 624;
    this.mt.fill(0, 0, this.mt.length);

    this.mt[0] = seed; // Initialize the initial state to the seed

    for (let i = 1; i < 624; i++) {
      this.mt[i] = _int32(
        1812433253 * (this.mt[i - 1] ^ (this.mt[i - 1] >> 30)) + i,
      );
    }
  }

  extract_number(): number {
    if (this.index >= 624) this.twist();

    let y = this.mt[this.index];

    // Right shift by 11 bits
    y = y ^ (y >> 11);
    // Shift y left by 7 and take the bitwise and of 2636928640
    y = y ^ ((y << 7) & 2636928640);
    // Shift y left by 15 and take the bitwise and of y and 4022730752
    y = y ^ ((y << 15) & 4022730752);
    // Right shift by 18 bits
    y = y ^ (y >> 18);

    this.index = this.index + 1;

    return _int32(y);
  }

  random(): number {
    return this.extract_number() / (1 << 30);
  }

  twist(): void {
    for (let i = 0; i < 624; i++) {
      // Get the most significant bit and add it to the less significant
      // bits of the next number
      let y = _int32(
        (this.mt[i] & 0x80000000) + (this.mt[(i + 1) % 624] & 0x7fffffff),
      );
      this.mt[i] = this.mt[(i + 397) % 624] ^ (y >> 1);

      if (y % 2 !== 0) this.mt[i] = this.mt[i] ^ 0x9908b0df;
    }

    this.index = 0;
  }
}

let _mt = new MersenneRandom(0);

export function random(): number {
  return _mt.extract_number() / (1 << 30);
}

interface SeedFn {
  (n: number): void;
  push: (seed?: number) => void;
  pop: () => void;
}

export const seed: SeedFn = function seed(n: number): void {
  _mt.seed(n);
} as SeedFn;

const seedstack: MersenneState[] = [];
seed.push = function (seed?: number) {
  seedstack.push(_mt.save());
};

seed.pop = function () {
  _mt.load(seedstack.pop()!);
};

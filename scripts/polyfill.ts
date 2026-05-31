// Shape of the minimal Symbol replacement the shim below builds. The real
// `SymbolConstructor` has ~16 members we don't implement, so this shim can't
// structurally satisfy it; we describe the subset we do build and cast once.
interface SymbolShim {
  (key?: string): string;
  _sym_registry: Record<string, string>;
  for(key: string): string;
  keyFor(sym: string): string | undefined;
  iterator: string;
  keystr: string;
}

if (window.Symbol === undefined) {
  //eek!
  window.Symbol = (function () {
    //a micro module
    let key_idgen = 1;

    let Symbol = function (key?: string): string {
      return "$__" + key + "_" + key_idgen++ + "__$";
    } as SymbolShim;

    Symbol._sym_registry = {};
    Symbol.for = function (key: string): string {
      if (!(key in Symbol._sym_registry)) {
        Symbol._sym_registry[key] = Symbol(key);
      }

      return Symbol._sym_registry[key];
    };

    Symbol.keyFor = function (sym: string): string | undefined {
      for (let k in Symbol._sym_registry) {
        if (Symbol._sym_registry[k] === sym) return k;
      }
    };

    Symbol.iterator = Symbol.for("iterator");
    Symbol.keystr = Symbol.for("keystr");

    // The string-based shim only approximates the native SymbolConstructor; the
    // cast bridges that gap (no native Symbol exists in this branch anyway).
    return Symbol as unknown as SymbolConstructor;
  })();
} else {
  Symbol.keystr = Symbol("keystr");
}

window.list = function list(iter: any): any[] {
  let ret: any[] = [];

  if (typeof iter === "string") {
    iter = new String();
  }

  if (Symbol.iterator in iter) {
    for (let item of iter) {
      ret.push(item);
    }
  } else {
    iter.forEach(function (item: any) {
      ret.push(item);
    }, this);
  }

  return ret;
};

interface ArrayIterResult {
  done: boolean;
  value: unknown;
}

interface ArrayIter {
  array: unknown[];
  i: number;
  ret: ArrayIterResult;
  [Symbol.iterator](): ArrayIter;
  next(): ArrayIterResult;
}

interface ArrayIterConstructor {
  new (array: unknown[]): ArrayIter;
  prototype: ArrayIter;
}

const ArrayIter = function (this: ArrayIter, array: unknown[]) {
  this.array = array;
  this.i = 0;
  this.ret = { done: false, value: undefined };
} as unknown as ArrayIterConstructor;

ArrayIter.prototype[Symbol.iterator] = function (this: ArrayIter): ArrayIter {
  return this;
};

ArrayIter.prototype.next = function (this: ArrayIter): ArrayIterResult {
  let ret = this.ret;

  if (this.i >= this.array.length) {
    ret.done = true;
    ret.value = undefined;
    return ret;
  }

  ret.value = this.array[this.i++];
  return ret;
};

if (Math.sign === undefined) {
  Math.sign = function sign(f: number): number {
    return +(f > 0.0) * 2.0 - 1.0;
  };
}

if (Math.fract === undefined) {
  Math.fract = function fract(f: number): number {
    return f - Math.floor(f);
  };
}

if (Math.tent === undefined) {
  Math.tent = function tent(f: number): number {
    return 1.0 - Math.abs(Math.fract(f) - 0.5) * 2.0;
  };
}

window.time_ms = function () {
  return window.performance.now();
};

/*Override array iterator to not allocate too much*/
//Array.prototype[Symbol.iterator] = function() {
//  return new ArrayIter(this);
//}

if (Array.prototype.clone === undefined) {
  Array.prototype.clone = function <T>(this: T[]): T[] {
    return this.slice(0);
  };
}

if (Array.prototype.pop_i === undefined) {
  Array.prototype.pop_i = function <T>(this: T[], idx: number): void {
    if (idx < 0 || idx >= this.length) {
      throw new Error("Index out of range");
    }

    while (idx < this.length) {
      this[idx] = this[idx + 1];
      idx++;
    }

    this.length -= 1;
  };
}

if (Array.prototype.remove === undefined) {
  Array.prototype.remove = function <T>(
    this: T[],
    item: T,
    suppress_error?: boolean,
  ): void {
    let i = this.indexOf(item);

    if (i < 0) {
      if (suppress_error) console.trace("Warning: item not in array", item);
      else throw new Error("Error: item not in array " + item);

      return;
    }

    this.pop_i(i);
  };
}

if (String.prototype.contains === undefined) {
  String.prototype.contains = function (this: string, substr: string): boolean {
    return this.search(substr) >= 0;
  };
}

String.prototype[Symbol.keystr] = function (this: string): string {
  return this;
};

Number.prototype[Symbol.keystr] = Boolean.prototype[Symbol.keystr] = function (
  this: number | boolean,
): string {
  return "" + this;
};

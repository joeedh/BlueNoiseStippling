// Ambient declarations for the legacy global surface this app still relies on.
// These were implicit `window.*` / `Math.*` members in the original JS. They are
// genuinely dynamic global scratch/bridge values, so `any` is the appropriate
// boundary type here (this is the one place the project tolerates it).

interface Window {
  // app wiring
  startapp: () => void;
  redraw_all: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _appstate: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gui: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relaxbut: any;

  // data blobs / export scratch
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save_buffer: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _svg: any;
  _image_url: string;
  blue_mask_file: string;
  newline_data_url: (s: string) => string;

  // helper functions attached to window by various modules
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rot: (...args: any[]) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bin: (...args: any[]) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: (iter: any) => any[];
  time_ms: () => number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _rgbaPath: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _isRGBA: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _parseRGBA: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _bin_cache: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _search_offs: any[];

  // numeric debug scratch
  tm: number;
  _f: number;
  _d: number;
  _l: number;
  _f2: number;
  _totsample: number;

  // vendored Delaunay triangulation global
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Delaunay: any;
}

interface Math {
  // saved reference to the original Math.random (see const.ts)
  _random(): number;
  // custom helpers installed at runtime by math.ts
  fract(f: number): number;
  tent(f: number): number;
  tend(f: number): number;
  pi: number;
}

// Vendored Delaunay library, also used as a bare global.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Delaunay: any;

// Custom symbol installed by polyfill.ts. Used as a method key on objects that
// can produce a stable string key for hashing in `set`/`hashtable`.
interface SymbolConstructor {
  keystr: symbol;
}

// Prototype helpers installed at runtime by polyfill.ts. Declared here so every
// module that uses them (util.ts, ui.ts, colors.ts, ...) sees the augmented
// shape, not just polyfill.ts.
interface Array<T> {
  // shallow copy (slice(0))
  clone(): T[];
  // remove element at index, shifting the tail down
  pop_i(idx: number): void;
  // remove first occurrence of an item; optionally warn instead of throw
  remove(item: T, suppress_error?: boolean): void;
}

interface String {
  // true if substr is found anywhere in the string
  contains(substr: string): boolean;
  // stable string hash key (Symbol.keystr method, installed by polyfill.ts)
  [key: symbol]: unknown;
}

interface Number {
  // stable string hash key (Symbol.keystr method, installed by polyfill.ts)
  [key: symbol]: unknown;
}

interface Boolean {
  // stable string hash key (Symbol.keystr method, installed by polyfill.ts)
  [key: symbol]: unknown;
}

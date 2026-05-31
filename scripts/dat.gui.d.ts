// Ambient types for the vendored, untyped dat.gui.js. It installs a global
// `dat` (with `dat.GUI`) as a side effect of `import './dat.gui.js'`. Typing the
// full controller-chaining API of a vendored GUI library has little value, so we
// model `dat` as `any` -- a justified boundary for an opaque vendored global.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const dat: any;

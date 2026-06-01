// Lets tsgo/eslint resolve `import X from './Foo.svelte'`. The .svelte files
// are compiled by esbuild-svelte and are NOT type-checked by tsgo (the same
// boundary the vendored dat.gui.d.ts establishes). The default export is the
// Svelte 5 component constructor consumed via `mount()` in appstate.ts.
declare module "*.svelte" {
  import type { Component } from "svelte";
  const component: Component<Record<string, unknown>>;
  export default component;
}

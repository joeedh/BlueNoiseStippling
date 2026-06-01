# CLAUDE.md

Guidance for working in this repository.

## What this is

A browser-based **Blue Noise Stippling** generator: it loads a raster image and
renders it as a field of stipple points (or sticks / triangles), distributed with
blue-noise characteristics via iterative relaxation, optional color quantization,
and SVG export. The whole app runs client-side (Canvas 2D); there is no backend.

Originally plain ES6-module JavaScript with no build step; now a TypeScript
project bundled with esbuild, type-checked with tsgo, tested with vitest +
Playwright. The control UI is a **Svelte 5** app (compiled by the
`esbuild-svelte` plugin) mounted into `#ui-root`; the legacy dat.gui UI has been
removed.

## Commands (pnpm)

| Command          | What it does                                                                                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`       | esbuild dev server (watch + serve) at http://127.0.0.1:8000 — bundles `scripts/appstate.ts` → `dist/bundle.js`, serves `index.html`.                            |
| `pnpm build`     | Production bundle to `dist/` (minified).                                                                                                                        |
| `pnpm typecheck` | `tsgo --noEmit` (the `@typescript/native-preview` compiler). Must be 0 errors.                                                                                  |
| `pnpm eslint`    | Lint (`eslint .`). 0 errors expected; warnings (dead code, justified `any`) are tolerated.                                                                      |
| `pnpm format`    | Format with the **`@pathtx/prettier`** fork (`prettier --write .`).                                                                                             |
| `pnpm test`      | vitest unit tests (`tests/**/*.test.ts`, jsdom).                                                                                                                |
| `pnpm test:e2e`  | Playwright e2e (`e2e/`) — boots the app via the dev server (port 5733), drives a real image through the pipeline, asserts non-blank render + no console errors. |

Entry point: `index.html` loads the bundled `appstate.ts` (plus the generated
`bundle.css`), which calls `appstate.start()` on window load. (`bluenoise6.html`
is the original, pre-build entry — kept for reference, not used by the build.)

## Architecture (scripts/)

**Algorithm core**

- `bluenoise.ts` — the `BlueNoise` class: the core stippling/relaxation algorithm (the largest, hottest file).
- `sampler.ts` — image sampling/preprocessing (filters, sharpening, histogram equalization, deband).
- `diffusion.ts` — error-diffusion filter kernels.
- `smoothmask.ts` — binary encode/decode of the "smooth mask" format (`BinaryEncoder`/`BinaryDecoder`).

**Spatial & math**

- `vectormath.ts` — `Vector2/3/4`, `Quat`, `Matrix4`. ⚠️ Vector methods are **generated at runtime via `eval`/codegen** and injected onto the prototypes; the class bodies _declare_ those methods so consumers see a real API. (Note: a `Vector2`'s backing array `length` is 3, not 2 — its constructor writes index 2.)
- `math.ts` — geometry helpers (winding, intersection, triangle/aabb tests, `MinMax`).
- `kdtree.ts`, `kdtree2.ts` — k-d tree spatial indices for neighbor queries.
- `delaunay.ts` — Delaunay triangulation (wraps the vendored `Delaunay` global).

**Render & output**

- `render.ts` — `CircleRender`, a custom software rasterizer (a duck-typed stand-in for a 2D context).
- `draw.ts` — the `Drawer`: draws points/sticks/triangles to a `CanvasRenderingContext2D`.
- `exportsvg.ts` — `SVGExporter` (also a canvas-context stand-in) + `exportSVG()`.

**UI & app**

- `curve.ts` — the **pure** curve math engine (`CurveTypeData` → `BSplineCurve`/`CustomCurve`/`GuassianCurve`, `Curve`, `CurvePoint`). DOM-free and GUI-free: evaluation math + JSON only. The solver reads curves through `Curve.evaluate(t)`; rendering/interaction live in the Svelte editor.
- `svelte/` — the Svelte 5 control rail. `App.svelte` (layout + the `SCHEMA`-driven panels), control primitives (`Slider`/`Toggle`/`Select`/`Button`/`Panel`), `CurveEditor.svelte` (canvas-based b-spline editor driving `curve.ts`), `PresetBar.svelte` + `presets.ts` (named presets in `localStorage`, JSON import/export), `schema.ts` (the single source of control metadata + tooltip copy), `config-store.ts` (rune-free helpers bridging the reactive mirror to the `config` singleton), `tooltip.ts` (shared tooltip action), `theme.css` (the dark instrument-panel theme).
- `appstate.ts` — the `AppState` class, the `start()` entry point, `makeGUI()` (creates the three curves, assigns them into `config`, then `mount()`s the Svelte `App`), the toolbar `action*` methods the UI calls, image loading (FileReader / IndexedDB), and the main `requestAnimationFrame` redraw loop.

**Config & utilities**

- `const.ts` — see "Config convention" below.
- `colors.ts` — color-space conversions (RGB/XYZ/LAB/CMYK), palette generation, closest-color maps.
- `util.ts` — collection types (`cachering`, `set`, `hashtable`, `RandomArray`, `IDGen`, `MersenneRandom`).
- `indexdb_store.ts` — `IndexDBStore`, an IndexedDB wrapper for persisting masks.
- `polyfill.ts` — installs `Symbol.keystr` and a few prototype helpers used across the codebase.

## Config convention (important)

The original code broadcast ~70 runtime settings and ~16 typed-array field offsets
onto `window.*` globals. The port **replaced those globals with module imports**
(`scripts/const.ts`):

- **Immutable constants** are named exports: the point-record offsets
  `PX, PY, PRADIUS, … PTOT` (import them by name), plus `APP_VERSION` and the
  `RASTER_MODES` enum.
- **Mutable runtime settings** live on a single exported singleton:
  `import { config } from './const.js'` → read/write `config.DIMEN`, `config.SCALE`,
  `config.RASTER_MODE`, etc. `config` is a live object shared by reference
  everywhere; the Svelte UI keeps a reactive `$state` mirror but writes every
  change straight through to this singleton (so the solver sees it) via the
  helpers in `scripts/svelte/config-store.ts`. Never freeze `config`.
- `cconst` (the default export of `const.ts`) holds helper functions and
  `defaultConfig`; `cconst.toJSON()`/`loadJSON()` serialize `config`.
- ⚠️ Don't confuse `config.RASTER_MODE` (a mutable number) with the `RASTER_MODES`
  enum (`{DIFFUSION,PATTERN,CMYK}`).

## Point data layout

Point/particle data is stored in **flat typed arrays**, not objects. Each point
occupies `PTOT` (15) consecutive floats; field `f` of point `i` is
`points[i * PTOT + f]`, where `f` is one of the offset constants
(`PX`=x, `PY`=y, `PRADIUS`, `PINTEN`=intensity, `PID`, `PLVL`, …). Keep this layout
when touching `bluenoise.ts`/`draw.ts`/`smoothmask.ts`.

## TypeScript notes

- `tsconfig.json`: `strict`, `moduleResolution: "bundler"`, `noEmit`. Import
  specifiers keep the `.js` extension (e.g. `import './util.js'`) — esbuild and
  tsgo resolve them to the `.ts` siblings; **don't rewrite them to `.ts`**.
- `globals.d.ts` (root) declares the remaining legacy global surface (`window.*`
  scratch/wiring, custom `Math.*` like `Math.fract`/`Math.tent`, the `Symbol.keystr`
  symbol, and the vendored `Delaunay` global) — this is the one place `any` is used
  freely (an explicit boundary for the dynamic legacy globals).
- `scripts/dat.gui.d.ts` declares the vendored, untyped `dat` global (`dat.GUI`) as
  `any`; `scripts/dat.gui.js` stays vendored JavaScript (excluded from typecheck).
- The `CircleRender` and `SVGExporter` classes are intentional **duck-typed
  stand-ins** for a `CanvasRenderingContext2D`; the few `as unknown as` casts where
  they're passed to `renderImage`/the drawer are deliberate and commented.

## Vendored / dead files (not ported, excluded from the build)

`scripts/require.js` (unused AMD loader), `scripts/relax_worker.js` (a worker
that is never instantiated), `scripts/typesystem.js` (empty). The big inline-data
modules `mask_file.ts`, `smoothmask_file.ts`, `flowersData.ts` are just
string-blob exports. (The vendored `dat.gui.js`/`dat.gui.d.ts` were removed when
the UI was ported to Svelte.)

## Gotchas

- A clean `pnpm typecheck` does **not** prove the app works — the render pipeline
  is exercised by `pnpm test:e2e`, which is the real regression oracle. Run it
  after non-trivial changes.
- Stippling output is **stochastic**; tests assert structural/content facts
  (canvas non-blank, deterministic pure-function results), never exact pixels.
- `loadFlowerSvg()` (the built-in default image) was fixed during the port — the
  original used a non-standard `import(spec, callback)` form whose callback never
  fired, so the default flower never actually loaded.

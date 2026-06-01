// Plain (rune-free) helpers shared by the Svelte UI. The reactive `$state`
// mirror of `config` lives in App.svelte; this module only provides the
// snapshot/apply/commit primitives so the mirror and the canonical `config`
// singleton (which the solver reads by reference) stay in sync.

import cconst, { config } from "../const.js";

// The UI treats config as a dynamic string-keyed bag (Config has no index sig).
export type ConfigBag = Record<string, unknown>;

const bag = config as unknown as ConfigBag;

// Keys that hold Curve objects rather than plain scalars — the control panel
// never binds these as sliders/toggles; the CurveEditor owns them directly.
export const CURVE_KEYS = ["SPH_CURVE", "TONE_CURVE", "DENSITY_CURVE"];

// A shallow copy of every scalar config field, for seeding the reactive mirror.
export function snapshotConfig(): ConfigBag {
  const out: ConfigBag = {};
  for (const k in bag) {
    if (CURVE_KEYS.includes(k)) continue;
    out[k] = bag[k];
  }
  return out;
}

// Persist + (optionally) trigger a redraw after a config mutation, mirroring
// the per-control `do_redraw` flag the old dat.gui wrapper used.
export function commit(redraw = false): void {
  window._appstate?.save();
  if (redraw) {
    window.redraw_all();
  }
}

// Write a single scalar field straight into the canonical config object.
export function writeConfig(key: string, value: unknown): void {
  bag[key] = value;
}

// Re-read every scalar field from the canonical config into a fresh bag — used
// after a preset load or a Reset, both of which mutate config out-of-band.
export function resyncBag(target: ConfigBag): void {
  for (const k in bag) {
    if (CURVE_KEYS.includes(k)) continue;
    target[k] = bag[k];
  }
}

export { config, cconst };

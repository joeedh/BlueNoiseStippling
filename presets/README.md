# Built-in presets

Each `*.json` file here is a **built-in preset** that ships baked into the app
(alongside the computed `Default` preset). They appear in the preset dropdown
marked with a `★` and are read-only in the UI.

## How to add or update a built-in

1. Tune the settings (and curves) you want in the running app (`pnpm dev`).
2. In the preset bar, **Save As** a name, then **Export** — this downloads a
   `bn-preset-<name>.json` file in the preset format.
3. Move that file into this `presets/` directory (rename it to a tidy
   kebab-case filename, e.g. `my-preset.json`).
4. Run `pnpm presets:build` (also runs automatically before `pnpm build` /
   `pnpm dev`). This regenerates
   `scripts/svelte/builtin-presets.generated.ts`.
5. Commit both the new `presets/*.json` and the regenerated module.

## File format

The exported preset shape (see `Preset` in `scripts/svelte/presets.ts`):

```json
{
  "name": "Display Name",
  "version": 1,
  "appVersion": 0.6,
  "settings": { "DIMEN": 600, "…": "…" },
  "curves": {}
}
```

`settings` is a flat map of `config` scalars; `curves` may contain serialized
`SPH_CURVE` / `TONE_CURVE` / `DENSITY_CURVE` data (omit or leave `{}` to keep the
user's current curves). Order in the dropdown follows filename order, after
`Default`.

> Note: `Default` is **not** a file here — it is computed from `defaultConfig`
> in `presets.ts` so it never drifts from the app's current defaults.

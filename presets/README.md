# Built-in presets

Each `*.json` file here is a **built-in preset** that ships baked into the app.
They appear in the preset dropdown marked with a `★` and are read-only in the
UI. `default.json` is the `Default` preset (it mirrors `cconst.defaultConfig` +
the identity curves); `presets.ts` floats it to the front of the dropdown.

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
user's current curves). Order in the dropdown follows filename order, except
`Default` is always floated to the front.

> Note: `default.json` must stay in sync with `cconst.defaultConfig` in
> `scripts/const.ts`. If you change a default there, re-export the Default preset
> from the app (or edit `default.json` by hand) and rerun `pnpm presets:build`.

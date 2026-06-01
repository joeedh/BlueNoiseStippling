// Preset system: capture/restore the full runtime config (scalars + the three
// curves) as named, JSON-serializable presets. User presets live in
// localStorage; a few curated built-ins ship with the app. Presets can also be
// exported to / imported from .json files.

import cconst, { config, APP_VERSION } from "../const.js";
import type { Curve, CurveJSON } from "../curve.js";

const KEY = "bn6_presets";
const PRESET_VERSION = 1;

const CURVE_KEYS = ["SPH_CURVE", "TONE_CURVE", "DENSITY_CURVE"] as const;
type CurveKey = (typeof CURVE_KEYS)[number];

export interface Preset {
  name: string;
  version: number;
  appVersion: number;
  settings: Record<string, unknown>;
  curves: Partial<Record<CurveKey, CurveJSON>>;
}

export interface PresetEntry {
  name: string;
  builtin: boolean;
}

// ---- built-ins (settings-only; curves keep whatever the user has) ----
function withDefaults(overrides: Record<string, unknown>): Record<string, unknown> {
  return { ...cconst.defaultConfig, ...overrides };
}

const BUILTINS: Preset[] = [
  {
    name: "Default",
    version: PRESET_VERSION,
    appVersion: APP_VERSION,
    settings: withDefaults({}),
    curves: {},
  },
  {
    name: "Fine Stipple",
    version: PRESET_VERSION,
    appVersion: APP_VERSION,
    settings: withDefaults({
      DIMEN: 600,
      DRAW_RMUL: 0.8,
      SCALE_POINTS: true,
      HIST_EQUALIZE: true,
      TRI_MODE: false,
      DRAW_STICKS: false,
    }),
    curves: {},
  },
  {
    name: "Bold Sticks",
    version: PRESET_VERSION,
    appVersion: APP_VERSION,
    settings: withDefaults({
      DIMEN: 180,
      DRAW_STICKS: true,
      FANCY_STICKS: true,
      ANISOTROPY: true,
      STICK_LENGTH: 3.5,
      STICK_WIDTH: 2.5,
    }),
    curves: {},
  },
];

function builtinByName(name: string): Preset | undefined {
  return BUILTINS.find((b) => b.name === name);
}

// ---- localStorage user presets ----
function readAll(): Record<string, Preset> {
  try {
    return JSON.parse(localStorage[KEY] ?? "{}");
  } catch {
    return {};
  }
}

function writeAll(map: Record<string, Preset>): void {
  localStorage[KEY] = JSON.stringify(map);
}

export function listPresets(): PresetEntry[] {
  const builtins = BUILTINS.map((b) => ({ name: b.name, builtin: true }));
  const user = Object.keys(readAll()).map((name) => ({ name, builtin: false }));
  return [...builtins, ...user];
}

// ---- capture / apply ----
function captureCurves(): Partial<Record<CurveKey, CurveJSON>> {
  const out: Partial<Record<CurveKey, CurveJSON>> = {};
  for (const k of CURVE_KEYS) {
    const c = (config as unknown as Record<string, unknown>)[k] as
      | Curve
      | undefined;
    if (c && typeof c.toJSON === "function") {
      out[k] = c.toJSON();
    }
  }
  return out;
}

export function capturePreset(name: string): Preset {
  const settings: Record<string, unknown> = {};
  for (const k in cconst.defaultConfig) {
    if ((CURVE_KEYS as readonly string[]).includes(k)) continue;
    settings[k] = (config as unknown as Record<string, unknown>)[k];
  }
  return {
    name,
    version: PRESET_VERSION,
    appVersion: APP_VERSION,
    settings,
    curves: captureCurves(),
  };
}

export function savePreset(name: string): void {
  const map = readAll();
  map[name] = capturePreset(name);
  writeAll(map);
}

export function deletePreset(name: string): void {
  const map = readAll();
  delete map[name];
  writeAll(map);
}

export function renamePreset(oldName: string, newName: string): void {
  const map = readAll();
  if (!(oldName in map)) return;
  const p = map[oldName];
  p.name = newName;
  delete map[oldName];
  map[newName] = p;
  writeAll(map);
}

function getPreset(name: string): Preset | undefined {
  return readAll()[name] ?? builtinByName(name);
}

// Applies a preset into the live config. Returns true if any curve was loaded
// (so the caller can bump the curve-editor revision to re-sync).
export function applyPreset(name: string): boolean {
  const p = getPreset(name);
  if (!p) return false;

  cconst.loadJSON(p.settings);

  let touchedCurve = false;
  for (const k of CURVE_KEYS) {
    const json = p.curves[k];
    const c = (config as unknown as Record<string, unknown>)[k] as
      | Curve
      | undefined;
    if (json && c && typeof c.loadJSON === "function") {
      c.loadJSON(json);
      touchedCurve = true;
    }
  }

  return touchedCurve;
}

// ---- import / export ----
export function exportPreset(name: string): void {
  const p = getPreset(name);
  if (!p) return;

  const blob = new Blob([JSON.stringify(p, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bn-preset-${name.replace(/[^\w-]+/g, "_")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Parses + validates an imported preset file and saves it. Resolves with the
// saved preset name, or rejects with a message.
export function importPresetFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const p = JSON.parse(reader.result as string) as Preset;
        if (
          typeof p !== "object" ||
          p === null ||
          typeof p.settings !== "object"
        ) {
          reject("Not a valid preset file");
          return;
        }
        const name = typeof p.name === "string" && p.name ? p.name : file.name;
        const map = readAll();
        map[name] = {
          name,
          version: p.version ?? PRESET_VERSION,
          appVersion: p.appVersion ?? APP_VERSION,
          settings: p.settings,
          curves: p.curves ?? {},
        };
        writeAll(map);
        resolve(name);
      } catch (err) {
        reject("Failed to parse preset: " + (err as Error).message);
      }
    };
    reader.onerror = () => reject("Failed to read file");
    reader.readAsText(file);
  });
}

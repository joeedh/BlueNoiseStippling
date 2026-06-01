import { describe, it, expect } from "vitest";
import { GENERATED_BUILTINS } from "../scripts/svelte/builtin-presets.generated.js";
import {
  listPresets,
  applyPreset,
  capturePreset,
  savePreset,
} from "../scripts/svelte/presets.js";
import { config } from "../scripts/const.js";
import { Curve } from "../scripts/curve.js";

describe("generated built-in presets", () => {
  it("parse into valid preset shapes", () => {
    expect(Array.isArray(GENERATED_BUILTINS)).toBe(true);
    for (const p of GENERATED_BUILTINS) {
      expect(typeof p.name).toBe("string");
      expect(p.name.length).toBeGreaterThan(0);
      expect(typeof p.settings).toBe("object");
      expect(p.settings).not.toBeNull();
    }
  });

  it("each carry all three curves", () => {
    for (const p of GENERATED_BUILTINS) {
      expect(Object.keys(p.curves).sort()).toEqual([
        "DENSITY_CURVE",
        "SPH_CURVE",
        "TONE_CURVE",
      ]);
    }
  });

  it("are listed after the computed Default", () => {
    const names = listPresets().map((e) => e.name);
    expect(names[0]).toBe("Default");
    for (const p of GENERATED_BUILTINS) {
      expect(names).toContain(p.name);
    }
    // every built-in is flagged as such
    const builtinNames = listPresets()
      .filter((e) => e.builtin)
      .map((e) => e.name);
    expect(builtinNames).toContain("Default");
    for (const p of GENERATED_BUILTINS) {
      expect(builtinNames).toContain(p.name);
    }
  });

  it("apply their settings into the live config", () => {
    const fine = GENERATED_BUILTINS.find((p) => p.name === "Fine Stipple");
    if (fine) {
      applyPreset("Fine Stipple");
      expect(config.DIMEN).toBe(fine.settings.DIMEN);
    }
  });
});

describe("capturePreset (Save As / Export)", () => {
  it("captures the current live config values", () => {
    config.DIMEN = 321;
    config.DRAW_RMUL = 0.42;
    const p = capturePreset("snap");
    expect(p.name).toBe("snap");
    expect(p.settings.DIMEN).toBe(321);
    expect(p.settings.DRAW_RMUL).toBe(0.42);
  });

  it("round-trips an edited curve through save + apply", () => {
    // fresh curves on config
    config.SPH_CURVE = new Curve("SPH_CURVE");
    config.TONE_CURVE = new Curve("TONE_CURVE");
    config.DENSITY_CURVE = new Curve("DENSITY_CURVE");

    // edit TONE_CURVE's active (bspline) generator
    const bs = (
      config.TONE_CURVE as unknown as { generators: { active: unknown } }
    ).generators.active as {
      reset: () => void;
      add: (x: number, y: number) => unknown;
      update: () => void;
    };
    bs.reset();
    bs.add(0.3, 0.85);
    bs.update();
    const before = config.TONE_CURVE!.evaluate(0.3);

    savePreset("rt");

    // simulate reload: brand-new default curves
    config.TONE_CURVE = new Curve("TONE_CURVE");
    config.SPH_CURVE = new Curve("SPH_CURVE");
    config.DENSITY_CURVE = new Curve("DENSITY_CURVE");
    const fresh = config.TONE_CURVE.evaluate(0.3);

    const touched = applyPreset("rt");
    const after = config.TONE_CURVE.evaluate(0.3);

    expect(touched).toBe(true);
    expect(after).toBeCloseTo(before, 6);
    // sanity: the edit actually changed the curve vs a fresh default
    expect(Math.abs(before - fresh)).toBeGreaterThan(1e-6);
  });

  it("saves all three curves", () => {
    // makeGUI() (DOM-only) isn't run in unit tests, so assign curves directly.
    config.SPH_CURVE = new Curve("SPH_CURVE");
    config.TONE_CURVE = new Curve("TONE_CURVE");
    config.DENSITY_CURVE = new Curve("DENSITY_CURVE");

    const p = capturePreset("withcurves");
    expect(Object.keys(p.curves).sort()).toEqual([
      "DENSITY_CURVE",
      "SPH_CURVE",
      "TONE_CURVE",
    ]);
    // round-trips back through a Curve
    expect(p.curves.TONE_CURVE).toBeTruthy();
    expect(() =>
      new Curve("TONE_CURVE").loadJSON(p.curves.TONE_CURVE!),
    ).not.toThrow();
  });
});

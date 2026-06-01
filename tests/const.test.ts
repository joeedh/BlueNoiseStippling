import { describe, it, expect } from "vitest";
import cconst, { config, RASTER_MODES } from "../scripts/const.js";

describe("RASTER_MODES", () => {
  it("defines DIFFUSION, PATTERN and CMYK", () => {
    expect(RASTER_MODES.DIFFUSION).toBe(0);
    expect(RASTER_MODES.PATTERN).toBe(1);
    expect(RASTER_MODES.CMYK).toBe(2);
  });
});

describe("config defaults", () => {
  it("has the expected default keys", () => {
    expect(config).toHaveProperty("DIMEN");
    expect(config).toHaveProperty("RASTER_MODE");
    expect(config).toHaveProperty("PAL_COLORS");
    expect(config).toHaveProperty("COLOR_SPACE");
    expect(typeof config.DIMEN).toBe("number");
  });
});

describe("cconst.toJSON", () => {
  it("reflects the current config", () => {
    const json = cconst.toJSON();
    expect(json.DIMEN).toBe(config.DIMEN);
    expect(json.RASTER_MODE).toBe(config.RASTER_MODE);
  });

  it("reflects mutations to config", () => {
    const prev = config.DIMEN;
    try {
      config.DIMEN = prev + 123;
      const json = cconst.toJSON();
      expect(json.DIMEN).toBe(prev + 123);
    } finally {
      config.DIMEN = prev;
    }
  });
});

describe("cconst.loadJSON", () => {
  it("updates config from a partial json object", () => {
    const prevDimen = config.DIMEN;
    const prevSteps = config.STEPS;
    try {
      cconst.loadJSON({ DIMEN: 777, STEPS: 42 });
      expect(config.DIMEN).toBe(777);
      expect(config.STEPS).toBe(42);
    } finally {
      cconst.loadJSON({ DIMEN: prevDimen, STEPS: prevSteps });
    }
  });
});

describe("cconst.bez4", () => {
  it("returns endpoints at t=0 and t=1", () => {
    expect(cconst.bez4(0, 1, 2, 3, 0)).toBeCloseTo(0);
    expect(cconst.bez4(0, 1, 2, 3, 1)).toBeCloseTo(3);
  });

  it("is symmetric for a symmetric control polygon at t=0.5", () => {
    // linear-ish control points -> midpoint
    expect(cconst.bez4(0, 0, 1, 1, 0.5)).toBeCloseTo(0.5);
  });
});

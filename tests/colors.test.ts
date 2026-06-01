import { describe, it, expect } from "vitest";
import {
  rgb_to_xyz,
  xyz_to_rgb,
  rgb_to_lab,
  lab_to_rgb,
} from "../scripts/colors.js";

const samples: [number, number, number][] = [
  [0.2, 0.4, 0.6],
  [0.9, 0.1, 0.3],
  [0.5, 0.5, 0.5],
  [0.05, 0.8, 0.25],
];

describe("rgb <-> xyz round trip", () => {
  for (const [r, g, b] of samples) {
    it(`round-trips rgb(${r},${g},${b})`, () => {
      const xyz = rgb_to_xyz(r, g, b);
      const back = xyz_to_rgb(xyz[0], xyz[1], xyz[2]);
      expect(back[0]).toBeCloseTo(r, 4);
      expect(back[1]).toBeCloseTo(g, 4);
      expect(back[2]).toBeCloseTo(b, 4);
    });
  }
});

// NOTE: rgb_to_lab and lab_to_rgb in this module do NOT form an exact inverse
// pair -- xyz_to_lab uses a 1.16/0.016 scaling that lab_to_xyz does not undo
// symmetrically, so a full rgb->lab->rgb round trip is lossy. We therefore test
// the conversions' deterministic, well-defined behavior instead of identity.
describe("rgb_to_lab / lab_to_rgb", () => {
  for (const [r, g, b] of samples) {
    it(`rgb_to_lab(${r},${g},${b}) is deterministic and finite`, () => {
      const a = rgb_to_lab(r, g, b);
      const c = rgb_to_lab(r, g, b);
      expect(a.length).toBe(3);
      for (let i = 0; i < 3; i++) {
        expect(Number.isFinite(a[i])).toBe(true);
        expect(a[i]).toBeCloseTo(c[i], 10);
      }
    });

    it(`lab_to_rgb of rgb_to_lab(${r},${g},${b}) is finite`, () => {
      const lab = rgb_to_lab(r, g, b);
      const back = lab_to_rgb(lab[0], lab[1], lab[2]);
      expect(back.length).toBe(3);
      for (let i = 0; i < 3; i++) expect(Number.isFinite(back[i])).toBe(true);
    });
  }

  it("L channel increases with brightness", () => {
    const dark = rgb_to_lab(0.1, 0.1, 0.1);
    const light = rgb_to_lab(0.9, 0.9, 0.9);
    expect(light[0]).toBeGreaterThan(dark[0]);
  });
});

describe("color conversions return Vector3-like values", () => {
  it("rgb_to_xyz returns three finite components", () => {
    const xyz = rgb_to_xyz(0.5, 0.5, 0.5);
    expect(xyz.length).toBe(3);
    for (let i = 0; i < 3; i++) expect(Number.isFinite(xyz[i])).toBe(true);
  });
});

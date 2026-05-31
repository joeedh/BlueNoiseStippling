import { describe, it, expect } from "vitest";
import {
  winding,
  point_in_tri,
  normal_tri,
  line_isect,
  inrect_2d,
  point_in_aabb_2d,
  aabb_isect_2d,
  LINECROSS,
  COLINEAR,
} from "../scripts/math.js";

describe("winding", () => {
  it("returns true for counter-clockwise points", () => {
    // a=(0,0), b=(1,0), c=(0,1): cross = 1*1 - 0*0 = 1 > 0
    expect(winding([0, 0], [1, 0], [0, 1])).toBe(true);
  });

  it("returns false for clockwise points", () => {
    expect(winding([0, 0], [0, 1], [1, 0])).toBe(false);
  });
});

describe("point_in_tri", () => {
  const a = [0, 0];
  const b = [4, 0];
  const c = [0, 4];

  it("detects an interior point", () => {
    expect(point_in_tri([1, 1], a, b, c)).toBe(true);
  });

  it("rejects an exterior point", () => {
    expect(point_in_tri([5, 5], a, b, c)).toBe(false);
  });
});

describe("normal_tri", () => {
  it("computes the unit normal of a triangle in the xy-plane (+z)", () => {
    const n = normal_tri([0, 0, 0], [1, 0, 0], [0, 1, 0]);
    expect(n[0]).toBeCloseTo(0);
    expect(n[1]).toBeCloseTo(0);
    expect(n[2]).toBeCloseTo(1);
  });

  it("flips sign for opposite winding (-z)", () => {
    const n = normal_tri([0, 0, 0], [0, 1, 0], [1, 0, 0]);
    expect(n[2]).toBeCloseTo(-1);
  });
});

describe("line_isect", () => {
  it("finds the crossing of two diagonals at the origin", () => {
    // line1: (-1,-1)->(1,1), line2: (-1,1)->(1,-1) cross at (0,0)
    const [pt, type] = line_isect([-1, -1], [1, 1], [-1, 1], [1, -1]);
    expect(type).toBe(LINECROSS);
    expect(pt[0]).toBeCloseTo(0);
    expect(pt[1]).toBeCloseTo(0);
  });

  it("reports COLINEAR for parallel lines", () => {
    const [, type] = line_isect([0, 0], [1, 0], [0, 1], [1, 1]);
    expect(type).toBe(COLINEAR);
  });
});

describe("inrect_2d", () => {
  it("detects a point inside the rect", () => {
    expect(inrect_2d([5, 5], [0, 0], [10, 10])).toBe(true);
  });
  it("rejects a point outside the rect", () => {
    expect(inrect_2d([11, 5], [0, 0], [10, 10])).toBe(false);
  });
});

describe("point_in_aabb_2d", () => {
  it("checks membership against min/max bounds", () => {
    expect(point_in_aabb_2d([1, 1], [0, 0], [2, 2])).toBe(true);
    expect(point_in_aabb_2d([3, 1], [0, 0], [2, 2])).toBe(false);
  });
});

describe("aabb_isect_2d", () => {
  it("detects overlapping rectangles", () => {
    expect(aabb_isect_2d([0, 0], [4, 4], [2, 2], [4, 4])).toBe(true);
  });
  it("detects non-overlapping rectangles", () => {
    expect(aabb_isect_2d([0, 0], [1, 1], [5, 5], [1, 1])).toBe(false);
  });
});

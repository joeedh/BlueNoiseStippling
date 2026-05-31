import { describe, it, expect } from "vitest";
import { Vector2, Vector3, Vector4 } from "../scripts/vectormath.js";

describe("Vector2", () => {
  it("constructs from an array", () => {
    const v = new Vector2([3, 4]);
    expect(v[0]).toBe(3);
    expect(v[1]).toBe(4);
    // NOTE: the constructor assigns this[2]=0 after setting length=2, which
    // bumps the backing Array's length to 3. This is the real runtime behavior.
    expect(v.length).toBe(3);
    expect(v[2]).toBe(0);
  });

  it("add/sub mutate in place and return this", () => {
    const v = new Vector2([1, 2]);
    const r = v.add([10, 20]);
    expect(r).toBe(v);
    expect(v[0]).toBe(11);
    expect(v[1]).toBe(22);

    v.sub([1, 2]);
    expect(v[0]).toBe(10);
    expect(v[1]).toBe(20);
  });

  it("computes vectorLength of [3,4] as 5", () => {
    expect(new Vector2([3, 4]).vectorLength()).toBeCloseTo(5);
  });

  it("dot of orthogonal vectors is 0", () => {
    // Vector2.dot reads this[2]/b[2], so the argument must also be a Vector2
    // (which carries a zeroed third component).
    expect(new Vector2([1, 0]).dot(new Vector2([0, 1]))).toBeCloseTo(0);
  });

  it("dot of [3,4] with itself is 25", () => {
    const v = new Vector2([3, 4]);
    expect(v.dot(v)).toBeCloseTo(25);
  });

  it("normalize yields unit length", () => {
    const v = new Vector2([3, 4]).normalize();
    expect(v.vectorLength()).toBeCloseTo(1);
    expect(v[0]).toBeCloseTo(0.6);
    expect(v[1]).toBeCloseTo(0.8);
  });
});

describe("Vector3", () => {
  it("constructs from an array", () => {
    const v = new Vector3([1, 2, 3]);
    expect([v[0], v[1], v[2]]).toEqual([1, 2, 3]);
    expect(v.length).toBe(3);
  });

  it("dot of [1,2,3] and [4,5,6] = 32", () => {
    expect(new Vector3([1, 2, 3]).dot([4, 5, 6])).toBeCloseTo(32);
  });

  it("dot of orthogonal vectors is 0", () => {
    expect(new Vector3([1, 0, 0]).dot([0, 1, 0])).toBeCloseTo(0);
  });

  it("cross of x cross y = z (mutates in place)", () => {
    const v = new Vector3([1, 0, 0]);
    const r = v.cross([0, 1, 0]);
    expect(r).toBe(v);
    expect(v[0]).toBeCloseTo(0);
    expect(v[1]).toBeCloseTo(0);
    expect(v[2]).toBeCloseTo(1);
  });

  it("mul multiplies component-wise", () => {
    const v = new Vector3([2, 3, 4]).mul([5, 6, 7]);
    expect([v[0], v[1], v[2]]).toEqual([10, 18, 28]);
  });

  it("interp moves halfway toward target", () => {
    const v = new Vector3([0, 0, 0]).interp([10, 20, 30], 0.5);
    expect(v[0]).toBeCloseTo(5);
    expect(v[1]).toBeCloseTo(10);
    expect(v[2]).toBeCloseTo(15);
  });

  it("vectorLength of [3,4,0] is 5", () => {
    expect(new Vector3([3, 4, 0]).vectorLength()).toBeCloseTo(5);
  });

  it("normalize yields unit length", () => {
    const v = new Vector3([0, 3, 4]).normalize();
    expect(v.vectorLength()).toBeCloseTo(1);
  });

  it("dot snaps to 1 for normalized parallel vectors", () => {
    const v = new Vector3([1, 1, 1]).normalize();
    expect(v.dot(v)).toBeCloseTo(1);
  });
});

describe("Vector4", () => {
  it("constructs from an array of 4", () => {
    const v = new Vector4([1, 2, 3, 4]);
    expect([v[0], v[1], v[2], v[3]]).toEqual([1, 2, 3, 4]);
    expect(v.length).toBe(4);
  });

  it("dot uses all four components", () => {
    expect(new Vector4([1, 2, 3, 4]).dot([1, 1, 1, 1])).toBeCloseTo(10);
  });

  it("add mutates in place", () => {
    const v = new Vector4([1, 1, 1, 1]).add([1, 2, 3, 4]);
    expect([v[0], v[1], v[2], v[3]]).toEqual([2, 3, 4, 5]);
  });
});

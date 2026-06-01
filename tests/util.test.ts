import { describe, it, expect } from "vitest";
import "../scripts/polyfill.js";
import { cachering, set, IDGen, MersenneRandom } from "../scripts/util.js";

describe("cachering", () => {
  it("constructs `size` items via the factory function", () => {
    let n = 0;
    const ring = new cachering(() => n++, 3);
    expect(ring.length).toBe(3);
    expect([ring[0], ring[1], ring[2]]).toEqual([0, 1, 2]);
  });

  it("next() cycles through items and wraps", () => {
    const ring = new cachering(() => ({}), 3);
    const a = ring.next();
    const b = ring.next();
    const c = ring.next();
    const d = ring.next();
    expect(a).not.toBe(b);
    expect(b).not.toBe(c);
    // wraps back around to the first item
    expect(d).toBe(a);
  });

  it("fromConstructor builds instances of a class", () => {
    class Foo {}
    const ring = cachering.fromConstructor(Foo, 2);
    expect(ring.length).toBe(2);
    expect(ring.next()).toBeInstanceOf(Foo);
  });
});

// Keyable objects need a Symbol.keystr method (installed by polyfill).
function keyed(id: string) {
  return { [Symbol.keystr]: () => id };
}

describe("set", () => {
  it("add/has/remove via Symbol.keystr keying", () => {
    const s = new set();
    const a = keyed("a");
    const b = keyed("b");

    expect(s.has(a)).toBe(false);

    s.add(a);
    expect(s.has(a)).toBe(true);
    expect(s.length).toBe(1);

    // duplicate key is ignored
    s.add(keyed("a"));
    expect(s.length).toBe(1);

    s.add(b);
    expect(s.length).toBe(2);

    s.remove(a);
    expect(s.has(a)).toBe(false);
    expect(s.has(b)).toBe(true);
    expect(s.length).toBe(1);
  });

  it("iterates over its members", () => {
    const s = new set();
    s.add(keyed("x"));
    s.add(keyed("y"));
    const seen = [...s].map((o: any) => o[Symbol.keystr]());
    expect(seen.sort()).toEqual(["x", "y"]);
  });
});

describe("IDGen", () => {
  it("next() increments starting from 1", () => {
    const gen = new IDGen();
    expect(gen.next()).toBe(1);
    expect(gen.next()).toBe(2);
    expect(gen.next()).toBe(3);
  });

  it("max_cur bumps the counter forward", () => {
    const gen = new IDGen();
    gen.max_cur(10);
    expect(gen.next()).toBe(11);
  });

  it("round-trips through toJSON/fromJSON", () => {
    const gen = new IDGen();
    gen.next();
    gen.next();
    const restored = IDGen.fromJSON(gen.toJSON());
    expect(restored.next()).toBe(gen.next());
  });
});

describe("MersenneRandom", () => {
  it("is deterministic: same seed -> same sequence", () => {
    const a = new MersenneRandom(12345);
    const b = new MersenneRandom(12345);
    for (let i = 0; i < 20; i++) {
      expect(a.extract_number()).toBe(b.extract_number());
    }
  });

  it("different seeds produce different sequences", () => {
    const a = new MersenneRandom(1);
    const b = new MersenneRandom(2);
    const seqA = Array.from({ length: 10 }, () => a.extract_number());
    const seqB = Array.from({ length: 10 }, () => b.extract_number());
    expect(seqA).not.toEqual(seqB);
  });

  it("random() returns values in [0, 1)", () => {
    const r = new MersenneRandom(7);
    for (let i = 0; i < 50; i++) {
      const v = r.random();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("re-seeding restores the sequence", () => {
    const r = new MersenneRandom(99);
    const first = [r.extract_number(), r.extract_number(), r.extract_number()];
    r.seed(99);
    const second = [r.extract_number(), r.extract_number(), r.extract_number()];
    expect(second).toEqual(first);
  });
});

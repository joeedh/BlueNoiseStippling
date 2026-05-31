import { describe, it, expect } from "vitest";
import { KDTree } from "../scripts/kdtree2.js";

function collect(tree: KDTree, x: number, y: number, r: number): number[] {
  const ids: number[] = [];
  tree.forEachPoint(x, y, r, (id: number) => {
    ids.push(id);
  });
  return ids;
}

describe("KDTree (kdtree2)", () => {
  it("tracks total inserted points", () => {
    const tree = new KDTree([0, 0, 0], [100, 100, 100]);
    tree.insert(10, 10, 0, 1);
    tree.insert(50, 50, 0, 2);
    tree.insert(90, 90, 0, 3);
    expect(tree.totpoint).toBe(3);
  });

  it("radius query returns only points within range", () => {
    const tree = new KDTree([0, 0, 0], [100, 100, 100]);
    tree.insert(10, 10, 0, 1);
    tree.insert(12, 11, 0, 2);
    tree.insert(90, 90, 0, 3);

    // small radius around (10,10) should find the two nearby ids, not the far one
    const near = collect(tree, 10, 10, 5);
    expect(near.sort()).toEqual([1, 2]);
    expect(near).not.toContain(3);
  });

  it("query far from all points returns nothing", () => {
    const tree = new KDTree([0, 0, 0], [100, 100, 100]);
    tree.insert(10, 10, 0, 1);
    tree.insert(20, 20, 0, 2);

    expect(collect(tree, 80, 80, 3)).toEqual([]);
  });

  it("a large radius finds every point", () => {
    const tree = new KDTree([0, 0, 0], [100, 100, 100]);
    const n = 40; // exceeds MAXPOINTS so the tree splits internally
    for (let i = 0; i < n; i++) {
      tree.insert((i * 2) % 100, (i * 3) % 100, 0, i + 1);
    }
    const found = collect(tree, 50, 50, 1000);
    expect(found.length).toBe(n);
  });

  it("iterAllPoints visits every inserted point", () => {
    const tree = new KDTree([0, 0, 0], [100, 100, 100]);
    tree.insert(1, 1, 0, 11);
    tree.insert(2, 2, 0, 22);
    tree.insert(3, 3, 0, 33);

    const ids: number[] = [];
    tree.iterAllPoints((p) => {
      ids.push(p.id as number);
    });
    expect(ids.sort((a, b) => a - b)).toEqual([11, 22, 33]);
  });
});

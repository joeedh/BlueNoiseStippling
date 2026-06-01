<script lang="ts">
  import {
    Curve,
    BSplineCurve,
    CustomCurve,
    GuassianCurve,
    CurveTypes,
    CurveFlags,
  } from "../curve.js";
  import Slider from "./Slider.svelte";
  import Select from "./Select.svelte";
  import { tooltip } from "./tooltip";

  let {
    curve,
    tip,
    onsave,
    rev = 0,
  }: {
    curve: Curve;
    tip: string;
    onsave: () => void;
    // bumped by the parent when the curve is replaced out-of-band (preset load)
    rev?: number;
  } = $props();

  const SIZE = 200;
  const PAN: [number, number] = [0.1, -1.1];
  const drawScale = () => Math.min(SIZE, SIZE) * 0.8;

  let canvasEl: HTMLCanvasElement | undefined = $state();
  let genType = $state(CurveTypes.BSPLINE);

  // local mirrors of the simple generators' params (those classes aren't reactive)
  let eq = $state("x");
  let gh = $state(1.0);
  let go = $state(1.0);
  let gd = $state(0.3);

  // generator-type dropdown options, mirroring the old "Type" listenum
  const typeOptions: Record<string, number> = (() => {
    const out: Record<string, number> = {};
    const map = CurveTypes as Record<string, number>;
    for (const k in map) {
      let label = k[0].toUpperCase() + k.slice(1).toLowerCase();
      out[label.replace(/_/g, " ")] = map[k];
    }
    return out;
  })();

  function syncFromCurve() {
    const active = curve.generators.active;
    genType = active.type;
    if (active instanceof CustomCurve) eq = active.equation;
    if (active instanceof GuassianCurve) {
      gh = active.height;
      go = active.offset;
      gd = active.deviation;
    }
  }

  // ---- rendering (ports Curve.draw + BSplineCurve.draw) ----
  function draw() {
    const cv = canvasEl;
    if (!cv) return;
    const g = cv.getContext("2d");
    if (!g) return;

    g.clearRect(0, 0, cv.width, cv.height);
    g.fillStyle = "#11141a";
    g.fillRect(0, 0, cv.width, cv.height);

    g.save();
    const sz = drawScale();
    g.lineWidth = 1 / sz;
    g.scale(sz, -sz);
    g.translate(PAN[0], PAN[1]);

    // unit bounds
    g.strokeStyle = "rgba(124,135,148,0.35)";
    g.lineWidth = 1 / sz;
    g.beginPath();
    g.rect(0, 0, 1, 1);
    g.stroke();

    // axes
    g.beginPath();
    g.moveTo(-1, 0);
    g.lineTo(1, 0);
    g.strokeStyle = "rgba(232,115,106,0.45)";
    g.stroke();
    g.beginPath();
    g.moveTo(0, -1);
    g.lineTo(0, 1);
    g.strokeStyle = "rgba(84,224,199,0.45)";
    g.stroke();

    const active = curve.generators.active;
    const steps = 64;
    const df = 1 / (steps - 1);

    // the curve itself
    g.beginPath();
    let f = 0;
    for (let i = 0; i < steps; i++, f += df) {
      const val = active.evaluate(f);
      if (i === 0) g.moveTo(f, val);
      else g.lineTo(f, val);
    }
    g.strokeStyle = "#cdd6e0";
    g.lineWidth = 2 / sz;
    g.stroke();

    // optional overlay (e.g. comparison curve)
    if (curve.overlay_curvefunc !== undefined) {
      g.beginPath();
      f = 0;
      for (let i = 0; i < steps; i++, f += df) {
        const val = curve.overlay_curvefunc(f);
        if (i === 0) g.moveTo(f, val);
        else g.lineTo(f, val);
      }
      g.strokeStyle = "rgba(84,224,199,0.7)";
      g.stroke();
    }

    // control points (bspline only)
    if (active instanceof BSplineCurve) {
      const wsz = 0.03;
      for (const p of active.points) {
        g.beginPath();
        if (p === active.points.highlight) g.fillStyle = "#54e0c7";
        else if (p.flag & CurveFlags.SELECT) g.fillStyle = "#e8736a";
        else g.fillStyle = "#e8b15a";
        g.rect(p.sco[0] - wsz / 2, p.sco[1] - wsz / 2, wsz, wsz);
        g.fill();
      }
    }

    g.restore();
  }

  // ---- bspline pointer interaction (ports transform_mpos/do_*) ----
  let transforming = false;
  let startMpos: [number, number] = [0, 0];
  let transPoints: import("../curve.js").CurvePoint[] = [];

  function bspline(): BSplineCurve | null {
    const a = curve.generators.active;
    return a instanceof BSplineCurve ? a : null;
  }

  function toCurveSpace(clientX: number, clientY: number): [number, number] {
    const r = canvasEl!.getBoundingClientRect();
    const sz = drawScale();
    const x = (clientX - r.left) / sz - PAN[0];
    const y = -(clientY - r.top) / sz - PAN[1];
    return [x, y];
  }

  function doHighlight(bs: BSplineCurve, x: number, y: number) {
    const sz = drawScale();
    const limit = 19 / sz;
    const limitSqr = limit * limit;
    let mindis = 1e17;
    let minp = undefined as (typeof bs.points)[number] | undefined;

    for (const p of bs.points) {
      const dx = x - p.sco[0];
      const dy = y - p.sco[1];
      const dis = dx * dx + dy * dy;
      if (dis < mindis && dis < limitSqr) {
        mindis = dis;
        minp = p;
      }
    }

    if (bs.points.highlight !== minp) {
      bs.points.highlight = minp;
      draw();
    }
  }

  function onPointerDown(e: PointerEvent) {
    const bs = bspline();
    if (!bs) return;

    canvasEl!.setPointerCapture(e.pointerId);
    curve.fastmode = true;

    const [x, y] = toCurveSpace(e.clientX, e.clientY);
    startMpos = [x, y];
    doHighlight(bs, x, y);

    if (bs.points.highlight !== undefined) {
      if (!e.shiftKey) {
        for (const p of bs.points) p.flag &= ~CurveFlags.SELECT;
        bs.points.highlight.flag |= CurveFlags.SELECT;
      } else {
        bs.points.highlight.flag ^= CurveFlags.SELECT;
      }

      transforming = true;
      transPoints = [];
      for (const p of bs.points) {
        if (p.flag & CurveFlags.SELECT) {
          transPoints.push(p);
          p.startco.load(p);
        }
      }
      draw();
    } else {
      const p = bs.add(x, y);
      bs.points.highlight = p;
      bs.update();
      p.flag |= CurveFlags.SELECT;

      transforming = true;
      transPoints = [p];
      p.startco.load(p);
      draw();
    }
  }

  function onPointerMove(e: PointerEvent) {
    const bs = bspline();
    if (!bs) return;

    const [x, y] = toCurveSpace(e.clientX, e.clientY);

    if (transforming) {
      const ox = x - startMpos[0];
      const oy = y - startMpos[1];
      bs.points.recalc = 1;
      for (const p of transPoints) {
        p[0] = Math.min(Math.max(p.startco[0] + ox, 0), 1);
        p[1] = Math.min(Math.max(p.startco[1] + oy, 0), 1);
      }
      bs.update();
      draw();
      curve.doSave();
    } else {
      doHighlight(bs, x, y);
    }
  }

  function onPointerUp() {
    const bs = bspline();
    if (!bs) return;
    transforming = false;
    curve.fastmode = false;
    bs.update();
    draw();
    curve.doSave();
  }

  function onKeyDown(e: KeyboardEvent) {
    const bs = bspline();
    if (!bs) return;
    // Delete / X removes the highlighted point
    if (e.key === "Delete" || e.key === "x" || e.key === "X") {
      if (bs.points.highlight !== undefined) {
        bs.remove(bs.points.highlight);
        bs.points.highlight = undefined;
        bs.update();
        draw();
        curve.doSave();
      }
    }
  }

  function deleteSelected() {
    const bs = bspline();
    if (!bs) return;
    if (bs.removeSelected()) {
      bs.points.highlight = undefined;
      draw();
      curve.doSave();
    }
  }

  // ---- sub-control handlers ----
  function changeType(v: number | string) {
    curve.switchGenerator(v as number);
    syncFromCurve();
    curve.update();
    draw();
    curve.doSave();
  }

  function changeEq(v: string) {
    eq = v;
    const a = curve.generators.active;
    if (a instanceof CustomCurve) a.equation = v;
    curve.update();
    draw();
    curve.doSave();
  }

  function changeGauss(field: "height" | "offset" | "deviation", v: number) {
    const a = curve.generators.active;
    if (!(a instanceof GuassianCurve)) return;
    a[field] = v;
    if (field === "height") gh = v;
    if (field === "offset") go = v;
    if (field === "deviation") gd = v;
    curve.update();
    draw();
    curve.doSave();
  }

  // wire redraw hook + initial draw; re-sync when the parent swaps the curve
  $effect(() => {
    // establish dependency on rev so external curve loads re-sync + redraw
    void rev;
    curve.setRedrawHook(draw);
    syncFromCurve();
    draw();
  });
</script>

<div class="bn-curve">
  <Select
    label="Type"
    tip="Curve generator: an editable B-spline, a math expression, or a parametric gaussian."
    value={genType}
    options={typeOptions}
    onchange={changeType}
  />

  {#if genType === CurveTypes.BSPLINE}
    <canvas
      bind:this={canvasEl}
      class="bn-curve__canvas"
      width={SIZE}
      height={SIZE}
      tabindex="0"
      aria-label="Editable curve. Click to add a point, drag to move, Delete to remove."
      onpointerdown={onPointerDown}
      onpointermove={onPointerMove}
      onpointerup={onPointerUp}
      onpointercancel={onPointerUp}
      onkeydown={onKeyDown}
      use:tooltip={tip + " — click empty space to add a point, drag points to shape, Delete to remove."}
    ></canvas>
    <div class="bn-curve__tools">
      <button
        type="button"
        class="bn-curve__del"
        use:tooltip={"Delete the selected control point(s)."}
        onclick={deleteSelected}>Delete Point</button
      >
    </div>
  {:else}
    <canvas
      bind:this={canvasEl}
      class="bn-curve__canvas"
      width={SIZE}
      height={SIZE}
      aria-label="Curve preview"
      use:tooltip={tip}
    ></canvas>
  {/if}

  {#if genType === CurveTypes.CUSTOM}
    <div class="bn-row">
      <label class="bn-row__label" use:tooltip={"f(x) expression, e.g. sin(x), x*x, pow(x,2). Math fns are in scope."}
        >Equation</label
      >
      <input
        class="bn-curve__eq"
        type="text"
        value={eq}
        onchange={(e) => changeEq((e.target as HTMLInputElement).value)}
        aria-label="Curve equation"
      />
    </div>
  {/if}

  {#if genType === CurveTypes.GUASSIAN}
    <Slider
      label="Height"
      tip="Peak amplitude of the gaussian."
      value={gh}
      min={-10}
      max={10}
      step={0.0001}
      onchange={(v) => changeGauss("height", v)}
    />
    <Slider
      label="Offset"
      tip="Position of the gaussian's center along X."
      value={go}
      min={-2.5}
      max={2.5}
      step={0.0001}
      onchange={(v) => changeGauss("offset", v)}
    />
    <Slider
      label="Std Deviation"
      tip="Width of the gaussian bell."
      value={gd}
      min={0.0001}
      max={1.25}
      step={0.0001}
      onchange={(v) => changeGauss("deviation", v)}
    />
  {/if}
</div>

<style>
  .bn-curve {
    padding: 4px 16px 8px;
  }
  .bn-curve__canvas {
    width: 200px;
    height: 200px;
    display: block;
    margin: 6px auto;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: #11141a;
    touch-action: none;
    cursor: crosshair;
  }
  .bn-curve__canvas:focus-visible {
    outline: 1px solid var(--accent);
  }
  .bn-curve__tools {
    display: flex;
    justify-content: center;
  }
  .bn-curve__del {
    font-family: var(--font-ui);
    font-size: 11px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--text-dim);
    background: var(--surface-2);
    border: 1px solid var(--line);
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
  }
  .bn-curve__del:hover {
    color: var(--danger);
    border-color: var(--danger);
  }
  .bn-curve__eq {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--accent);
    background: var(--surface-3);
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 4px 8px;
    width: 130px;
  }
</style>

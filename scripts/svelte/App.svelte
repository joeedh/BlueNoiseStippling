<script lang="ts">
  import "./theme.css";
  import type { Curve } from "../curve.js";
  import { SCHEMA } from "./schema.js";
  import {
    snapshotConfig,
    writeConfig,
    commit,
    resyncBag,
  } from "./config-store.js";
  import type { ConfigBag } from "./config-store.js";
  import { applyPreset } from "./presets.js";

  import Panel from "./Panel.svelte";
  import Slider from "./Slider.svelte";
  import Toggle from "./Toggle.svelte";
  import Select from "./Select.svelte";
  import Button from "./Button.svelte";
  import CurveEditor from "./CurveEditor.svelte";
  import PresetBar from "./PresetBar.svelte";
  import { tooltip } from "./tooltip";

  // The host AppState exposes the action methods used by the toolbar.
  interface Host {
    actionRun(): void;
    actionRelax(): void;
    actionReset(): void;
    actionClearData(): void;
    actionSaveImage(): void;
    actionSaveSVG(): void;
    loadImageDialog(): void;
    loadMaskDialog(): void;
    loadMaskByName(name: string): void;
    startRelaxLoop(): void;
    stopRelaxLoop(): void;
  }

  let {
    host,
    curves,
  }: {
    host: Host;
    curves: Record<string, Curve>;
  } = $props();

  // Reactive mirror of the scalar config. The canonical `config` object (which
  // the solver reads by reference) is written in lockstep via writeConfig().
  let cfg = $state<ConfigBag>(snapshotConfig());

  // Bumped when a preset replaces curve contents so CurveEditors re-sync.
  let curveRev = $state(0);

  let loopRunning = $state(false);

  function update(key: string, value: unknown, redraw: boolean) {
    cfg[key] = value;
    writeConfig(key, value);
    commit(redraw);
  }

  function onApplyPreset(name: string) {
    const touchedCurve = applyPreset(name);
    resyncBag(cfg);
    if (touchedCurve) curveRev++;
    window.redraw_all();
  }

  function reset() {
    host.actionReset();
    resyncBag(cfg); // reset() mutates config (e.g. USE_LAB) out-of-band
  }

  function toggleLoop() {
    if (loopRunning) {
      host.stopRelaxLoop();
      loopRunning = false;
    } else {
      host.startRelaxLoop();
      loopRunning = true;
    }
  }

  // built-in blue-noise mask picker (not a config field)
  const MASKS: Record<string, string> = {
    "Built In Smooth": "built-in-smooth",
    "Built In": "built-in",
    "Large 2": "mask_large_2.png",
    "Large 2 (smoothed)": "mask_large_2_smoothed.png",
    "Large 1 (16 levels)": "mask_large.png",
    "Small 1 (16 levels)": "mask.png",
    "Weighted Sample Removal": "weighted_sample_removal_mask_1.png",
  };
  let maskChoice = $state("built-in-smooth");

  // --- mobile drawer ---
  // On narrow/portrait screens the rail is a slide-in drawer (hidden by
  // default so the canvas gets the full screen); on desktop it's always shown.
  // It only closes on the ✕ toggle or a backdrop tap — never automatically.
  let panelOpen = $state(false);
</script>

<!-- Translucent Run button overlaid on the canvas, always accessible. -->
<button
  class="bn-run-overlay"
  use:tooltip={"Add another batch of points (Points / Step) and redraw."}
  onclick={() => host.actionRun()}
>
  ▶ Run
</button>

<!-- Floating toggle (only shown on small screens via CSS) -->
<button
  class="bn-fab"
  aria-label={panelOpen ? "Hide controls" : "Show controls"}
  aria-expanded={panelOpen}
  onclick={() => (panelOpen = !panelOpen)}
>
  {panelOpen ? "✕" : "☰"}
</button>

<!-- Tap-to-close backdrop (mobile only) -->
<div
  class="bn-backdrop"
  class:show={panelOpen}
  aria-hidden="true"
  onclick={() => (panelOpen = false)}
></div>

<div class="bn-rail" class:open={panelOpen}>
  <header class="bn-rail__head">
    <h1 class="bn-rail__title">Blue<span>·</span>Noise</h1>
    <p class="bn-rail__sub">Stippling Studio</p>
  </header>

  <PresetBar onapply={onApplyPreset} />

  <div class="bn-rail__body">
    <!-- Actions toolbar (Run lives as a translucent overlay on the canvas) -->
    <div class="bn-actions">
      <Button
        label="Relax"
        tip="Run one blue-noise relaxation pass to even out point spacing."
        onclick={() => host.actionRelax()}
      />
      <Button
        label={loopRunning ? "Stop Loop" : "Start Loop"}
        tip="Continuously relax the point field until stopped."
        active={loopRunning}
        onclick={toggleLoop}
      />
      <Button
        label="Reset"
        tip="Reinitialize the algorithm with the current settings (needed after changing Density)."
        onclick={reset}
      />
      <Button
        label="Load Image"
        tip="Choose a raster image to stipple."
        onclick={() => host.loadImageDialog()}
      />
      <Button
        label="Load Mask"
        tip="Load a custom blue-noise mask file."
        onclick={() => host.loadMaskDialog()}
      />
      <Button
        label="Save Image"
        tip="Render the stipple result to a PNG at the Export Size and open it."
        onclick={() => host.actionSaveImage()}
      />
      <Button
        label="Save SVG"
        tip="Export the stipple result as a vector SVG file."
        onclick={() => host.actionSaveSVG()}
      />
      <Button
        label="Clear Data"
        tip="Erase all saved settings, cached image, and presets state from this browser."
        variant="danger"
        onclick={() => host.actionClearData()}
      />
    </div>

    <!-- Schema-driven panels -->
    {#each SCHEMA as section}
      <Panel title={section.title} tip={section.tooltip} open={section.open}>
        {#each section.fields as field (field.key)}
          {#if field.kind === "slider"}
            <Slider
              label={field.label}
              tip={field.tooltip}
              value={cfg[field.key] as number}
              min={field.min}
              max={field.max}
              step={field.step}
              int={field.int ?? false}
              onchange={(v) => update(field.key, v, field.redraw ?? false)}
            />
          {:else if field.kind === "toggle"}
            <Toggle
              label={field.label}
              tip={field.tooltip}
              value={cfg[field.key] as boolean}
              onchange={(v) => update(field.key, v, true)}
            />
          {:else if field.kind === "select"}
            <Select
              label={field.label}
              tip={field.tooltip}
              value={cfg[field.key] as number | string}
              options={field.options}
              onchange={(v) => update(field.key, v, true)}
            />
          {:else if field.kind === "curve"}
            {#if curves[field.key]}
              <CurveEditor
                curve={curves[field.key]}
                tip={field.tooltip}
                rev={curveRev}
                onsave={() => commit(false)}
              />
            {/if}
          {/if}
        {/each}
      </Panel>
    {/each}

    <!-- Built-in mask picker -->
    <Panel title="Blue Noise Mask" tip="Swap the built-in blue-noise dither mask.">
      <Select
        label="Mask"
        tip="Choose which bundled blue-noise mask to use for dithering."
        value={maskChoice}
        options={MASKS}
        onchange={(v) => (maskChoice = v as string)}
      />
      <div class="bn-actions">
        <Button
          label="Load Mask"
          tip="Load the selected built-in mask."
          onclick={() => host.loadMaskByName(maskChoice)}
        />
      </div>
    </Panel>
  </div>
</div>

<style>
  .bn-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    padding: 10px 16px;
  }
</style>

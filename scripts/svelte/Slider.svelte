<script lang="ts">
  import { tooltip } from "./tooltip";

  let {
    label,
    tip,
    value,
    min,
    max,
    step,
    int = false,
    onchange,
  }: {
    label: string;
    tip: string;
    value: number;
    min: number;
    max: number;
    step: number;
    int?: boolean;
    onchange: (v: number) => void;
  } = $props();

  function handle(e: Event) {
    let v = parseFloat((e.target as HTMLInputElement).value);
    if (Number.isNaN(v)) return;
    if (int) v = Math.round(v);
    onchange(v);
  }

  let display = $derived(
    int
      ? String(Math.round(value))
      : Math.abs(value) >= 100
        ? value.toFixed(1)
        : value.toFixed(3),
  );
</script>

<div class="bn-row bn-slider">
  <label class="bn-row__label" use:tooltip={tip}>
    {label}
    <span class="bn-info" aria-hidden="true">i</span>
  </label>
  <span class="bn-num">{display}</span>
  <input
    class="bn-slider__input"
    type="range"
    {min}
    {max}
    {step}
    {value}
    oninput={handle}
    aria-label={label}
  />
</div>

<style>
  .bn-slider {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "label value"
      "input input";
    row-gap: 4px;
  }
  .bn-row__label {
    grid-area: label;
  }
  .bn-num {
    grid-area: value;
  }
  .bn-slider__input {
    grid-area: input;
    width: 100%;
    appearance: none;
    height: 3px;
    border-radius: 2px;
    background: var(--surface-3);
    outline: none;
    cursor: pointer;
  }
  .bn-slider__input::-webkit-slider-thumb {
    appearance: none;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
    cursor: grab;
  }
  .bn-slider__input::-moz-range-thumb {
    width: 13px;
    height: 13px;
    border: none;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
    cursor: grab;
  }
  .bn-slider__input:active::-webkit-slider-thumb {
    cursor: grabbing;
  }
</style>

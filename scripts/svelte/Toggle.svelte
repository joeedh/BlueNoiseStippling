<script lang="ts">
  import { tooltip } from "./tooltip";

  let {
    label,
    tip,
    value,
    onchange,
  }: {
    label: string;
    tip: string;
    value: boolean;
    onchange: (v: boolean) => void;
  } = $props();
</script>

<div class="bn-row">
  <label class="bn-row__label" use:tooltip={tip}>
    {label}
    <span class="bn-info" aria-hidden="true">i</span>
  </label>
  <button
    type="button"
    role="switch"
    aria-checked={value}
    aria-label={label}
    class="bn-toggle"
    class:on={value}
    onclick={() => onchange(!value)}
  >
    <span class="bn-toggle__knob"></span>
  </button>
</div>

<style>
  .bn-toggle {
    position: relative;
    width: 34px;
    height: 18px;
    border-radius: 10px;
    border: 1px solid var(--line);
    background: var(--surface-3);
    cursor: pointer;
    padding: 0;
    transition:
      background 0.16s ease,
      border-color 0.16s ease;
  }
  .bn-toggle.on {
    background: var(--accent-dim);
    border-color: var(--accent);
  }
  .bn-toggle__knob {
    position: absolute;
    top: 1px;
    left: 1px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--text-dim);
    transition:
      transform 0.16s ease,
      background 0.16s ease;
  }
  .bn-toggle.on .bn-toggle__knob {
    transform: translateX(16px);
    background: var(--accent);
    box-shadow: 0 0 6px var(--accent-glow);
  }
  .bn-toggle:focus-visible {
    outline: 1px solid var(--accent);
    outline-offset: 2px;
  }
</style>

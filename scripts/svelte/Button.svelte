<script lang="ts">
  import { tooltip } from "./tooltip";
  import { tipWithHotkey } from "./media.svelte";

  let {
    label,
    tip,
    onclick,
    variant = "default",
    active = false,
    hotkey,
  }: {
    label: string;
    tip: string;
    onclick: () => void;
    variant?: "default" | "accent" | "danger";
    active?: boolean;
    hotkey?: string;
  } = $props();

  let fullTip = $derived(tipWithHotkey(tip, hotkey));
</script>

<button
  type="button"
  class="bn-btn {variant}"
  class:active
  use:tooltip={fullTip}
  {onclick}
>
  {label}
</button>

<style>
  .bn-btn {
    font-family: var(--font-ui);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--text-dim);
    background: var(--surface-2);
    border: 1px solid var(--line);
    border-radius: 5px;
    padding: 7px 10px;
    cursor: pointer;
    transition:
      color 0.14s ease,
      border-color 0.14s ease,
      background 0.14s ease;
  }
  .bn-btn:hover {
    color: var(--text);
    border-color: var(--text-faint);
    background: var(--surface-3);
  }
  .bn-btn:focus-visible {
    outline: 1px solid var(--accent);
    outline-offset: 1px;
  }
  .bn-btn.accent {
    color: var(--bg);
    background: var(--accent);
    border-color: var(--accent);
  }
  .bn-btn.accent:hover {
    background: #6cf0d8;
  }
  .bn-btn.danger:hover {
    color: var(--danger);
    border-color: var(--danger);
  }
  .bn-btn.active {
    color: var(--warn);
    border-color: var(--warn);
  }
</style>

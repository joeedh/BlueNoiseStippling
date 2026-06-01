<script lang="ts">
  import type { Snippet } from "svelte";
  import { tooltip } from "./tooltip";

  let {
    title,
    tip,
    open = false,
    children,
  }: {
    title: string;
    tip: string;
    open?: boolean;
    children: Snippet;
  } = $props();

  const storeKey = "bn6_panel_" + title;

  // Per-panel open/closed state persists across reloads (replaces dat.gui's
  // visibility persistence).
  function initialOpen(): boolean {
    const saved = localStorage.getItem(storeKey);
    return saved === null ? open : saved === "1";
  }

  let isOpen = $state(initialOpen());

  function toggle() {
    isOpen = !isOpen;
    localStorage.setItem(storeKey, isOpen ? "1" : "0");
  }
</script>

<section class="bn-panel" class:open={isOpen}>
  <button
    type="button"
    class="bn-panel__head"
    aria-expanded={isOpen}
    onclick={toggle}
  >
    <span class="bn-panel__chev" aria-hidden="true">{isOpen ? "▾" : "▸"}</span>
    <span class="bn-panel__title" use:tooltip={tip}>{title}</span>
  </button>
  {#if isOpen}
    <div class="bn-panel__body">
      {@render children()}
    </div>
  {/if}
</section>

<style>
  .bn-panel {
    border-bottom: 1px solid var(--line-soft);
  }
  .bn-panel__head {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
  }
  .bn-panel__head:hover {
    background: var(--surface-2);
  }
  .bn-panel__chev {
    font-size: 10px;
    color: var(--accent);
    width: 10px;
  }
  .bn-panel__title {
    font-weight: 600;
    font-size: 11.5px;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--text);
    cursor: help;
  }
  .bn-panel.open .bn-panel__head {
    background: var(--surface-2);
  }
  .bn-panel__body {
    padding: 4px 0 10px;
    background: var(--bg);
  }
</style>

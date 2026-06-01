<script lang="ts">
  import { tooltip } from "./tooltip";

  let {
    label,
    tip,
    value,
    options,
    onchange,
  }: {
    label: string;
    tip: string;
    value: number | string;
    options: Record<string, number | string>;
    onchange: (v: number | string) => void;
  } = $props();

  // [displayLabel, rawValue] pairs, in declaration order.
  let entries = $derived(
    Object.keys(options).map((k) => ({ key: k, val: options[k] })),
  );

  function handle(e: Event) {
    const idx = (e.target as HTMLSelectElement).selectedIndex;
    onchange(entries[idx].val);
  }

  function pretty(k: string): string {
    return k
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
</script>

<div class="bn-row">
  <label class="bn-row__label" use:tooltip={tip}>
    {label}
    <span class="bn-info" aria-hidden="true">i</span>
  </label>
  <div class="bn-select">
    <select aria-label={label} onchange={handle}>
      {#each entries as e}
        <option value={String(e.val)} selected={e.val === value}>
          {pretty(e.key)}
        </option>
      {/each}
    </select>
    <span class="bn-select__caret" aria-hidden="true">▾</span>
  </div>
</div>

<style>
  .bn-select {
    position: relative;
    display: inline-flex;
    align-items: center;
  }
  select {
    appearance: none;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--accent);
    background: var(--surface-3);
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 4px 22px 4px 8px;
    cursor: pointer;
    min-width: 110px;
  }
  select:focus-visible {
    outline: 1px solid var(--accent);
  }
  .bn-select__caret {
    position: absolute;
    right: 7px;
    font-size: 9px;
    color: var(--text-dim);
    pointer-events: none;
  }
  option {
    background: var(--surface);
    color: var(--text);
  }
</style>

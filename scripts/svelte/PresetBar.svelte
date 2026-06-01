<script lang="ts">
  import {
    listPresets,
    savePreset,
    deletePreset,
    renamePreset,
    exportPreset,
    importPresetFile,
  } from "./presets.js";
  import type { PresetEntry } from "./presets.js";
  import { tooltip } from "./tooltip";

  let {
    onapply,
  }: {
    // App applies the named preset (mutates config + curves) then re-syncs the UI
    onapply: (name: string) => void;
  } = $props();

  let entries = $state<PresetEntry[]>(listPresets());
  let selected = $state<string>(listPresets()[0]?.name ?? "Default");
  let fileInput: HTMLInputElement | undefined = $state();
  let status = $state("");

  function refresh(select?: string) {
    entries = listPresets();
    if (select) selected = select;
  }

  function flash(msg: string) {
    status = msg;
    window.setTimeout(() => {
      if (status === msg) status = "";
    }, 2200);
  }

  let isBuiltin = $derived(
    entries.find((e) => e.name === selected)?.builtin ?? false,
  );

  function apply() {
    onapply(selected);
    flash("Loaded “" + selected + "”");
  }

  function onSelect(e: Event) {
    selected = (e.target as HTMLSelectElement).value;
    apply();
  }

  function saveAs() {
    const name = window.prompt("Save current settings as preset:", selected);
    if (!name) return;
    savePreset(name);
    refresh(name);
    flash("Saved “" + name + "”");
  }

  function overwrite() {
    savePreset(selected);
    refresh(selected);
    flash("Updated “" + selected + "”");
  }

  function rename() {
    const name = window.prompt("Rename preset:", selected);
    if (!name || name === selected) return;
    renamePreset(selected, name);
    refresh(name);
    flash("Renamed to “" + name + "”");
  }

  function remove() {
    if (!window.confirm("Delete preset “" + selected + "”?")) return;
    deletePreset(selected);
    refresh();
    selected = entries[0]?.name ?? "Default";
    flash("Deleted");
  }

  function doExport() {
    exportPreset(selected);
  }

  function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    importPresetFile(f)
      .then((name) => {
        refresh(name);
        flash("Imported “" + name + "”");
      })
      .catch((err) => flash(String(err)));
    (e.target as HTMLInputElement).value = "";
  }
</script>

<div class="bn-presets">
  <div class="bn-presets__row">
    <div class="bn-select bn-presets__select">
      <select aria-label="Preset" value={selected} onchange={onSelect}>
        {#each entries as e}
          <option value={e.name}>{e.builtin ? "★ " : ""}{e.name}</option>
        {/each}
      </select>
      <span class="bn-select__caret" aria-hidden="true">▾</span>
    </div>
    <button
      type="button"
      class="bn-presets__icon"
      use:tooltip={"Re-apply the selected preset to the current settings."}
      onclick={apply}>↺</button
    >
  </div>

  <div class="bn-presets__row">
    <button
      type="button"
      class="bn-presets__btn"
      use:tooltip={"Save the current settings (including curves) as a new named preset."}
      onclick={saveAs}>Save As</button
    >
    <button
      type="button"
      class="bn-presets__btn"
      disabled={isBuiltin}
      use:tooltip={"Overwrite the selected user preset with the current settings."}
      onclick={overwrite}>Update</button
    >
    <button
      type="button"
      class="bn-presets__btn"
      disabled={isBuiltin}
      use:tooltip={"Rename the selected user preset."}
      onclick={rename}>Rename</button
    >
    <button
      type="button"
      class="bn-presets__btn danger"
      disabled={isBuiltin}
      use:tooltip={"Delete the selected user preset."}
      onclick={remove}>Delete</button
    >
  </div>

  <div class="bn-presets__row">
    <button
      type="button"
      class="bn-presets__btn"
      use:tooltip={"Download the selected preset as a .json file."}
      onclick={doExport}>Export</button
    >
    <button
      type="button"
      class="bn-presets__btn"
      use:tooltip={"Import a preset from a .json file."}
      onclick={() => fileInput?.click()}>Import</button
    >
    <input
      bind:this={fileInput}
      type="file"
      accept="application/json,.json"
      class="bn-presets__file"
      onchange={onFile}
    />
  </div>

  {#if status}
    <div class="bn-presets__status">{status}</div>
  {/if}
</div>

<style>
  .bn-presets {
    padding: 10px 16px 12px;
    border-bottom: 1px solid var(--line);
    background: var(--surface-2);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .bn-presets__row {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .bn-presets__select {
    flex: 1 1 auto;
    position: relative;
    display: flex;
    align-items: center;
  }
  .bn-presets__select select {
    width: 100%;
    appearance: none;
    font-family: var(--font-ui);
    font-size: 12px;
    color: var(--accent);
    background: var(--surface-3);
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 5px 22px 5px 8px;
    cursor: pointer;
  }
  .bn-presets__select select:focus-visible {
    outline: 1px solid var(--accent);
  }
  .bn-presets__select .bn-select__caret {
    position: absolute;
    right: 7px;
    font-size: 9px;
    color: var(--text-dim);
    pointer-events: none;
  }
  .bn-presets__select option {
    background: var(--surface);
    color: var(--text);
  }
  .bn-presets__btn {
    flex: 1 1 auto;
    font-family: var(--font-ui);
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--text-dim);
    background: var(--surface-3);
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 5px 6px;
    cursor: pointer;
  }
  .bn-presets__btn:hover:not(:disabled) {
    color: var(--text);
    border-color: var(--text-faint);
  }
  .bn-presets__btn.danger:hover:not(:disabled) {
    color: var(--danger);
    border-color: var(--danger);
  }
  .bn-presets__btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  .bn-presets__icon {
    flex: 0 0 auto;
    width: 30px;
    font-size: 14px;
    color: var(--accent);
    background: var(--surface-3);
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 4px 0;
    cursor: pointer;
  }
  .bn-presets__icon:hover {
    background: var(--surface);
  }
  .bn-presets__file {
    display: none;
  }
  .bn-presets__status {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--accent);
    letter-spacing: 0.04em;
  }
</style>

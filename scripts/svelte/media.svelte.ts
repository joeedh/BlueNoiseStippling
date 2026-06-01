// Reactive "are we on a small / portrait screen" flag, mirroring the
// `@media (max-width: 768px)` breakpoint the rail uses. Exposed as a getter so
// reads inside a $derived/template track the underlying $state and update when
// the viewport crosses the breakpoint (e.g. rotation, window resize).

const MOBILE_QUERY = "(max-width: 768px)";

let mobile = $state(false);

if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
  const mql = window.matchMedia(MOBILE_QUERY);
  mobile = mql.matches;
  mql.addEventListener("change", (e) => {
    mobile = e.matches;
  });
}

export function isMobile(): boolean {
  return mobile;
}

/** Append a hotkey hint to a tooltip, but only on non-mobile (where keys exist). */
export function tipWithHotkey(tip: string, hotkey?: string): string {
  return hotkey && !isMobile() ? `${tip} (${hotkey})` : tip;
}

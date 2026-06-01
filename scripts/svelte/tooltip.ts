// Shared tooltip behavior used by every control. Implemented as a Svelte action
// (use:tooltip={text}) rather than a wrapper component so it can attach to any
// element and so the floating box is position:fixed — it never clips against
// the scrolling panel. Keyboard-accessible: shows on focus, hides on blur, and
// wires aria-describedby for screen readers.

let tipEl: HTMLDivElement | null = null;
let seq = 0;

function ensureTip(): HTMLDivElement {
  if (tipEl === null) {
    tipEl = document.createElement("div");
    tipEl.className = "bn-tooltip";
    tipEl.setAttribute("role", "tooltip");
    document.body.appendChild(tipEl);
  }
  return tipEl;
}

export function tooltip(node: HTMLElement, text: string) {
  const id = "bn-tt-" + seq++;
  let current = text;
  let showTimer: number | undefined;

  node.setAttribute("aria-describedby", id);

  function place() {
    const tip = ensureTip();
    tip.id = id;
    tip.textContent = current;
    tip.setAttribute("data-show", "1");

    const r = node.getBoundingClientRect();
    const tr = tip.getBoundingClientRect();

    // Prefer placing to the LEFT of the control (the rail sits at the right
    // screen edge); fall back to the right if there isn't room.
    let left = r.left - tr.width - 12;
    if (left < 8) {
      left = r.right + 12;
    }

    let top = r.top + r.height / 2 - tr.height / 2;
    top = Math.max(8, Math.min(top, window.innerHeight - tr.height - 8));

    tip.style.left = `${Math.round(left)}px`;
    tip.style.top = `${Math.round(top)}px`;

    // Point the arrow at the control's vertical center.
    const arrowY = r.top + r.height / 2 - top;
    tip.style.setProperty("--arrow-y", `${Math.round(arrowY)}px`);
  }

  function show() {
    window.clearTimeout(showTimer);
    showTimer = window.setTimeout(place, 140);
  }

  function hide() {
    window.clearTimeout(showTimer);
    if (tipEl !== null && tipEl.id === id) {
      tipEl.setAttribute("data-show", "0");
    }
  }

  node.addEventListener("mouseenter", show);
  node.addEventListener("mouseleave", hide);
  node.addEventListener("focusin", show);
  node.addEventListener("focusout", hide);

  return {
    update(next: string) {
      current = next;
      if (tipEl !== null && tipEl.id === id && tipEl.getAttribute("data-show") === "1") {
        tipEl.textContent = current;
      }
    },
    destroy() {
      window.clearTimeout(showTimer);
      hide();
      node.removeEventListener("mouseenter", show);
      node.removeEventListener("mouseleave", hide);
      node.removeEventListener("focusin", show);
      node.removeEventListener("focusout", hide);
    },
  };
}

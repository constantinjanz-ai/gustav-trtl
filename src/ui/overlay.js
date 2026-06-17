// Helpers for the HTML/CSS overlay layer that sits on top of the Kaplay canvas.
import { sfx } from "../systems/audio.js";

export const uiRoot = document.querySelector("#ui-root");

// When true, a modal overlay (dialogue, scrapbook, cutscene) owns input —
// the world pauses Gustav's movement. See entities/gustav.js.
let _busy = false;
export const setUiBusy = (v) => {
  _busy = v;
};
export const isUiBusy = () => _busy;

// Remove every overlay element (called on scene changes).
export function clearOverlay() {
  uiRoot.innerHTML = "";
  _busy = false;
}

// Glossy Web 2.0 button. opts: { wood, disabled, onClick }.
export function makeButton(label, opts = {}) {
  const btn = document.createElement("button");
  btn.className = "gg-btn" + (opts.wood ? " gg-btn--wood" : "");
  btn.textContent = label;
  if (opts.disabled) btn.classList.add("is-disabled");

  btn.addEventListener("mouseenter", () => {
    if (!btn.classList.contains("is-disabled")) sfx("hover");
  });
  btn.addEventListener("click", () => {
    if (btn.classList.contains("is-disabled")) return;
    sfx("click");
    opts.onClick?.();
  });
  return btn;
}

// Small toggle pill used in Optionen.
export function makeToggle(isOn, onText, offText, onToggle) {
  const t = document.createElement("button");
  const render = (on) => {
    t.textContent = on ? onText : offText;
    t.className = "gg-toggle" + (on ? "" : " is-off");
  };
  let on = isOn;
  render(on);
  t.addEventListener("click", () => {
    sfx("click");
    on = !on;
    render(on);
    onToggle(on);
  });
  return t;
}

// Append a transient toast (e.g. "Gespeichert!").
export function toast(text) {
  const el = document.createElement("div");
  el.className = "gg-toast";
  el.textContent = text;
  uiRoot.appendChild(el);
  setTimeout(() => el.remove(), 1900);
}

// Build a modal panel with a backdrop. Returns { backdrop, panel, close }.
export function makeModal(headingText) {
  const backdrop = document.createElement("div");
  backdrop.className = "gg-modal-backdrop";
  const panel = document.createElement("div");
  panel.className = "gg-panel gg-modal";
  if (headingText) {
    const h = document.createElement("h2");
    h.textContent = headingText;
    panel.appendChild(h);
  }
  backdrop.appendChild(panel);
  const close = () => backdrop.remove();
  return { backdrop, panel, close };
}

// Retro beveled HUD: three need meters (Sonne / Snack / Nickerchen) + a Glück
// meter. Plain DOM overlay; the scene calls update(state) each frame.
import { NEEDS, GLUCK } from "../data/needs.js";
import { uiRoot } from "./overlay.js";

const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;

export function createHud(state) {
  const hud = document.createElement("div");
  hud.className = "gg-hud";

  const fills = {};

  function addMeter(cfg, extraClass = "") {
    const row = document.createElement("div");
    row.className = "gg-meter " + extraClass;

    const icon = document.createElement("div");
    icon.className = "gg-meter-icon";
    icon.textContent = cfg.icon;

    const track = document.createElement("div");
    track.className = "gg-meter-track";
    track.title = cfg.label;

    const fill = document.createElement("div");
    fill.className = "gg-meter-fill";
    fill.style.background = `linear-gradient(to bottom, ${rgb(cfg.color)}, ${shade(cfg.color, -40)})`;
    track.appendChild(fill);

    row.append(icon, track);
    hud.appendChild(row);
    return fill;
  }

  for (const n of NEEDS) fills[n.key] = addMeter(n);
  fills.gluck = addMeter(GLUCK, "gg-meter--gluck");

  uiRoot.appendChild(hud);

  function update(s) {
    for (const n of NEEDS) {
      fills[n.key].style.width = clampPct(s.needs[n.key]) + "%";
    }
    fills.gluck.style.width = clampPct(s.gluck) + "%";
  }
  update(state);

  // old-Flash achievement pop-up
  function pop(text) {
    const el = document.createElement("div");
    el.className = "gg-pop";
    el.textContent = text;
    uiRoot.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }

  function destroy() {
    hud.remove();
  }

  return { update, pop, destroy };
}

function clampPct(v) {
  return Math.max(0, Math.min(100, v || 0));
}

function shade(c, amt) {
  const f = (x) => Math.max(0, Math.min(255, x + amt));
  return `rgb(${f(c[0])},${f(c[1])},${f(c[2])})`;
}

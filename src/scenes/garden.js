// Frühling garden scene — the one-screen play space.
// Builds the world from data/garden.spring.js (zones, structures, props),
// wires collisions, and spawns Gustav. Needs/strawberries/worn-path/quest come
// in later checkpoints; this is the world + movement foundation.
import k from "../config/kaplay.js";
import STRINGS from "../data/strings.de.js";
import {
  GARDEN_W,
  GARDEN_H,
  PALETTE,
  ZONES,
  STRUCTURES,
  PROPS,
  GUSTAV_START,
} from "../data/garden.spring.js";
import { spawnGustav } from "../entities/gustav.js";
import { clearOverlay, uiRoot, makeButton } from "../ui/overlay.js";
import { getState } from "../systems/save.js";
import { createNeeds } from "../systems/needs.js";
import { createStrawberries } from "../systems/strawberries.js";
import { createWornPath } from "../systems/wornPath.js";
import { createHud } from "../ui/hud.js";

export function registerGardenScene() {
  k.scene("garden", () => {
    clearOverlay();
    buildGround();
    buildStructures();
    buildProps();

    const state = getState();

    // worn path renders under Gustav, so build it before he spawns
    const worn = createWornPath(k, state);

    const start = state.gustav?.x != null ? state.gustav : GUSTAV_START;
    const gustav = spawnGustav(k, start);

    // systems
    const needs = createNeeds(k, state);
    const hud = createHud(state);
    const straw = createStrawberries(k, state, {
      onEat: () => needs.eatSnack(),
    });

    // one update loop drives needs, berries, the worn path and the HUD
    k.onUpdate(() => {
      needs.update(gustav);
      straw.update(gustav);
      worn.update(gustav);
      hud.update(state);
      state.gustav = { x: Math.round(gustav.pos.x), y: Math.round(gustav.pos.y) };
    });

    buildDevNav();
  });
}

function buildGround() {
  // lawn covers the whole ground
  k.add([k.rect(GARDEN_W, GARDEN_H), k.pos(0, 0), k.color(...PALETTE.lawn), k.z(0)]);

  // faint mowing stripes
  for (let i = 0; i < 6; i++) {
    k.add([
      k.rect(GARDEN_W, 18),
      k.pos(0, 30 + i * 38),
      k.color(...PALETTE.lawnStripe),
      k.opacity(0.5),
      k.z(1),
    ]);
  }

  // planted beds (bark mulch) down the long borders
  for (const b of [ZONES.leftBed, ZONES.rightBed]) {
    k.add([k.rect(b.w, b.h), k.pos(b.x, b.y), k.color(...PALETTE.bed), k.opacity(0.85), k.z(2)]);
  }

  // wood terrace deck along the house
  const t = ZONES.terrace;
  k.add([k.rect(t.w, t.h), k.pos(t.x, t.y), k.color(...PALETTE.deck), k.z(3)]);
  for (let i = 0; i < 8; i++) {
    k.add([
      k.rect(t.w, 1.5),
      k.pos(t.x, t.y + 3 + i * 3.6),
      k.color(...PALETTE.deckPlank),
      k.opacity(0.5),
      k.z(4),
    ]);
  }
}

function buildStructures() {
  for (const s of STRUCTURES) {
    const obj = k.add([
      k.rect(s.w, s.h),
      k.pos(s.x, s.y),
      k.color(...s.color),
      k.z(s.kind === "house" ? 5 : 6),
      s.kind,
    ]);
    if (s.solid) obj.use(k.area()), obj.use(k.body({ isStatic: true }));
  }

  // a hint of patio doors on the house wall
  for (let i = 0; i < 3; i++) {
    k.add([
      k.rect(70, 14),
      k.pos(70 + i * 130, 302),
      k.color(...PALETTE.houseDoor),
      k.opacity(0.9),
      k.z(6),
    ]);
  }
}

function buildProps() {
  for (const p of PROPS) {
    const comps = [k.pos(p.x, p.y), k.anchor("center"), k.color(...p.color), k.z(5), p.kind];
    if (p.r != null) {
      comps.unshift(k.circle(p.r));
    } else {
      comps.unshift(k.rect(p.w, p.h, { radius: 3 }));
    }
    if (p.tag) comps.push(p.tag);
    const obj = k.add(comps);
    if (p.solid) {
      obj.use(k.area({ scale: 0.8 })); // slightly forgiving collision
      obj.use(k.body({ isStatic: true }));
    }
  }
}

function buildDevNav() {
  // dev nav + a gentle control hint
  const back = makeButton(STRINGS.menu.back, {
    wood: true,
    onClick: () => k.go("title"),
  });
  back.style.position = "absolute";
  back.style.left = "12px";
  back.style.top = "12px";
  back.style.minWidth = "110px";
  uiRoot.appendChild(back);

  const hint = document.createElement("div");
  hint.textContent = "WASD / Pfeiltasten: Gustav läuft";
  hint.style.cssText =
    "position:absolute;left:50%;bottom:14px;transform:translateX(-50%);" +
    "font-family:var(--font-read);font-size:22px;color:#fff;" +
    "text-shadow:0 2px 4px rgba(0,0,0,.6);pointer-events:none;";
  uiRoot.appendChild(hint);
}

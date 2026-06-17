// Teezeit — the recurring warm payoff. At a Glück threshold the garden dims to
// dusk, the paper lanterns (Lampions) light up over the terrace, and the family
// gathers for tea with Gustav. One-shot per save (flag), unlocks a memory.
import { GARDEN_W, GARDEN_H } from "../data/garden.spring.js";
import { CHARACTERS } from "../data/characters.js";
import { showDialogue } from "./dialogue.js";
import { setUiBusy } from "./overlay.js";

const wait = (k, s) => new Promise((r) => k.wait(s, r));

const LANTERNS = [
  { x: 70, y: 258 },
  { x: 140, y: 252 },
  { x: 210, y: 250 },
  { x: 280, y: 250 },
  { x: 350, y: 252 },
  { x: 420, y: 258 },
  { x: 24, y: 64 }, // strung in the left fig tree
  { x: 30, y: 78 },
];

export async function playTeezeit(k, state) {
  setUiBusy(true);

  // dusk tint over the whole garden
  const dusk = k.add([
    k.rect(GARDEN_W, GARDEN_H),
    k.pos(0, 0),
    k.color(38, 40, 88),
    k.opacity(0),
    k.z(40),
    "teezeit-fx",
    { target: 0.5 },
  ]);
  dusk.onUpdate(() => {
    dusk.opacity += (dusk.target - dusk.opacity) * Math.min(1, k.dt() * 3);
  });

  // lanterns warming up
  const lamps = LANTERNS.map((p) => {
    const lamp = k.add([
      k.circle(3.2),
      k.pos(p.x, p.y),
      k.color(255, 226, 150),
      k.opacity(0),
      k.anchor("center"),
      k.z(42),
      "teezeit-fx",
      { target: 1, t: k.rand(0, 6) },
    ]);
    const glow = k.add([
      k.circle(7),
      k.pos(p.x, p.y),
      k.color(255, 226, 150),
      k.opacity(0),
      k.anchor("center"),
      k.z(41),
      "teezeit-fx",
      { ref: lamp },
    ]);
    lamp.onUpdate(() => {
      lamp.t += k.dt();
      lamp.opacity += (lamp.target - lamp.opacity) * Math.min(1, k.dt() * 2);
      glow.opacity = lamp.opacity * (0.3 + Math.sin(lamp.t * 2) * 0.06);
    });
    return [lamp, glow];
  });

  await wait(k, 1.1);

  const M = CHARACTERS.magda;
  await showDialogue([
    { name: M.name, portrait: M.portrait, text: "Teezeit! 🍵 Die Lampions gehen an, mein Gustav." },
    { name: M.name, portrait: M.portrait, text: "Komm zu uns auf die Terrasse — die ganze Familie ist da." },
    { name: M.name, portrait: M.portrait, text: "So ist es schön. Einfach beieinander sein. 💚" },
  ]);

  // unlock the Teezeit memory
  state.memories = state.memories || [];
  if (!state.memories.includes("erste_teezeit")) {
    state.memories.push("erste_teezeit");
  }
  state.flags = state.flags || {};
  state.flags.teezeitSeen = true;

  // fade dusk back out, then clean up the fx
  dusk.target = 0;
  for (const [lamp] of lamps) lamp.target = 0;
  await wait(k, 1.0);
  k.get("teezeit-fx").forEach((o) => k.destroy(o));

  setUiBusy(false);
}

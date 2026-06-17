// Generic family-member world sprite, drawn from a character's `sprite`
// descriptor (see data/characters.js). Placeholder shapes carrying each
// person's signature look; swapped for pixel art at M5.
import { CHARACTERS } from "../data/characters.js";

export function spawnCharacter(k, id, pos) {
  const c = CHARACTERS[id];
  const sp = c.sprite;
  const broad = sp.build === "broad";
  const bodyW = broad ? 19 : 15;

  const npc = k.add([
    k.pos(pos.x, pos.y),
    k.anchor("bot"),
    k.z(9),
    "npc",
    id,
    { charId: id, t: 0 },
  ]);

  // soft shadow
  npc.add([
    k.circle(broad ? 10 : 8), k.scale(1.1, 0.4), k.color(0, 0, 0),
    k.opacity(0.18), k.anchor("center"), k.pos(0, 1),
  ]);
  // torso
  npc.add([
    k.rect(bodyW, 18, { radius: 4 }), k.color(...sp.top),
    k.anchor("bot"), k.pos(0, 0),
  ]);
  // accent (scarf) just under the neck
  if (sp.accent) {
    npc.add([
      k.rect(bodyW, 5, { radius: 2 }), k.color(...sp.accent),
      k.anchor("center"), k.pos(0, -16),
    ]);
  }
  // head
  npc.add([k.circle(6), k.color(...sp.skin), k.anchor("center"), k.pos(0, -24)]);

  // hair by style
  if (sp.hairStyle === "wavy") {
    npc.add([k.circle(6.6), k.color(...sp.hair), k.anchor("center"), k.pos(0, -27)]);
    npc.add([k.circle(3.4), k.color(...sp.hair), k.anchor("center"), k.pos(-5, -23)]);
    npc.add([k.circle(3.4), k.color(...sp.hair), k.anchor("center"), k.pos(5, -23)]);
  } else if (sp.hairStyle === "long") {
    npc.add([k.circle(6.8), k.color(...sp.hair), k.anchor("center"), k.pos(0, -27)]);
    npc.add([k.rect(3, 16, { radius: 2 }), k.color(...sp.hair), k.anchor("top"), k.pos(-6, -27)]);
    npc.add([k.rect(3, 16, { radius: 2 }), k.color(...sp.hair), k.anchor("top"), k.pos(6, -27)]);
  } else if (sp.hairStyle === "short") {
    npc.add([k.circle(6.4), k.color(...sp.hair), k.anchor("center"), k.pos(0, -27)]);
  } // 'bald' -> no hair

  // glasses
  if (sp.glasses) {
    npc.add([k.circle(1.6), k.color(60, 40, 20), k.anchor("center"), k.pos(-2.4, -24)]);
    npc.add([k.circle(1.6), k.color(60, 40, 20), k.anchor("center"), k.pos(2.4, -24)]);
  }
  // gold hoop earrings
  if (sp.earrings) {
    npc.add([k.circle(1.1), k.color(230, 180, 34), k.anchor("center"), k.pos(-6, -23)]);
    npc.add([k.circle(1.1), k.color(230, 180, 34), k.anchor("center"), k.pos(6, -23)]);
  }

  // gentle idle bob
  npc.onUpdate(() => {
    npc.t += k.dt();
    npc.pos.y = pos.y + Math.sin(npc.t * 1.6) * 0.6;
  });

  return npc;
}

// Family-member world sprite — a hand-crafted pixel-art chibi figure
// (see art/sprites.js, sprite name "npc_<id>"), with a little nametag above.
import { CHARACTERS } from "../data/characters.js";

export function spawnCharacter(k, id, pos) {
  const c = CHARACTERS[id];
  const spriteH = c.sprite.build === "tall" ? 38 : 34;

  const npc = k.add([
    k.pos(pos.x, pos.y),
    k.anchor("bot"),
    k.z(9),
    "npc",
    id,
    { charId: id, t: 0 },
  ]);

  // soft shadow at the feet
  npc.add([
    k.circle(7),
    k.scale(1.1, 0.4),
    k.color(0, 0, 0),
    k.opacity(0.18),
    k.anchor("center"),
    k.pos(0, 0),
  ]);

  // the pixel-art body
  const vis = npc.add([k.sprite("npc_" + id), k.anchor("bot"), k.pos(0, 1)]);

  // nametag: just the name (no box) with a crisp dark outline for readability
  const tagY = -spriteH - 5;
  for (const [dx, dy] of [[0.8, 0.8], [-0.8, 0.8], [0.8, -0.8], [-0.8, -0.8]]) {
    npc.add([k.text(c.name, { size: 8 }), k.color(40, 30, 18), k.anchor("center"), k.pos(dx, tagY + dy), k.z(12)]);
  }
  npc.add([k.text(c.name, { size: 8 }), k.color(255, 252, 242), k.anchor("center"), k.pos(0, tagY), k.z(13)]);

  // gentle idle bob (only the body bobs; the nametag stays steady)
  npc.onUpdate(() => {
    npc.t += k.dt();
    vis.pos.y = 1 + Math.sin(npc.t * 1.6) * 0.6;
  });

  return npc;
}

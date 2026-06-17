// Family-member world sprite — a hand-crafted pixel-art chibi figure
// (see art/sprites.js, sprite name "npc_<id>"), matching Gustav's style.
export function spawnCharacter(k, id, pos) {
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

  // gentle idle bob
  npc.onUpdate(() => {
    npc.t += k.dt();
    vis.pos.y = 1 + Math.sin(npc.t * 1.6) * 0.6;
  });

  return npc;
}

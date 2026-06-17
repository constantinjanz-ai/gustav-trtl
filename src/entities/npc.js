// Magda's in-world sprite — a small figure standing on the terrace, facing the
// camera. Placeholder shapes carrying her signature look (mustard scarf, brown
// wavy hair, glasses, black turtleneck). Swapped for pixel art at M5.
export function spawnMagda(k, pos) {
  const magda = k.add([k.pos(pos.x, pos.y), k.anchor("bot"), k.z(9), "magda", { t: 0 }]);

  // soft shadow (flattened circle)
  magda.add([
    k.circle(8),
    k.scale(1.1, 0.4),
    k.color(0, 0, 0),
    k.opacity(0.18),
    k.anchor("center"),
    k.pos(0, 1),
  ]);
  // black turtleneck body
  magda.add([k.rect(15, 18, { radius: 4 }), k.color(28, 28, 32), k.anchor("bot"), k.pos(0, 0)]);
  // mustard fringed scarf
  magda.add([k.rect(15, 5, { radius: 2 }), k.color(230, 180, 34), k.anchor("center"), k.pos(0, -16)]);
  // head
  magda.add([k.circle(6), k.color(240, 201, 168), k.anchor("center"), k.pos(0, -24)]);
  // brown wavy hair
  magda.add([k.circle(6.6), k.color(107, 74, 43), k.anchor("center"), k.pos(0, -27)]);
  magda.add([k.circle(3.4), k.color(107, 74, 43), k.anchor("center"), k.pos(-5, -23)]);
  magda.add([k.circle(3.4), k.color(107, 74, 43), k.anchor("center"), k.pos(5, -23)]);
  // glasses
  magda.add([k.circle(1.6), k.color(60, 40, 20), k.anchor("center"), k.pos(-2.4, -24)]);
  magda.add([k.circle(1.6), k.color(60, 40, 20), k.anchor("center"), k.pos(2.4, -24)]);

  // gentle idle breathing bob
  magda.onUpdate(() => {
    magda.t += k.dt();
    magda.pos.y = pos.y + Math.sin(magda.t * 1.6) * 0.6;
  });

  return magda;
}

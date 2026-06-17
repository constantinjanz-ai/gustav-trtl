// Gustav — a medium adult Hermann's tortoise. Placeholder art (colored shapes)
// drawn with love: high domed carapace with radiating dark-centred scutes,
// greyish scaly skin, a gentle old face. Slow, deliberate waddle + head-bob.
// Built behind a thin layer so M5 can swap the shapes for a real sprite.

import { GARDEN_W, GARDEN_H } from "../data/garden.spring.js";
import { isUiBusy } from "../ui/overlay.js";

const SPEED = 46; // slow and endearing (logical px/s)

// Carapace colours
const SHELL = [178, 142, 70]; // golden-tan / olive-yellow
const SHELL_DARK = [120, 92, 44];
const SHELL_EDGE = [92, 68, 30];
const SKIN = [150, 140, 122]; // greyish-brown scaly skin
const SKIN_DARK = [120, 110, 96];

export function spawnGustav(k, start) {
  // Parent object: holds position, collision body, movement + waddle state.
  const gustav = k.add([
    k.pos(start.x, start.y),
    k.anchor("center"),
    k.area({ shape: new k.Rect(k.vec2(0, 4), 22, 14) }), // body sits low on the sprite
    k.body(),
    k.z(10),
    "gustav",
    {
      facing: 1, // 1 = right, -1 = left
      moving: false,
      t: 0,
    },
  ]);

  // --- visual assembly (children, so we can waddle the whole body) ---
  const visual = gustav.add([k.pos(0, 0), k.anchor("center"), { t: 0 }]);

  // four stubby legs (drawn first, behind shell)
  const legs = [
    [-8, 6],
    [8, 6],
    [-9, -2],
    [9, -2],
  ].map(([lx, ly]) =>
    visual.add([
      k.circle(3.2),
      k.color(...SKIN_DARK),
      k.anchor("center"),
      k.pos(lx, ly),
      { home: k.vec2(lx, ly), phase: lx + ly },
    ]),
  );

  // head + neck poking forward (to the right by default; flipped via facing)
  const neck = visual.add([
    k.rect(7, 5, { radius: 2 }),
    k.color(...SKIN),
    k.anchor("center"),
    k.pos(11, 1),
  ]);
  const head = visual.add([
    k.circle(4.5),
    k.color(...SKIN),
    k.anchor("center"),
    k.pos(15, 0),
    { home: k.vec2(15, 0) },
  ]);
  const eye = visual.add([
    k.circle(0.9),
    k.color(20, 16, 12),
    k.anchor("center"),
    k.pos(16.5, -1),
    { home: k.vec2(16.5, -1) },
  ]);

  // domed carapace: base, darker dome, radiating scute pattern
  visual.add([k.circle(13), k.color(...SHELL_EDGE), k.anchor("center")]);
  visual.add([k.circle(12), k.color(...SHELL), k.anchor("center")]);
  visual.add([
    k.circle(7.5),
    k.color(...SHELL_DARK),
    k.anchor("center"),
    k.opacity(0.55),
  ]);
  // dark-centred scutes radiating around the dome
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    visual.add([
      k.circle(2.1),
      k.color(...SHELL_DARK),
      k.anchor("center"),
      k.pos(Math.cos(a) * 7.5, Math.sin(a) * 7.5),
      k.opacity(0.7),
    ]);
  }
  visual.add([k.circle(2.4), k.color(...SHELL_DARK), k.anchor("center")]); // centre scute

  const headParts = { neck, head, eye };

  gustav.onUpdate(() => {
    const dir = k.vec2(0, 0);
    if (!isUiBusy()) {
      if (k.isKeyDown("left") || k.isKeyDown("a")) dir.x -= 1;
      if (k.isKeyDown("right") || k.isKeyDown("d")) dir.x += 1;
      if (k.isKeyDown("up") || k.isKeyDown("w")) dir.y -= 1;
      if (k.isKeyDown("down") || k.isKeyDown("s")) dir.y += 1;
    }

    gustav.moving = dir.x !== 0 || dir.y !== 0;
    if (gustav.moving) {
      const v = dir.unit().scale(SPEED);
      gustav.move(v);
      if (dir.x !== 0) gustav.facing = dir.x > 0 ? 1 : -1;
      gustav.t += k.dt();
    }

    // keep Gustav inside the garden bounds (belt-and-braces vs the fence body).
    // minY can be lowered during the gate-escape gag so he can slip out the top.
    gustav.pos.x = k.clamp(gustav.pos.x, 16, GARDEN_W - 16);
    gustav.pos.y = k.clamp(gustav.pos.y, gustav.minY ?? 16, GARDEN_H - 16);

    // waddle: gentle body tilt + head-bob while walking
    const wobble = gustav.moving ? Math.sin(gustav.t * 9) : 0;
    visual.angle = wobble * 5;
    visual.scale = k.vec2(gustav.facing, 1);
    head.pos.y = headParts.head.home.y + (gustav.moving ? Math.sin(gustav.t * 9) * 0.8 : 0);
    eye.pos.y = headParts.eye.home.y + (gustav.moving ? Math.sin(gustav.t * 9) * 0.8 : 0);

    // little leg shuffle
    legs.forEach((leg, i) => {
      leg.pos.y = leg.home.y + (gustav.moving ? Math.sin(gustav.t * 9 + i) * 1.2 : 0);
    });
  });

  return gustav;
}

// Gustav — a medium adult Hermann's tortoise. Now a hand-crafted pixel-art
// sprite (see art/sprites.js): high domed carapace with radiating dark-centred
// scutes, greyish skin, a gentle face. Slow, deliberate waddle + head-bob.
import { GARDEN_W, GARDEN_H } from "../data/garden.spring.js";
import { isUiBusy } from "../ui/overlay.js";

const SPEED = 46; // slow and endearing (logical px/s)

export function spawnGustav(k, start) {
  // Parent object: position, collision body, movement + waddle state.
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

  // the pixel-art body, as a child so we can waddle/flip it independently
  const vis = gustav.add([
    k.sprite("gustav"),
    k.anchor("center"),
    k.pos(0, 0),
    k.rotate(0),
    k.scale(1),
  ]);

  gustav.onUpdate(() => {
    const dir = k.vec2(0, 0);
    if (!isUiBusy() && !gustav.asleep) {
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

    // face the way we walk
    vis.flipX = gustav.facing < 0;

    if (gustav.asleep) {
      // gentle breathing while hibernating
      gustav.t += k.dt();
      vis.angle = 0;
      const breath = 1 + Math.sin(gustav.t * 2) * 0.03;
      vis.scale = k.vec2(1, breath);
      vis.pos.y = 0;
    } else {
      // waddle: gentle body tilt + head-bob while walking
      const wobble = gustav.moving ? Math.sin(gustav.t * 9) : 0;
      vis.angle = wobble * 5;
      vis.scale = k.vec2(1, 1);
      vis.pos.y = gustav.moving ? Math.sin(gustav.t * 9) * 0.6 : 0;
    }
  });

  return gustav;
}

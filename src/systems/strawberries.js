// Tiny wild Erdbeeren along the border lanes — Gustav eats them as he patrols
// the edges. Eating fills Snack (+ a sparkle + blip). Berries respawn over time
// so the patrol always has something to find.
import { BORDER_LANES } from "../data/garden.spring.js";
import { sfx } from "./audio.js";

const RESPAWN_MIN = 2.5; // seconds
const RESPAWN_MAX = 6;
const EAT_DIST = 12;

export function createStrawberries(k, state, { onEat, max = 6 } = {}) {
  const MAX_BERRIES = max;
  const berries = [];
  let respawnTimer = 0;

  function randomLanePos() {
    const lane = k.choose(BORDER_LANES);
    return k.vec2(
      lane.x + k.rand(2, lane.w - 2),
      lane.y + k.rand(4, lane.h - 4),
    );
  }

  function spawnBerry() {
    const p = randomLanePos();
    const berry = k.add([
      k.pos(p),
      k.anchor("center"),
      k.z(6),
      "erdbeere",
      { t: k.rand(0, 6) },
    ]);
    // body
    const body = berry.add([k.circle(3), k.color(232, 65, 63), k.anchor("center"), k.pos(0, 0)]);
    // tiny seeds
    berry.add([k.circle(0.5), k.color(255, 240, 200), k.anchor("center"), k.pos(-1, 0)]);
    berry.add([k.circle(0.5), k.color(255, 240, 200), k.anchor("center"), k.pos(1.2, 1)]);
    // green leafy top
    berry.add([k.circle(1.6), k.color(86, 150, 72), k.anchor("center"), k.pos(0, -3)]);
    // gentle idle bob
    berry.onUpdate(() => {
      berry.t += k.dt();
      body.pos.y = Math.sin(berry.t * 3) * 0.5;
    });
    berries.push(berry);
  }

  function sparkle(pos) {
    const s = k.add([
      k.circle(2),
      k.color(255, 255, 255),
      k.opacity(0.9),
      k.pos(pos),
      k.anchor("center"),
      k.z(9),
      { t: 0 },
    ]);
    s.onUpdate(() => {
      s.t += k.dt();
      s.radius = 2 + s.t * 26;
      s.opacity = Math.max(0, 0.9 - s.t * 2.4);
      if (s.t > 0.4) k.destroy(s);
    });
  }

  function eat(berry) {
    sparkle(berry.pos);
    sfx("eat");
    k.destroy(berry);
    const i = berries.indexOf(berry);
    if (i >= 0) berries.splice(i, 1);
    state.flags = state.flags || {};
    state.flags.berriesEaten = (state.flags.berriesEaten || 0) + 1;
    onEat?.();
  }

  // seed a few right away
  for (let i = 0; i < MAX_BERRIES; i++) spawnBerry();

  function update(gustav) {
    // eat on proximity
    for (const berry of [...berries]) {
      if (berry.pos.dist(gustav.pos) < EAT_DIST) eat(berry);
    }
    // trickle respawns up to the cap
    if (berries.length < MAX_BERRIES) {
      respawnTimer -= k.dt();
      if (respawnTimer <= 0) {
        spawnBerry();
        respawnTimer = k.rand(RESPAWN_MIN, RESPAWN_MAX);
      }
    }
  }

  return { update };
}

// The worn dirt-path mechanic — the most "Gustav" thing in the game.
// As Gustav walks, the grass under him wears to bare dirt (per grid cell,
// persisted in state.worn). Just like the real garden, paths only stay bare if
// he keeps using them — untrodden grass regrows very slowly, so upholding a
// path takes work.
import { GARDEN_W, GARDEN_H } from "../data/garden.spring.js";

const CELL = 10; // logical px per wear cell
const DIRT = [150, 120, 84];

// How fast grass wears. Centre cell wears faster than the brushed neighbours.
const WEAR_CENTRE = 0.55; // per second standing/passing
const WEAR_NEIGHBOUR = 0.22;
const REGROW = 0.007; // per second — grass slowly heals where Gustav isn't walking
const SHOW_AT = 0.06;

export function createWornPath(k, state) {
  state.worn = state.worn || {}; // "col,row" -> wear 0..1
  const worn = state.worn;

  const key = (c, r) => c + "," + r;
  const addWear = (c, r, amt) => {
    if (c < 0 || r < 0 || c * CELL >= GARDEN_W || r * CELL >= GARDEN_H) return;
    const k0 = key(c, r);
    worn[k0] = Math.min(1, (worn[k0] || 0) + amt);
  };

  // render layer: above lawn + stripes, below plants/props
  const layer = k.add([k.z(2), "wornpath"]);
  layer.onDraw(() => {
    for (const k0 in worn) {
      const wear = worn[k0];
      if (wear < SHOW_AT) continue;
      const [c, r] = k0.split(",");
      k.drawCircle({
        pos: k.vec2((+c + 0.5) * CELL, (+r + 0.5) * CELL),
        radius: CELL * 0.72,
        color: k.rgb(...DIRT),
        opacity: Math.min(1, wear) * 0.9,
      });
    }
  });

  function update(gustav) {
    const dt = k.dt();
    if (dt <= 0) return;

    // slow regrowth everywhere — untended paths heal over time
    const heal = REGROW * dt;
    for (const k0 in worn) {
      const v = worn[k0] - heal;
      if (v <= 0.001) delete worn[k0];
      else worn[k0] = v;
    }

    // walking wears the grass faster than it heals, so used paths persist/deepen
    if (gustav.moving) {
      const c = Math.floor(gustav.pos.x / CELL);
      const r = Math.floor(gustav.pos.y / CELL);
      addWear(c, r, WEAR_CENTRE * dt);
      // brush the 4-neighbours a little so the path has width
      addWear(c - 1, r, WEAR_NEIGHBOUR * dt);
      addWear(c + 1, r, WEAR_NEIGHBOUR * dt);
      addWear(c, r - 1, WEAR_NEIGHBOUR * dt);
      addWear(c, r + 1, WEAR_NEIGHBOUR * dt);
    }
  }

  return { update };
}

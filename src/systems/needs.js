// Needs + Glück system. Owns the slow drift, the fill-from-actions, and the
// gentle Glück accrual. Reads/writes the live save state (systems/save.js).
import { NEEDS, GLUCK } from "../data/needs.js";
import { SUN_ZONE, ZONES } from "../data/garden.spring.js";

function inRect(p, r) {
  return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
}

export function createNeeds(k, state, opts = {}) {
  const sunFillMul = opts.sunFillMul ?? 1;

  // make sure the shape is present (old saves / fresh state)
  state.needs = state.needs || { sonne: 70, snack: 70, nickerchen: 70 };
  if (typeof state.gluck !== "number") state.gluck = 0;

  const clamp = (v) => Math.max(0, Math.min(100, v));

  function update(gustav) {
    const dt = k.dt();

    // drift down
    for (const n of NEEDS) {
      state.needs[n.key] = clamp(state.needs[n.key] - n.decay * dt);
    }

    // Sonne: basking in the sunny terrace spot
    if (inRect(gustav.pos, SUN_ZONE)) {
      const sun = NEEDS.find((n) => n.key === "sonne");
      state.needs.sonne = clamp(state.needs.sonne + sun.fillRate * sunFillMul * dt);
    }

    // Nickerchen: resting (standing still); cozier on the terrace deck
    if (!gustav.moving) {
      const nap = NEEDS.find((n) => n.key === "nickerchen");
      const rate = inRect(gustav.pos, ZONES.terrace)
        ? nap.fillRateCozy
        : nap.fillRate;
      state.needs.nickerchen = clamp(state.needs.nickerchen + rate * dt);
    }

    // Glück: gentle trickle while content
    const avg =
      (state.needs.sonne + state.needs.snack + state.needs.nickerchen) / 3;
    if (avg >= GLUCK.contentThreshold) {
      state.gluck = clamp(state.gluck + GLUCK.contentTrickle * dt);
    }
  }

  // Eating a strawberry (called by the strawberry system).
  function eatSnack() {
    const snack = NEEDS.find((n) => n.key === "snack");
    state.needs.snack = clamp(state.needs.snack + snack.fillAmount);
    state.gluck = clamp(state.gluck + GLUCK.berryBump);
  }

  // Generic Glück bump (quests etc., later checkpoints).
  function addGluck(amount) {
    state.gluck = clamp(state.gluck + amount);
  }

  return { update, eatSnack, addGluck };
}

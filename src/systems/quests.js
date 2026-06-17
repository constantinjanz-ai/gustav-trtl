// Quest tracking over the live save state. States per quest:
//   'none' (not offered) -> 'active' (harvesting) -> 'ready' (turn in) -> 'done'
import { QUESTS } from "../data/quests.js";

export function createQuests(state) {
  state.quests = state.quests || {};

  const get = (id) => state.quests[id] || { state: "none", progress: 0 };
  const set = (id, q) => (state.quests[id] = q);

  function start(id) {
    if (get(id).state === "none") set(id, { state: "active", progress: 0 });
  }

  // Called whenever Gustav eats a strawberry. Advances any active harvest quest.
  // Returns the quest id that just became 'ready', or null.
  function onBerryEaten() {
    let becameReady = null;
    for (const id in QUESTS) {
      const def = QUESTS[id];
      if (def.type !== "harvest_strawberries") continue;
      const q = get(id);
      if (q.state !== "active") continue;
      q.progress = Math.min(def.target, q.progress + 1);
      if (q.progress >= def.target) {
        q.state = "ready";
        becameReady = id;
      }
      set(id, q);
    }
    return becameReady;
  }

  // Turn in a 'ready' quest. Returns the def (for rewards) or null.
  function complete(id) {
    const q = get(id);
    if (q.state !== "ready") return null;
    q.state = "done";
    set(id, q);
    return QUESTS[id];
  }

  // The one quest to surface in the HUD Aufgabe line (active or ready), if any.
  function activeLabel() {
    for (const id in QUESTS) {
      const def = QUESTS[id];
      const q = get(id);
      if (q.state === "active" || q.state === "ready") {
        return { text: def.label, progress: q.progress, target: def.target };
      }
    }
    return null;
  }

  return { get, start, onBerryEaten, complete, activeLabel, QUESTS };
}

// Quest definitions (data-driven). Each quest belongs to a giver + a season;
// the giver offers their current-season quest when talked to.
export const QUESTS = {
  // --- Frühling ---
  magda_strawberries: {
    id: "magda_strawberries",
    giver: "magda",
    season: "fruehling",
    type: "harvest_strawberries",
    target: 5,
    label: "Sammle Erdbeeren für Magda",
    rewardGluck: 20,
    rewardMemory: "erste_ernte",
  },

  // --- Sommer ---
  maria_pebble: {
    id: "maria_pebble",
    giver: "maria",
    season: "sommer",
    type: "find_item",
    target: 1,
    label: "Finde Gustavs Lieblingsstein",
    rewardGluck: 18,
    rewardMemory: "lieblingsstein",
  },
  tata_ramp: {
    id: "tata_ramp",
    giver: "tata",
    season: "sommer",
    type: "reach_spot",
    target: 1,
    label: "Probier Tatas Sonnenrampe aus",
    rewardGluck: 16,
    rewardMemory: "sonnenrampe",
  },
  jan_loewenzahn: {
    id: "jan_loewenzahn",
    giver: "jan",
    season: "sommer",
    type: "collect_loewenzahn",
    target: 3,
    label: "Friss Löwenzahn für Jan",
    rewardGluck: 16,
    rewardMemory: "loewenzahn",
  },
  constantin_foto: {
    id: "constantin_foto",
    giver: "constantin",
    season: "sommer",
    type: "hold_still",
    target: 1,
    label: "Halt still für Constantins Foto",
    rewardGluck: 14,
    rewardMemory: "constantin_foto",
  },

  // --- Herbst ---
  jan_leaves: {
    id: "jan_leaves",
    giver: "jan",
    season: "herbst",
    type: "collect_leaves",
    target: 5,
    label: "Sammle gefallene Blätter",
    dialogue: "jan_leaves",
    rewardGluck: 18,
    rewardMemory: "herbst_blaetter",
  },
  tata_winterbox: {
    id: "tata_winterbox",
    giver: "tata",
    season: "herbst",
    type: "reach_spot",
    target: 1,
    label: "Probier die Winterkiste aus",
    dialogue: "tata_winter",
    rewardGluck: 20,
    rewardMemory: "winterkiste",
  },
};

// The quest a given character offers in a given season (or null).
export function questForGiver(giver, seasonKey) {
  const q = Object.values(QUESTS).find(
    (x) => x.giver === giver && x.season === seasonKey,
  );
  return q ? q.id : null;
}

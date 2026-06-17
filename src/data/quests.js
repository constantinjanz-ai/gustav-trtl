// Quest definitions (data-driven).
export const QUESTS = {
  magda_strawberries: {
    id: "magda_strawberries",
    giver: "magda",
    type: "harvest_strawberries",
    target: 5,
    label: "Sammle Erdbeeren für Magda",
    rewardGluck: 20,
    rewardMemory: "erste_ernte",
  },

  // Maria: find Gustav's favourite pebble hidden in the garden.
  maria_pebble: {
    id: "maria_pebble",
    giver: "maria",
    type: "find_item",
    target: 1,
    label: "Finde Gustavs Lieblingsstein",
    rewardGluck: 18,
    rewardMemory: "lieblingsstein",
  },

  // Tata: try out the basking ramp he built.
  tata_ramp: {
    id: "tata_ramp",
    giver: "tata",
    type: "reach_spot",
    target: 1,
    label: "Probier Tatas Sonnenrampe aus",
    rewardGluck: 16,
    rewardMemory: "sonnenrampe",
  },

  // Jan: munch some dandelions for him.
  jan_loewenzahn: {
    id: "jan_loewenzahn",
    giver: "jan",
    type: "collect_loewenzahn",
    target: 3,
    label: "Friss Löwenzahn für Jan",
    rewardGluck: 16,
    rewardMemory: "loewenzahn",
  },

  // Constantin: hold still for a scrapbook photo.
  constantin_foto: {
    id: "constantin_foto",
    giver: "constantin",
    type: "hold_still",
    target: 1,
    label: "Halt still für Constantins Foto",
    rewardGluck: 14,
    rewardMemory: "constantin_foto",
  },
};

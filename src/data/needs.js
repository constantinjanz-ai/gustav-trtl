// The three gentle needs + Glück. All happy-only: needs drift down slowly and
// are filled by cozy actions; a low need never punishes Gustav, it just nudges
// the player toward a nice thing to do. Values are 0..100.

export const NEEDS = [
  {
    key: "sonne",
    label: "Sonne",
    icon: "☀️",
    color: [255, 206, 74],
    decay: 1.2, // points/sec drift down
    fillRate: 16, // points/sec while basking in the sun zone
  },
  {
    key: "snack",
    label: "Snack",
    icon: "🍓",
    color: [232, 65, 63],
    decay: 1.0,
    fillAmount: 26, // points per strawberry eaten (instant)
  },
  {
    key: "nickerchen",
    label: "Nickerchen",
    icon: "💤",
    color: [184, 139, 214],
    decay: 0.8,
    fillRate: 13, // points/sec while resting (standing still)
    fillRateCozy: 22, // faster when resting on the terrace deck
  },
];

// Glück — the progression currency. Rises gently while Gustav is content and
// in little bumps from happy moments (eating, quests). Caps at 100.
export const GLUCK = {
  label: "Glück",
  icon: "🌸",
  color: [255, 143, 191],
  contentTrickle: 0.35, // points/sec when the average need is high (gentle pacing)
  contentThreshold: 60, // average need above this counts as "content"
  berryBump: 0.8, // per strawberry
};

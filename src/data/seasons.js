// Season framework. The garden LAYOUT (garden.spring.js) stays constant across
// seasons; each season is a "skin" — palette overrides, extra decorative props,
// and gentle gameplay tuning. Progression: Frühling -> Sommer (more later).
import { PALETTE } from "./garden.spring.js";

export const SEASON_ORDER = ["fruehling", "sommer"];

export const SEASONS = {
  fruehling: {
    key: "fruehling",
    label: "Frühling",
    intro: "Der Garten erwacht. Gustav wacht auf.",
    sky: PALETTE.sky, // [173,216,222]
    lawn: PALETTE.lawn, // [123,176,90]
    lawnStripe: PALETTE.lawnStripe,
    sunFillMul: 1,
    berryMax: 6,
    extraProps: [],
  },

  sommer: {
    key: "sommer",
    label: "Sommer",
    intro: "Hochsommer. Erdbeerfeste und Sonnenbäder.",
    sky: [150, 208, 236], // brighter, hazier blue
    lawn: [116, 172, 78], // lusher, warmer green
    lawnStripe: [128, 184, 90],
    sunFillMul: 1.5, // peak Gustav: sunbeam naps fill faster
    berryMax: 10, // strawberry feasts
    extraProps: [
      // ripe figs on the fig trees
      { kind: "fig-ripe", x: 20, y: 64, r: 2.2, color: [120, 60, 110] },
      { kind: "fig-ripe", x: 30, y: 76, r: 2.2, color: [132, 70, 120] },
      { kind: "fig-ripe", x: 392, y: 106, r: 2.2, color: [120, 60, 110] },
      { kind: "fig-ripe", x: 402, y: 118, r: 2.2, color: [132, 70, 120] },
      // sunflowers standing tall in the beds
      { kind: "sunflower", x: 30, y: 120, r: 6, color: [245, 196, 50], solid: true, tag: "sunflower" },
      { kind: "sunflower", x: 448, y: 116, r: 6, color: [245, 196, 50], solid: true, tag: "sunflower" },
      { kind: "sunflower", x: 26, y: 210, r: 5, color: [245, 196, 50], solid: true },
      // extra summer blooms
      { kind: "dahlia", x: 22, y: 168, r: 5, color: [232, 86, 90] },
      { kind: "cosmos", x: 452, y: 168, r: 4, color: [240, 130, 180] },
      { kind: "marigold", x: 32, y: 244, r: 4, color: [244, 168, 56] },
      { kind: "marigold", x: 446, y: 232, r: 4, color: [244, 168, 56] },
    ],
  },
};

export function getSeason(key) {
  return SEASONS[key] || SEASONS.fruehling;
}

export function nextSeason(key) {
  const i = SEASON_ORDER.indexOf(key);
  return i >= 0 && i < SEASON_ORDER.length - 1 ? SEASON_ORDER[i + 1] : null;
}

// Season framework. The garden LAYOUT (garden.spring.js) stays constant across
// seasons; each season is a "skin" — palette overrides, extra decorative props,
// and gentle gameplay tuning. Progression: Frühling -> Sommer (more later).
import { PALETTE } from "./garden.spring.js";

export const SEASON_ORDER = ["fruehling", "sommer", "herbst", "winter"];

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

  herbst: {
    key: "herbst",
    label: "Herbst",
    intro: "Herbst. Bunte Blätter und kuschelige Tage.",
    sky: [206, 196, 176], // warm hazy autumn light
    lawn: [126, 146, 82], // faded, golden-green
    lawnStripe: [138, 158, 92],
    sunFillMul: 1.0,
    berryMax: 3, // the wild strawberries are nearly over
    extraProps: [
      // fallen leaves scattered across the lawn (decoration)
      { kind: "leaf", x: 120, y: 110, r: 3, color: [210, 120, 50] },
      { kind: "leaf", x: 180, y: 170, r: 3, color: [196, 90, 50] },
      { kind: "leaf", x: 250, y: 130, r: 3, color: [226, 168, 60] },
      { kind: "leaf", x: 300, y: 220, r: 3, color: [200, 110, 48] },
      { kind: "leaf", x: 360, y: 160, r: 3, color: [222, 150, 56] },
      { kind: "leaf", x: 150, y: 240, r: 3, color: [188, 96, 52] },
      { kind: "leaf", x: 220, y: 90, r: 3, color: [228, 174, 64] },
      { kind: "leaf", x: 330, y: 250, r: 3, color: [204, 116, 50] },
      // the fig trees turning, late asters
      { kind: "fig-autumn", x: 24, y: 64, r: 3, color: [214, 150, 60] },
      { kind: "fig-autumn", x: 396, y: 108, r: 3, color: [214, 150, 60] },
      { kind: "aster", x: 28, y: 200, r: 4, color: [150, 110, 190] },
      { kind: "aster", x: 452, y: 196, r: 4, color: [150, 110, 190] },
    ],
  },

  winter: {
    key: "winter",
    label: "Winter",
    intro: "Winter. Zeit für einen langen, kuscheligen Schlaf.",
    sky: [214, 226, 238], // pale, cold light
    lawn: [221, 228, 228], // snow-covered
    lawnStripe: [231, 236, 236],
    sunFillMul: 0.6,
    berryMax: 0, // nothing grows now — Gustav sleeps
    extraProps: [
      // snow caps / dollops tucked along the beds
      { kind: "snow", x: 24, y: 70, r: 9, color: [240, 244, 248] },
      { kind: "snow", x: 456, y: 150, r: 10, color: [240, 244, 248] },
      { kind: "snow", x: 26, y: 178, r: 8, color: [240, 244, 248] },
      { kind: "snow", x: 396, y: 112, r: 8, color: [240, 244, 248] },
      { kind: "snow", x: 120, y: 30, r: 7, color: [240, 244, 248] },
      // a frosting of snow on the terrace edge
      { kind: "snow", x: 240, y: 268, w: 380, h: 6, color: [238, 243, 248] },
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

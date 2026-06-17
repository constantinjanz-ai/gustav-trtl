// Frühling garden layout — data-driven, one screen (480x320 logical).
// Coordinate space: (0,0) top-left, y increases downward.
// The garden runs away from the house: HOUSE/TERRACE at the bottom (home base),
// LAWN in the middle, planted BORDERS down the long left/right edges against the
// fence, the STREET GATE at the top. Three-quarter top-down view.
//
// Everything here is plain data so seasons/props stay editable without touching
// scene logic. `solid: true` props get a collision body in the scene builder.

export const GARDEN_W = 480;
export const GARDEN_H = 320;

// Cozy spring palette (kept here so the whole scene reads from one place).
export const PALETTE = {
  sky: [173, 216, 222],
  lawn: [123, 176, 90],
  lawnStripe: [132, 186, 98],
  bed: [92, 64, 38], // bark mulch
  deck: [110, 76, 44], // wood terrace
  deckPlank: [126, 90, 54],
  house: [206, 205, 198],
  houseDoor: [150, 178, 188],
  fence: [58, 62, 66], // anthracite
  gate: [44, 47, 51],
  compost: [34, 36, 38],
};

// Walkable ground zones (painted, no collision). Drawn back-to-front.
export const ZONES = {
  lawn: { x: 40, y: 20, w: 400, h: 250 },
  terrace: { x: 24, y: 270, w: 432, h: 30 },
  leftBed: { x: 10, y: 20, w: 30, h: 250 },
  rightBed: { x: 440, y: 20, w: 30, h: 250 },
};

// Border lanes Gustav patrols (strawberries spawn + grass wears here — Cp C).
export const BORDER_LANES = [
  { x: 40, y: 24, w: 26, h: 242 }, // left lane (lawn-side edge of left bed)
  { x: 414, y: 24, w: 26, h: 242 }, // right lane
];

// The sunny terrace spot where Gustav basks (fills Sonne — Cp C).
export const SUN_ZONE = { x: 150, y: 274, w: 180, h: 24 };

export const GUSTAV_START = { x: 240, y: 232 };

// Structural collision: fence ring (with a gate gap at top centre) + house wall.
export const STRUCTURES = [
  // house wall along the very bottom
  { kind: "house", x: 0, y: 300, w: 480, h: 20, color: PALETTE.house, solid: true },
  // fence: top-left segment, gate gap, top-right segment
  { kind: "fence", x: 0, y: 8, w: 200, h: 10, color: PALETTE.fence, solid: true },
  { kind: "fence", x: 280, y: 8, w: 200, h: 10, color: PALETTE.fence, solid: true },
  { kind: "fence", x: 0, y: 8, w: 10, h: 294, color: PALETTE.fence, solid: true },
  { kind: "fence", x: 470, y: 8, w: 10, h: 294, color: PALETTE.fence, solid: true },
  // the closed gate (the Sommer escape gag opens it later)
  { kind: "gate", x: 200, y: 6, w: 80, h: 12, color: PALETTE.gate, solid: true },
];

// Plants & props. Circles unless w/h given. `solid` ones block Gustav.
// `tag` lets later checkpoints find specific props (e.g. lanterns at dusk).
export const PROPS = [
  // --- big specimen plants in the beds (solid) ---
  { kind: "fig", x: 24, y: 70, r: 17, color: [74, 120, 60], solid: true, tag: "fig-left" },
  { kind: "juniper", x: 456, y: 150, r: 18, color: [96, 138, 120], solid: true },
  { kind: "cherrylaurel", x: 25, y: 150, r: 14, color: [44, 92, 52], solid: true },
  { kind: "cherrylaurel", x: 25, y: 188, r: 14, color: [44, 92, 52], solid: true },
  { kind: "buddleia", x: 455, y: 90, r: 12, color: [150, 110, 180], solid: true },

  // --- bark-mulch island in the lawn (fig + hydrangeas), solid centre ---
  { kind: "bed-island", x: 360, y: 96, w: 74, h: 44, color: PALETTE.bed, solid: false },
  { kind: "fig", x: 396, y: 112, r: 15, color: [74, 120, 60], solid: true, tag: "fig-island" },
  { kind: "hydrangea", x: 372, y: 124, r: 8, color: [228, 232, 240] },
  { kind: "hydrangea", x: 420, y: 122, r: 8, color: [206, 196, 224] },
  { kind: "cosmos", x: 384, y: 132, r: 4, color: [232, 120, 170] },
  { kind: "salvia", x: 410, y: 132, r: 4, color: [120, 80, 170] },

  // --- compost nook (back corner) ---
  { kind: "compost", x: 22, y: 30, w: 22, h: 24, color: PALETTE.compost, solid: true },
  { kind: "grass", x: 44, y: 36, r: 6, color: [120, 150, 80] },
  { kind: "bergenia", x: 20, y: 52, r: 6, color: [90, 140, 70] },

  // --- scattered border flowers (decoration, non-solid) ---
  { kind: "hydrangea", x: 24, y: 116, r: 8, color: [230, 232, 240] },
  { kind: "hydrangea", x: 26, y: 230, r: 8, color: [210, 198, 226] },
  { kind: "rose", x: 14, y: 96, r: 3, color: [228, 96, 120] },
  { kind: "rose", x: 14, y: 210, r: 3, color: [228, 96, 120] },
  { kind: "rose", x: 466, y: 120, r: 3, color: [232, 110, 150] },
  { kind: "dahlia", x: 456, y: 220, r: 5, color: [220, 70, 70] },
  { kind: "marigold", x: 448, y: 250, r: 4, color: [240, 160, 50] },
  { kind: "cosmos", x: 28, y: 256, r: 4, color: [232, 120, 170] },
  { kind: "lavender", x: 450, y: 256, r: 4, color: [150, 120, 200] },
  { kind: "lavender", x: 22, y: 250, r: 4, color: [150, 120, 200] },
  { kind: "spirea", x: 458, y: 188, r: 5, color: [236, 150, 180] },

  // --- terrace props (home base, bottom) ---
  { kind: "pot", x: 44, y: 286, r: 7, color: [60, 130, 140], solid: true }, // teal ceramic
  { kind: "pot", x: 62, y: 290, r: 6, color: [70, 145, 150], solid: true },
  { kind: "pot", x: 78, y: 288, r: 6, color: [176, 96, 64], solid: true }, // terracotta
  { kind: "lavender-pot", x: 44, y: 284, r: 3, color: [150, 120, 200] },
  { kind: "bbq", x: 410, y: 286, w: 22, h: 14, color: [40, 40, 44], solid: true },
  { kind: "gazingball", x: 372, y: 288, r: 6, color: [196, 204, 212], solid: true },
  { kind: "geranium-basket", x: 240, y: 304, r: 6, color: [220, 60, 70] }, // hangs on house
  // rusty heart-shaped stakes — the recurring family motif
  { kind: "heart-stake", x: 120, y: 288, r: 4, color: [150, 80, 60], tag: "heart" },
  { kind: "heart-stake", x: 320, y: 290, r: 4, color: [150, 80, 60], tag: "heart" },
];

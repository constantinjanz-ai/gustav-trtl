// Hand-crafted pixel-art sprites, rendered per-pixel to a tiny offscreen canvas
// (no anti-aliasing) and registered with Kaplay. Drawn small, then crisp-scaled
// up by the engine — proper chunky GBA/DS-era pixel art.
import { CHARACTERS } from "../data/characters.js";

const css = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;
const dark = (c, a) => `rgb(${Math.max(0, c[0] - a)},${Math.max(0, c[1] - a)},${Math.max(0, c[2] - a)})`;

// Render a w×h sprite by calling fn(x,y) -> css color string | null per pixel.
function loadProcSprite(k, name, w, h, fn) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const col = fn(x, y);
      if (col) {
        ctx.fillStyle = col;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  return k.loadSprite(name, c.toDataURL());
}

// --- Gustav: a Hermann's tortoise, three-quarter top-down, facing right ---
const G = {
  out: "#41320f", // dark outline
  rim: "#6f5626", // shell rim / scute borders
  s: "#b18d44", // shell base (golden-tan)
  l: "#c8a655", // shell light
  hi: "#dcc079", // shell highlight (dome top)
  dk: "#6f5226", // dark scute centres
  sk: "#9c8c7a", // skin (greyish-brown)
  skd: "#7d6f5e", // skin shadow
  eye: "#161109",
};

const GW = 30;
const GH = 24;
const CX = 14;
const CY = 12.5;
const RX = 11.5;
const RY = 10;

// dark-centred scutes: one centre + a ring of six (normalised shell coords)
const SCUTES = [[0, -0.05]];
for (let i = 0; i < 6; i++) {
  const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
  SCUTES.push([Math.cos(a) * 0.54, Math.sin(a) * 0.54 - 0.05]);
}

const LEGS = [
  [21, 4.5],
  [21, 20],
  [7, 4.5],
  [7, 20],
];

function gustavPixel(x, y) {
  const nx = (x - CX) / RX;
  const ny = (y - CY) / RY;
  const r2 = nx * nx + ny * ny;

  // shell
  if (r2 <= 1) {
    if (r2 > 0.94) return G.out;
    if (r2 > 0.82) return G.rim;
    // scute pattern (inner area only)
    if (r2 < 0.82) {
      let dmin = 99;
      for (const [sx, sy] of SCUTES) {
        const d = Math.hypot(nx - sx, ny - sy);
        if (d < dmin) dmin = d;
      }
      if (dmin < 0.12) return G.dk;
      if (dmin < 0.17) return G.rim;
    }
    // dome shading (top lighter)
    if (ny < -0.5) return G.hi;
    if (ny < -0.1) return G.l;
    return G.s;
  }

  // head (right)
  const hnx = (x - 25.5) / 4;
  const hny = (y - 12) / 3.2;
  if (hnx * hnx + hny * hny <= 1) {
    if ((x - 26) * (x - 26) + (y - 11) * (y - 11) <= 1.3) return G.eye;
    return hny > 0.35 ? G.skd : G.sk;
  }

  // legs (poking from under the shell)
  for (const [lx, ly] of LEGS) {
    if ((x - lx) * (x - lx) + (y - ly) * (y - ly) <= 6.8) {
      return y > ly ? G.skd : G.sk;
    }
  }

  // little tail (left)
  if ((x - 2.6) * (x - 2.6) + (y - 12.5) * (y - 12.5) <= 3.2) return G.sk;

  return null;
}

// --- Family members: a parametric chibi figure built from the descriptor ---
function npcSpriteDef(id) {
  const sp = CHARACTERS[id].sprite;
  const broad = sp.build === "broad";
  const tall = sp.build === "tall";
  const W = 22;
  const H = tall ? 38 : 34;
  const cx = 11;
  const half = broad ? 7 : tall ? 4 : 5.5;

  const legsBot = H - 1;
  const legTop = H - (tall ? 8 : 6);
  const torsoBot = legTop;
  const torsoTop = 15;
  const cy = 9; // head centre
  const headRx = 5.4;
  const headRy = 6.2;

  const P = {
    skin: css(sp.skin),
    skinSh: dark(sp.skin, 22),
    hair: sp.hair ? css(sp.hair) : null,
    top: css(sp.top),
    topSh: dark(sp.top, 24),
    sleeves: sp.sleeves ? css(sp.sleeves) : css(sp.top),
    hasSleeves: !!sp.sleeves,
    accent: sp.accent ? css(sp.accent) : null,
    legs: "rgb(72,68,78)",
    eye: "rgb(22,17,12)",
    glasses: "rgb(50,38,22)",
    stubble: "rgba(120,98,74,0.55)",
    earring: "rgb(232,188,56)",
    glassesOn: !!sp.glasses,
    stubbleOn: !!sp.stubble,
    earringsOn: !!sp.earrings,
    style: sp.hairStyle,
  };

  const fn = (x, y) => {
    const dx = x - cx;

    // legs (two)
    if (y >= legTop && y <= legsBot && ((x >= 8 && x <= 9) || (x >= 12 && x <= 13))) {
      return P.legs;
    }

    // torso
    if (y >= torsoTop && y <= torsoBot && Math.abs(dx) <= half) {
      if (P.hasSleeves && Math.abs(dx) > half - 2) return P.sleeves;
      if (P.accent && y <= torsoTop + 2) return P.accent;
      if (Math.abs(dx) > half - 1 || y > torsoBot - 2) return P.topSh;
      return P.top;
    }
    // neck
    if (y >= torsoTop - 2 && y < torsoTop && Math.abs(dx) <= 2) return P.skin;

    const inHead = (dx / headRx) ** 2 + ((y - cy) / headRy) ** 2 <= 1;

    // hair: long strands down the sides
    if (P.hair && P.style === "long" && Math.abs(dx) >= headRx - 1 && Math.abs(dx) <= headRx + 1.5 && y >= cy && y <= cy + 13) {
      return P.hair;
    }
    // hair: top + frame
    if (P.hair && P.style !== "bald") {
      const inHalo = (dx / (headRx + 1.2)) ** 2 + ((y - (cy - 0.6)) / (headRy + 1.2)) ** 2 <= 1;
      if (inHalo && (!inHead || y <= cy - 2.5) && y <= cy + 1) return P.hair;
    }

    if (inHead) {
      if (P.stubbleOn && y >= cy + 2 && y <= cy + 4 && Math.abs(dx) <= 3.5) return P.stubble;
      if (P.glassesOn && y === cy - 1 && Math.abs(dx) <= 3) return P.glasses; // brow bar
      if (y === cy && (x === cx - 2 || x === cx + 2)) return P.eye;
      if (y === cy + 3 && Math.abs(dx) <= 1) return P.skinSh; // soft smile
      return P.skin;
    }

    // gold hoop earrings at the head sides
    if (P.earringsOn && Math.abs(Math.abs(dx) - (headRx + 0.5)) < 0.9 && Math.abs(y - (cy + 2)) < 0.9) {
      return P.earring;
    }
    return null;
  };

  return { name: "npc_" + id, w: W, h: H, fn };
}

// --- Plants: greyscale sprites tinted per-plant via Kaplay's color() ---
// (white ~ full tint, darker greys ~ shading, so one sprite serves every hue.)
const grey = (v) => {
  const c = Math.max(80, Math.min(255, Math.round(v)));
  return `rgb(${c},${c},${c})`;
};

// a shaded, lightly-textured leafy clump (16×16)
function bushPixel(x, y) {
  const cx = 7.5;
  const cy = 7.5;
  const dx = x - cx;
  const dy = y - cy;
  const d = Math.hypot(dx, dy);
  if (d > 7.6) return null;
  let v = 244 - d * 3.2 - (dx + dy) * 3.0; // bottom-right shaded, top-left lit
  if (d > 6.9) v -= 28; // rim
  if ((x * 3 + y * 5) % 7 === 0) v -= 26; // leaf flecks
  if ((x * 5 + y * 2) % 9 === 0) v -= 12;
  return grey(v);
}

// a little five/eight-petal bloom (9×9): light petals, slightly darker core
function flowerPixel(x, y) {
  const cx = 4;
  const cy = 4;
  if (Math.hypot(x - cx, y - cy) < 1.4) return grey(170); // core
  const petals = [
    [4, 1.4], [4, 6.6], [1.4, 4], [6.6, 4],
    [2.1, 2.1], [5.9, 2.1], [2.1, 5.9], [5.9, 5.9],
  ];
  for (const [px, py] of petals) {
    if (Math.hypot(x - px, y - py) < 1.45) return grey(252);
  }
  return null;
}

export function loadGameSprites(k) {
  loadProcSprite(k, "gustav", GW, GH, gustavPixel);
  loadProcSprite(k, "bush", 16, 16, bushPixel);
  loadProcSprite(k, "flower", 9, 9, flowerPixel);
  for (const id in CHARACTERS) {
    const d = npcSpriteDef(id);
    loadProcSprite(k, d.name, d.w, d.h, d.fn);
  }
}

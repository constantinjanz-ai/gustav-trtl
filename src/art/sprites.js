// Hand-crafted pixel-art sprites, rendered per-pixel to a tiny offscreen canvas
// (no anti-aliasing) and registered with Kaplay. Drawn small, then crisp-scaled
// up by the engine — proper chunky GBA/DS-era pixel art.

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

export function loadGameSprites(k) {
  loadProcSprite(k, "gustav", GW, GH, gustavPixel);
}

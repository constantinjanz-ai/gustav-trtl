// Characters + their DS-style dialogue portraits (inline SVG, swappable at M5).
// M1 only needs Magda; the others are stubbed for later milestones.

// Magda (Mama): ~50s–60s, shoulder-length brown wavy hair, brown-framed glasses,
// black turtleneck, signature mustard-yellow fringed scarf.
const PORTRAITS = {
  magda: `
  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <rect width="80" height="80" fill="#bfe0c8"/>
    <!-- shoulders / black turtleneck -->
    <rect x="14" y="60" width="52" height="20" fill="#1c1c20"/>
    <!-- mustard fringed scarf -->
    <rect x="20" y="56" width="40" height="10" fill="#e6b422"/>
    <rect x="20" y="66" width="4" height="5" fill="#e6b422"/>
    <rect x="28" y="66" width="4" height="5" fill="#e6b422"/>
    <rect x="36" y="66" width="4" height="5" fill="#e6b422"/>
    <rect x="44" y="66" width="4" height="5" fill="#e6b422"/>
    <rect x="52" y="66" width="4" height="5" fill="#e6b422"/>
    <!-- hair back -->
    <rect x="18" y="14" width="44" height="40" fill="#6b4a2b"/>
    <!-- face -->
    <rect x="26" y="22" width="28" height="30" fill="#f0c9a8"/>
    <!-- wavy fringe -->
    <rect x="24" y="16" width="32" height="9" fill="#7c5733"/>
    <rect x="24" y="25" width="6" height="8" fill="#7c5733"/>
    <rect x="50" y="25" width="6" height="8" fill="#7c5733"/>
    <!-- glasses (brown frames) -->
    <rect x="28" y="33" width="9" height="7" fill="none" stroke="#5a3a1a" stroke-width="2"/>
    <rect x="43" y="33" width="9" height="7" fill="none" stroke="#5a3a1a" stroke-width="2"/>
    <rect x="37" y="35" width="6" height="2" fill="#5a3a1a"/>
    <!-- eyes -->
    <rect x="31" y="35" width="3" height="3" fill="#2a1c12"/>
    <rect x="46" y="35" width="3" height="3" fill="#2a1c12"/>
    <!-- warm smile -->
    <rect x="34" y="45" width="12" height="2" fill="#b56a52"/>
    <rect x="32" y="43" width="2" height="2" fill="#b56a52"/>
    <rect x="46" y="43" width="2" height="2" fill="#b56a52"/>
  </svg>`,
};

export const CHARACTERS = {
  magda: {
    id: "magda",
    name: "Magda",
    portrait: PORTRAITS.magda,
    // where she stands on the terrace (logical coords)
    spawn: { x: 312, y: 284 },
  },
};

export function portraitSVG(id) {
  return PORTRAITS[id] || "";
}

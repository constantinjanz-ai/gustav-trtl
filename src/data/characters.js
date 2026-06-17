// Characters: DS-style dialogue portraits (inline SVG) + world-sprite
// descriptors (the generic builder in entities/npc.js draws from these) +
// where/when they appear. Swapped for pixel art at M5.

const PORTRAITS = {
  // Magda (Mama): brown wavy hair, brown glasses, black turtleneck, mustard scarf
  magda: `
  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <rect width="80" height="80" fill="#bfe0c8"/>
    <rect x="14" y="60" width="52" height="20" fill="#1c1c20"/>
    <rect x="20" y="56" width="40" height="10" fill="#e6b422"/>
    <rect x="20" y="66" width="4" height="5" fill="#e6b422"/><rect x="28" y="66" width="4" height="5" fill="#e6b422"/>
    <rect x="36" y="66" width="4" height="5" fill="#e6b422"/><rect x="44" y="66" width="4" height="5" fill="#e6b422"/>
    <rect x="52" y="66" width="4" height="5" fill="#e6b422"/>
    <rect x="18" y="14" width="44" height="40" fill="#6b4a2b"/>
    <rect x="26" y="22" width="28" height="30" fill="#f0c9a8"/>
    <rect x="24" y="16" width="32" height="9" fill="#7c5733"/>
    <rect x="24" y="25" width="6" height="8" fill="#7c5733"/><rect x="50" y="25" width="6" height="8" fill="#7c5733"/>
    <rect x="28" y="33" width="9" height="7" fill="none" stroke="#5a3a1a" stroke-width="2"/>
    <rect x="43" y="33" width="9" height="7" fill="none" stroke="#5a3a1a" stroke-width="2"/>
    <rect x="37" y="35" width="6" height="2" fill="#5a3a1a"/>
    <rect x="31" y="35" width="3" height="3" fill="#2a1c12"/><rect x="46" y="35" width="3" height="3" fill="#2a1c12"/>
    <rect x="34" y="45" width="12" height="2" fill="#b56a52"/>
    <rect x="32" y="43" width="2" height="2" fill="#b56a52"/><rect x="46" y="43" width="2" height="2" fill="#b56a52"/>
  </svg>`,

  // Maria: long mid-blonde hair, blue eyes, fair skin, gold hoops, cherry-red top
  maria: `
  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <rect width="80" height="80" fill="#cfe6d6"/>
    <rect x="14" y="62" width="52" height="18" fill="#c8283a"/>
    <!-- long hair behind -->
    <rect x="16" y="16" width="48" height="58" fill="#e1c878"/>
    <!-- face -->
    <rect x="27" y="22" width="26" height="30" fill="#f5d6bd"/>
    <!-- fringe -->
    <rect x="25" y="16" width="30" height="9" fill="#ecd182"/>
    <!-- gold hoop earrings -->
    <rect x="23" y="40" width="3" height="3" fill="#e6b422"/><rect x="54" y="40" width="3" height="3" fill="#e6b422"/>
    <!-- blue eyes -->
    <rect x="32" y="34" width="3" height="3" fill="#3a6ea5"/><rect x="45" y="34" width="3" height="3" fill="#3a6ea5"/>
    <!-- smile -->
    <rect x="35" y="45" width="10" height="2" fill="#c56a58"/>
    <rect x="33" y="43" width="2" height="2" fill="#c56a58"/><rect x="45" y="43" width="2" height="2" fill="#c56a58"/>
  </svg>`,

  // Tata (Papa): tall, broad, bald, warm smile
  tata: `
  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <rect width="80" height="80" fill="#d8e0ea"/>
    <!-- broad shoulders / shirt -->
    <rect x="8" y="58" width="64" height="22" fill="#5b7fa6"/>
    <!-- bald head -->
    <rect x="26" y="18" width="28" height="34" fill="#e9c2a0"/>
    <rect x="28" y="14" width="24" height="8" fill="#e9c2a0"/>
    <!-- shine -->
    <rect x="32" y="18" width="6" height="3" fill="#f2d2b6"/>
    <!-- friendly eyes + brows -->
    <rect x="32" y="32" width="3" height="3" fill="#3a2a1a"/><rect x="45" y="32" width="3" height="3" fill="#3a2a1a"/>
    <rect x="31" y="29" width="6" height="2" fill="#9c8f80"/><rect x="43" y="29" width="6" height="2" fill="#9c8f80"/>
    <!-- big warm smile -->
    <rect x="33" y="44" width="14" height="2" fill="#b56a52"/>
    <rect x="31" y="42" width="2" height="2" fill="#b56a52"/><rect x="47" y="42" width="2" height="2" fill="#b56a52"/>
  </svg>`,

  // Jan (brother ~28): tall, round, brown-dark hair
  jan: `
  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <rect width="80" height="80" fill="#d6e2cf"/>
    <rect x="10" y="58" width="60" height="22" fill="#3f7048"/>
    <!-- round face -->
    <rect x="24" y="20" width="32" height="32" fill="#ecc4a2"/>
    <!-- dark-brown short hair -->
    <rect x="22" y="14" width="36" height="11" fill="#4a3522"/>
    <rect x="22" y="22" width="5" height="8" fill="#4a3522"/><rect x="53" y="22" width="5" height="8" fill="#4a3522"/>
    <rect x="32" y="33" width="3" height="3" fill="#2a1c12"/><rect x="45" y="33" width="3" height="3" fill="#2a1c12"/>
    <rect x="34" y="44" width="12" height="2" fill="#b56a52"/>
    <rect x="32" y="42" width="2" height="2" fill="#b56a52"/><rect x="46" y="42" width="2" height="2" fill="#b56a52"/>
  </svg>`,

  // Constantin (the player's in-world self): brown wavy hair, glasses, stubble,
  // gold chain, green-and-yellow varsity jacket
  constantin: `
  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <rect width="80" height="80" fill="#cfe0e6"/>
    <!-- varsity jacket: green body, yellow collar/trim -->
    <rect x="12" y="58" width="56" height="22" fill="#2f7d4f"/>
    <rect x="12" y="58" width="56" height="4" fill="#e8c33a"/>
    <rect x="36" y="58" width="8" height="22" fill="#e8c33a"/>
    <!-- gold chain -->
    <rect x="34" y="54" width="12" height="2" fill="#e8c33a"/>
    <!-- face -->
    <rect x="26" y="20" width="28" height="32" fill="#e7bd97"/>
    <!-- stubble -->
    <rect x="27" y="46" width="26" height="4" fill="#b89a78"/>
    <!-- brown wavy hair -->
    <rect x="24" y="14" width="32" height="11" fill="#6b4a2b"/>
    <rect x="24" y="22" width="6" height="6" fill="#6b4a2b"/><rect x="50" y="22" width="6" height="6" fill="#6b4a2b"/>
    <!-- glasses -->
    <rect x="28" y="32" width="9" height="7" fill="none" stroke="#3a2a18" stroke-width="2"/>
    <rect x="43" y="32" width="9" height="7" fill="none" stroke="#3a2a18" stroke-width="2"/>
    <rect x="37" y="34" width="6" height="2" fill="#3a2a18"/>
    <rect x="31" y="34" width="3" height="3" fill="#2a1c12"/><rect x="46" y="34" width="3" height="3" fill="#2a1c12"/>
    <rect x="35" y="44" width="10" height="2" fill="#a85f4c"/>
  </svg>`,
};

export const CHARACTERS = {
  magda: {
    id: "magda",
    name: "Magda",
    portrait: PORTRAITS.magda,
    appearsFrom: "fruehling",
    spawn: { x: 256, y: 284 },
    sprite: {
      skin: [240, 201, 168], hair: [107, 74, 43], hairStyle: "wavy",
      top: [28, 28, 32], accent: [230, 180, 34], glasses: true, build: "normal",
    },
  },
  maria: {
    id: "maria",
    name: "Maria",
    portrait: PORTRAITS.maria,
    appearsFrom: "sommer",
    spawn: { x: 336, y: 286 },
    sprite: {
      skin: [245, 214, 189], hair: [225, 200, 120], hairStyle: "long",
      top: [200, 40, 58], earrings: true, build: "normal",
    },
  },
  tata: {
    id: "tata",
    name: "Tata",
    portrait: PORTRAITS.tata,
    appearsFrom: "sommer",
    spawn: { x: 96, y: 286 },
    sprite: {
      skin: [233, 194, 160], hairStyle: "bald",
      top: [91, 127, 166], build: "broad",
    },
  },
  constantin: {
    id: "constantin",
    name: "Constantin",
    portrait: PORTRAITS.constantin,
    appearsFrom: "sommer",
    spawn: { x: 176, y: 286 },
    sprite: {
      skin: [231, 189, 151], hair: [107, 74, 43], hairStyle: "wavy",
      top: [47, 125, 79], accent: [232, 195, 58], glasses: true, build: "normal",
    },
  },
  jan: {
    id: "jan",
    name: "Jan",
    portrait: PORTRAITS.jan,
    appearsFrom: "sommer",
    spawn: { x: 416, y: 286 },
    sprite: {
      skin: [236, 196, 162], hair: [74, 53, 34], hairStyle: "short",
      top: [63, 112, 72], build: "broad",
    },
  },
};

export function portraitSVG(id) {
  return CHARACTERS[id]?.portrait || "";
}

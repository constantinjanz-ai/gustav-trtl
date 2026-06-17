// Erinnerungen (scrapbook) entries — the emotional centerpiece. Each has an
// emoji placeholder now; `photo` slots get real Gustav photos at M5.
export const MEMORIES = [
  {
    id: "erste_ernte",
    title: "Die erste Ernte",
    caption: "Gustav sammelt mit Magda die ersten wilden Erdbeeren am Zaun.",
    icon: "🍓",
    photo: null, // TODO(M5): assets/reference/<photo>.jpg
  },
  {
    id: "erste_teezeit",
    title: "Die erste Teezeit",
    caption: "Die Lampions gehen an, die Familie kommt zusammen — und Gustav mittendrin.",
    icon: "🍵",
    photo: null, // TODO(M5)
  },
  {
    id: "lieblingsstein",
    title: "Der Lieblingsstein",
    caption: "Gustav findet seinen glatten, warmen Lieblingsstein wieder — Maria strahlt.",
    icon: "🪨",
    photo: null, // TODO(M5)
  },
  {
    id: "sonnenrampe",
    title: "Tatas Sonnenrampe",
    caption: "Tata baut eine Rampe, und Gustav thront in der schönsten Sonnenecke.",
    icon: "☀️",
    photo: null, // TODO(M5)
  },
  {
    id: "loewenzahn",
    title: "Löwenzahn-Festmahl",
    caption: "Jan zeigt Gustav die besten Löwenzahn-Blüten im Rasen. Schmatz!",
    icon: "🌼",
    photo: null, // TODO(M5)
  },
  {
    id: "constantin_foto",
    title: "Das erste Foto",
    caption: "Constantin lernt von Gustav — und knipst das schönste Schildkröten-Porträt.",
    icon: "📸",
    photo: null, // TODO(M5): a real photo of Gustav fits perfectly here
  },
  {
    id: "ausreisser",
    title: "Der kleine Ausreißer",
    caption: "Das Tor stand offen! Gustav machte sich davon — die Familie fing ihn lachend wieder ein.",
    icon: "🚪",
    photo: null, // TODO(M5)
  },
  {
    id: "herbst_blaetter",
    title: "Buntes Herbstlaub",
    caption: "Gustav raschelt durchs bunte Laub und sammelt mit Jan die schönsten Blätter.",
    icon: "🍂",
    photo: null, // TODO(M5)
  },
  {
    id: "winterkiste",
    title: "Die Winterkiste",
    caption: "Tata zimmert eine kuschelige, mit Laub gepolsterte Kiste — bald wird geschlafen.",
    icon: "📦",
    photo: null, // TODO(M5)
  },
  {
    id: "winterschlaf",
    title: "Gute Nacht, Gustav",
    caption: "Die Familie deckt Gustav warm zu, Schnee fällt leise — und im Frühling ist er wieder da.",
    icon: "❄️",
    photo: null, // TODO(M5)
  },
];

export function getMemory(id) {
  return MEMORIES.find((m) => m.id === id);
}

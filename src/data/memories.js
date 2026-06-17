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
];

export function getMemory(id) {
  return MEMORIES.find((m) => m.id === id);
}

// Real-photo pipeline for the Erinnerungen scrapbook.
//
// Drop a photo into assets/reference/ named after a memory (see memories.js
// `photo` field), e.g. "erste-ernte.jpg". It is picked up automatically here —
// no code changes needed — and shown on that memory's card. Until then, the
// card shows its emoji placeholder.
//
// Vite statically bundles whatever matches this glob (dev + production build).
const modules = import.meta.glob(
  "../../assets/reference/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  { eager: true, query: "?url", import: "default" },
);

const byName = {};
for (const path in modules) {
  const base = path.split("/").pop().replace(/\.[^.]+$/, "").toLowerCase();
  byName[base] = modules[path];
}

// Resolve a memory's photo name to a bundled URL, or null if not present.
export function resolvePhoto(name) {
  if (!name) return null;
  return byName[name.toLowerCase()] || null;
}

export function hasAnyPhotos() {
  return Object.keys(byName).length > 0;
}

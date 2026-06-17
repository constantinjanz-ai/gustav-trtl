// Erinnerungen — the scrapbook album. Shows unlocked memories as cards and
// still-locked ones as mystery slots. Photo slots are placeholders for M5.
import STRINGS from "../data/strings.de.js";
import { MEMORIES } from "../data/memories.js";
import { resolvePhoto } from "../data/photos.js";
import { uiRoot, makeModal, makeButton } from "./overlay.js";
import { setUiBusy } from "./overlay.js";
import { sfx } from "../systems/audio.js";

export function openScrapbook(state) {
  setUiBusy(true);
  const unlocked = new Set(state.memories || []);
  const { backdrop, panel, close } = makeModal(STRINGS.memories);

  const grid = document.createElement("div");
  grid.className = "gg-album";

  for (const m of MEMORIES) {
    const card = document.createElement("div");
    if (unlocked.has(m.id)) {
      const url = resolvePhoto(m.photo);
      const inner = url
        ? `<img class="gg-mem-img" src="${url}" alt="${m.title}" />`
        : m.icon;
      card.className = "gg-mem";
      card.innerHTML = `
        <div class="gg-mem-photo">${inner}</div>
        <div class="gg-mem-title">${m.title}</div>
        <div class="gg-mem-cap">${m.caption}</div>`;
    } else {
      card.className = "gg-mem gg-mem--locked";
      card.innerHTML = `
        <div class="gg-mem-photo">❔</div>
        <div class="gg-mem-title">Noch verborgen</div>
        <div class="gg-mem-cap">Erlebe mehr im Garten …</div>`;
    }
    grid.appendChild(card);
  }
  panel.appendChild(grid);

  const closeBtn = makeButton(STRINGS.menu.back, {
    onClick: () => {
      sfx("back");
      close();
      setUiBusy(false);
    },
  });
  const actions = document.createElement("div");
  actions.style.cssText = "display:flex;justify-content:center;margin-top:14px;";
  actions.appendChild(closeBtn);
  panel.appendChild(actions);

  uiRoot.appendChild(backdrop);
}

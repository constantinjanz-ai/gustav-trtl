// Season chapter card — a brief retro title flourish shown when a season begins.
// Resolves when it finishes (or the player clicks to skip).
import { uiRoot, setUiBusy } from "./overlay.js";
import { sfx } from "../systems/audio.js";

export function showChapterCard(season) {
  return new Promise((resolve) => {
    setUiBusy(true);
    sfx("confirm");

    const card = document.createElement("div");
    card.className = "gg-chapter";
    card.innerHTML = `
      <div class="gg-chapter-inner">
        <div class="gg-chapter-label">${season.label}</div>
        <div class="gg-chapter-sub">${season.intro || ""}</div>
      </div>`;
    uiRoot.appendChild(card);

    let done = false;
    function finish() {
      if (done) return;
      done = true;
      card.classList.add("is-out");
      setTimeout(() => {
        card.remove();
        setUiBusy(false);
        resolve();
      }, 450);
    }

    card.addEventListener("click", finish);
    // auto-dismiss after the hold
    setTimeout(finish, 2600);
  });
}

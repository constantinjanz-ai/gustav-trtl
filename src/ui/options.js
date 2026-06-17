// Optionen panel — music/sound toggles + reset save.
import STRINGS from "../data/strings.de.js";
import {
  uiRoot,
  makeModal,
  makeButton,
  makeToggle,
  toast,
} from "./overlay.js";
import {
  isMusicOn,
  isSoundOn,
  setMusic,
  setSound,
  sfx,
} from "../systems/audio.js";
import { hasSave, clearSave } from "../systems/save.js";

export function openOptions() {
  const o = STRINGS.options;
  const { backdrop, panel, close } = makeModal(o.heading);

  const musicRow = document.createElement("div");
  musicRow.className = "gg-row";
  musicRow.append(
    labelSpan(o.music),
    makeToggle(isMusicOn(), o.on, o.off, (on) => setMusic(on)),
  );

  const soundRow = document.createElement("div");
  soundRow.className = "gg-row";
  soundRow.append(
    labelSpan(o.sound),
    makeToggle(isSoundOn(), o.on, o.off, (on) => setSound(on)),
  );

  panel.append(musicRow, soundRow);

  // Reset save (only meaningful if a save exists).
  const resetBtn = makeButton(o.reset, {
    wood: true,
    onClick: () => {
      if (window.confirm(o.resetConfirm)) {
        clearSave();
        toast(STRINGS.menu.saved);
      }
    },
  });
  if (!hasSave()) resetBtn.classList.add("is-disabled");

  const closeBtn = makeButton(STRINGS.menu.back, {
    onClick: () => {
      sfx("back");
      close();
    },
  });

  const actions = document.createElement("div");
  actions.style.marginTop = "16px";
  actions.style.display = "flex";
  actions.style.flexDirection = "column";
  actions.style.alignItems = "center";
  actions.append(resetBtn, closeBtn);
  panel.appendChild(actions);

  uiRoot.appendChild(backdrop);
}

function labelSpan(text) {
  const s = document.createElement("span");
  s.textContent = text;
  return s;
}

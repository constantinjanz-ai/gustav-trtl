// JRPG dialogue box: DS-style portrait, name plate, typewriter text reveal,
// blinking ▼ continue arrow. Advance with Space/Enter or click.
// showDialogue(lines) resolves once the player dismisses the last line.
import { uiRoot, setUiBusy } from "./overlay.js";
import { sfx } from "../systems/audio.js";

const CHARS_PER_SEC = 48;

export function showDialogue(lines) {
  return new Promise((resolve) => {
    setUiBusy(true);

    const box = document.createElement("div");
    box.className = "gg-dialogue";
    box.innerHTML = `
      <div class="gg-dia-portrait"></div>
      <div class="gg-dia-body">
        <div class="gg-dia-name"></div>
        <div class="gg-dia-text"></div>
        <div class="gg-dia-arrow">▼</div>
      </div>`;
    const portraitEl = box.querySelector(".gg-dia-portrait");
    const nameEl = box.querySelector(".gg-dia-name");
    const textEl = box.querySelector(".gg-dia-text");
    const arrowEl = box.querySelector(".gg-dia-arrow");
    uiRoot.appendChild(box);

    let i = 0;
    let typing = false;
    let typer = null;

    function renderLine() {
      const ln = lines[i];
      nameEl.textContent = ln.name || "";
      portraitEl.innerHTML = ln.portrait || "";
      textEl.textContent = "";
      arrowEl.style.opacity = "0";
      typing = true;
      let c = 0;
      const full = ln.text;
      clearInterval(typer);
      typer = setInterval(() => {
        c++;
        textEl.textContent = full.slice(0, c);
        if (c >= full.length) {
          clearInterval(typer);
          typing = false;
          arrowEl.style.opacity = "1";
        }
      }, 1000 / CHARS_PER_SEC);
    }

    function advance() {
      if (typing) {
        // reveal the rest immediately
        clearInterval(typer);
        textEl.textContent = lines[i].text;
        typing = false;
        arrowEl.style.opacity = "1";
        return;
      }
      sfx("click");
      i++;
      if (i >= lines.length) {
        cleanup();
        resolve();
        return;
      }
      renderLine();
    }

    function onKey(e) {
      if (e.repeat) return;
      if (e.code === "Space" || e.code === "Enter" || e.key === " ") {
        e.preventDefault();
        advance();
      }
    }
    function onClick() {
      advance();
    }
    function cleanup() {
      window.removeEventListener("keydown", onKey);
      box.removeEventListener("click", onClick);
      box.remove();
      setUiBusy(false);
    }

    window.addEventListener("keydown", onKey);
    box.addEventListener("click", onClick);
    renderLine();
  });
}

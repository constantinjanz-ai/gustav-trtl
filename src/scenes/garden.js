// Frühling garden scene.
// CHECKPOINT A: placeholder only — confirms scene routing works.
// CHECKPOINT B will build the real one-screen garden + Gustav here.
import k, { GAME_WIDTH, GAME_HEIGHT } from "../config/kaplay.js";
import STRINGS from "../data/strings.de.js";
import { clearOverlay, uiRoot, makeButton } from "../ui/overlay.js";

export function registerGardenScene() {
  k.scene("garden", () => {
    clearOverlay();

    // simple grassy placeholder
    k.add([k.rect(GAME_WIDTH, GAME_HEIGHT), k.pos(0, 0), k.color(123, 176, 90)]);
    k.add([
      k.text(STRINGS.seasons.fruehling, { font: "monospace", size: 24 }),
      k.pos(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20),
      k.anchor("center"),
      k.color(40, 60, 30),
    ]);
    k.add([
      k.text("(Garten kommt in Checkpoint B)", { font: "monospace", size: 12 }),
      k.pos(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 14),
      k.anchor("center"),
      k.color(40, 60, 30),
    ]);

    // a quick way back to the title while scaffolding
    const back = makeButton(STRINGS.menu.back, {
      wood: true,
      onClick: () => k.go("title"),
    });
    back.style.position = "absolute";
    back.style.left = "16px";
    back.style.top = "16px";
    back.style.minWidth = "120px";
    uiRoot.appendChild(back);
  });
}

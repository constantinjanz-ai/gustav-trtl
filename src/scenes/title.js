// Title screen: a gentle looping garden backdrop drawn on the Kaplay canvas,
// with the glossy Web 2.0 menu mounted as an HTML overlay on top.
import k, { GAME_WIDTH, GAME_HEIGHT } from "../config/kaplay.js";
import STRINGS from "../data/strings.de.js";
import { clearOverlay, uiRoot, makeButton } from "../ui/overlay.js";
import { openOptions } from "../ui/options.js";
import { startAudio, setMusicMood } from "../systems/audio.js";
import { hasSave, newGame, loadGame } from "../systems/save.js";

export function registerTitleScene() {
  k.scene("title", () => {
    buildBackdrop();
    buildMenu();
  });
}

function buildBackdrop() {
  const W = GAME_WIDTH;
  const H = GAME_HEIGHT;

  // reset the sky + music to the bright theme (garden may have changed them)
  k.setBackground(k.rgb(173, 216, 222));
  setMusicMood("fruehling");

  // soft sun
  k.add([
    k.circle(34),
    k.pos(W - 70, 64),
    k.color(255, 226, 120),
    k.opacity(0.9),
    k.z(1),
  ]);
  k.add([
    k.circle(44),
    k.pos(W - 70, 64),
    k.color(255, 240, 170),
    k.opacity(0.35),
    k.z(0),
  ]);

  // drifting clouds
  for (let i = 0; i < 4; i++) {
    const cloud = k.add([
      k.rect(60, 22, { radius: 11 }),
      k.pos(k.rand(0, W), k.rand(30, 130)),
      k.color(255, 255, 255),
      k.opacity(0.85),
      k.z(2),
      "cloud",
      { speed: k.rand(6, 14) },
    ]);
    cloud.onUpdate(() => {
      cloud.pos.x += cloud.speed * k.dt();
      if (cloud.pos.x > W + 40) cloud.pos.x = -70;
    });
  }

  // grass band along the bottom (the garden)
  k.add([k.rect(W, 130), k.pos(0, H - 130), k.color(123, 176, 90), k.z(3)]);
  k.add([
    k.rect(W, 14),
    k.pos(0, H - 130),
    k.color(150, 198, 110),
    k.opacity(0.7),
    k.z(4),
  ]);

  // a little Gustav waddling across the lawn (the real pixel sprite)
  const gus = k.add([
    k.pos(40, H - 46),
    k.anchor("center"),
    k.z(6),
    { t: 0, speed: 16, dir: 1 },
  ]);
  gus.add([k.sprite("gustav"), k.anchor("center")]);
  gus.onUpdate(() => {
    gus.t += k.dt();
    gus.pos.x += gus.speed * gus.dir * k.dt();
    gus.pos.y = H - 46 + Math.sin(gus.t * 6) * 1.5; // waddle bob
    if (gus.pos.x > W - 30) gus.dir = -1;
    if (gus.pos.x < 30) gus.dir = 1;
    gus.scale = k.vec2(gus.dir, 1);
  });
}

function buildMenu() {
  clearOverlay();

  const screen = document.createElement("div");
  screen.className = "title-screen";

  const logo = document.createElement("h1");
  logo.className = "title-logo";
  logo.textContent = STRINGS.title;

  const subtitle = document.createElement("p");
  subtitle.className = "title-subtitle";
  subtitle.textContent = STRINGS.subtitle;

  const buttons = document.createElement("div");
  buttons.className = "title-buttons";

  const playBtn = makeButton(STRINGS.menu.play, {
    onClick: () => {
      startAudio();
      newGame();
      k.go("garden");
    },
  });

  const continueBtn = makeButton(STRINGS.menu.continue, {
    wood: true,
    disabled: !hasSave(),
    onClick: () => {
      startAudio();
      loadGame();
      k.go("garden");
    },
  });

  const optionsBtn = makeButton(STRINGS.menu.options, {
    wood: true,
    onClick: () => {
      startAudio();
      openOptions();
    },
  });

  buttons.append(playBtn, continueBtn, optionsBtn);
  screen.append(logo, subtitle, buttons);

  const credit = document.createElement("div");
  credit.className = "title-credit";
  credit.textContent = "für Maria & Gustav 🐢";

  uiRoot.append(screen, credit);
}

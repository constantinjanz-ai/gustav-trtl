// Frühling garden scene — the one-screen play space.
// Builds the world from data/garden.spring.js (zones, structures, props),
// wires collisions, and spawns Gustav. Needs/strawberries/worn-path/quest come
// in later checkpoints; this is the world + movement foundation.
import k from "../config/kaplay.js";
import STRINGS from "../data/strings.de.js";
import {
  GARDEN_W,
  GARDEN_H,
  PALETTE,
  ZONES,
  STRUCTURES,
  PROPS,
  GUSTAV_START,
} from "../data/garden.spring.js";
import { spawnGustav } from "../entities/gustav.js";
import { spawnMagda } from "../entities/npc.js";
import { clearOverlay, uiRoot, makeButton, toast, isUiBusy } from "../ui/overlay.js";
import { getState, saveGame } from "../systems/save.js";
import { createNeeds } from "../systems/needs.js";
import { createStrawberries } from "../systems/strawberries.js";
import { createWornPath } from "../systems/wornPath.js";
import { createQuests } from "../systems/quests.js";
import { createHud } from "../ui/hud.js";
import { showDialogue } from "../ui/dialogue.js";
import { openScrapbook } from "../ui/scrapbook.js";
import { playTeezeit } from "../ui/teezeit.js";
import { CHARACTERS } from "../data/characters.js";
import { magdaDialogue } from "../data/dialogue.js";
import { getSeason, nextSeason } from "../data/seasons.js";
import { showChapterCard } from "../ui/chapterCard.js";

const TALK_DIST = 30;
const TEEZEIT_GLUCK = 40;

export function registerGardenScene() {
  k.scene("garden", () => {
    clearOverlay();

    const state = getState();

    // Chapter progression: once the Frühling Teezeit is done, the garden moves
    // into Sommer (also lifts older saves into the new content on entry).
    if (state.flags?.teezeitSeen && state.season === "fruehling") {
      state.flags.fruehling_seen = true; // don't replay the Frühling card
      state.season = "sommer";
    }
    const season = getSeason(state.season);

    // apply the season skin
    k.setBackground(k.rgb(...season.sky));
    buildGround(season);
    buildStructures();
    buildProps(season);

    // chapter card the first time a season is entered
    state.flags = state.flags || {};
    const seenKey = "season_" + season.key + "_seen";
    if (!state.flags[seenKey]) {
      state.flags[seenKey] = true;
      showChapterCard(season);
    }

    // worn path renders under Gustav, so build it before he spawns
    const worn = createWornPath(k, state);

    const start = state.gustav?.x != null ? state.gustav : GUSTAV_START;
    const gustav = spawnGustav(k, start);

    // Magda on the terrace
    const magda = spawnMagda(k, CHARACTERS.magda.spawn);

    // systems
    const needs = createNeeds(k, state, { sunFillMul: season.sunFillMul });
    const quests = createQuests(state);
    const hud = createHud(state);
    const straw = createStrawberries(k, state, {
      max: season.berryMax,
      onEat: () => {
        needs.eatSnack();
        const readyId = quests.onBerryEaten();
        if (readyId) hud.pop(STRINGS.pops.questDone);
      },
    });

    // ---- interaction: talk to Magda with [Space] when close ----
    const prompt = makePrompt();

    k.onKeyPress("space", () => {
      if (isUiBusy()) return;
      if (gustav.pos.dist(magda.pos) <= TALK_DIST) talkToMagda();
    });

    async function talkToMagda() {
      const q = quests.get("magda_strawberries");
      await showDialogue(
        magdaDialogue(q.state, q.progress, quests.QUESTS.magda_strawberries.target),
      );
      if (q.state === "none") {
        quests.start("magda_strawberries");
      } else if (q.state === "ready") {
        const def = quests.complete("magda_strawberries");
        if (def) {
          needs.addGluck(def.rewardGluck);
          unlockMemory(def.rewardMemory);
          autosave();
        }
      }
    }

    function unlockMemory(id) {
      state.memories = state.memories || [];
      if (id && !state.memories.includes(id)) {
        state.memories.push(id);
        hud.pop(STRINGS.pops.newMemory);
      }
    }

    function autosave() {
      saveGame();
    }

    // ---- main update loop ----
    let teezeitPlaying = false;
    k.onUpdate(() => {
      needs.update(gustav);
      straw.update(gustav);
      worn.update(gustav);
      hud.update(state);
      hud.setTask(quests.activeLabel());
      state.gustav = { x: Math.round(gustav.pos.x), y: Math.round(gustav.pos.y) };

      // proximity prompt
      const near = !isUiBusy() && gustav.pos.dist(magda.pos) <= TALK_DIST;
      prompt.style.opacity = near ? "1" : "0";

      // Teezeit when Glück first crosses the threshold; ends the Frühling
      // chapter and slides into Sommer.
      if (!teezeitPlaying && !state.flags?.teezeitSeen && state.gluck >= TEEZEIT_GLUCK) {
        teezeitPlaying = true;
        playTeezeit(k, state).then(() => {
          hud.pop(STRINGS.pops.newMemory);
          const upcoming = nextSeason(state.season);
          autosave();
          if (upcoming) {
            // rebuild the scene in the next season (shows its chapter card)
            k.wait(0.6, () => k.go("garden"));
          }
        });
      }
    });

    buildDevNav(state);
  });
}

function makePrompt() {
  const el = document.createElement("div");
  el.className = "gg-prompt";
  el.textContent = STRINGS.prompts.talk;
  el.style.opacity = "0";
  uiRoot.appendChild(el);
  return el;
}

function buildGround(season) {
  // lawn covers the whole ground
  k.add([k.rect(GARDEN_W, GARDEN_H), k.pos(0, 0), k.color(...season.lawn), k.z(0)]);

  // faint mowing stripes
  for (let i = 0; i < 6; i++) {
    k.add([
      k.rect(GARDEN_W, 18),
      k.pos(0, 30 + i * 38),
      k.color(...season.lawnStripe),
      k.opacity(0.5),
      k.z(1),
    ]);
  }

  // planted beds (bark mulch) down the long borders
  for (const b of [ZONES.leftBed, ZONES.rightBed]) {
    k.add([k.rect(b.w, b.h), k.pos(b.x, b.y), k.color(...PALETTE.bed), k.opacity(0.85), k.z(2)]);
  }

  // wood terrace deck along the house
  const t = ZONES.terrace;
  k.add([k.rect(t.w, t.h), k.pos(t.x, t.y), k.color(...PALETTE.deck), k.z(3)]);
  for (let i = 0; i < 8; i++) {
    k.add([
      k.rect(t.w, 1.5),
      k.pos(t.x, t.y + 3 + i * 3.6),
      k.color(...PALETTE.deckPlank),
      k.opacity(0.5),
      k.z(4),
    ]);
  }
}

function buildStructures() {
  for (const s of STRUCTURES) {
    const obj = k.add([
      k.rect(s.w, s.h),
      k.pos(s.x, s.y),
      k.color(...s.color),
      k.z(s.kind === "house" ? 5 : 6),
      s.kind,
    ]);
    if (s.solid) obj.use(k.area()), obj.use(k.body({ isStatic: true }));
  }

  // a hint of patio doors on the house wall
  for (let i = 0; i < 3; i++) {
    k.add([
      k.rect(70, 14),
      k.pos(70 + i * 130, 302),
      k.color(...PALETTE.houseDoor),
      k.opacity(0.9),
      k.z(6),
    ]);
  }
}

function buildProps(season) {
  const props = [...PROPS, ...(season.extraProps || [])];
  for (const p of props) {
    const comps = [k.pos(p.x, p.y), k.anchor("center"), k.color(...p.color), k.z(5), p.kind];
    if (p.r != null) {
      comps.unshift(k.circle(p.r));
    } else {
      comps.unshift(k.rect(p.w, p.h, { radius: 3 }));
    }
    if (p.tag) comps.push(p.tag);
    const obj = k.add(comps);
    if (p.solid) {
      obj.use(k.area({ scale: 0.8 })); // slightly forgiving collision
      obj.use(k.body({ isStatic: true }));
    }
  }
}

function buildDevNav(state) {
  // top-left button stack
  const bar = document.createElement("div");
  bar.className = "gg-topbar";

  bar.appendChild(
    makeButton(STRINGS.memories, {
      wood: true,
      onClick: () => openScrapbook(state),
    }),
  );
  bar.appendChild(
    makeButton(STRINGS.menu.save, {
      onClick: () => {
        if (saveGame()) toast(STRINGS.menu.saved);
      },
    }),
  );
  bar.appendChild(
    makeButton(STRINGS.menu.back, {
      wood: true,
      onClick: () => k.go("title"),
    }),
  );
  uiRoot.appendChild(bar);

  const hint = document.createElement("div");
  hint.textContent = "WASD / Pfeiltasten: Gustav läuft";
  hint.style.cssText =
    "position:absolute;left:50%;bottom:14px;transform:translateX(-50%);" +
    "font-family:var(--font-read);font-size:22px;color:#fff;" +
    "text-shadow:0 2px 4px rgba(0,0,0,.6);pointer-events:none;";
  uiRoot.appendChild(hint);
}

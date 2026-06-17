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
import { spawnCharacter } from "../entities/npc.js";
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
import { npcDialogue } from "../data/dialogue.js";
import { getSeason, nextSeason, SEASON_ORDER } from "../data/seasons.js";
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

    // family members present in this season
    const npcs = Object.values(CHARACTERS)
      .filter((c) => SEASON_ORDER.indexOf(c.appearsFrom) <= SEASON_ORDER.indexOf(season.key))
      .map((c) => ({ id: c.id, obj: spawnCharacter(k, c.id, c.spawn) }));

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

    // ---- quest props that depend on quest state (rebuilt on scene entry) ----
    // Maria's Lieblingsstein: present while her quest is active and unfound.
    let pebble = null;
    function ensurePebble() {
      if (pebble) return;
      if (quests.get("maria_pebble").state === "active") {
        pebble = k.add([
          k.circle(3.6), k.color(150, 148, 140), k.outline(1, k.rgb(108, 106, 98)),
          k.pos(62, 244), k.anchor("center"), k.z(6), "pebble",
        ]);
      }
    }
    // Tata's basking ramp: appears once his quest has started.
    let ramp = null;
    function ensureRamp() {
      if (ramp) return;
      if (quests.get("tata_ramp").state !== "none") {
        ramp = k.add([
          k.rect(36, 13, { radius: 3 }), k.color(150, 108, 60),
          k.outline(1, k.rgb(108, 78, 42)), k.pos(206, 276), k.anchor("center"), k.z(4), "ramp",
        ]);
        ramp.add([k.rect(36, 3), k.color(176, 130, 76), k.anchor("top"), k.pos(0, -6.5)]);
      }
    }
    // Jan's Löwenzahn: dandelions on the lawn while his quest is active.
    let dandelions = [];
    const DANDE_SPOTS = [[120, 120], [300, 92], [200, 204], [332, 210], [156, 160]];
    function ensureDandelions() {
      if (dandelions.length) return;
      if (quests.get("jan_loewenzahn").state !== "active") return;
      const need = quests.QUESTS.jan_loewenzahn.target + 1;
      for (let i = 0; i < need; i++) {
        const [x, y] = DANDE_SPOTS[i % DANDE_SPOTS.length];
        const d = k.add([k.pos(x, y), k.anchor("center"), k.z(6), "loewenzahn"]);
        d.add([k.rect(1.5, 5), k.color(80, 140, 70), k.anchor("top"), k.pos(0, 1)]);
        d.add([k.circle(3), k.color(245, 205, 55), k.anchor("center"), k.pos(0, 0)]);
        dandelions.push(d);
      }
    }
    ensurePebble();
    ensureRamp();
    ensureDandelions();

    // ---- interaction: talk to the nearest family member with [Space] ----
    const NPC_QUEST = {
      magda: "magda_strawberries",
      maria: "maria_pebble",
      tata: "tata_ramp",
      jan: "jan_loewenzahn",
      constantin: "constantin_foto",
    };
    const prompt = makePrompt();

    function nearestNpc() {
      let best = null;
      let bestDist = TALK_DIST;
      for (const n of npcs) {
        const d = gustav.pos.dist(n.obj.pos);
        if (d <= bestDist) { bestDist = d; best = n; }
      }
      return best;
    }

    k.onKeyPress("space", () => {
      if (isUiBusy()) return;
      const n = nearestNpc();
      if (n) talkTo(n.id);
    });

    async function talkTo(id) {
      const qid = NPC_QUEST[id];
      const q = qid ? quests.get(qid) : { state: "none", progress: 0 };
      const target = qid ? quests.QUESTS[qid].target : 0;
      await showDialogue(npcDialogue(id, q.state, q.progress, target));
      if (!qid) return;
      if (q.state === "none") {
        quests.start(qid);
        if (id === "maria") ensurePebble(); // the stone is "out there" to find
        if (id === "tata") ensureRamp(); // Tata builds the ramp as he offers it
        if (id === "jan") ensureDandelions(); // dandelions sprout for munching
        autosave();
      } else if (q.state === "ready") {
        const def = quests.complete(qid);
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

    // ---- Sommer gate-escape gag ----
    let gagPhase = state.flags?.gateGagSeen ? "done" : "idle"; // idle->open->scoop->done
    let stillTimer = 0; // for Constantin's photo

    const familyQuestsAllDone = () =>
      npcs.every((n) => {
        const qid = NPC_QUEST[n.id];
        return !qid || quests.get(qid).state === "done";
      });

    function openGate() {
      k.get("gate").forEach((g) => k.destroy(g));
      gustav.minY = -26; // let him slip out the top gap
      hud.pop(STRINGS.pops.gateOpen);
    }

    function closeGate() {
      gustav.minY = 16;
      k.add([
        k.rect(80, 12), k.pos(200, 6), k.color(...PALETTE.gate), k.z(6),
        k.area(), k.body({ isStatic: true }), "gate",
      ]);
    }

    async function playScoop() {
      gagPhase = "scoop";
      const rescuer = npcs.find((n) => n.id === "maria") || npcs[0];
      const rc = CHARACTERS[rescuer.id];
      const L = (text) => ({ name: rc.name, portrait: rc.portrait, text });
      await showDialogue([
        L("Gustaaav! Wo willst du denn hin, du kleiner Ausreißer? 🐢💨"),
        L("Komm her, du. Der Garten ist doch viel schöner als die Straße."),
      ]);
      // a little "scooped up" hop, then set safely back on the lawn
      gustav.pos.y = 34;
      await new Promise((res) => k.wait(0.25, res));
      gustav.pos.x = 240;
      gustav.pos.y = 244;
      closeGate();
      unlockMemory("ausreisser");
      state.flags.gateGagSeen = true;
      gagPhase = "done";
      autosave();
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

      // proximity prompt (nearest family member)
      const near = !isUiBusy() && nearestNpc();
      prompt.style.opacity = near ? "1" : "0";

      // Maria's pebble — found by waddling onto it
      if (pebble && gustav.pos.dist(pebble.pos) < 12) {
        k.destroy(pebble);
        pebble = null;
        if (quests.progress("maria_pebble")) hud.pop(STRINGS.pops.found);
        autosave();
      }
      // Tata's ramp — "tested" by stepping onto it
      if (ramp && quests.get("tata_ramp").state === "active" && gustav.pos.dist(ramp.pos) < 16) {
        if (quests.progress("tata_ramp")) hud.pop(STRINGS.pops.questDone);
        autosave();
      }

      // Jan's Löwenzahn — munched by waddling onto them
      if (dandelions.length && quests.get("jan_loewenzahn").state === "active") {
        for (const d of [...dandelions]) {
          if (gustav.pos.dist(d.pos) < 12) {
            k.destroy(d);
            dandelions = dandelions.filter((x) => x !== d);
            if (quests.progress("jan_loewenzahn")) hud.pop(STRINGS.pops.questDone);
            autosave();
          }
        }
      }

      // Constantin's photo — hold still near him for a moment
      const cNpc = npcs.find((n) => n.id === "constantin");
      if (cNpc && quests.get("constantin_foto").state === "active") {
        if (!isUiBusy() && !gustav.moving && gustav.pos.dist(cNpc.obj.pos) < 38) {
          stillTimer += k.dt();
          if (stillTimer >= 1.4) {
            if (quests.progress("constantin_foto")) hud.pop(STRINGS.pops.photo);
            autosave();
          }
        } else {
          stillTimer = 0;
        }
      }

      // Gate-escape gag: once the whole Sommer family is happy, the gate is left
      // open. Guide Gustav out the top and the family scoops him back up.
      if (gagPhase === "idle" && state.season === "sommer" && familyQuestsAllDone()) {
        gagPhase = "open";
        openGate();
      }
      if (gagPhase === "open" && gustav.pos.y < 12) {
        playScoop();
      }

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

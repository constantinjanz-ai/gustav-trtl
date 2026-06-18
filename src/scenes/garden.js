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
import { sfx, setMusicMood } from "../systems/audio.js";
import { createNeeds } from "../systems/needs.js";
import { createStrawberries } from "../systems/strawberries.js";
import { createWornPath } from "../systems/wornPath.js";
import { createQuests } from "../systems/quests.js";
import { createHud } from "../ui/hud.js";
import { showDialogue } from "../ui/dialogue.js";
import { openScrapbook } from "../ui/scrapbook.js";
import { playTeezeit } from "../ui/teezeit.js";
import { CHARACTERS } from "../data/characters.js";
import { npcDialogue, introDialogue } from "../data/dialogue.js";
import { questForGiver } from "../data/quests.js";
import { getSeason, nextSeason, SEASON_ORDER } from "../data/seasons.js";
import { showChapterCard } from "../ui/chapterCard.js";

const TALK_DIST = 30;
const TEEZEIT_GLUCK = 55;

export function registerGardenScene() {
  k.scene("garden", () => {
    clearOverlay();

    const state = getState();

    // Chapter progression on entry:
    //  Frühling -> Sommer once the first Teezeit is done,
    //  Sommer  -> Herbst once the gate-escape gag is done.
    if (state.flags?.teezeitSeen && state.season === "fruehling") {
      state.flags.fruehling_seen = true; // don't replay the Frühling card
      state.season = "sommer";
    }
    if (state.flags?.gateGagSeen && state.season === "sommer") {
      state.season = "herbst";
    }
    if (
      state.season === "herbst" &&
      state.quests?.jan_leaves?.state === "done" &&
      state.quests?.tata_winterbox?.state === "done"
    ) {
      state.season = "winter";
    }
    const season = getSeason(state.season);

    // apply the season skin + music mood
    k.setBackground(k.rgb(...season.sky));
    setMusicMood(season.key);
    buildGround(season);
    buildStructures();
    buildProps(season);

    // chapter card the first time a season is entered (shown via the intro
    // sequence at the end of setup, so it can chain into the tutorial)
    state.flags = state.flags || {};
    const seenKey = "season_" + season.key + "_seen";
    const playCard = !state.flags[seenKey];
    if (playCard) state.flags[seenKey] = true;

    // ambient drifting particles: autumn leaves / winter snow (decorative)
    if (season.key === "herbst" || season.key === "winter") {
      const isSnow = season.key === "winter";
      const cols = isSnow
        ? [[244, 248, 252], [236, 242, 248]]
        : [[214, 130, 56], [196, 90, 50], [226, 168, 60], [180, 110, 70]];
      const count = isSnow ? 16 : 10;
      for (let i = 0; i < count; i++) {
        const p = k.add([
          k.circle(isSnow ? 1.8 : 2.6),
          k.color(...cols[i % cols.length]),
          k.opacity(isSnow ? 0.95 : 0.85),
          k.pos(k.rand(20, GARDEN_W - 20), k.rand(0, GARDEN_H)),
          k.anchor("center"),
          k.z(8),
          { vy: isSnow ? k.rand(5, 11) : k.rand(8, 16), sway: k.rand(5, 12), t: k.rand(0, 6) },
        ]);
        p.onUpdate(() => {
          p.t += k.dt();
          p.pos.y += p.vy * k.dt();
          p.pos.x += Math.sin(p.t * 2) * p.sway * k.dt();
          if (p.pos.y > GARDEN_H + 6) {
            p.pos.y = -6;
            p.pos.x = k.rand(20, GARDEN_W - 20);
          }
        });
      }
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
    // Jan's Herbst leaves: collectible fallen leaves on the lawn.
    let leaves = [];
    const LEAF_SPOTS = [[110, 130], [260, 110], [180, 220], [320, 200], [150, 90], [300, 250]];
    function ensureLeaves() {
      if (leaves.length) return;
      if (quests.get("jan_leaves").state !== "active") return;
      const need = quests.QUESTS.jan_leaves.target + 1;
      const cols = [[210, 120, 50], [196, 90, 50], [226, 168, 60], [200, 110, 48]];
      for (let i = 0; i < need; i++) {
        const [x, y] = LEAF_SPOTS[i % LEAF_SPOTS.length];
        const lf = k.add([
          k.circle(3.4), k.color(...cols[i % cols.length]),
          k.outline(1, k.rgb(120, 70, 30)), k.pos(x, y), k.anchor("center"), k.z(6), "leafpile",
        ]);
        leaves.push(lf);
      }
    }
    // Tata's Herbst winter box: appears once his winter quest has started.
    let winterbox = null;
    function ensureWinterbox() {
      if (winterbox) return;
      if (quests.get("tata_winterbox").state !== "none") {
        winterbox = k.add([
          k.rect(34, 22, { radius: 3 }), k.color(132, 94, 54),
          k.outline(2, k.rgb(96, 66, 36)), k.pos(300, 274), k.anchor("center"), k.z(4), "winterbox",
        ]);
        winterbox.add([k.rect(30, 8), k.color(206, 150, 70), k.anchor("center"), k.pos(0, 5)]); // leaf bedding
      }
    }
    ensurePebble();
    ensureRamp();
    ensureDandelions();
    ensureLeaves();
    ensureWinterbox();

    // ---- interaction: talk to the nearest family member with [Space] ----
    // Which quest a character offers depends on the current season.
    const npcQuestId = (id) => questForGiver(id, season.key);
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

    // The same Space press that closes a dialogue must not immediately re-open
    // one: the dialogue's own keydown handler frees the UI a beat before Kaplay
    // processes the keypress, so guard against that single re-trigger.
    let dialogueJustClosed = false;

    k.onKeyPress("space", () => {
      if (isUiBusy()) return;
      if (dialogueJustClosed) {
        dialogueJustClosed = false;
        return;
      }
      const n = nearestNpc();
      if (n) talkTo(n.id);
    });

    async function talkTo(id) {
      const qid = npcQuestId(id);
      const q = qid ? quests.get(qid) : { state: "none", progress: 0 };
      const def = qid ? quests.QUESTS[qid] : null;
      const dkey = def ? def.dialogue || def.giver : id;
      await showDialogue(npcDialogue(dkey, q.state, q.progress, def?.target ?? 0));
      // swallow the closing keypress; also auto-clear in case it closed by click
      dialogueJustClosed = true;
      k.wait(0.3, () => (dialogueJustClosed = false));
      if (!qid) return;
      if (q.state === "none") {
        quests.start(qid);
        // spawn whatever this quest needs in the world
        ensurePebble();
        ensureRamp();
        ensureDandelions();
        ensureLeaves();
        ensureWinterbox();
        autosave();
      } else if (q.state === "ready") {
        const done = quests.complete(qid);
        if (done) {
          needs.addGluck(done.rewardGluck);
          unlockMemory(done.rewardMemory);
          autosave();
        }
      }
    }

    function unlockMemory(id) {
      state.memories = state.memories || [];
      if (id && !state.memories.includes(id)) {
        state.memories.push(id);
        hud.pop(STRINGS.pops.newMemory);
        sfx("happy");
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
        const qid = npcQuestId(n.id);
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
      // the gag ends the Sommer chapter — slide into Herbst
      if (nextSeason(state.season)) k.wait(0.8, () => k.go("garden"));
    }

    // ---- Winter hibernation set-up ----
    const boxPos = k.vec2(300, 274); // matches the winter box position
    let herbstAdvancing = false;

    function addZzz() {
      const z = k.add([
        k.text("Zzz", { size: 9, font: "monospace" }),
        k.color(90, 100, 130), k.pos(boxPos.x + 12, boxPos.y - 14),
        k.anchor("center"), k.z(11), "zzz", { t: 0 },
      ]);
      z.onUpdate(() => {
        z.t += k.dt();
        z.pos.y = boxPos.y - 14 + Math.sin(z.t * 2) * 2;
        z.opacity = 0.55 + Math.sin(z.t * 2) * 0.3;
      });
    }

    async function playHibernation() {
      const M = CHARACTERS.magda;
      const T = CHARACTERS.tata;
      const line = (c, text) => ({ name: c.name, portrait: c.portrait, text });
      await showDialogue([
        line(M, "So, mein Gustav. Der Winter ist da — Zeit fürs lange Schläfchen."),
        line(T, "Ab in die Kiste, schön ins Laub gekuschelt. Da ist es mollig warm."),
        line(M, "Schlaf schön, mein Goldstück. Wir wecken dich im Frühling. ❄️💚"),
      ]);
      gustav.pos.x = boxPos.x;
      gustav.pos.y = boxPos.y;
      gustav.asleep = true;
      addZzz();
      unlockMemory("winterschlaf");
      state.flags.winterTuckSeen = true;
      autosave();
    }

    function wakeToSpring() {
      // loop the year: keep the keepsakes (memories) + Gustav's worn path,
      // reset the seasonal journey so a fresh cycle can begin.
      state.year = (state.year || 1) + 1;
      state.season = "fruehling";
      state.quests = {};
      state.flags = {};
      state.needs = { sonne: 70, snack: 70, nickerchen: 70 };
      state.gluck = 20;
      gustav.asleep = false;
      saveGame();
      k.go("garden");
    }

    function setupWinter() {
      ensureWinterbox(); // built in Herbst; present through Winter
      if (state.flags?.winterTuckSeen) {
        gustav.pos.x = boxPos.x;
        gustav.pos.y = boxPos.y;
        gustav.asleep = true;
        addZzz();
      } else {
        playHibernation();
      }
      const wake = makeButton(STRINGS.winter.wake, { onClick: wakeToSpring });
      wake.style.cssText =
        "position:absolute;left:50%;bottom:58px;transform:translateX(-50%);";
      uiRoot.appendChild(wake);
      const hint = document.querySelector(".gg-hint");
      if (hint) hint.textContent = STRINGS.winter.sleeping;
    }

    // ---- main update loop ----
    let teezeitPlaying = false;
    k.onUpdate(() => {
      if (season.key !== "winter") needs.update(gustav); // Gustav hibernates
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

      // Jan's Herbst leaves — gathered by waddling over them
      if (leaves.length && quests.get("jan_leaves").state === "active") {
        for (const lf of [...leaves]) {
          if (gustav.pos.dist(lf.pos) < 12) {
            k.destroy(lf);
            leaves = leaves.filter((x) => x !== lf);
            if (quests.progress("jan_leaves")) hud.pop(STRINGS.pops.questDone);
            autosave();
          }
        }
      }
      // Tata's winter box — "tested" by climbing in
      if (winterbox && quests.get("tata_winterbox").state === "active" && gustav.pos.dist(winterbox.pos) < 16) {
        if (quests.progress("tata_winterbox")) hud.pop(STRINGS.pops.questDone);
        autosave();
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

      // Herbst slides into Winter once both autumn tasks are done
      if (state.season === "herbst" && !herbstAdvancing && familyQuestsAllDone()) {
        herbstAdvancing = true;
        hud.pop(STRINGS.pops.questDone);
        k.wait(1.0, () => k.go("garden"));
      }

      // Teezeit ends the Frühling chapter and slides into Sommer — but only once
      // Magda's quest is actually done (so it can't fire mid-first-mission) and
      // Glück has crossed the threshold.
      if (
        !teezeitPlaying &&
        !state.flags?.teezeitSeen &&
        quests.get("magda_strawberries").state === "done" &&
        state.gluck >= TEEZEIT_GLUCK
      ) {
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

    // Winter set-up runs after the HUD/nav exist (it repurposes the hint line)
    if (season.key === "winter") setupWinter();

    // Intro sequence: chapter card, then a one-time welcome/tutorial in Frühling
    (async () => {
      if (playCard) await showChapterCard(season);
      if (season.key === "fruehling" && !state.tutorialSeen) {
        state.tutorialSeen = true;
        await showDialogue(introDialogue());
        dialogueJustClosed = true; // don't let the closing keypress open a talk
        k.wait(0.3, () => (dialogueJustClosed = false));
        autosave();
      }
    })();
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

  // grass texture: scattered blades + clover specks across the lawn
  const dark = season.lawn.map((v, i) => Math.max(0, v - [26, 22, 30][i]));
  const lite = season.lawn.map((v, i) => Math.min(255, v + [16, 16, 10][i]));
  const tufts = [];
  for (let i = 0; i < 230; i++) {
    tufts.push({
      x: 44 + Math.random() * 392,
      y: 24 + Math.random() * 242,
      tall: 1.8 + Math.random() * 1.4,
      lite: Math.random() < 0.4,
      clover: Math.random() < 0.1,
    });
  }
  const grass = k.add([k.z(1.5), "grassdetail"]);
  grass.onDraw(() => {
    for (const t of tufts) {
      if (t.clover) {
        for (const [ox, oy] of [[-0.9, 0], [0.9, 0], [0, -0.9]]) {
          k.drawCircle({ pos: k.vec2(t.x + ox, t.y + oy), radius: 0.85, color: k.rgb(...lite), opacity: 0.6 });
        }
      } else {
        k.drawRect({ pos: k.vec2(t.x, t.y), width: 1, height: t.tall, color: k.rgb(...(t.lite ? lite : dark)), opacity: 0.5 });
      }
    }
  });

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

  // detailed patio doors: white frame, glass, mullion + half-lowered shutter
  for (let i = 0; i < 3; i++) {
    const cx = 120 + i * 120;
    k.add([k.rect(86, 18, { radius: 1 }), k.pos(cx, 310), k.anchor("center"), k.color(226, 228, 222), k.z(6)]); // frame
    k.add([k.rect(78, 14), k.pos(cx, 311), k.anchor("center"), k.color(150, 180, 192), k.z(6)]); // glass
    k.add([k.rect(2, 14), k.pos(cx, 311), k.anchor("center"), k.color(226, 228, 222), k.z(7)]); // mullion
    // roller shutter (Rolladen), half lowered
    k.add([k.rect(82, 6), k.pos(cx, 305), k.anchor("center"), k.color(150, 152, 150), k.z(7)]);
    k.add([k.rect(82, 1), k.pos(cx, 304), k.anchor("center"), k.color(122, 124, 122), k.opacity(0.7), k.z(7)]);
    k.add([k.rect(82, 1), k.pos(cx, 306), k.anchor("center"), k.color(122, 124, 122), k.opacity(0.7), k.z(7)]);
  }

  // fence detail: anthracite Doppelstabmatten — vertical bars + two rails
  const fence = k.add([k.z(7), "fencedetail"]);
  fence.onDraw(() => {
    const bar = k.rgb(90, 94, 100);
    const rail = k.rgb(44, 47, 51);
    for (let x = 6; x <= 474; x += 7) {
      if (x > 198 && x < 282) continue; // skip the gate gap
      k.drawRect({ pos: k.vec2(x, 9), width: 1.4, height: 8, color: bar });
    }
    for (const [x0, x1] of [[0, 200], [280, 480]]) {
      k.drawRect({ pos: k.vec2(x0, 9.5), width: x1 - x0, height: 1.2, color: rail });
      k.drawRect({ pos: k.vec2(x0, 15.5), width: x1 - x0, height: 1.2, color: rail });
    }
    // side runs: horizontal rungs
    for (let y = 24; y <= 292; y += 8) {
      k.drawRect({ pos: k.vec2(2.5, y), width: 6, height: 1.2, color: bar });
      k.drawRect({ pos: k.vec2(471.5, y), width: 6, height: 1.2, color: bar });
    }
  });
}

// leafy clumps vs blooms vs plain objects (pots, ornaments, snow, leaves…)
const FOLIAGE = new Set(["fig", "juniper", "cherrylaurel", "buddleia"]);
const FLOWER = new Set([
  "hydrangea", "cosmos", "salvia", "rose", "dahlia", "marigold",
  "spirea", "lavender", "aster", "bergenia", "sunflower",
]);

function buildProps(season) {
  const props = [...PROPS, ...(season.extraProps || [])];
  for (const p of props) {
    const comps = [k.pos(p.x, p.y), k.anchor("center"), k.color(...p.color), k.z(5), p.kind];
    if (p.r != null) {
      if (FOLIAGE.has(p.kind)) {
        comps.unshift(k.sprite("bush"), k.scale((p.r * 2) / 16));
      } else if (FLOWER.has(p.kind)) {
        comps.unshift(k.sprite("flower"), k.scale((p.r * 2) / 9));
      } else {
        comps.unshift(k.circle(p.r)); // plain objects keep their shape
      }
    } else {
      comps.unshift(k.rect(p.w, p.h, { radius: 3 }));
    }
    if (p.tag) comps.push(p.tag);
    const obj = k.add(comps);
    if (p.solid) {
      obj.use(k.area({ scale: 0.7 })); // slightly forgiving collision
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
  hint.className = "gg-hint";
  hint.textContent = "WASD / Pfeiltasten: Gustav läuft";
  hint.style.cssText =
    "position:absolute;left:50%;bottom:14px;transform:translateX(-50%);" +
    "font-family:var(--font-read);font-size:22px;color:#fff;" +
    "text-shadow:0 2px 4px rgba(0,0,0,.6);pointer-events:none;";
  uiRoot.appendChild(hint);
}

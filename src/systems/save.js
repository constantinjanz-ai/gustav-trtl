// localStorage save/load. Holds the full M1 game state:
// needs, Glück, worn-path grid, quest progress, unlocked memories.
// Audio prefs live separately (see systems/audio.js).

const SAVE_KEY = "gg_save_v1";

// The canonical shape of a fresh game. Systems read/write through getState().
function freshState() {
  return {
    version: 1,
    season: "fruehling",
    needs: { sonne: 70, snack: 70, nickerchen: 70 },
    gluck: 0,
    gustav: { x: 240, y: 220 }, // last position on the lawn
    worn: {}, // "col,row" -> wear 0..1 (sparse)
    quests: {}, // questId -> { state, progress }
    memories: [], // unlocked memory ids
    flags: {}, // misc one-shot flags (teezeit seen, etc.)
  };
}

let current = null;

export function hasSave() {
  try {
    return localStorage.getItem(SAVE_KEY) != null;
  } catch {
    return false;
  }
}

// Load existing save into memory, or start a fresh state.
export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      current = { ...freshState(), ...JSON.parse(raw) };
      return current;
    }
  } catch (e) {
    console.warn("Spielstand beschädigt, starte neu.", e);
  }
  current = freshState();
  return current;
}

// Begin a brand-new game in memory (does not persist until saveGame()).
export function newGame() {
  current = freshState();
  return current;
}

// The live state object — systems mutate this directly.
export function getState() {
  if (!current) loadGame();
  return current;
}

export function saveGame() {
  if (!current) return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(current));
    return true;
  } catch (e) {
    console.warn("Konnte nicht speichern.", e);
    return false;
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* non-fatal */
  }
  current = null;
}

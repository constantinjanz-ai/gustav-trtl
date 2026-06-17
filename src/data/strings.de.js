// Single source of truth for ALL player-facing text.
// German, informal "du" throughout. Keep this file the only place strings live
// so M2–M5 content stays a data edit, not a code edit.

export const STRINGS = {
  title: "Gustavs Garten",
  subtitle: "Eine kleine Geschichte für Maria & Gustav",

  menu: {
    play: "Spielen",
    continue: "Weiter",
    options: "Optionen",
    save: "Speichern",
    saved: "Gespeichert!",
    back: "Zurück",
  },

  options: {
    heading: "Optionen",
    music: "Musik",
    sound: "Töne",
    on: "An",
    off: "Aus",
    reset: "Spielstand löschen",
    resetConfirm: "Wirklich neu anfangen?",
  },

  needs: {
    sonne: "Sonne",
    snack: "Snack",
    nickerchen: "Nickerchen",
  },

  gluck: "Glück",
  memories: "Erinnerungen",
  task: "Aufgabe",
  teezeit: "Teezeit",

  seasons: {
    fruehling: "Frühling",
    sommer: "Sommer",
    herbst: "Herbst",
    winter: "Winter",
  },

  items: {
    erdbeeren: "Erdbeeren",
    loewenzahn: "Löwenzahn",
  },

  prompts: {
    interact: "Drücke [Leertaste]",
    talk: "Drücke [Leertaste] zum Reden",
  },

  pops: {
    newMemory: "Neue Erinnerung! ✨",
    questDone: "Aufgabe geschafft! 🍓",
    found: "Gefunden! 🪨",
  },
};

export default STRINGS;

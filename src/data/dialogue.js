// German dialogue, keyed by character + quest state. Warm, informal "du".
// Each line: { name, portrait, text }.
import { CHARACTERS } from "./characters.js";

const M = CHARACTERS.magda;
const line = (text) => ({ name: M.name, portrait: M.portrait, text });

// Returns the lines Magda says given the quest state + progress.
export function magdaDialogue(questState, progress = 0, target = 5) {
  switch (questState) {
    case "none":
      return [
        line("Ach, da bist du ja, mein kleiner Gustav! 🐢"),
        line("Schau mal — überall am Zaun wachsen die wilden Erdbeeren wieder."),
        line(`Sammelst du mir ein paar? Fünf kleine Erdbeeren wären wunderbar.`),
        line("Lauf einfach am Rand entlang und nasch dich durch. Lass dir Zeit, mein Schatz."),
      ];
    case "active":
      return [
        line(`Schon ${progress} von ${target} Erdbeeren! Fein machst du das.`),
        line("Die süßesten wachsen ganz am Zaun. Immer der Nase nach."),
      ];
    case "ready":
      return [
        line("Fünf Erdbeeren! Du bist der fleißigste Schildkröten-Gärtner weit und breit."),
        line("Dafür kommst du ins Erinnerungsalbum, mein Goldstück. 💚"),
      ];
    case "done":
    default:
      return [
        line("Sonn dich ruhig, Gustav. Das Beet ist heute geschafft."),
        line("Gleich gibt es Tee auf der Terrasse. 🌸"),
      ];
  }
}

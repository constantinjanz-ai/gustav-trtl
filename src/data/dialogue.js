// German dialogue, keyed by character + quest state. Warm, informal "du".
// Each line: { name, portrait, text }.
import { CHARACTERS } from "./characters.js";

const lineFor = (id) => (text) => ({
  name: CHARACTERS[id].name,
  portrait: CHARACTERS[id].portrait,
  text,
});

const DIALOGUE = {
  magda(questState, progress = 0, target = 5) {
    const l = lineFor("magda");
    switch (questState) {
      case "none":
        return [
          l("Ach, da bist du ja, mein kleiner Gustav! 🐢"),
          l("Schau mal — überall am Zaun wachsen die wilden Erdbeeren wieder."),
          l("Sammelst du mir ein paar? Fünf kleine Erdbeeren wären wunderbar."),
          l("Lauf einfach am Rand entlang und nasch dich durch. Lass dir Zeit, mein Schatz."),
        ];
      case "active":
        return [
          l(`Schon ${progress} von ${target} Erdbeeren! Fein machst du das.`),
          l("Die süßesten wachsen ganz am Zaun. Immer der Nase nach."),
        ];
      case "ready":
        return [
          l("Fünf Erdbeeren! Du bist der fleißigste Schildkröten-Gärtner weit und breit."),
          l("Dafür kommst du ins Erinnerungsalbum, mein Goldstück. 💚"),
        ];
      default:
        return [l("Sonn dich ruhig, Gustav. Gleich gibt es Tee. 🌸")];
    }
  },

  maria(questState) {
    const l = lineFor("maria");
    switch (questState) {
      case "none":
        return [
          l("Na, mein kleiner Dickkopf? Komm her, du. 💛"),
          l("Weißt du noch dein Lieblingssteinchen? Das glatte, warme?"),
          l("Es liegt irgendwo im Garten. Findest du es für mich wieder?"),
        ];
      case "active":
        return [
          l("Schnüffel ruhig in den Beeten und Ecken herum."),
          l("Du erkennst es sofort — dein ganz besonderer Stein."),
        ];
      case "ready":
        return [
          l("Da ist es ja! Genau dein Stein. Du vergisst aber auch nichts. 🥹"),
          l("So ein kluger Gustav. Das kommt direkt ins Album."),
        ];
      default:
        return [l("Komm kuscheln, Gustav. Die Sonne ist so schön warm.")];
    }
  },

  tata(questState) {
    const l = lineFor("tata");
    switch (questState) {
      case "none":
        return [
          l("Tag, Gustav! Ich hab da was zusammengezimmert."),
          l("Eine kleine Sonnenrampe — damit du noch bequemer brätst."),
          l("So, steht. Probier sie gleich mal aus, lauf einfach drauf!"),
        ];
      case "active":
        return [
          l("Na los, trau dich auf die Rampe. Hält bombenfest."),
          l("Hab extra die schönste Sonnenecke ausgesucht."),
        ];
      case "ready":
        return [
          l("Haha, sitzt, passt, wackelt nicht! Sonnenkönig Gustav. ☀️"),
          l("Die Rampe gehört jetzt ganz dir, mein Freund."),
        ];
      default:
        return [l("Genieß die Sonne, Gustav. Gut gebaut, wenn ich das so sage.")];
    }
  },

  jan(questState, progress = 0, target = 3) {
    const l = lineFor("jan");
    switch (questState) {
      case "none":
        return [
          l("Servus Gustav! Na, schon was Leckeres gefunden?"),
          l("Im Rasen sprießt überall Löwenzahn — dein Lieblingssalat."),
          l(`Mampf doch ein paar für mich, sagen wir drei Stück?`),
        ];
      case "active":
        return [
          l(`${progress} von ${target} Löwenzahn — schmatz weiter, Kumpel.`),
          l("Die gelben Blüten sind die besten, glaub mir."),
        ];
      case "ready":
        return [
          l("Drei Löwenzahn weg! Du frisst wie ein Weltmeister. 😄"),
          l("Setz dich zu uns, gleich ist Teezeit."),
        ];
      default:
        return [l("Alter, du bist echt der entspannteste Typ im Garten.")];
    }
  },

  constantin(questState) {
    const l = lineFor("constantin");
    // TODO(in-jokes): the user will add personal in-jokes for Constantin here.
    switch (questState) {
      case "none":
        return [
          l("Also… ich bin der Neue. Maria hat gesagt, ich soll viel von dir lernen."),
          l("Du machst ja eigentlich nur Sonne, Snacks, Nickerchen. Genie. 😎"),
          l("Halt mal kurz still, ich will ein Foto für das Album machen!"),
        ];
      case "active":
        return [
          l("Ganz ruhig bleiben… genau so… nicht weglaufen!"),
          l("Bleib einfach kurz neben mir stehen, dann hab ich's."),
        ];
      case "ready":
        return [
          l("Perfekt! Das schönste Schildkröten-Porträt aller Zeiten. 📸"),
          l("Maria hatte recht: von dir kann man echt was lernen, Gustav."),
        ];
      default:
        return [l("Sonne, Snack, Nickerchen. Ich arbeite dran, Meister. 🐢")];
    }
  },
};

export function npcDialogue(id, questState, progress, target) {
  const fn = DIALOGUE[id];
  return fn ? fn(questState, progress, target) : [];
}

// kept for any existing imports
export function magdaDialogue(questState, progress, target) {
  return DIALOGUE.magda(questState, progress, target);
}

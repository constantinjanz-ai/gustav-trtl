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

  // Tata's Herbst quest: the cozy winter box.
  tata_winter(questState) {
    const l = lineFor("tata");
    switch (questState) {
      case "none":
        return [
          l("So, Gustav, der Herbst ist da. Zeit, an den Winter zu denken."),
          l("Ich hab dir eine kuschelige Winterkiste gezimmert — schön mit Laub gepolstert."),
          l("Kletter mal rein und schau, ob sie dir passt!"),
        ];
      case "active":
        return [
          l("Die Kiste steht auf der Terrasse. Probier sie ruhig aus."),
          l("Soll ja gemütlich sein für deinen langen Schlaf."),
        ];
      case "ready":
        return [
          l("Passt wie angegossen! Da kannst du den Winter verschlafen. 😴"),
          l("Wir wecken dich im Frühling, versprochen."),
        ];
      default:
        return [l("Die Winterkiste wartet, wann immer dir danach ist, Gustav.")];
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

  // Jan's Herbst quest: collect fallen leaves.
  jan_leaves(questState, progress = 0, target = 5) {
    const l = lineFor("jan");
    switch (questState) {
      case "none":
        return [
          l("Schau dir das an, Gustav — überall buntes Laub!"),
          l("Hilfst du mir aufräumen? Lauf über die Blätter, dann sammeln wir sie ein."),
          l(`Fünf schöne Blätter, dann haben wir genug fürs Winterbett.`),
        ];
      case "active":
        return [
          l(`${progress} von ${target} Blättern — die roten sind die schönsten.`),
          l("Immer schön langsam, wir haben ja Zeit."),
        ];
      case "ready":
        return [
          l("Ein ganzer Haufen Blätter! Daraus wird das weichste Winterbett. 🍂"),
          l("Tata polstert dir die Kiste damit aus."),
        ];
      default:
        return [l("Hör mal, wie das Laub raschelt. Schönster Herbst seit langem.")];
    }
  },

  constantin(questState) {
    const l = lineFor("constantin");
    switch (questState) {
      case "none":
        return [
          l("Also… ich bin der Neue. Maria hat gesagt, ich soll viel von dir lernen."),
          l("Check das mal, Gustav: du machst nur Sonne, Snacks, Nickerchen."),
          l("Das ist ja quasi der perfekte Startup-Lifestyle. Ich vibe-code dir die Roadmap. 😎"),
          l("Halt mal kurz still, ich will ein Foto fürs Album machen!"),
        ];
      case "active":
        return [
          l("Ganz ruhig… genau so… nicht weglaufen, sonst muss ich neu deployen."),
          l("Bleib einfach kurz neben mir stehen, dann hab ich's im Kasten."),
        ];
      case "ready":
        return [
          l("Perfekt! Check das mal — das schönste Schildkröten-Porträt aller Zeiten. 📸"),
          l("Maria hatte recht, von dir lernt man echt was. Und Gustav … I see you. 💚"),
        ];
      default:
        return [
          l("Sonne, Snack, Nickerchen — beste Roadmap ever. 🐢"),
          l("War is over, kleiner Freund. Jetzt wird nur noch gechillt."),
        ];
    }
  },
};

// One-time welcome + tutorial at the very start of a new game (Magda guides).
export function introDialogue() {
  const l = (text) => ({ name: CHARACTERS.magda.name, portrait: CHARACTERS.magda.portrait, text });
  return [
    l("Hallo, ich bin Magda! 🐢 Mit den Pfeiltasten oder WASD wackelt Gustav durch den Garten."),
    l("Oben rechts siehst du, wie es ihm geht: ☀️ Sonne, 🍓 Snack, 💤 Nickerchen — und sein 🌸 Glück."),
    l("☀️ Sonne tankt er beim Sonnenbad auf der Terrasse. 🍓 Snack gibt's beim Naschen der Erdbeeren am Zaun."),
    l("💤 Fürs Nickerchen bleibt er einfach kurz stehen — auf der Holzterrasse träumt es sich am schönsten."),
    l("Geht es ihm rundum gut, wächst sein 🌸 Glück. Das bringt neue Erinnerungen ins Album und führt euch durch die Jahreszeiten."),
    l("Reden kannst du mit uns per [Leertaste]. Komm, sprich mich an — ich hab eine kleine Aufgabe für dich. 💚"),
  ];
}

export function npcDialogue(id, questState, progress, target) {
  const fn = DIALOGUE[id];
  return fn ? fn(questState, progress, target) : [];
}

// kept for any existing imports
export function magdaDialogue(questState, progress, target) {
  return DIALOGUE.magda(questState, progress, target);
}

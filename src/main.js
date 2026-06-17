// Gustavs Garten — entry point.
// Boots Kaplay, registers scenes, starts on the title screen.
import "./config/raf-shim.js"; // must load before Kaplay grabs the frame loop
import k from "./config/kaplay.js";
import { initAudio } from "./systems/audio.js";
import { loadGameSprites } from "./art/sprites.js";
import { registerTitleScene } from "./scenes/title.js";
import { registerGardenScene } from "./scenes/garden.js";

initAudio();
loadGameSprites(k);

registerTitleScene();
registerGardenScene();

k.go("title");

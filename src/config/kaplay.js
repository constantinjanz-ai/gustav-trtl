import kaplay from "kaplay";

// Fixed internal resolution — the whole garden fits on one screen.
// Integer-scaled up by Kaplay's letterbox so pixel art stays crisp.
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 320;

// Cozy spring-sky clear colour behind everything.
const SKY = [173, 216, 222];

// Single shared Kaplay context for the whole game.
export const k = kaplay({
  canvas: document.querySelector("#game-canvas"),
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  letterbox: true,
  crisp: true, // nearest-neighbour scaling, no blur
  pixelDensity: 1,
  background: SKY,
  global: false, // keep the namespace explicit (k.add, k.vec2, ...)
  debug: true, // toggled off before release
});

export default k;

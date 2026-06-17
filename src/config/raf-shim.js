// Offscreen/preview keep-alive shim.
//
// Two browser behaviours stop a Kaplay game from running in a hidden/offscreen
// context (e.g. an automated preview pane that never becomes the foreground tab):
//   1. requestAnimationFrame is paused while the page is hidden.
//   2. Kaplay's own loop early-returns every frame when
//      `document.visibilityState !== "visible"`.
//
// This shim ONLY activates in dev AND only when the page is actually hidden at
// boot (i.e. an offscreen preview). A real player's tab is visible at boot, so
// none of this runs for them, and a production build strips it entirely.
//
// When active it (a) reports the document as visible so Kaplay's loop proceeds,
// and (b) pumps requestAnimationFrame via setTimeout since the native one is
// throttled while hidden. Frame rate is low (~1fps under background throttling)
// but enough to render and inspect.

const isDev = import.meta.env?.DEV;
const visDesc = Object.getOwnPropertyDescriptor(
  Document.prototype,
  "visibilityState",
);
const reallyVisible = () =>
  visDesc ? visDesc.get.call(document) === "visible" : !document.hidden;

if (isDev && !reallyVisible()) {
  console.warn(
    "[gg] offscreen preview detected — enabling keep-alive shim (dev only).",
  );

  // (1) Make Kaplay believe the page is visible.
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => "visible",
  });
  Object.defineProperty(document, "hidden", {
    configurable: true,
    get: () => false,
  });

  // (2) Drive the frame loop via timeout, since native rAF is paused while
  //     genuinely hidden. Decision uses the REAL visibility, not the faked one.
  const nativeRAF = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = function (cb) {
    if (reallyVisible()) return nativeRAF(cb);
    let called = false;
    const run = (t) => {
      if (called) return;
      called = true;
      cb(typeof t === "number" ? t : performance.now());
    };
    nativeRAF(run); // fires if the page becomes visible
    setTimeout(() => run(performance.now()), 16); // background-clamped, but ticks
    return 0;
  };
}

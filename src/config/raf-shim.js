// Dev-only offscreen/preview keep-alive shim.
//
// Two browser behaviours stop a Kaplay game from running in a hidden/offscreen
// context (e.g. an automated preview pane that never becomes the foreground tab):
//   1. requestAnimationFrame is paused while the page is hidden.
//   2. Kaplay's own loop early-returns each frame when
//      `document.visibilityState !== "visible"`.
//
// This installs in DEV only (a production build strips it entirely) and is
// robust to visibility *transitions* — it doesn't depend on whether the page
// happens to be hidden at boot:
//   - It reports the document as visible so Kaplay's loop always proceeds.
//   - Every requestAnimationFrame races native rAF against a setTimeout. When
//     the page is truly visible, native fires first (~16ms) and the timeout is a
//     harmless no-op → full 60fps. When hidden, native is paused, so the timeout
//     drives the frame (low fps under background throttling, but it keeps going).
//
// For a real player in production none of this runs: native rAF + native
// visibility, and the game pauses politely when the tab is backgrounded.

if (import.meta.env?.DEV) {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => "visible",
  });
  Object.defineProperty(document, "hidden", {
    configurable: true,
    get: () => false,
  });

  const nativeRAF = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = function (cb) {
    let called = false;
    const run = (t) => {
      if (called) return;
      called = true;
      cb(typeof t === "number" ? t : performance.now());
    };
    nativeRAF(run); // wins when the page is visible
    setTimeout(() => run(performance.now()), 24); // drives it when hidden
    return 0;
  };

  console.warn("[gg] dev keep-alive shim active (no-op in production builds).");
}

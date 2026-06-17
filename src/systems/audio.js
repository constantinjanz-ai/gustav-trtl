// Procedural audio — no binary assets needed for M1.
// SFX are short WebAudio oscillator blips (Web 2.0 / Flash-game flavour).
// Music is a gentle, slow, looping arpeggio scheduled ahead of time.
// TODO(M4): swap the music loop for a proper soft chiptune track in assets/audio/.

const PREFS_KEY = "gg_audio_prefs";

const state = {
  ctx: null,
  master: null,
  musicGain: null,
  sfxGain: null,
  musicOn: true,
  soundOn: true,
  musicTimer: null,
  started: false,
};

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      state.musicOn = p.musicOn !== false;
      state.soundOn = p.soundOn !== false;
    }
  } catch {
    /* defaults are fine */
  }
}

function savePrefs() {
  try {
    localStorage.setItem(
      PREFS_KEY,
      JSON.stringify({ musicOn: state.musicOn, soundOn: state.soundOn }),
    );
  } catch {
    /* non-fatal */
  }
}

function ensureContext() {
  if (state.ctx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  state.ctx = new AC();
  state.master = state.ctx.createGain();
  state.master.gain.value = 0.5;
  state.master.connect(state.ctx.destination);

  state.musicGain = state.ctx.createGain();
  state.musicGain.gain.value = state.musicOn ? 0.18 : 0;
  state.musicGain.connect(state.master);

  state.sfxGain = state.ctx.createGain();
  state.sfxGain.gain.value = state.soundOn ? 0.5 : 0;
  state.sfxGain.connect(state.master);
}

// A soft, cozy little loop in C major-ish pentatonic — unobtrusive.
const MELODY = [
  523.25, 659.25, 783.99, 659.25, // C5 E5 G5 E5
  587.33, 698.46, 880.0, 698.46, // D5 F5 A5 F5
  523.25, 659.25, 783.99, 1046.5, // C5 E5 G5 C6
  493.88, 587.33, 783.99, 587.33, // B4 D5 G5 D5
];
const NOTE_LEN = 0.42; // seconds per note — slow and gentle

function scheduleMusic() {
  if (!state.ctx) return;
  const ctx = state.ctx;
  let t = ctx.currentTime + 0.1;
  for (const freq of MELODY) {
    playNote(freq, t, NOTE_LEN, "triangle", state.musicGain, 0.9);
    // soft lower harmony every other beat
    t += NOTE_LEN;
  }
  const loopMs = MELODY.length * NOTE_LEN * 1000;
  state.musicTimer = setTimeout(scheduleMusic, loopMs - 60);
}

function playNote(freq, when, dur, type, dest, peak) {
  const ctx = state.ctx;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, when);
  g.gain.linearRampToValueAtTime(peak, when + 0.04);
  g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  osc.connect(g);
  g.connect(dest);
  osc.start(when);
  osc.stop(when + dur + 0.05);
}

// ---- public API ----

export function initAudio() {
  loadPrefs();
}

// Must be called from a user gesture (browser autoplay policy).
export function startAudio() {
  ensureContext();
  if (state.ctx.state === "suspended") state.ctx.resume();
  if (!state.started) {
    state.started = true;
    if (state.musicOn) scheduleMusic();
  }
}

const SFX = {
  hover: { freq: 660, dur: 0.06, type: "square", peak: 0.25 },
  click: { freq: 880, dur: 0.09, type: "square", peak: 0.4 },
  confirm: { freq: 988, dur: 0.16, type: "triangle", peak: 0.4 },
  back: { freq: 440, dur: 0.1, type: "square", peak: 0.3 },
  eat: { freq: 740, dur: 0.12, type: "triangle", peak: 0.4 },
  happy: { freq: 1046, dur: 0.22, type: "triangle", peak: 0.4 },
};

export function sfx(name) {
  const def = SFX[name];
  if (!def) return;
  ensureContext();
  if (!state.soundOn) return;
  if (state.ctx.state === "suspended") state.ctx.resume();
  playNote(
    def.freq,
    state.ctx.currentTime,
    def.dur,
    def.type,
    state.sfxGain,
    def.peak,
  );
}

export function setMusic(on) {
  state.musicOn = on;
  savePrefs();
  if (!state.ctx) return;
  state.musicGain.gain.value = on ? 0.18 : 0;
  if (on && state.started && !state.musicTimer) scheduleMusic();
}

export function setSound(on) {
  state.soundOn = on;
  savePrefs();
  if (state.sfxGain) state.sfxGain.gain.value = on ? 0.5 : 0;
}

export function isMusicOn() {
  return state.musicOn;
}

export function isSoundOn() {
  return state.soundOn;
}

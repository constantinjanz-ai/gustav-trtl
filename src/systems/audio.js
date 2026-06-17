// Procedural audio — no binary assets needed.
// Music: a gentle, Ghibli-flavoured music-box waltz (warm sine voices through a
//   soft lowpass + dreamy delay). Cozy and nostalgic, loops seamlessly.
// SFX: low, full "thock" clicks (a keyboard-ish body + a soft noise transient)
//   instead of high blips.

const PREFS_KEY = "gg_audio_prefs";

const state = {
  ctx: null,
  master: null,
  musicGain: null,
  sfxGain: null,
  noiseBuf: null,
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
  const ctx = new AC();
  state.ctx = ctx;

  state.master = ctx.createGain();
  state.master.gain.value = 0.55;
  state.master.connect(ctx.destination);

  // --- music chain: gain -> warm lowpass -> master, with a dreamy delay tail ---
  state.musicGain = ctx.createGain();
  state.musicGain.gain.value = state.musicOn ? 0.16 : 0;

  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 2400;
  lp.Q.value = 0.3;
  state.musicGain.connect(lp);
  lp.connect(state.master);

  const delay = ctx.createDelay();
  delay.delayTime.value = 0.34;
  const fb = ctx.createGain();
  fb.gain.value = 0.28;
  const wet = ctx.createGain();
  wet.gain.value = 0.5;
  lp.connect(delay);
  delay.connect(fb);
  fb.connect(delay);
  delay.connect(wet);
  wet.connect(state.master);

  // --- sfx ---
  state.sfxGain = ctx.createGain();
  state.sfxGain.gain.value = state.soundOn ? 0.5 : 0;
  state.sfxGain.connect(state.master);

  // short white-noise buffer for click transients
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  state.noiseBuf = buf;
}

// ---------- music ----------
const N = {
  D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94, C3: 130.81,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77, C6: 1046.5,
};
const BEAT = 0.62; // slow, lilting waltz
const BAR = BEAT * 3;

// Each season tints the same cozy waltz: a key shift, a tempo nudge, and a
// texture change. Picked up seamlessly at the next loop (no glitch).
const MOODS = {
  fruehling: { transpose: 0, beatMul: 1.0, bass: 0.14, pad: 0.05, mel: 0.42 },
  sommer: { transpose: 2, beatMul: 0.95, bass: 0.15, pad: 0.05, mel: 0.44 },
  herbst: { transpose: -3, beatMul: 1.12, bass: 0.13, pad: 0.055, mel: 0.4 },
  winter: { transpose: -5, beatMul: 1.35, bass: 0.09, pad: 0.06, mel: 0.34, sparse: true },
};
let mood = MOODS.fruehling;
const semi = (f, n) => f * Math.pow(2, n / 12);

// each bar: pad chord (sustained), bass root, melody [beatOffset, note, beats]
const SONG = [
  { pad: ["C4", "E4", "G4"], bass: "C3", mel: [[0, "E5", 1], [1, "G5", 1], [2, "C5", 1]] },
  { pad: ["G4", "B4", "D5"], bass: "B3", mel: [[0, "D5", 1], [1, "G5", 1], [2, "B4", 1]] },
  { pad: ["E4", "A4", "C5"], bass: "A3", mel: [[0, "C5", 1], [1, "E5", 1], [2, "A4", 1]] },
  { pad: ["F4", "A4", "C5"], bass: "F3", mel: [[0, "A4", 1], [1, "C5", 1], [2, "F4", 1]] },
  { pad: ["C4", "E4", "G4"], bass: "E3", mel: [[0, "E5", 1.5], [1.5, "D5", 0.5], [2, "C5", 1]] },
  { pad: ["F4", "A4", "C5"], bass: "F3", mel: [[0, "F5", 1], [1, "E5", 1], [2, "D5", 1]] },
  { pad: ["G4", "B4", "F5"], bass: "G3", mel: [[0, "D5", 1], [1, "F5", 0.5], [1.5, "E5", 0.5], [2, "D5", 1]] },
  { pad: ["C4", "E4", "G4"], bass: "C3", mel: [[0, "C5", 3]] },
];

function voice(freq, when, dur, peak, type, attack, dest) {
  const ctx = state.ctx;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, when);
  g.gain.linearRampToValueAtTime(peak, when + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  osc.connect(g);
  g.connect(dest);
  osc.start(when);
  osc.stop(when + dur + 0.05);
}

function scheduleSong() {
  if (!state.ctx) return;
  const dest = state.musicGain;
  const tr = mood.transpose;
  const beat = BEAT * mood.beatMul;
  const bar = beat * 3;
  let t = state.ctx.currentTime + 0.15;
  SONG.forEach((b, i) => {
    // soft sustained pad
    for (const n of b.pad) voice(semi(N[n], tr), t, bar * 0.98, mood.pad, "sine", 0.4, dest);
    // gentle bass (skipped on odd bars in the hushed winter texture)
    if (!(mood.sparse && i % 2 === 1)) {
      voice(semi(N[b.bass], tr), t, beat * 2.4, mood.bass, "sine", 0.03, dest);
    }
    // music-box melody (sine pluck)
    for (const [off, note, beats] of b.mel) {
      voice(semi(N[note], tr), t + off * beat, Math.min(beats * beat, 0.95), mood.mel, "sine", 0.01, dest);
    }
    t += bar;
  });
  const loopMs = SONG.length * bar * 1000;
  state.musicTimer = setTimeout(scheduleSong, loopMs - 60);
}

// ---------- sfx ----------
// a low, full "thock" — keyboard-ish body + soft noise click
function thock(freq, dur, peak, withNoise) {
  const ctx = state.ctx;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq * 1.7, t);
  osc.frequency.exponentialRampToValueAtTime(freq, t + 0.03);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g);
  g.connect(state.sfxGain);
  osc.start(t);
  osc.stop(t + dur + 0.03);

  if (withNoise) {
    const src = ctx.createBufferSource();
    src.buffer = state.noiseBuf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1700;
    bp.Q.value = 0.7;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(peak * 0.5, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
    src.connect(bp);
    bp.connect(ng);
    ng.connect(state.sfxGain);
    src.start(t);
    src.stop(t + 0.04);
  }
}

// a soft warm tone (for confirms / happy moments)
function warm(freqs, dur, peak) {
  const ctx = state.ctx;
  const t = ctx.currentTime;
  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = f;
    const start = t + i * 0.06;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(peak, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g);
    g.connect(state.sfxGain);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  });
}

// ---------- public API ----------
export function initAudio() {
  loadPrefs();
}

// Must be called from a user gesture (browser autoplay policy).
export function startAudio() {
  ensureContext();
  if (state.ctx.state === "suspended") state.ctx.resume();
  if (!state.started) {
    state.started = true;
    if (state.musicOn) scheduleSong();
  }
}

export function sfx(name) {
  ensureContext();
  if (!state.soundOn) return;
  if (state.ctx.state === "suspended") state.ctx.resume();
  switch (name) {
    case "hover":
      thock(150, 0.045, 0.18, true); // subtle low tick
      break;
    case "click":
      thock(165, 0.075, 0.6, true); // full low thock
      break;
    case "back":
      thock(125, 0.08, 0.5, true);
      break;
    case "confirm":
      warm([N.G4, N.C5], 0.22, 0.32);
      break;
    case "eat":
      thock(240, 0.1, 0.34, false); // soft warm "nom"
      break;
    case "happy":
      warm([N.C5, N.E5, N.G5], 0.26, 0.3);
      break;
    default:
      thock(165, 0.07, 0.5, true);
  }
}

export function setMusic(on) {
  state.musicOn = on;
  savePrefs();
  if (!state.ctx) return;
  state.musicGain.gain.value = on ? 0.16 : 0;
  if (on && state.started && !state.musicTimer) scheduleSong();
}

export function setSound(on) {
  state.soundOn = on;
  savePrefs();
  if (state.sfxGain) state.sfxGain.gain.value = on ? 0.5 : 0;
}

// Switch the season mood — applied seamlessly at the next loop.
export function setMusicMood(seasonKey) {
  mood = MOODS[seasonKey] || MOODS.fruehling;
}

export function isMusicOn() {
  return state.musicOn;
}

export function isSoundOn() {
  return state.soundOn;
}

// ─── MPC Sample Generator ─────────────────────────────────────────────────────
// Synthesises an ORIGINAL playable sample pack for the MPC playground — no
// copyrighted audio is used or reproduced. Pads 1-8 are tuned piano notes
// (an E-minor scale; pad 1 = E, the signature Runaway note); pads 9-16 are a
// synthesised drum kit so every pad responds.
//
// Run:  node scripts/generate-mpc-samples.mjs
// Output: public/mpc/songs/runaway/pad-01.wav … pad-16.wav
// ──────────────────────────────────────────────────────────────────────────────

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SR = 44100; // sample rate
const OUT_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "mpc",
  "songs",
  "runaway"
);

// ── WAV encoding (mono, 16-bit PCM) ──────────────────────────────────────────
function encodeWav(samples) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16); // PCM chunk size
  buf.writeUInt16LE(1, 20); // format = PCM
  buf.writeUInt16LE(1, 22); // channels = mono
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28); // byte rate
  buf.writeUInt16LE(2, 32); // block align
  buf.writeUInt16LE(16, 34); // bits per sample
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE((s * 32767) | 0, 44 + i * 2);
  }
  return buf;
}

const noise = () => Math.random() * 2 - 1;

// Soft-clip to keep transients punchy without harsh digital clipping.
function softClip(x) {
  return Math.tanh(x * 1.2);
}

// ── Instruments ──────────────────────────────────────────────────────────────

// Layered-partial piano/mallet tone with a percussive decay.
function piano(freq, dur = 1.4) {
  const n = Math.floor(SR * dur);
  const out = new Float32Array(n);
  const partials = [
    { mult: 1, amp: 1.0, decay: 2.6 },
    { mult: 2, amp: 0.45, decay: 3.4 },
    { mult: 3, amp: 0.24, decay: 4.6 },
    { mult: 4, amp: 0.14, decay: 6.0 },
    { mult: 6, amp: 0.07, decay: 8.0 },
  ];
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const attack = Math.min(1, t / 0.004);
    let s = 0;
    for (const p of partials) {
      s += p.amp * Math.sin(2 * Math.PI * freq * p.mult * t) * Math.exp(-t * p.decay);
    }
    out[i] = softClip(s * attack * 0.34);
  }
  return out;
}

function kick(dur = 0.55) {
  const n = Math.floor(SR * dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const f = 45 + 90 * Math.exp(-t * 32); // pitch drop
    const env = Math.exp(-t * 6.5);
    const click = i < 40 ? noise() * 0.3 * (1 - i / 40) : 0;
    out[i] = softClip((Math.sin(2 * Math.PI * f * t) + click) * env);
  }
  return out;
}

function snare(dur = 0.26) {
  const n = Math.floor(SR * dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 22);
    const body = (Math.sin(2 * Math.PI * 180 * t) + Math.sin(2 * Math.PI * 260 * t)) * 0.3;
    out[i] = softClip((noise() * 0.9 + body) * env * 0.8);
  }
  return out;
}

// Filtered noise hat (crude one-pole high-pass on white noise).
function hat(dur = 0.09, decay = 55) {
  const n = Math.floor(SR * dur);
  const out = new Float32Array(n);
  let prev = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const x = noise();
    const hp = x - prev;
    prev = x;
    out[i] = hp * Math.exp(-t * decay) * 0.55;
  }
  return out;
}

function clap(dur = 0.32) {
  const n = Math.floor(SR * dur);
  const out = new Float32Array(n);
  const bursts = [0, 0.011, 0.022, 0.034]; // staggered slaps
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let amp = 0;
    for (const b of bursts) {
      if (t >= b) amp += Math.exp(-(t - b) * 90);
    }
    const tail = Math.exp(-t * 14);
    out[i] = softClip(noise() * Math.min(1, amp) * tail * 0.7);
  }
  return out;
}

function tom(freq = 150, dur = 0.42) {
  const n = Math.floor(SR * dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const f = freq * (1 + 0.4 * Math.exp(-t * 18));
    out[i] = softClip(Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 8) * 0.85);
  }
  return out;
}

function rim(dur = 0.07) {
  const n = Math.floor(SR * dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 90);
    out[i] = softClip((Math.sin(2 * Math.PI * 1700 * t) + noise() * 0.5) * env);
  }
  return out;
}

// Sub-bass note for the last pad — playable low E.
function bass(freq = 82.41, dur = 0.8) {
  const n = Math.floor(SR * dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.006) * Math.exp(-t * 3.2);
    const tri = Math.asin(Math.sin(2 * Math.PI * freq * t)) * (2 / Math.PI);
    out[i] = softClip((Math.sin(2 * Math.PI * freq * t) * 0.7 + tri * 0.3) * env * 0.9);
  }
  return out;
}

// ── Pad map ──────────────────────────────────────────────────────────────────
// E natural-minor scale on the 8 piano pads; a drum kit on the rest.
const NOTE = {
  E4: 329.63, Fs4: 369.99, G4: 392.0, A4: 440.0,
  B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25,
};

const pads = [
  () => piano(NOTE.E4),  // 1  Piano 1
  () => piano(NOTE.Fs4), // 2  Piano 2
  () => piano(NOTE.G4),  // 3  Piano 3
  () => piano(NOTE.A4),  // 4  Piano 4
  () => piano(NOTE.B4),  // 5  Piano 5
  () => piano(NOTE.C5),  // 6  Piano 6
  () => piano(NOTE.D5),  // 7  Piano 7
  () => piano(NOTE.E5),  // 8  Piano 8
  () => kick(),          // 9  Beat Loop
  () => snare(),         // 10 LOOKATCHA
  () => hat(0.08, 60),   // 11 Beau. Stars  (closed hat)
  () => clap(),          // 12 Ladies & Gents
  () => hat(0.34, 12),   // 13 Hey!         (open hat)
  () => tom(),           // 14 Stop
  () => rim(),           // 15 Camera
  () => bass(),          // 16 Info
];

// ── Write files ──────────────────────────────────────────────────────────────
mkdirSync(OUT_DIR, { recursive: true });
pads.forEach((make, i) => {
  const name = `pad-${String(i + 1).padStart(2, "0")}.wav`;
  const wav = encodeWav(make());
  writeFileSync(join(OUT_DIR, name), wav);
  console.log(`  ${name}  ${(wav.length / 1024).toFixed(0)} KB`);
});
console.log(`\n✓ 16 samples written to ${OUT_DIR}`);

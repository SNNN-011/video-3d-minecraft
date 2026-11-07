// Bikin sound effect 8-bit/chiptune dari kode -> public/sfx/*.wav
// Semua SFX di-normalisasi ke loudness (RMS) yang sama, jadi volume antar-efek rata.
import fs from 'node:fs';
const SR = 44100, TAU = Math.PI * 2;
const TARGET_RMS = 0.2; // ubah ini kalau mau SEMUA SFX lebih keras/pelan
fs.mkdirSync('public/sfx', {recursive: true});

const normalize = (arr) => {
  const win = Math.floor(0.25 * SR), step = Math.floor(0.05 * SR);
  let maxRms = 1e-6;
  for (let s = 0; s + 1 < arr.length; s += step) {
    const e = Math.min(arr.length, s + win);
    let sum = 0;
    for (let i = s; i < e; i++) sum += arr[i] * arr[i];
    maxRms = Math.max(maxRms, Math.sqrt(sum / (e - s)));
  }
  const g = TARGET_RMS / maxRms, fade = Math.floor(0.004 * SR);
  return arr.map((v, i) => {
    const env = Math.min(1, i / fade, (arr.length - i) / fade);
    return Math.tanh(v * g * 1.1) * 0.95 * env; // soft limiter, anti clipping
  });
};
const save = (name, raw) => {
  const arr = normalize(raw), n = arr.length, buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  arr.forEach((v, i) => buf.writeInt16LE(Math.round(v * 32000), 44 + i * 2));
  fs.writeFileSync(`public/sfx/${name}.wav`, buf);
};
const make = (d, fn) => Array.from({length: Math.floor(d * SR)}, (_, i) => fn(i / SR, i / (d * SR), i));
const sweep = (d, f0, f1, wave, env) => { let ph = 0; return make(d, (t, p) => { ph += (TAU * (f0 + (f1 - f0) * p)) / SR; return wave(ph) * env(p); }); };
const sin = Math.sin, sq = (x) => Math.sign(Math.sin(x)) * 0.5, saw = (x) => ((x / TAU) % 1) * 2 - 1;
const mix = (...a) => Array.from({length: Math.max(...a.map((x) => x.length))}, (_, i) => a.reduce((s, x) => s + (x[i] || 0), 0));
const pad = (sec, arr) => [...new Array(Math.floor(sec * SR)).fill(0), ...arr];
const cat = (...a) => a.flat();
const noise = () => Math.random() * 2 - 1;
const bell = (f, d) => sweep(d, f, f, sin, (p) => Math.exp(-5 * p));

const riser = (d) => { let y = 0; return mix(
  make(d, (t, p) => { y += (0.01 + 0.4 * p) * (noise() - y); return y * p * p * 3; }),
  sweep(d, 200, 1400, saw, (p) => p * p * 0.5)); };

save('pop', sweep(0.14, 900, 300, sin, (p) => Math.exp(-5 * p)));
save('tick', sweep(0.04, 1400, 1100, sq, (p) => Math.exp(-6 * p)));
save('coin', cat(sweep(0.07, 988, 988, sq, () => 0.5), sweep(0.4, 1319, 1319, sq, (p) => Math.exp(-5 * p) * 0.5)));
save('ding', mix(bell(1568, 0.6), bell(2352, 0.6).map((v) => v * 0.5)));
save('notif', cat(sweep(0.12, 1319, 1319, sin, (p) => Math.exp(-4 * p)), sweep(0.4, 1760, 1760, sin, (p) => Math.exp(-5 * p))));
save('cash', mix(make(0.05, () => noise() * 0.6), pad(0.06, bell(2093, 0.6)), pad(0.14, bell(2637, 0.6))));
save('whoosh', (() => { let y = 0; return make(0.55, (t, p) => { y += (0.02 + 0.5 * sin(Math.PI * p)) * (noise() - y); return y * sin(Math.PI * p) * 3; }); })());
save('boom', mix(sweep(1.2, 110, 35, sin, (p) => Math.exp(-3 * p)), make(1.2, (t) => (t < 0.15 ? noise() * Math.exp(-t * 30) * 0.8 : 0))));
save('stamp', mix(sweep(0.3, 140, 50, sin, (p) => Math.exp(-8 * p)), make(0.3, (t) => (t < 0.05 ? noise() * 0.6 : 0))));
save('block', mix(sweep(0.2, 220, 70, sin, (p) => Math.exp(-9 * p)), make(0.2, (t) => (t < 0.06 ? noise() * Math.exp(-t * 60) : 0))));
save('engine', sweep(1.5, 70, 330, saw, (p) => Math.min(1, p * 8) * (1 - p * 0.4)));
save('glitch', (() => { let h = 0; return make(0.35, (t, p, i) => { if (i % 90 === 0) h = noise(); return h * (1 - p); }); })());
save('riser', riser(1.4));
save('riser_s', riser(1.0));
// "womp womp" sedih
save('sad', cat(
  sweep(0.15, 392, 392, saw, () => 0.5), sweep(0.15, 370, 370, saw, () => 0.5), sweep(0.15, 349, 349, saw, () => 0.5),
  (() => { let ph = 0; return make(0.35, (t, p) => { ph += (TAU * (311 + sin(t * 40) * 6)) / SR; return saw(ph) * 0.5 * (1 - p * 0.5); }); })(),
));
console.log('SFX jadi di public/sfx/ (semua volume dirata-ratakan)');

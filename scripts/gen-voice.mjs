// Generate narasi TTS via OpenRouter (HeyGen Voice Turbo, PCM 44.1kHz mono) -> public/voice/<slug>/*.wav
// Plus hitung timing per kata buat subtitle -> src/episodes/<slug>/voice-data.json
//
// Pakai:
//   set OPENROUTER_API_KEY=sk-or-...      (PowerShell: $env:OPENROUTER_API_KEY="sk-or-...")
//   node scripts/gen-voice.mjs <slug>            (skip file yang sudah ada)
//   node scripts/gen-voice.mjs <slug> --force    (generate ulang semua)
// <slug> = nama folder di src/episodes/ (mis. pajak-motor).
import fs from 'node:fs';
import path from 'node:path';

const SR = 44100; // HeyGen Voice Turbo: 44.1 kHz mono PCM 16-bit LE
const force = process.argv.includes('--force');
const slug = process.argv.slice(2).find((a) => !a.startsWith('--'));
if (!slug) {
  console.error('Slug episode belum diisi. Contoh: node scripts/gen-voice.mjs pajak-motor');
  process.exit(1);
}
const EPISODE_DIR = `src/episodes/${slug}`;
const OUT_DIR = `public/voice/${slug}`;
const DATA_FILE = `${EPISODE_DIR}/voice-data.json`;
const SCRIPT_FILE = `${EPISODE_DIR}/voice.json`;
const API = 'https://openrouter.ai/api/v1/audio/speech';

const script = JSON.parse(fs.readFileSync(SCRIPT_FILE, 'utf8'));
const key = process.env.OPENROUTER_API_KEY;

if (!key) {
  console.error(
    '\nOPENROUTER_API_KEY belum di-set.\n' +
      'PowerShell : $env:OPENROUTER_API_KEY="sk-or-..."\n' +
      'CMD        : set OPENROUTER_API_KEY=sk-or-...\n' +
      'Key gratis  : https://openrouter.ai/keys\n',
  );
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, {recursive: true});

const wav = (pcm) => {
  const buf = Buffer.alloc(44 + pcm.length);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + pcm.length, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(pcm.length, 40);
  pcm.copy(buf, 44);
  return buf;
};

// Timing per kata: bobot ~jumlah huruf + jeda tanda baca. Cukup akurat buat caption 1-3 detik.
const wordTimings = (text, ms) => {
  const words = text.trim().split(/\s+/);
  const weight = (w) => {
    const letters = w.replace(/[^\p{L}\p{N}]/gu, '').length;
    const pause = /[.!?]$/.test(w) ? 5 : /[,;:]$/.test(w) ? 2.5 : 0;
    return letters + pause + 1;
  };
  const total = words.reduce((s, w) => s + weight(w), 0);
  const lead = Math.min(90, ms * 0.04);
  const span = ms - lead - Math.min(120, ms * 0.05);
  let t = lead;
  return words.map((w) => {
    const d = (weight(w) / total) * span;
    const out = {w, from: Math.round(t), to: Math.round(t + d)};
    t += d;
    return out;
  });
};

// potong silence di awal/akhir biar cue visual pas dengan suara
const trim = (pcm, th = 300, padStart = 0.04, padEnd = 0.12) => {
  const n = pcm.length / 2;
  let a = 0, z = n - 1;
  while (a < n && Math.abs(pcm.readInt16LE(a * 2)) <= th) a++;
  if (a === n) return pcm; // audio kosong, biarin apa adanya
  while (z > a && Math.abs(pcm.readInt16LE(z * 2)) <= th) z--;
  const from = Math.max(0, a - Math.round(padStart * SR));
  const to = Math.min(n, z + Math.round(padEnd * SR));
  return pcm.subarray(from * 2, to * 2);
};

// normalisasi peak ke 0.98 biar narasi nggak tenggelam sama SFX (idempoten)
const normalizeWav = (file) => {
  const buf = fs.readFileSync(file);
  const n = (buf.length - 44) / 2;
  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(buf.readInt16LE(44 + i * 2)));
  if (!peak) return;
  const g = Math.min(4, (0.98 * 32768) / peak);
  if (g < 1.01) return;
  for (let i = 0; i < n; i++) {
    const v = Math.round(buf.readInt16LE(44 + i * 2) * g);
    buf.writeInt16LE(Math.max(-32768, Math.min(32767, v)), 44 + i * 2);
  }
  fs.writeFileSync(file, buf);
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const synth = async (line) => {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://localhost',
        'X-Title': `video-3d-minecraft/${slug}`,
      },
      body: JSON.stringify({
        model: script.model,
        input: line.text,
        voice: script.voice,
        response_format: 'pcm',
        provider: {options: {heygen: {language: script.language}}},
      }),
    });

    if (res.ok) {
      const type = res.headers.get('content-type') || '';
      const bytes = Buffer.from(await res.arrayBuffer());
      if (!type.includes('pcm')) {
        throw new Error(`format tak terduga (${type}): ${bytes.toString('utf8').slice(0, 300)}`);
      }
      return bytes;
    }

    const body = await res.text();
    if (res.status === 429 || res.status >= 500) {
      const wait = attempt * 3000;
      console.warn(`  ${res.status} ${line.id}, retry ${attempt}/4 dalam ${wait}ms`);
      await sleep(wait);
      continue;
    }
    throw new Error(`${res.status} ${line.id}: ${body.slice(0, 500)}`);
  }
  throw new Error(`gagal setelah 4 percobaan: ${line.id}`);
};

const old = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) : {lines: []};
const oldById = new Map((old.lines || []).map((l) => [l.id, l]));
const out = [];

for (const line of script.lines) {
  const file = path.join(OUT_DIR, `${line.id}.wav`);
  const cached = oldById.get(line.id);
  const reuse = !force && cached && cached.text === line.text && fs.existsSync(file);
  if (reuse) {
    out.push(cached);
    console.log(`skip ${line.id} (${(cached.ms / 1000).toFixed(2)}s)`);
    continue;
  }

  process.stdout.write(`tts  ${line.id} ... `);
  const pcm = trim(await synth(line));
  if (pcm.length % 2) throw new Error(`PCM ganjil buat ${line.id}`);
  fs.writeFileSync(file, wav(pcm));
  const ms = (pcm.length / 2 / SR) * 1000;
  out.push({id: line.id, text: line.text, ms: Math.round(ms), frames: Math.ceil((ms / 1000) * 30), words: wordTimings(line.text, ms)});
  console.log(`${(ms / 1000).toFixed(2)}s`);
}

fs.writeFileSync(
  DATA_FILE,
  JSON.stringify({generatedAt: new Date().toISOString(), model: script.model, voice: script.voice, lines: out}, null, 2) + '\n',
);

// buang wav yang barisnya sudah nggak ada di voice.json
const keep = new Set(script.lines.map((l) => `${l.id}.wav`));
for (const f of fs.readdirSync(OUT_DIR)) {
  if (f.endsWith('.wav') && !keep.has(f)) {
    fs.unlinkSync(path.join(OUT_DIR, f));
    console.log(`hapus ${f} (tidak dipakai)`);
  } else if (f.endsWith('.wav')) {
    normalizeWav(path.join(OUT_DIR, f));
  }
}

const total = out.reduce((s, l) => s + l.ms, 0);
console.log(`\n${out.length} baris, total bicara ${(total / 1000).toFixed(1)}s -> ${DATA_FILE}`);

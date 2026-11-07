---
name: video-3d-minecraft
description: Produksi video explainer vertikal 1080x1920 bergaya voxel 8-bit dengan narasi TTS Bahasa Indonesia, subtitle karaoke, SFX chiptune, dan angka yang diverifikasi dari sumber. Pakai saat membuat episode baru ("kenapa X mahal di Indonesia"), mengubah harga/naskah, atau render ulang video Remotion di repo ini.
---

# SKILL — Video Explainer 8-bit (Remotion)

Panduan kerja teknis. Aturan gaya ada di `STYLES.md`, aturan kerja agen ada di `AGENTS.md`.

## Output

- Video vertikal 1080x1920, 30 fps, H.264 + AAC, durasi **ditentukan durasi narasi** (bukan angka tetap).
- Episode contoh: `out/pajak-motor.mp4` (73,6 detik, 29,1 MB) — 4 motor, hitungan pajak, outro CTA.
- Semua audio dan subtitle di-generate, bukan dicari di internet.

## Peta file

| File | Peran |
|---|---|
| `src/data.ts` | Sumber kebenaran angka: `BIKES[]` (`abroadJt`, `indoJt`), `RATES`, `breakdown()`, `fmt()`. Komentar di atas file mencatat sumber & kurs. |
| `src/voice.json` | Naskah TTS. Tiap baris: `{id, scene, at, text}`. `scene` = `hook` \| id motor \| `tax` \| `outro`. |
| `scripts/gen-voice.mjs` | TTS OpenRouter → `public/voice/<id>.wav` (44,1 kHz mono 16-bit) + `src/voice-data.json` (durasi, frame, timing kata). Cache per teks, trim silence, normalisasi peak 0,98, hapus WAV yatim. |
| `src/voice-data.json` | **Hasil generate. Jangan diedit tangan.** Sumber durasi & kata untuk subtitle. |
| `src/timeline.ts` | Turunan timeline: `SCENES`, `TOTAL_FRAMES`, `CUES`, `cueStart()`, `cueEnd()`. Anti-tumpuk antar baris. |
| `src/scenes.tsx` | `Hook`, `BikeScene`, `Tax`, `Outro`. Semua kemunculan visual dipicu `cueStart`/`cueEnd`. |
| `src/Voice.tsx` | Playback WAV per cue + subtitle karaoke (1 baris, chunk pendek). |
| `src/ui.tsx` | `Txt`, `Panel`, `Sfx`, `Sky`, `SafeGuide`, `SAFE`, `FONT`, `FontLoader`, `usePop`. |
| `src/VoxelBike.tsx` | `BikeStage`/`VoxelBike`: motor & ground dari box 3D, warna dari `bike.primary`/`accent`/`wings`. |
| `src/Main.tsx` | Komposisi global (Sky + scenes + Voice + FontLoader). |
| `src/Root.tsx` | `Composition` 1080x1920, fps 30, `durationInFrames=TOTAL_FRAMES`. |
| `remotion.config.ts` | `Config.setChromiumOpenGlRenderer('angle')` — wajib untuk three.js. |
| `scripts/gen-sfx.mjs` | SFX chiptune procedural → `public/sfx/*.wav`, semua di-normalisasi ke RMS 0,2. |
| `public/fonts/PressStart2P-latin.woff2` | Font pixel lokal, dipakai lewat `FontLoader`. |
| `public/voice/`, `public/sfx/` | Aset audio hasil generate. |

## Alur produksi

### 1. Riset angka (wajib sebelum menulis kode)

- Harga luar negeri: MSRP resmi pabrikan (US) + destination charge, konversi kurs beli/jual yang dicatat.
- Harga Indonesia: OTR resmi (oto.com / dealer / rilis pers), bukan hasil hitung sendiri.
- Catat sumber + tanggal + kurs di komentar `src/data.ts`. Tanpa sumber, jangan tampilkan angka.

### 2. Update `src/data.ts`

- `abroadJt` dan `indoJt` dalam **juta rupiah**.
- Urutan `BIKES` penting: **`BIKES[0]` dipakai hook**. Taruh motor dengan kenaikan paling dramatis di depan.
- `breakdown()` menghitung komponen pajak lalu diskalakan (`k`) supaya total pas `indoJt`. Ini estimasi porsi, bukan hitungan legal.
- `fmt()`: ≥1000 → `Rp1,24 Miliar`, di bawah → `Rp380 jt`.

### 3. Update `src/voice.json`

- Angka di naskah **ditulis sebagai kata** (`tiga ratus delapan puluh juta`), harus sama dengan `data.ts`.
- Satu baris = satu pemicu visual. Jangan gabung dua aksi dalam satu baris.
- `id` unik; dipakai `scenes.tsx` lewat `cueStart('<id>')`.
- Mengubah `text` = baris itu di-generate ulang; `id` baru = WAV baru; `id` dihapus = WAV ikut dihapus.

### 4. Generate TTS

```powershell
$env:OPENROUTER_API_KEY='sk-or-...'
npm run voice          # skip baris yang teksnya sama (cache)
npm run voice:force    # generate ulang semua
```

Model wajib `heygen/heygen-voice-1-turbo:free`, voice `bram`, `language: id`.

### 5. Cek sinkron (cepat, sebelum render)

```powershell
node -e "const d=require('./src/voice-data.json'),s=require('./src/voice.json');const m=new Map(d.lines.map(l=>[l.id,l.text]));const bad=s.lines.filter(l=>m.get(l.id)!==l.text);console.log('baris',d.lines.length,'tidak sinkron',bad.map(b=>b.id).join(',')||'-')"
```

Harus `tidak sinkron -`. Kalau ada, TTS belum di-regenerate; subtitle akan menampilkan teks lama.

### 6. Render still + cek visual

```powershell
npx tsc --noEmit
npx remotion still PajakMotor out/still-hook.png --frame=290 --timeout=60000
npx remotion still PajakMotor out/still-tax.png --frame=1960 --timeout=60000
```

Cek pakai subagent `vision`: angka panel cocok dengan narasi, total = jumlah komponen, subtitle tidak menabrak konten. Hapus still setelah selesai.

### 7. Render final

```powershell
npx remotion render PajakMotor out/pajak-motor.mp4 --timeout=60000 --log=info
ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_type,codec_name,width,height,r_frame_rate -of default=noprint_wrappers=1 out/pajak-motor.mp4
```

Target: H.264 + AAC, 1080x1920, 30/1, durasi ≈ `TOTAL_FRAMES / 30`.

## Aturan keras

1. **Timeline tidak diedit tangan.** Durasi scene diturunkan dari `voice-data.json`; kalau narasi panjang, scene molor otomatis.
2. **Satu baris narasi = satu cue.** Visual yang muncul tanpa cue pasti tidak sinkron.
3. **Font lokal, bukan Google Fonts.** `loadFont()` dari `@remotion/google-fonts` bikin render timeout saat koneksi putus. Pakai `FontLoader` + `public/fonts/`.
4. **Volume:** SFX default `0.3`, narasi dinormalisasi `0.98` oleh `gen-voice.mjs`. Jangan kembalikan SFX ke `1`.
5. **`voice-data.json` bebas BOM** dan hanya ditulis script.
6. **Angka tampil ≠ angka narasi** hanya boleh beda format (kata vs `fmt()`), nilainya wajib sama.
7. **Jangan simpan API key** di repo, naskah, atau commit.
8. Selalu render dengan `--timeout=60000` (default 30 detik terlalu pendek untuk tiga.js + font).

## Jebakan & solusi

| Gejala | Sebab | Solusi |
|---|---|---|
| `429 free-models-per-day` | Free tier OpenRouter = 50 request/hari, reset 00:00 UTC | Tunggu reset, pakai key lain, atau top up |
| Render gagal `Timeout ... Press Start TwoP` | Browser tidak bisa akses `fonts.gstatic.com` | Pastikan `FontLoader` + `public/fonts/` dipakai, jangan `loadFont()` |
| Subtitle masih angka lama | `voice-data.json` belum di-generate ulang | `npm run voice`, cek langkah 5 |
| TTS tenggelam | SFX `volume=1` | Default `Sfx` = `0.3`; narasi peak `0,98` |
| `JSON.parse` gagal | File JSON ber-BOM | Tulis UTF-8 tanpa BOM |
| `PCM ganjil buat <id>` | Response TTS bukan PCM utuh | Cek `content-type: audio/pcm`; ulangi baris itu |
| Scene 3D hitam/blank saat render | Renderer Chromium salah | `Config.setChromiumOpenGlRenderer('angle')` di `remotion.config.ts` |
| Ada WAV tidak terpakai | `id` di `voice.json` berubah/dihapus | Script otomatis menghapus saat `npm run voice` |
| Hook beda dengan panel | Angka hook di-hardcode | Ambil dari `BIKES[0].abroadJt` / `BIKES[0].indoJt` |
| Video terasa "melompat" | `at` baris terlalu rapat | `timeline.ts` memberi `GAP=4`; biarkan, atau kecilkan `at` baris sebelumnya |

## Checklist rilis

- [ ] `npx tsc --noEmit` bersih
- [ ] `voice-data.json` sinkron dengan `voice.json` (langkah 5)
- [ ] Jumlah WAV = jumlah baris, durasi WAV cocok dengan `frames`
- [ ] Still hook/bike/tax/outro sudah dicek via `vision`
- [ ] Total panel = jumlah komponen; angka narasi = angka panel
- [ ] Subtitle tidak menutupi panel/quip
- [ ] Volume: narasi dominan, SFX tidak menutupi
- [ ] `out/*.mp4` durasi & codec sesuai target

## Log pelajaran (teknis)

- 2026-11-08 — Render gagal timeout font karena browser headless tidak bisa akses `fonts.gstatic.com` → font di-self-host (`public/fonts/`) + `FontLoader` dengan `delayRender`, jangan pakai `loadFont()`.
- 2026-11-08 — `npm run voice` gagal `429 hook-1` → free tier OpenRouter 50 request/hari (bukan kuota habis). Cek `/api/v1/credits` + header `x-ratelimit-*`, reset 00:00 UTC.
- 2026-11-08 — TTS terasa kecil → SFX default `1` menenggelamkan narasi → default `0.3` + normalisasi WAV narasi ke peak `0,98` (sekarang otomatis di `gen-voice.mjs`).
- 2026-11-08 — Harga di video lama salah → harga Indonesia wajib OTR resmi, harga luar negeri MSRP + destination charge, kurs dicatat di komentar `data.ts`.

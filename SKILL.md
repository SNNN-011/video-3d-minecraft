---
name: video-3d-minecraft
description: Produksi video explainer vertikal 1080x1920 bergaya voxel 8-bit dengan narasi TTS Bahasa Indonesia, subtitle karaoke, SFX chiptune, dan angka yang diverifikasi dari sumber. Pakai saat membuat episode baru ("kenapa X mahal di Indonesia"), mengubah harga/naskah, atau render ulang video Remotion di repo ini.
---

# SKILL — Video Explainer 8-bit (Remotion)

Panduan kerja teknis. Aturan gaya ada di `STYLES.md`, aturan kerja agen ada di `AGENTS.md`.

## Output

- Video vertikal 1080x1920, 30 fps, H.264 + AAC, durasi **ditentukan durasi narasi** (bukan angka tetap).
- Satu repo = banyak episode. Tiap episode punya komposisi sendiri, dirender dari root yang sama.
- Episode aktif: `PajakMotor` → `out/pajak-motor.mp4` (73,63 detik, 2209 frame) — 4 motor, hitungan pajak, outro CTA.
- Episode aktif tanpa narasi: `AiPlayground` → `out/ai-playground.mp4` (75 detik, 2250 frame) — timing masih hardcode, TTS menyusul.
- Episode bernarasi (HeyGen bram): `Diskon1111` → `out/diskon-1111.mp4` (97,1 detik, 2913 frame) — 26 cue, subtitle karaoke.
- Episode baru sejak refactor tidak butuh `npm install`: satu `node_modules` di root dipakai semua episode.
- Semua audio dan subtitle di-generate, bukan dicari di internet.

## Peta file

| File | Peran |
|---|---|
| `src/core/ui.tsx` | `Txt`, `Panel`, `Sfx`, `Sky`, `SafeGuide`, `SAFE`, `FONT`, `FontLoader`, `usePop`. Dipakai semua episode. |
| `src/core/voxels.tsx` | `Box`, `Stage`, `Ground`, `PixelGrid`, `PixelFrame`, `Robot`, `Person`, `Machine`. Satu-satunya sumber komponen 3D. |
| `src/core/arts.ts` | Pustaka pixel art 8x8 (`SELFIE`, `ANIME`, `CINEMA`, `CREEPER`, `CAT`, `LANDSCAPE`, `WARN`, ikon WORK/LEARN/PLAY, `MAP` Indonesia + `CELLS`/`RANK`). |
| `src/core/timeline.ts` | `buildTimeline()`: durasi scene diturunkan dari `voice-data.json`, `cueStart()`/`cueEnd()`, `CUES`. Generik per episode. |
| `src/core/Voice.tsx` | Playback WAV per cue + subtitle karaoke. Prop `slug` + `cues`. |
| `src/episodes/index.ts` | Registri: satu baris per episode aktif. |
| `src/episodes/<slug>/config.ts` | `id` (nama komposisi), `slug` (folder aset narasi), judul, `status`. |
| `src/episodes/<slug>/data.ts` | Sumber kebenaran angka topik + `fmt()`. Komentar di atas file mencatat sumber & kurs. |
| `src/episodes/<slug>/voice.json` | Naskah TTS. Tiap baris: `{id, scene, at, text}`. |
| `src/episodes/<slug>/voice-data.json` | **Hasil generate. Jangan diedit tangan.** Sumber durasi & kata untuk subtitle. |
| `src/episodes/<slug>/timeline.ts` | Panggil `buildTimeline()` dengan daftar scene episode (`key`, `group`, `min`, `tails`). |
| `src/episodes/<slug>/scenes.tsx` | Scene topik. Semua kemunculan visual dipicu `cueStart`/`cueEnd`. |
| `src/episodes/<slug>/Main.tsx` | Komposisi episode: `Sky` + scenes + `Voice` + `FontLoader`. |
| `scripts/gen-voice.mjs` | TTS OpenRouter → `public/voice/<slug>/<id>.wav` (44,1 kHz mono 16-bit) + `voice-data.json`. Cache per teks, trim silence, normalisasi peak 0,98, hapus WAV yatim. |
| `scripts/gen-sfx.mjs` | 22 SFX chiptune procedural → `public/sfx/*.wav`, semua di-normalisasi ke RMS 0,2. |
| `src/Main.tsx` | **Tidak ada.** Main per episode, di `src/episodes/<slug>/Main.tsx`. |
| `src/Root.tsx` | Loop registri → satu `Composition` 1080x1920, fps 30, per episode. |
| `remotion.config.ts` | `Config.setChromiumOpenGlRenderer('angle')` — wajib untuk three.js. |
| `public/fonts/PressStart2P-latin.woff2` | Font pixel lokal, dipakai lewat `FontLoader`. |
| `public/voice/<slug>/`, `public/sfx/` | Aset audio hasil generate. SFX & font dipakai bersama semua episode. |
| `arsip/` | Bahan mentah episode draft (tidak dikompilasi). |

## Bikin episode baru (tanpa `npm install`)

1. `src/episodes/<slug>/config.ts` — `id` unik, `slug` = nama folder, `status: 'aktif'`.
2. `src/episodes/<slug>/data.ts`, `voice.json`, `scenes.tsx`, `timeline.ts`, `Main.tsx` (pola dari `pajak-motor`).
3. Daftarkan satu baris di `src/episodes/index.ts`.
4. `node scripts/gen-voice.mjs <slug>` → WAV + `voice-data.json`.

Tidak ada `package.json` dan tidak ada `node_modules` di dalam folder episode. Dependency hanya di root, install sekali.


## Alur produksi

### 1. Riset angka (wajib sebelum menulis kode)

- Harga luar negeri: MSRP resmi pabrikan (US) + destination charge, konversi kurs beli/jual yang dicatat.
- Harga Indonesia: OTR resmi (oto.com / dealer / rilis pers), bukan hasil hitung sendiri.
- Catat sumber + tanggal + kurs di komentar `src/data.ts`. Tanpa sumber, jangan tampilkan angka.

### 2. Update `src/episodes/<slug>/data.ts`

- `abroadJt` dan `indoJt` dalam **juta rupiah**.
- Urutan `BIKES` penting: **`BIKES[0]` dipakai hook**. Taruh motor dengan kenaikan paling dramatis di depan.
- `breakdown()` menghitung komponen pajak lalu diskalakan (`k`) supaya total pas `indoJt`. Ini estimasi porsi, bukan hitungan legal.
- `fmt()`: ≥1000 → `Rp1,24 Miliar`, di bawah → `Rp380 jt`.

### 3. Update `src/episodes/<slug>/voice.json`

- Angka di naskah **ditulis sebagai kata** (`tiga ratus delapan puluh juta`), harus sama dengan `data.ts`.
- Satu baris = satu pemicu visual. Jangan gabung dua aksi dalam satu baris.
- `id` unik; dipakai `scenes.tsx` lewat `cueStart('<id>')`.
- Mengubah `text` = baris itu di-generate ulang; `id` baru = WAV baru; `id` dihapus = WAV ikut dihapus.

### 4. Generate TTS

```powershell
$env:OPENROUTER_API_KEY='sk-or-...'
node scripts/gen-voice.mjs pajak-motor          # skip baris yang teksnya sama (cache)
node scripts/gen-voice.mjs pajak-motor --force  # generate ulang semua
# npm run voice -- pajak-motor  (sama saja)
```

`<slug>` wajib = nama folder di `src/episodes/`. Output: `public/voice/<slug>/*.wav` + `src/episodes/<slug>/voice-data.json`. Satu slug tidak pernah menimpa episode lain.

Model wajib `heygen/heygen-voice-1-turbo:free`, voice `bram`, `language: id`.

### 5. Cek sinkron (cepat, sebelum render)

```powershell
node -e "const d=require('./src/episodes/pajak-motor/voice-data.json'),s=require('./src/episodes/pajak-motor/voice.json');const m=new Map(d.lines.map(l=>[l.id,l.text]));const bad=s.lines.filter(l=>m.get(l.id)!==l.text);console.log('baris',d.lines.length,'tidak sinkron',bad.map(b=>b.id).join(',')||'-')"
```

Harus `tidak sinkron -`. Kalau ada, TTS belum di-regenerate; subtitle akan menampilkan teks lama.

### 6. Render still + cek visual

```powershell
npx tsc --noEmit
npx remotion compositions        # harus muncul id episode, durasi ≈ out/*.mp4
npx remotion still PajakMotor out/still-hook.png --frame=290 --timeout=60000
npx remotion still PajakMotor out/still-tax.png --frame=1960 --timeout=60000
```

Cek pakai subagent `vision`: angka panel cocok dengan narasi, total = jumlah komponen, subtitle tidak menabrak konten. Hapus still setelah selesai.

Kalau audio dirapikan (folder narasi pindah/rename), cek cepat bahwa semua cue punya WAV:

```powershell
node -e "const v=require('./src/episodes/pajak-motor/voice-data.json'),fs=require('fs');const w=new Set(fs.readdirSync('public/voice/pajak-motor'));console.log('hilang',v.lines.filter(l=>!w.has(l.id+'.wav')).map(l=>l.id).join(',')||'-')"
```

### 7. Render final

```powershell
npx remotion render PajakMotor out/pajak-motor.mp4 --timeout=60000 --log=info
ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_type,codec_name,width,height,r_frame_rate -of default=noprint_wrappers=1 out/pajak-motor.mp4
```

Ganti `PajakMotor` dengan `id` di `src/episodes/<slug>/config.ts` untuk episode lain.

Target: H.264 + AAC, 1080x1920, 30/1, durasi ≈ `TOTAL_FRAMES / 30`.

## Aturan keras

1. **Timeline tidak diedit tangan.** Durasi scene diturunkan dari `voice-data.json`; kalau narasi panjang, scene molor otomatis.
2. **Satu baris narasi = satu cue.** Visual yang muncul tanpa cue pasti tidak sinkron.
3. **Font lokal, bukan Google Fonts.** `loadFont()` dari `@remotion/google-fonts` bikin render timeout saat koneksi putus. Pakai `FontLoader` + `public/fonts/`.
4. **Volume:** SFX default `0.2`, narasi dinormalisasi `0.98` (`gen-voice.mjs`) dan diputar `volume 1` (`Voice.tsx`). Jangan kembalikan SFX ke `1`.
5. **`voice-data.json` bebas BOM** dan hanya ditulis script.
6. **Angka tampil ≠ angka narasi** hanya boleh beda format (kata vs `fmt()`), nilainya wajib sama.
7. **Jangan simpan API key** di repo, naskah, atau commit.
8. Selalu render dengan `--timeout=60000` (default 30 detik terlalu pendek untuk tiga.js + font).
9. **Satu `package.json` dan satu `node_modules` di root.** Jangan pernah bikin `package.json`, `node_modules`, atau `npm install` di dalam `src/episodes/<slug>/` — dependency di-resolve dari root, episode baru cukup 5 file.
10. **Komponen 3D satu sumber.** `Box`/`Ground`/`Stage`/`PixelFrame`/`PixelGrid` hanya dari `src/core/voxels.tsx`. Jangan menyalin definisi ke file episode.
11. **Arsip tidak dikompilasi.** File di `arsip/` di luar `src/`, tidak ikut build; jangan import dari sana.

## Jebakan & solusi

| Gejala | Sebab | Solusi |
|---|---|---|
| `429 free-models-per-day` | Free tier OpenRouter = 50 request/hari, reset 00:00 UTC | Tunggu reset, pakai key lain, atau top up |
| Render gagal `Timeout ... Press Start TwoP` | Browser tidak bisa akses `fonts.gstatic.com` | Pastikan `FontLoader` + `public/fonts/` dipakai, jangan `loadFont()` |
| Subtitle masih angka lama | `voice-data.json` belum di-generate ulang | `node scripts/gen-voice.mjs <slug>`, cek langkah 5 |
| TTS tenggelam | SFX `volume=1` | Default `Sfx` = `0.3`; narasi peak `0,98` |
| `JSON.parse` gagal | File JSON ber-BOM | Tulis UTF-8 tanpa BOM |
| `PCM ganjil buat <id>` | Response TTS bukan PCM utuh | Cek `content-type: audio/pcm`; ulangi baris itu |
| Scene 3D hitam/blank saat render | Renderer Chromium salah | `Config.setChromiumOpenGlRenderer('angle')` di `remotion.config.ts` |
| Ada WAV tidak terpakai | `id` di `voice.json` berubah/dihapus | Script otomatis menghapus saat `gen-voice.mjs <slug>` |
| Hook beda dengan panel | Angka hook di-hardcode | Ambil dari `BIKES[0].abroadJt` / `BIKES[0].indoJt` |
| Video terasa "melompat" | `at` baris terlalu rapat | `timeline.ts` memberi `GAP=4`; biarkan, atau kecilkan `at` baris sebelumnya |
| Komposisi tidak muncul di studio | Episode belum didaftarkan | Tambah satu baris di `src/episodes/index.ts` |
| Cue berbunyi tapi tidak ada suara | Path `voice/<slug>/<id>.wav` beda | Samakan `slug` di `config.ts`, folder `public/voice/`, dan episode |
| `gen-voice` bilang slug kosong | Argumen slug tidak dikirim | `node scripts/gen-voice.mjs <slug>` (wajib) |
| Tertarik install ulang dependency | Ada `package.json` nyasar di folder episode | Hapus; dependency hanya di root |

## Checklist rilis

- [ ] `npx tsc --noEmit` bersih
- [ ] `npx remotion compositions` menampilkan episode dengan durasi yang benar
- [ ] `voice-data.json` sinkron dengan `voice.json` (langkah 5)
- [ ] Jumlah WAV = jumlah baris, durasi WAV cocok dengan `frames`, semua ada di `public/voice/<slug>/`
- [ ] Still hook/bike/tax/outro sudah dicek via `vision`
- [ ] Total panel = jumlah komponen; angka narasi = angka panel
- [ ] Subtitle tidak menutupi panel/quip
- [ ] Volume: narasi dominan, SFX tidak menutupi
- [ ] `out/*.mp4` durasi & codec sesuai target

## Log pelajaran (teknis)

- 2026-11-08 — Repo masih 1 topik (pajak motor) dan episode AI playground punya `node_modules` sendiri → satu root dengan `src/core/` + `src/episodes/<slug>/` + satu `package.json`; episode baru = 5 file, tanpa `npm install`; aset narasi per slug di `public/voice/<slug>/`.
- 2026-11-08 — `Box`/`Ground` didefinisikan dua kali (VoxelBike dan voxels) → satu sumber di `src/core/voxels.tsx`, episode mengimpor dari sana.
- 2026-11-08 — Render gagal timeout font karena browser headless tidak bisa akses `fonts.gstatic.com` → font di-self-host (`public/fonts/`) + `FontLoader` dengan `delayRender`, jangan pakai `loadFont()`.
- 2026-11-08 — `npm run voice` gagal `429 hook-1` → free tier OpenRouter 50 request/hari (bukan kuota habis). Cek `/api/v1/credits` + header `x-ratelimit-*`, reset 00:00 UTC.
- 2026-11-08 — TTS terasa kecil → SFX default `1` menenggelamkan narasi → default `0.2` + narasi diputar `volume 1` (peak `0,98` otomatis di `gen-voice.mjs`).
- 2026-11-08 — `gen-voice.mjs` gagal `429` padahal retry 4x → bukan rate per menit, tapi kuota free tier habis (63/50 request hari itu). Cek `GET /api/v1/key` → `free_model_daily_requests`; reset 00:00 UTC.
- 2026-11-08 — Narasi Diskon1111 (26 cue) membuat durasi 97,1 detik, bukan 60 detik → durasi ikut narasi (aturan repo), `min` scene hanya jaring pengaman; jangan paksa 60 detik dengan memotong audio.
- 2026-11-08 — Harga di video lama salah → harga Indonesia wajib OTR resmi, harga luar negeri MSRP + destination charge, kurs dicatat di komentar `data.ts`.

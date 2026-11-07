# STYLES — Gaya Visual, Copy, dan Audio

Acuan gaya episode. Aturan teknis di `SKILL.md`, aturan kerja agen di `AGENTS.md`.
Kalau ada koreksi gaya dari user, perbaiki dulu implementasinya, lalu tambahkan aturan di sini.

## 1. Format

| Item | Nilai |
|---|---|
| Rasio | Vertikal 1080x1920 (Reels/TikTok/Shorts) |
| FPS | 30 |
| Durasi | Ditentukan durasi narasi (`TOTAL_FRAMES`), bukan angka tetap |
| Palet rasa | Pixel/8-bit + voxel, warna cerah, kontras tinggi, outline hitam tebal |
| Bahasa | Indonesia santai, sapaan **"kamu"** (bukan "lo"/"gw") |

## 2. Palet

| Warna | Hex | Dipakai untuk |
|---|---|---|
| Langit atas | `#5fa8ff` | gradient `Sky` |
| Langit tengah | `#bfe0ff` | gradient 70% |
| Langit bawah | `#e8f4ff` | gradient |
| Rumput | `#5aa83c` / `#4f9a34` / `#63b343` | block ground |
| Tanah | `#7a5230` | sisi block ground |
| Garis tanah | `#3b7a28` | border atas ground |
| Panel terang | `#c6c6c6` | `Panel` default |
| Panel gelap | `#141414` | panel subtitle |
| Panel merah | `#b33` | panel "DI INDONESIA", total |
| Kuning aksen | `#ffe14d` | angka Indonesia, judul, kata aktif subtitle |
| Hijau angka | `#5dff6a` | harga luar negeri, CTA komen |
| Merah alert | `#ff4747` | harga Indonesia di hook, selisih |
| Teks | `#fff` | teks dasar |
| Outline/teks stroke | `#000` | semua teks |

Komponen tumpukan pajak (urutan bawah→atas): `#3d7bff` harga luar negeri, `#ff9f1c` bea masuk, `#e63946` PPnBM, `#9d4edd` PPN, `#ffd60a` PPh impor, `#8d99ae` BBN + admin.

## 3. Tipografi

- Font: **Press Start 2P**, di-host lokal (`public/fonts/PressStart2P-latin.woff2`).
- Semua teks pakai `Txt`: `textShadow` = `size/9` px hitam, `WebkitTextStroke` = `max(1, size/26)` px hitam, `paintOrder: stroke fill`.
- Teks di atas panel terang pakai `plain` (`textShadow: none`, stroke `0`) supaya tidak dobel outline.

| Ukuran | Pemakaian |
|---|---|
| 80 | angka besar di hook |
| 72 | "Rp1,2 MILIAR+" |
| 56 | nama motor |
| 54 | judul outro |
| 52 | nilai panel harga |
| 46 | judul section, "DI INDONESIA?" |
| 40 | subtitle |
| 38 | CTA/penegas |
| 34 | label kecil, quip outro |
| 30 | brand motor |
| 28 | label panel, keterangan |
| 26 | baris tumpukan pajak, label total |
| 22 | disclaimer |

## 4. Komponen

- **Panel** (`core/ui.tsx`): `background` default `#c6c6c6`, border 10px `#fff #555 #555 #fff`, outline 8px `#000`, padding `26px 30px`. Ini satu-satunya gaya panel; jangan bikin varian baru.
- **Txt**: selalu pakai komponen ini, jangan `<div>` dengan font manual.
- **Sky**: gradient + awan putih bergerak (`f * 0.8–2.2`) + strip ground. Kecepatan awan per index, jangan diubah tanpa alasan.
- **BikeStage**: `top`/`height`/`zoom` per scene; motor berputar `f * 0.035`, roda `f * 0.3`.
- **Sfx**: default volume `0.3`. Butuh lebih pelan → turunkan default, bukan menambah `volume` di tiap pemanggilan.

## 5. Safe zone

`SAFE = {top: 220, bottom: 400, side: 100}` — UI platform (caption/tombol) memakan area bawah ±400 px dan atas ±220 px. Jangan menaruh teks penting di luar area ini. `SHOW_SAFE_GUIDE` hanya untuk debug.

Posisi tetap yang dipakai:
- Judul scene: `top: SAFE.top`
- Panel harga bike: `top: 905` (luar negeri), `top: 1125` (Indonesia), selisih `1345`, quip `1415`
- Tumpukan pajak: `bottom: 730`, tinggi bar `max(66, value/total * 650)` px
- Panel total: `top: 1215`, disclaimer `1430`
- Subtitle: `bottom: 280`

## 6. Subtitle (karaoke)

- Sumber teks: `src/episodes/<slug>/voice-data.json` (`words` dengan `from`/`to` ms). Bukan dari `voice.json`.
- Pecah maks **17 karakter** atau **4 kata** per potongan, selalu **satu baris**.
- Kata aktif: `#ffe14d`. Kata lain: `#fff`.
- Panel subtitle: `Panel bg="#141414"`, padding `18px 24px`, `maxWidth: 900`, teks `size 40`.
- Fade in 2 frame di awal cue.
- Jangan menampilkan subtitle saat tidak ada cue.

## 7. Motion

| Gerak | Parameter |
|---|---|
| Pop umum | `usePop(start)` = spring `damping 9`, `stiffness 180` |
| Pop teks besar hook | `usePop(t3, 6)` (lebih "hentak") |
| Tumpukan pajak | spring `damping 12`, `stiffness 140`, masuk dari `translateY(-900px)` |
| Hitung angka | `interpolate` + `Easing.out(Easing.cubic)`, dari cue mulai+4 sampai cue akhir−2 |
| Shake hook | `sin(f * 2.9) * 16`, melemah dalam 30 frame |
| Flash hook | putih penuh selama 7 frame setelah "Rp…MILIAR+" |
| Stamp selisih | scale `1 + (1-stamp)*2`, rotasi `-4deg` |
| Quip | diketik `2.2` karakter/frame setelah narasi harga selesai |
| CTA komen | `translateY(sin(f*0.4)*10px)` |

Aturan: satu gerak per elemen, tidak ada animasi dekoratif yang tidak dipicu cue.

## 8. Struktur scene

| Scene | Durasi contoh | Beat |
|---|---|---|
| Hook | ±10,5 s (316 f) | harga luar negeri → "DI INDONESIA?" → "Rp…MILIAR+" + flash → "WOY SERIUS?!" |
| Bike ×4 | ±10,9 s (327 f) | nama motor → panel luar negeri (hitung naik + tick) → panel Indonesia (hitung naik + tick) → stamp selisih → quip |
| Tax | ±12,6 s (378 f) | judul → blok bea masuk → PPnBM → PPN → PPh → BBN+admin → total + disclaimer |
| Outro | ±6,9 s (207 f) | "MOTOR 1000cc" → "= BARANG MEWAH?" → pertanyaan → CTA komen → CTA follow |

Urutan motor: yang selisihnya paling dramatis di depan (`BIKES[0]` = hook).

## 9. Copywriting

- **Hook** = kontras harga, bukan cerita: `"<MOTOR> di luar negeri, <harga>. Kalau di Indonesia? <harga>!"`.
- Naskah ditulis sebagai **kata**, bukan digit: `tiga ratus delapan puluh juta`, `satu miliar dua ratus juta lebih`.
- Angka di layar memakai `fmt()` (`Rp380 jt`, `Rp1,24 Miliar`), nilainya wajib sama dengan naskah.
- **Quip** maksimal satu kalimat pendek, sarkas, boleh emoji: `Ini bukan beli motor, ini nyumbang ke negara 😭`.
- Emoji yang sudah dipakai: 💀 😭 🥲 ⚡ 🧱 🌍 🇮🇩 👇 🔔.
- Disclaimer wajib di scene pajak: `*ilustrasi hitungan <MOTOR>. tarif & harga bisa beda, cek aturan terbaru`.
- Sapaan **"kamu"**. Hindari "lo", "gw", "gue", "elu".
- CTA: satu pertanyaan + komen + follow. Jangan lebih dari 3 ajakan.

## 10. Audio

| Elemen | Aturan |
|---|---|
| TTS | `heygen/heygen-voice-1-turbo:free`, voice `bram`, `language: id`, PCM 44,1 kHz mono |
| Level narasi | Peak dinormalisasi `0,98` (otomatis di `gen-voice.mjs`) |
| Level SFX | File di-normalisasi RMS `0,2`; diputar pada `volume 0.3` |
| Hasil campuran | mean ≈ −19,7 dB, peak ≈ −2,0 dB; narasi ±8–10 dB di atas SFX |
| Trim | Silence awal/akhir dipotong (`padStart 0,04s`, `padEnd 0,12s`) |

Peta SFX per scene:

| Scene | SFX |
|---|---|
| Hook | `engine` 0, `pop` t1, `whoosh`+`glitch` t2, `riser` t2+2, `boom` t3, `sad` t4 |
| Bike | `whoosh` 0, `engine` 4, `pop` nama, `coin` akhir panel luar negeri, `tick` tiap 2 frame saat hitung, `pop` panel Indonesia, `tick` tiap 3 frame, `stamp` akhir narasi, `cash` +4 |
| Tax | `whoosh` 0, `block` per blok, `riser_s` total−30, `boom` total, `cash` total+2 |
| Outro | `whoosh` 0, `ding` t2, `pop` t3, `pop` t4, `notif` t5 |

## 11. Do / Don't

**Do**
- Pakai komponen dan token yang sudah ada (`Txt`, `Panel`, `SAFE`, warna di tabel).
- Pemicu visual dari `cueStart`/`cueEnd`, bukan frame hardcode.
- Dua kontrol sejenis tampil identik.
- Cek hasil dengan still + subagent `vision` sebelum render final.

**Don't**
- Bikin komponen panel/tombol/gaya baru tanpa diminta.
- Menaruh angka hardcode yang menduplikasi `data.ts` episode.
- Menambah font atau efek baru per episode.
- Menurunkan volume narasi untuk "menyeimbangkan" SFX — turunkan SFX.
- Menulis "lo"/"gw" di teks yang tampil atau di naskah.

## 12. Log perubahan gaya

- 2026-11-08 — Teks outro memakai "Menurut lo wajar nggak??" sementara narasi "Menurut kamu" → diseragamkan jadi **"kamu"**; sapaan "lo" dilarang.
- 2026-11-08 — Header hook menulis "R1" hardcode padahal motor pertama bisa berganti → pakai `BIKES[0].model`.
- 2026-11-08 — Disclaimer menulis "hitungan R1" padahal scene pajak memakai `BIKES[0]` (S1000RR) → disclaimer harus mengikuti motor yang dihitung.
- 2026-11-08 — Volume SFX `1` menenggelamkan narasi → default `0.3`, narasi peak `0,98`.

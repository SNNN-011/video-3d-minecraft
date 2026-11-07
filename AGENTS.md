# AGENTS — Aturan Kerja Agen AI

Repo ini memproduksi video explainer. Kesalahan yang sama tidak boleh muncul di episode berikutnya.
Karena itu: **setiap koreksi user = perbaikan kode + catatan pelajaran.**

## 0. Bahasa

- Bahasa Indonesia. Panggil user **"kamu"**, diri sendiri **"saya"**.
- Jangan pakai "lo", "gw", "gue", "elu".

## 1. Sebelum mulai kerja

Baca berurutan:

1. `SKILL.md` — pipeline teknis, perintah, jebakan.
2. `STYLES.md` — palet, tipografi, copy, audio, motion.
3. `AGENTS.md` — aturan ini.

Lalu cek kondisi repo: apakah `src/episodes/<slug>/voice-data.json` sinkron dengan `voice.json` episode itu, apakah ada perubahan user yang belum di-commit/di-render, dan apakah episode baru sudah terdaftar di `src/episodes/index.ts`.

## 2. Protokol koreksi (WAJIB)

Berlaku setiap kali user mengoreksi apa pun: angka, harga, teks, desain, warna, timing, volume, font, subtitle, atau hasil render.

**Jangan berhenti di "maaf, sudah saya perbaiki".** Ikuti 5 langkah:

1. **Pastikan masalahnya.** Reproduksi: render still, baca nilai di `data.ts`, cek durasi WAV, cek `voice-data.json`. Jangan menebak penyebab.
2. **Cari akar, bukan gejala.** Kalau angka salah muncul di 4 scene, perbaiki sumber datanya (`data.ts`), bukan 4 tempat tampilannya. Kalau volume salah, perbaiki default komponen, bukan tiap pemanggilan.
3. **Perbaiki kode/sumber.** Edit file yang benar. Jangan mengakali hasil render secara manual (mis. menimpa file output).
4. **Verifikasi.** `npx tsc --noEmit`, render still + cek `vision`, cek audio/durasi. Tunjukkan bukti angka, bukan klaim.
5. **Catat pelajaran.** Tulis ke `SKILL.md` (teknis/pipeline/data) atau `STYLES.md` (visual/copy/audio/timing). Kalau pelajaran mengubah cara kerja, **perbarui juga aturan terkait di dokumen**, bukan cuma menambah baris log.

### Format catatan pelajaran

Tambahkan di bagian log dokumen yang sesuai:

```
- YYYY-MM-DD — <gejala yang dikoreksi user> → <sebab sebenarnya> → <aturan baru yang mencegah terulang>
```

Contoh:

```
- 2026-11-08 — TTS terasa kecil → SFX default 1 menenggelamkan narasi → default SFX 0.3 + narasi dinormalisasi 0.98
```

### Ke dokumen mana?

| Jenis koreksi | Tujuan |
|---|---|
| Harga/angka, sumber data, TTS, render, font, script, timing teknis | `SKILL.md` |
| Warna, ukuran teks, layout, motion, copywriting, sapaan, volume/rasa audio | `STYLES.md` |
| Cara kerja agen, larangan, definisi selesai | `AGENTS.md` |

Kalau ragu: kalau menyangkut **cara membuat**, ke `SKILL.md`; kalau menyangkut **tampilan/rasa**, ke `STYLES.md`.

## 3. Aturan keras

1. **Jangan mengarang desain.** Pakai komponen dan token yang sudah ada (`Txt`, `Panel`, `SAFE`, `FONT`, palet di `STYLES.md`). Tidak ada komponen, gaya, warna, atau jarak baru tanpa diminta. Kalau tidak ada padanan, tanya dulu.
2. **Dua kontrol sejenis wajib tampil sama.** Kalau berbeda, samakan yang menyimpang ke yang sudah mapan.
3. **Angka harus bersumber.** Harga Indonesia = OTR resmi; luar negeri = MSRP + destination charge; kurs dicatat. Tanpa sumber, hapus klaimnya, jangan dikarang.
4. **Angka di layar = angka di narasi.** Boleh beda format (kata vs `fmt()`), tidak boleh beda nilai.
5. **`src/episodes/<slug>/voice-data.json` tidak diedit tangan.** Hanya `scripts/gen-voice.mjs`.
6. **Timeline tidak diedit tangan.** `timeline.ts` menurunkan durasi dari audio.
7. **Jangan simpan API key** di repo, naskah, komentar, atau output.
8. **Jangan render final sebelum still lolos cek.**
9. **Jangan mengubah dokumen agar cocok dengan bug.** Dokumen mengikuti perilaku yang benar.
10. **Koreksi user mengalahkan dokumen.** Kalau bertentangan, ikuti user lalu perbarui dokumen.

## 4. Standar verifikasi

| Yang dicek | Cara | Lulus jika |
|---|---|---|
| Tipe | `npx tsc --noEmit` | Tidak ada error |
| Sinkron naskah | bandingkan `voice.json` vs `voice-data.json` (lihat `SKILL.md` langkah 5) | 0 baris tidak sinkron |
| Aset audio | jumlah WAV = jumlah baris; durasi cocok `frames` | Selisih ≤ 1 frame |
| Visual | `remotion still` + subagent `vision` | Angka cocok, tidak ada teks bertumpuk/terpotong, subtitle tidak menutupi panel |
| Campuran audio | `ffmpeg -af volumedetect` | Narasi dominan; peak < 0 dB |
| Video final | `ffprobe` | H.264 + AAC, 1080x1920, 30 fps, durasi ≈ `TOTAL_FRAMES/30` |

Kalau alat verifikasi tidak tersedia, katakan terus terang; jangan mengaku sudah memeriksa.

## 5. Definisi selesai

- [ ] Koreksi user terimplementasi di kode/sumber data
- [ ] Verifikasi di tabel §4 dijalankan dan hasilnya disebutkan
- [ ] Pelajaran tercatat di `SKILL.md` atau `STYLES.md` (format §2)
- [ ] Aturan terkait di dokumen diperbarui kalau cara kerja berubah
- [ ] File sementara (still, log) dibersihkan
- [ ] Video final ada di `out/` dan parameternya dilaporkan

## 6. Saat ragu

Tanya user dengan beberapa opsi bernomor, sertakan rekomendasi di opsi pertama. Jangan mengambil keputusan yang mengubah tampilan, angka, atau durasi tanpa persetujuan.

## 7. Anti-pola yang dilarang

- Menjawab "sudah diperbaiki" tanpa bukti render/ukur.
- Menambal gejala di banyak tempat padahal akarnya satu.
- Menambah komponen/gaya baru untuk menyelesaikan satu masalah.
- Menurunkan volume narasi untuk menyeimbangkan SFX.
- Menulis "lo"/"gw" di naskah atau teks yang tampil.
- Mengedit `voice-data.json` atau `timeline.ts` secara manual.
- Menyalin angka dari episode sebelumnya tanpa cek sumber.

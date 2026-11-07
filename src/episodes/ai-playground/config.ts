// Episode draft: visual sudah dipindah ke src/core (arts.ts, voxels.tsx), SFX baru di scripts/gen-sfx.mjs.
// Scene asli masih tersimpan di arsip/ai-playground/ (frame hardcode, belum ada narasi).
//
// Cara menjadikan episode penuh (langkah terpisah, desain scene TIDAK diubah):
// 1. tulis naskah ke ./voice.json (pakai arsip/ai-playground-NASKAH.md sebagai bahan)
// 2. npm run voice -- ai-playground
// 3. pindahkan scenesA/scenesB dari arsip, ganti import ke ../../core/*,
//    ganti frame hardcode jadi cueStart()/cueEnd()
// 4. tambahkan ./Main.tsx (pola sama dengan episodes/pajak-motor/Main.tsx)
// 5. daftarkan satu baris di src/episodes/index.ts, ubah status jadi 'aktif'
export const CONFIG = {
  id: 'AiPlayground',
  slug: 'ai-playground',
  judul: 'AI is the new playground (Gen Z)',
  status: 'draft' as 'aktif' | 'draft',
};

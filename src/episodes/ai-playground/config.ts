// Episode AI playground (Gen Z).
// Status: aktif, tapi timing masih hardcode (belum ada narasi/TTS).
// Langkah menjadikan episode bernarasi (desain scene tidak diubah):
// 1. tulis ./voice.json (bahan: arsip/ai-playground-NASKAH.md)
// 2. node scripts/gen-voice.mjs ai-playground
// 3. ganti frame hardcode di scenesA/scenesB jadi cueStart()/cueEnd()
// 4. tambah <Voice slug={CONFIG.slug} cues={CUES} /> di Main.tsx
export const CONFIG = {
  id: 'AiPlayground',
  slug: 'ai-playground',
  judul: 'AI is the new playground (Gen Z)',
  status: 'aktif' as 'aktif' | 'draft',
};

// Nama channel di outro. Ganti ke nama channel asli.
export const CHANNEL = '@namachannel';

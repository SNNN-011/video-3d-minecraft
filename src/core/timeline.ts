// Timeline generik (dipakai semua episode).
// Durasi scene diturunkan dari durasi narasi tiap episode (voice-data.json),
// jadi kalau TTS-nya panjang, scene otomatis molor; subtitle & audio nggak pernah kepotong.
export type Line = {id: string; scene: string; at: number; text: string};
export type Word = {w: string; from: number; to: number};
export type VoiceLine = {id: string; text: string; frames: number; words?: Word[]};

// `key` menentukan MIN/TAIL; `group` menyamakan durasi beberapa scene (mis. semua scene motor).
export type SceneBase = {id: string; key: string; group?: string};

export type TimelineConfig<T extends SceneBase> = {
  lines: Line[];
  voice: VoiceLine[];
  scenes: T[];
  min: Record<string, number>;
  tails: Record<string, number>;
  gap?: number;
};

export type Cue = {id: string; text: string; start: number; frames: number; words: Word[]};

const GAP_DEFAULT = 4; // jeda antar baris narasi dalam satu scene

export const buildTimeline = <T extends SceneBase>({lines, voice, scenes, min, tails, gap = GAP_DEFAULT}: TimelineConfig<T>) => {
  const frames = new Map<string, number>(voice.map((l) => [l.id, l.frames]));

  // tiap baris narasi ditaruh setelah baris sebelumnya selesai (nggak mungkin tumpang tindih)
  const layout = new Map<string, {start: number; frames: number}>();
  const sceneEnd = new Map<string, number>();
  for (const s of scenes) {
    const sceneLines = lines.filter((l) => l.scene === s.id).sort((a, b) => a.at - b.at);
    let prev = -gap;
    for (const l of sceneLines) {
      // kalau TTS belum di-generate, pakai estimasi biar video tetap kelihatan wajar
      const f = frames.get(l.id) ?? Math.max(30, Math.round(l.text.length * 2));
      const start = Math.max(l.at, prev + gap);
      layout.set(l.id, {start, frames: f});
      prev = start + f;
    }
    sceneEnd.set(s.id, prev);
  }

  const dur = new Map<string, number>();
  for (const s of scenes) {
    dur.set(s.id, Math.ceil(Math.max(min[s.key] ?? 0, (sceneEnd.get(s.id) ?? 0) + (tails[s.key] ?? 0))));
  }
  // scene satu grup memakai durasi terpanjang di grupnya
  const groupMax = new Map<string, number>();
  for (const s of scenes) {
    if (s.group) groupMax.set(s.group, Math.max(groupMax.get(s.group) ?? 0, dur.get(s.id)!));
  }
  for (const s of scenes) {
    if (s.group) dur.set(s.id, groupMax.get(s.group)!);
  }

  let acc = 0;
  const SCENES = scenes.map((s) => {
    const d = dur.get(s.id)!;
    const from = acc;
    acc += d;
    return {...s, from, dur: d};
  });

  const CUES: Cue[] = voice.flatMap((l) => {
    const pos = layout.get(l.id);
    const scene = SCENES.find((s) => s.id === lines.find((x) => x.id === l.id)?.scene);
    if (!pos || !scene || !l.frames) return [];
    return [{id: l.id, text: l.text, start: scene.from + pos.start, frames: l.frames, words: l.words ?? []}];
  });

  /* ---------- timing lokal (frame di dalam scene) buat nyinkronin visual ke narasi ---------- */
  const cueStart = (id: string) => layout.get(id)?.start ?? 0;
  const cueEnd = (id: string) => {
    const l = layout.get(id);
    return l ? l.start + l.frames : 0;
  };

  return {SCENES, TOTAL_FRAMES: acc, CUES, cueStart, cueEnd};
};

// Timeline video diturunkan dari durasi narasi (src/voice-data.json).
// Jadi kalau TTS-nya panjang, scene otomatis molor; subtitle & audio nggak pernah kepotong.
import {BIKES, Bike} from './data';
import SCRIPT from './voice.json';
import DATA from './voice-data.json';

export type SceneKey = 'hook' | 'bike' | 'tax' | 'outro';
type Line = {id: string; scene: string; at: number; text: string};

const LINES = (SCRIPT as unknown as {lines: Line[]}).lines;
const VOICE_LINES = ((DATA as unknown as {lines: {id: string; frames: number}[]}).lines ?? []);
const FRAMES = new Map<string, number>(VOICE_LINES.map((l) => [l.id, l.frames]));

// durasi minimum tiap scene kalau narasi belum di-generate
const MIN: Record<SceneKey, number> = {hook: 135, bike: 165, tax: 270, outro: 120};
const GAP = 4; // jeda antar baris narasi dalam satu scene

const SCENE_IDS = ['hook', ...BIKES.map((b) => b.id), 'tax', 'outro'];

// tiap baris narasi ditaruh setelah baris sebelumnya selesai (nggak mungkin tumpang tindih)
const layout = new Map<string, {start: number; frames: number}>();
const sceneEnd = new Map<string, number>();
for (const sid of SCENE_IDS) {
  const lines = LINES.filter((l) => l.scene === sid).sort((a, b) => a.at - b.at);
  let prev = -GAP;
  for (const l of lines) {
    // kalau TTS belum di-generate, pakai estimasi biar video tetap kelihatan wajar
    const frames = FRAMES.get(l.id) ?? Math.max(30, Math.round(l.text.length * 2));
    const start = Math.max(l.at, prev + GAP);
    layout.set(l.id, {start, frames});
    prev = start + frames;
  }
  sceneEnd.set(sid, prev);
}

const TAILS: Record<SceneKey, number> = {hook: 20, bike: 26, tax: 20, outro: 20};

const bikeDur = Math.ceil(Math.max(MIN.bike, ...BIKES.map((b) => (sceneEnd.get(b.id) ?? 0) + TAILS.bike)));
const sceneDur = (key: SceneKey, sid: string) =>
  key === 'bike' ? bikeDur : Math.ceil(Math.max(MIN[key], (sceneEnd.get(sid) ?? 0) + TAILS[key]));

type SceneDef = {id: string; key: SceneKey; bike?: Bike};
const defs: SceneDef[] = [
  {id: 'hook', key: 'hook'},
  ...BIKES.map((bike) => ({id: bike.id, key: 'bike' as SceneKey, bike})),
  {id: 'tax', key: 'tax'},
  {id: 'outro', key: 'outro'},
];

let acc = 0;
export const SCENES = defs.map((d) => {
  const dur = sceneDur(d.key, d.id);
  const from = acc;
  acc += dur;
  return {...d, from, dur};
});

export const TOTAL_FRAMES = acc;

export type Cue = {
  id: string;
  text: string;
  start: number; // frame global
  frames: number;
  words: {w: string; from: number; to: number}[];
};

export const CUES: Cue[] = VOICE_LINES.flatMap((l) => {
  const pos = layout.get(l.id);
  const scene = SCENES.find((s) => s.id === LINES.find((x) => x.id === l.id)?.scene);
  if (!pos || !scene || !l.frames) return [];
  const words = (l as unknown as {words: Cue['words']}).words ?? [];
  return [{id: l.id, text: (l as unknown as {text: string}).text, start: scene.from + pos.start, frames: l.frames, words}];
});

/* ---------- timing lokal (frame di dalam scene) buat nyinkronin visual ke narasi ---------- */
export const cueStart = (id: string) => layout.get(id)?.start ?? 0;
export const cueEnd = (id: string) => {
  const l = layout.get(id);
  return l ? l.start + l.frames : 0;
};

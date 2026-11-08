// Timeline episode diskon-1111: durasi scene diturunkan dari narasi (voice-data.json).
import {Line, SceneBase, VoiceLine, buildTimeline} from '../../core/timeline';
import SCRIPT from './voice.json';
import DATA from './voice-data.json';

// min = durasi lama (sebelum ada narasi), dipakai kalau TTS lebih pendek.
const DEFS: SceneBase[] = [
  {id: 's1', key: 's1'},
  {id: 's2', key: 's2'},
  {id: 's3', key: 's3'},
  {id: 's4', key: 's4'},
  {id: 's5', key: 's5'},
  {id: 's6', key: 's6'},
];

export const TIMELINE = buildTimeline({
  lines: (SCRIPT as unknown as {lines: Line[]}).lines,
  voice: ((DATA as unknown as {lines: VoiceLine[]}).lines ?? []),
  scenes: DEFS,
  min: {s1: 180, s2: 360, s3: 330, s4: 300, s5: 330, s6: 300},
  tails: {s1: 14, s2: 14, s3: 14, s4: 14, s5: 14, s6: 14},
});

export const {SCENES, TOTAL_FRAMES, CUES, cueStart, cueEnd} = TIMELINE;

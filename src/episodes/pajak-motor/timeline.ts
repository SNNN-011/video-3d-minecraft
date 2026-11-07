// Timeline episode ini: mesin generik di core/timeline.ts, datanya dari folder episode.
import {Line, SceneBase, VoiceLine, buildTimeline} from '../../core/timeline';
import {BIKES, Bike} from './data';
import SCRIPT from './voice.json';
import DATA from './voice-data.json';

const DEFS: (SceneBase & {bike?: Bike})[] = [
  {id: 'hook', key: 'hook'},
  ...BIKES.map((bike) => ({id: bike.id, key: 'bike', group: 'bike', bike})),
  {id: 'tax', key: 'tax'},
  {id: 'outro', key: 'outro'},
];

export const TIMELINE = buildTimeline({
  lines: (SCRIPT as unknown as {lines: Line[]}).lines,
  voice: ((DATA as unknown as {lines: VoiceLine[]}).lines ?? []),
  scenes: DEFS,
  min: {hook: 135, bike: 165, tax: 270, outro: 120},
  tails: {hook: 20, bike: 26, tax: 20, outro: 20},
});

export const {SCENES, TOTAL_FRAMES, CUES, cueStart, cueEnd} = TIMELINE;

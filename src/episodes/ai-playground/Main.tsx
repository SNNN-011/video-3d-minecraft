import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {S1, S2, S3} from './scenesA';
import {S4, S5, S6} from './scenesB';
import {FontLoader, SafeGuide, Sky} from '../../core/ui';

const SHOW_SAFE_GUIDE = false; // true = garis merah safe zone (cek saja, matiin pas render final)
// Timing masih hardcode (belum ada narasi). Nanti diganti cueStart() setelah TTS dibuat.
export const SCENES = [270, 420, 450, 390, 420, 300]; // 9s, 14s, 15s, 13s, 14s, 10s
export const TOTAL_FRAMES = SCENES.reduce((a, b) => a + b, 0);
const COMPS = [S1, S2, S3, S4, S5, S6];

export const Main: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill>
      <FontLoader />
      <Sky />
      {COMPS.map((Comp, i) => {
        const start = from; from += SCENES[i];
        return <Sequence key={i} from={start} durationInFrames={SCENES[i]}><Comp /></Sequence>;
      })}
      {/* Musik latar (opsional): taruh public/music.mp3, import Audio & staticFile dari 'remotion', lalu:
      <Audio src={staticFile('music.mp3')} volume={0.2} /> */}
      {SHOW_SAFE_GUIDE && <SafeGuide />}
    </AbsoluteFill>
  );
};

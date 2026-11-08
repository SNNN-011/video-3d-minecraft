import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {FontLoader, SafeGuide, Sky} from '../../core/ui';
import {S1, S2, S3, S4, S5, S6} from './scenes';

const SHOW_SAFE_GUIDE = false; // true = garis merah safe zone (cek aja, matiin pas render final)
// Timing masih hardcode (belum ada narasi).
export const SCENES = [180, 360, 330, 300, 330, 300]; // 6s, 12s, 11s, 10s, 11s, 10s = 60 detik
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
      {SHOW_SAFE_GUIDE && <SafeGuide />}
    </AbsoluteFill>
  );
};

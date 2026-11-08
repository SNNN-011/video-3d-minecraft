import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {FontLoader, SafeGuide, Sky} from '../../core/ui';
import {S1, S2, S3, S4, S5, S6} from './scenes';
import {CONFIG} from './config';
import {CUES, SCENES} from './timeline';
import {Voice} from '../../core/Voice';

const SHOW_SAFE_GUIDE = false; // true = garis merah safe zone (cek aja, matiin pas render final)
const COMPS: Record<string, React.FC> = {s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6};

export {TOTAL_FRAMES} from './timeline';

export const Main: React.FC = () => (
  <AbsoluteFill>
    <FontLoader />
    <Sky />
    {SCENES.map((s) => (
      <Sequence key={s.id} from={s.from} durationInFrames={s.dur}>
        {React.createElement(COMPS[s.id])}
      </Sequence>
    ))}
    <Voice slug={CONFIG.slug} cues={CUES} />
    {SHOW_SAFE_GUIDE && <SafeGuide />}
  </AbsoluteFill>
);

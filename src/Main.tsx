import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {SCENES, TOTAL_FRAMES} from './timeline';
import {BikeScene, Hook, Outro, Tax} from './scenes';
import {FontLoader, SafeGuide, Sky} from './ui';
import {Voice} from './Voice';

const SHOW_SAFE_GUIDE = false; // true = tampilkan garis merah safe zone (buat ngecek aja, matiin pas render final)

export {TOTAL_FRAMES};

export const Main: React.FC = () => (
  <AbsoluteFill>
    <FontLoader />
    <Sky />
    {SCENES.map((s) => (
      <Sequence key={s.id} from={s.from} durationInFrames={s.dur}>
        {s.key === 'hook' ? <Hook /> : s.key === 'bike' ? <BikeScene bike={s.bike!} /> : s.key === 'tax' ? <Tax /> : <Outro />}
      </Sequence>
    ))}
    <Voice />
    {/* Musik latar (opsional): taruh public/music.mp3 lalu uncomment + import Audio, staticFile
    <Audio src={staticFile('music.mp3')} volume={0.2} /> */}
    {SHOW_SAFE_GUIDE && <SafeGuide />}
  </AbsoluteFill>
);

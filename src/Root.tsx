import React from 'react';
import {Composition} from 'remotion';
import {Main, TOTAL_FRAMES} from './Main';

export const Root: React.FC = () => (
  <Composition id="PajakMotor" component={Main} durationInFrames={TOTAL_FRAMES} fps={30} width={1080} height={1920} />
);

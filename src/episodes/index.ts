import React from 'react';
import {CONFIG as PAJAK_MOTOR} from './pajak-motor/config';
import {Main as PajakMotorMain, TOTAL_FRAMES as PAJAK_MOTOR_FRAMES} from './pajak-motor/Main';
import {CONFIG as AI_PLAYGROUND} from './ai-playground/config';
import {Main as AiPlaygroundMain, TOTAL_FRAMES as AI_PLAYGROUND_FRAMES} from './ai-playground/Main';
import {CONFIG as DISKON_1111} from './diskon-1111/config';
import {Main as Diskon1111Main, TOTAL_FRAMES as DISKON_1111_FRAMES} from './diskon-1111/Main';

export type Episode = {
  config: {id: string; slug: string; judul: string; status: 'aktif' | 'draft'};
  component: React.FC;
  totalFrames: number;
};

// Satu baris = satu komposisi di Remotion. Folder episode tanpa baris di sini tidak ikut dirender.
export const EPISODES: Episode[] = [
  {config: PAJAK_MOTOR, component: PajakMotorMain, totalFrames: PAJAK_MOTOR_FRAMES},
  {config: AI_PLAYGROUND, component: AiPlaygroundMain, totalFrames: AI_PLAYGROUND_FRAMES},
  {config: DISKON_1111, component: Diskon1111Main, totalFrames: DISKON_1111_FRAMES},
];

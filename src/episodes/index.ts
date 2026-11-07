import React from 'react';
import {CONFIG as PAJAK_MOTOR} from './pajak-motor/config';
import {Main as PajakMotorMain, TOTAL_FRAMES as PAJAK_MOTOR_FRAMES} from './pajak-motor/Main';

export type Episode = {
  config: {id: string; slug: string; judul: string; status: 'aktif' | 'draft'};
  component: React.FC;
  totalFrames: number;
};

// Satu baris = satu komposisi di Remotion. Folder episode tanpa baris di sini tidak ikut dirender.
// Draft: ./ai-playground (aset visual sudah di core/arts.ts + core/voxels.tsx, naskah di arsip/).
export const EPISODES: Episode[] = [
  {config: PAJAK_MOTOR, component: PajakMotorMain, totalFrames: PAJAK_MOTOR_FRAMES},
];

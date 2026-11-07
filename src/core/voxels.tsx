import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Art, hash} from './arts';

export type V3 = [number, number, number];

export const Box: React.FC<{p: V3; s?: V3; c: string; r?: V3; glow?: number; o?: number}> = ({p, s = [1, 1, 1], c, r = [0, 0, 0], glow = 0, o = 1}) => (
  <mesh position={p} rotation={r}>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} flatShading emissive={glow ? c : '#000000'} emissiveIntensity={glow} transparent={o < 1} opacity={o} />
  </mesh>
);

const Rig: React.FC<{pos: V3; look: V3}> = ({pos, look}) => {
  const {camera} = useThree();
  camera.position.set(pos[0], pos[1], pos[2]);
  camera.lookAt(look[0], look[1], look[2]);
  return null;
};

export const Stage: React.FC<{top: number; height: number; pos?: V3; look?: V3; fov?: number; children: React.ReactNode}> = ({
  top, height, pos = [0, 2.5, 13], look = [0, 1.5, 0], fov = 30, children,
}) => (
  <div style={{position: 'absolute', left: 0, top}}>
    <ThreeCanvas width={1080} height={height} camera={{position: pos, fov}}>
      <Rig pos={pos} look={look} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[6, 10, 8]} intensity={2} />
      {children}
    </ThreeCanvas>
  </div>
);

export const Ground: React.FC<{w?: number; d?: number}> = ({w = 9, d = 5}) => (
  <group>
    {Array.from({length: w}).flatMap((_, i) => Array.from({length: d}).map((__, j) => (
      <group key={`${i}-${j}`} position={[i - (w - 1) / 2, 0, j - (d - 1) / 2]}>
        <Box p={[0, -0.06, 0]} s={[1, 0.12, 1]} c={['#5aa83c', '#4f9a34', '#63b343'][(i * 7 + j * 13) % 3]} />
        <Box p={[0, -0.34, 0]} s={[1, 0.44, 1]} c="#7a5230" />
      </group>
    )))}
  </group>
);

export const PixelGrid: React.FC<{art: Art; cell?: number; glow?: number; depth?: number}> = ({art, cell = 0.5, glow = 0.25, depth = 0.3}) => {
  const n = art.rows[0].length, m = art.rows.length;
  return (
    <group>
      {art.rows.flatMap((row, j) => [...row].map((ch, i) => {
        const c = ch === '.' ? art.bg : art.pal[ch];
        if (!c) return null;
        return <Box key={`${i}-${j}`} p={[(i - (n - 1) / 2) * cell, ((m - 1) / 2 - j) * cell, 0]} s={[cell * 0.96, cell * 0.96, depth]} c={c} glow={glow} />;
      }))}
    </group>
  );
};

// Bingkai pixel art; t = 0..1 bergerak menyapu dari `from` ke `to`
export const PixelFrame: React.FC<{from: Art; to?: Art; t?: number; glitch?: number; seed?: number; pos?: V3; rot?: V3; scale?: number}> = ({
  from, to = from, t = 0, glitch = 0, seed = 0, pos = [0, 0, 0], rot = [0, 0, 0], scale = 1,
}) => {
  const col = (a: Art, ch: string) => (ch === '.' ? a.bg : a.pal[ch]);
  return (
    <group position={pos} rotation={rot} scale={scale}>
      {from.rows.flatMap((row, j) => [...row].map((ch, i) => {
        const th = (i / 7) * 0.8 + (j % 2) * 0.1;
        const edge = t > 0 && t < 1 && Math.abs(t - th) < 0.07;
        let c = t > th ? col(to, to.rows[j][i]) : col(from, ch);
        if (edge) c = '#ffffff';
        else if (glitch > 0 && hash(i * 13 + j * 7 + seed * 31) < glitch) c = ['#ff2d95', '#00f5ff', '#ffe600', '#111111'][Math.floor(hash(i + j * 9 + seed) * 4)];
        if (!c) return null;
        return <Box key={`${i}-${j}`} p={[(i - 3.5) * 0.5, (3.5 - j) * 0.5, 0]} s={[0.48, 0.48, 0.3]} c={c} glow={edge ? 1 : 0.25} />;
      }))}
      <Box p={[0, 2.2, -0.05]} s={[4.75, 0.35, 0.5]} c="#8b5a2b" />
      <Box p={[0, -2.2, -0.05]} s={[4.75, 0.35, 0.5]} c="#8b5a2b" />
      <Box p={[-2.2, 0, -0.05]} s={[0.35, 4.75, 0.5]} c="#8b5a2b" />
      <Box p={[2.2, 0, -0.05]} s={[0.35, 4.75, 0.5]} c="#8b5a2b" />
    </group>
  );
};

export const Robot: React.FC<{t: number; shades?: boolean; arms?: number}> = ({t, shades = false, arms = 0}) => {
  const bob = Math.sin(t * 0.15) * 0.06, blink = Math.floor(t / 12) % 2, th = arms * 2.6;
  return (
    <group position={[0, bob, 0]}>
      <Box p={[-0.35, 0.35, 0]} s={[0.45, 0.7, 0.5]} c="#6b7380" />
      <Box p={[0.35, 0.35, 0]} s={[0.45, 0.7, 0.5]} c="#6b7380" />
      <Box p={[0, 1.4, 0]} s={[1.4, 1.4, 0.9]} c="#9aa4b2" />
      <Box p={[0, 1.45, 0.46]} s={[0.8, 0.6, 0.05]} c="#1b2430" />
      <Box p={[-0.2, 1.45, 0.5]} s={[0.15, 0.15, 0.04]} c="#4dff88" glow={1} />
      <Box p={[0.2, 1.45, 0.5]} s={[0.15, 0.15, 0.04]} c={blink ? '#ff4d4d' : '#ffd60a'} glow={1} />
      <group position={[-0.95, 1.95, 0]} rotation={[0, 0, -th]}><Box p={[0, -0.55, 0]} s={[0.35, 1.1, 0.35]} c="#c8ced6" /></group>
      <group position={[0.95, 1.95, 0]} rotation={[0, 0, th]}><Box p={[0, -0.55, 0]} s={[0.35, 1.1, 0.35]} c="#c8ced6" /></group>
      <Box p={[0, 2.55, 0]} s={[1.2, 1, 1]} c="#c8ced6" />
      <Box p={[-0.28, 2.6, 0.51]} s={[0.25, 0.25, 0.05]} c="#00f5ff" glow={1} />
      <Box p={[0.28, 2.6, 0.51]} s={[0.25, 0.25, 0.05]} c="#00f5ff" glow={1} />
      <Box p={[0, 2.2, 0.51]} s={[0.6, 0.1, 0.05]} c="#333" />
      <Box p={[0, 3.2, 0]} s={[0.08, 0.4, 0.08]} c="#555" />
      <Box p={[0, 3.5, 0]} s={[0.22, 0.22, 0.22]} c="#ff4d4d" glow={blink ? 1 : 0.3} />
      {shades && <Box p={[0, 2.62, 0.53]} s={[1.0, 0.24, 0.05]} c="#111" />}
    </group>
  );
};

export const Person: React.FC<{t: number; arm?: number; shirt?: string}> = ({t, arm = 0, shirt = '#00a8a8'}) => {
  const skin = '#c68642';
  return (
    <group position={[0, Math.sin(t * 0.12) * 0.04, 0]}>
      <Box p={[-0.2, 0.5, 0]} s={[0.38, 1, 0.4]} c="#3b4aa0" />
      <Box p={[0.2, 0.5, 0]} s={[0.38, 1, 0.4]} c="#3b4aa0" />
      <Box p={[0, 1.55, 0]} s={[0.8, 1.1, 0.45]} c={shirt} />
      <Box p={[-0.58, 1.55, 0]} s={[0.3, 1, 0.3]} c={skin} />
      <group position={[0.55, 2.05, 0]} rotation={[0, 0, arm * 2.6]}><Box p={[0, -0.5, 0]} s={[0.3, 1, 0.3]} c={skin} /></group>
      <Box p={[0, 2.55, 0]} s={[0.8, 0.8, 0.8]} c={skin} />
      <Box p={[0, 2.98, -0.02]} s={[0.86, 0.22, 0.86]} c="#2b1d12" />
      <Box p={[0, 2.6, -0.4]} s={[0.86, 0.8, 0.12]} c="#2b1d12" />
      <Box p={[-0.2, 2.58, 0.41]} s={[0.12, 0.12, 0.04]} c="#111" />
      <Box p={[0.2, 2.58, 0.41]} s={[0.12, 0.12, 0.04]} c="#111" />
      <Box p={[0, 2.35, 0.41]} s={[0.3, 0.06, 0.04]} c="#7a3b2e" />
    </group>
  );
};

export const Machine: React.FC<{t: number; active?: number}> = ({t, active = 0}) => (
  <group position={[active * Math.sin(t * 2.3) * 0.05, 0, 0]}>
    <Box p={[0, 1.2, 0]} s={[2.4, 2.4, 1.6]} c="#37474f" />
    <Box p={[0, 2.65, 0]} s={[1.8, 0.5, 1.2]} c="#546e7a" />
    <Box p={[0, 3.0, 0]} s={[1.0, 0.3, 0.8]} c="#78909c" />
    <Box p={[0, 1.55, 0.82]} s={[1.6, 1, 0.05]} c={active && Math.floor(t / 4) % 2 ? '#00e5ff' : '#009bb3'} glow={0.8} />
    <Box p={[0, 0.55, 0.82]} s={[1.4, 0.3, 0.05]} c="#111" />
    <Box p={[-0.9, 0.95, 0.82]} s={[0.2, 0.2, 0.05]} c="#ff4d4d" glow={Math.floor(t / 6) % 2 ? 1 : 0.2} />
    <Box p={[0.9, 0.95, 0.82]} s={[0.2, 0.2, 0.05]} c="#4dff88" glow={Math.floor(t / 6) % 2 ? 0.2 : 1} />
    <group position={[1.35, 1.6, 0]} rotation={[0, 0, t * 0.1 * (active ? 3 : 1)]}>
      <Box p={[0, 0, 0]} s={[0.6, 0.18, 0.3]} c="#ffd60a" />
      <Box p={[0, 0, 0]} s={[0.18, 0.6, 0.3]} c="#ffd60a" />
    </group>
  </group>
);

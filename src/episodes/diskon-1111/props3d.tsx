import React from 'react';
import {Box, V3} from '../../core/voxels';

// Proyeksi titik 3D -> koordinat pixel layar, biar label teks 2D pas nempel di objek 3D.
export const makeProj = (top: number, height: number, pos: V3, look: V3, fov = 30) => (p: V3): [number, number] => {
  const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };
  const fw = norm(sub(look, pos)), r = norm(cross(fw, [0, 1, 0])), u = cross(r, fw), v = sub(p, pos);
  const x = dot(v, r), y = dot(v, u), z = dot(v, fw), t = Math.tan((fov * Math.PI) / 360), asp = 1080 / height;
  return [((x / z) / (t * asp) * 0.5 + 0.5) * 1080, top + (1 - ((y / z) / t * 0.5 + 0.5)) * height];
};

export const L: React.FC<{p: [number, number]; s?: number; children: React.ReactNode}> = ({p, s = 1, children}) => (
  <div style={{position: 'absolute', left: p[0], top: p[1], transform: `translate(-50%,-50%) scale(${s})`, whiteSpace: 'nowrap'}}>{children}</div>
);

export const Shop: React.FC = () => (
  <group>
    <Box p={[0, 1.2, -1]} s={[5, 2.4, 1.2]} c="#c69c6d" />
    {Array.from({length: 8}).map((_, i) => <Box key={i} p={[-2.2 + i * 0.63, 2.9, 0.2]} s={[0.62, 0.25, 1.8]} c={i % 2 ? '#ffffff' : '#e53935'} />)}
    <Box p={[-2.4, 1.4, 0.9]} s={[0.25, 2.8, 0.25]} c="#6d4c41" />
    <Box p={[2.4, 1.4, 0.9]} s={[0.25, 2.8, 0.25]} c="#6d4c41" />
    <Box p={[0, 0.5, 0.9]} s={[5, 1, 0.8]} c="#8d6e63" />
  </group>
);

export const Tag3D: React.FC<{p: V3; s?: V3; c?: string}> = ({p, s = [3.4, 1.1, 0.2], c = '#fff3c4'}) => (
  <group position={p}>
    <Box p={[0, 0, -0.06]} s={[s[0] + 0.2, s[1] + 0.2, 0.2]} c="#5d4037" />
    <Box p={[0, 0, 0.05]} s={s} c={c} />
  </group>
);

export const Tnt: React.FC<{flash: boolean}> = ({flash}) => (
  <group scale={1.3}>
    <Box p={[0, 1, 0]} s={[2, 2, 2]} c={flash ? '#ffffff' : '#d32f2f'} glow={flash ? 1 : 0} />
    <Box p={[0, 1, 1.02]} s={[2.04, 0.7, 0.04]} c="#f5f5f5" />
    <Box p={[0, 1, -1.02]} s={[2.04, 0.7, 0.04]} c="#f5f5f5" />
    <Box p={[0, 2.1, 0]} s={[0.15, 0.3, 0.15]} c="#333" />
  </group>
);

export const Cart: React.FC<{n: number}> = ({n}) => (
  <group>
    <Box p={[0, 0.35, 0]} s={[2, 0.15, 1.3]} c="#9e9e9e" />
    <Box p={[0, 0.85, 0.65]} s={[2, 0.9, 0.1]} c="#bdbdbd" o={0.8} />
    <Box p={[0, 0.85, -0.65]} s={[2, 0.9, 0.1]} c="#bdbdbd" o={0.8} />
    <Box p={[-1, 0.85, 0]} s={[0.1, 0.9, 1.3]} c="#bdbdbd" o={0.8} />
    <Box p={[1, 0.85, 0]} s={[0.1, 0.9, 1.3]} c="#bdbdbd" o={0.8} />
    <Box p={[-0.7, 0.1, 0.5]} s={[0.3, 0.3, 0.15]} c="#222" />
    <Box p={[0.7, 0.1, 0.5]} s={[0.3, 0.3, 0.15]} c="#222" />
    {Array.from({length: Math.min(n, 8)}).map((_, i) => (
      <Box key={i} p={[-0.7 + (i % 4) * 0.47, 0.6 + Math.floor(i / 4) * 0.5, 0]} s={[0.4, 0.4, 0.4]} c={['#ff4d9e', '#ffe14d', '#4dff88', '#6be6ff'][i % 4]} />
    ))}
  </group>
);

export const Gavel: React.FC<{angle: number}> = ({angle}) => (
  <group rotation={[0, 0, angle]}>
    <Box p={[0, 1, 0]} s={[0.3, 2.4, 0.3]} c="#8b5a2b" />
    <Box p={[0, 2.3, 0]} s={[1.6, 0.8, 0.8]} c="#5d4037" />
    <Box p={[-0.7, 2.3, 0]} s={[0.2, 0.9, 0.9]} c="#ffd60a" />
    <Box p={[0.7, 2.3, 0]} s={[0.2, 0.9, 0.9]} c="#ffd60a" />
  </group>
);

export const Chest: React.FC<{open: number}> = ({open}) => (
  <group>
    <Box p={[0, 0.4, 0]} s={[1.8, 0.8, 1.2]} c="#8b5a2b" />
    <Box p={[0, 0.45, 0.61]} s={[0.3, 0.3, 0.05]} c="#ffd60a" />
    <group position={[0, 0.8, -0.6]} rotation={[-open * 1.3, 0, 0]}><Box p={[0, 0.2, 0.6]} s={[1.8, 0.4, 1.2]} c="#a1692f" /></group>
  </group>
);

export const Emeralds: React.FC<{n: number}> = ({n}) => (
  <group>{Array.from({length: n}).map((_, i) => <Box key={i} p={[(i % 3) * 0.42 - 0.42, 0.2 + Math.floor(i / 9) * 0.4, (Math.floor(i / 3) % 3) * 0.42 - 0.42]} s={[0.38, 0.38, 0.38]} c="#00e676" glow={0.5} />)}</group>
);

import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useCurrentFrame} from 'remotion';
import type {Bike} from './data';

type V3 = [number, number, number];

const Box: React.FC<{p: V3; s: V3; c: string; r?: V3; glow?: number; o?: number}> = ({p, s, c, r = [0, 0, 0], glow = 0, o = 1}) => (
  <mesh position={p} rotation={r}>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} flatShading emissive={glow ? c : '#000000'} emissiveIntensity={glow} transparent={o < 1} opacity={o} />
  </mesh>
);

const Wheel: React.FC<{x: number; spin: number}> = ({x, spin}) => (
  <group position={[x, 0.77, 0]} rotation={[0, 0, -spin]}>
    {Array.from({length: 12}).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <Box key={i} p={[Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0]} s={[0.3, 0.3, 0.36]} c={i === 0 ? '#e0e0e0' : '#171717'} />;
    })}
    {Array.from({length: 4}).map((_, i) => {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      return <Box key={i} p={[Math.cos(a) * 0.3, Math.sin(a) * 0.3, 0]} s={[0.22, 0.22, 0.2]} c="#8a8f94" />;
    })}
    <Box p={[0, 0, 0]} s={[0.28, 0.28, 0.4]} c="#c9ced3" />
  </group>
);

export const VoxelBike: React.FC<{bike: Bike; spin: number}> = ({bike, spin}) => {
  const P = bike.primary, A = bike.accent, metal = '#9aa0a6';
  return (
    <group>
      <Wheel x={-1.4} spin={spin} />
      <Wheel x={1.45} spin={spin} />
      {[-0.22, 0.22].map((z) => <Box key={z} p={[-0.75, 0.9, z]} s={[1.4, 0.12, 0.1]} c="#222" />)}
      <Box p={[0.1, 1.0, 0]} s={[1.3, 0.8, 0.5]} c="#3a3a3a" />
      <Box p={[0.35, 1.65, 0]} s={[1.1, 0.5, 0.58]} c={P} />
      <Box p={[-0.2, 1.3, 0]} s={[0.8, 0.2, 0.62]} c={A} />
      <Box p={[1.25, 1.35, 0]} s={[0.8, 0.75, 0.6]} c={P} />
      <Box p={[1.3, 0.95, 0]} s={[0.6, 0.3, 0.66]} c={A} />
      <Box p={[1.2, 1.98, 0]} s={[0.12, 0.45, 0.42]} c="#9be7ff" o={0.7} />
      <Box p={[1.68, 1.4, 0]} s={[0.12, 0.22, 0.32]} c="#fff176" glow={0.8} />
      <Box p={[-0.55, 1.55, 0]} s={[1.0, 0.22, 0.45]} c="#111" />
      <Box p={[-1.45, 1.7, 0]} s={[0.9, 0.35, 0.42]} c={P} />
      <Box p={[-1.95, 1.7, 0]} s={[0.1, 0.15, 0.3]} c="#ff3b3b" glow={0.9} />
      {[-0.2, 0.2].map((z) => <Box key={z} p={[1.22, 1.36, z]} s={[0.1, 1.26, 0.08]} r={[0, 0, 0.36]} c={metal} />)}
      <Box p={[0.9, 1.95, 0]} s={[0.12, 0.12, 0.9]} c="#111" />
      <Box p={[-1.1, 0.8, 0.32]} s={[1.5, 0.28, 0.26]} c={metal} />
      {bike.wings && [-0.45, 0.45].map((z) => <Box key={z} p={[1.45, 1.55, z]} s={[0.5, 0.06, 0.3]} c={A} />)}
    </group>
  );
};

const Ground: React.FC = () => (
  <group>
    {Array.from({length: 7}).flatMap((_, i) =>
      Array.from({length: 5}).map((__, j) => {
        const shade = ['#5aa83c', '#4f9a34', '#63b343'][(i * 7 + j * 13) % 3];
        return (
          <group key={`${i}-${j}`} position={[i - 3, 0, j - 2]}>
            <Box p={[0, -0.06, 0]} s={[1, 0.12, 1]} c={shade} />
            <Box p={[0, -0.34, 0]} s={[1, 0.44, 1]} c="#7a5230" />
          </group>
        );
      }),
    )}
  </group>
);

export const BikeStage: React.FC<{bike: Bike; top: number; height: number; zoom?: number}> = ({bike, top, height, zoom = 1.1}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 0, top}}>
      <ThreeCanvas width={1080} height={height} camera={{position: [8 / zoom, 3.8 / zoom, 8 / zoom], fov: 32}}>
        <ambientLight intensity={1.1} />
        <directionalLight position={[6, 10, 5]} intensity={2} />
        <group position={[0, -0.9, 0]} rotation={[0, 0.5 + f * 0.035, 0]}>
          <Ground />
          <VoxelBike bike={bike} spin={f * 0.3} />
        </group>
      </ThreeCanvas>
    </div>
  );
};

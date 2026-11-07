import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AI_FACE, ANIME, Art, CAT, CAT_GALAXY, CINEMA, CREEPER, FACE_B, FACE_C, LANDSCAPE, LEARN_ICON, PLAY_ICON, SELFIE, WARN, WORK_ICON, hash} from '../../core/arts';
import {Box, Ground, Machine, PixelFrame, PixelGrid, Person, Stage, V3} from '../../core/voxels';
import {Panel, SAFE, Sfx, Txt, usePop} from '../../core/ui';
import {C, clamp01, plain} from './scenesA';
import {CHANNEL} from './config';

const S = SAFE.side;

/* ---------- SCENE 4: KENAPA SERU (13 detik) ---------- */
const OUT: {art: Art; tx: number; tz: number}[] = [
  {art: CAT_GALAXY, tx: 3.2, tz: 1.4}, {art: ANIME, tx: 4.4, tz: -0.8}, {art: CREEPER, tx: 2.0, tz: 3.4},
  {art: LANDSCAPE, tx: -1.4, tz: 3.4}, {art: CINEMA, tx: 4.8, tz: 3.2},
];
const STEPS = [{t: 'YOUR IDEA', c: '#ffe14d', s: 0}, {t: 'YOUR PROMPT', c: '#6be6ff', s: 60}, {t: 'AI GENERATION', c: '#5dff6a', s: 150}];
const PROMPT = 'kucing galaksi naik roket';

export const S4: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = interpolate(f, [236, 330], [0, 1], {...C, easing: Easing.inOut(Easing.cubic)});
  const lerp = (a: V3, b: V3): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  const pos = lerp([-0.3, 2.4, 10], [0.3, 6.5, 19]), look = lerp([-1.4, 1.9, 0], [0.3, 0.8, 0]);
  const active = f >= 150 && f < 250 ? 1 : 0;
  const bT = clamp01((f - 62) / 45);
  const bub = (f >= 26 && f < 112) ? [-1.4 + (0.5 + 1.4) * bT, 5.1 + (3.6 - 5.1) * bT, 1 + (0.5 - 1) * bT] as V3 : null;
  const sp = (s: number) => spring({frame: f - s, fps, config: {damping: 10}});
  const typed = PROMPT.slice(0, Math.max(0, Math.floor((f - 70) / 2.4)));
  return (
    <AbsoluteFill>
      <Sfx name="whoosh" at={0} /><Sfx name="pop" at={3} />
      {[22, 28, 34].map((a) => <Sfx key={a} name="pop" at={a} />)}
      <Sfx name="magic" at={40} /><Sfx name="pop" at={60} />
      {Array.from({length: 14}).map((_, i) => <Sfx key={i} name="tick" at={72 + i * 4} />)}
      <Sfx name="whoosh" at={148} /><Sfx name="pop" at={150} /><Sfx name="machine" at={152} /><Sfx name="boom" at={168} />
      {OUT.map((_, i) => <React.Fragment key={i}><Sfx name="pop" at={172 + i * 14} /><Sfx name="block" at={202 + i * 14} /></React.Fragment>)}
      <Sfx name="whoosh" at={238} /><Sfx name="tada" at={262} />
      <div style={{position: 'absolute', top: SAFE.top, left: S, right: S, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
        {STEPS.map((st, i) => f >= st.s && (
          <React.Fragment key={i}>
            {i > 0 && <Txt size={28}>↓</Txt>}
            <div style={{transform: `scale(${sp(st.s)})`}}><Txt size={40} color={st.c}>{st.t}</Txt></div>
          </React.Fragment>
        ))}
      </div>
      <Stage top={500} height={880} pos={pos} look={look}>
        <Ground w={15} d={9} />
        <group position={[-3.6, 0, 1]} rotation={[0, 0.6, 0]}><Person t={f} arm={interpolate(f, [28, 45], [0, 1.0], C)} /></group>
        <group position={[0.8, 0, 0]}><Machine t={f} active={active} /></group>
        {[[-2.9, 3.5, 0.15], [-2.6, 3.95, 0.25], [-2.2, 4.5, 0.35]].map(([x, y, sz], i) => f >= 20 + i * 6 && f < 112 && <Box key={i} p={[x, y, 1]} s={[sz, sz, sz]} c="#fff" />)}
        {bub && (
          <group position={bub} scale={1 - 0.7 * bT}>
            <Box p={[0, 0, 0]} s={[1.9, 1.5, 0.3]} c="#ffffff" />
            <group position={[0, 0, 0.2]}><PixelGrid art={CAT} cell={0.14} /></group>
          </group>
        )}
        {active ? [0, 1, 2, 3, 4, 5].map((i) => <Box key={i} p={[0.2 + i * 0.2, 3.2 + ((f * 0.05 + i * 0.37) % 1) * 1.5, 0]} s={[0.2, 0.2, 0.2]} c="#fff" o={0.8} />) : null}
        {OUT.map((o, i) => {
          const st = 172 + i * 14;
          if (f < st) return null;
          const p = clamp01((f - st) / 30);
          return (
            <group key={i}>
              {p >= 1 && <Box p={[o.tx, 0.35, o.tz]} s={[1.3, 0.7, 1.3]} c="#9e9e9e" />}
              <PixelFrame from={o.art} scale={0.35 * (0.3 + 0.7 * p)} pos={[0.8 + (o.tx - 0.8) * p, 0.9 + 0.65 * p + Math.sin(Math.PI * p) * 1.6, 0.9 + (o.tz - 0.9) * p]} rot={[0, -0.15 + (i % 2) * 0.3, 0]} />
            </group>
          );
        })}
        {f >= 250 && (
          <>
            <group position={[-5.0, 0, -2]} scale={sp(250)}>
              {[0, 1, 2, 3].map((i) => <Box key={i} p={[i * 0.5, ((i + 1) * 0.55) / 2, 0]} s={[0.5, (i + 1) * 0.55, 0.9]} c="#e0a030" />)}
              <Box p={[3.1, 1.15, 0]} s={[3.2, 0.2, 0.9]} r={[0, 0, -0.72]} c="#e63946" />
            </group>
            <group position={[4.9, 0, -3]} scale={0.85 * sp(256)}>
              <Box p={[-1.4, 1.5, 0]} s={[0.2, 3, 0.2]} c="#8b5a2b" /><Box p={[1.4, 1.5, 0]} s={[0.2, 3, 0.2]} c="#8b5a2b" />
              <Box p={[0, 3, 0]} s={[3, 0.2, 0.2]} c="#8b5a2b" />
              <group position={[0, 3, 0]} rotation={[0, 0, Math.sin(f * 0.1) * 0.35]}>
                <Box p={[-0.4, -1, 0]} s={[0.05, 2, 0.05]} c="#ddd" /><Box p={[0.4, -1, 0]} s={[0.05, 2, 0.05]} c="#ddd" />
                <Box p={[0, -2, 0]} s={[1, 0.12, 0.4]} c="#4dff88" />
              </group>
            </group>
          </>
        )}
      </Stage>
      {f >= 60 && f < 250 && (
        <Panel style={{position: 'absolute', top: 1250, left: S, right: S, padding: '18px 24px'}}>
          <Txt size={22} color="#222" style={{...plain, textAlign: 'left'}}>PROMPT:</Txt>
          <Txt size={26} color="#111" style={{...plain, textAlign: 'left', marginTop: 8}}>{typed}{Math.floor(f / 8) % 2 ? '▌' : ''}</Txt>
        </Panel>
      )}
      {f >= 262 && <div style={{position: 'absolute', top: 1290, left: S, right: S, transform: `scale(${sp(262)})`}}><Txt size={34} color="#5dff6a">Playground-nya Gen Z 🎮</Txt></div>}
    </AbsoluteFill>
  );
};

/* ---------- SCENE 5: SISI LAIN (14 detik) ---------- */
const IDS = [SELFIE, FACE_B, FACE_C, ANIME];

export const S5: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = (s: number, d = 10) => spring({frame: f - s, fps, config: {damping: d}});
  const phase = f < 90 ? 1 : f < 210 ? 2 : f < 330 ? 3 : 4;
  const idi = Math.floor(Math.max(0, f - 210) / 14) % 3, idt = clamp01(((Math.max(0, f - 210)) % 14) / 10);
  return (
    <AbsoluteFill>
      <Sfx name="whoosh" at={0} /><Sfx name="scan" at={28} /><Sfx name="boom" at={90} /><Sfx name="whoosh" at={92} />
      <Sfx name="pop" at={150} /><Sfx name="stamp" at={170} /><Sfx name="alarm" at={190} /><Sfx name="boom" at={210} />
      {[210, 238, 266, 294].map((a) => <Sfx key={a} name="glitch" at={a} />)}
      <Sfx name="riser" at={282} /><Sfx name="boom" at={330} /><Sfx name="stamp" at={333} /><Sfx name="pop" at={345} /><Sfx name="ding" at={352} />
      <div style={{position: 'absolute', top: SAFE.top, left: S, right: S}}>
        {phase === 1 && <div style={{transform: `scale(${sp(0)})`}}><Txt size={40} color="#ffe14d">REAL OR AI-GENERATED?</Txt></div>}
        {phase === 2 && f < 170 && <div style={{transform: `scale(${sp(90)})`}}><Txt size={44}>MANA YANG ASLI?</Txt></div>}
        {phase === 2 && f >= 170 && f < 190 && <Txt size={40} color="#ffe14d">SUSAH BEDAIN, KAN?</Txt>}
        {phase === 2 && f >= 190 && <div style={{transform: `scale(${sp(190, 6)})`}}><Txt size={54} color="#ff4747">HATI-HATI!</Txt></div>}
        {phase === 3 && <div style={{transform: `scale(${sp(210, 6)})`}}><Txt size={64} color="#ff4747">DEEPFAKE</Txt><Txt size={28} style={{marginTop: 14}}>Wajah bisa dimanipulasi</Txt></div>}
        {phase === 4 && <div style={{transform: `scale(${sp(330, 7)})`}}><Txt size={36} color="#ffe14d">THINK BEFORE YOU SHARE.</Txt></div>}
      </div>
      <Stage top={440} height={960} pos={[0, 1.2, 15]} look={[0, 1, 0]}>
        {phase === 1 && <PixelFrame from={SELFIE} to={AI_FACE} t={(Math.sin(f * 0.12) + 1) / 2} scale={1.4 * sp(0)} pos={[0, 0.8, 0]} rot={[0, Math.sin(f * 0.05) * 0.3, 0]} />}
        {phase === 2 && (
          <>
            <PixelFrame from={SELFIE} scale={0.7 * sp(90)} pos={[-1.85, 0.9, 0]} rot={[0, 0.15, 0]} />
            <PixelFrame from={AI_FACE} scale={0.7 * sp(96)} pos={[1.85, 0.9, 0]} rot={[0, -0.15, 0]} />
            {f >= 190 && <group position={[0, 3.9, 0]} scale={0.45 * sp(190, 6)}><PixelGrid art={WARN} /></group>}
          </>
        )}
        {phase === 3 && <PixelFrame from={IDS[idi]} to={IDS[idi + 1]} t={idt} glitch={0.2} seed={f} scale={1.4} pos={[0, 0.8, 0]} rot={[0, Math.sin(f * 0.2) * 0.2, 0]} />}
        {phase === 4 && <group position={[0, 1.6, 0]} scale={sp(330, 7)} rotation={[0, Math.sin(f * 0.08) * 0.3, 0]}><PixelGrid art={WARN} glow={0.4} /></group>}
      </Stage>
      {phase === 2 && (
        <>
          <div style={{position: 'absolute', top: 1150, left: 200, width: 240}}><Txt size={f >= 170 ? 34 : 60} color={f >= 170 ? '#5dff6a' : '#fff'}>{f >= 170 ? 'ASLI' : 'A'}</Txt></div>
          <div style={{position: 'absolute', top: 1150, left: 640, width: 240}}><Txt size={f >= 170 ? 34 : 60} color={f >= 170 ? '#ff4747' : '#fff'}>{f >= 170 ? 'AI' : 'B'}</Txt></div>
        </>
      )}
      {f >= 345 && (
        <Panel bg="#222" style={{position: 'absolute', top: 1170, left: S, right: S, padding: '18px 24px', transform: `scale(${sp(345, 8)})`}}>
          <Txt size={64} color="#ffe14d">42%</Txt>
          <Txt size={26} style={{marginTop: 8}}>GEN Z RUTIN VERIFIKASI INFO & JAGA DATA</Txt>
          <Txt size={22} color="#bbb" style={{...plain, marginTop: 12}}>Kaspersky 2026 · studi global</Txt>
        </Panel>
      )}
    </AbsoluteFill>
  );
};

/* ---------- SCENE 6: ENDING (10 detik) ---------- */
const ITEMS = [{x: -2.5, art: WORK_ICON, label: 'WORK', left: 98}, {x: 0, art: LEARN_ICON, label: 'LEARN', left: 420}, {x: 2.5, art: PLAY_ICON, label: 'PLAY', left: 742}];
const GAL = [CREEPER, ANIME, LANDSCAPE, CAT_GALAXY, CINEMA, SELFIE];

export const S6: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = (s: number, d = 9) => spring({frame: f - s, fps, config: {damping: d}});
  const z = interpolate(f, [140, 200], [0, 1], {...C, easing: Easing.inOut(Easing.cubic)});
  const pos: V3 = [2.5 * z, 2.4 - 0.3 * z, 13 - 5.5 * z], look: V3 = [2.5 * z, 1.4 + 0.2 * z, 0];
  const q = clamp01(f / 50);
  const fade = clamp01((f - 240) / 18);
  const labelOp = 1 - clamp01((f - 140) / 15);
  return (
    <AbsoluteFill>
      <Sfx name="whoosh" at={0} /><Sfx name="magic" at={40} />
      {[60, 68, 76].map((a) => <Sfx key={a} name="pop" at={a} />)}
      <Sfx name="riser_s" at={108} /><Sfx name="whoosh" at={140} /><Sfx name="tada" at={165} /><Sfx name="notif" at={268} />
      {f >= 60 && <div style={{position: 'absolute', top: SAFE.top, left: S, right: S, transform: `scale(${sp(60)})`}}><Txt size={40}>WORK? LEARN? OR PLAY?</Txt></div>}
      <Stage top={450} height={900} pos={pos} look={look}>
        <Ground w={9} d={4} />
        {f < 60 && GAL.map((art, k) => (
          <PixelFrame key={k} from={art} scale={0.5 * (1 - q)} pos={[((k % 3) - 1) * 2.3 * (1 - q), (1.6 - Math.floor(k / 3) * 2.5) * (1 - q) + 1.4 * q, 0]} />
        ))}
        {ITEMS.map((it, i) => {
          const s = sp(60 + i * 8);
          const picked = i === 2 && f >= 140;
          return (
            <group key={i} position={[it.x, 0, 0]}>
              <Box p={[0, 0.6 * s, 0]} s={[1.8, 1.2 * s, 1.4]} c={picked ? '#ffd60a' : '#8d8d8d'} glow={picked ? 0.5 : 0} />
              <group position={[0, 2.0, 0]} scale={s} rotation={[0, f * (picked ? 0.1 : 0.04), 0]}><PixelGrid art={it.art} cell={0.2} glow={0.35} /></group>
            </group>
          );
        })}
        {f >= 165 && Array.from({length: 24}).map((_, i) => {
          const tt = (f - 165) / 30, vx = (hash(i + 1) - 0.5) * 6, vy = 4 + hash(i + 40) * 4, vz = (hash(i + 80) - 0.3) * 3;
          return <Box key={i} p={[2.5 + vx * tt * 0.5, 2.2 + vy * tt - 5 * tt * tt, vz * tt * 0.5]} s={[0.18, 0.18, 0.18]} c={['#ff4d9e', '#ffe14d', '#4dff88', '#6be6ff'][i % 4]} glow={0.6} />;
        })}
      </Stage>
      {f >= 66 && ITEMS.map((it, i) => (
        <div key={i} style={{position: 'absolute', top: 1120, left: it.left, width: 240, opacity: labelOp, transform: `scale(${sp(66 + i * 8)})`}}>
          <Txt size={36} color={i === 2 ? '#ffe14d' : '#fff'}>{it.label}</Txt>
        </div>
      ))}
      {f >= 170 && <div style={{position: 'absolute', top: 1270, left: S, right: S, transform: `scale(${sp(170, 7)})`}}><Txt size={40} color="#ffe14d">WHAT'S YOUR PICK?</Txt></div>}
      {f >= 240 && <AbsoluteFill style={{background: '#000', opacity: fade}} />}
      {f >= 262 && (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', transform: `scale(${sp(262, 8)})`}}>
          <div style={{padding: '0 100px'}}>
            <Txt size={46} color="#5dff6a">{CHANNEL}</Txt>
            <Txt size={26} style={{marginTop: 24}}>Follow buat konten kayak gini lagi 🔔</Txt>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

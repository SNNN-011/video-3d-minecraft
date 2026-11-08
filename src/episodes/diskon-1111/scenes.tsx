import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Box, Ground, Person, Stage, V3} from '../../core/voxels';
import {hash} from '../../core/arts';
import {Panel, SAFE, Sfx, Txt, usePop} from '../../core/ui';
import {Cart, Chest, Emeralds, Gavel, L, Shop, Tag3D, Tnt, makeProj} from './props3d';

const C = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const plain = {textShadow: 'none', WebkitTextStroke: '0'} as const;
const S = SAFE.side;

const Head: React.FC<{small: string; big: string; size: number; color?: string}> = ({small, big, size, color = '#fff'}) => {
  const p = usePop(0);
  return (
    <div style={{position: 'absolute', top: SAFE.top, left: S, right: S, transform: `scale(${p})`}}>
      <Txt size={34} color="#ffe14d">{small}</Txt>
      <Txt size={size} color={color} style={{marginTop: 10}}>{big}</Txt>
    </div>
  );
};
// teks sumber/catatan: gelap biar kebaca di atas langit biru muda
const Note: React.FC<{children: React.ReactNode; top?: number}> = ({children, top = 1450}) => (
  <div style={{position: 'absolute', top, left: S, right: S}}><Txt size={22} color="#1a1a1a" style={plain}>{children}</Txt></div>
);

/* ---------- 1. HOOK (6 detik) ---------- */
export const S1: React.FC = () => {
  const f = useCurrentFrame();
  const top = 500, h = 900, pos: V3 = [0, 3.4, 13], look: V3 = [0, 2.6, 0];
  const P = makeProj(top, h, pos, look);
  const twist = f >= 105;
  const h1 = usePop(10), h2 = usePop(105, 6), s = usePop(50, 7), b = usePop(40, 8);
  const shake = twist ? Math.sin(f * 2.8) * 10 * Math.max(0, 1 - (f - 105) / 30) : 0;
  return (
    <AbsoluteFill style={{transform: `translateX(${shake}px)`}}>
      <Sfx name="whoosh" at={0} /><Sfx name="pop" at={10} /><Sfx name="coin" at={40} /><Sfx name="stamp" at={50} />
      <Sfx name="riser_s" at={74} /><Sfx name="boom" at={105} /><Sfx name="glitch" at={105} /><Sfx name="sad" at={118} />
      <div style={{position: 'absolute', top: SAFE.top + 20, left: S, right: S}}>
        {!twist && f >= 10 && <div style={{transform: `scale(${h1})`}}><Txt size={64} color="#ffe14d">DISKON 50%?!</Txt></div>}
        {twist && <div style={{transform: `scale(${h2})`}}><Txt size={50} color="#ff4747">TUNGGU DULU...</Txt></div>}
      </div>
      <Stage top={top} height={h} pos={pos} look={look}>
        <Ground w={9} d={4} />
        <group position={[0, 0, -1]}><Shop /></group>
        <Tag3D p={[0, 5.3, 1.2]} c={twist ? '#ff8a80' : '#fff3c4'} />
        {f >= 50 && !twist && <>
          <Box p={[0, 5.3, 1.4]} s={[3.6, 0.18, 0.1]} c="#d50000" r={[0, 0, 0.3]} />
          <Box p={[0, 5.3, 1.4]} s={[3.6, 0.18, 0.1]} c="#d50000" r={[0, 0, -0.3]} />
        </>}
        {f >= 40 && <Tag3D p={[0, 4.1, 1.2]} c="#b9f6ca" />}
        {f >= 40 && <Box p={[2.2, 4.4, 1.0]} s={[1.6, 1.6, 0.15]} c="#ff1744" r={[0, 0, Math.PI / 4]} />}
        <group position={[-2.9, 0, 2.2]}><Person t={f} arm={twist ? 0 : 0.9} /></group>
      </Stage>
      <L p={P([0, 5.3, 1.35])}>
        {!twist ? <Txt size={30} color="#222" style={plain}>Rp2.000.000</Txt>
          : <div style={{transform: `scale(${h2})`}}><Txt size={24} color="#222" style={plain}>KEMARIN:</Txt><Txt size={28} color="#222" style={plain}>Rp1.000.000</Txt></div>}
      </L>
      {f >= 40 && <L p={P([0, 4.1, 1.35])} s={b}><Txt size={36} color="#1b5e20" style={plain}>Rp999.000</Txt></L>}
      {f >= 40 && <L p={P([2.2, 4.4, 1.2])} s={s}><Txt size={30}>-50%</Txt></L>}
      {f >= 135 && <div style={{position: 'absolute', top: 1340, left: S, right: S}}><Txt size={28}>Diskon dari harga yang baru dinaikin? 💀</Txt></div>}
      <Note>*angka ilustrasi, tapi modus ini nyata</Note>
    </AbsoluteFill>
  );
};

/* ---------- 2. TRIK #1: HARGA DINAIKIN DULU (12 detik) ---------- */
const DAYS = [
  {d: 'H-10', v: 1, l: '1 jt', c: '#9e9e9e', t: '#ffffff'}, {d: 'H-5', v: 1, l: '1 jt', c: '#9e9e9e', t: '#ffffff'},
  {d: 'H-3', v: 2, l: '2 jt', c: '#e53935', t: '#ff8a80'}, {d: 'H-1', v: 2, l: '2 jt', c: '#e53935', t: '#ff8a80'},
  {d: '11.11', v: 1, l: '999 rb', c: '#43a047', t: '#5dff6a'},
];
export const S2: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const top = 480, h = 940, pos: V3 = [0, 4.3, 12], look: V3 = [0, 2.0, 0];
  const P = makeProj(top, h, pos, look);
  const nai = usePop(130, 6), st = usePop(190, 6), tw = usePop(215, 8);
  return (
    <AbsoluteFill>
      <Sfx name="whoosh" at={0} /><Sfx name="pop" at={3} />
      {DAYS.map((_, i) => <Sfx key={i} name="block" at={24 + i * 25} />)}
      <Sfx name="stamp" at={130} /><Sfx name="riser_s" at={160} /><Sfx name="stamp" at={190} /><Sfx name="boom" at={215} /><Sfx name="sad" at={228} />
      <Head small="TRIK #1" big="HARGA DINAIKIN DULU" size={44} />
      <Stage top={top} height={h} pos={pos} look={look}>
        <Ground w={9} d={3} />
        {DAYS.map((d, i) => {
          const g = spring({frame: f - (20 + i * 25), fps, config: {damping: 12}});
          const hh = Math.max(0.01, d.v * 1.6 * g);
          return (
            <React.Fragment key={i}>
              <Box p={[(i - 2) * 1.2, hh / 2, 0]} s={[0.9, hh, 0.9]} c={d.c} glow={i === 4 ? 0.4 : 0} />
              {i === 4 && f >= 170 && <Box p={[(i - 2) * 1.2, 1.6, 0]} s={[0.96, 3.2, 0.96]} c="#e53935" o={0.3} />}
            </React.Fragment>
          );
        })}
      </Stage>
      {DAYS.map((d, i) => f >= 30 + i * 25 && (
        <React.Fragment key={i}>
          <L p={P([(i - 2) * 1.2, d.v * 1.6 + 0.55, 0])}><Txt size={26} color={d.t}>{d.l}</Txt></L>
          <L p={P([(i - 2) * 1.2, -0.45, 0.9])}><Txt size={26}>{d.d}</Txt></L>
        </React.Fragment>
      ))}
      {f >= 170 && <L p={P([2.4, 3.75, 0])}><Txt size={26} color="#ff8a80" style={{textDecoration: 'line-through'}}>2 jt</Txt></L>}
      {f >= 130 && <L p={P([-0.6, 4.0, 0])} s={nai}><Txt size={36} color="#ff4747">NAIK!</Txt></L>}
      {f >= 190 && <L p={P([2.4, 4.5, 0])} s={st}><Txt size={34} color="#ffe14d">-50%!</Txt></L>}
      {f >= 215 && (
        <Panel bg="#b33" style={{position: 'absolute', top: 1240, left: S, right: S, padding: '18px 24px', transform: `scale(${tw})`}}>
          <Txt size={28} style={plain}>DISKON ASLINYA CUMA</Txt>
          <Txt size={44} color="#ffe14d" style={{marginTop: 8}}>Rp1.000 (0,1%)</Txt>
        </Panel>
      )}
      <Note>*ilustrasi. Modus ini dikenal sbg diskon palsu (kajian UIN SGD)</Note>
    </AbsoluteFill>
  );
};

/* ---------- 3. TRIK #2: COUNTDOWN & STOK (11 detik) ---------- */
export const S3: React.FC = () => {
  const f = useCurrentFrame();
  const top = 500, h = 900, pos: V3 = [0, 3.2, 13], look: V3 = [0, 2.0, 0];
  const P = makeProj(top, h, pos, look);
  const left = Math.max(0, 7 - Math.floor((f - 30) / 30));
  const boom = f >= 240;
  const flash = !boom && f >= 30 && Math.floor(f / Math.max(3, left * 2)) % 2 === 0;
  const stock = f < 80 ? 3 : f < 140 ? 2 : 1;
  const pn = usePop(255, 8), pp = usePop(60, 8);
  const et = (f - 240) / 20;
  return (
    <AbsoluteFill>
      <Sfx name="whoosh" at={0} /><Sfx name="pop" at={3} /><Sfx name="pop" at={60} /><Sfx name="pop" at={140} />
      {Array.from({length: 7}).map((_, i) => <Sfx key={i} name="tick" at={30 + i * 30} />)}
      <Sfx name="alarm" at={180} /><Sfx name="riser_s" at={210} /><Sfx name="boom" at={240} /><Sfx name="block" at={262} /><Sfx name="sad" at={290} />
      <Head small="TRIK #2" big="COUNTDOWN + SISA 3!" size={44} />
      <Stage top={top} height={h} pos={pos} look={look}>
        <Ground w={9} d={4} />
        {!boom && <Tnt flash={flash} />}
        {boom && et < 1.6 && Array.from({length: 30}).map((_, k) => {
          const vx = (hash(k + 1) - 0.5) * 8, vy = 2 + hash(k + 30) * 6, vz = (hash(k + 60) - 0.3) * 4;
          const y = 1.3 + vy * et - 6 * et * et;
          return y > 0 ? <Box key={k} p={[vx * et * 0.6, y, vz * et * 0.6]} s={[0.3, 0.3, 0.3]} c={['#ff1744', '#ff9100', '#ffea00'][k % 3]} glow={0.8} /> : null;
        })}
        {f >= 60 && <Tag3D p={[2.2, 3.0, 1.0]} s={[2.2, 0.9, 0.2]} c="#ffcdd2" />}
        {boom && <group position={[0, 0, 1.2]}><Cart n={Math.floor((f - 250) / 6)} /></group>}
        <group position={[-2.9, 0, 1.6]}><Person t={f} arm={f >= 180 ? 1.1 : 0} /></group>
      </Stage>
      {f >= 30 && !boom && (
        <L p={P([0, 4.6, 0])}>
          <Panel bg="#111" style={{padding: '10px 22px'}}><Txt size={64} color={left <= 2 ? '#ff4747' : '#ffe14d'}>00:0{left}</Txt></Panel>
        </L>
      )}
      {f >= 60 && <L p={P([2.2, 3.0, 1.2])} s={pp}><Txt size={26} color="#b71c1c" style={plain}>SISA {stock}!</Txt></L>}
      {f >= 255 && (
        <div style={{position: 'absolute', top: 1180, left: S, right: S, transform: `scale(${pn})`}}>
          <Txt size={28}>Beli dulu, mikir belakangan 💀</Txt>
          <Panel style={{marginTop: 24, padding: '16px 22px'}}>
            <Txt size={28} color="#222" style={plain}>URGENSI + HASRAT BELI MURAH = PENILAIAN KABUR</Txt>
            <Txt size={22} color="#444" style={{...plain, marginTop: 10}}>Analis Kaspersky, soal lonjakan penipuan saat 11.11</Txt>
          </Panel>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------- 4. TRIK #3: HARGA AKHIR (10 detik) ---------- */
const TA = [{n: 'Harga promo', v: 'Rp999rb', hh: 2.4, c: '#43a047'}, {n: 'Ongkir', v: '+Rp20rb', hh: 0.8, c: '#fb8c00'}, {n: 'Biaya admin', v: '+Rp10rb', hh: 0.8, c: '#8e24aa'}];
const TB = [{n: 'Harga biasa', v: 'Rp1.000rb', hh: 2.4, c: '#1e88e5'}, {n: 'Ongkir', v: 'GRATIS', hh: 0.8, c: '#00c853'}];
export const S4: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const top = 500, h = 900, pos: V3 = [0, 3.4, 13], look: V3 = [0, 2.4, 0];
  const P = makeProj(top, h, pos, look);
  const win = f >= 175, wp = usePop(175, 7), tot = usePop(150, 8);
  const tower = (arr: typeof TA, x: number, start: number) => {
    let y = 0;
    return arr.map((b, i) => {
      const s = start + i * 25, y0 = y; y += b.hh;
      if (f < s) return null;
      const g = spring({frame: f - s, fps, config: {damping: 12, stiffness: 140}});
      return {b, cy: y0 + b.hh / 2, x, g, key: `${x}-${i}`};
    });
  };
  const blocks = [...tower(TA, -2, 20), ...tower(TB, 2, 95)].filter(Boolean) as {b: typeof TA[0]; cy: number; x: number; g: number; key: string}[];
  return (
    <AbsoluteFill>
      <Sfx name="whoosh" at={0} />
      {[20, 45, 70, 95, 120].map((a) => <Sfx key={a} name="block" at={a + 8} />)}
      <Sfx name="coin" at={150} /><Sfx name="riser_s" at={150} /><Sfx name="tada" at={175} />
      <div style={{position: 'absolute', top: SAFE.top, left: S, right: S}}>
        <Txt size={34} color="#ffe14d">TRIK #3</Txt>
        <Txt size={win ? 32 : 34} color={win ? '#5dff6a' : '#fff'} style={{marginTop: 10, transform: `scale(${win ? wp : 1})`}}>{win ? 'TOKO B LEBIH HEMAT Rp29rb!' : 'YANG DIBAYAR = HARGA AKHIR'}</Txt>
      </div>
      <Stage top={top} height={h} pos={pos} look={look}>
        <Ground w={9} d={4} />
        {blocks.map(({b, cy, x, g, key}) => <Box key={key} p={[x, cy + (1 - g) * 3, 0]} s={[2.4, b.hh, 1.2]} c={b.c} />)}
        {win && <>
          <Box p={[2, 4.35, 0]} s={[1.4, 0.3, 0.6]} c="#ffd60a" glow={0.6} />
          {[-0.5, 0, 0.5].map((dx) => <Box key={dx} p={[2 + dx, 4.65, 0]} s={[0.3, 0.3, 0.6]} c="#ffd60a" glow={0.6} />)}
        </>}
      </Stage>
      {blocks.map(({b, cy, x, key}) => (
        <L key={key} p={P([x, cy, 0.7])}><Txt size={26} style={{lineHeight: 1.3}}>{b.n}</Txt><Txt size={26} color="#ffe14d">{b.v}</Txt></L>
      ))}
      {f >= 20 && <L p={P([-2, 5.0, 0])}><Txt size={30}>TOKO A</Txt><Txt size={26} color="#5dff6a">DISKON 50%!</Txt></L>}
      {f >= 95 && <L p={P([2, 5.35, 0])}><Txt size={30}>TOKO B</Txt><Txt size={26} color="#9be7ff">TANPA DISKON</Txt></L>}
      {f >= 150 && <>
        <L p={P([-2, -0.55, 1.2])} s={tot}><Txt size={30} color="#ffe14d">Rp1.029.000</Txt></L>
        <L p={P([2, -0.55, 1.2])} s={tot}><Txt size={30} color="#5dff6a">Rp1.000.000</Txt></L>
      </>}
      <Note top={1425}>*angka ilustrasi. Tips dari MOVA Cashback & Kemendag</Note>
    </AbsoluteFill>
  );
};

/* ---------- 5. DISKON PALSU DILARANG + CARA NGECEK (11 detik) ---------- */
const STEPS = ['1. CEK RIWAYAT HARGA', '2. BANDINGIN BEBERAPA TOKO', '3. HITUNG HARGA AKHIR', '4. BELI YANG EMANG LO BUTUH'];
export const S5: React.FC = () => {
  const f = useCurrentFrame();
  const A = f < 150;
  const ang = f < 40 ? interpolate(f, [10, 40], [0.5, -1.35], {...C, easing: Easing.in(Easing.quad)}) : -1.35 + 0.18 * Math.max(0, 1 - (f - 40) / 10);
  const r = (f - 40) * 0.09;
  const pa = usePop(55, 8), pb = usePop(110, 8), hb = usePop(150, 8);
  const open = clamp01((f - 165) / 12);
  return (
    <AbsoluteFill>
      <Sfx name="whoosh" at={0} /><Sfx name="pop" at={3} /><Sfx name="stamp" at={40} /><Sfx name="boom" at={40} /><Sfx name="pop" at={55} />
      <Sfx name="ding" at={110} /><Sfx name="whoosh" at={150} /><Sfx name="magic" at={165} />
      {STEPS.map((_, i) => <Sfx key={i} name="pop" at={178 + i * 25} />)}
      {A ? <Head small="FAKTA" big="DISKON PALSU = DILARANG" size={38} />
        : <div style={{position: 'absolute', top: SAFE.top, left: S, right: S, transform: `scale(${hb})`}}><Txt size={44} color="#5dff6a">CARA NGECEK</Txt></div>}
      {A && (
        <>
          <Stage top={330} height={520} pos={[0, 2.5, 11]} look={[0.8, 1.4, 0]}>
            <Ground w={9} d={3} />
            <Box p={[1.9, 0.3, 0]} s={[1.6, 0.6, 1.2]} c="#6d4c41" />
            <group position={[-0.4, 0, 0]}><Gavel angle={ang} /></group>
            {f >= 40 && r < 3 && Array.from({length: 14}).map((_, k) => {
              const a = (k / 14) * Math.PI * 2;
              return <Box key={k} p={[1.9 + Math.cos(a) * r, 0.15, Math.sin(a) * r]} s={[0.25, 0.25, 0.25]} c="#ffd60a" glow={0.7} />;
            })}
          </Stage>
          {f >= 55 && (
            <Panel style={{position: 'absolute', top: 860, left: S, right: S, padding: '18px 22px', transform: `scale(${pa})`}}>
              <Txt size={26} color="#222" style={plain}>UU PERLINDUNGAN KONSUMEN</Txt>
              <Txt size={26} color="#222" style={{...plain, marginTop: 6}}>Pasal 9 ayat (1) huruf a</Txt>
              <Txt size={28} color="#b71c1c" style={{...plain, marginTop: 16}}>Ancaman: penjara maks 5 tahun / denda maks Rp2 miliar</Txt>
            </Panel>
          )}
          {f >= 110 && <div style={{position: 'absolute', top: 1210, left: S, right: S, transform: `scale(${pb})`}}><Txt size={28} color="#5dff6a">Tapi nggak semua diskon bohong, banyak yang asli!</Txt></div>}
          <Note>Sumber: Hukumonline (UU 8/1999 Pasal 9 & 62)</Note>
        </>
      )}
      {!A && (
        <>
          <Stage top={300} height={420} pos={[0, 2.6, 9]} look={[0, 0.9, 0]}>
            <Chest open={open} />
            {open > 0.5 && <Emeralds n={Math.min(9, Math.floor((f - 172) / 3))} />}
          </Stage>
          {STEPS.map((t, i) => f >= 175 + i * 25 && (
            <div key={i} style={{position: 'absolute', top: 760 + i * 125, left: S, right: S, transform: `scale(${spring({frame: f - (175 + i * 25), fps: 30, config: {damping: 10, stiffness: 180}})})`}}>
              <Panel style={{padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 18}}>
                <div style={{width: 28, height: 28, background: '#00e676', border: '4px solid #000', flexShrink: 0}} />
                <Txt size={28} color="#222" style={{...plain, textAlign: 'left'}}>{t}</Txt>
              </Panel>
            </div>
          ))}
          <Note>Sumber tips: Kemendag, MOVA Cashback</Note>
        </>
      )}
    </AbsoluteFill>
  );
};

/* ---------- 6. WASPADA PHISHING + CTA (10 detik) ---------- */
export const S6: React.FC = () => {
  const f = useCurrentFrame();
  const A = f < 165;
  const wlk = clamp01((f - 20) / 60), lift = clamp01((f - 92) / 25) * 1.4;
  const sx = 3.0 * (1 - wlk), cam: V3 = [0, 3.7, 13], lk: V3 = [0, 3.0, 0];
  const baitY = 3.6 + lift, tip: V3 = [-0.04, 6.14, 0];
  const pa = usePop(70, 8), pb = usePop(110, 8);
  const c1 = usePop(170, 8), c2 = usePop(200, 8), c3 = usePop(235, 8), c4 = usePop(262, 8);
  return (
    <AbsoluteFill>
      <Sfx name="whoosh" at={0} /><Sfx name="pop" at={3} /><Sfx name="whoosh" at={20} /><Sfx name="stamp" at={92} /><Sfx name="alarm" at={95} />
      <Sfx name="pop" at={70} /><Sfx name="pop" at={110} /><Sfx name="whoosh" at={165} /><Sfx name="tada" at={172} />
      <Sfx name="pop" at={200} /><Sfx name="ding" at={235} /><Sfx name="notif" at={262} />
      {A ? (
        <>
          <Head small="TERAKHIR" big="AWAS PHISHING 🎣" size={50} color="#ff4747" />
          <Stage top={330} height={520} pos={cam} look={lk}>
            <Ground w={9} d={3} />
            <Box p={[-1.7, 3.07, 0]} s={[0.12, 7, 0.12]} c="#8b5a2b" r={[0, 0, -0.5]} />
            <Box p={[tip[0], (tip[1] + baitY + 0.5) / 2, 0]} s={[0.04, tip[1] - baitY - 0.5, 0.04]} c="#ffffff" />
            <Tag3D p={[tip[0], baitY, 0]} s={[1.8, 0.7, 0.15]} c="#fff176" />
            <Box p={[tip[0], baitY + 0.5, 0]} s={[0.2, 0.2, 0.2]} c="#9e9e9e" />
            <group position={[sx, lift, 0.5]}><Person t={f} arm={f >= 92 ? 1.2 : 0.2} /></group>
          </Stage>
          <L p={makeProj(330, 520, cam, lk)([tip[0], baitY, 0.2])}><Txt size={24} color="#b71c1c" style={plain}>-90%!!</Txt></L>
          {f >= 70 && (
            <Panel style={{position: 'absolute', top: 860, left: S, right: S, padding: '16px 22px', transform: `scale(${pa})`}}>
              <Txt size={26} color="#222" style={plain}>PENIPUAN NAIK SAAT 11.11: URGENSI + HASRAT BELI MURAH BIKIN NALAR KABUR</Txt>
              <Txt size={22} color="#444" style={{...plain, marginTop: 8}}>Kaspersky</Txt>
            </Panel>
          )}
          {f >= 110 && (
            <Panel bg="#1b2430" style={{position: 'absolute', top: 1150, left: S, right: S, padding: '16px 22px', transform: `scale(${pb})`}}>
              <Txt size={26} style={{textAlign: 'left'}}>• Jangan klik link dari iklan/email yang nggak lo minta</Txt>
              <Txt size={26} style={{textAlign: 'left', marginTop: 14}}>• Pakai kartu terpisah buat belanja online</Txt>
            </Panel>
          )}
        </>
      ) : (
        <>
          <div style={{position: 'absolute', top: SAFE.top, left: S, right: S, transform: `scale(${c1})`}}>
            <Txt size={44}>LO KENA JEBAKAN</Txt><Txt size={44} color="#ffe14d">YANG MANA?</Txt>
          </div>
          <Stage top={520} height={880} pos={[0, 3, 12]} look={[0, 1.8, 0]}>
            <Ground w={9} d={4} />
            <group scale={1.3}><Person t={f} arm={0.55 + 0.45 * Math.sin(f * 0.3)} shirt="#00a8a8" /></group>
            <group position={[-2.8, 0, 0.5]}><Chest open={1} /><group position={[0, 0.8, 0]}><Emeralds n={9} /></group></group>
            <group position={[2.8, 0, 0.5]}><Chest open={1} /><group position={[0, 0.8, 0]}><Emeralds n={9} /></group></group>
            {f >= 172 && Array.from({length: 24}).map((_, i) => {
              const t = (f - 172) / 30, vx = (hash(i + 1) - 0.5) * 6, vy = 4 + hash(i + 40) * 4, vz = (hash(i + 80) - 0.3) * 3;
              return <Box key={i} p={[vx * t * 0.5, 2.2 + vy * t - 5 * t * t, vz * t * 0.5]} s={[0.18, 0.18, 0.18]} c={['#ff4d9e', '#ffe14d', '#4dff88', '#6be6ff'][i % 4]} glow={0.6} />;
            })}
          </Stage>
          {f >= 200 && <div style={{position: 'absolute', top: 1180, left: S, right: S, transform: `scale(${c2})`}}><Txt size={38} color="#5dff6a">Komen di bawah 👇</Txt></div>}
          {f >= 235 && <div style={{position: 'absolute', top: 1270, left: S, right: S, transform: `scale(${c3})`}}><Txt size={34} color="#ffe14d">Save sebelum 11.11 🔖</Txt></div>}
          {f >= 262 && <div style={{position: 'absolute', top: 1350, left: S, right: S, transform: `scale(${c4})`}}><Txt size={28}>Follow buat tips anti zonk</Txt></div>}
        </>
      )}
    </AbsoluteFill>
  );
};

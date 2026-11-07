import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AI_FACE, ANIME, CAT, CAT_GALAXY, CELLS, CINEMA, CREEPER, LANDSCAPE, RANK, SELFIE, hash} from './arts';
import {Box, Ground, PixelFrame, Robot, Stage} from './voxels';
import {Panel, SAFE, Sfx, Txt, usePop} from './ui';

export const C = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const plain = {textShadow: 'none', WebkitTextStroke: '0'} as const;
const S = SAFE.side;
const Source: React.FC = () => (
  <div style={{position: 'absolute', top: 1445, left: S, right: S}}><Txt size={22} style={plain}>Sumber: Survei APJII 2026</Txt></div>
);

/* ---------- SCENE 1: HOOK (9 detik) ---------- */
export const S1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const glitch = f >= 112 && f < 134 ? 1 - (f - 112) / 22 : 0;
  const jit = glitch ? (hash(f) * 2 - 1) * 0.3 * glitch : 0;
  const pre = f < 120;
  const tA = usePop(10), tB = usePop(120, 6), tC = usePop(172);
  const grow = clamp01((f - 25) / 40);
  const shake = f >= 120 ? Math.sin(f * 2.9) * 12 * Math.max(0, 1 - (f - 120) / 30) : 0;
  return (
    <AbsoluteFill>
      <Sfx name="startup" at={0} /><Sfx name="pop" at={10} /><Sfx name="riser" at={78} />
      <Sfx name="glitch" at={112} /><Sfx name="boom" at={120} /><Sfx name="magic" at={124} /><Sfx name="notif" at={172} />
      <Stage top={520} height={900} pos={[0, 2.5, 13]} look={[0, 1.5, 0]}>
        <group position={[jit, 0, 0]}>
          <Ground w={9} d={4} />
          {pre ? (
            <>
              <Box p={[-2.7, 2.75, 0]} s={[1.4, 5.5, 1.2]} c="#78909c" />
              {[0, 1, 2].flatMap((cx) => [0, 1, 2, 3, 4].map((ry) => (
                <Box key={`${cx}-${ry}`} p={[-3.1 + cx * 0.4, 0.9 + ry * 0.9, 0.62]} s={[0.25, 0.4, 0.05]} c="#ffe14d" glow={Math.floor(f / 8 + cx + ry) % 3 ? 0.9 : 0.2} />
              )))}
              {[0, 1, 2].map((i) => <Box key={i} p={[1.9 + i * 0.6, ((i + 1) * 0.95 * grow) / 2, 0]} s={[0.45, (i + 1) * 0.95 * grow + 0.01, 0.45]} c="#4dff88" glow={0.4} />)}
            </>
          ) : (
            [CREEPER, ANIME, LANDSCAPE, CAT_GALAXY].map((art, k) => {
              const a = f * 0.035 + (k * Math.PI) / 2;
              const s = spring({frame: f - 120 - k * 5, fps, config: {damping: 10}});
              return <PixelFrame key={k} from={art} scale={0.42 * s} pos={[Math.cos(a) * 2.4, 2.3 + Math.sin(f * 0.1 + k) * 0.3, Math.sin(a) * 1.4]} rot={[0, -Math.cos(a) * 0.4, 0]} />;
            })
          )}
          <Robot t={f} shades={!pre} arms={pre ? 0 : 0.6 + 0.3 * Math.sin(f * 0.3)} />
        </group>
      </Stage>
      <div style={{position: 'absolute', top: SAFE.top + 20, left: S, right: S, transform: `translateX(${shake}px)`}}>
        {pre && f >= 10 && <div style={{transform: `scale(${tA})`}}><Txt size={46} color="#ffe14d">AI = PRODUCTIVITY?</Txt></div>}
        {!pre && <div style={{transform: `scale(${tB})`}}><Txt size={58} color="#ff4d9e">NOT JUST THAT!</Txt></div>}
      </div>
      {f >= 172 && (
        <div style={{position: 'absolute', top: 1330, left: S, right: S, transform: `scale(${tC})`}}>
          <Txt size={36} color="#5dff6a">AI IS THE NEW PLAYGROUND</Txt>
          <Txt size={26} style={{marginTop: 10}}>Ternyata Gen Z pakai AI buat seru-seruan?</Txt>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------- SCENE 2: DATA APJII (14 detik) ---------- */
const Row: React.FC<{label: string; v: number; color: string}> = ({label, v, color}) => (
  <div style={{marginBottom: 22}}>
    <Txt size={26} color="#222" style={{...plain, textAlign: 'left', marginBottom: 10}}>{label}</Txt>
    <div style={{height: 64, background: '#7a7a7a', border: '6px solid #000', position: 'relative'}}>
      <div style={{width: `${(v / 50) * 100}%`, height: '100%', background: `repeating-linear-gradient(90deg,${color} 0 28px,rgba(0,0,0,.28) 28px 32px)`}} />
      <div style={{position: 'absolute', left: 14, top: 0, bottom: 0, display: 'flex', alignItems: 'center'}}><Txt size={28}>{v.toFixed(1).replace('.', ',')}%</Txt></div>
    </div>
  </div>
);

export const S2: React.FC = () => {
  const f = useCurrentFrame();
  const pT = usePop(3), pB = usePop(215, 8), pC = usePop(300, 7);
  const pct = interpolate(f, [60, 150], [0, 29.4], {...C, easing: Easing.out(Easing.cubic)});
  const lit = Math.round((pct / 100) * CELLS.length);
  const mapS = f < 195 ? 1 : Math.max(0, 1 - (f - 195) / 12);
  const w = (a: number, b: number, v: number) => interpolate(f, [a, b], [0, v], {...C, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill>
      <Sfx name="whoosh" at={0} /><Sfx name="pop" at={3} /><Sfx name="magic" at={30} />
      {Array.from({length: 22}).map((_, i) => <Sfx key={i} name="tick" at={62 + i * 4} />)}
      <Sfx name="coin" at={150} /><Sfx name="whoosh" at={195} /><Sfx name="pop" at={215} />
      {Array.from({length: 12}).map((_, i) => <Sfx key={`b${i}`} name="tick" at={228 + i * 3} />)}
      <Sfx name="ding" at={272} /><Sfx name="stamp" at={300} /><Sfx name="cash" at={304} />
      <div style={{position: 'absolute', top: SAFE.top, left: S, right: S, transform: `scale(${pT})`}}>
        <Panel style={{padding: '18px 24px'}}><Txt size={36} color="#222" style={plain}>APJII 2026</Txt></Panel>
      </div>
      {f < 212 && (
        <>
          <Stage top={400} height={700} pos={[0, 15, 13]} look={[0, 0, 0.5]} fov={34}>
            <group scale={mapS} rotation={[0, Math.sin(f * 0.03) * 0.15, 0]}>
              {CELLS.map(([x, y], i) => {
                const isLit = RANK[i] < lit;
                const h = 0.25 * clamp01((f - 18 - x * 1.1) / 14) + (isLit ? 0.4 : 0);
                if (h < 0.01) return null;
                return <Box key={i} p={[(x - 18.5) * 0.42, h / 2, (y - 5) * 0.42]} s={[0.4, h, 0.4]} c={isLit ? '#00e5ff' : (x + y) % 2 ? '#4caf50' : '#43a047'} glow={isLit ? 0.9 : 0} />;
              })}
            </group>
          </Stage>
          {f >= 60 && (
            <div style={{position: 'absolute', top: 1110, left: S, right: S}}>
              <Txt size={80} color="#00e5ff">{pct.toFixed(1).replace('.', ',')}%</Txt>
              <Txt size={32}>GEN Z NGAKSES AI</Txt>
              <Txt size={26} style={{marginTop: 10}}>(usia 13–28 tahun)</Txt>
            </div>
          )}
        </>
      )}
      {f >= 215 && (
        <>
          <div style={{position: 'absolute', top: 420, left: S, right: S, transform: `scale(${pB})`}}>
            <Txt size={36} color="#ffe14d">KATEGORI HIBURAN</Txt>
            <Panel style={{marginTop: 36, padding: '24px 24px 2px'}}>
              <Row label="HIBURAN 🎬" v={w(225, 265, 44.4)} color="#ffd60a" />
              <Row label="EDUKASI & RISET 📚" v={w(240, 275, 34.9)} color="#5b8def" />
            </Panel>
          </div>
          {f >= 300 && (
            <div style={{position: 'absolute', top: 925, left: S, right: S, transform: `scale(${pC})`}}>
              <Panel bg="#d4a017" style={{padding: '18px 24px'}}><Txt size={34} style={plain}>HIBURAN = JUARA 👑</Txt></Panel>
              <Txt size={26} style={{marginTop: 34}}>Konten video & gambar generatif</Txt>
              <Txt size={26} color="#5dff6a" style={{marginTop: 14}}>Se-Indonesia pun hiburan juga #1 (36,5%)</Txt>
            </div>
          )}
        </>
      )}
      <Source />
    </AbsoluteFill>
  );
};

/* ---------- SCENE 3: GEN Z NGAPAIN AJA (15 detik) ---------- */
const BEATS = [
  {from: SELFIE, to: ANIME, label: 'CREATE', sub: 'Foto → karakter anime'},
  {from: SELFIE, to: CINEMA, label: 'TRANSFORM', sub: 'Selfie → foto sinematik'},
  {from: CAT, to: CAT_GALAXY, label: 'IMAGINE', sub: 'Objek biasa → surreal'},
];
const GAL = [CREEPER, ANIME, LANDSCAPE, CAT_GALAXY, CINEMA, SELFIE];

export const S3: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = Math.min(2, Math.floor(f / 100)), lf = f - b * 100, beat = BEATS[b];
  const pop = spring({frame: lf, fps, config: {damping: 10}});
  const t = clamp01((lf - 30) / 30);
  const gal = f >= 300;
  const galT = usePop(300);
  return (
    <AbsoluteFill>
      {BEATS.map((_, i) => (
        <React.Fragment key={i}>
          <Sfx name="whoosh" at={i * 100} /><Sfx name="pop" at={i * 100 + 3} /><Sfx name="scan" at={i * 100 + 28} />
          <Sfx name={i === 1 ? 'shutter' : 'magic'} at={i * 100 + 34} />
        </React.Fragment>
      ))}
      <Sfx name="whoosh" at={300} /><Sfx name="ding" at={322} />
      {GAL.map((_, i) => <Sfx key={i} name="pop" at={306 + i * 8} />)}
      <div style={{position: 'absolute', top: SAFE.top, left: S, right: S}}>
        {!gal ? (
          <div style={{transform: `scale(${pop})`}}>
            <Txt size={64} color="#ffe14d">{beat.label}</Txt>
            <Txt size={28} style={{marginTop: 14}}>{beat.sub}</Txt>
          </div>
        ) : (
          <div style={{transform: `scale(${galT})`}}><Txt size={48} color="#5dff6a">AI PLAYGROUND</Txt></div>
        )}
      </div>
      <Stage top={400} height={1000} pos={[0, 0.8, 15]} look={[0, 0.6, 0]}>
        {!gal ? (
          <PixelFrame from={beat.from} to={beat.to} t={t} scale={1.4 * pop} pos={[0, 0.5, 0]} rot={[0, Math.sin(f * 0.05) * 0.35, 0]} />
        ) : (
          GAL.map((art, k) => {
            const s = spring({frame: f - 300 - k * 5, fps, config: {damping: 10}});
            return <PixelFrame key={k} from={art} scale={0.5 * s} pos={[((k % 3) - 1) * 2.3, 1.6 - Math.floor(k / 3) * 2.5 + Math.sin(f * 0.08 + k) * 0.12, 0]} rot={[0, Math.sin(f * 0.04 + k) * 0.25, 0]} />;
          })
        )}
      </Stage>
    </AbsoluteFill>
  );
};

import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BIKES, Bike, breakdown, fmt} from './data';
import {cueEnd, cueStart} from './timeline';
import {Panel, SAFE, Sfx, Txt, usePop} from './ui';
import {BikeStage} from './VoxelBike';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const plain = {textShadow: 'none', WebkitTextStroke: '0'} as const;
const S = SAFE.side;

// tick-tick pas angka naik
const Ticks: React.FC<{from: number; to: number; every: number}> = ({from, to, every}) => (
  <>{Array.from({length: Math.max(0, Math.floor((to - from) / every))}).map((_, i) => <Sfx key={i} name="tick" at={from + i * every} />)}</>
);

/* ---------- 1. HOOK ---------- */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  // tiap teks muncul tepat pas baris narasinya mulai
  const t1 = cueStart('hook-1'), t2 = cueStart('hook-2'), t3 = cueStart('hook-3'), t4 = cueStart('hook-4');
  const a = usePop(t1), b = usePop(t2), c = usePop(t3, 6), d = usePop(t4);
  const total = BIKES[0].indoJt;
  const shake = f >= t3 ? Math.sin(f * 2.9) * 16 * Math.max(0, 1 - (f - t3) / 30) : 0;
  const flash = f >= t3 && f < t3 + 7 ? 1 - (f - t3) / 7 : 0;
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px, ${-shake * 0.7}px)`}}>
      <Sfx name="engine" at={0} />
      <Sfx name="pop" at={t1} />
      <Sfx name="whoosh" at={t2} />
      <Sfx name="glitch" at={t2} />
      <Sfx name="riser" at={t2 + 2} />
      <Sfx name="boom" at={t3} />
      <Sfx name="sad" at={t4} />
      <BikeStage bike={BIKES[0]} top={900} height={640} zoom={1.4} />
      <div style={{position: 'absolute', top: SAFE.top + 10, left: S, right: S, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
        {f >= t1 && <div style={{transform: `scale(${a})`}}><Txt size={34}>{BIKES[0].model} DI LUAR NEGERI:</Txt><Txt size={80} color="#5dff6a">Rp{BIKES[0].abroadJt} JUTA</Txt></div>}
        {f >= t2 && <div style={{transform: `scale(${b}) rotate(${(1 - b) * -8}deg)`}}><Txt size={46} color="#ffe14d">DI INDONESIA?</Txt></div>}
        {f >= t3 && <div style={{transform: `scale(${c})`}}><Txt size={72} color="#ff4747">Rp{(total / 1000).toFixed(1).replace('.', ',')} MILIAR+</Txt></div>}
        {f >= t4 && <div style={{transform: `scale(${d})`}}><Txt size={38}>WOY SERIUS?! 💀</Txt></div>}
      </div>
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
    </AbsoluteFill>
  );
};

/* ---------- 2. PER MOTOR ---------- */
export const BikeScene: React.FC<{bike: Bike}> = ({bike}) => {
  const f = useCurrentFrame();
  const total = bike.indoJt;
  const diff = total - bike.abroadJt;

  const tName = cueStart(`${bike.id}-name`);
  const tAbroad = cueStart(`${bike.id}-abroad`), tAbroadEnd = cueEnd(`${bike.id}-abroad`);
  const tIndo = cueStart(`${bike.id}-indo`), tEnd = cueEnd(`${bike.id}-indo`);

  const t = usePop(tName), p1 = usePop(tAbroad), p2 = usePop(tIndo), stamp = usePop(tEnd, 7);
  const abroad = interpolate(f, [tAbroad + 4, tAbroadEnd - 2], [0, bike.abroadJt], {...clamp, easing: Easing.out(Easing.cubic)});
  const indo = interpolate(f, [tIndo + 4, tEnd - 2], [0, total], {...clamp, easing: Easing.out(Easing.cubic)});
  // quip diketik setelah narasi harga selesai (biar nggak dobel sama subtitle)
  const quipStart = tEnd + 2;
  const quip = Array.from(bike.quip).slice(0, Math.max(0, Math.floor((f - quipStart) * 2.2))).join('');
  return (
    <AbsoluteFill>
      <Sfx name="whoosh" at={0} />
      <Sfx name="engine" at={4} />
      <Sfx name="pop" at={tName} />
      <Sfx name="coin" at={tAbroadEnd} />
      <Ticks from={tAbroad} to={tAbroadEnd} every={2} />
      <Sfx name="pop" at={tIndo} />
      <Ticks from={tIndo} to={tEnd} every={3} />
      <Sfx name="stamp" at={tEnd} />
      <Sfx name="cash" at={tEnd + 4} />
      <div style={{position: 'absolute', top: SAFE.top, left: S, right: S, transform: `scale(${t})`}}>
        <Txt size={30} color="#ffe14d">{bike.brand}</Txt>
        <Txt size={56}>{bike.model}</Txt>
      </div>
      <BikeStage bike={bike} top={340} height={560} zoom={1.45} />
      {f >= tAbroad && (
        <Panel style={{position: 'absolute', top: 905, left: S, right: S, transform: `scale(${p1})`}}>
          <Txt size={28} color="#222" style={plain}>LUAR NEGERI 🌍</Txt>
          <Txt size={52} color="#5dff6a">{fmt(abroad)}</Txt>
        </Panel>
      )}
      {f >= tIndo && (
        <Panel bg="#b33" style={{position: 'absolute', top: 1125, left: S, right: S, transform: `scale(${p2})`}}>
          <Txt size={28} style={plain}>DI INDONESIA 🇮🇩</Txt>
          <Txt size={52} color="#ffe14d">{fmt(indo)}</Txt>
        </Panel>
      )}
      {f >= tEnd && (
        <div style={{position: 'absolute', top: 1345, left: S, right: S, transform: `scale(${1 + (1 - stamp) * 2}) rotate(-4deg)`, opacity: Math.min(1, stamp * 2)}}>
          <Txt size={34} color="#ff4747">SELISIH +{fmt(diff)}</Txt>
        </div>
      )}
      <div style={{position: 'absolute', top: 1415, left: S, right: S}}>
        <Txt size={28}>{quip}</Txt>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 3. KENAPA? tumpukan pajak ---------- */
export const Tax: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {layers, total} = breakdown(BIKES[0]);
  // tiap block numpuk tepat pas komponen pajaknya disebut
  const marks = ['tax-bm', 'tax-ppnbm', 'tax-ppn', 'tax-pph', 'tax-bbn'].map(cueStart);
  const tTotal = cueStart('tax-total');
  const title = usePop(0), banner = usePop(tTotal, 7);
  const blockAt = (i: number) => (i === 0 ? marks[0] - 8 : marks[i - 1]);
  return (
    <AbsoluteFill>
      <Sfx name="whoosh" at={0} />
      {layers.map((_, i) => <Sfx key={i} name="block" at={blockAt(i) + 6} />)}
      <Sfx name="riser_s" at={tTotal - 30} />
      <Sfx name="boom" at={tTotal} />
      <Sfx name="cash" at={tTotal + 2} />
      <div style={{position: 'absolute', top: SAFE.top, left: S, right: S}}>
        <div style={{transform: `scale(${title})`}}><Txt size={46} color="#ffe14d">KENAPA BISA GINI??</Txt></div>
        {f >= cueStart('tax-1') && <Txt size={28} style={{marginTop: 18}}>Pajaknya numpuk kayak block Minecraft 🧱</Txt>}
      </div>
      <div style={{position: 'absolute', left: S, right: S, bottom: 730, display: 'flex', flexDirection: 'column-reverse'}}>
        {layers.map((l, i) => {
          const start = blockAt(i);
          if (f < start) return null;
          const s = spring({frame: f - start, fps, config: {damping: 12, stiffness: 140}});
          return (
            <div key={l.label} style={{
              height: Math.max(66, (l.value / total) * 650), background: l.color, border: '6px solid #000',
              borderTopColor: 'rgba(255,255,255,.7)', boxShadow: 'inset 0 -10px 0 rgba(0,0,0,.25)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 22px',
              transform: `translateY(${(1 - s) * -900}px)`,
            }}>
              <Txt size={26} style={{textAlign: 'left'}}>{l.label}</Txt>
              <Txt size={26}>+{fmt(l.value)}</Txt>
            </div>
          );
        })}
      </div>
      {f >= tTotal && (
        <Panel bg="#b33" style={{position: 'absolute', top: 1215, left: S, right: S, transform: `scale(${banner})`}}>
          <Txt size={26} style={plain}>TOTAL DI INDO</Txt>
          <Txt size={46} color="#ffe14d">{fmt(total)}</Txt>
        </Panel>
      )}
      <div style={{position: 'absolute', top: 1430, left: S, right: S}}>
        <Txt size={22} style={plain}>*ilustrasi hitungan S1000RR. tarif & harga bisa beda, cek aturan terbaru</Txt>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 4. OUTRO ---------- */
export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const t1 = cueStart('outro-1'), t2 = cueStart('outro-2'), t3 = cueStart('outro-3');
  const t4 = cueStart('outro-4'), t5 = cueStart('outro-5');
  const a = usePop(t1), b = usePop(t2), c = usePop(t3), d = usePop(t4), e = usePop(t5);
  return (
    <AbsoluteFill>
      <Sfx name="whoosh" at={0} />
      <Sfx name="ding" at={t2} />
      <Sfx name="pop" at={t3} />
      <Sfx name="pop" at={t4} />
      <Sfx name="notif" at={t5} />
      <BikeStage bike={BIKES[2]} top={880} height={640} zoom={1.4} />
      <div style={{position: 'absolute', top: SAFE.top + 10, left: S, right: S, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34}}>
        <div style={{transform: `scale(${a})`}}><Txt size={54}>MOTOR 1000cc</Txt></div>
        {f >= t2 && <div style={{transform: `scale(${b})`}}><Txt size={54} color="#ffe14d">= BARANG MEWAH?</Txt></div>}
        {f >= t3 && <div style={{transform: `scale(${c})`}}><Txt size={34}>Menurut kamu wajar nggak??</Txt></div>}
        {f >= t4 && <div style={{transform: `scale(${d}) translateY(${Math.sin(f * 0.4) * 10}px)`}}><Txt size={38} color="#5dff6a">Komen di bawah 👇</Txt></div>}
        {f >= t5 && <div style={{transform: `scale(${e})`}}><Txt size={28}>Follow biar nggak ketinggalan 🔔</Txt></div>}
      </div>
    </AbsoluteFill>
  );
};

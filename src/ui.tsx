import React from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export const FONT = `"PressStart2P", "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;

// Font di-host lokal (public/fonts) biar render tidak bergantung ke fonts.gstatic.com.
export const FontLoader: React.FC = () => {
  const [handle] = React.useState(() => delayRender('PressStart2P'));
  React.useEffect(() => {
    const face = new FontFace('PressStart2P', `url("${staticFile('fonts/PressStart2P-latin.woff2')}") format("woff2")`);
    face
      .load()
      .then((f) => {
        document.fonts.add(f);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [handle]);
  return null;
};

export const usePop = (start: number, damping = 9) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - start, fps, config: {damping, stiffness: 180}});
};

export const Sfx: React.FC<{name: string; at: number; volume?: number}> = ({name, at, volume = 0.3}) => (
  <Sequence from={at} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

export const Txt: React.FC<{size: number; color?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({
  size, color = '#fff', children, style,
}) => (
  <div style={{
    fontFamily: FONT, fontSize: size, color, textAlign: 'center', lineHeight: 1.4,
    textShadow: `${size / 9}px ${size / 9}px 0 #000`,
    WebkitTextStroke: `${Math.max(1, size / 26)}px #000`, paintOrder: 'stroke fill', ...style,
  }}>{children}</div>
);

// Panel ala inventory Minecraft
export const Panel: React.FC<{children: React.ReactNode; bg?: string; style?: React.CSSProperties}> = ({
  children, bg = '#c6c6c6', style,
}) => (
  <div style={{
    background: bg, border: '10px solid', borderColor: '#fff #555 #555 #fff',
    outline: '8px solid #000', padding: '26px 30px', ...style,
  }}>{children}</div>
);

export const Sky: React.FC = () => {
  const f = useCurrentFrame();
  const clouds = [[100, 200, 260], [600, 430, 340], [300, 720, 220], [780, 1000, 300], [200, 1300, 280]];
  return (
    <AbsoluteFill
      style={{background: 'linear-gradient(#5fa8ff,#bfe0ff 70%,#e8f4ff)'}}
    >
      {clouds.map(([x, y, w], i) => (
        <div key={i} style={{
          position: 'absolute', left: ((x + f * (0.8 + i * 0.35)) % 1500) - 320, top: y, width: w, height: w * 0.26,
          background: '#fff', opacity: 0.92,
          boxShadow: `${w * 0.15}px -${w * 0.14}px 0 #fff, -${w * 0.12}px -${w * 0.08}px 0 #fff`,
        }} />
      ))}
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 160,
        background: 'repeating-linear-gradient(90deg,#5aa83c 0 80px,#4f9a34 80px 160px)', borderTop: '16px solid #3b7a28'}} />
    </AbsoluteFill>
  );
};

// Safe zone Reels/TikTok: UI bawah (caption/tombol) makan ±400px, atas ±220px, sisi ±100px
export const SAFE = {top: 220, bottom: 400, side: 100};
export const SafeGuide: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top, bottom: SAFE.bottom, border: '4px dashed rgba(255,0,0,.8)'}} />
  </AbsoluteFill>
);

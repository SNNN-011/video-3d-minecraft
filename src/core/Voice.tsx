// Narasi TTS + subtitle karaoke (generik, dipakai semua episode).
// Audio per baris (public/voice/<slug>/*.wav), subtitle ngikutin timing kata dari voice-data.json.
// Subtitle dipecah per potongan pendek (gaya caption short-video) biar tingginya tetap 1 baris
// dan nggak nabrak konten scene di atasnya. Panel = komponen yang sama dengan panel harga.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Cue} from './timeline';
import {Panel, SAFE, Txt} from './ui';

const ACTIVE = '#ffe14d'; // kuning yang sama dipakai di scene
const SUB_BOTTOM = 280; // di bawah konten scene, di atas UI platform
const MAX_CHARS = 17; // panjang maksimal 1 potongan subtitle (font pixel monospace ~1em/char)
const MAX_WORDS = 4;

type Word = {w: string; from: number; to: number};

const chunks = (words: Word[]) => {
  const out: Word[][] = [];
  let cur: Word[] = [];
  let len = 0;
  for (const w of words) {
    if (cur.length && (cur.length >= MAX_WORDS || len + w.w.length + 1 > MAX_CHARS)) {
      out.push(cur);
      cur = [];
      len = 0;
    }
    cur.push(w);
    len += w.w.length + 1;
  }
  if (cur.length) out.push(cur);
  return out;
};

export const Voice: React.FC<{slug: string; cues: Cue[]}> = ({slug, cues}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cue = cues.find((c) => f >= c.start && f < c.start + c.frames);
  const ms = cue ? ((f - cue.start) / fps) * 1000 : 0;
  const fade = cue ? Math.min(1, (f - cue.start) / 2) : 0;

  const parts = cue ? chunks(cue.words) : [];
  const part = parts.find((p) => p.some((w) => ms >= w.from && ms < w.to)) ?? parts[parts.length - 1] ?? [];

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {cues.map((c) => (
        <Sequence key={c.id} from={c.start} durationInFrames={c.frames} layout="none">
          <Audio src={staticFile(`voice/${slug}/${c.id}.wav`)} />
        </Sequence>
      ))}

      {cue && part.length > 0 && (
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, bottom: SUB_BOTTOM,
          display: 'flex', justifyContent: 'center', opacity: fade,
        }}>
          <Panel bg="#141414" style={{maxWidth: 900, padding: '18px 24px'}}>
            <Txt size={40} style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 16px'}}>
              {part.map((w, i) => (
                <span key={i} style={{color: ms >= w.from && ms < w.to ? ACTIVE : '#fff'}}>{w.w}</span>
              ))}
            </Txt>
          </Panel>
        </div>
      )}
    </AbsoluteFill>
  );
};

import React from 'react';
import {Composition} from 'remotion';
import {EPISODES} from './episodes';

// Root cuma mendaftarkan episode yang ada di src/episodes/index.ts.
// Episode baru: tambah folder di src/episodes/<slug> + satu baris di registri, tanpa npm install.
export const Root: React.FC = () => (
  <>
    {EPISODES.map((e) => (
      <Composition
        key={e.config.id}
        id={e.config.id}
        component={e.component}
        durationInFrames={e.totalFrames}
        fps={30}
        width={1080}
        height={1920}
      />
    ))}
  </>
);

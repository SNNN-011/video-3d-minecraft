// Pixel art 8x8 (satu huruf = satu warna, '.' = background)
export type Art = {rows: string[]; pal: Record<string, string>; bg?: string};
export const hash = (n: number) => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };

const face = ['.hhhhhh.', 'hhhhhhhh', 'hssssssh', 'hsessesh', 'hssssssh', '.ssmmss.', '..ssss..', '..bbbb..'];
export const SELFIE: Art = {rows: face, pal: {h: '#4a2f1b', s: '#f1c27d', e: '#1b1b1b', m: '#b5524a', b: '#3b82f6'}, bg: '#a8d8ff'};
export const AI_FACE: Art = {rows: face, pal: {h: '#4d3220', s: '#f6cc90', e: '#1b1b1b', m: '#b8574d', b: '#3f86fa'}, bg: '#a6d9ff'};
export const FACE_B: Art = {rows: face, pal: {h: '#1a1a1a', s: '#c68642', e: '#111', m: '#8a3b2e', b: '#e63946'}, bg: '#ffe5a0'};
export const FACE_C: Art = {rows: face, pal: {h: '#e0b030', s: '#ffdbac', e: '#1b6b3a', m: '#c0504a', b: '#7b2ff7'}, bg: '#d0f0d0'};
export const ANIME: Art = {rows: ['.pppppp.', 'pppppppp', 'pssssssp', 'pwbwwbwp', 'pssssssp', '.ssmmss.', 'p.ssss.p', 'p.bbbb.p'],
  pal: {p: '#ff7eb6', s: '#ffe0c8', w: '#ffffff', b: '#4a7bff', m: '#e0607e'}, bg: '#ffd6ec'};
export const CINEMA: Art = {rows: ['xxxxxxxx', 'hhhhhhhh', 'hssssssh', 'hsessesh', 'hssssssh', '.ssmmss.', '..ssss..', 'xxxxxxxx'],
  pal: {x: '#000', h: '#0b2a35', s: '#ff9a4d', e: '#06151a', m: '#a8452a'}, bg: '#0d3b4a'};
const cat = ['c......c', 'cc....cc', 'cccccccc', 'ceccccec', 'cccnnccc', 'ccwmmwcc', '.cccccc.', '..c..c..'];
export const CAT: Art = {rows: cat, pal: {c: '#f2a65a', e: '#1b1b1b', n: '#e07a8a', w: '#fff', m: '#7a4a2a'}, bg: '#cfe9ff'};
export const CAT_GALAXY: Art = {rows: cat, pal: {c: '#7b2ff7', e: '#00f5ff', n: '#ff4fd8', w: '#e0d0ff', m: '#ff4fd8'}, bg: '#120a33'};
export const CREEPER: Art = {rows: ['gggggggg', 'gkkggkkg', 'gkkggkkg', 'gggkkggg', 'ggkkkkgg', 'ggkkkkgg', 'ggkggkgg', 'gggggggg'],
  pal: {g: '#4caf50', k: '#111'}, bg: '#9be08c'};
export const LANDSCAPE: Art = {rows: ['........', '.....y..', '....yyy.', '........', '..ww....', 'gggggggg', 'gddgddgg', 'dddddddd'],
  pal: {y: '#ffe14d', w: '#fff', g: '#5aa83c', d: '#7a5230'}, bg: '#79c7ff'};
export const WARN: Art = {rows: ['....Y....', '...YYY...', '...Y!Y...', '..YY!YY..', '..YY!YY..', '.YYYYYYY.', '.YYY!YYY.', 'YYYYYYYYY'],
  pal: {Y: '#ffd60a', '!': '#111'}};
export const WORK_ICON: Art = {rows: ['..dddd..', '.d....d.', 'bbbbbbbb', 'bbbbbbbb', 'bbbyybbb', 'bbbbbbbb', 'bbbbbbbb', 'dddddddd'], pal: {b: '#8d5524', d: '#4a2c10', y: '#ffd60a'}};
export const LEARN_ICON: Art = {rows: ['rrrrrrrr', 'rwwwwwwr', 'rwkkkkwr', 'rwwwwwwr', 'rwkkkkwr', 'rwwwwwwr', 'rrrrrrrr', '.rrrrrr.'], pal: {r: '#c0392b', w: '#f5f5f5', k: '#555'}};
export const PLAY_ICON: Art = {rows: ['.......c', '......cc', '.....cc.', '....cc..', '.kcc....', '..kk....', '.b.k....', 'b.......'], pal: {c: '#5ef2e0', k: '#8b5a2b', b: '#5c3a1a'}};

// Peta Indonesia (stylized, voxel)
export const MAP = (() => {
  const W = 38, H = 11, g = Array.from({length: H}, () => Array(W).fill('.'));
  const R = (x0: number, y0: number, x1: number, y1: number) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) g[y][x] = '#'; };
  for (let i = 0; i < 9; i++) R(1 + i, Math.floor(i * 0.85), 2 + i, Math.floor(i * 0.85) + 1); // Sumatra
  R(12, 1, 18, 6); g[1][12] = '.'; g[1][18] = '.'; g[6][12] = '.';                              // Kalimantan
  R(23, 1, 24, 5); R(25, 2, 26, 2); R(21, 4, 22, 4); R(25, 5, 26, 6);                          // Sulawesi
  R(11, 8, 19, 9); R(21, 9, 26, 9);                                                              // Jawa + Nusa
  R(29, 2, 36, 6); R(31, 1, 34, 1); R(30, 7, 33, 7); R(27, 3, 27, 4);                           // Papua + Maluku
  return g.map((r) => r.join(''));
})();
export const CELLS: [number, number][] = MAP.flatMap((r, y) => [...r].flatMap((c, x) => (c === '#' ? [[x, y] as [number, number]] : [])));
export const RANK: number[] = (() => {
  const idx = CELLS.map((_, i) => i).sort((a, b) => hash(a + 1) - hash(b + 1));
  const r: number[] = []; idx.forEach((ci, rank) => (r[ci] = rank)); return r;
})();

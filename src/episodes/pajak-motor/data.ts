// Harga MSRP US (2027) dikonversi kurs Rp18.100/USD, dan harga OTR Indonesia.
// Sumber: yamahamotorsports.com, bmwmotorcycles.com (configurator), ducati.com US,
// kawasaki.com US, oto.com (OTR Jakarta), Kompas Otomotif (Panigale V4 S).
// Harga dalam JUTA rupiah.
export const RATES = {
  beaMasuk: 0.40,   // bea masuk CBU
  ppnbm: 0.95,      // PPnBM (motor >500cc)
  ppn: 0.12,        // PPN
  pphImpor: 0.025,  // PPh pasal 22 impor (dengan API)
  adminBbn: 0.05,   // BBN, admin, margin dealer (kasar)
};

export type Bike = {
  id: string; brand: string; model: string;
  abroadJt: number; indoJt: number;
  primary: string; accent: string; wings: boolean; quip: string;
};

export const BIKES: Bike[] = [
  { id: 's1000rr', brand: 'BMW', model: 'S1000RR', abroadJt: 380, indoJt: 1237, primary: '#f2f2f2', accent: '#d6001c', wings: false,
    quip: 'Ini bukan beli motor, ini nyumbang ke negara 😭' },
  { id: 'r1', brand: 'YAMAHA', model: 'R1', abroadJt: 362, indoJt: 605, primary: '#1e4bd8', accent: '#e8e8e8', wings: false,
    quip: 'Motornya sama. Cuma paspornya beda 💀' },
  { id: 'v4', brand: 'DUCATI', model: 'PANIGALE V4 S', abroadJt: 675, indoJt: 1297, primary: '#d40000', accent: '#111111', wings: true,
    quip: 'Cakep banget. Dompet nangis 🥲' },
  { id: 'h2', brand: 'KAWASAKI', model: 'NINJA H2', abroadJt: 638, indoJt: 873, primary: '#2b2f33', accent: '#39d353', wings: true,
    quip: 'Supercharged. Tagihannya ikut ngecas ⚡' },
];

export const breakdown = (b: Bike) => {
  const base = b.abroadJt;
  const bm = base * RATES.beaMasuk;
  const dpp = base + bm;
  const lux = dpp * RATES.ppnbm;
  const ppn = (dpp + lux) * RATES.ppn;
  const pph = dpp * RATES.pphImpor;
  const sub = dpp + lux + ppn + pph;
  const adm = sub * RATES.adminBbn;
  // komponen pajak diskalakan supaya total pas dengan harga OTR asli (estimasi porsi)
  const k = (b.indoJt - base) / (sub + adm - base);
  return {
    total: b.indoJt,
    layers: [
      { label: 'Harga luar negeri', value: base, color: '#3d7bff' },
      { label: 'Bea masuk', value: bm * k, color: '#ff9f1c' },
      { label: 'PPnBM', value: lux * k, color: '#e63946' },
      { label: 'PPN', value: ppn * k, color: '#9d4edd' },
      { label: 'PPh impor', value: pph * k, color: '#ffd60a' },
      { label: 'BBN + admin', value: adm * k, color: '#8d99ae' },
    ],
  };
};

export const fmt = (jt: number) =>
  jt >= 1000 ? `Rp${(jt / 1000).toFixed(2).replace('.', ',')} Miliar` : `Rp${Math.round(jt)} jt`;

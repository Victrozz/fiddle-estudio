// ============================================================================
// LOS EFECTOS DE SONIDO, SINTETIZADOS
// ----------------------------------------------------------------------------
// Unos pocos sonidos cortos hechos con matemáticas (senos, ruido y envolventes),
// para no depender de bancos de sonido ni de sus licencias. Salen en
// public/sonidos/*.wav (mono, 44,1 kHz). Uno nuevo = una entrada en SONIDOS y
// en `Sonido` de src/comun/Efecto.tsx.
//
//   npm run sonidos
// ============================================================================

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const HZ = 44100;
const DESTINO = path.join(process.cwd(), "public", "sonidos");

// Ruido con semilla: el mismo fichero cada vez (si no, cada `npm run sonidos`
// cambiaría los WAV y git los vería distintos).
let semilla = 12345;
const ruido = () => {
  semilla = (semilla * 1103515245 + 12345) & 0x7fffffff;
  return (semilla / 0x7fffffff) * 2 - 1;
};

const muestras = (seg, f) => Float32Array.from({ length: Math.round(seg * HZ) }, (_, i) => f(i / HZ));
const caida = (t, rapidez) => Math.exp(-t * rapidez);
const seno = (t, hz) => Math.sin(2 * Math.PI * hz * t);

const SONIDOS = {
  // El punto que entra: una gota que sube.
  pop: muestras(0.18, (t) => seno(t, 520 + 900 * t) * caida(t, 28) * 0.9),
  // Un segundero: clic seco.
  tic: muestras(0.05, (t) => (ruido() * 0.5 + seno(t, 2400) * 0.5) * caida(t, 160)),
  // El aviso en la pantalla de bloqueo: dos notas limpias.
  ding: muestras(0.9, (t) => {
    const a = seno(t, 1318.5) * caida(t, 5);
    const b = t > 0.11 ? seno(t - 0.11, 1760) * caida(t - 0.11, 4.5) : 0;
    return (a * 0.5 + b * 0.5) * 0.8;
  }),
  // El sello de goma contra el cartón: golpe grave y sordo.
  golpe: muestras(0.25, (t) => (seno(t, 95 - 40 * t) * 0.8 + ruido() * 0.35 * caida(t, 60)) * caida(t, 18)),
  // Una transición: ruido que pasa.
  zas: muestras(0.35, (t) => ruido() * Math.sin(Math.PI * (t / 0.35)) ** 2 * 0.45),
  // La caja confirma: dos notas cortas que suben.
  caja: muestras(0.3, (t) => {
    const a = t < 0.09 ? seno(t, 880) * caida(t, 30) : 0;
    const b = t >= 0.09 ? seno(t - 0.09, 1320) * caida(t - 0.09, 18) : 0;
    return (a + b) * 0.7;
  }),
};

function wav(datos) {
  const pcm = Buffer.alloc(datos.length * 2);
  datos.forEach((v, i) => pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), i * 2));
  const cab = Buffer.alloc(44);
  cab.write("RIFF", 0);
  cab.writeUInt32LE(36 + pcm.length, 4);
  cab.write("WAVEfmt ", 8);
  cab.writeUInt32LE(16, 16);
  cab.writeUInt16LE(1, 20); // PCM
  cab.writeUInt16LE(1, 22); // mono
  cab.writeUInt32LE(HZ, 24);
  cab.writeUInt32LE(HZ * 2, 28);
  cab.writeUInt16LE(2, 32);
  cab.writeUInt16LE(16, 34);
  cab.write("data", 36);
  cab.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([cab, pcm]);
}

mkdirSync(DESTINO, { recursive: true });
for (const [nombre, datos] of Object.entries(SONIDOS)) {
  writeFileSync(path.join(DESTINO, `${nombre}.wav`), wav(datos));
  console.log(`public/sonidos/${nombre}.wav`);
}

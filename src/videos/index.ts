import type React from "react";
import { MINIMO_SEGUNDOS, FPS } from "../formato";
import * as CartonVsFiddle from "./2026-10-24-carton-vs-fiddle";
import * as IgualDeRapido from "./2026-10-24-igual-de-rapido";
import * as QuienVuelve from "./2026-10-24-quien-vuelve";
import * as TuTarjeta from "./2026-10-24-tu-tarjeta";
import * as Regalar from "./2026-10-24-regalar-sale-a-cuenta";

// ============================================================================
// LOS VÍDEOS
// ----------------------------------------------------------------------------
// Un vídeo nuevo = su carpeta en src/videos/<id>/ (index.tsx, guion.md y, si lleva
// voz, locucion.json + tiempos.json) y una entrada aquí. El id es el nombre del
// fichero que sale y de su Release en GitHub: minúsculas y guiones, empezando por la
// fecha (2026-10-24-carton-vs-fiddle). Con voz, la duración la da la voz (DURACION).
// ============================================================================

export type Video = {
  id: string;
  componente: React.FC<{ guia?: boolean }>;
  /** En fotogramas (s(segundos)). Nunca menos de MINIMO_SEGUNDOS. */
  duracion: number;
};

export const VIDEOS: Video[] = [
  { id: "2026-10-24-carton-vs-fiddle", componente: CartonVsFiddle.CartonVsFiddle, duracion: CartonVsFiddle.DURACION },
  { id: "2026-10-24-igual-de-rapido", componente: IgualDeRapido.IgualDeRapido, duracion: IgualDeRapido.DURACION },
  { id: "2026-10-24-quien-vuelve", componente: QuienVuelve.QuienVuelve, duracion: QuienVuelve.DURACION },
  { id: "2026-10-24-tu-tarjeta", componente: TuTarjeta.TuTarjeta, duracion: TuTarjeta.DURACION },
  { id: "2026-10-24-regalar-sale-a-cuenta", componente: Regalar.RegalarSaleACuenta, duracion: Regalar.DURACION },
];

for (const v of VIDEOS) {
  if (v.duracion < MINIMO_SEGUNDOS * FPS) throw new Error(`${v.id} dura menos de ${MINIMO_SEGUNDOS} s`);
}

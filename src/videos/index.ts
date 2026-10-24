import type React from "react";
import { MINIMO_SEGUNDOS, FPS } from "../formato";
import type { Horario } from "../comun/Locucion";
import * as CartonVsFiddle from "./2026-10-24-carton-vs-fiddle";
import * as IgualDeRapido from "./2026-10-24-igual-de-rapido";
import * as QuienVuelve from "./2026-10-24-quien-vuelve";
import * as TuTarjeta from "./2026-10-24-tu-tarjeta";
import * as Regalar from "./2026-10-24-regalar-sale-a-cuenta";
import * as DosSellos from "./2026-10-24-dos-sellos-de-regalo";
import * as Ratas from "./2026-10-24-ratas-y-cafe";
import * as NoSeVe from "./2026-10-24-lo-que-no-se-ve";
import * as SinSillas from "./2026-10-24-cafes-sin-sillas";
import * as Gorilas from "./2026-10-24-gorilas-con-sellos";

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
  /** El de la voz, para revisar por frases con la Hoja (src/Hoja.tsx). */
  horario?: Horario;
};

export const VIDEOS: Video[] = [
  { id: "2026-10-24-carton-vs-fiddle", componente: CartonVsFiddle.CartonVsFiddle, duracion: CartonVsFiddle.DURACION },
  { id: "2026-10-24-igual-de-rapido", componente: IgualDeRapido.IgualDeRapido, duracion: IgualDeRapido.DURACION },
  { id: "2026-10-24-quien-vuelve", componente: QuienVuelve.QuienVuelve, duracion: QuienVuelve.DURACION },
  { id: "2026-10-24-tu-tarjeta", componente: TuTarjeta.TuTarjeta, duracion: TuTarjeta.DURACION },
  { id: "2026-10-24-regalar-sale-a-cuenta", componente: Regalar.RegalarSaleACuenta, duracion: Regalar.DURACION },
  { id: "2026-10-24-dos-sellos-de-regalo", componente: DosSellos.DosSellosDeRegalo, duracion: DosSellos.DURACION, horario: DosSellos.HORARIO },
  { id: "2026-10-24-ratas-y-cafe", componente: Ratas.RatasYCafe, duracion: Ratas.DURACION, horario: Ratas.HORARIO },
  { id: "2026-10-24-lo-que-no-se-ve", componente: NoSeVe.LoQueNoSeVe, duracion: NoSeVe.DURACION, horario: NoSeVe.HORARIO },
  { id: "2026-10-24-cafes-sin-sillas", componente: SinSillas.CafesSinSillas, duracion: SinSillas.DURACION, horario: SinSillas.HORARIO },
  { id: "2026-10-24-gorilas-con-sellos", componente: Gorilas.GorilasConSellos, duracion: Gorilas.DURACION, horario: Gorilas.HORARIO },
];

for (const v of VIDEOS) {
  if (v.duracion < MINIMO_SEGUNDOS * FPS) throw new Error(`${v.id} dura menos de ${MINIMO_SEGUNDOS} s`);
}

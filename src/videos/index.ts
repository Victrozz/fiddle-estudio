import type React from "react";
import { MINIMO_SEGUNDOS, FPS } from "../formato";

// ============================================================================
// LOS VÍDEOS
// ----------------------------------------------------------------------------
// Un vídeo nuevo = su carpeta en src/videos/<id>/ (index.tsx y guion.md) y una
// entrada aquí. El id es el nombre del fichero que sale y de su Release en GitHub:
// minúsculas y guiones, empezando por la fecha (2026-10-24-carton-vs-fiddle).
// ============================================================================

export type Video = {
  id: string;
  componente: React.FC<{ guia?: boolean }>;
  /** En fotogramas (s(segundos)). Nunca menos de MINIMO_SEGUNDOS. */
  duracion: number;
};

export const VIDEOS: Video[] = [];

for (const v of VIDEOS) {
  if (v.duracion < MINIMO_SEGUNDOS * FPS) throw new Error(`${v.id} dura menos de ${MINIMO_SEGUNDOS} s`);
}

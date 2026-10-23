// ============================================================================
// LA MARCA EN LOS VÍDEOS
// ----------------------------------------------------------------------------
// Los colores NO se copian: salen de la paleta de la web de fiddle
// (src/app/home/paleta.js, «Verde y espresso»). Si allí cambian, aquí también.
// Lo que se añade es solo lo de vídeo: qué texto va sobre cada fondo y los
// tamaños de letra para leerse en un móvil sin pararse.
// ============================================================================

import { PALETA } from "@fiddle/app/home/paleta";

export const P = PALETA;

export const FUENTE = "Geist";

export const FONDOS = {
  papel: P.papel,
  crema: P.crema,
  superficie: P.superficie,
  verde: P.verde,
  espresso: P.espresso,
} as const;
export type Fondo = keyof typeof FONDOS;

export const esOscuro = (f: Fondo) => f === "verde" || f === "espresso";

/** El texto sobre cada fondo. */
export const tintaDe = (f: Fondo) => (esOscuro(f) ? P.papel : P.espresso);
/** El texto secundario sobre cada fondo. */
export const suaveDe = (f: Fondo) => (esOscuro(f) ? P.avena : P.vison);
/**
 * El acento sobre cada fondo. Sobre claro el camel solo llega a 3,3:1: vale para
 * cosas GRANDES (un titular, un icono), no para letra pequeña (ahí, camelOscuro).
 */
export const acentoDe = (f: Fondo) => (esOscuro(f) ? P.avena : P.camel);

// Un ✓ y un ✗ que no son el verde de la marca (se confundirían con «es fiddle»).
export const BIEN = "#2f7d4f";
export const MAL = "#b5483b";

/** Tamaños de letra a 1080 de ancho. Por debajo de `nota` no se lee en el móvil. */
export const TAM = { gancho: 112, titulo: 88, texto: 60, nota: 42 } as const;

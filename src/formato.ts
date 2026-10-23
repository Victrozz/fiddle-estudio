// ============================================================================
// EL FORMATO DE TODOS LOS VÍDEOS
// ----------------------------------------------------------------------------
// Vertical, para TikTok, Reels y Shorts. Ninguno baja de MINIMO_SEGUNDOS: los
// vídeos muy cortos no se publican.
// ============================================================================

export const ANCHO = 1080;
export const ALTO = 1920;
export const FPS = 30;
export const MINIMO_SEGUNDOS = 10;

/** Segundos → fotogramas. */
export const s = (segundos: number) => Math.round(segundos * FPS);

// Lo que tapan las apps encima del vídeo: pestañas arriba; texto, música y botones
// abajo y a la derecha. Es lo peor de TikTok, Reels y Shorts a 1080x1920. Nada que
// haya que leer va ahí (se ve con `guia` en el Studio).
export const SEGURA = { arriba: 220, abajo: 440, izquierda: 64, derecha: 150 };

/** El hueco que se lee siempre, ya sin las zonas tapadas. */
export const ZONA_LIBRE = {
  x: SEGURA.izquierda,
  y: SEGURA.arriba,
  ancho: ANCHO - SEGURA.izquierda - SEGURA.derecha,
  alto: ALTO - SEGURA.arriba - SEGURA.abajo,
};

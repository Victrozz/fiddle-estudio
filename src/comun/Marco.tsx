import React from "react";
import { AbsoluteFill } from "remotion";
import { hojaDeColores } from "@fiddle/app/ui";
import { PILA_FUENTES } from "./fuentes";
import { FONDOS, tintaDe, type Fondo } from "../marca";
import { ZonaSegura } from "./ZonaSegura";

// ============================================================================
// EL MARCO DE CADA VÍDEO
// ----------------------------------------------------------------------------
// Todo vídeo empieza por aquí: fondo de la marca, Geist, el grano del papel y las
// variables de color de la app (la caja de fiddle las usa). Con `guia`, encima, lo
// que tapan TikTok y Reels: se enciende en el Studio para revisar, nunca al render.
// ============================================================================

type Props = { fondo?: Fondo; guia?: boolean; grano?: boolean; children?: React.ReactNode };

export const Marco: React.FC<Props> = ({ fondo = "papel", guia = false, grano = true, children }) => (
  <AbsoluteFill style={{ background: FONDOS[fondo], color: tintaDe(fondo), fontFamily: PILA_FUENTES }}>
    <style>{hojaDeColores}</style>
    {grano && <Grano />}
    {children}
    {guia && <ZonaSegura />}
  </AbsoluteFill>
);

/** El grano del papel: ruido fijo, debajo del contenido (las letras quedan limpias). */
export const Grano: React.FC<{ opacidad?: number }> = ({ opacidad = 0.08 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply", opacity: opacidad }}>
    <svg width="100%" height="100%">
      <filter id="grano">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grano)" />
    </svg>
  </AbsoluteFill>
);

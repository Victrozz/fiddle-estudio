import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { ANCHO, ALTO } from "../formato";
import { aPantalla, type Camara, type V3 } from "./camara";
import { entrada, salida } from "../comun/movimiento";
import { P } from "../marca";

// ============================================================================
// LO PLANO ENCIMA DE LO 3D
// ----------------------------------------------------------------------------
// Las letras no van dentro de la escena (en 3D no hay fuentes fiables ni se leen
// nítidas): van encima, en HTML, pegadas al punto 3D con la MISMA cámara que la
// escena (`aPantalla`). <SobreEscena> va fuera de <Escena>, en el mismo AbsoluteFill.
// ============================================================================

type Props = { camara: Camara; punto: V3; children: React.ReactNode };

export const SobreEscena: React.FC<Props> = ({ camara, punto, children }) => {
  const width = ANCHO;
  const height = ALTO;
  const p = aPantalla(punto, camara, width, height);
  if (!p.delante) return null;
  return <div style={{ position: "absolute", left: p.x, top: p.y, transform: "translate(-50%, -100%)" }}>{children}</div>;
};

/** El bocadillo de encima de una cabeza: «+1 punto», «¡Café gratis!». */
export const Bocadillo: React.FC<{ texto: string; desde?: number; hasta?: number; fondo?: string; color?: string; tam?: number }> = ({ texto, desde = 0, hasta, fondo = P.verde, color = P.papel, tam = 44 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = entrada(frame, fps, desde);
  if (frame < desde) return null;
  return (
    <div style={{ opacity: Math.min(1, e * 1.5) * salida(frame, hasta), transform: `translateY(${(1 - e) * 30}px) scale(${0.6 + 0.4 * e})`, transformOrigin: "bottom center", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ background: fondo, color, fontSize: tam, fontWeight: 750, padding: `${tam * 0.3}px ${tam * 0.6}px`, borderRadius: tam * 0.7, whiteSpace: "nowrap", boxShadow: "0 8px 22px rgba(31,24,18,.25)" }}>{texto}</div>
      <div style={{ width: 0, height: 0, borderLeft: `${tam * 0.3}px solid transparent`, borderRight: `${tam * 0.3}px solid transparent`, borderTop: `${tam * 0.32}px solid ${fondo}` }} />
    </div>
  );
};

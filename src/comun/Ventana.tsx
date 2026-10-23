import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tramo } from "./movimiento";
import { ANCHO, SEGURA } from "../formato";
import { LIMITE_ESCENA } from "./Locucion";

// ============================================================================
// VENTANAS: una escena que se ve entre dos fotogramas
// ----------------------------------------------------------------------------
// En los vídeos con voz todo se coloca con fotogramas ABSOLUTOS (los del horario:
// `h.en("giro")`), así que las escenas no van dentro de un <Sequence> (que
// cambiaría la cuenta): van en una <Ventana desde hasta>, que entra y sale fundiendo.
// <ZonaEscena> es el hueco que se lee: entre lo que tapan las apps arriba y los
// subtítulos abajo.
// ============================================================================

type Props = { desde: number; hasta: number; entra?: number; sale?: number; children: React.ReactNode; style?: React.CSSProperties };

export const Ventana: React.FC<Props> = ({ desde, hasta, entra = 8, sale = 8, children, style }) => {
  const frame = useCurrentFrame();
  if (frame < desde || frame >= hasta) return null;
  const dentro = entra ? tramo(frame, desde, entra) : 1;
  const fuera = sale ? 1 - tramo(frame, hasta - sale, sale) : 1;
  return <AbsoluteFill style={{ opacity: Math.min(dentro, fuera), ...style }}>{children}</AbsoluteFill>;
};

export const ZONA_ESCENA = { x: SEGURA.izquierda, y: SEGURA.arriba, ancho: ANCHO - SEGURA.izquierda - SEGURA.derecha, alto: LIMITE_ESCENA - SEGURA.arriba };

export const ZonaEscena: React.FC<{ children: React.ReactNode; gap?: number; alinear?: React.CSSProperties["alignItems"]; style?: React.CSSProperties }> = ({ children, gap = 48, alinear = "center", style }) => (
  <div style={{ position: "absolute", left: ZONA_ESCENA.x, top: ZONA_ESCENA.y, width: ZONA_ESCENA.ancho, height: ZONA_ESCENA.alto, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: alinear, gap, ...style }}>
    {children}
  </div>
);

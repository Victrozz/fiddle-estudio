import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { entrada } from "../comun/movimiento";
import { P } from "../marca";

// ============================================================================
// LAS TAZAS: cada visita, una taza
// ----------------------------------------------------------------------------
// Una rejilla de tazas que se llenan de una en una (cada `cadencia` fotogramas
// desde `desde`). Las de `gratis` salen con el regalo: así se VE que regalar una
// de cada diez es poco frente a las nueve que se cobran. Con `llenas` fijo, sin
// animación.
// ============================================================================

type Props = {
  total: number;
  llenas?: number;
  desde?: number;
  cadencia?: number;
  /** Índices (desde 0) de las tazas que son gratis. */
  gratis?: number[];
  columnas?: number;
  tam?: number;
  color?: string;
  colorGratis?: string;
};

export const Tazas: React.FC<Props> = ({ total, llenas, desde = 0, cadencia = 4, gratis = [], columnas = 5, tam = 140, color = P.camelOscuro, colorGratis = P.verde }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${columnas}, ${tam}px)`, gap: tam * 0.18 }}>
      {Array.from({ length: total }, (_, i) => {
        const e = llenas !== undefined ? (i < llenas ? 1 : 0) : entrada(frame, fps, desde + i * cadencia);
        const esGratis = gratis.includes(i);
        return <Taza key={i} tam={tam} llena={e} color={esGratis ? colorGratis : color} gratis={esGratis} />;
      })}
    </div>
  );
};

const Taza: React.FC<{ tam: number; llena: number; color: string; gratis: boolean }> = ({ tam, llena, color, gratis }) => (
  <div style={{ position: "relative", width: tam, height: tam }}>
    <svg viewBox="0 0 100 100" width={tam} height={tam} style={{ display: "block", overflow: "visible", transform: `scale(${0.85 + 0.15 * Math.min(1, llena)})` }}>
      <path d="M18 38 h56 v22 a28 28 0 0 1 -56 0 z" fill={llena > 0.05 ? color : "none"} fillOpacity={Math.min(1, llena)} stroke={llena > 0.05 ? color : P.avena} strokeWidth="5" strokeLinejoin="round" />
      <path d="M74 44 a11 11 0 0 1 0 22" fill="none" stroke={llena > 0.05 ? color : P.avena} strokeWidth="5" strokeLinecap="round" />
      <path d="M14 92 h66" stroke={llena > 0.05 ? color : P.avena} strokeWidth="5" strokeLinecap="round" />
      {llena > 0.5 && <path d="M36 28 q6 -8 0 -16 M52 28 q6 -8 0 -16" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" opacity={llena > 1 ? 1 : llena} />}
    </svg>
    {gratis && llena > 0.3 && (
      <div style={{ position: "absolute", left: "50%", bottom: -tam * 0.12, transform: `translateX(-50%) scale(${Math.min(1, llena)})`, background: color, color: P.papel, fontSize: tam * 0.17, fontWeight: 800, letterSpacing: "0.05em", padding: `${tam * 0.04}px ${tam * 0.1}px`, borderRadius: tam * 0.1 }}>
        GRATIS
      </div>
    )}
  </div>
);

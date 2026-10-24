import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { entrada } from "./movimiento";
import { P, TAM } from "../marca";

// ============================================================================
// LA CITA: de dónde sale lo que se cuenta
// ----------------------------------------------------------------------------
// Los vídeos que cuentan un estudio dicen cuál: los autores y el año, pequeño y
// en una esquina de la escena. Da credibilidad y se puede buscar. Nunca una cifra
// de estudio sin su cita.
// ============================================================================

type Props = { texto: string; desde?: number; oscuro?: boolean; style?: React.CSSProperties };

export const Cita: React.FC<Props> = ({ texto, desde = 0, oscuro = false, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = entrada(frame, fps, desde, true);
  const tinta = oscuro ? P.avena : P.vison;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 22px 10px 16px",
        borderRadius: 999,
        border: `2px solid ${tinta}`,
        color: tinta,
        fontSize: TAM.nota,
        fontWeight: 600,
        letterSpacing: "-0.01em",
        whiteSpace: "nowrap",
        opacity: e,
        transform: `translateY(${(1 - e) * 16}px)`,
        ...style,
      }}
    >
      <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={tinta} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z" />
        <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z" />
      </svg>
      {texto}
    </div>
  );
};

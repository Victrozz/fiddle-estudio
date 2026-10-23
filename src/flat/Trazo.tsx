import React from "react";
import { useCurrentFrame } from "remotion";
import { tramo } from "../comun/movimiento";
import { P } from "../marca";

// ============================================================================
// TRAZOS A MANO: subrayar, rodear, señalar
// ----------------------------------------------------------------------------
// Como un rotulador sobre el póster: se dibuja en `duracion` fotogramas desde
// `desde`. Se coloca encima de lo que marca (position: absolute en el padre). El
// grosor no cambia con el tamaño de la caja.
// ============================================================================

const FORMAS = {
  subrayado: "M2 60 C 22 48, 40 70, 60 56 S 88 50, 98 58",
  rodear: "M50 6 C 80 4, 99 22, 97 50 C 95 80, 70 96, 46 94 C 18 92, 2 74, 4 48 C 6 22, 26 8, 56 10",
  flecha: "M6 90 C 20 50, 50 20, 92 12 M72 6 L93 12 L82 30",
  tachar: "M4 70 L96 30",
} as const;

type Props = {
  forma: keyof typeof FORMAS;
  ancho: number;
  alto: number;
  desde?: number;
  duracion?: number;
  color?: string;
  grosor?: number;
  style?: React.CSSProperties;
};

export const Trazo: React.FC<Props> = ({ forma, ancho, alto, desde = 0, duracion = 14, color = P.camel, grosor = 12, style }) => {
  const frame = useCurrentFrame();
  const t = tramo(frame, desde, duracion);
  return (
    <svg width={ancho} height={alto} viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", overflow: "visible", pointerEvents: "none", ...style }}>
      <path d={FORMAS[forma]} fill="none" stroke={color} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
    </svg>
  );
};

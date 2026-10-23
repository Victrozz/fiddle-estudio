import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { entrada, salida } from "./movimiento";

// Cualquier cosa que entra subiendo y se va apagándose. Para lo que no es un
// Titular: un párrafo, una tarjeta, un móvil.

type Props = {
  desde?: number;
  hasta?: number;
  /** Cuánto sube al entrar, en px. */
  sube?: number;
  /** Escala de partida (1 = sin zoom). */
  escala?: number;
  suave?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export const Aparece: React.FC<Props> = ({ desde = 0, hasta, sube = 60, escala = 1, suave = false, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = entrada(frame, fps, desde, suave);
  const z = escala + (1 - escala) * e;
  return (
    <div
      style={{
        opacity: Math.min(1, e * 1.5) * salida(frame, hasta),
        transform: `translateY(${(1 - e) * sube}px) scale(${z})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

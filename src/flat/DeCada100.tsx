import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entrada } from "../comun/movimiento";
import { P } from "../marca";

// ============================================================================
// DE CADA 100
// ----------------------------------------------------------------------------
// Cien puntos y se van encendiendo hasta `valor`: un porcentaje que se VE (19 de
// cada 100 contra 34 de cada 100 se entiende sin leer). Cada punto rebota al
// encenderse; los encendidos van de `desde` a `desde + dur`.
// ============================================================================

type Props = { valor: number; desde: number; dur?: number; ancho?: number; color?: string; apagado?: string; columnas?: number };

export const DeCada100: React.FC<Props> = ({ valor, desde, dur = 40, ancho = 380, color = P.verde, apagado = "rgba(96,84,75,.18)", columnas = 10 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const paso = ancho / columnas;
  const r = paso * 0.36;
  const encendidos = interpolate(frame, [desde, desde + dur], [0, valor], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const filas = Math.ceil(100 / columnas);
  return (
    <svg width={ancho} height={paso * filas} viewBox={`0 0 ${ancho} ${paso * filas}`} style={{ display: "block", overflow: "visible" }}>
      {Array.from({ length: 100 }, (_, i) => {
        // Se llenan de abajo arriba, como un vaso.
        const fila = filas - 1 - Math.floor(i / columnas);
        const col = i % columnas;
        const cuando = desde + (dur * i) / Math.max(1, valor);
        const on = i < Math.floor(encendidos + 1e-6);
        const e = on ? entrada(frame, fps, cuando) : 0;
        return <circle key={i} cx={paso * (col + 0.5)} cy={paso * (fila + 0.5)} r={on ? r * (0.6 + 0.4 * e) : r * 0.82} fill={on ? color : apagado} />;
      })}
    </svg>
  );
};

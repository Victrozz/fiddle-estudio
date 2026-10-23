import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { P } from "../marca";

// ============================================================================
// LA CORTINA: un paño de color que barre la pantalla
// ----------------------------------------------------------------------------
// Tapa del todo a mitad de `duracion` (ahí se cambia lo de debajo) y se va por el
// otro lado. Es la transición del estilo póster; para fundidos y deslizamientos
// entre escenas, TransitionSeries de @remotion/transitions. Con el sonido «zas».
// ============================================================================

type Props = { desde: number; duracion?: number; color?: string; direccion?: "arriba" | "izquierda" };

export const Cortina: React.FC<Props> = ({ desde, duracion = 18, color = P.verde, direccion = "arriba" }) => {
  const frame = useCurrentFrame();
  if (frame < desde || frame > desde + duracion) return null;
  const mitad = duracion / 2;
  const fijo = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) } as const;
  const entra = interpolate(frame, [desde, desde + mitad], [100, 0], fijo);
  const sale = interpolate(frame, [desde + mitad, desde + duracion], [0, 100], fijo);
  const clip = direccion === "arriba" ? `inset(${sale}% 0 ${entra}% 0)` : `inset(0 ${entra}% 0 ${sale}%)`;
  return <AbsoluteFill style={{ background: color, clipPath: clip }} />;
};

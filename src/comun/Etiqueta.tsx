import React from "react";
import { P } from "../marca";

// Una pastilla de texto en mayúsculas: «SIN FIDDLE», «CON FIDDLE», «HOY».

type Props = { texto: string; fondo?: string; color?: string; tam?: number; style?: React.CSSProperties };

export const Etiqueta: React.FC<Props> = ({ texto, fondo = P.verde, color = P.papel, tam = 34, style }) => (
  <span
    style={{
      display: "inline-block",
      padding: `${tam * 0.32}px ${tam * 0.7}px`,
      borderRadius: tam,
      background: fondo,
      color,
      fontSize: tam,
      fontWeight: 700,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      lineHeight: 1,
      ...style,
    }}
  >
    {texto}
  </span>
);

import React from "react";
import { useCurrentFrame } from "remotion";
import { tramo } from "./movimiento";

// Una cifra que sube (o baja) de `de` a `a`, escrita como en España: «1,80 €»,
// «450 €». Las cifras van en ancho fijo para que no bailen mientras cuentan.

type Props = {
  de?: number;
  a: number;
  desde?: number;
  /** Fotogramas que tarda en contar. */
  duracion?: number;
  decimales?: number;
  antes?: string;
  despues?: string;
  style?: React.CSSProperties;
};

export const Contador: React.FC<Props> = ({ de = 0, a, desde = 0, duracion = 30, decimales = 0, antes = "", despues = "", style }) => {
  const frame = useCurrentFrame();
  const valor = de + (a - de) * tramo(frame, desde, duracion);
  const texto = new Intl.NumberFormat("es-ES", { minimumFractionDigits: decimales, maximumFractionDigits: decimales }).format(valor);
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {antes}
      {texto}
      {despues}
    </span>
  );
};

import React from "react";
import { random } from "remotion";
import { P } from "../marca";

// Un QR de mentira (no se puede escanear): los tres cuadros de las esquinas y
// puntos al azar fijo. Para enseñar el QR de la tarjeta sin poner el serial de
// nadie en un vídeo. Debajo, el código de 3 letras, como en la tarjeta de verdad.

const N = 25;

export const QrFalso: React.FC<{ tam?: number; codigo?: string; semilla?: string }> = ({ tam = 180, codigo = "K7P", semilla = "qr" }) => {
  const m = tam / N;
  const esEsquina = (x: number, y: number) => (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
  const cuadros: React.ReactNode[] = [];
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++)
      if (!esEsquina(x, y) && random(`${semilla}-${x}-${y}`) < 0.45) cuadros.push(<rect key={`${x}-${y}`} x={x * m} y={y * m} width={m} height={m} />);
  const esquina = (x: number, y: number) => (
    <g key={`e${x}${y}`}>
      <rect x={x * m} y={y * m} width={7 * m} height={7 * m} />
      <rect x={(x + 1) * m} y={(y + 1) * m} width={5 * m} height={5 * m} fill="#fff" />
      <rect x={(x + 2) * m} y={(y + 2) * m} width={3 * m} height={3 * m} />
    </g>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: tam * 0.06 }}>
      <div style={{ background: "#fff", padding: tam * 0.08, borderRadius: tam * 0.08 }}>
        <svg width={tam} height={tam} style={{ display: "block" }} fill={P.espresso}>
          {cuadros}
          {esquina(0, 0)}
          {esquina(N - 7, 0)}
          {esquina(0, N - 7)}
        </svg>
      </div>
      <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontWeight: 700, fontSize: tam * 0.14, letterSpacing: "0.2em", color: P.avena }}>{codigo}</div>
    </div>
  );
};

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { entrada, tramo } from "../comun/movimiento";
import { Contador } from "../comun/Contador";
import { P } from "../marca";

// Barras horizontales que crecen una detrás de otra, con su cifra contando al
// final. Para comparar pocas cosas (2-4): «lo que cuesta un café gratis» frente a
// «lo que deja un habitual».

type Barra = { etiqueta: string; valor: number; color?: string };
type Props = {
  barras: Barra[];
  ancho?: number;
  maximo?: number;
  desde?: number;
  cadencia?: number;
  duracion?: number;
  decimales?: number;
  despues?: string;
  tam?: number;
};

export const Barras: React.FC<Props> = ({ barras, ancho = 880, maximo, desde = 0, cadencia = 12, duracion = 30, decimales = 0, despues = "", tam = 44 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tope = maximo ?? Math.max(...barras.map((b) => b.valor));
  return (
    <div style={{ width: ancho, display: "flex", flexDirection: "column", gap: tam * 0.7 }}>
      {barras.map((b, i) => {
        const llega = desde + i * cadencia;
        const e = entrada(frame, fps, llega, true);
        const largo = (b.valor / tope) * tramo(frame, llega, duracion);
        const color = b.color ?? (i === barras.length - 1 ? P.verde : P.camel);
        return (
          <div key={b.etiqueta} style={{ opacity: e }}>
            <div style={{ fontSize: tam * 0.8, fontWeight: 600, color: P.vison, marginBottom: tam * 0.2 }}>{b.etiqueta}</div>
            <div style={{ display: "flex", alignItems: "center", gap: tam * 0.4 }}>
              <div style={{ height: tam * 1.5, width: `${Math.max(0.01, largo) * 72}%`, background: color, borderRadius: tam * 0.3 }} />
              <Contador a={b.valor} desde={llega} duracion={duracion} decimales={decimales} despues={despues} style={{ fontSize: tam * 1.1, fontWeight: 750, color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

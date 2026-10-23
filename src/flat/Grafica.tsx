import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { entrada, tramo } from "../comun/movimiento";
import { P } from "../marca";

// ============================================================================
// LA GRÁFICA DE LÍNEAS
// ----------------------------------------------------------------------------
// Una o dos líneas que se dibujan de izquierda a derecha y acaban con su punto y
// su cifra. Para «con / sin» a lo largo del tiempo. Sin ejes ni rejilla de más:
// lo que se lee es la forma y la cifra del final.
//
// Las cifras de un vídeo NO se inventan: o salen de una cuenta que se enseña
// («1 café al día × 1,80 €…») o el vídeo dice que es un ejemplo.
// ============================================================================

type Serie = { nombre: string; valores: number[]; color?: string; relleno?: boolean };
type Props = {
  series: Serie[];
  ancho?: number;
  alto?: number;
  desde?: number;
  duracion?: number;
  maximo?: number;
  /** Debajo del eje: la primera y la última («Mes 1», «Mes 12»). */
  extremos?: [string, string];
  formato?: (n: number) => string;
  tam?: number;
};

export const Grafica: React.FC<Props> = ({ series, ancho = 880, alto = 620, desde = 0, duracion = 60, maximo, extremos, formato = (n) => String(Math.round(n)), tam = 40 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tope = maximo ?? Math.max(...series.flatMap((s) => s.valores)) * 1.1;
  const margen = { izq: 8, der: tam * 4.2, arr: tam, aba: extremos ? tam * 1.6 : 8 };
  const w = ancho - margen.izq - margen.der;
  const h = alto - margen.arr - margen.aba;
  const t = tramo(frame, desde, duracion);
  const punto = (v: number, i: number, n: number) => [margen.izq + (w * i) / (n - 1), margen.arr + h * (1 - v / tope)] as const;

  return (
    <svg width={ancho} height={alto} style={{ display: "block", overflow: "visible" }}>
      {[0.33, 0.66, 1].map((k) => (
        <line key={k} x1={margen.izq} x2={margen.izq + w} y1={margen.arr + h * (1 - k)} y2={margen.arr + h * (1 - k)} stroke={P.avena} strokeWidth={2} strokeDasharray="6 10" />
      ))}
      <line x1={margen.izq} x2={margen.izq + w} y1={margen.arr + h} y2={margen.arr + h} stroke={P.vison} strokeWidth={3} />

      {series.map((s, si) => {
        const color = s.color ?? (si === 0 ? P.verde : P.camel);
        const pts = s.valores.map((v, i) => punto(v, i, s.valores.length));
        const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
        const area = `${d} L${pts[pts.length - 1][0]} ${margen.arr + h} L${pts[0][0]} ${margen.arr + h} Z`;
        const [fx, fy] = pts[pts.length - 1];
        const fin = entrada(frame, fps, desde + duracion);
        return (
          <g key={s.nombre}>
            {s.relleno && (
              <>
                <clipPath id={`hasta-${si}`}>
                  <rect x={0} y={0} width={margen.izq + w * t} height={alto} />
                </clipPath>
                <path d={area} fill={color} fillOpacity={0.12} clipPath={`url(#hasta-${si})`} />
              </>
            )}
            <path d={d} fill="none" stroke={color} strokeWidth={tam * 0.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
            <g opacity={Math.min(1, fin * 1.5)} transform={`translate(${fx} ${fy})`}>
              <circle r={tam * 0.32 * fin} fill={color} />
              <text x={tam * 0.6} y={-tam * 0.1} fill={color} fontSize={tam * 1.1} fontWeight={750} dominantBaseline="middle">
                {formato(s.valores[s.valores.length - 1])}
              </text>
              <text x={tam * 0.6} y={tam * 0.9} fill={P.vison} fontSize={tam * 0.65} fontWeight={600} dominantBaseline="middle">
                {s.nombre}
              </text>
            </g>
          </g>
        );
      })}

      {extremos && (
        <g fill={P.vison} fontSize={tam * 0.7} fontWeight={600}>
          <text x={margen.izq} y={alto - 4}>{extremos[0]}</text>
          <text x={margen.izq + w} y={alto - 4} textAnchor="end">{extremos[1]}</text>
        </g>
      )}
    </svg>
  );
};

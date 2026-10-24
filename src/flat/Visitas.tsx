import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { entrada, tramo } from "../comun/movimiento";
import { P } from "../marca";

// ============================================================================
// LAS VISITAS EN UNA LÍNEA
// ----------------------------------------------------------------------------
// Cada visita es un punto en la línea del tiempo y, entre una y otra, un arco: el
// tiempo que tardó en volver. Arcos que encogen = vuelve antes. `huecos` son las
// esperas (en días, o lo que sea: solo cuenta la proporción); `en[i]` el fotograma
// en que aparece la visita i (hay huecos.length + 1). `especiales` pinta visitas
// de otro color (el café gratis).
// ============================================================================

type Props = {
  huecos: number[];
  en: number[];
  ancho?: number;
  alto?: number;
  color?: string;
  especiales?: Record<number, string>;
  /** Altura del arco por unidad de hueco. */
  arco?: number;
};

export const Visitas: React.FC<Props> = ({ huecos, en, ancho = 900, alto = 220, color = P.verde, especiales = {}, arco }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = huecos.reduce((a, b) => a + b, 0);
  const margen = 26;
  const escala = (ancho - margen * 2) / total;
  const xs = [margen];
  for (const h of huecos) xs.push(xs[xs.length - 1] + h * escala);
  const base = alto - 40;
  const alturaArco = arco ?? (base - 20) / Math.max(...huecos);
  return (
    <svg width={ancho} height={alto} viewBox={`0 0 ${ancho} ${alto}`} style={{ display: "block", overflow: "visible" }}>
      <line x1={0} y1={base} x2={ancho} y2={base} stroke={P.vison} strokeOpacity={0.35} strokeWidth={4} strokeLinecap="round" />
      {huecos.map((h, i) => {
        // El arco se dibuja mientras «espera»: de la visita i a la i+1.
        const t = tramo(frame, en[i], Math.max(4, en[i + 1] - en[i]));
        if (t <= 0) return null;
        const x1 = xs[i];
        const x2 = xs[i + 1];
        const cima = base - h * alturaArco;
        const d = `M ${x1} ${base} Q ${(x1 + x2) / 2} ${cima * 2 - base} ${x2} ${base}`;
        return <path key={i} d={d} fill="none" stroke={especiales[i + 1] ?? color} strokeOpacity={0.55} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />;
      })}
      {xs.map((x, i) => {
        const e = entrada(frame, fps, en[i]);
        if (frame < en[i]) return null;
        const c = especiales[i] ?? color;
        return <circle key={i} cx={x} cy={base} r={16 * (0.4 + 0.6 * e) + (especiales[i] ? 6 : 0)} fill={c} stroke={P.papel} strokeWidth={4} />;
      })}
    </svg>
  );
};

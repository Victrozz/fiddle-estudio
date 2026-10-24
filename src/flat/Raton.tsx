import React from "react";
import { P } from "../marca";

// ============================================================================
// EL RATÓN Y EL QUESO
// ----------------------------------------------------------------------------
// Un ratón de perfil, mirando a la derecha, de dibujo animado pero sin cara
// exagerada. `fase` son los pasos dados (las patas y la cola van con ella; 0 =
// quieto) y `prisa` (0..1) pinta las rayas de velocidad detrás. Se coloca y se
// escala desde fuera: el dibujo mide 220 x 130 a `tam` 220.
//
// El queso: una cuña con agujeros. Con `casillas`, los agujeros son las de una
// cartilla y se van llenando (el remate de «tú también corres hacia el queso»).
// ============================================================================

const GRIS = "#9a9088";
const GRIS_OSCURO = "#7d736b";
const ROSA = "#d99a94";

type RatonProps = { tam?: number; fase?: number; prisa?: number; style?: React.CSSProperties };

export const Raton: React.FC<RatonProps> = ({ tam = 220, fase = 0, prisa = 0, style }) => {
  const s = Math.sin(fase * Math.PI);
  const c = Math.cos(fase * Math.PI);
  const bote = fase ? -Math.abs(s) * 6 : 0;
  const pata = (dx: number, signo: number) => (fase ? signo * s * 9 : 0) + dx;
  return (
    <svg width={tam} height={(tam * 130) / 220} viewBox="0 0 220 130" style={{ display: "block", overflow: "visible", ...style }}>
      {prisa > 0.02 &&
        [0, 1, 2].map((i) => (
          <line key={i} x1={20 - prisa * 90 - i * 14} y1={50 + i * 18} x2={20 - i * 6} y2={50 + i * 18} stroke={P.vison} strokeOpacity={0.5 * prisa} strokeWidth={5} strokeLinecap="round" />
        ))}
      <g transform={`translate(0 ${bote})`}>
        {/* la cola */}
        <path d={`M 48 86 C 24 ${92 + c * 8}, 14 ${66 - c * 8}, -16 ${76 + s * 10}`} fill="none" stroke={ROSA} strokeWidth={6} strokeLinecap="round" />
        {/* patas de atrás y de delante */}
        <ellipse cx={pata(70, 1)} cy={108} rx={13} ry={8} fill={ROSA} />
        <ellipse cx={pata(132, -1)} cy={108} rx={11} ry={7} fill={ROSA} />
        {/* cuerpo */}
        <ellipse cx={98} cy={78} rx={60} ry={34} fill={GRIS} />
        <ellipse cx={92} cy={92} rx={40} ry={16} fill="#b3aaa2" />
        <ellipse cx={pata(84, -1)} cy={110} rx={12} ry={7} fill={ROSA} />
        <ellipse cx={pata(146, 1)} cy={110} rx={10} ry={6} fill={ROSA} />
        {/* cabeza */}
        <path d="M 140 52 Q 168 40 200 74 Q 176 92 148 90 Q 130 80 140 52 Z" fill={GRIS} />
        <circle cx={146} cy={42} r={17} fill={GRIS_OSCURO} />
        <circle cx={147} cy={43} r={10} fill={ROSA} />
        <circle cx={172} cy={62} r={4.6} fill={P.espresso} />
        <circle cx={173.5} cy={60.5} r={1.5} fill="#fff" />
        <circle cx={201} cy={74} r={5.5} fill={ROSA} />
        {[-6, 0, 6].map((d) => (
          <line key={d} x1={194} y1={78} x2={214} y2={78 + d * 1.6} stroke={GRIS_OSCURO} strokeWidth={1.6} strokeLinecap="round" />
        ))}
      </g>
    </svg>
  );
};

const AMARILLO = "#f0c05a";
const AMARILLO_OSCURO = "#d9a338";

type QuesoProps = { tam?: number; casillas?: number; llenas?: number; colorLleno?: string; style?: React.CSSProperties };

export const Queso: React.FC<QuesoProps> = ({ tam = 160, casillas, llenas = 0, colorLleno = P.verde, style }) => {
  const agujeros = casillas
    ? Array.from({ length: casillas }, (_, i) => {
        const fila = i < Math.ceil(casillas / 2) ? 0 : 1;
        const col = fila === 0 ? i : i - Math.ceil(casillas / 2);
        const n = fila === 0 ? Math.ceil(casillas / 2) : Math.floor(casillas / 2);
        return { x: 32 + (col + 0.5) * (126 / n), y: fila === 0 ? 80 : 108, r: 9 };
      })
    : [
        { x: 60, y: 88, r: 10 },
        { x: 112, y: 76, r: 7 },
        { x: 130, y: 104, r: 11 },
        { x: 84, y: 110, r: 6 },
      ];
  return (
    <svg width={tam} height={(tam * 140) / 180} viewBox="0 0 180 140" style={{ display: "block", overflow: "visible", ...style }}>
      <path d="M 14 56 L 166 30 L 166 126 L 14 126 Z" fill={AMARILLO} />
      <path d="M 14 56 L 166 30 L 166 46 L 14 66 Z" fill="#f7d688" />
      {agujeros.map((a, i) => (
        <circle key={i} cx={a.x} cy={a.y} r={a.r} fill={casillas && i < llenas ? colorLleno : AMARILLO_OSCURO} />
      ))}
    </svg>
  );
};

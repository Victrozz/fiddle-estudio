import React from "react";
import { random, useCurrentFrame } from "remotion";
import { KRAFT, TINTA_SELLO } from "./CartillaCarton";
import { P } from "../marca";

// ============================================================================
// DONDE ACABA LA CARTILLA DE CARTÓN
// ----------------------------------------------------------------------------
// Tres escondites para «¿dónde está tu cartilla?»: el cajón de los trastos, la
// cartera de antes y la lavadora (la cartilla da vueltas en el tambor). Cada uno
// mide 600 x 520 a `ancho` 600 y lleva su cartilla a medio ver.
// ============================================================================

/** La cartilla en pequeño, para meterla en un escondite (kraft y unos sellos). */
const Cartillita: React.FC<{ x: number; y: number; giro?: number; ancho?: number; arrugada?: boolean }> = ({ x, y, giro = 0, ancho = 200, arrugada = false }) => {
  const alto = ancho * 0.6;
  return (
    <g transform={`translate(${x} ${y}) rotate(${giro})`}>
      <rect x={-ancho / 2} y={-alto / 2} width={ancho} height={alto} rx={ancho * 0.05} fill={KRAFT} stroke="#8a6a48" strokeWidth={2} />
      {arrugada && <path d={`M ${-ancho * 0.1} ${-alto / 2} L ${ancho * 0.05} ${alto / 2}`} stroke="#fff" strokeOpacity={0.35} strokeWidth={3} />}
      {Array.from({ length: 10 }, (_, i) => {
        const cx = -ancho * 0.36 + (i % 5) * ancho * 0.18;
        const cy = (i < 5 ? -0.02 : 0.24) * alto;
        return <circle key={i} cx={cx} cy={cy} r={ancho * 0.06} fill={i < 4 ? TINTA_SELLO : "none"} fillOpacity={0.7} stroke="#6b4a2c" strokeOpacity={0.6} strokeWidth={1.5} />;
      })}
      <rect x={-ancho * 0.4} y={-alto * 0.38} width={ancho * 0.45} height={alto * 0.09} rx={3} fill="#6b4a2c" fillOpacity={0.6} />
    </g>
  );
};

export const Cajon: React.FC<{ ancho?: number }> = ({ ancho = 600 }) => (
  <svg width={ancho} height={(ancho * 520) / 600} viewBox="0 0 600 520" style={{ display: "block", overflow: "visible" }}>
    {/* el hueco del cajón, visto desde arriba en perspectiva */}
    <path d="M 70 120 L 530 120 L 570 330 L 30 330 Z" fill="#7a5638" />
    <path d="M 90 135 L 510 135 L 545 320 L 55 320 Z" fill="#4e3624" />
    {/* los trastos, y la cartilla debajo */}
    <Cartillita x={330} y={250} giro={-12} ancho={210} arrugada />
    <path d="M 110 200 C 180 140, 250 300, 330 220 S 470 170, 520 260" fill="none" stroke="#2b2522" strokeWidth={10} strokeLinecap="round" />
    <rect x={120} y={230} width={150} height={80} rx={6} fill="#efe6d8" transform="rotate(8 195 270)" />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={135} y={248 + i * 18} width={110 - i * 20} height={7} rx={3} fill="#b7aa9a" transform="rotate(8 195 270)" />
    ))}
    <g transform="translate(430 160) rotate(30)">
      <circle r={20} fill="none" stroke="#c9a26b" strokeWidth={8} />
      <rect x={16} y={-6} width={60} height={12} rx={4} fill="#c9a26b" />
      <rect x={58} y={4} width={8} height={12} fill="#c9a26b" />
    </g>
    {[0, 1].map((i) => (
      <g key={i} transform={`translate(${440 + i * 36} ${270}) rotate(${-20 + i * 30})`}>
        <rect x={-12} y={-34} width={24} height={68} rx={6} fill={i ? "#c4573a" : "#3f6e8c"} />
        <rect x={-12} y={-34} width={24} height={16} rx={4} fill="#2b2522" />
      </g>
    ))}
    {/* el frente del cajón */}
    <path d="M 30 330 L 570 330 L 570 470 Q 570 490 550 490 L 50 490 Q 30 490 30 470 Z" fill="#a8774d" />
    <rect x={250} y={392} width={100} height={22} rx={11} fill="#5a3d27" />
  </svg>
);

export const Cartera: React.FC<{ ancho?: number }> = ({ ancho = 600 }) => (
  <svg width={ancho} height={(ancho * 520) / 600} viewBox="0 0 600 520" style={{ display: "block", overflow: "visible" }}>
    {/* las tarjetas que asoman, y la cartilla doblada al fondo */}
    <Cartillita x={300} y={150} giro={-6} ancho={250} arrugada />
    <rect x={110} y={120} width={250} height={160} rx={16} fill="#2f4858" transform="rotate(-8 235 200)" />
    <rect x={200} y={105} width={250} height={160} rx={16} fill="#c4573a" transform="rotate(5 325 185)" />
    <rect x={150} y={135} width={250} height={160} rx={16} fill="#d9a441" transform="rotate(-2 275 215)" />
    <rect x={170} y={165} width={44} height={34} rx={6} fill="#efe6d8" fillOpacity={0.8} transform="rotate(-2 275 215)" />
    {/* la cartera */}
    <rect x={70} y={210} width={460} height={270} rx={34} fill="#6e4a2c" />
    <rect x={70} y={210} width={460} height={70} rx={30} fill="#7d5636" />
    <rect x={92} y={232} width={416} height={226} rx={24} fill="none" stroke="#c9a26b" strokeOpacity={0.6} strokeWidth={4} strokeDasharray="14 10" />
  </svg>
);

export const Lavadora: React.FC<{ ancho?: number }> = ({ ancho = 600 }) => {
  const frame = useCurrentFrame();
  const giro = frame * 9;
  return (
    <svg width={ancho} height={(ancho * 520) / 600} viewBox="0 0 600 520" style={{ display: "block", overflow: "visible" }}>
      <rect x={110} y={10} width={380} height={500} rx={34} fill="#f3efe9" stroke="#d8d0c6" strokeWidth={4} />
      <rect x={110} y={10} width={380} height={90} rx={34} fill="#e6dfd6" />
      <circle cx={420} cy={55} r={22} fill="#cfc6bb" />
      <rect x={414} y={36} width={12} height={20} rx={4} fill="#9a9088" transform={`rotate(${giro * 0.2} 420 55)`} />
      <rect x={150} y={40} width={140} height={32} rx={8} fill="#2b2522" />
      <text x={220} y={64} textAnchor="middle" fill="#7fc49a" fontSize={22} fontWeight={700} letterSpacing={2}>
        40°
      </text>
      {/* la puerta, y dentro el tambor con la cartilla dando vueltas */}
      <circle cx={300} cy={300} r={150} fill="#cfc6bb" />
      <circle cx={300} cy={300} r={124} fill="#2f4858" />
      <clipPath id="tambor">
        <circle cx={300} cy={300} r={124} />
      </clipPath>
      <g clipPath="url(#tambor)">
        <path d={`M 170 ${318 + Math.sin(frame / 6) * 10} Q 300 ${290 + Math.cos(frame / 5) * 14} 430 ${318 - Math.sin(frame / 6) * 10} L 430 430 L 170 430 Z`} fill="#7fb2c9" fillOpacity={0.8} />
        <g transform={`rotate(${giro} 300 300)`}>
          <Cartillita x={300} y={232} giro={20} ancho={150} arrugada />
          <rect x={236} y={330} width={130} height={46} rx={20} fill="#3f6e8c" transform="rotate(-30 300 350)" />
        </g>
        {Array.from({ length: 10 }, (_, i) => {
          const t = ((frame * 2 + random(`b${i}`) * 200) % 200) / 200;
          return <circle key={i} cx={200 + random(`x${i}`) * 200} cy={400 - t * 220} r={5 + random(`r${i}`) * 8} fill="#fff" fillOpacity={0.5 * (1 - t)} />;
        })}
        <path d="M 210 200 Q 250 175 300 178" fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={10} strokeLinecap="round" />
      </g>
    </svg>
  );
};

// El ojo que se cierra: «lo que no se ve, no se usa». `cierre` 0 = abierto, 1 = cerrado.
export const Ojo: React.FC<{ tam?: number; cierre?: number; color?: string }> = ({ tam = 260, cierre = 0, color = P.espresso }) => {
  const abre = 1 - cierre;
  return (
    <svg width={tam} height={tam * 0.6} viewBox="0 0 200 120" style={{ display: "block", overflow: "visible" }}>
      <path d={`M 10 60 Q 100 ${60 - 56 * abre} 190 60 Q 100 ${60 + 56 * abre} 10 60 Z`} fill="#fff" stroke={color} strokeWidth={8} strokeLinejoin="round" />
      {abre > 0.15 && <circle cx={100} cy={60} r={26 * Math.min(1, abre * 1.3)} fill={color} />}
      {abre > 0.15 && <circle cx={110} cy={50} r={7 * abre} fill="#fff" />}
      {cierre > 0.85 &&
        [-50, -20, 20, 50].map((dx) => <line key={dx} x1={100 + dx} y1={64} x2={100 + dx * 1.2} y2={84} stroke={color} strokeWidth={7} strokeLinecap="round" />)}
    </svg>
  );
};

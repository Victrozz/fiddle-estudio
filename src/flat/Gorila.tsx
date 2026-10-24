import React from "react";

// ============================================================================
// UN GORILA
// ----------------------------------------------------------------------------
// Sentado, de frente, de dibujo animado tranquilo (sin dientes ni cara de susto).
// `parpadeo` 0..1 cierra los ojos; `mira` (-1..1) mueve las pupilas a los lados.
// El dibujo mide 200 x 210 a `tam` 200.
// ============================================================================

const PELO = "#3b3532";
const PELO_CLARO = "#4d4642";
const PECHO = "#5e5651";
const CARA = "#857870";
const CARA_OSCURA = "#6f635c";

type Props = { tam?: number; parpadeo?: number; mira?: number; style?: React.CSSProperties };

export const Gorila: React.FC<Props> = ({ tam = 200, parpadeo = 0, mira = 0, style }) => {
  const ojo = Math.max(0.12, 1 - parpadeo);
  return (
    <svg width={tam} height={(tam * 210) / 200} viewBox="0 0 200 210" style={{ display: "block", overflow: "visible", ...style }}>
      {/* brazos largos hasta el suelo */}
      <ellipse cx={34} cy={142} rx={24} ry={58} fill={PELO} transform="rotate(10 34 142)" />
      <ellipse cx={166} cy={142} rx={24} ry={58} fill={PELO} transform="rotate(-10 166 142)" />
      <ellipse cx={30} cy={196} rx={22} ry={12} fill={CARA_OSCURA} />
      <ellipse cx={170} cy={196} rx={22} ry={12} fill={CARA_OSCURA} />
      {/* cuerpo y pecho */}
      <path d="M 52 96 Q 100 70 148 96 Q 168 150 150 200 L 50 200 Q 32 150 52 96 Z" fill={PELO_CLARO} />
      <ellipse cx={100} cy={150} rx={40} ry={38} fill={PECHO} />
      <ellipse cx={74} cy={202} rx={26} ry={10} fill={PELO} />
      <ellipse cx={126} cy={202} rx={26} ry={10} fill={PELO} />
      {/* cabeza con su cresta */}
      <ellipse cx={100} cy={64} rx={48} ry={46} fill={PELO} />
      <ellipse cx={100} cy={26} rx={26} ry={16} fill={PELO} />
      <circle cx={53} cy={70} r={11} fill={CARA_OSCURA} />
      <circle cx={147} cy={70} r={11} fill={CARA_OSCURA} />
      {/* la cara */}
      <path d="M 66 62 Q 100 44 134 62 Q 140 92 120 104 Q 100 112 80 104 Q 60 92 66 62 Z" fill={CARA} />
      <path d="M 64 60 Q 100 40 136 60 Q 128 66 100 62 Q 72 66 64 60 Z" fill={PELO} />
      <ellipse cx={100} cy={90} rx={24} ry={14} fill={CARA_OSCURA} />
      <ellipse cx={93} cy={87} rx={4} ry={3} fill={PELO} />
      <ellipse cx={107} cy={87} rx={4} ry={3} fill={PELO} />
      <path d="M 90 99 Q 100 104 110 99" fill="none" stroke={PELO} strokeWidth={3} strokeLinecap="round" />
      {[84, 116].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={70} rx={6.5} ry={6.5 * ojo} fill="#1b1714" />
          {ojo > 0.5 && <circle cx={x + 1.8 + mira * 2} cy={68} r={1.8} fill="#fff" />}
        </g>
      ))}
    </svg>
  );
};

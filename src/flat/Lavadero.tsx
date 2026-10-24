import React from "react";
import { random, useCurrentFrame } from "remotion";
import { P } from "../marca";

// ============================================================================
// EL LAVADERO DE COCHES
// ----------------------------------------------------------------------------
// De perfil: el arco con sus rodillos girando, espuma que sube y un coche que
// pasa por debajo. `cocheX` es el centro del coche en el dibujo (de 0 a 900; el
// arco está en medio, en 450): se anima desde fuera. Mide 900 x 440 a `ancho` 900.
// ============================================================================

type Props = { ancho?: number; cocheX?: number; color?: string; espuma?: number };

const ESTRUCTURA = P.espresso;
const RODILLO = "#7fb2c9";
const RODILLO_CLARO = "#a9d0e0";

export const Lavadero: React.FC<Props> = ({ ancho = 900, cocheX = 450, color = "#c4573a", espuma = 1 }) => {
  const frame = useCurrentFrame();
  const suelo = 380;
  return (
    <svg width={ancho} height={(ancho * 440) / 900} viewBox="0 0 900 440" style={{ display: "block", overflow: "visible" }}>
      {/* el suelo */}
      <rect x={-200} y={suelo} width={1300} height={14} rx={7} fill={P.vison} fillOpacity={0.25} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={((i * 180 - frame * 0) % 1100) - 100} y={suelo + 30} width={90} height={8} rx={4} fill={P.vison} fillOpacity={0.15} />
      ))}

      {/* el arco: dos pilares y la viga con el cartel */}
      <rect x={250} y={110} width={34} height={suelo - 110} rx={8} fill={ESTRUCTURA} />
      <rect x={616} y={110} width={34} height={suelo - 110} rx={8} fill={ESTRUCTURA} />
      <rect x={230} y={74} width={440} height={56} rx={14} fill={ESTRUCTURA} />
      <rect x={350} y={30} width={200} height={50} rx={10} fill={P.camel} />
      <text x={450} y={65} textAnchor="middle" fill={P.espresso} fontSize={30} fontWeight={800} letterSpacing={3}>
        LAVADO
      </text>

      {/* el coche, por detrás de los rodillos de delante */}
      <Coche x={cocheX} suelo={suelo} color={color} frame={frame} />

      {/* rodillos: rayas que bajan = giran */}
      {[300, 600].map((x, k) => (
        <g key={x}>
          <clipPath id={`rodillo-${k}`}>
            <rect x={x - 26} y={140} width={52} height={suelo - 150} rx={22} />
          </clipPath>
          <rect x={x - 26} y={140} width={52} height={suelo - 150} rx={22} fill={RODILLO} />
          <g clipPath={`url(#rodillo-${k})`}>
            {Array.from({ length: 14 }, (_, i) => (
              <rect key={i} x={x - 26} y={130 + ((i * 22 + frame * 7 * (k ? -1 : 1)) % 308 + 308) % 308} width={52} height={8} fill={RODILLO_CLARO} />
            ))}
          </g>
        </g>
      ))}

      {/* espuma que sube */}
      {Array.from({ length: 22 }, (_, i) => {
        const vuelta = 70 + random(`v${i}`) * 50;
        const t = ((frame + random(`t${i}`) * vuelta) % vuelta) / vuelta;
        const x = 290 + random(`x${i}`) * 320 + Math.sin((frame + i * 9) / 9) * 8;
        const y = suelo - 20 - t * 260;
        const r = (6 + random(`r${i}`) * 12) * espuma;
        return <circle key={i} cx={x} cy={y} r={r} fill="#ffffff" fillOpacity={0.7 * (1 - t)} stroke={RODILLO} strokeOpacity={0.6 * (1 - t)} strokeWidth={2} />;
      })}
    </svg>
  );
};

const Coche: React.FC<{ x: number; suelo: number; color: string; frame: number }> = ({ x, suelo, color, frame }) => {
  const giro = -(x * 1.4) % 360;
  return (
    <g transform={`translate(${x} 0)`}>
      {/* carrocería y cabina */}
      <path d={`M -175 ${suelo - 40} Q -178 ${suelo - 96} -130 ${suelo - 100} L -84 ${suelo - 104} L -48 ${suelo - 156} Q -40 ${suelo - 164} -26 ${suelo - 164} L 62 ${suelo - 164} Q 78 ${suelo - 164} 88 ${suelo - 152} L 124 ${suelo - 104} L 158 ${suelo - 98} Q 182 ${suelo - 92} 182 ${suelo - 62} L 182 ${suelo - 40} Z`} fill={color} />
      <path d={`M -36 ${suelo - 150} L 8 ${suelo - 150} L 8 ${suelo - 108} L -70 ${suelo - 108} Z`} fill="#dfe9ec" />
      <path d={`M 20 ${suelo - 150} L 64 ${suelo - 150} Q 72 ${suelo - 150} 78 ${suelo - 142} L 104 ${suelo - 108} L 20 ${suelo - 108} Z`} fill="#dfe9ec" />
      <rect x={-160} y={suelo - 82} width={18} height={10} rx={4} fill="#f4d58d" />
      <rect x={160} y={suelo - 80} width={16} height={10} rx={4} fill="#e8a99a" />
      <rect x={-20} y={suelo - 92} width={26} height={6} rx={3} fill="#000" fillOpacity={0.2} />
      {/* ruedas */}
      {[-110, 116].map((rx) => (
        <g key={rx} transform={`translate(${rx} ${suelo - 34}) rotate(${giro + frame * 0})`}>
          <circle r={36} fill="#2b2522" />
          <circle r={17} fill="#c9c2bb" />
          <rect x={-3} y={-17} width={6} height={34} fill="#8a817a" />
        </g>
      ))}
    </g>
  );
};

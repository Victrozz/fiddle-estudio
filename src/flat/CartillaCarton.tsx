import React, { useId } from "react";
import { random, useCurrentFrame } from "remotion";
import { tramo } from "../comun/movimiento";

// ============================================================================
// LA CARTILLA DE CARTÓN
// ----------------------------------------------------------------------------
// La de toda la vida: cartón kraft, casillas impresas y el sello de goma en tinta,
// cada uno un poco torcido. Es «lo de antes» en las comparaciones, así que tiene
// que parecer de verdad, no un dibujo cutre: el contraste lo pone la historia.
//
// `ultimoEn`: el fotograma en que cae el último sello (rebota y la cartilla
// tiembla). `gastada`: con el aro de café, el doblez y la esquina doblada.
// ============================================================================

type Props = {
  total?: number;
  marcados: number;
  ancho?: number;
  nombre?: string;
  ultimoEn?: number;
  gastada?: boolean;
  /** Para que dos cartillas no tengan los sellos igual de torcidos. */
  semilla?: string;
  style?: React.CSSProperties;
};

export const KRAFT = "#cda77b";
export const TINTA_SELLO = "#a3352d";
const TINTA_IMPRESA = "#4b3121";

export const CartillaCarton: React.FC<Props> = ({ total = 10, marcados, ancho = 820, nombre = "Tu cafetería", ultimoEn, gastada = false, semilla = "cartilla", style }) => {
  const frame = useCurrentFrame();
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const alto = ancho * 0.63;
  const porFila = Math.ceil(total / 2);
  const d = (ancho * 0.8) / porFila;
  const r = d * 0.36;
  const golpe = ultimoEn !== undefined && frame >= ultimoEn && frame < ultimoEn + 6;
  const tiembla = golpe ? (random(`${semilla}-t-${frame}`) - 0.5) * ancho * 0.01 : 0;

  return (
    <div style={{ width: ancho, height: alto, transform: `translate(${tiembla}px, ${Math.abs(tiembla) * 0.6}px)`, filter: gastada ? "saturate(0.8) brightness(0.96)" : undefined, ...style }}>
      <svg width={ancho} height={alto} viewBox={`0 0 ${ancho} ${alto}`} style={{ display: "block", overflow: "visible" }}>
        <defs>
          <filter id={`fibra-${id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.6" numOctaves={3} seed={4} />
            <feColorMatrix type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0 0.1  0 0 0 0.22 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={`tinta-${id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves={2} seed={9} result="r" />
            <feDisplacementMap in="SourceGraphic" in2="r" scale={ancho * 0.004} xChannelSelector="R" yChannelSelector="G" result="d" />
            <feTurbulence type="fractalNoise" baseFrequency="0.18" numOctaves={1} seed={2} result="huecos" />
            {/* Poca tinta en algún sitio, no un moteado: casi todo sale lleno. */}
            <feColorMatrix in="huecos" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3 2.6" result="mascara" />
            <feComposite in="d" in2="mascara" operator="in" />
          </filter>
          <clipPath id={`borde-${id}`}>
            <rect width={ancho} height={alto} rx={ancho * 0.04} />
          </clipPath>
        </defs>

        <g clipPath={`url(#borde-${id})`}>
          <rect width={ancho} height={alto} fill={KRAFT} />
          <rect width={ancho} height={alto} fill={KRAFT} filter={`url(#fibra-${id})`} />
          <rect x={ancho * 0.03} y={ancho * 0.03} width={ancho * 0.94} height={alto - ancho * 0.06} rx={ancho * 0.025} fill="none" stroke={TINTA_IMPRESA} strokeOpacity={0.55} strokeWidth={ancho * 0.003} strokeDasharray={`${ancho * 0.012} ${ancho * 0.008}`} />

          <text x={ancho * 0.08} y={alto * 0.2} fill={TINTA_IMPRESA} fontSize={ancho * 0.058} fontWeight={800} letterSpacing={ancho * 0.004}>
            {nombre.toUpperCase()}
          </text>
          <text x={ancho * 0.08} y={alto * 0.29} fill={TINTA_IMPRESA} fillOpacity={0.75} fontSize={ancho * 0.033} fontWeight={500}>
            {`Al ${total}.º, invitamos nosotros`}
          </text>
          <Taza x={ancho * 0.85} y={alto * 0.17} tam={ancho * 0.07} />

          {Array.from({ length: total }, (_, i) => {
            const fila = Math.floor(i / porFila);
            const col = i % porFila;
            const cx = ancho * 0.1 + d * (col + 0.5);
            const cy = alto * (fila === 0 ? 0.52 : 0.78);
            const ultima = i === total - 1;
            const sellado = i < marcados;
            const cae = sellado && i === marcados - 1 && ultimoEn !== undefined;
            const t = cae ? tramo(frame, ultimoEn!, 4) : 1;
            if (cae && frame < ultimoEn!) return <Casilla key={i} cx={cx} cy={cy} r={r} ultima={ultima} ancho={ancho} />;
            const giro = (random(`${semilla}-g-${i}`) - 0.5) * 50;
            const dx = (random(`${semilla}-x-${i}`) - 0.5) * r * 0.35;
            const dy = (random(`${semilla}-y-${i}`) - 0.5) * r * 0.35;
            return (
              <g key={i}>
                <Casilla cx={cx} cy={cy} r={r} ultima={ultima} ancho={ancho} />
                {sellado && (
                  <g transform={`translate(${cx + dx} ${cy + dy}) rotate(${giro}) scale(${1.25 - 0.25 * t})`} opacity={0.85 * Math.min(1, t * 3)} filter={`url(#tinta-${id})`}>
                    <MarcaSello r={r * 1.08} />
                  </g>
                )}
              </g>
            );
          })}

          {gastada && (
            <g>
              <circle cx={ancho * 0.7} cy={alto * 0.42} r={ancho * 0.13} fill="none" stroke="#6b4423" strokeOpacity={0.28} strokeWidth={ancho * 0.012} />
              <circle cx={ancho * 0.7} cy={alto * 0.42} r={ancho * 0.12} fill="#6b4423" fillOpacity={0.07} />
              <line x1={ancho * 0.38} y1={0} x2={ancho * 0.44} y2={alto} stroke="#fff" strokeOpacity={0.35} strokeWidth={ancho * 0.004} />
              <line x1={ancho * 0.385} y1={0} x2={ancho * 0.445} y2={alto} stroke="#3a2414" strokeOpacity={0.25} strokeWidth={ancho * 0.003} />
              <path d={`M${ancho} ${alto - ancho * 0.12} L${ancho - ancho * 0.12} ${alto} L${ancho} ${alto} Z`} fill="#000" fillOpacity={0.18} />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

const Casilla: React.FC<{ cx: number; cy: number; r: number; ultima: boolean; ancho: number }> = ({ cx, cy, r, ultima, ancho }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill={ultima ? "#e3c79f" : "none"} stroke={TINTA_IMPRESA} strokeOpacity={0.6} strokeWidth={ancho * 0.0035} />
    {ultima && (
      <text x={cx} y={cy + r * 0.13} textAnchor="middle" fill={TINTA_IMPRESA} fontSize={r * 0.42} fontWeight={800}>
        GRATIS
      </text>
    )}
  </g>
);

/** La huella del sello de goma: un aro y una taza, en tinta. */
const MarcaSello: React.FC<{ r: number }> = ({ r }) => (
  <g fill="none" stroke={TINTA_SELLO} strokeWidth={r * 0.13} strokeLinecap="round" strokeLinejoin="round">
    <circle r={r * 0.9} />
    <path d={`M${-r * 0.4} ${-r * 0.22} h${r * 0.66} v${r * 0.26} a${r * 0.33} ${r * 0.33} 0 0 1 ${-r * 0.66} 0 z`} fill={TINTA_SELLO} />
    <path d={`M${r * 0.27} ${-r * 0.12} a${r * 0.16} ${r * 0.16} 0 0 1 0 ${r * 0.3}`} />
    <path d={`M${-r * 0.46} ${r * 0.44} h${r * 0.8}`} />
  </g>
);

/** La taza impresa de la esquina. */
const Taza: React.FC<{ x: number; y: number; tam: number }> = ({ x, y, tam }) => (
  <g transform={`translate(${x} ${y})`} fill="none" stroke={TINTA_IMPRESA} strokeOpacity={0.8} strokeWidth={tam * 0.08} strokeLinecap="round" strokeLinejoin="round">
    <path d={`M${-tam * 0.45} ${-tam * 0.1} h${tam * 0.75} v${tam * 0.3} a${tam * 0.37} ${tam * 0.37} 0 0 1 ${-tam * 0.75} 0 z`} />
    <path d={`M${tam * 0.3} 0 a${tam * 0.17} ${tam * 0.17} 0 0 1 0 ${tam * 0.32}`} />
    <path d={`M${-tam * 0.2} ${-tam * 0.3} q${tam * 0.08} ${-tam * 0.12} 0 ${-tam * 0.25} M${tam * 0.05} ${-tam * 0.3} q${tam * 0.08} ${-tam * 0.12} 0 ${-tam * 0.25}`} />
  </g>
);

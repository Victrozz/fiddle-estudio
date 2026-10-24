import React from "react";
import { Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { entrada } from "../comun/movimiento";

// ============================================================================
// LOS SELLOS DE LAS TIENDAS DE ANTES (los «trading stamps»)
// ----------------------------------------------------------------------------
// Sellos verdes con el borde dentado, que te daban al pagar y se pegaban en una
// libreta. Un dibujo genérico: no es el logo de ninguna marca.
// - <SelloVerde>: uno, con su estrella y su valor.
// - <Libreta>: una página que se llena de sellos (`pegados` cuenta solo).
// - <LluviaSellos>: muchos cayendo y amontonándose.
// ============================================================================

export const VERDE_SELLO = "#3f8d58";
const VERDE_OSCURO = "#2c6a40";
const PAPEL_SELLO = "#eef3e6";

type SelloProps = { tam?: number; valor?: string; color?: string; style?: React.CSSProperties };

/** Un sello con el borde dentado (agujeros de troquel en los cuatro lados). */
export const SelloVerde: React.FC<SelloProps> = ({ tam = 120, valor = "10", color = VERDE_SELLO, style }) => {
  const dientes = 7;
  const r = 100 / dientes / 3.2;
  const agujeros: { x: number; y: number }[] = [];
  for (let i = 0; i <= dientes; i++) {
    const t = 4 + (i * 92) / dientes;
    agujeros.push({ x: t, y: 0 }, { x: t, y: 120 }, { x: 0, y: (t * 120) / 100 }, { x: 100, y: (t * 120) / 100 });
  }
  return (
    <svg width={tam} height={tam * 1.2} viewBox="0 0 100 120" style={{ display: "block", overflow: "visible", ...style }}>
      <rect x={0} y={0} width={100} height={120} fill={PAPEL_SELLO} />
      <rect x={8} y={8} width={84} height={104} rx={3} fill={color} />
      <rect x={14} y={14} width={72} height={92} rx={2} fill="none" stroke={PAPEL_SELLO} strokeWidth={2.5} />
      <path d="M 50 30 L 56.5 44 L 72 45.5 L 60.5 56 L 64 71 L 50 63 L 36 71 L 39.5 56 L 28 45.5 L 43.5 44 Z" fill={PAPEL_SELLO} />
      <text x={50} y={98} textAnchor="middle" fill={PAPEL_SELLO} fontSize={20} fontWeight={800}>
        {valor}
      </text>
      {/* el troquel: medias lunas del color de lo de detrás (--detras-sello), comidas del borde */}
      {agujeros.map((a, i) => (
        <circle key={`t${i}`} cx={a.x} cy={a.y} r={r} fill="var(--detras-sello, #f6efe4)" />
      ))}
    </svg>
  );
};

type LibretaProps = { ancho?: number; columnas?: number; filas?: number; desde: number; hasta: number; semilla?: string; titulo?: string };

/** Una página de la libreta: los sellos se pegan uno detrás de otro entre `desde` y `hasta`. */
export const Libreta: React.FC<LibretaProps> = ({ ancho = 620, columnas = 5, filas = 6, desde, hasta, semilla = "libreta", titulo = "LIBRETA DE SELLOS · PÁGINA 1" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = columnas * filas;
  const celda = (ancho - 60) / columnas;
  const alto = celda * 1.2 * filas + 110;
  return (
    <div style={{ width: ancho, height: alto, background: "#f4ecd9", borderRadius: 14, boxShadow: "0 18px 40px rgba(31,24,18,.22), inset 0 0 0 3px rgba(96,84,75,.18)", position: "relative", ["--detras-sello" as string]: "#f4ecd9" }}>
      <div style={{ position: "absolute", left: 30, top: 26, fontSize: 26, fontWeight: 800, letterSpacing: "0.12em", color: "#5c6b4e" }}>{titulo}</div>
      {Array.from({ length: total }, (_, i) => {
        const x = 30 + (i % columnas) * celda;
        const y = 80 + Math.floor(i / columnas) * celda * 1.2;
        const cuando = desde + ((hasta - desde) * i) / total;
        const e = frame >= cuando ? entrada(frame, fps, cuando) : 0;
        return (
          <div key={i} style={{ position: "absolute", left: x + 4, top: y + 4, width: celda - 8, height: celda * 1.2 - 8, border: "2px dashed rgba(92,107,78,.35)", borderRadius: 4 }}>
            {e > 0 && (
              <div style={{ transform: `scale(${1.4 - 0.4 * e}) rotate(${(random(`${semilla}${i}`) - 0.5) * 8}deg)`, opacity: Math.min(1, e * 2), margin: -2 }}>
                <SelloVerde tam={celda - 6} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

type LluviaProps = { desde: number; cantidad?: number; ancho?: number; alto?: number; dur?: number; semilla?: string };

/** Sellos que caen girando y se quedan amontonados abajo. */
export const LluviaSellos: React.FC<LluviaProps> = ({ desde, cantidad = 60, ancho = 1080, alto = 1200, dur = 90, semilla = "lluvia" }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: ancho, height: alto, pointerEvents: "none" }}>
      {Array.from({ length: cantidad }, (_, i) => {
        const sale = desde + random(`${semilla}-s${i}`) * dur;
        if (frame < sale) return null;
        const cae = 22 + random(`${semilla}-c${i}`) * 14;
        const x = random(`${semilla}-x${i}`) * (ancho - 100);
        // Los que caen después se quedan un poco más arriba: es un montón.
        const suelo = alto - 120 - (i / cantidad) * 140 - random(`${semilla}-y${i}`) * 60;
        const y = interpolate(frame, [sale, sale + cae], [-160, suelo], { extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
        const giro = random(`${semilla}-g${i}`) * 360 + Math.min(frame - sale, cae) * (random(`${semilla}-v${i}`) - 0.5) * 18;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `rotate(${giro}deg)` }}>
            <SelloVerde tam={70 + random(`${semilla}-t${i}`) * 30} valor={random(`${semilla}-n${i}`) < 0.7 ? "10" : "1"} />
          </div>
        );
      })}
    </div>
  );
};

import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { TINTA_SELLO } from "./CartillaCarton";

// ============================================================================
// EL SELLO DE GOMA
// ----------------------------------------------------------------------------
// El tampón de madera visto de lado: baja rápido, golpea en `en`, se aplasta un
// instante y sube. `x`, `y` son el punto donde toca (centro de la goma), en el
// sistema del contenedor (position: relative). Va con el sonido «golpe» en `en`.
// ============================================================================

type Props = { x: number; y: number; en: number; ancho?: number };

const MADERA = "#9a6b43";
const MADERA_OSCURA = "#6e4a2c";

export const SelloGoma: React.FC<Props> = ({ x, y, en, ancho = 170 }) => {
  const frame = useCurrentFrame();
  if (frame < en - 14 || frame > en + 16) return null;
  const alto = ancho * 1.25;
  const fijo = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const baja = interpolate(frame, [en - 14, en], [-alto * 0.9, 0], { ...fijo, easing: Easing.in(Easing.quad) });
  const sube = interpolate(frame, [en + 3, en + 16], [0, -alto * 1.1], { ...fijo, easing: Easing.inOut(Easing.cubic) });
  const aplasta = frame >= en && frame < en + 3 ? 0.93 : 1;
  const visible = interpolate(frame, [en - 14, en - 10, en + 10, en + 16], [0, 1, 1, 0], fijo);
  return (
    <div style={{ position: "absolute", left: x - ancho / 2, top: y - alto, width: ancho, height: alto, transform: `translateY(${frame < en ? baja : sube}px) scaleY(${aplasta})`, transformOrigin: "bottom center", opacity: visible }}>
      <svg width={ancho} height={alto} viewBox="0 0 100 125" style={{ display: "block", overflow: "visible" }}>
        <ellipse cx="50" cy="18" rx="17" ry="15" fill={MADERA} />
        <ellipse cx="45" cy="13" rx="6" ry="4" fill="#fff" fillOpacity={0.25} />
        <rect x="42" y="28" width="16" height="30" rx="4" fill={MADERA_OSCURA} />
        <rect x="10" y="56" width="80" height="42" rx="7" fill={MADERA} />
        <rect x="10" y="56" width="80" height="9" rx="4" fill="#fff" fillOpacity={0.15} />
        <rect x="14" y="98" width="72" height="14" rx="3" fill="#3b2a20" />
        <rect x="16" y="112" width="68" height="9" rx="2" fill={TINTA_SELLO} />
      </svg>
    </div>
  );
};

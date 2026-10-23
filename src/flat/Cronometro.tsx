import React from "react";
import { useCurrentFrame } from "remotion";
import { tramo } from "../comun/movimiento";
import { P } from "../marca";

// ============================================================================
// EL CRONÓMETRO
// ----------------------------------------------------------------------------
// Un aro que se llena y los segundos en el centro («2,8 s»), para «es igual de
// rápido». Los segundos que se ENSEÑAN son `segundos`, aunque el vídeo los cuente
// en otro tiempo (`duracion`): nunca más rápido que lo que se mide de verdad.
// ============================================================================

type Props = { segundos: number; desde?: number; duracion?: number; tam?: number; color?: string; etiqueta?: string };

export const Cronometro: React.FC<Props> = ({ segundos, desde = 0, duracion = 60, tam = 360, color = P.verde, etiqueta }) => {
  const frame = useCurrentFrame();
  const t = tramo(frame, desde, duracion, (x) => x);
  const r = 44;
  const vuelta = 2 * Math.PI * r;
  const texto = new Intl.NumberFormat("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(segundos * t);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: tam * 0.08 }}>
      <div style={{ position: "relative", width: tam, height: tam }}>
        <svg viewBox="0 0 100 100" width={tam} height={tam} style={{ transform: "rotate(-90deg)" }}>
          <circle cx="50" cy="50" r={r} fill="none" stroke={P.avena} strokeWidth="7" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray={vuelta} strokeDashoffset={vuelta * (1 - t)} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: tam * 0.25, fontWeight: 750, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em" }}>
          {texto} s
        </div>
      </div>
      {etiqueta && <div style={{ fontSize: tam * 0.13, fontWeight: 600, color: P.vison }}>{etiqueta}</div>}
    </div>
  );
};

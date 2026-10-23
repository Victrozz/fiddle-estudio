import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import LogoFiddle from "@fiddle/app/LogoFiddle";
import { TELEFONO_VISIBLE } from "@fiddle/app/home/datos";
import { entrada } from "./movimiento";
import { FONDOS, P, suaveDe, tintaDe, type Fondo } from "../marca";

// ============================================================================
// EL CIERRE: la marca y a quién escribir
// ----------------------------------------------------------------------------
// Los últimos 2-3 s de cada vídeo. El logo es el de la web de fiddle (LogoFiddle):
// cuando allí cambie (el lacre), cambia aquí solo. El teléfono sale de
// src/app/home/datos.js, que es donde vive y en ningún otro sitio.
// ============================================================================

type Props = {
  desde?: number;
  fondo?: Fondo;
  /** La frase bajo la marca. */
  lema?: string;
  /** Lo que se le pide a quien lo ve. */
  llamada?: string;
};

export const Cierre: React.FC<Props> = ({
  desde = 0,
  fondo = "verde",
  lema = "Tarjetas de fidelización en el móvil",
  llamada = `Pruébalo en tu tienda · ${TELEFONO_VISIBLE}`,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = entrada(frame, fps, desde);
  const resto = entrada(frame, fps, desde + 8, true);
  const tinta = tintaDe(fondo);
  return (
    <AbsoluteFill style={{ background: FONDOS[fondo], color: tinta, alignItems: "center", justifyContent: "center", gap: 36, opacity: frame < desde ? 0 : 1 }}>
      <div style={{ transform: `scale(${0.8 + 0.2 * logo})`, opacity: Math.min(1, logo * 1.5) }}>
        <LogoFiddle tam={170} color={fondo === "verde" ? P.avena : tinta} id="efe-cierre" />
      </div>
      <div style={{ opacity: resto, transform: `translateY(${(1 - resto) * 30}px)`, textAlign: "center", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontSize: 52, fontWeight: 600, letterSpacing: "-0.02em" }}>{lema}</div>
        <div style={{ fontSize: 40, color: suaveDe(fondo) }}>{llamada}</div>
      </div>
    </AbsoluteFill>
  );
};

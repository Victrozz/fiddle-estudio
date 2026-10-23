import React from "react";
import { P } from "../marca";

// ============================================================================
// UN MÓVIL
// ----------------------------------------------------------------------------
// Un teléfono genérico (no un iPhone calcado: ni la isla ni sus botones). Lo de
// dentro se maqueta en PUNTOS, el ancho de un móvil de verdad (390), y se amplía
// con `zoom`: así la caja y la tarjeta de fiddle se ven a su tamaño de siempre.
// ============================================================================

export const PUNTOS = { ancho: 390, alto: 844 };

type Props = {
  /** Ancho del móvil en el vídeo, en px. */
  ancho?: number;
  /** Lo que se ve detrás del contenido de la pantalla. */
  pantalla?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export const Movil: React.FC<Props> = ({ ancho = 560, pantalla = P.papel, style, children }) => {
  const bisel = ancho * 0.032;
  const radio = ancho * 0.15;
  const anchoPantalla = ancho - bisel * 2;
  const escala = anchoPantalla / PUNTOS.ancho;
  const altoPantalla = PUNTOS.alto * escala;
  return (
    <div
      style={{
        position: "relative",
        width: ancho,
        height: altoPantalla + bisel * 2,
        padding: bisel,
        borderRadius: radio,
        background: "#16120f",
        boxShadow: `0 ${ancho * 0.08}px ${ancho * 0.16}px -${ancho * 0.05}px rgba(31,24,18,.55), inset 0 0 0 ${ancho * 0.006}px rgba(255,255,255,.14)`,
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div style={{ position: "relative", width: anchoPantalla, height: altoPantalla, borderRadius: radio - bisel, overflow: "hidden", background: pantalla }}>
        <div style={{ position: "relative", width: PUNTOS.ancho, height: PUNTOS.alto, zoom: escala }}>{children}</div>
        {/* la cámara: un punto, como cualquier móvil */}
        <div style={{ position: "absolute", top: 12 * escala, left: "50%", width: 11 * escala, height: 11 * escala, marginLeft: -5.5 * escala, borderRadius: "50%", background: "#0b0908" }} />
      </div>
    </div>
  );
};

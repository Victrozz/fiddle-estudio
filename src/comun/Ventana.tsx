import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { tramo } from "./movimiento";
import { Efecto } from "./Efecto";
import { ANCHO, SEGURA } from "../formato";
import { LIMITE_ESCENA } from "./Locucion";

// ============================================================================
// VENTANAS: una escena que se ve entre dos fotogramas
// ----------------------------------------------------------------------------
// En los vídeos con voz todo se coloca con fotogramas ABSOLUTOS (los del horario:
// `h.en("giro")`), así que las escenas no van dentro de un <Sequence> (que
// cambiaría la cuenta): van en una <Ventana desde hasta>.
// <ZonaEscena> es el hueco que se lee: entre lo que tapan las apps arriba y los
// subtítulos abajo.
//
// Lo que hace que una escena no parezca una diapositiva:
// - `paso`: cómo entra y sale. «funde» (el de siempre), «barrido» (entra de lado y
//   se va por el otro, con `zas`) o «zoom» (llega de cerca).
// - `deriva`: la cámara se acerca despacio mientras dura (0,04 = un 4 %). Nada se
//   queda quieto aunque no pase nada.
// ============================================================================

export type Paso = "funde" | "barrido" | "zoom";

type Props = {
  desde: number;
  hasta: number;
  entra?: number;
  sale?: number;
  paso?: Paso;
  deriva?: number;
  /** El «zas» al entrar (de partida, solo en los barridos). */
  zas?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const fuera = Easing.in(Easing.cubic);
const dentro = Easing.out(Easing.cubic);

export const Ventana: React.FC<Props> = ({ desde, hasta, entra = 8, sale = 8, paso = "funde", deriva = 0, zas, children, style }) => {
  const frame = useCurrentFrame();
  if (frame < desde || frame >= hasta) return null;
  const funde = paso === "funde";
  const a = entra ? tramo(frame, desde, entra, funde ? undefined : dentro) : 1;
  const b = sale ? tramo(frame, hasta - sale, sale, funde ? undefined : fuera) : 0;
  let opacidad = Math.min(a, 1 - b);
  let transform: string | undefined;
  if (paso === "barrido") {
    opacidad = Math.min(1, a * 2.5, (1 - b) * 2.5);
    transform = `translateX(${(1 - a) * ANCHO * 0.45 - b * ANCHO * 0.35}px) skewX(${-(1 - a) * 5 - b * 5}deg)`;
  } else if (paso === "zoom") {
    transform = `scale(${1 + (1 - a) * 0.14 - b * 0.06})`;
  }
  const cerca = deriva ? 1 + deriva * tramo(frame, desde, hasta - desde, Easing.linear) : 1;
  return (
    <AbsoluteFill style={{ opacity: opacidad, transform, ...style }}>
      <AbsoluteFill style={{ transform: cerca === 1 ? undefined : `scale(${cerca})`, transformOrigin: "50% 38%" }}>{children}</AbsoluteFill>
      {(zas ?? paso === "barrido") && entra > 0 && <Efecto sonido="zas" en={desde} volumen={0.28} />}
    </AbsoluteFill>
  );
};

export const ZONA_ESCENA = { x: SEGURA.izquierda, y: SEGURA.arriba, ancho: ANCHO - SEGURA.izquierda - SEGURA.derecha, alto: LIMITE_ESCENA - SEGURA.arriba };

export const ZonaEscena: React.FC<{ children: React.ReactNode; gap?: number; alinear?: React.CSSProperties["alignItems"]; style?: React.CSSProperties }> = ({ children, gap = 48, alinear = "center", style }) => (
  <div style={{ position: "absolute", left: ZONA_ESCENA.x, top: ZONA_ESCENA.y, width: ZONA_ESCENA.ancho, height: ZONA_ESCENA.alto, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: alinear, gap, ...style }}>
    {children}
  </div>
);

import React from "react";
import { useCurrentFrame } from "remotion";
import { tramo } from "./movimiento";

// Un dedo que toca: un círculo que aparece, se aprieta y deja una onda. Se pone
// encima de la pantalla del móvil, en PUNTOS (las mismas medidas que la caja).

type Props = { x: number; y: number; en: number; color?: string };

export const Toque: React.FC<Props> = ({ x, y, en, color = "rgba(31,24,18,.35)" }) => {
  const frame = useCurrentFrame();
  if (frame < en - 8 || frame > en + 22) return null;
  const llega = tramo(frame, en - 8, 8);
  const onda = tramo(frame, en, 18);
  const aprieta = frame >= en && frame < en + 5 ? 0.85 : 1;
  return (
    <>
      <div style={{ position: "absolute", left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: "50%", background: color, opacity: llega * (1 - onda), transform: `scale(${aprieta})` }} />
      <div style={{ position: "absolute", left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: "50%", border: `3px solid ${color}`, opacity: 1 - onda, transform: `scale(${1 + onda * 1.6})` }} />
    </>
  );
};

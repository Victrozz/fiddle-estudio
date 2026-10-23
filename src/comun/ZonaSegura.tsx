import React from "react";
import { AbsoluteFill } from "remotion";
import { ANCHO, ALTO, SEGURA } from "../formato";

// Lo que tapan las apps, en rojo. Solo para revisar en el Studio (`guia`).
const tapado: React.CSSProperties = { position: "absolute", background: "rgba(220, 40, 40, 0.28)" };
const rotulo: React.CSSProperties = { position: "absolute", fontSize: 30, fontWeight: 700, color: "rgba(140, 0, 0, 0.8)" };

export const ZonaSegura: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ ...tapado, left: 0, top: 0, width: ANCHO, height: SEGURA.arriba }} />
    <div style={{ ...tapado, left: 0, top: ALTO - SEGURA.abajo, width: ANCHO, height: SEGURA.abajo }} />
    <div style={{ ...tapado, left: 0, top: SEGURA.arriba, width: SEGURA.izquierda, height: ALTO - SEGURA.arriba - SEGURA.abajo }} />
    <div style={{ ...tapado, left: ANCHO - SEGURA.derecha, top: SEGURA.arriba, width: SEGURA.derecha, height: ALTO - SEGURA.arriba - SEGURA.abajo }} />
    <div style={{ ...rotulo, left: 24, top: 24 }}>Pestañas de la app</div>
    <div style={{ ...rotulo, left: 24, top: ALTO - SEGURA.abajo + 24 }}>Texto, música, botones</div>
  </AbsoluteFill>
);

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Icono } from "../comun/Icono";
import { entrada } from "../comun/movimiento";
import { P } from "../marca";

// Una lista de ventajas que entran de una en una, cada una con su icono de la app
// en un círculo. Para «y además…» después de un gancho.

type Item = { texto: string; icono?: string };
type Props = { items: Item[]; desde?: number; cadencia?: number; tam?: number; color?: string; fondoIcono?: string };

export const Lista: React.FC<Props> = ({ items, desde = 0, cadencia = 12, tam = 54, color, fondoIcono = P.verde }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tam * 0.55, color }}>
      {items.map((it, i) => {
        const e = entrada(frame, fps, desde + i * cadencia);
        return (
          <div key={it.texto} style={{ display: "flex", alignItems: "center", gap: tam * 0.45, opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - e) * 40}px)` }}>
            <span style={{ width: tam * 1.4, height: tam * 1.4, borderRadius: "50%", background: fondoIcono, color: P.papel, display: "grid", placeItems: "center", flexShrink: 0, transform: `scale(${e})` }}>
              <Icono nombre={it.icono ?? "check"} tam={tam * 0.8} grosor={2.2} />
            </span>
            <span style={{ fontSize: tam, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.01em" }}>{it.texto}</span>
          </div>
        );
      })}
    </div>
  );
};

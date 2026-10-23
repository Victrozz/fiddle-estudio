import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { entrada, salida, tramo } from "./movimiento";
import { P, TAM } from "../marca";

// ============================================================================
// EL TITULAR
// ----------------------------------------------------------------------------
// La frase grande de un póster: entra palabra a palabra y las de `resaltar` se
// subrayan con un bloque de color que barre por detrás. Es lo que lleva el gancho
// del primer segundo. Corta: si no cabe en tres líneas a TAM.gancho, sobra texto.
// ============================================================================

type Props = {
  texto: string;
  desde?: number;
  hasta?: number;
  tam?: number;
  peso?: number;
  color?: string;
  /** Palabras que se marcan (sin importar mayúsculas ni signos). */
  resaltar?: string[];
  colorResalte?: string;
  tintaResalte?: string;
  alinear?: "left" | "center";
  /** Fotogramas entre palabra y palabra. */
  cadencia?: number;
  style?: React.CSSProperties;
};

const limpia = (p: string) => p.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

export const Titular: React.FC<Props> = ({
  texto,
  desde = 0,
  hasta,
  tam = TAM.gancho,
  peso = 700,
  color,
  resaltar = [],
  colorResalte = P.verde,
  tintaResalte = P.papel,
  alinear = "left",
  cadencia = 3,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const marcadas = new Set(resaltar.map(limpia));
  const palabras = texto.split(/\s+/).filter(Boolean);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: alinear === "center" ? "center" : "flex-start",
        columnGap: tam * 0.26,
        rowGap: tam * 0.08,
        fontSize: tam,
        fontWeight: peso,
        lineHeight: 1.04,
        letterSpacing: "-0.035em",
        color,
        opacity: salida(frame, hasta),
        ...style,
      }}
    >
      {palabras.map((p, i) => {
        const llega = desde + i * cadencia;
        const e = entrada(frame, fps, llega);
        const marcada = marcadas.has(limpia(p));
        return (
          <span
            key={i}
            style={{
              position: "relative",
              display: "inline-block",
              transform: `translateY(${(1 - e) * tam * 0.45}px)`,
              opacity: Math.min(1, e * 1.5),
            }}
          >
            {marcada && (
              <span
                style={{
                  position: "absolute",
                  inset: `${tam * 0.04}px ${-tam * 0.1}px ${-tam * 0.02}px`,
                  background: colorResalte,
                  borderRadius: tam * 0.14,
                  transform: `scaleX(${tramo(frame, llega + 5, 10)})`,
                  transformOrigin: "left center",
                }}
              />
            )}
            <span style={{ position: "relative", color: marcada ? tintaResalte : undefined }}>{p}</span>
          </span>
        );
      })}
    </div>
  );
};

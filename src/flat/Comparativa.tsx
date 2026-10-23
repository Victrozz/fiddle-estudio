import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Icono } from "../comun/Icono";
import { entrada } from "../comun/movimiento";
import { BIEN, MAL, P } from "../marca";

// ============================================================================
// LA COMPARATIVA: una lista de cosas y, al lado, cómo le va a cada uno
// ----------------------------------------------------------------------------
// Pensada para el dueño: cada fila es algo que le importa a la TIENDA («Sabes
// quién deja de venir»), no al cliente. Cada celda es `true` (✓ verde: bueno para
// la tienda), `false` (✗ rojo: malo) o un texto corto («0 €», «Nunca»). Por eso
// las filas se escriben en positivo: «No se pierde», nunca «Se pierde» con un ✓.
// Las filas entran de una en una, cada `cadencia` fotogramas.
// ============================================================================

type Celda = boolean | string;
type Fila = { texto: string; izq: Celda; der: Celda };

type Props = {
  filas: Fila[];
  titulos?: [string, string];
  desde?: number;
  cadencia?: number;
  ancho?: number;
  tam?: number;
  /** Color de la columna de la derecha (la de fiddle). */
  acento?: string;
};

export const Comparativa: React.FC<Props> = ({ filas, titulos = ["Cartón", "fiddle"], desde = 0, cadencia = 14, ancho = 880, tam = 46, acento = P.verde }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const col = tam * 4;
  const cabecera = entrada(frame, fps, desde);
  return (
    <div style={{ width: ancho, fontSize: tam }}>
      <div style={{ display: "flex", justifyContent: "flex-end", opacity: cabecera, marginBottom: tam * 0.4 }}>
        {titulos.map((t, i) => (
          <div key={t} style={{ width: col, textAlign: "center", fontWeight: 750, fontSize: tam * 0.85, color: i === 1 ? acento : P.vison }}>
            {t}
          </div>
        ))}
      </div>
      {filas.map((f, i) => {
        const llega = desde + 8 + i * cadencia;
        const e = entrada(frame, fps, llega);
        return (
          <div
            key={f.texto}
            style={{
              display: "flex",
              alignItems: "center",
              padding: `${tam * 0.42}px 0`,
              borderTop: `2px solid ${P.avena}`,
              opacity: Math.min(1, e * 1.5),
              transform: `translateX(${(1 - e) * -60}px)`,
            }}
          >
            <div style={{ flex: 1, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.01em" }}>{f.texto}</div>
            <Marca valor={f.izq} col={col} tam={tam} e={entrada(frame, fps, llega + 5)} />
            <Marca valor={f.der} col={col} tam={tam} e={entrada(frame, fps, llega + 10)} acento={acento} />
          </div>
        );
      })}
    </div>
  );
};

const Marca: React.FC<{ valor: Celda; col: number; tam: number; e: number; acento?: string }> = ({ valor, col, tam, e, acento }) => {
  const bola = tam * 1.25;
  return (
    <div style={{ width: col, display: "grid", placeItems: "center", transform: `scale(${e})` }}>
      {typeof valor === "string" ? (
        <span style={{ fontWeight: 750, fontSize: tam * 0.82, whiteSpace: "nowrap", color: acento ?? P.vison, fontVariantNumeric: "tabular-nums" }}>{valor}</span>
      ) : (
        <span style={{ width: bola, height: bola, borderRadius: "50%", display: "grid", placeItems: "center", background: valor ? BIEN : MAL, color: "#fff" }}>
          <Icono nombre={valor ? "check" : "cerrar"} tam={bola * 0.62} grosor={2.8} />
        </span>
      )}
    </div>
  );
};

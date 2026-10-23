import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { entrada } from "../comun/movimiento";
import { P } from "../marca";

// ============================================================================
// UNA CUENTA EN PANTALLA: «1,80 € × 250 días = 450 €»
// ----------------------------------------------------------------------------
// Cada trozo entra en su fotograma (`en`); el resultado, más grande y en verde.
// Así una cifra se cree: se ve de dónde sale. `debajo`: la letra pequeña de cada
// trozo («el café», «laborables»).
// ============================================================================

export type Trozo = { texto: string; en: number; debajo?: string; resultado?: boolean };

export const Cuenta: React.FC<{ trozos: Trozo[]; tam?: number }> = ({ trozos, tam = 84 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "center", columnGap: tam * 0.35, rowGap: tam * 0.3 }}>
      {trozos.map((t, i) => {
        const e = entrada(frame, fps, t.en);
        const operador = t.texto.length === 1 && "×=+−".includes(t.texto);
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - e) * 30}px) scale(${0.8 + 0.2 * e})` }}>
            <div
              style={{
                fontSize: t.resultado ? tam * 1.35 : tam,
                fontWeight: operador ? 500 : 750,
                color: t.resultado ? P.verde : operador ? P.vison : P.espresso,
                letterSpacing: "-0.03em",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
                ...(t.resultado ? { background: `${P.verde}14`, padding: `${tam * 0.12}px ${tam * 0.3}px`, borderRadius: tam * 0.25 } : {}),
              }}
            >
              {t.texto}
            </div>
            {t.debajo && <div style={{ fontSize: tam * 0.36, color: P.vison, fontWeight: 600, marginTop: tam * 0.12 }}>{t.debajo}</div>}
          </div>
        );
      })}
    </div>
  );
};

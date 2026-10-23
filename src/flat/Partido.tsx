import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Etiqueta } from "../comun/Etiqueta";
import { entrada } from "../comun/movimiento";
import { ALTO, ANCHO, SEGURA } from "../formato";
import { LIMITE_ESCENA } from "../comun/Locucion";
import { FONDOS, P, type Fondo } from "../marca";

// ============================================================================
// LA PANTALLA PARTIDA: arriba lo de antes, abajo lo de fiddle
// ----------------------------------------------------------------------------
// En vertical se parte en horizontal (dos franjas), no en columnas: dos columnas
// de 540 px no dejan sitio a nada. Cada mitad lleva su etiqueta arriba a la
// izquierda, dentro de la zona segura. La raya del medio entra barriendo.
// ============================================================================

type Props = {
  arriba: React.ReactNode;
  abajo: React.ReactNode;
  etiquetas?: [string, string];
  fondos?: [Fondo, Fondo];
  desde?: number;
};

// La raya va en el centro de lo que se ve (entre lo que tapan las apps arriba y los
// subtítulos abajo), no de la pantalla entera: así las dos mitades miden lo mismo.
export const CORTE = (SEGURA.arriba + LIMITE_ESCENA) / 2;
/** Lo que mide cada mitad sin contar lo tapado. */
export const ALTO_MITAD = CORTE - SEGURA.arriba;

export const Partido: React.FC<Props> = ({ arriba, abajo, etiquetas = ["Sin fiddle", "Con fiddle"], fondos = ["crema", "papel"], desde = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const raya = entrada(frame, fps, desde, true);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width: ANCHO, height: CORTE, background: FONDOS[fondos[0]], overflow: "hidden" }}>
        {arriba}
        <Etiqueta texto={etiquetas[0]} fondo={P.vison} style={{ position: "absolute", left: SEGURA.izquierda, top: SEGURA.arriba }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: CORTE, width: ANCHO, height: ALTO - CORTE, background: FONDOS[fondos[1]], overflow: "hidden" }}>
        {abajo}
        <Etiqueta texto={etiquetas[1]} style={{ position: "absolute", left: SEGURA.izquierda, top: 28 }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: CORTE - 3, height: 6, width: ANCHO * raya, background: P.espresso }} />
    </AbsoluteFill>
  );
};

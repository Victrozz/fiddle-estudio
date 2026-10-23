import React from "react";
import { AbsoluteFill, Series, useCurrentFrame } from "remotion";
import { Marco } from "../comun/Marco";
import { Titular } from "../comun/Titular";
import { Aparece } from "../comun/Aparece";
import { Etiqueta } from "../comun/Etiqueta";
import { Contador } from "../comun/Contador";
import { Tarjeta, avisoDeTarjeta } from "../comun/Tarjeta";
import { Movil } from "../comun/Movil";
import { PantallaBloqueo, NotificacionDeTienda } from "../comun/PantallaBloqueo";
import { Caja } from "../comun/Caja";
import { Toque } from "../comun/Toque";
import { Cierre } from "../comun/Cierre";
import { Efecto } from "../comun/Efecto";
import { ZONA_LIBRE, s } from "../formato";
import { P, TAM } from "../marca";

// ============================================================================
// MUESTRARIO: LO COMÚN
// ----------------------------------------------------------------------------
// Cada pieza compartida, una detrás de otra, para verlas en el Studio y revisarlas
// con un still. NO es un vídeo para redes.
// ============================================================================

const tramo = s(3);
export const DURACION_COMUN = tramo * 5;

const Centro: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 48 }) => (
  <AbsoluteFill style={{ padding: `${ZONA_LIBRE.y}px ${1080 - ZONA_LIBRE.x - ZONA_LIBRE.ancho}px ${1920 - ZONA_LIBRE.y - ZONA_LIBRE.alto}px ${ZONA_LIBRE.x}px`, justifyContent: "center", alignItems: "center", gap }}>
    {children}
  </AbsoluteFill>
);

const PuntoQueSube: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Centro>
      <Titular texto="La tarjeta, de verdad" tam={TAM.titulo} alinear="center" />
      <Aparece desde={6} escala={0.9}>
        <Tarjeta puntos={frame < s(1.5) ? 6 : 7} ancho={820} />
      </Aparece>
      <div style={{ fontSize: TAM.texto, fontWeight: 650 }}>
        <Contador de={0} a={450} desde={s(1)} duracion={s(1.2)} despues=" €" /> al año
      </div>
      <Efecto sonido="pop" en={s(1.5)} />
    </Centro>
  );
};

export const MuestrarioComun: React.FC<{ guia?: boolean }> = ({ guia = false }) => (
  <Marco guia={guia}>
    <Series>
      <Series.Sequence durationInFrames={tramo}>
        <Centro gap={40}>
          <Etiqueta texto="El gancho" />
          <Titular texto="La cartilla de cartón te cuesta clientes" resaltar={["clientes"]} />
        </Centro>
      </Series.Sequence>

      <Series.Sequence durationInFrames={tramo}>
        <PuntoQueSube />
      </Series.Sequence>

      <Series.Sequence durationInFrames={tramo}>
        <Centro>
          <Aparece escala={0.92}>
            <Movil ancho={620}>
              <PantallaBloqueo>
                <NotificacionDeTienda texto={avisoDeTarjeta({ puntos: 7 }).texto} desde={s(0.6)} />
              </PantallaBloqueo>
            </Movil>
          </Aparece>
          <Efecto sonido="ding" en={s(0.6)} />
        </Centro>
      </Series.Sequence>

      <Series.Sequence durationInFrames={tramo}>
        <Centro>
          <Aparece escala={0.92}>
            <Movil ancho={620} pantalla={P.papel}>
              <Caja puntos={6} />
              <Toque x={195} y={330} en={s(1.2)} />
            </Movil>
          </Aparece>
        </Centro>
      </Series.Sequence>

      <Series.Sequence durationInFrames={tramo}>
        <Cierre />
      </Series.Sequence>
    </Series>
  </Marco>
);

import React from "react";
import { AbsoluteFill, Series, useCurrentFrame } from "remotion";
import { Marco } from "../comun/Marco";
import { Titular } from "../comun/Titular";
import { Escena } from "../3d/Escena";
import { Cafeteria, CAMARA_CAFE, SITIOS } from "../3d/Cafeteria";
import { Barrio, disposicionBarrio } from "../3d/Barrio";
import { Persona } from "../3d/Persona";
import { Aro } from "../3d/Aro";
import { SobreEscena, Bocadillo } from "../3d/SobreEscena";
import { camaraEn, type V3 } from "../3d/camara";
import { enRecorrido } from "../3d/recorrido";
import { SEGURA, ZONA_LIBRE, s } from "../formato";
import { P, TAM } from "../marca";

// ============================================================================
// MUESTRARIO: EL KIT 3D
// ----------------------------------------------------------------------------
// La cafetería con gente entrando y el barrio desde arriba, con lo plano encima
// (titular y bocadillos): así se combinan los dos kits. NO es un vídeo para redes.
// ============================================================================

const T = s(7);
export const DURACION_3D = T * 2;

const arriba: React.CSSProperties = { position: "absolute", left: ZONA_LIBRE.x, top: SEGURA.arriba, width: ZONA_LIBRE.ancho };
const sube = (p: V3, alto: number): V3 => [p[0], p[1] + alto, p[2]];

const EscenaCafe: React.FC = () => {
  const frame = useCurrentFrame();
  const camara = camaraEn(frame, [
    { en: 0, camara: CAMARA_CAFE },
    { en: T, camara: { posicion: [14, 9, 8], mira: [0, 0.8, -0.3], orto: 12.5 } },
  ]);
  const uno = enRecorrido(frame, [SITIOS.calle, SITIOS.entrada, SITIOS.caja], s(0.3), s(3));
  const dos = enRecorrido(frame, [SITIOS.calle, SITIOS.entrada, SITIOS.mesas[1]], s(3.2), s(2.8));
  return (
    <AbsoluteFill>
      <Escena camara={camara} alcanceSombra={7}>
        <Cafeteria>
          <Persona {...uno} semilla="ana" giro={uno.andando ? uno.giro : Math.PI} />
          <Persona {...dos} semilla="luis" />
          <Persona en={SITIOS.mesas[0]} giro={-0.6} semilla="marta" />
        </Cafeteria>
      </Escena>
      <SobreEscena camara={camara} punto={sube(uno.en, 1.55)}>
        <Bocadillo texto="+1 punto" desde={s(3.4)} />
      </SobreEscena>
      <div style={arriba}>
        <Titular texto="Una mañana cualquiera" tam={TAM.titulo} />
      </div>
    </AbsoluteFill>
  );
};

const B = disposicionBarrio({ columnas: 4, filas: 6, cafe: [1, 3] });
const hastaLaPuerta = (desde: V3, columna: number, i: number): V3[] => [desde, B.cruce(columna, 4), B.frentePuerta, [B.puerta[0] + (i - 1.5) * 0.35, 0, B.puerta[2]]];
const ANDAN = [
  { semilla: "a", camino: hastaLaPuerta(B.cruce(0, 0), 0, 0), desde: 0, dur: s(5.2) },
  { semilla: "b", camino: hastaLaPuerta(B.cruce(4, 6), 4, 1), desde: s(0.4), dur: s(4.6) },
  { semilla: "c", camino: hastaLaPuerta(B.cruce(3, 1), 3, 2), desde: s(0.8), dur: s(4.4) },
  { semilla: "d", camino: hastaLaPuerta(B.cruce(2, 6), 2, 3), desde: s(1.2), dur: s(3.6) },
];
const RIESGO: V3 = [B.cruce(2, 2)[0], 0, B.cruce(2, 2)[2]];
const PERDIDO: V3 = [B.cruce(1, 5)[0], 0, B.cruce(1, 5)[2]];

const EscenaBarrio: React.FC = () => {
  const frame = useCurrentFrame();
  const camara = camaraEn(frame, [
    { en: 0, camara: { posicion: [26, 50, 26], mira: [0, 0, 0], orto: 46 } },
    { en: T, camara: { posicion: [22, 46, 30], mira: [B.puerta[0], 0, B.puerta[2] - 2], orto: 32 } },
  ]);
  return (
    <AbsoluteFill>
      <Escena camara={camara} alcanceSombra={22} niebla={[60, 110]}>
        <Barrio columnas={4} filas={6} cafe={[1, 3]}>
          {ANDAN.map((a) => {
            const r = enRecorrido(frame, a.camino, a.desde, a.dur);
            return (
              <group key={a.semilla}>
                <Persona {...r} semilla={a.semilla} escala={0.8} />
                <Aro en={r.en} estado="viene" radio={0.55} />
              </group>
            );
          })}
          <Persona en={RIESGO} giro={0.8} semilla="riesgo" escala={0.8} />
          <Aro en={RIESGO} estado="riesgo" radio={0.55} />
          <Persona en={PERDIDO} giro={2.4} semilla="perdido" escala={0.8} />
          <Aro en={PERDIDO} estado="perdido" radio={0.55} />
        </Barrio>
      </Escena>
      <SobreEscena camara={camara} punto={[RIESGO[0], 1.3, RIESGO[2]]}>
        <Bocadillo texto="3 semanas sin venir" fondo="#b07a16" desde={s(2)} tam={38} />
      </SobreEscena>
      <div style={arriba}>
        <Titular texto="¿Quién ha dejado de venir?" tam={TAM.titulo} resaltar={["dejado"]} colorResalte={P.camel} />
      </div>
    </AbsoluteFill>
  );
};

export const MuestrarioTresD: React.FC<{ guia?: boolean }> = ({ guia = false }) => (
  <Marco guia={guia} grano={false}>
    <Series>
      <Series.Sequence durationInFrames={T}>
        <EscenaCafe />
      </Series.Sequence>
      <Series.Sequence durationInFrames={T}>
        <EscenaBarrio />
      </Series.Sequence>
    </Series>
  </Marco>
);

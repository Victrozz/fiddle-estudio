import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Marco } from "../../comun/Marco";
import { Locucion, Subtitulos, crearHorario } from "../../comun/Locucion";
import { Ventana, ZonaEscena } from "../../comun/Ventana";
import { Aparece } from "../../comun/Aparece";
import { Etiqueta } from "../../comun/Etiqueta";
import { Contador } from "../../comun/Contador";
import { PantallaBloqueo } from "../../comun/PantallaBloqueo";
import { MovilGrande, AvisoGrande, puntoDelMovil } from "../../comun/MovilGrande";
import { Cierre } from "../../comun/Cierre";
import { Efecto } from "../../comun/Efecto";
import { mezclaColor, tramo } from "../../comun/movimiento";
import { Cortina } from "../../flat/Cortina";
import { ListaClientes } from "../../flat/ListaClientes";
import { Escena } from "../../3d/Escena";
import { Barrio, disposicionBarrio } from "../../3d/Barrio";
import { Persona } from "../../3d/Persona";
import { Aro } from "../../3d/Aro";
import { SobreEscena, Bocadillo } from "../../3d/SobreEscena";
import { camaraEn, type Camara, type V3 } from "../../3d/camara";
import { enRecorrido } from "../../3d/recorrido";
import { ESTADO } from "../../3d/materiales";
import { P } from "../../marca";
import guion from "./locucion.json";
import tiempos from "./tiempos.json";

// ============================================================================
// QUIÉN VUELVE: DOS FINALES (3d con lo plano encima, voz de Brian)
// Marta venía cada mañana y deja de venir. Sin fiddle, se pierde sin que nadie lo
// note; con fiddle, la tienda lo ve (En riesgo), le avisa y vuelve.
// ============================================================================

const h = crearHorario(guion, tiempos);
export const DURACION = h.total;

const MARTA = "#c4573a";
const B = disposicionBarrio({ columnas: 4, filas: 6, cafe: [1, 3] });
const CASA = B.cruce(2, 1);
const aLaPuerta = (desde: V3, columna: number, hueco = 0): V3[] => [desde, B.cruce(columna, 4), B.frentePuerta, [B.puerta[0] + hueco * 0.4, 0, B.puerta[2]]];
const sube = (p: V3, y: number): V3 => [p[0], y, p[2]];

// Los demás clientes: cada día van a la cafetería (unos de cada esquina).
const OTROS = [
  { semilla: "a", desde: B.cruce(0, 0), columna: 0, hueco: -1 },
  { semilla: "b", desde: B.cruce(4, 6), columna: 4, hueco: 1 },
  { semilla: "c", desde: B.cruce(2, 6), columna: 2, hueco: 2 },
];
const DIAS = [
  { empieza: 0, otros: OTROS },
  { empieza: h.en("dejo"), otros: OTROS.map((o) => ({ ...o, semilla: `${o.semilla}2` })) },
  { empieza: h.en("sin"), otros: OTROS.slice(0, 2).map((o) => ({ ...o, semilla: `${o.semilla}3` })) },
];

/** Dónde está Marta y de qué color va su aro, en cada momento de la historia. */
function marta(frame: number) {
  const llega = enRecorrido(frame, aLaPuerta(CASA, 2), 12, h.fin("marta") - 12);
  if (frame < h.en("dejo")) return { ...llega, aro: ESTADO.viene, escala: 0.95 };
  const riesgo = mezclaColor(ESTADO.viene, ESTADO.riesgo, tramo(frame, h.palabra("dejo", "dejó"), 40));
  if (frame < h.palabra("perdiste", "Marta")) {
    const perdida = mezclaColor(riesgo, ESTADO.perdido, tramo(frame, h.palabra("sin", "pasan"), 60));
    return { en: CASA, giro: Math.PI / 4, fase: 0, andando: false, aro: frame >= h.en("sin") ? perdida : riesgo, escala: 0.95 };
  }
  // Se va calle abajo, a la vista: se aleja y desaparece.
  const se = enRecorrido(frame, [CASA, B.cruce(3, 1), B.cruce(4, 1)], h.palabra("perdiste", "Marta"), h.fin("perdiste") - h.palabra("perdiste", "Marta") + 20);
  return { ...se, aro: ESTADO.perdido, escala: 0.95 * (1 - tramo(frame, h.fin("perdiste") - 10, 24)) };
}

const ElBarrio: React.FC = () => {
  const frame = useCurrentFrame();
  const medio: V3 = [(CASA[0] + B.puerta[0]) / 2, 0, (CASA[2] + B.puerta[2]) / 2];
  const vista = (mira: V3, orto: number): Camara => ({ posicion: [mira[0] + 24, 46, mira[2] + 28], mira, orto });
  const camara: Camara = camaraEn(frame, [
    { en: 0, camara: vista(medio, 25) },
    { en: h.en("cuenta"), camara: vista(medio, 24) },
    { en: h.fin("cuenta") + 10, camara: vista(CASA, 17) },
    { en: h.palabra("sin", "pasan"), camara: vista(CASA, 17) },
    { en: h.fin("perdiste"), camara: vista([CASA[0] + 3, 0, CASA[2]], 20) },
  ]);
  const m = marta(frame);
  const dia = [...DIAS].reverse().find((d) => frame >= d.empieza) ?? DIAS[0];
  return (
    <AbsoluteFill>
      <Escena camara={camara} alcanceSombra={22} niebla={[70, 120]}>
        <Barrio columnas={4} filas={6} cafe={[1, 3]}>
          {dia.otros.map((o) => {
            const r = enRecorrido(frame, aLaPuerta(o.desde, o.columna, o.hueco), dia.empieza + 6, 105);
            return (
              <group key={o.semilla}>
                <Persona {...r} semilla={o.semilla} escala={0.95} />
                <Aro en={r.en} estado="viene" radio={0.55} />
              </group>
            );
          })}
          {m.escala > 0.02 && (
            <group>
              <Persona en={m.en} giro={m.giro} fase={m.fase} semilla="marta" ropa={MARTA} pelo="#5a3a22" escala={m.escala} />
              <Aro en={m.en} color={m.aro} radio={0.7} />
            </group>
          )}
        </Barrio>
      </Escena>
      {m.escala > 0.4 && (
        <SobreEscena camara={camara} punto={sube(m.en, 1.35)}>
          <Bocadillo texto={frame >= h.en("cuenta") ? "¿Marta?" : "Marta"} fondo={MARTA} tam={40} desde={h.palabra("marta", "Marta") + 4} />
        </SobreEscena>
      )}
      <Ventana desde={h.en("sin")} hasta={h.en("con")}>
        <Etiqueta texto="Sin fiddle" fondo={P.vison} tam={40} style={{ position: "absolute", left: 64, top: 230 }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "center" }}>
          <div style={{ background: "rgba(248,243,236,.92)", padding: "18px 44px", borderRadius: 40, fontSize: 84, fontWeight: 800, letterSpacing: "-0.03em", boxShadow: "0 12px 30px rgba(31,24,18,.18)" }}>
            <Contador de={1} a={30} desde={h.palabra("sin", "pasan")} duracion={h.fin("perdiste") - h.palabra("sin", "pasan")} antes="Día " />
          </div>
        </div>
      </Ventana>
      <Efecto sonido="pop" en={h.palabra("marta", "Marta") + 4} volumen={0.4} />
    </AbsoluteFill>
  );
};

const EnFiddle: React.FC = () => {
  const cambia = h.palabra("con", "Marta");
  return (
    <ZonaEscena gap={44}>
      <Aparece desde={h.en("con")} sube={30}>
        <Etiqueta texto="Con fiddle" tam={40} />
      </Aparece>
      <ListaClientes
        ancho={866}
        tam={52}
        filas={[
          { nombre: "Ana", detalle: "Viene cada 2 días", estado: "activo", desde: h.en("con") + 6 },
          { nombre: "Marta", detalle: "Viene cada mañana", estado: "activo", desde: h.en("con") + 12, cambiaEn: cambia, luego: "riesgo", detalleLuego: "12 días sin venir · suele venir a diario" },
          { nombre: "Luis", detalle: "2.ª visita esta semana", estado: "nuevo", desde: h.en("con") + 18 },
        ]}
      />
      <Efecto sonido="pop" en={cambia} />
    </ZonaEscena>
  );
};

const ElAviso: React.FC = () => {
  const llega = h.palabra("aviso", "llega");
  return (
    <>
      <MovilGrande desde={h.en("aviso")}>
        <PantallaBloqueo />
      </MovilGrande>
      <AvisoGrande texto="Te echamos de menos, Marta. Hoy tu café lleva doble punto." desde={llega} arriba={puntoDelMovil(270)} />
      <Efecto sonido="ding" en={llega} />
    </>
  );
};

const Vuelve: React.FC = () => {
  const frame = useCurrentFrame();
  const desde = h.en("vuelve") + 2;
  const llega = desde + 58;
  const camara = camaraEn(frame, [
    { en: h.en("vuelve") - 10, camara: { posicion: [22, 40, 28], mira: [B.puerta[0] + 1, 0, B.puerta[2] - 2], orto: 22 } },
    { en: h.en("cierre"), camara: { posicion: [22, 40, 28], mira: [B.puerta[0], 0, B.puerta[2] - 1], orto: 17 } },
  ]);
  const r = enRecorrido(frame, [B.cruce(2, 3), B.cruce(2, 4), B.frentePuerta, B.puerta], desde, llega - desde);
  const aro = mezclaColor(ESTADO.riesgo, ESTADO.viene, tramo(frame, llega - 10, 14));
  return (
    <AbsoluteFill>
      <Escena camara={camara} alcanceSombra={22} niebla={[70, 120]}>
        <Barrio columnas={4} filas={6} cafe={[1, 3]}>
          <Persona {...r} semilla="marta" ropa={MARTA} pelo="#5a3a22" escala={0.95} salto={tramo(frame, llega, 12)} />
          <Aro en={r.en} color={aro} radio={0.7} />
        </Barrio>
      </Escena>
      <SobreEscena camara={camara} punto={sube(r.en, 1.35)}>
        <Bocadillo texto="+1 punto" desde={llega} />
      </SobreEscena>
      <Efecto sonido="pop" en={llega} />
    </AbsoluteFill>
  );
};

export const QuienVuelve: React.FC<{ guia?: boolean }> = ({ guia = false }) => (
  <Marco guia={guia} grano={false}>
    <Locucion horario={h} />
    <Ventana desde={0} hasta={h.en("con")} entra={0} sale={0}>
      <ElBarrio />
    </Ventana>
    <Ventana desde={h.en("con")} hasta={h.en("aviso")} entra={0}>
      <EnFiddle />
    </Ventana>
    <Ventana desde={h.en("aviso")} hasta={h.en("vuelve")} sale={0}>
      <ElAviso />
    </Ventana>
    <Ventana desde={h.en("vuelve")} hasta={h.en("cierre")} entra={0}>
      <Vuelve />
    </Ventana>
    <Cortina desde={h.en("con") - 9} />
    <Efecto sonido="zas" en={h.en("con") - 9} volumen={0.5} />
    <Cortina desde={h.en("vuelve") - 9} color={P.papel} />
    <Cierre desde={h.en("cierre")} lema="Que nadie se vaya sin que te enteres." />
    <Subtitulos horario={h} />
  </Marco>
);

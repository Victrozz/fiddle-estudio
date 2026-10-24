import React from "react";
import { Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { Marco } from "../../comun/Marco";
import { Locucion, Subtitulos, crearHorario } from "../../comun/Locucion";
import { Ventana, ZonaEscena } from "../../comun/Ventana";
import { Aparece } from "../../comun/Aparece";
import { Movil } from "../../comun/Movil";
import { Caja } from "../../comun/Caja";
import { Toque } from "../../comun/Toque";
import { PantallaBloqueo } from "../../comun/PantallaBloqueo";
import { MovilGrande, AvisoGrande, puntoDelMovil } from "../../comun/MovilGrande";
import { avisoDeTarjeta } from "../../comun/Tarjeta";
import { Cierre } from "../../comun/Cierre";
import { Efecto } from "../../comun/Efecto";
import { entrada, tramo } from "../../comun/movimiento";
import { CartillaCarton } from "../../flat/CartillaCarton";
import { SelloGoma } from "../../flat/SelloGoma";
import { Cronometro } from "../../flat/Cronometro";
import { Partido, CORTE } from "../../flat/Partido";
import { Cortina } from "../../flat/Cortina";
import { BIEN, P } from "../../marca";
import guion from "./locucion.json";
import tiempos from "./tiempos.json";

// ============================================================================
// IGUAL DE RÁPIDO (flat, voz de Álvaro)
// Lo que más frena a un dueño: «en la caja no tengo tiempo». Los dos cronómetros
// acaban igual; lo que cambia es lo que la tienda se lleva después.
// Los segundos son una ilustración: antes de publicarlo, cronometrarlo de verdad.
// ============================================================================

const h = crearHorario(guion, tiempos, { holgado: true });
export const DURACION = h.total;

const SEGUNDOS = 3;
const CARTILLA = 500;

/** Un tic cada 9 fotogramas mientras corre un cronómetro. */
const Tics: React.FC<{ desde: number; hasta: number }> = ({ desde, hasta }) => (
  <>
    {Array.from({ length: Math.floor((hasta - desde) / 9) }, (_, i) => (
      <Efecto key={i} sonido="tic" en={desde + i * 9} volumen={0.35} />
    ))}
  </>
);

const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const late = 1 + Math.sin(frame / 6) * 0.015;
  return (
    <ZonaEscena gap={70}>
      <div style={{ transform: `scale(${late})` }}>
        <Aparece desde={0} escala={0.7} suave>
          <Cronometro segundos={0} tam={440} etiqueta="En la caja" />
        </Aparece>
      </div>
      <div style={{ display: "flex", gap: 22 }}>
        {["A", "J", "L", "S"].map((l, i) => (
          <Aparece key={l} desde={h.palabra("gancho", "perder") + i * 4} escala={0.5}>
            <div style={{ width: 100, height: 100, borderRadius: "50%", background: [P.camel, P.vison, P.verde, P.camelOscuro][i], color: P.papel, display: "grid", placeItems: "center", fontSize: 44, fontWeight: 750 }}>{l}</div>
          </Aparece>
        ))}
      </div>
      <Aparece desde={h.palabra("gancho", "caja?")} sube={20}>
        <div style={{ fontSize: 40, fontWeight: 600, color: P.vison }}>y la cola esperando</div>
      </Aparece>
    </ZonaEscena>
  );
};

/** Las dos mitades: cartón arriba, fiddle abajo, cada una con su cronómetro. */
const Carrera: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sellar = h.palabra("carton", "sellar");
  const busca = tramo(frame, h.palabra("carton", "buscar"), 14);
  const devuelve = tramo(frame, h.palabra("carton", "devolverla."), 14, Easing.in(Easing.cubic));
  const anadir = h.palabra("fiddle", "«Añadir");
  const escanea = h.palabra("fiddle", "escaneas");
  const despues = h.palabra("despues", "después.");
  const nada = h.palabra("sabes", "nada.");
  const conFiddle = h.palabra("sabes", "fiddle,");
  const gris = tramo(frame, despues, 12);
  const igual = h.palabra("igual", "mismo.");
  const e = entrada(frame, fps, igual);
  const sinCrono = 1 - tramo(frame, h.en("sabes") - 6, 10);
  const d = (CARTILLA * 0.8) / 5;
  const filas: [string, number, number][] = [
    ["Marta", h.palabra("sabes", "quién"), 52],
    ["Vino hoy a las 9:41", h.palabra("sabes", "cuándo,"), 40],
    ["Le faltan 2 para su café gratis", h.palabra("sabes", "cuánto"), 40],
  ];
  return (
    <>
      <Partido
        desde={h.en("vamos")}
        etiquetas={["Cartón", "fiddle"]}
        arriba={
          <>
            <div style={{ position: "absolute", left: 64 - 600 * (1 - busca) - 30 * devuelve, top: 310, filter: `grayscale(${gris}) opacity(${1 - 0.45 * gris})`, transform: `rotate(${-3 - 5 * devuelve}deg)` }}>
              <CartillaCarton marcados={frame < sellar ? 4 : 5} ultimoEn={sellar} ancho={CARTILLA} semilla="rapido" />
              <SelloGoma x={CARTILLA * 0.1 + d * 4.5} y={CARTILLA * 0.63 * 0.52} en={sellar} ancho={130} />
            </div>
            <div style={{ position: "absolute", left: 270, top: 330, fontSize: 260, fontWeight: 800, color: P.camel, opacity: tramo(frame, nada - 4, 8), transform: `scale(${0.6 + 0.4 * tramo(frame, nada - 4, 8)})` }}>?</div>
            <div style={{ position: "absolute", left: 700, top: 300, opacity: sinCrono }}>
              <Cronometro segundos={SEGUNDOS} desde={h.palabra("carton", "Cartón:")} duracion={h.fin("carton") - h.palabra("carton", "Cartón:")} tam={250} color={P.camel} />
            </div>
          </>
        }
        abajo={
          <>
            <div style={{ position: "absolute", left: 40, top: 96, opacity: 1 - tramo(frame, conFiddle - 8, 8) }}>
              <Movil ancho={440}>
                <Caja puntos={frame < anadir ? 5 : 6} />
                <Toque x={195} y={333} en={anadir} />
                {frame >= escanea && frame < escanea + 12 && <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: 1 - tramo(frame, escanea, 12) }} />}
              </Movil>
            </div>
            <div style={{ position: "absolute", left: 700, top: 110, opacity: sinCrono }}>
              <Cronometro segundos={SEGUNDOS} desde={h.palabra("fiddle", "Con")} duracion={h.fin("fiddle") - h.palabra("fiddle", "Con")} tam={250} />
            </div>
            <div style={{ position: "absolute", left: 64, top: 110, width: 866, background: P.superficie, borderRadius: 30, padding: "14px 36px", boxShadow: "0 24px 60px -24px rgba(31,24,18,.35)", opacity: tramo(frame, conFiddle - 4, 10) }}>
              {filas.map(([texto, en, tam]) => {
                const v = tramo(frame, en - 2, 8);
                return (
                  <div key={texto} style={{ fontSize: tam, fontWeight: tam > 45 ? 750 : 600, padding: "14px 0", opacity: v, transform: `translateX(${(1 - v) * -30}px)`, color: tam > 45 ? P.espresso : P.vison }}>
                    {texto}
                  </div>
                );
              })}
            </div>
          </>
        }
      />
      <div style={{ position: "absolute", left: 845 - 60, top: CORTE - 60, width: 120, height: 120, borderRadius: "50%", background: BIEN, color: "#fff", display: "grid", placeItems: "center", fontSize: 80, fontWeight: 800, transform: `scale(${e * sinCrono})` }}>=</div>
      <Efecto sonido="golpe" en={sellar} />
      <Efecto sonido="caja" en={anadir} />
      <Efecto sonido="pop" en={igual} />
      <Tics desde={h.palabra("carton", "Cartón:")} hasta={h.fin("carton")} />
      <Tics desde={h.palabra("fiddle", "Con")} hasta={h.fin("fiddle")} />
    </>
  );
};

const AlCliente: React.FC = () => {
  const llega = h.palabra("cliente", "llega");
  return (
    <>
      <MovilGrande desde={h.en("cliente")}>
        <PantallaBloqueo />
      </MovilGrande>
      <AvisoGrande texto={avisoDeTarjeta({ puntos: 6 }).texto} desde={llega} arriba={puntoDelMovil(270)} />
      <Efecto sonido="ding" en={llega} />
    </>
  );
};

export const IgualDeRapido: React.FC<{ guia?: boolean }> = ({ guia = false }) => (
  <Marco guia={guia}>
    <Locucion horario={h} />
    <Ventana desde={0} hasta={h.en("vamos")} entra={0}>
      <Gancho />
    </Ventana>
    <Ventana desde={h.en("vamos")} hasta={h.en("cliente")}>
      <Carrera />
    </Ventana>
    <Ventana desde={h.en("cliente")} hasta={h.en("cierre")} entra={0}>
      <AlCliente />
    </Ventana>
    <Cortina desde={h.en("cliente") - 9} />
    <Efecto sonido="zas" en={h.en("cliente") - 9} volumen={0.5} />
    <Cierre desde={h.en("cierre")} lema="Igual de rápido. Muchísimo más útil." />
    <Subtitulos horario={h} />
  </Marco>
);

import React from "react";
import { Easing, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { DISENOS, CAFETERIA } from "@fiddle/app/home/demo";
import { Marco } from "../../comun/Marco";
import { Locucion, Subtitulos, crearHorario } from "../../comun/Locucion";
import { Ventana, ZonaEscena } from "../../comun/Ventana";
import { Aparece } from "../../comun/Aparece";
import { Etiqueta } from "../../comun/Etiqueta";
import { Tarjeta } from "../../comun/Tarjeta";
import { MovilGrande } from "../../comun/MovilGrande";
import { PantallaTarjeta } from "../../comun/PantallaTarjeta";
import { Toque } from "../../comun/Toque";
import { Cierre } from "../../comun/Cierre";
import { Efecto } from "../../comun/Efecto";
import { entrada, mezclaColor, tramo } from "../../comun/movimiento";
import { CartillaCarton } from "../../flat/CartillaCarton";
import { Trazo } from "../../flat/Trazo";
import { ANCHO } from "../../formato";
import { P } from "../../marca";
import guion from "./locucion.json";
import tiempos from "./tiempos.json";

// ============================================================================
// TU TARJETA, CON TU CARA (flat, voz de Brian)
// La tarjeta es de la tienda: sus colores, su forma, su premio. Cada diseño es uno
// de la web de fiddle (DISENOS, «Tu cafetería»), pintado con la tarjeta de verdad.
// El fondo se tiñe con el color de cada tarjeta.
// ============================================================================

const h = crearHorario(guion, tiempos);
export const DURACION = h.total;

const fondoDe = (id: string | null) => {
  const tema = id ? DISENOS.find((d: { id: string }) => d.id === id)?.tienda.tema : CAFETERIA.tema;
  return mezclaColor(P.papel, tema?.cardBg ?? P.papel, 0.35);
};

// Los colores que va probando la de iniciales al decir «con tus colores».
const COLORES = [
  { cardBg: "#c2392b", accent: "#8c2219" },
  { cardBg: "#1a422f", accent: "#26523c" },
  { cardBg: "#2f4858", accent: "#22343f" },
  { cardBg: "#7e5d3f", accent: "#5c4330" },
];

type Paso = { en: number; diseno: string | null; de: number; a: number };
// Cada diseño entra con su frase y va sumando puntos mientras se dice.
const PASOS: Paso[] = [
  { en: h.en("mira"), diseno: null, de: 4, a: 4 },
  { en: h.en("vaso"), diseno: "vaso", de: 2, a: 5 },
  { en: h.en("luna"), diseno: "luna", de: 1, a: 5 },
  { en: h.en("doble"), diseno: "doble", de: 5, a: 5 },
  { en: h.en("iniciales"), diseno: "iniciales", de: 3, a: 3 },
  // 6 y no 7: con 7 la tarjeta diría «Faltan 1» (fallo de la app, ya avisado).
  { en: h.en("abierto"), diseno: "abierto", de: 6, a: 6 },
];

/** El último paso que ya ha empezado (-1 si ninguno). */
const pasoEn = (frame: number) => PASOS.reduce((k, p, j) => (frame >= p.en ? j : k), -1);

const Desfile: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const i = pasoEn(frame);
  const paso = PASOS[Math.max(0, i)];
  const siguiente = PASOS[i + 1]?.en ?? h.en("logo");
  // Media vuelta al cambiar de diseño: se cierra antes y se abre ya con el nuevo.
  const abre = tramo(frame, paso.en - 1, 7, Easing.out(Easing.cubic));
  const cierra = tramo(frame, siguiente - 6, 6, Easing.in(Easing.cubic));
  const giro = (1 - abre) * 90 + cierra * -90;
  const puntos = paso.de + Math.floor((paso.a - paso.de + 0.999) * tramo(frame, paso.en + 6, siguiente - paso.en - 18, (x) => x));
  const colores = paso.diseno === "iniciales" && frame >= h.palabra("iniciales", "colores.") ? COLORES[Math.floor((frame - h.palabra("iniciales", "colores.")) / 9) % COLORES.length] : undefined;
  const e = entrada(frame, fps, h.en("mira"));
  return (
    <ZonaEscena>
      <div style={{ transform: `perspective(1800px) rotateY(${giro}deg) scale(${0.85 + 0.15 * e})` }}>
        <Tarjeta diseno={paso.diseno ?? undefined} puntos={puntos} puntos2={paso.diseno === "doble" ? 2 : undefined} tema={colores} ancho={880} />
      </div>
      {PASOS.map((p) => (
        <Efecto key={p.en} sonido="pop" en={p.en} volumen={0.5} />
      ))}
    </ZonaEscena>
  );
};

const Fondo: React.FC = () => {
  const frame = useCurrentFrame();
  const i = pasoEn(frame);
  if (i < 0 || frame >= h.en("logo")) return null;
  const antes = i > 0 ? fondoDe(PASOS[i - 1].diseno) : P.papel;
  return <div style={{ position: "absolute", inset: 0, background: mezclaColor(antes, fondoDe(PASOS[i].diseno), tramo(frame, PASOS[i].en, 10)) }} />;
};

const Carton: React.FC = () => {
  const frame = useCurrentFrame();
  const beige = h.palabra("gancho", "beige.");
  const fuera = tramo(frame, beige + 10, 16, Easing.in(Easing.cubic));
  return (
    <ZonaEscena>
      <div style={{ position: "relative", transform: `translateY(${fuera * 700}px) rotate(${-4 + fuera * 20}deg)`, opacity: 1 - fuera }}>
        <Aparece desde={0} escala={0.9}>
          <CartillaCarton marcados={3} ancho={820} semilla="beige" />
        </Aparece>
        <Trazo forma="tachar" ancho={880} alto={520} desde={beige - 4} color={P.verde} grosor={20} style={{ left: -30, top: 0 }} />
      </div>
      <Efecto sonido="zas" en={beige + 10} volumen={0.5} />
    </ZonaEscena>
  );
};

/** Un abanico de tarjetas y los dos sitios donde se guardan. */
const Abanico: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cartas = [
    { diseno: "forma", en: h.palabra("logo", "logo,"), giro: -12, x: -150 },
    { diseno: "galleta", en: h.palabra("logo", "premio"), giro: 0, x: 0 },
    { diseno: "cifra", en: h.palabra("logo", "estilo,"), giro: 12, x: 150 },
  ];
  const apple = h.palabra("logo", "Apple");
  const android = h.palabra("logo", "Android.");
  return (
    <ZonaEscena gap={60}>
      <div style={{ position: "relative", width: ANCHO - 128, height: 560 }}>
        {cartas.map((c) => {
          const e = entrada(frame, fps, c.en);
          return (
            <div key={c.diseno} style={{ position: "absolute", left: (ANCHO - 128) / 2 - 290 + c.x, top: 80 + Math.abs(c.giro) * 3, transform: `rotate(${c.giro * e}deg) translateY(${(1 - e) * 200}px)`, opacity: Math.min(1, e * 1.5), transformOrigin: "bottom center" }}>
              <Tarjeta diseno={c.diseno} ancho={580} />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
        <Aparece desde={apple} escala={0.8}>
          <Img src={staticFile("marca/wallet/apple-wallet-anadir.svg")} style={{ height: 110, display: "block" }} />
        </Aparece>
        <Aparece desde={android} escala={0.8}>
          <Etiqueta texto="y en Android" tam={46} fondo={P.espresso} style={{ display: "flex", alignItems: "center", gap: 14, padding: "26px 34px" }} />
        </Aparece>
      </div>
      {cartas.map((c) => (
        <Efecto key={c.diseno} sonido="pop" en={c.en} volumen={0.45} />
      ))}
    </ZonaEscena>
  );
};

const LaGuardan: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const toque = h.palabra("guardan", "guardan") - 6;
  const guardada = entrada(frame, fps, toque + 6);
  return (
    <>
      <MovilGrande desde={h.en("guardan")}>
        {frame < toque + 6 ? (
          <div style={{ position: "absolute", inset: 0, background: P.papel, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 120, gap: 22 }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>Tu cafetería</div>
            <div style={{ fontSize: 15, color: P.vison, marginBottom: 20 }}>Tu tarjeta, lista para guardar</div>
            <Img src={staticFile("marca/wallet/apple-wallet-anadir.svg")} style={{ height: 50 }} />
            <Toque x={195} y={268} en={toque} />
          </div>
        ) : (
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - guardada) * 300}px)` }}>
            <PantallaTarjeta conQR />
          </div>
        )}
      </MovilGrande>
      <Efecto sonido="caja" en={toque + 6} />
    </>
  );
};

export const TuTarjeta: React.FC<{ guia?: boolean }> = ({ guia = false }) => (
  <Marco guia={guia}>
    <Fondo />
    <Locucion horario={h} />
    <Ventana desde={0} hasta={h.en("mira")} entra={0} sale={4}>
      <Carton />
    </Ventana>
    <Ventana desde={h.en("mira")} hasta={h.en("logo")} entra={0}>
      <Desfile />
    </Ventana>
    <Ventana desde={h.en("logo")} hasta={h.en("guardan")}>
      <Abanico />
    </Ventana>
    <Ventana desde={h.en("guardan")} hasta={h.en("cierre")}>
      <LaGuardan />
    </Ventana>
    <Cierre desde={h.en("cierre")} lema="Tu tarjeta, con tu cara." />
    <Subtitulos horario={h} />
  </Marco>
);

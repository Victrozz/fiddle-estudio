import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Marco } from "../../comun/Marco";
import { Locucion, Subtitulos, crearHorario } from "../../comun/Locucion";
import { Ventana, ZonaEscena } from "../../comun/Ventana";
import { Aparece } from "../../comun/Aparece";
import { Etiqueta } from "../../comun/Etiqueta";
import { Titular } from "../../comun/Titular";
import { Cita } from "../../comun/Cita";
import { Marca } from "../../comun/Cierre";
import { Efecto } from "../../comun/Efecto";
import { entrada, tramo } from "../../comun/movimiento";
import { CartillaCarton } from "../../flat/CartillaCarton";
import { Raton, Queso } from "../../flat/Raton";
import { Visitas } from "../../flat/Visitas";
import { BIEN, P, TAM } from "../../marca";
import guion from "./locucion.json";
import tiempos from "./tiempos.json";

// ============================================================================
// LAS RATAS Y EL CAFÉ (flat, voz de Brian)
// El gradiente de meta: las ratas de Hull (1934) corrían más cuanto más cerca de la
// comida, y en un café de Nueva York (Kivetz, Urminsky y Zheng, 2006) la espera
// entre café y café bajaba un 20 % según se llenaba la cartilla; tras el café
// gratis, otra vez despacio. Contenido, no anuncio: fiddle solo al final.
// ============================================================================

const h = crearHorario(guion, tiempos, { cola: 1.9 });
export const DURACION = h.total;
export const HORARIO = h;
const FINAL = h.fin("remate") + 8;

const CAFE = { nombre: "Café del campus", leyenda: "10 cafés y el siguiente, gratis", ultimaGratis: false, total: 10 };

// --- el pasillo de Hull ------------------------------------------------------

const ANCHO_PASILLO = 940;

/** Dónde va la rata (0 = salida, 1 = comida): despacio al principio y acelerando. */
function posicion(frame: number) {
  const sale = h.palabra("gancho", "ratas");
  const acelera = h.palabra("corren", "cuanto");
  const llega = h.palabra("corren", "corrían.") + 8;
  if (frame < acelera) return 0.16 * tramo(frame, sale, acelera - sale, Easing.linear);
  return 0.16 + 0.84 * interpolate(frame, [acelera, llega], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
}

const Pasillo: React.FC = () => {
  const frame = useCurrentFrame();
  const p = posicion(frame);
  const v = Math.max(0, posicion(frame + 1) - posicion(frame - 1)) / 2;
  const prisa = Math.min(1, v * 40);
  const queso = entrada(frame, useVideoConfig().fps, h.palabra("gancho", "comida"));
  const llega = h.palabra("corren", "corrían.") + 8;
  const come = frame >= llega ? Math.sin(Math.min(1, (frame - llega) / 10) * Math.PI) : 0;
  const ratonX = 30 + p * (ANCHO_PASILLO - 470);
  // La curva de velocidad: hasta donde ha llegado, sube con la cercanía.
  const puntos = Array.from({ length: 41 }, (_, i) => i / 40).filter((t) => t <= p + 1e-6);
  const curva = puntos.map((t, i) => `${i ? "L" : "M"} ${60 + t * (ANCHO_PASILLO - 120)} ${250 - Math.pow(t, 1.6) * 200}`).join(" ");
  return (
    <ZonaEscena gap={40}>
      <div style={{ display: "flex", gap: 18, alignItems: "center", alignSelf: "flex-start" }}>
        <Aparece desde={4} sube={20}>
          <Etiqueta texto="Años 30" tam={40} fondo={P.espresso} />
        </Aparece>
        <Cita texto="Clark Hull, 1934" desde={14} />
      </div>
      {/* el pasillo: de lado, con la salida a la izquierda y la comida al fondo */}
      <div style={{ position: "relative", width: ANCHO_PASILLO, height: 380 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 20, height: 340, borderRadius: 34, background: P.crema, border: `6px solid ${P.espresso}` }} />
        <div style={{ position: "absolute", left: 0, top: 20, width: 120, height: 340, borderRadius: "34px 0 0 34px", background: "rgba(96,84,75,.18)" }} />
        <div style={{ position: "absolute", left: ANCHO_PASILLO - 250, top: 120 + 10, transform: `scale(${queso * (1 + come * 0.12)}) rotate(${come * -8}deg)`, transformOrigin: "bottom center" }}>
          <Queso tam={210} />
        </div>
        <div style={{ position: "absolute", left: ratonX, top: 150 }}>
          <Raton tam={320} fase={p * 22} prisa={prisa} />
        </div>
      </div>
      {/* la velocidad, que se dibuja con la rata */}
      <Aparece desde={h.en("corren")} sube={30} style={{ alignSelf: "stretch" }}>
        <div style={{ fontSize: TAM.nota, fontWeight: 650, color: P.vison, marginBottom: 6 }}>Velocidad</div>
        <svg width={ANCHO_PASILLO} height={270} viewBox={`0 0 ${ANCHO_PASILLO} 270`} style={{ display: "block", overflow: "visible" }}>
          <line x1={60} y1={250} x2={ANCHO_PASILLO - 60} y2={250} stroke={P.vison} strokeOpacity={0.35} strokeWidth={4} strokeLinecap="round" />
          <path d={curva} fill="none" stroke={P.verde} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          {puntos.length > 1 && <circle cx={60 + p * (ANCHO_PASILLO - 120)} cy={250 - Math.pow(p, 1.6) * 200} r={16} fill={P.verde} />}
        </svg>
      </Aparece>
      <Efecto sonido="pop" en={h.palabra("gancho", "comida")} volumen={0.4} />
      <Efecto sonido="pop" en={llega} volumen={0.6} />
    </ZonaEscena>
  );
};

const Nombre: React.FC = () => {
  const frame = useCurrentFrame();
  const salta = Math.abs(Math.sin((frame - h.en("nombre")) / 5)) * 18;
  return (
    <ZonaEscena gap={80}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
        <div style={{ transform: `translateY(${-salta}px)` }}>
          <Raton tam={300} />
        </div>
        <Queso tam={170} />
      </div>
      <Titular texto="Gradiente de meta" desde={h.palabra("nombre", "gradiente")} color={P.papel} tam={TAM.gancho} resaltar={["meta"]} colorResalte={P.avena} tintaResalte={P.espresso} alinear="center" />
      <Efecto sonido="pop" en={h.palabra("nombre", "gradiente")} volumen={0.4} />
    </ZonaEscena>
  );
};

const Cafe: React.FC = () => (
  <ZonaEscena gap={50}>
    <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
      <Aparece desde={h.en("cafe")} sube={20}>
        <Etiqueta texto="70 años después" tam={40} fondo={P.espresso} />
      </Aparece>
      <Aparece desde={h.palabra("cafe", "Nueva")} sube={20}>
        <Etiqueta texto="Nueva York" tam={40} fondo={P.camel} />
      </Aparece>
    </div>
    <Aparece desde={h.palabra("cafe", "cartilla")} escala={0.85}>
      <CartillaCarton {...CAFE} marcados={0} ancho={860} semilla="ratas" />
    </Aparece>
    <Cita texto="Kivetz, Urminsky y Zheng, 2006" desde={h.palabra("cafe", "personas")} />
    <Efecto sonido="pop" en={h.palabra("cafe", "cartilla")} volumen={0.5} />
  </ZonaEscena>
);

// --- las visitas ------------------------------------------------------------
// La espera entre café y café baja un 20 % del primero al último (de 3,5 a 2,8:
// solo cuenta la proporción). Los puntos salen con esos mismos huecos, así que
// también en el vídeo llegan cada vez antes.
const HUECOS = Array.from({ length: 9 }, (_, i) => 3.5 - (0.7 * i) / 8);

function llegadas() {
  const desde = h.palabra("igual", "Cuanto");
  const hasta = h.fin("igual");
  const total = HUECOS.reduce((a, b) => a + b, 0);
  const en = [desde];
  for (const g of HUECOS) en.push(Math.round(en[en.length - 1] + (g / total) * (hasta - desde)));
  return en;
}

const Acelera: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const en = llegadas();
  const marcados = en.filter((f) => frame >= f).length;
  const veinte = h.palabra("cifra", "veinte");
  const cifra = entrada(frame, fps, veinte);
  return (
    <ZonaEscena gap={46}>
      <CartillaCarton {...CAFE} marcados={marcados} ultimoEn={marcados ? en[marcados - 1] : undefined} ancho={720} semilla="ratas" />
      <div style={{ position: "relative" }}>
        <Visitas huecos={HUECOS} en={en} ancho={880} alto={200} arco={36} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", justifyContent: "space-between", fontSize: TAM.nota, fontWeight: 650, opacity: tramo(frame, h.en("cifra"), 10) }}>
          <span style={{ color: P.camelOscuro }}>la 1.ª espera</span>
          <span style={{ color: P.verde }}>la última</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 24, opacity: Math.min(1, cifra * 1.5), transform: `scale(${0.6 + 0.4 * cifra})` }}>
        <span style={{ fontSize: 150, fontWeight: 800, color: BIEN, letterSpacing: "-0.05em", lineHeight: 1 }}>−20 %</span>
        <span style={{ fontSize: TAM.texto * 0.8, fontWeight: 650, color: P.vison, lineHeight: 1.1 }}>de espera</span>
      </div>
      {en.map((f, i) => (
        <Efecto key={i} sonido="pop" en={f} volumen={0.3} />
      ))}
      <Efecto sonido="ding" en={veinte} volumen={0.6} />
    </ZonaEscena>
  );
};

/** Tras el café gratis: cartilla nueva y otra vez despacio (la rata, sin prisa). */
const Reinicio: React.FC = () => {
  const frame = useCurrentFrame();
  const gratis = h.palabra("reinicio", "canjear");
  const lento = [gratis, h.palabra("reinicio", "empezar,"), h.palabra("reinicio", "despacio.") + 4];
  const anda = tramo(frame, h.palabra("reinicio", "vuelta"), h.en("remate") - h.palabra("reinicio", "vuelta"), Easing.linear);
  return (
    <ZonaEscena gap={50}>
      <div style={{ alignSelf: "flex-start", transform: `translateX(${anda * 420}px)` }}>
        <Raton tam={230} fase={anda * 5} />
      </div>
      <Visitas huecos={[3.6, 3.4]} en={lento} ancho={880} alto={230} especiales={{ 0: P.camel }} arco={56} />
      <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
        <Aparece desde={gratis} escala={0.6}>
          <Etiqueta texto="Café gratis" tam={44} fondo={P.camel} />
        </Aparece>
        <Aparece desde={lento[1]} escala={0.6}>
          <Etiqueta texto="Cartilla nueva" tam={44} fondo={P.vison} />
        </Aparece>
      </div>
      <Efecto sonido="ding" en={gratis} volumen={0.5} />
      <Efecto sonido="pop" en={lento[1]} volumen={0.3} />
      <Efecto sonido="pop" en={lento[2]} volumen={0.3} />
    </ZonaEscena>
  );
};

const Remate: React.FC = () => {
  const frame = useCurrentFrame();
  const corre = h.palabra("remate", "corres");
  const x = interpolate(frame, [corre - 6, h.fin("remate") + 6], [-340, 400], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  return (
    <ZonaEscena gap={44} alinear="flex-start">
      <Titular texto="No era por el café." desde={h.palabra("remate", "No")} cadencia={3} color={P.avena} tam={TAM.titulo} />
      <Titular texto="Era por la meta." desde={h.palabra("remate", "Era")} cadencia={3} color={P.papel} tam={TAM.titulo} />
      <div style={{ position: "relative", width: 866, height: 260, marginTop: 30 }}>
        <div style={{ position: "absolute", left: x, top: 80 }}>
          <Raton tam={300} fase={(x + 320) / 40} prisa={frame >= corre ? 1 : 0} />
        </div>
        <div style={{ position: "absolute", right: 0, top: 30 }}>
          <Queso tam={260} casillas={10} llenas={9} colorLleno={P.verde} />
        </div>
      </div>
      <Titular texto="Tú también corres hacia el queso." desde={h.palabra("remate", "Tú")} cadencia={3} color={P.papel} tam={TAM.titulo} resaltar={["queso."]} colorResalte={P.avena} tintaResalte={P.espresso} />
      <Efecto sonido="zas" en={corre} volumen={0.4} />
    </ZonaEscena>
  );
};

export const RatasYCafe: React.FC<{ guia?: boolean }> = ({ guia = false }) => (
  <Marco guia={guia}>
    <Locucion horario={h} />
    <Ventana desde={0} hasta={h.en("nombre")} entra={0} deriva={0.03}>
      <Pasillo />
    </Ventana>
    <Ventana desde={h.en("nombre")} hasta={h.en("cafe")} paso="zoom" entra={10} deriva={0.04} style={{ background: P.espresso }}>
      <Nombre />
    </Ventana>
    <Ventana desde={h.en("cafe")} hasta={h.en("igual")} paso="barrido" deriva={0.04}>
      <Cafe />
    </Ventana>
    <Ventana desde={h.en("igual")} hasta={h.en("reinicio")} paso="zoom" deriva={0.03}>
      <Acelera />
    </Ventana>
    <Ventana desde={h.en("reinicio")} hasta={h.en("remate")} paso="barrido" deriva={0.03}>
      <Reinicio />
    </Ventana>
    <Ventana desde={h.en("remate")} hasta={FINAL} paso="zoom" sale={0} deriva={0.03} style={{ background: P.espresso }}>
      <Remate />
    </Ventana>
    <Marca desde={FINAL} />
    <Subtitulos horario={h} sin={["remate"]} />
  </Marco>
);

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Marco } from "../../comun/Marco";
import { Locucion, Subtitulos, crearHorario } from "../../comun/Locucion";
import { Ventana, ZonaEscena } from "../../comun/Ventana";
import { Aparece } from "../../comun/Aparece";
import { Etiqueta } from "../../comun/Etiqueta";
import { Titular } from "../../comun/Titular";
import { Cita } from "../../comun/Cita";
import { Contador } from "../../comun/Contador";
import { Tarjeta } from "../../comun/Tarjeta";
import { Marca } from "../../comun/Cierre";
import { Efecto } from "../../comun/Efecto";
import { entrada, tramo } from "../../comun/movimiento";
import { DeCada100 } from "../../flat/DeCada100";
import { Escena } from "../../3d/Escena";
import { Cafeteria, CAMARA_CAFE, SITIOS, SUELO } from "../../3d/Cafeteria";
import { Barrio, disposicionBarrio } from "../../3d/Barrio";
import { Persona } from "../../3d/Persona";
import { Aro } from "../../3d/Aro";
import { SobreEscena, Bocadillo } from "../../3d/SobreEscena";
import { camaraEn, type Camara, type V3 } from "../../3d/camara";
import { enRecorrido } from "../../3d/recorrido";
import { COLOR, ESTADO } from "../../3d/materiales";
import { P, TAM } from "../../marca";
import guion from "./locucion.json";
import tiempos from "./tiempos.json";

// ============================================================================
// CAFÉS SIN SILLAS (3d con lo plano encima, voz de Brian)
// En una cafetería con sillas la gente vuelve por el sitio (el «tercer lugar» de
// Ray Oldenburg, 1989). En una de café para llevar no hay sitio: de camino al
// trabajo hay cuatro iguales y cambiar no cuesta nada. Solo ata la costumbre (el
// 43 % de lo que hacemos cada día: Wood, Quinn y Kashy, 2002) y una cartilla a
// medias la ata a una. Contenido, no anuncio: fiddle solo al final.
// ============================================================================

const h = crearHorario(guion, tiempos, { cola: 1.9 });
export const DURACION = h.total;
export const HORARIO = h;
const FINAL = h.fin("remate") + 8;

// --- la cafetería con sillas ---------------------------------------------------

const SENTADO = SUELO + 0.5;
const SENTADOS: { en: V3; giro: number; semilla: string }[] = [
  { en: [-1.7, SENTADO, 0.25], giro: 0, semilla: "s1" },
  { en: [-1.7, SENTADO, 1.75], giro: Math.PI, semilla: "s2" },
  { en: [1.6, SENTADO, 0.45], giro: 0, semilla: "s3" },
  { en: [1.6, SENTADO, 1.95], giro: Math.PI, semilla: "s4" },
];

const giraY = (p: V3, a: number): V3 => [p[0] * Math.cos(a) + p[2] * Math.sin(a), p[1], -p[0] * Math.sin(a) + p[2] * Math.cos(a)];

const ConSillas: React.FC = () => {
  const frame = useCurrentFrame();
  const fin = h.en("tercer");
  const giro = -0.22 + 0.36 * (frame / fin);
  const camara: Camara = camaraEn(frame, [
    { en: 0, camara: { ...CAMARA_CAFE, posicion: giraY(CAMARA_CAFE.posicion, giro), orto: 14 } },
    { en: fin, camara: { ...CAMARA_CAFE, posicion: giraY(CAMARA_CAFE.posicion, giro), mira: [-0.6, 0.9, 0], orto: 11.5 } },
  ]);
  const bocadillos: { punto: V3; texto: string; palabra: string }[] = [
    { punto: [-1.7, 1.75, 1.0], texto: "Su mesa", palabra: "mesa," },
    { punto: [-3.05, 2.9, -2.55], texto: "Su rincón", palabra: "rincón," },
    { punto: [-0.2, 2.2, -2.55], texto: "Su camarero", palabra: "camarero." },
  ];
  return (
    <AbsoluteFill>
      <Escena camara={camara}>
        <Cafeteria>
          {SENTADOS.map((s, i) => (
            <Persona key={s.semilla} en={s.en} giro={s.giro} semilla={s.semilla} fase={Math.sin((frame + i * 17) / 14) * 0.18} />
          ))}
          <Persona en={SITIOS.caja} giro={Math.PI * 0.85} semilla="pide" />
        </Cafeteria>
      </Escena>
      {bocadillos.map((b) => (
        <SobreEscena key={b.texto} camara={camara} punto={b.punto}>
          <Bocadillo texto={b.texto} desde={h.palabra("sitio", b.palabra) - 3} tam={46} />
        </SobreEscena>
      ))}
      <Aparece desde={h.palabra("gancho", "sillas")} sube={20} style={{ position: "absolute", left: 64, top: 240 }}>
        <Etiqueta texto="Con sillas" tam={44} fondo={P.espresso} />
      </Aparece>
      {bocadillos.map((b) => (
        <Efecto key={b.texto} sonido="pop" en={h.palabra("sitio", b.palabra) - 3} volumen={0.35} />
      ))}
    </AbsoluteFill>
  );
};

// --- el tercer lugar (plano) ----------------------------------------------------

const Dibujo: React.FC<{ tipo: "casa" | "trabajo" | "cafe"; color: string }> = ({ tipo, color }) => (
  <svg width={200} height={200} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
    {tipo === "casa" && (
      <>
        <path d="M 16 48 L 50 18 L 84 48" />
        <path d="M 24 42 V 84 H 76 V 42" />
        <path d="M 43 84 V 62 H 57 V 84" />
      </>
    )}
    {tipo === "trabajo" && (
      <>
        <rect x={24} y={14} width={52} height={72} rx={4} />
        {[28, 44, 60].map((y) => [36, 50, 64].map((x) => <rect key={`${x}${y}`} x={x - 4} y={y - 3} width={8} height={7} rx={1} fill={color} stroke="none" />))}
      </>
    )}
    {tipo === "cafe" && (
      <>
        <path d="M 20 44 H 70 V 60 A 25 22 0 0 1 20 60 Z" />
        <path d="M 70 48 A 9 9 0 0 1 70 66" />
        <path d="M 34 34 Q 38 26 34 18 M 50 34 Q 54 26 50 18" />
        <path d="M 16 88 H 74" />
      </>
    )}
  </svg>
);

const TercerLugar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lugares = [
    { tipo: "casa" as const, num: "1.º", texto: "Casa", en: h.palabra("tercer", "casa,") },
    { tipo: "trabajo" as const, num: "2.º", texto: "Trabajo", en: h.palabra("tercer", "trabajo.") },
    { tipo: "cafe" as const, num: "3.º", texto: "El tercer lugar", en: h.palabra("tercer", "tercer") },
  ];
  // Primero sale el tercero (es lo que se nombra), luego casa y trabajo al lado.
  return (
    <ZonaEscena gap={56}>
      <Titular texto="El tercer lugar" desde={h.palabra("tercer", "tercer") - 4} tam={TAM.gancho} alinear="center" resaltar={["lugar"]} />
      <div style={{ display: "flex", gap: 30 }}>
        {lugares.map((l, i) => {
          const e = entrada(frame, fps, l.en - 3);
          const destaca = i === 2;
          return (
            <div key={l.tipo} style={{ width: 268, padding: "26px 0 30px", borderRadius: 34, background: destaca ? P.verde : P.crema, color: destaca ? P.papel : P.espresso, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - e) * 60}px) scale(${0.8 + 0.2 * e})` }}>
              <div style={{ fontSize: 40, fontWeight: 750, opacity: 0.7 }}>{l.num}</div>
              <Dibujo tipo={l.tipo} color={destaca ? P.avena : P.espresso} />
              <div style={{ fontSize: 40, fontWeight: 700, textAlign: "center", lineHeight: 1.1, padding: "0 16px" }}>{l.texto}</div>
            </div>
          );
        })}
      </div>
      <Cita texto="Ray Oldenburg, 1989" desde={h.en("tercer") + 8} />
      {lugares.map((l) => (
        <Efecto key={l.tipo} sonido="pop" en={l.en - 3} volumen={0.35} />
      ))}
    </ZonaEscena>
  );
};

// --- la calle con cuatro cafés -----------------------------------------------

const VERDE_TOLDO = COLOR.base;
const B = disposicionBarrio({ columnas: 4, filas: 4, cafe: [2, 2] });
const CAFES = [
  { manzana: [0, 2] as [number, number], toldo: "#6b5a8c", nombre: "La Esquina" },
  { manzana: [1, 2] as [number, number], toldo: "#c4573a", nombre: "Grano" },
  { manzana: [2, 2] as [number, number], toldo: VERDE_TOLDO, nombre: "Tu cafetería" },
  { manzana: [3, 2] as [number, number], toldo: "#3f6e8c", nombre: "Café Norte" },
];
const OTROS = CAFES.filter((c) => c.manzana[0] !== 2).map(({ manzana, toldo }) => ({ manzana, toldo }));
const CASA = B.cruce(0, 3);
const TRABAJO = B.cruce(4, 3);
const SUYA = 2;
const ROPA = "#d9a441";

/** De casa a la puerta del café `k` (y ahí se queda: es lo que se tiene que ver). */
const viaje = (k: number, desde: V3 = CASA): V3[] => {
  const [i, j] = CAFES[k].manzana;
  return [desde, B.frentePuertaDe(i, j), B.puertaDe(i, j)];
};
const sube = (p: V3, y: number): V3 => [p[0], y, p[2]];

// La calle se ve de lado: así cabe de arriba abajo en el vídeo vertical.
const LADO: V3 = [26, 34, 12];
const DE_FRENTE: V3 = [12, 22, 24];
const vista = (mira: V3, orto: number, dir: V3 = LADO): Camara => ({ posicion: [mira[0] + dir[0], mira[1] + dir[1], mira[2] + dir[2]], mira, orto });
const CENTRO_CALLE: V3 = [0, 0, CASA[2]];

/** Gente que pasa por la calle, para que no parezca un decorado. */
const Paseantes: React.FC<{ desde: number }> = ({ desde }) => {
  const frame = useCurrentFrame();
  const quienes: { semilla: string; ruta: V3[]; dur: number; retraso: number }[] = [
    { semilla: "p1", ruta: [TRABAJO, CASA].map((p) => [p[0], 0, p[2] + 0.7] as V3), dur: 260, retraso: 0 },
    { semilla: "p2", ruta: [B.cruce(2, 4), B.cruce(2, 2)], dur: 150, retraso: 40 },
    { semilla: "p3", ruta: [B.cruce(1, 2), B.cruce(1, 4)], dur: 160, retraso: 90 },
  ];
  return (
    <>
      {quienes.map((q) => {
        const r = enRecorrido(frame, q.ruta, desde + q.retraso, q.dur);
        return <Persona key={q.semilla} {...r} semilla={q.semilla} escala={0.95} />;
      })}
    </>
  );
};

/** Pedir, pagar e irse: sin sitio donde quedarse. */
const ParaLlevar: React.FC = () => {
  const frame = useCurrentFrame();
  const [i, j] = CAFES[SUYA].manzana;
  const puerta = B.puertaDe(i, j);
  const frente = B.frentePuertaDe(i, j);
  const desde = h.en("llevar");
  const llega = h.palabra("llevar", "Pides,") - 4;
  const sale = h.palabra("llevar", "vas.") - 8;
  const ida = enRecorrido(frame, [[frente[0] - 7, 0, frente[2]], frente, puerta], desde, llega - desde);
  const vuelta = enRecorrido(frame, [puerta, frente, [frente[0] + 8, 0, frente[2]]], sale, 70);
  const r = frame < sale ? ida : vuelta;
  const camara = camaraEn(frame, [
    { en: desde, camara: vista([puerta[0] - 1.5, 0.6, puerta[2]], 8, DE_FRENTE) },
    { en: h.en("calle"), camara: vista([puerta[0] + 1, 0.6, puerta[2]], 7, DE_FRENTE) },
  ]);
  const cabeza = sube(r.en, 1.45);
  return (
    <AbsoluteFill>
      <Escena camara={camara} alcanceSombra={14}>
        <Barrio columnas={4} filas={4} cafe={[2, 2]} otros={OTROS}>
          <Persona {...r} semilla="cliente" ropa={ROPA} escala={0.95} />
        </Barrio>
      </Escena>
      {[
        { texto: "Pides", palabra: "Pides," },
        { texto: "Pagas", palabra: "pagas" },
        { texto: "Te vas", palabra: "vas." },
      ].map((b, k, todos) => (
        <SobreEscena key={b.texto} camara={camara} punto={cabeza}>
          <Bocadillo texto={b.texto} desde={h.palabra("llevar", b.palabra) - 2} hasta={k < todos.length - 1 ? h.palabra("llevar", todos[k + 1].palabra) - 2 : h.en("calle")} fondo={k === 2 ? P.camel : P.espresso} tam={50} />
        </SobreEscena>
      ))}
      <Aparece desde={h.en("llevar")} sube={20} style={{ position: "absolute", left: 64, top: 240 }}>
        <Etiqueta texto="Para llevar" tam={44} fondo={P.espresso} />
      </Aparece>
    </AbsoluteFill>
  );
};

/** Lo que hace cada día, según la escena: a qué café va. */
const DIAS_SIN = [
  { dia: "Lunes", cafe: 0 },
  { dia: "Martes", cafe: 3 },
  { dia: "Miércoles", cafe: 1 },
];
const DIAS_CON = [
  { dia: "Jueves", cafe: SUYA },
  { dia: "Viernes", cafe: SUYA },
];

const LaCalle: React.FC = () => {
  const frame = useCurrentFrame();
  const calle = h.en("calle");
  const cambiar = h.en("cambiar");
  const finCambiar = h.en("habito");
  const tramoDia = Math.round((finCambiar - cambiar) / DIAS_SIN.length);
  const dia = Math.min(DIAS_SIN.length - 1, Math.max(0, Math.floor((frame - cambiar) / tramoDia)));
  const empieza = cambiar + dia * tramoDia;
  const r = frame < cambiar ? { en: CASA, giro: Math.PI / 2, fase: 0, andando: false } : enRecorrido(frame, viaje(DIAS_SIN[dia].cafe), empieza, tramoDia - 10);
  const llegado = frame >= cambiar && frame >= empieza + tramoDia - 10;
  const camara = camaraEn(frame, [
    { en: calle - 6, camara: vista(CENTRO_CALLE, 30) },
    { en: cambiar, camara: vista(CENTRO_CALLE, 27) },
    { en: finCambiar, camara: vista(CENTRO_CALLE, 26) },
  ]);
  return (
    <AbsoluteFill>
      <Escena camara={camara} alcanceSombra={22} niebla={[70, 120]}>
        <Barrio columnas={4} filas={4} cafe={[2, 2]} otros={OTROS}>
          <Persona {...r} semilla="cliente" ropa={ROPA} escala={1.45} />
          <Aro en={r.en} color={ROPA} radio={1.05} />
          <Paseantes desde={calle} />
        </Barrio>
      </Escena>
      <SobreEscena camara={camara} punto={sube(CASA, 0.3)}>
        <Bocadillo texto="Casa" desde={calle} fondo={P.vison} tam={40} />
      </SobreEscena>
      <SobreEscena camara={camara} punto={sube(TRABAJO, 0.3)}>
        <Bocadillo texto="Trabajo" desde={calle + 6} fondo={P.vison} tam={40} />
      </SobreEscena>
      {CAFES.map((c, k) => {
        const hoy = llegado && DIAS_SIN[dia].cafe === k;
        return (
          <SobreEscena key={c.nombre} camara={camara} punto={[B.centro(...c.manzana)[0] + 1, 2.2, B.centro(...c.manzana)[2] + 1]}>
            <div style={{ transform: `scale(${hoy ? 1.35 : 1})`, transformOrigin: "bottom center" }}>
              <Bocadillo texto={c.nombre} desde={h.palabra("calle", "tres") - 8 + k * 5} fondo={c.toldo} tam={38} />
            </div>
          </SobreEscena>
        );
      })}
      {frame >= cambiar && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 228, display: "flex", justifyContent: "center" }}>
          <Etiqueta key={dia} texto={DIAS_SIN[dia].dia} tam={52} fondo={P.espresso} />
        </div>
      )}
      {CAFES.map((c, k) => (
        <Efecto key={c.nombre} sonido="pop" en={h.palabra("calle", "tres") - 8 + k * 5} volumen={0.3} />
      ))}
      {DIAS_SIN.map((d, k) => (
        <React.Fragment key={d.dia}>
          <Efecto sonido="tic" en={cambiar + k * tramoDia} volumen={0.4} />
          <Efecto sonido="pop" en={cambiar + (k + 1) * tramoDia - 10} volumen={0.35} />
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};

const Costumbre: React.FC = () => {
  const cuarenta = h.palabra("habito", "mitad");
  return (
    <ZonaEscena gap={40}>
      <Aparece desde={h.en("habito")} sube={20}>
        <div style={{ fontSize: TAM.titulo, fontWeight: 750, letterSpacing: "-0.035em", textAlign: "center" }}>Solo te ata la costumbre</div>
      </Aparece>
      <DeCada100 valor={43} desde={cuarenta - 6} dur={h.fin("habito") - cuarenta} ancho={420} color={P.verde} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
        <Contador a={43} desde={cuarenta - 6} duracion={h.fin("habito") - cuarenta} despues=" %" style={{ fontSize: 130, fontWeight: 800, color: P.verde, letterSpacing: "-0.04em", lineHeight: 1 }} />
        <div style={{ fontSize: TAM.nota, fontWeight: 650, color: P.vison, lineHeight: 1.15 }}>
          de lo que hacemos
          <br />
          cada día
        </div>
      </div>
      <Cita texto="Wood, Quinn y Kashy, 2002" desde={cuarenta} />
      <Efecto sonido="ding" en={h.fin("habito")} volumen={0.5} />
    </ZonaEscena>
  );
};

/** Con la cartilla a medias, todos los días a la misma. */
const LaMia: React.FC = () => {
  const frame = useCurrentFrame();
  const desde = h.en("tarjeta");
  const fin = h.en("remate");
  const tramoDia = Math.round((fin - desde) / DIAS_CON.length);
  const dia = Math.min(DIAS_CON.length - 1, Math.max(0, Math.floor((frame - desde) / tramoDia)));
  // Pasa por delante de Grano sin entrar y va a la suya.
  const antes = B.frentePuertaDe(...CAFES[1].manzana);
  const inicio: V3 = [antes[0] - 3, 0, antes[2]];
  const r = enRecorrido(frame, viaje(SUYA, inicio), desde + 8 + dia * tramoDia, tramoDia - 18);
  const [i, j] = CAFES[SUYA].manzana;
  const puerta = B.puertaDe(i, j);
  const medio: V3 = [(antes[0] + puerta[0]) / 2, 0, puerta[2] + 0.5];
  const camara = camaraEn(frame, [
    { en: desde, camara: vista(medio, 14) },
    { en: fin, camara: vista(medio, 12.5) },
  ]);
  const mia = h.palabra("tarjeta", "mía».");
  return (
    <AbsoluteFill>
      <Escena camara={camara} alcanceSombra={18} niebla={[70, 120]}>
        <Barrio columnas={4} filas={4} cafe={[2, 2]} otros={OTROS}>
          <Persona {...r} semilla="cliente" ropa={ROPA} escala={1.3} />
          <Aro en={r.en} color={ESTADO.viene} radio={0.9} />
        </Barrio>
      </Escena>
      <SobreEscena camara={camara} punto={sube(r.en, 1.95)}>
        <div style={{ opacity: tramo(frame, desde + 4, 8) * (1 - tramo(frame, mia - 8, 6)), transform: `scale(${0.6 + 0.4 * tramo(frame, desde + 4, 8)})`, transformOrigin: "bottom center", filter: "drop-shadow(0 10px 20px rgba(31,24,18,.3))" }}>
          <Tarjeta meta={10} puntos={5 + dia} ancho={300} />
        </div>
      </SobreEscena>
      <SobreEscena camara={camara} punto={[puerta[0], 2.4, puerta[2] - 1]}>
        <Bocadillo texto="La mía" desde={mia - 2} fondo={VERDE_TOLDO} tam={50} />
      </SobreEscena>
      <div style={{ position: "absolute", left: 0, right: 0, top: 228, display: "flex", justifyContent: "center" }}>
        <Etiqueta key={dia} texto={DIAS_CON[dia].dia} tam={52} fondo={P.espresso} />
      </div>
      <Efecto sonido="pop" en={desde + 4} volumen={0.4} />
      <Efecto sonido="ding" en={mia - 2} volumen={0.5} />
    </AbsoluteFill>
  );
};

const Remate: React.FC = () => (
  <ZonaEscena gap={44} alinear="flex-start">
    <Titular texto="Si no tienes sillas," desde={h.palabra("remate", "Si")} cadencia={3} color={P.avena} tam={TAM.titulo} />
    <Titular texto="dales otra cosa a la que volver." desde={h.palabra("remate", "dales")} cadencia={3} color={P.papel} tam={TAM.gancho} resaltar={["volver."]} colorResalte={P.avena} tintaResalte={P.espresso} />
    <Efecto sonido="pop" en={h.palabra("remate", "volver.")} volumen={0.5} />
  </ZonaEscena>
);

export const CafesSinSillas: React.FC<{ guia?: boolean }> = ({ guia = false }) => (
  <Marco guia={guia} grano={false}>
    <Locucion horario={h} />
    <Ventana desde={0} hasta={h.en("tercer")} entra={0}>
      <ConSillas />
    </Ventana>
    <Ventana desde={h.en("tercer")} hasta={h.en("llevar")} paso="barrido" deriva={0.04}>
      <TercerLugar />
    </Ventana>
    <Ventana desde={h.en("llevar")} hasta={h.en("calle")} paso="zoom" sale={0}>
      <ParaLlevar />
    </Ventana>
    <Ventana desde={h.en("calle")} hasta={h.en("habito")} entra={6}>
      <LaCalle />
    </Ventana>
    <Ventana desde={h.en("habito")} hasta={h.en("tarjeta")} paso="barrido" deriva={0.04}>
      <Costumbre />
    </Ventana>
    <Ventana desde={h.en("tarjeta")} hasta={h.en("remate")} paso="zoom">
      <LaMia />
    </Ventana>
    <Ventana desde={h.en("remate")} hasta={FINAL} paso="zoom" sale={0} deriva={0.03} style={{ background: P.verde }}>
      <Remate />
    </Ventana>
    <Marca desde={FINAL} />
    <Subtitulos horario={h} sin={["remate"]} />
  </Marco>
);

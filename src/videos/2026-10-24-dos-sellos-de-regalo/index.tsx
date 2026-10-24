import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Marco } from "../../comun/Marco";
import { Locucion, Subtitulos, crearHorario } from "../../comun/Locucion";
import { Ventana, ZonaEscena } from "../../comun/Ventana";
import { Aparece } from "../../comun/Aparece";
import { Etiqueta } from "../../comun/Etiqueta";
import { Titular } from "../../comun/Titular";
import { Contador } from "../../comun/Contador";
import { Cita } from "../../comun/Cita";
import { Tarjeta } from "../../comun/Tarjeta";
import { Marca } from "../../comun/Cierre";
import { Efecto } from "../../comun/Efecto";
import { entrada, tramo } from "../../comun/movimiento";
import { CartillaCarton, casillaDe } from "../../flat/CartillaCarton";
import { SelloGoma } from "../../flat/SelloGoma";
import { Lavadero } from "../../flat/Lavadero";
import { DeCada100 } from "../../flat/DeCada100";
import { Barras } from "../../flat/Barras";
import { P, TAM } from "../../marca";
import guion from "./locucion.json";
import tiempos from "./tiempos.json";

// ============================================================================
// DOS SELLOS DE REGALO (flat, voz de Álvaro)
// El efecto del progreso dotado (Nunes y Drèze, 2006): en un lavadero, la cartilla
// de 10 con 2 sellos regalados se completó casi el doble que la de 8 vacía, y eso
// que las dos pedían 8 lavados. En un café (Kivetz, Urminsky y Zheng, 2006), la de
// 12 con 2 de regalo se llenaba casi tres días antes. Contenido, no anuncio: fiddle
// solo sale al final, un segundo y medio.
// ============================================================================

const h = crearHorario(guion, tiempos, { cola: 1.9 });
export const DURACION = h.total;
export const HORARIO = h;
const FINAL = h.fin("remate") + 8;

const LAVADERO = { leyenda: "8 lavados y el siguiente, gratis", nombre: "Lavado Express", motivo: "coche" as const, ultimaGratis: false };

/** Una cartilla que entra girando un poco, con su letra encima. */
const ConLetra: React.FC<{ letra: string; color: string; desde: number; giro?: number; children: React.ReactNode }> = ({ letra, color, desde, giro = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = entrada(frame, fps, desde);
  return (
    <div style={{ position: "relative", transform: `translateY(${(1 - e) * 300}px) rotate(${giro * e + (1 - e) * giro * 4}deg)`, opacity: Math.min(1, e * 2) }}>
      {children}
      <div style={{ position: "absolute", left: -18, top: -30, width: 76, height: 76, borderRadius: 38, background: color, color: P.papel, fontSize: 46, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(31,24,18,.25)" }}>{letra}</div>
    </div>
  );
};

const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cocheX = interpolate(frame, [0, 46], [-120, 450], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const cartillas = h.palabra("gancho", "cartillas") - 2;
  const una = h.palabra("gancho", "Una");
  const doble = h.palabra("gancho", "doble");
  const duda = entrada(frame, fps, una);
  const tiembla = frame >= doble && frame < doble + 14 ? Math.sin(frame * 2.2) * 5 : 0;
  return (
    <ZonaEscena gap={40}>
      <div style={{ width: 866, display: "flex", justifyContent: "center", marginTop: -40 }}>
        <Lavadero ancho={1250} cocheX={cocheX} />
      </div>
      <div style={{ display: "flex", gap: 46, transform: `rotate(${tiembla * 0.3}deg)` }}>
        {[
          { letra: "A", color: P.camel, total: 8, marcados: 0, giro: -4 },
          { letra: "B", color: P.verde, total: 10, marcados: 2, giro: 4 },
        ].map((c, i) => (
          <div key={c.letra} style={{ position: "relative" }}>
            <ConLetra letra={c.letra} color={c.color} desde={cartillas + i * 5} giro={c.giro}>
              <CartillaCarton {...LAVADERO} total={c.total} marcados={c.marcados} ancho={400} semilla={`gancho-${c.letra}`} />
            </ConLetra>
            <div style={{ position: "absolute", left: 0, right: 0, top: -140, textAlign: "center", fontSize: 130, fontWeight: 800, color: c.color, opacity: duda, transform: `scale(${0.4 + 0.6 * duda}) rotate(${Math.sin((frame + i * 20) / 7) * 8}deg)` }}>?</div>
          </div>
        ))}
      </div>
      <Efecto sonido="zas" en={0} volumen={0.3} />
      <Efecto sonido="pop" en={cartillas} volumen={0.4} />
      <Efecto sonido="pop" en={cartillas + 5} volumen={0.4} />
      <Efecto sonido="tic" en={una} volumen={0.5} />
    </ZonaEscena>
  );
};

const Vacia: React.FC = () => (
  <ZonaEscena gap={56}>
    <ConLetra letra="A" color={P.camel} desde={h.en("vacia") + 2} giro={-2}>
      <CartillaCarton {...LAVADERO} total={8} marcados={0} ancho={860} semilla="A" />
    </ConLetra>
    <Aparece desde={h.palabra("vacia", "ocho")}>
      <div style={{ fontSize: 76, fontWeight: 750, letterSpacing: "-0.035em", whiteSpace: "nowrap" }}>
        8 casillas, <span style={{ color: P.camelOscuro }}>0 sellos</span>
      </div>
    </Aparece>
  </ZonaEscena>
);

const Regalo: React.FC = () => {
  const frame = useCurrentFrame();
  const g1 = h.palabra("regalo", "dos");
  const g2 = h.palabra("regalo", "selladas");
  const marcados = frame >= g2 ? 2 : frame >= g1 ? 1 : 0;
  return (
    <ZonaEscena gap={56}>
      <ConLetra letra="B" color={P.verde} desde={h.en("regalo") + 2} giro={2}>
        <div style={{ position: "relative" }}>
          <CartillaCarton {...LAVADERO} total={10} marcados={marcados} ultimoEn={marcados === 2 ? g2 : g1} ancho={860} semilla="B" />
          <SelloGoma {...casillaDe(10, 860, 0)} en={g1} ancho={150} />
          <SelloGoma {...casillaDe(10, 860, 1)} en={g2} ancho={150} />
        </div>
      </ConLetra>
      <Aparece desde={h.palabra("regalo", "regalo.")}>
        <div style={{ fontSize: 76, fontWeight: 750, letterSpacing: "-0.035em", whiteSpace: "nowrap" }}>
          10 casillas, <span style={{ color: P.verde }}>2 de regalo</span>
        </div>
      </Aparece>
      <Efecto sonido="golpe" en={g1} />
      <Efecto sonido="golpe" en={g2} />
    </ZonaEscena>
  );
};

const Igual: React.FC = () => {
  const ocho = h.palabra("igual", "ocho");
  const fila = (letra: string, color: string, total: number, marcados: number, desde: number) => (
    <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
      <ConLetra letra={letra} color={color} desde={desde}>
        <CartillaCarton {...LAVADERO} total={total} marcados={marcados} ancho={540} semilla={`igual-${letra}`} />
      </ConLetra>
      <Aparece desde={ocho} escala={0.6}>
        <div style={{ fontSize: 64, fontWeight: 800, color, lineHeight: 1, letterSpacing: "-0.03em", textAlign: "center" }}>
          8<div style={{ fontSize: TAM.nota, fontWeight: 650 }}>lavados</div>
        </div>
      </Aparece>
    </div>
  );
  return (
    <ZonaEscena gap={30}>
      {fila("A", P.camel, 8, 0, h.en("igual"))}
      <Aparece desde={ocho + 6} escala={0.3}>
        <div style={{ fontSize: 150, fontWeight: 800, color: P.espresso, lineHeight: 0.8 }}>=</div>
      </Aparece>
      {fila("B", P.verde, 10, 2, h.en("igual") + 4)}
      <Efecto sonido="pop" en={ocho} volumen={0.5} />
      <Efecto sonido="pop" en={ocho + 6} volumen={0.4} />
    </ZonaEscena>
  );
};

const Meses: React.FC = () => {
  // Cada cifra cuenta mientras se dice y acaba justo en su número.
  const a = h.palabra("meses", "completado");
  const finA = h.palabra("meses", "diecinueve") + 8;
  const b = h.palabra("meses", "regalo,");
  const finB = h.palabra("meses", "cuatro.") + 4;
  const columna = (letra: string, texto: string, color: string, valor: number, en: number, hasta: number) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: TAM.nota, fontWeight: 650, color: P.vison }}>
        <span style={{ width: 54, height: 54, borderRadius: 27, background: color, color: P.papel, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>{letra}</span>
        {texto}
      </div>
      <DeCada100 valor={valor} desde={en} dur={hasta - en} ancho={370} color={color} />
      <Contador a={valor} desde={en} duracion={hasta - en} despues=" %" style={{ fontSize: 120, fontWeight: 800, color, letterSpacing: "-0.04em", lineHeight: 1 }} />
    </div>
  );
  return (
    <ZonaEscena gap={44}>
      <Aparece desde={h.en("meses")}>
        <div style={{ fontSize: TAM.texto, fontWeight: 700, letterSpacing: "-0.03em" }}>Los que llegaron al premio</div>
      </Aparece>
      <div style={{ display: "flex", gap: 70 }}>
        {columna("A", "vacía", P.camel, 19, a, finA)}
        {columna("B", "2 de regalo", P.verde, 34, b, finB)}
      </div>
      <Cita texto="Nunes y Drèze, 2006" desde={h.en("meses") + 10} />
      <Efecto sonido="tic" en={finA} volumen={0.5} />
      <Efecto sonido="ding" en={finB} volumen={0.6} />
    </ZonaEscena>
  );
};

/** Una barra de diez trozos: dos llenos y los demás que «piden» que los llenes. */
const Empezado: React.FC<{ llenos: number; desde: number; pide: number }> = ({ llenos, desde, pide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", gap: 12 }}>
      {Array.from({ length: 10 }, (_, i) => {
        const lleno = i < llenos;
        const e = lleno ? entrada(frame, fps, desde + i * 5) : 0;
        const pulso = !lleno && frame >= pide ? Math.max(0, Math.sin(((frame - pide) / 4 - (i - llenos) * 0.7) * 1)) : 0;
        return <div key={i} style={{ width: 70, height: 110, borderRadius: 18, background: lleno ? P.avena : "transparent", border: `5px solid ${lleno ? P.avena : "rgba(214,192,165,.4)"}`, transform: `scaleY(${lleno ? 0.7 + 0.3 * e : 1 + pulso * 0.12})`, opacity: lleno ? 0.3 + 0.7 * e : 0.6 + 0.4 * pulso }} />;
      })}
    </div>
  );
};

const Nombre: React.FC = () => (
  <ZonaEscena gap={70} alinear="flex-start">
    <Titular texto="El efecto del progreso dotado" desde={h.en("nombre") + 2} color={P.papel} tam={TAM.gancho} resaltar={["dotado"]} colorResalte={P.avena} tintaResalte={P.espresso} />
    <Empezado llenos={2} desde={h.palabra("nombre", "empezado")} pide={h.palabra("nombre", "medias.") - 6} />
    <Cita texto="Nunes y Drèze, 2006" desde={h.en("nombre") + 14} oscuro />
    <Efecto sonido="pop" en={h.palabra("nombre", "empezado")} volumen={0.4} />
  </ZonaEscena>
);

const Cafe: React.FC = () => {
  const frame = useCurrentFrame();
  const sellos = frame >= h.palabra("cafe", "sellos") ? 2 : 0;
  return (
    <ZonaEscena gap={44}>
      <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
        <Aparece desde={h.en("cafe")} sube={20}>
          <Etiqueta texto="Nueva York" tam={40} fondo={P.espresso} />
        </Aparece>
        <Aparece desde={h.en("cafe") + 5} sube={20}>
          <Etiqueta texto="Café" tam={40} fondo={P.camel} />
        </Aparece>
      </div>
      <Aparece desde={h.en("cafe") + 4} escala={0.85}>
        <CartillaCarton total={12} marcados={sellos} ultimoEn={sellos ? h.palabra("cafe", "sellos") : undefined} ancho={780} nombre="Café del campus" leyenda="10 cafés y el siguiente, gratis" ultimaGratis={false} semilla="cafe" />
      </Aparece>
      <Barras
        ancho={866}
        tam={44}
        maximo={15.6}
        decimales={1}
        despues=" días"
        desde={h.palabra("cafe", "completaban")}
        cadencia={10}
        barras={[
          { etiqueta: "Sin regalo, en llenarla", valor: 15.6, color: P.camel },
          { etiqueta: "Con 2 de regalo", valor: 12.7, color: P.verde },
        ]}
      />
      <Cita texto="Kivetz, Urminsky y Zheng, 2006" desde={h.en("cafe") + 12} />
      <Efecto sonido="golpe" en={h.palabra("cafe", "sellos")} volumen={0.6} />
    </ZonaEscena>
  );
};

const Remate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = entrada(frame, fps, h.en("remate"));
  return (
    <ZonaEscena gap={60} alinear="flex-start">
      <div style={{ alignSelf: "center", transform: `translateY(${(1 - e) * 200}px) rotate(${-3 + Math.sin(frame / 18) * 2}deg) scale(${0.8 + 0.2 * e})`, opacity: e }}>
        <Tarjeta meta={10} puntos={2} ancho={680} />
      </div>
      <Titular texto="No es un detalle." desde={h.palabra("remate", "no")} cadencia={3} color={P.avena} tam={TAM.titulo} />
      <Titular texto="Es psicología." desde={h.palabra("remate", "Es")} cadencia={4} color={P.papel} tam={TAM.gancho} resaltar={["psicología."]} colorResalte={P.avena} tintaResalte={P.espresso} />
      <Efecto sonido="pop" en={h.palabra("remate", "Es")} />
    </ZonaEscena>
  );
};

export const DosSellosDeRegalo: React.FC<{ guia?: boolean }> = ({ guia = false }) => {
  return (
    <Marco guia={guia}>
      <Locucion horario={h} />
      <Ventana desde={0} hasta={h.en("vacia")} entra={0} deriva={0.03}>
        <Gancho />
      </Ventana>
      <Ventana desde={h.en("vacia")} hasta={h.en("regalo")} paso="barrido" deriva={0.04}>
        <Vacia />
      </Ventana>
      <Ventana desde={h.en("regalo")} hasta={h.en("igual")} paso="barrido" deriva={0.04}>
        <Regalo />
      </Ventana>
      <Ventana desde={h.en("igual")} hasta={h.en("meses")} paso="zoom" deriva={0.03}>
        <Igual />
      </Ventana>
      <Ventana desde={h.en("meses")} hasta={h.en("nombre")} paso="barrido" deriva={0.03}>
        <Meses />
      </Ventana>
      <Ventana desde={h.en("nombre")} hasta={h.en("cafe")} paso="zoom" entra={10} deriva={0.04} style={{ background: P.espresso }}>
        <Nombre />
      </Ventana>
      <Ventana desde={h.en("cafe")} hasta={h.en("remate")} paso="barrido" deriva={0.03}>
        <Cafe />
      </Ventana>
      <Ventana desde={h.en("remate")} hasta={FINAL} paso="zoom" deriva={0.03} sale={0} style={{ background: P.verde }}>
        <Remate />
      </Ventana>
      <Marca desde={FINAL} />
      <Subtitulos horario={h} sin={["remate"]} />
    </Marco>
  );
};

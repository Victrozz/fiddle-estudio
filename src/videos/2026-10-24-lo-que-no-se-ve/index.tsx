import React from "react";
import { Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { Marco } from "../../comun/Marco";
import { Locucion, Subtitulos, crearHorario } from "../../comun/Locucion";
import { Ventana, ZonaEscena } from "../../comun/Ventana";
import { Aparece } from "../../comun/Aparece";
import { Etiqueta } from "../../comun/Etiqueta";
import { Titular } from "../../comun/Titular";
import { Cita } from "../../comun/Cita";
import { Tarjeta, avisoDeTarjeta } from "../../comun/Tarjeta";
import { PantallaBloqueo } from "../../comun/PantallaBloqueo";
import { MovilGrande, AvisoGrande, puntoDelMovil } from "../../comun/MovilGrande";
import { Marca } from "../../comun/Cierre";
import { Efecto } from "../../comun/Efecto";
import { entrada, tramo } from "../../comun/movimiento";
import { Cajon, Cartera, Lavadora, Ojo } from "../../flat/Escondites";
import { P, TAM } from "../../marca";
import guion from "./locucion.json";
import tiempos from "./tiempos.json";

// ============================================================================
// LO QUE NO SE VE (flat, voz de Álvaro)
// La cartilla de cartón se pierde porque no se ve. El efecto de mera exposición
// (Zajonc, 1968): lo que más vemos nos parece mejor. Y el móvil es lo que más
// miramos: una tarjeta ahí está al lado de la del banco y cada punto sale en la
// pantalla. Contenido, no anuncio: fiddle solo al final.
// ============================================================================

const h = crearHorario(guion, tiempos, { cola: 1.9 });
export const DURACION = h.total;
export const HORARIO = h;
const FINAL = h.fin("remate") + 8;

// --- ¿dónde está? --------------------------------------------------------------

const Lupa: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width={220} height={220} viewBox="0 0 100 100" style={{ position: "absolute", left: x - 70, top: y - 70, overflow: "visible" }}>
    <circle cx={32} cy={32} r={24} fill="rgba(248,243,236,.12)" stroke={P.avena} strokeWidth={7} />
    <line x1={50} y1={50} x2={82} y2={82} stroke={P.avena} strokeWidth={11} strokeLinecap="round" />
  </svg>
);

const Donde: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / 22;
  const exacto = h.en("exacto");
  const niIdea = h.palabra("exacto", "Ni");
  const sale = 1 - tramo(frame, exacto - 6, 8);
  const ni = entrada(frame, fps, niIdea);
  return (
    <ZonaEscena gap={40} alinear="flex-start">
      <div style={{ opacity: sale, transform: `translateY(${(1 - sale) * -40}px)` }}>
        <Titular texto="¿Dónde está tu cartilla?" desde={-4} cadencia={3} color={P.papel} tam={TAM.gancho} resaltar={["cartilla?"]} colorResalte={P.avena} tintaResalte={P.espresso} />
      </div>
      {frame < exacto && <Lupa x={430 + Math.sin(t) * 300} y={720 + Math.sin(t * 2) * 120} />}
      {frame >= exacto && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Titular texto="Exacto." desde={exacto} color={P.avena} tam={TAM.titulo} alinear="center" />
          <div style={{ fontSize: 190, fontWeight: 800, letterSpacing: "-0.05em", color: P.papel, opacity: ni, transform: `scale(${0.6 + 0.4 * ni}) rotate(${(1 - ni) * -6}deg)` }}>Ni idea.</div>
          <div style={{ position: "relative", width: 700, height: 160 }}>
            {[0, 1, 2].map((i) => {
              const e = entrada(frame, fps, niIdea + 6 + i * 4);
              return <div key={i} style={{ position: "absolute", left: 120 + i * 200, top: (i % 2) * 40, fontSize: 120, fontWeight: 800, color: P.camel, opacity: e, transform: `scale(${e}) rotate(${Math.sin((frame + i * 13) / 6) * 14}deg)` }}>?</div>;
            })}
          </div>
        </div>
      )}
      <Efecto sonido="pop" en={niIdea} />
    </ZonaEscena>
  );
};

const ESCONDITES = [
  { palabra: "cajón,", texto: "El cajón", Dibujo: Cajon },
  { palabra: "cartera,", texto: "Otra cartera", Dibujo: Cartera },
  { palabra: "pantalón", texto: "La lavadora", Dibujo: Lavadora },
];

const Escondites: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cuando = ESCONDITES.map((e) => h.palabra("donde", e.palabra) - 4);
  return (
    <ZonaEscena>
      <div style={{ position: "relative", width: 866, height: 760 }}>
        {ESCONDITES.map(({ texto, Dibujo }, i) => {
          if (frame < cuando[i]) return null;
          const entra = entrada(frame, fps, cuando[i]);
          const va = i < ESCONDITES.length - 1 ? tramo(frame, cuando[i + 1] - 2, 10, Easing.in(Easing.cubic)) : 0;
          if (va >= 1) return null;
          return (
            <div key={texto} style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30, opacity: Math.min(1, entra * 2) * (1 - va), transform: `translateX(${(1 - entra) * 500 - va * 600}px) rotate(${(1 - entra) * 8 - va * 6}deg)` }}>
              <Dibujo ancho={700} />
              <Etiqueta texto={texto} tam={48} fondo={P.espresso} />
            </div>
          );
        })}
      </div>
      {cuando.map((c, i) => (
        <Efecto key={i} sonido="zas" en={c} volumen={0.25} />
      ))}
    </ZonaEscena>
  );
};

const Regla: React.FC = () => {
  const frame = useCurrentFrame();
  const cierra = tramo(frame, h.palabra("regla", "ve,") - 4, 8);
  return (
    <ZonaEscena gap={60}>
      <Ojo tam={340} cierre={cierra} />
      <div>
        <Titular texto="Lo que no se ve," desde={h.palabra("regla", "lo")} cadencia={3} tam={TAM.titulo} alinear="center" />
        <Titular texto="no se usa." desde={h.palabra("regla", "no") + 10} cadencia={3} tam={TAM.gancho} alinear="center" resaltar={["usa."]} style={{ marginTop: 16 }} />
      </div>
    </ZonaEscena>
  );
};

// --- Zajonc -------------------------------------------------------------------
// Palabras inventadas, como las de su experimento: no significan nada.
const PALABRAS = ["KADIRGA", "NANSOMA", "BIWOJNI", "CIVADRA", "ZABULON", "LOKANTA"];

const Ficha: React.FC<{ palabra: string; encendida?: boolean; ancho?: number }> = ({ palabra, encendida = true, ancho = 400 }) => (
  <div style={{ width: ancho, height: 220, borderRadius: 26, background: encendida ? P.espresso : "rgba(31,24,18,.08)", color: P.papel, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, fontWeight: 800, letterSpacing: "0.06em", boxShadow: encendida ? "0 14px 30px rgba(31,24,18,.25)" : "none" }}>
    {encendida ? palabra : ""}
  </div>
);

const Zajonc: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const veces = h.en("veces");
  const una = h.palabra("veces", "Unas,");
  const muchas = h.palabra("veces", "Otras,");
  const finMuchas = h.fin("veces");
  // 25 destellos entre «Otras» y el final de la frase.
  const destellos = Array.from({ length: 25 }, (_, i) => Math.round(muchas + (i * (finMuchas - muchas)) / 24));
  const cuenta = destellos.filter((f) => frame >= f).length;
  const encendida = cuenta > 0 && destellos.some((f) => frame >= f && frame < f + 2);
  const gusta = h.palabra("resultado", "mejor");
  const efecto = h.palabra("resultado", "efecto");
  const columna = (palabra: string, n: number, valor: number, color: string, viva: boolean, cuentaDe: string) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <Ficha palabra={palabra} ancho={400} encendida={viva} />
      <div style={{ fontSize: 80, fontWeight: 800, color, letterSpacing: "-0.04em", lineHeight: 1 }}>{cuentaDe}</div>
      <div style={{ width: 400, height: 46, borderRadius: 23, background: "rgba(96,84,75,.15)", overflow: "hidden", opacity: tramo(frame, gusta - 8, 8) }}>
        <div style={{ height: "100%", width: `${valor * 100 * tramo(frame, gusta, 24)}%`, background: color, borderRadius: 23 }} />
      </div>
    </div>
  );
  return (
    <ZonaEscena gap={46}>
      <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
        <Aparece desde={h.en("zajonc")} sube={20}>
          <Etiqueta texto="1968" tam={44} fondo={P.espresso} />
        </Aparece>
        <Cita texto="Robert Zajonc, 1968" desde={h.en("zajonc") + 6} />
      </div>
      {frame < veces ? (
        <Aparece desde={h.en("zajonc") + 10} escala={0.7}>
          <Ficha palabra={PALABRAS[Math.floor(Math.max(0, frame - h.en("zajonc") - 10) / 8) % PALABRAS.length]} ancho={600} />
        </Aparece>
      ) : (
        <div style={{ display: "flex", gap: 66 }}>
          {/* Se ve UNA vez; al puntuar, las dos a la vista. */}
          {columna("KADIRGA", 1, 0.38, P.camel, (frame >= una && frame < una + 14) || frame >= h.en("resultado"), frame >= una ? "×1" : "")}
          {columna("NANSOMA", 25, 0.86, P.verde, frame < muchas ? false : frame >= finMuchas ? true : encendida, cuenta ? `×${cuenta}` : "")}
        </div>
      )}
      {frame >= gusta - 8 && (
        <Aparece desde={gusta - 8} sube={20}>
          <div style={{ fontSize: TAM.nota, fontWeight: 650, color: P.vison }}>Cuánto les gustaba</div>
        </Aparece>
      )}
      {frame >= efecto - 2 && <Titular texto="Efecto de mera exposición" desde={efecto - 2} cadencia={3} tam={76} alinear="center" resaltar={["exposición"]} />}
      {destellos.map((f, i) => (
        <Efecto key={i} sonido="tic" en={f} volumen={0.22} />
      ))}
      <Efecto sonido="pop" en={una} volumen={0.4} />
      <Efecto sonido="ding" en={efecto} volumen={0.5} />
    </ZonaEscena>
  );
};

// --- el móvil -------------------------------------------------------------------

const ARRIBA_MOVIL = 430;

const LoMiras: React.FC = () => {
  const frame = useCurrentFrame();
  const desde = h.en("movil");
  // Se enciende una y otra vez, cada vez más seguido: así se mira un móvil.
  const veces = Array.from({ length: 14 }, (_, i) => Math.round(desde + 6 + 70 * Math.pow(i / 13, 0.8)));
  const encendida = veces.some((f) => frame >= f && frame < f + 5);
  const cuenta = veces.filter((f) => frame >= f).length;
  return (
    <>
      <div style={{ position: "absolute", left: 64, right: 150, top: 240, display: "flex", alignItems: "center", gap: 18, fontSize: TAM.texto, fontWeight: 750, letterSpacing: "-0.03em" }}>
        Hoy:
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", width: 640 }}>
          {Array.from({ length: cuenta }, (_, i) => (
            <div key={i} style={{ width: 10, height: 60, borderRadius: 5, background: P.verde, transform: (i + 1) % 5 === 0 ? "rotate(60deg) translateY(-6px)" : undefined, marginLeft: (i + 1) % 5 === 0 ? -40 : 0, marginRight: (i + 1) % 5 === 0 ? 30 : 0 }} />
          ))}
        </div>
      </div>
      <MovilGrande desde={desde} arriba={ARRIBA_MOVIL}>
        <PantallaBloqueo />
        <div style={{ position: "absolute", inset: 0, background: "#000", opacity: encendida ? 0 : 0.86 }} />
      </MovilGrande>
      {veces.map((f, i) => (
        <Efecto key={i} sonido="tic" en={f} volumen={0.18} />
      ))}
    </>
  );
};

const TarjetaBanco: React.FC = () => (
  <div style={{ width: 358, height: 226, borderRadius: 16, background: "linear-gradient(135deg, #3a4b57 0%, #1f2a31 100%)", color: "#e8e2da", position: "relative", boxShadow: "0 6px 16px rgba(0,0,0,.35)" }}>
    <div style={{ position: "absolute", left: 20, top: 18, fontSize: 18, fontWeight: 700, letterSpacing: "0.04em" }}>Tu banco</div>
    <div style={{ position: "absolute", left: 22, top: 84, width: 46, height: 36, borderRadius: 7, background: "linear-gradient(135deg, #d9c27a, #a8904a)" }} />
    <div style={{ position: "absolute", left: 20, bottom: 18, fontSize: 18, fontWeight: 600, letterSpacing: "0.12em" }}>•••• 4821</div>
  </div>
);

const AvisoPunto = avisoDeTarjeta({ puntos: 5 });

const EnLaCartera: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tarjeta = entrada(frame, fps, h.palabra("wallet", "tarjeta"));
  const punto = h.palabra("wallet", "punto");
  return (
    <>
      <MovilGrande desde={h.en("wallet") - 4} arriba={300}>
        <div style={{ position: "absolute", inset: 0, background: "#141110", padding: "62px 16px 0", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ color: "#fff", fontSize: 30, fontWeight: 700 }}>Cartera</div>
          <TarjetaBanco />
          <div style={{ transform: `translateY(${(1 - tarjeta) * 300}px)`, opacity: tarjeta }}>
            <Tarjeta puntos={5} ancho={358} />
          </div>
        </div>
      </MovilGrande>
      <AvisoGrande texto={AvisoPunto.texto} desde={punto} arriba={puntoDelMovil(40, { arriba: 300 })} />
      <Efecto sonido="pop" en={h.palabra("wallet", "tarjeta")} volumen={0.4} />
      <Efecto sonido="ding" en={punto} />
    </>
  );
};

const Remate: React.FC = () => (
  <ZonaEscena gap={50} alinear="flex-start">
    <Titular texto="Tu cafetería favorita igual no es la mejor." desde={h.palabra("remate", "Tu")} cadencia={3} color={P.avena} tam={TAM.titulo} />
    <Titular texto="Es la que más ves." desde={h.palabra("remate", "Es")} cadencia={4} color={P.papel} tam={TAM.gancho} resaltar={["ves."]} colorResalte={P.avena} tintaResalte={P.espresso} />
    <Efecto sonido="pop" en={h.palabra("remate", "ves.")} volumen={0.5} />
  </ZonaEscena>
);

export const LoQueNoSeVe: React.FC<{ guia?: boolean }> = ({ guia = false }) => (
  <Marco guia={guia}>
    <Locucion horario={h} />
    <Ventana desde={0} hasta={h.en("donde")} entra={0} deriva={0.03} style={{ background: P.espresso }}>
      <Donde />
    </Ventana>
    <Ventana desde={h.en("donde")} hasta={h.en("regla")} paso="zoom" zas={false} deriva={0.03}>
      <Escondites />
    </Ventana>
    <Ventana desde={h.en("regla")} hasta={h.en("zajonc")} paso="barrido" deriva={0.04} style={{ background: P.crema }}>
      <Regla />
    </Ventana>
    <Ventana desde={h.en("zajonc")} hasta={h.en("movil")} paso="barrido" deriva={0.02}>
      <Zajonc />
    </Ventana>
    <Ventana desde={h.en("movil")} hasta={h.en("wallet")} paso="zoom" deriva={0.02}>
      <LoMiras />
    </Ventana>
    <Ventana desde={h.en("wallet")} hasta={h.en("remate")} paso="funde" entra={4}>
      <EnLaCartera />
    </Ventana>
    <Ventana desde={h.en("remate")} hasta={FINAL} paso="zoom" sale={0} deriva={0.03} style={{ background: P.verde }}>
      <Remate />
    </Ventana>
    <Marca desde={FINAL} />
    <Subtitulos horario={h} sin={["remate"]} />
  </Marco>
);

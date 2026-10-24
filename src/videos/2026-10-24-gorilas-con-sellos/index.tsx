import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Marco } from "../../comun/Marco";
import { Locucion, Subtitulos, crearHorario } from "../../comun/Locucion";
import { Ventana, ZonaEscena } from "../../comun/Ventana";
import { Aparece } from "../../comun/Aparece";
import { Etiqueta } from "../../comun/Etiqueta";
import { Titular } from "../../comun/Titular";
import { Contador } from "../../comun/Contador";
import { Tarjeta } from "../../comun/Tarjeta";
import { Marca } from "../../comun/Cierre";
import { Efecto } from "../../comun/Efecto";
import { entrada, tramo } from "../../comun/movimiento";
import { Gorila } from "../../flat/Gorila";
import { Libreta, LluviaSellos, SelloVerde, VERDE_SELLO } from "../../flat/SellosVerdes";
import { P, TAM } from "../../marca";
import guion from "./locucion.json";
import tiempos from "./tiempos.json";

// ============================================================================
// GORILAS CON SELLOS (flat, voz de Brian)
// La historia de los sellos de fidelidad: los Green Stamps de Sperry & Hutchinson
// (desde 1896), que se pegaban en libretas y se cambiaban por cosas de casa; en los
// sesenta la empresa presumía de imprimir más sellos que Correos de EE. UU.; con la
// crisis de los setenta valían cada vez menos. Lo de los gorilas (un colegio de
// Erie, Pensilvania, 5,4 millones de sellos) lo cuentan The Straight Dope y Antique
// Trader: por eso la voz dice «cuentan que». Contenido, no anuncio.
// ============================================================================

const h = crearHorario(guion, tiempos, { cola: 1.9 });
export const DURACION = h.total;
export const HORARIO = h;
const FINAL = h.fin("remate") + 8;

const Gorilas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cuenta = h.palabra("gancho", "cinco");
  const llegan = h.palabra("gancho", "gorilas");
  const e1 = entrada(frame, fps, llegan - 4);
  const e2 = entrada(frame, fps, llegan + 2);
  const parpadeo = (desfase: number) => ((frame + desfase) % 70 < 4 ? 1 : 0);
  return (
    <>
      <LluviaSellos desde={-20} cantidad={70} alto={1240} dur={cuenta - (-20) + 30} />
      <ZonaEscena gap={30} style={{ justifyContent: "flex-start", paddingTop: 30 }}>
        <div style={{ display: "flex", gap: 16 }}>
          <Aparece desde={2} sube={20}>
            <Etiqueta texto="Pensilvania" tam={44} fondo={P.espresso} />
          </Aparece>
          <Aparece desde={8} sube={20}>
            <Etiqueta texto="Un colegio" tam={44} fondo={VERDE_SELLO} />
          </Aparece>
        </div>
        <div style={{ background: "rgba(248,243,236,.94)", borderRadius: 30, padding: "14px 36px", boxShadow: "0 12px 30px rgba(31,24,18,.18)", textAlign: "center" }}>
          <Contador a={5400000} desde={cuenta - 4} duracion={h.palabra("gancho", "súper…") - cuenta + 10} style={{ fontSize: 110, fontWeight: 800, letterSpacing: "-0.04em", color: VERDE_SELLO }} />
          <div style={{ fontSize: TAM.nota, fontWeight: 650, color: P.vison, marginTop: -6 }}>sellos del súper</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginTop: 30 }}>
          <div style={{ opacity: Math.min(1, e1 * 1.5), transform: `translateY(${(1 - e1) * 300}px)` }}>
            <Gorila tam={330} parpadeo={parpadeo(0)} mira={0.6} />
          </div>
          <div style={{ opacity: Math.min(1, e2 * 1.5), transform: `translateY(${(1 - e2) * 300}px) scaleX(-1)` }}>
            <Gorila tam={280} parpadeo={parpadeo(31)} mira={0.6} />
          </div>
        </div>
      </ZonaEscena>
      <Efecto sonido="pop" en={llegan - 4} />
      <Efecto sonido="pop" en={llegan + 2} />
      <Efecto sonido="ding" en={h.palabra("gancho", "zoo.")} volumen={0.5} />
    </>
  );
};

/** El ticket del que salen los sellos al pagar. */
const Ticket: React.FC = () => (
  <div style={{ width: 300, padding: "26px 28px 34px", background: "#fffdf8", boxShadow: "0 14px 30px rgba(31,24,18,.18)", clipPath: "polygon(0 0, 100% 0, 100% 94%, 90% 100%, 80% 94%, 70% 100%, 60% 94%, 50% 100%, 40% 94%, 30% 100%, 20% 94%, 10% 100%, 0 94%)" }}>
    {[0.9, 0.6, 0.75, 0.5].map((w, i) => (
      <div key={i} style={{ height: 14, width: `${w * 100}%`, background: "#d8d0c6", borderRadius: 7, marginBottom: 16 }} />
    ))}
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, fontWeight: 800, color: P.espresso, marginTop: 10 }}>
      <span>TOTAL</span>
      <span>$4.20</span>
    </div>
  </div>
);

const QueEran: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pagar = h.palabra("quees", "pagar.");
  return (
    <ZonaEscena gap={46}>
      <Aparece desde={h.palabra("quees", "mil") - 2} escala={0.5}>
        <div style={{ fontSize: 210, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.9, color: P.espresso }}>1896</div>
      </Aparece>
      <Titular texto="Green Stamps" desde={h.en("quees") + 2} tam={TAM.titulo} alinear="center" resaltar={["Stamps"]} colorResalte={VERDE_SELLO} />
      <div style={{ position: "relative", height: 400, width: 700 }}>
        <div style={{ position: "absolute", left: 40, top: 30 }}>
          <Aparece desde={h.palabra("quees", "tiendas") - 4} sube={80}>
            <Ticket />
          </Aparece>
        </div>
        {[0, 1, 2].map((i) => {
          const e = entrada(frame, fps, pagar - 6 + i * 4);
          return (
            <div key={i} style={{ position: "absolute", left: 230 + e * (150 + i * 70), top: 150 - e * (80 - i * 50), transform: `rotate(${e * (12 - i * 14)}deg) scale(${0.3 + 0.7 * e})`, opacity: Math.min(1, e * 2) }}>
              <SelloVerde tam={130} />
            </div>
          );
        })}
      </div>
      {[0, 1, 2].map((i) => (
        <Efecto key={i} sonido="pop" en={pagar - 6 + i * 4} volumen={0.4} />
      ))}
    </ZonaEscena>
  );
};

// --- lo que te llevabas -----------------------------------------------------------

const Vajilla: React.FC = () => (
  <svg width={200} height={170} viewBox="0 0 100 85">
    {[0, 1, 2, 3].map((i) => (
      <ellipse key={i} cx={50} cy={70 - i * 7} rx={40} ry={9} fill={i % 2 ? "#e9e1d6" : "#f6f1ea"} stroke="#9a8f86" strokeWidth={1.5} />
    ))}
    <path d="M 34 30 H 62 V 40 A 14 13 0 0 1 34 40 Z" fill="#f6f1ea" stroke="#9a8f86" strokeWidth={1.5} />
    <path d="M 62 32 A 6 6 0 0 1 62 44" fill="none" stroke="#9a8f86" strokeWidth={2} />
    <path d="M 40 36 H 56" stroke="#3f6e8c" strokeWidth={2.5} />
  </svg>
);

const Radio: React.FC = () => (
  <svg width={200} height={170} viewBox="0 0 100 85">
    <rect x={10} y={22} width={80} height={56} rx={10} fill="#b5623e" />
    <rect x={16} y={30} width={42} height={40} rx={6} fill="#e9dcc6" />
    {[36, 42, 48, 54, 60].map((y) => (
      <line key={y} x1={20} y1={y} x2={54} y2={y} stroke="#b5a98f" strokeWidth={2} />
    ))}
    <circle cx={74} cy={40} r={8} fill="#e9dcc6" />
    <circle cx={74} cy={62} r={5} fill="#e9dcc6" />
    <line x1={70} y1={22} x2={84} y2={4} stroke="#6b5a4c" strokeWidth={2.5} strokeLinecap="round" />
  </svg>
);

const Sillon: React.FC = () => (
  <svg width={200} height={170} viewBox="0 0 100 85">
    <rect x={22} y={14} width={56} height={40} rx={12} fill="#4f7f6a" />
    <rect x={10} y={36} width={18} height={34} rx={8} fill="#43705c" />
    <rect x={72} y={36} width={18} height={34} rx={8} fill="#43705c" />
    <rect x={24} y={46} width={52} height={20} rx={6} fill="#5b8f78" />
    <rect x={16} y={66} width={68} height={8} rx={4} fill="#43705c" />
    <rect x={20} y={74} width={5} height={8} rx={2} fill="#6b4a2c" />
    <rect x={75} y={74} width={5} height={8} rx={2} fill="#6b4a2c" />
  </svg>
);

const Pegar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lamias = h.palabra("libreta", "lamías,");
  const pegas = h.palabra("libreta", "pegabas");
  const cosas = [
    { palabra: "vajilla,", Dibujo: Vajilla, texto: "Una vajilla" },
    { palabra: "radio", Dibujo: Radio, texto: "Una radio" },
    { palabra: "muebles.", Dibujo: Sillon, texto: "Muebles" },
  ];
  const lame = tramo(frame, lamias, 10);
  return (
    <ZonaEscena gap={40}>
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <div style={{ transform: `rotate(${-8 + lame * 8}deg) scale(${1 + Math.sin(lame * Math.PI) * 0.1})` }}>
          <SelloVerde tam={150} />
          <div style={{ marginTop: 10, textAlign: "center", fontSize: TAM.nota, fontWeight: 700, color: P.vison, opacity: tramo(frame, lamias, 6) }}>se lamían</div>
        </div>
        <Libreta ancho={540} desde={pegas} hasta={h.palabra("libreta", "llenas,") + 4} filas={4} />
      </div>
      <div style={{ display: "flex", gap: 20 }}>
        {cosas.map(({ palabra, Dibujo, texto }) => {
          const en = h.palabra("libreta", palabra) - 3;
          const e = entrada(frame, fps, en);
          return (
            <div key={texto} style={{ width: 270, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - e) * 80}px) scale(${0.7 + 0.3 * e})` }}>
              <Dibujo />
              <div style={{ fontSize: 40, fontWeight: 700 }}>{texto}</div>
            </div>
          );
        })}
      </div>
      {cosas.map((c) => (
        <Efecto key={c.texto} sonido="pop" en={h.palabra("libreta", c.palabra) - 3} volumen={0.4} />
      ))}
    </ZonaEscena>
  );
};

/** Dos montones de sellos: los de Correos y los verdes (según la empresa). */
const Montones: React.FC = () => {
  const frame = useCurrentFrame();
  const crece = (desde: number, n: number) => Math.floor(interpolate(frame, [desde, desde + 40], [0, n], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }));
  const verdes = crece(h.palabra("pico", "empresa"), 10);
  const correos = crece(h.palabra("pico", "Correos"), 4);
  const monton = (n: number, color: string, giro: number) => (
    <div style={{ display: "flex", flexDirection: "column-reverse", alignItems: "center", height: 640 }}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} style={{ marginTop: -78, transform: `rotate(${((i * 37) % 9) - 4 + giro}deg)` }}>
          <SelloVerde tam={110} color={color} valor={color === VERDE_SELLO ? "10" : "5¢"} />
        </div>
      ))}
    </div>
  );
  return (
    <ZonaEscena gap={30}>
      <Aparece desde={h.en("pico")} sube={20}>
        <Etiqueta texto="Años 60" tam={44} fondo={P.espresso} />
      </Aparece>
      <div style={{ display: "flex", gap: 120, alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          {monton(correos, "#3f6e8c", 0)}
          <div style={{ fontSize: 40, fontWeight: 700, textAlign: "center", lineHeight: 1.1 }}>
            Correos
            <br />
            de EE. UU.
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          {monton(verdes, VERDE_SELLO, 2)}
          <div style={{ fontSize: 40, fontWeight: 700, textAlign: "center", lineHeight: 1.1, color: VERDE_SELLO }}>
            Green
            <br />
            Stamps
          </div>
        </div>
      </div>
      <Aparece desde={h.palabra("pico", "presumía")} sube={10}>
        <div style={{ fontSize: TAM.nota, fontWeight: 600, color: P.vison }}>según la propia empresa</div>
      </Aparece>
      <Efecto sonido="tic" en={h.palabra("pico", "empresa")} volumen={0.4} />
      <Efecto sonido="tic" en={h.palabra("pico", "Correos")} volumen={0.4} />
    </ZonaEscena>
  );
};

const Tostadora: React.FC<{ tam?: number }> = ({ tam = 260 }) => (
  <svg width={tam} height={tam * 0.8} viewBox="0 0 100 80">
    <path d="M 14 26 Q 14 16 26 16 H 74 Q 86 16 86 26 V 66 Q 86 72 80 72 H 20 Q 14 72 14 66 Z" fill="#c9c2bb" />
    <rect x={28} y={12} width={16} height={8} rx={2} fill="#2b2522" />
    <rect x={56} y={12} width={16} height={8} rx={2} fill="#2b2522" />
    <rect x={30} y={4} width={12} height={10} rx={3} fill="#d9a441" />
    <rect x={58} y={2} width={12} height={12} rx={3} fill="#d9a441" />
    <rect x={88} y={36} width={6} height={14} rx={2} fill="#2b2522" />
    <rect x={14} y={48} width={72} height={4} fill="#b5ada5" />
  </svg>
);

/** Cada vez más libretas para lo mismo, y todo se apaga. */
const Crisis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mas = h.palabra("crisis", "más");
  const cansa = h.palabra("crisis", "cansó.");
  const libretas = Math.floor(interpolate(frame, [mas - 6, h.palabra("crisis", "cosas,") + 6], [1, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const apaga = tramo(frame, cansa - 6, 16);
  const tostadora = 1 - 0.35 * tramo(frame, mas, h.palabra("crisis", "cosas,") - mas);
  return (
    <ZonaEscena gap={40}>
      <Aparece desde={h.en("crisis")} sube={20}>
        <Etiqueta texto="Años 70" tam={44} fondo={P.espresso} />
      </Aparece>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 70, filter: `grayscale(${apaga}) opacity(${1 - apaga * 0.45})`, transform: `rotate(${apaga * -4}deg)` }}>
        <div style={{ display: "flex", flexDirection: "column-reverse", alignItems: "center" }}>
          {Array.from({ length: libretas }, (_, i) => (
            <div key={i} style={{ width: 300, height: 56, marginTop: 6, borderRadius: 8, background: i % 2 ? "#5f8a5c" : VERDE_SELLO, boxShadow: "inset 0 -6px 0 rgba(0,0,0,.15)", transform: `rotate(${((i * 23) % 7) - 3}deg)`, opacity: entrada(frame, fps, i === 0 ? h.en("crisis") + 6 : mas - 6 + i * 4) }} />
          ))}
          <div style={{ fontSize: 40, fontWeight: 700, marginBottom: 14 }}>Libretas</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 40, fontWeight: 700 }}>Una tostadora</div>
          <div style={{ transform: `scale(${tostadora})`, transformOrigin: "bottom center" }}>
            <Tostadora />
          </div>
        </div>
      </div>
      <Efecto sonido="golpe" en={cansa - 4} volumen={0.4} />
    </ZonaEscena>
  );
};

const Hoy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const premio = h.palabra("hoy", "premio");
  // Hasta 6 de 8: con 7, la app escribe «Faltan 1» (un fallo suyo que no se enseña).
  const puntos = 3 + Math.min(3, Math.max(0, Math.floor((frame - premio) / 7)));
  const e = entrada(frame, fps, h.en("hoy"));
  return (
    <ZonaEscena gap={50}>
      <div style={{ transform: `translateY(${(1 - e) * 300}px) rotate(${(1 - e) * 8 - 2}deg)`, opacity: Math.min(1, e * 1.5) }}>
        <Tarjeta puntos={puntos} ancho={760} />
      </div>
      <Aparece desde={h.palabra("hoy", "volver")} sube={20}>
        <div style={{ fontSize: TAM.titulo, fontWeight: 750, letterSpacing: "-0.035em", textAlign: "center" }}>
          Lo mismo, <span style={{ color: P.verde }}>en el móvil</span>
        </div>
      </Aparece>
      {[0, 1, 2].map((i) => (
        <Efecto key={i} sonido="pop" en={premio + 7 * (i + 1)} volumen={0.3} />
      ))}
    </ZonaEscena>
  );
};

const Remate: React.FC = () => {
  const frame = useCurrentFrame();
  const vuela = tramo(frame, h.palabra("remate", "lamer"), 26, Easing.in(Easing.cubic));
  return (
    <ZonaEscena gap={46} alinear="flex-start">
      <div style={{ alignSelf: "center", transform: `translate(${vuela * 700}px, ${-vuela * 500}px) rotate(${-6 + vuela * 160}deg)`, ["--detras-sello" as string]: P.verde }}>
        <SelloVerde tam={200} />
      </div>
      <Titular texto="Solo que ahora" desde={h.palabra("remate", "Solo")} cadencia={3} color={P.avena} tam={TAM.titulo} />
      <Titular texto="no hay que lamer nada." desde={h.palabra("remate", "no")} cadencia={3} color={P.papel} tam={TAM.gancho} resaltar={["lamer"]} colorResalte={P.avena} tintaResalte={P.espresso} />
      <Efecto sonido="zas" en={h.palabra("remate", "lamer")} volumen={0.4} />
    </ZonaEscena>
  );
};

export const GorilasConSellos: React.FC<{ guia?: boolean }> = ({ guia = false }) => (
  <Marco guia={guia} fondo="crema">
    <Locucion horario={h} />
    <Ventana desde={0} hasta={h.en("quees")} entra={0} deriva={0.03}>
      <Gorilas />
    </Ventana>
    <Ventana desde={h.en("quees")} hasta={h.en("libreta")} paso="barrido" deriva={0.04}>
      <QueEran />
    </Ventana>
    <Ventana desde={h.en("libreta")} hasta={h.en("pico")} paso="barrido" deriva={0.03}>
      <Pegar />
    </Ventana>
    <Ventana desde={h.en("pico")} hasta={h.en("crisis")} paso="zoom" deriva={0.03}>
      <Montones />
    </Ventana>
    <Ventana desde={h.en("crisis")} hasta={h.en("hoy")} paso="barrido" deriva={0.03}>
      <Crisis />
    </Ventana>
    <Ventana desde={h.en("hoy")} hasta={h.en("remate")} paso="zoom" deriva={0.04} style={{ background: P.papel }}>
      <Hoy />
    </Ventana>
    <Ventana desde={h.en("remate")} hasta={FINAL} paso="zoom" sale={0} deriva={0.03} style={{ background: P.verde }}>
      <Remate />
    </Ventana>
    <Marca desde={FINAL} />
    <Subtitulos horario={h} sin={["remate"]} />
  </Marco>
);

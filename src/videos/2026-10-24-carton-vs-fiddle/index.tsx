import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Marco } from "../../comun/Marco";
import { Locucion, Subtitulos, crearHorario } from "../../comun/Locucion";
import { Ventana, ZonaEscena } from "../../comun/Ventana";
import { Aparece } from "../../comun/Aparece";
import { Etiqueta } from "../../comun/Etiqueta";
import { PantallaTarjeta } from "../../comun/PantallaTarjeta";
import { PantallaBloqueo } from "../../comun/PantallaBloqueo";
import { MovilGrande, AvisoGrande, puntoDelMovil } from "../../comun/MovilGrande";
import { Cierre } from "../../comun/Cierre";
import { Efecto } from "../../comun/Efecto";
import { tramo } from "../../comun/movimiento";
import { CartillaCarton } from "../../flat/CartillaCarton";
import { SelloGoma } from "../../flat/SelloGoma";
import { Cortina } from "../../flat/Cortina";
import { ListaClientes } from "../../flat/ListaClientes";
import { Lista } from "../../flat/Lista";
import { Trazo } from "../../flat/Trazo";
import { P } from "../../marca";
import guion from "./locucion.json";
import tiempos from "./tiempos.json";

// ============================================================================
// EL CARTÓN CONTRA FIDDLE (flat, voz de Álvaro)
// Lo que la cartilla de cartón no le dice a la tienda, y lo que sí le dice fiddle.
// Guion: guion.md. Todo se coloca con la voz (h).
// ============================================================================

const h = crearHorario(guion, tiempos, { holgado: true });
export const DURACION = h.total;

const ANCHO_CARTILLA = 860;

/** La cartilla: le cae un sello, se escurre, se mancha y se hunde en el bolso. */
const LaCartilla: React.FC = () => {
  const frame = useCurrentFrame();
  const golpe = h.palabra("gancho", "nunca");
  const pierde = h.palabra("pierde", "pierde");
  const moja = h.palabra("pierde", "moja");
  const olvidada = h.palabra("pierde", "olvidada");
  const escurre = tramo(frame, pierde, 14);
  const hunde = tramo(frame, olvidada, 24, Easing.in(Easing.cubic));
  const flota = Math.sin(frame / 22) * 6 * (1 - escurre);
  const giro = -3 - 11 * escurre - 10 * hunde;
  const d = (ANCHO_CARTILLA * 0.8) / 5;
  const mojada = frame >= moja;
  const chof = mojada ? 1 + 0.06 * (1 - tramo(frame, moja, 8)) : 1;
  const bolso = tramo(frame, olvidada - 12, 14);
  return (
    <ZonaEscena gap={70}>
      <Aparece desde={0} sube={30}>
        <Etiqueta texto="La de toda la vida" fondo={P.vison} />
      </Aparece>
      <div style={{ position: "relative", zIndex: 1, transform: `translate(${-60 * escurre + 60 * hunde}px, ${flota + 330 * hunde}px) rotate(${giro}deg) scale(${(0.96 - 0.08 * escurre) * chof * (1 - 0.62 * hunde)})`, opacity: hunde > 0.7 ? (1 - hunde) / 0.3 : 1 }}>
        <CartillaCarton marcados={7} ultimoEn={golpe} ancho={ANCHO_CARTILLA} gastada={mojada} />
        <SelloGoma x={ANCHO_CARTILLA * 0.1 + d * 1.5} y={ANCHO_CARTILLA * 0.63 * 0.78} en={golpe} ancho={190} />
      </div>
      <Bolso visible={bolso} />
      <Efecto sonido="golpe" en={golpe} />
      <Efecto sonido="zas" en={moja} volumen={0.4} />
      <Efecto sonido="golpe" en={olvidada + 18} volumen={0.35} />
    </ZonaEscena>
  );
};

/** El bolso donde acaba la cartilla: la parte de delante tapa lo que cae dentro. */
const Bolso: React.FC<{ visible: number }> = ({ visible }) =>
  visible <= 0 ? null : (
    <svg width={520} height={420} viewBox="0 0 520 420" style={{ position: "absolute", left: (866 - 520) / 2, top: 520, zIndex: 2, opacity: visible, transform: `translateY(${(1 - visible) * 120}px)` }}>
      <path d="M150 140 C150 40, 370 40, 370 140" fill="none" stroke={P.camelOscuro} strokeWidth={26} strokeLinecap="round" />
      <path d="M60 140 H460 L420 400 Q418 414 404 414 H116 Q102 414 100 400 Z" fill={P.camel} />
      <path d="M60 140 H460 L452 188 H68 Z" fill={P.camelOscuro} opacity={0.5} />
      <circle cx={260} cy={250} r={14} fill={P.camelOscuro} />
    </svg>
  );

/** Lo que sabes de quien tiene la cartilla: nada. */
const FichaVacia: React.FC = () => {
  const frame = useCurrentFrame();
  const filas: [string, number][] = [
    ["Quién es", h.palabra("nada", "quién")],
    ["Última visita", h.palabra("nada", "cuándo")],
    ["Cuántas veces viene", h.palabra("nada", "vez.")],
  ];
  return (
    <ZonaEscena gap={50}>
      <Aparece desde={h.en("nada")} sube={40}>
        <div style={{ width: 860, background: P.superficie, borderRadius: 34, padding: "18px 40px", boxShadow: "0 24px 60px -24px rgba(31,24,18,.35)" }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: P.vison, padding: "18px 0 10px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Lo que sabes de tu cliente</div>
          {filas.map(([texto, en]) => {
            const e = tramo(frame, en - 2, 8);
            return (
              <div key={texto} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 0", borderTop: `2px solid ${P.avenaClara}` }}>
                <span style={{ fontSize: 48, fontWeight: 650 }}>{texto}</span>
                <span style={{ fontSize: 64, fontWeight: 800, color: P.camel, opacity: e, transform: `scale(${0.6 + 0.4 * e})`, display: "inline-block", width: 90, textAlign: "center" }}>?</span>
              </div>
            );
          })}
        </div>
      </Aparece>
    </ZonaEscena>
  );
};

/** La tarjeta, en el móvil del cliente. Suma un punto al decir «cliente». */
const EnElMovil: React.FC = () => {
  const frame = useCurrentFrame();
  const punto = h.palabra("giro", "cliente.");
  return (
    <>
      <MovilGrande desde={h.en("giro")}>
        <PantallaTarjeta puntos={frame < punto ? 5 : 6} conQR />
      </MovilGrande>
      <Efecto sonido="pop" en={punto} />
    </>
  );
};

const TusClientes: React.FC = () => (
  <ZonaEscena gap={44}>
    <Aparece desde={h.en("ves")} sube={30}>
      <Etiqueta texto="Tus clientes, en fiddle" />
    </Aparece>
    <ListaClientes
      ancho={866}
      tam={52}
      filas={[
        { nombre: "Ana", detalle: "Viene cada 2 días", estado: "activo", desde: h.palabra("ves", "viene,") },
        { nombre: "Luis", detalle: "2.ª visita esta semana", estado: "nuevo", desde: h.palabra("ves", "vuelve") },
        { nombre: "Marta", detalle: "3 semanas sin venir", estado: "riesgo", desde: h.palabra("ves", "semanas") },
      ]}
    />
    <Efecto sonido="pop" en={h.palabra("ves", "semanas")} volumen={0.4} />
  </ZonaEscena>
);

const ElAviso: React.FC = () => {
  const llega = h.palabra("aviso", "llega");
  return (
    <>
      <MovilGrande desde={h.en("aviso")}>
        <PantallaBloqueo />
      </MovilGrande>
      <AvisoGrande texto="Te echamos de menos. Hoy tu café lleva doble punto." desde={llega} arriba={puntoDelMovil(270)} />
      <Efecto sonido="ding" en={llega} />
    </>
  );
};

const Ademas: React.FC = () => {
  const imprimir = h.palabra("extra", "imprimir");
  const rapido = h.palabra("extra", "rápido.");
  return (
    <ZonaEscena gap={80}>
      <div style={{ position: "relative", transform: "rotate(-4deg)" }}>
        <Aparece desde={h.en("extra")} sube={30}>
          <CartillaCarton marcados={3} ancho={660} semilla="extra" />
        </Aparece>
        <Trazo forma="tachar" ancho={720} alto={420} desde={imprimir} color={P.verde} grosor={18} style={{ left: -30, top: 0 }} />
      </div>
      <Lista
        tam={62}
        items={[
          { texto: "Sin imprimir nada", icono: "nota" },
          { texto: "Igual de rápido en caja", icono: "reloj" },
        ]}
        desde={imprimir}
        cadencia={rapido - imprimir}
      />
    </ZonaEscena>
  );
};

export const CartonVsFiddle: React.FC<{ guia?: boolean }> = ({ guia = false }) => {
  const frame = useCurrentFrame();
  const verde = frame >= h.en("giro") && frame < h.en("ves");
  return (
    <Marco guia={guia} fondo={verde ? "verde" : "papel"}>
      <Locucion horario={h} />
      <Ventana desde={0} hasta={h.en("nada")} entra={0}>
        <LaCartilla />
      </Ventana>
      <Ventana desde={h.en("nada")} hasta={h.en("giro")}>
        <FichaVacia />
      </Ventana>
      <Ventana desde={h.en("giro")} hasta={h.en("ves")} entra={0}>
        <EnElMovil />
      </Ventana>
      <Ventana desde={h.en("ves")} hasta={h.en("aviso")} entra={0}>
        <TusClientes />
      </Ventana>
      <Ventana desde={h.en("aviso")} hasta={h.en("extra")}>
        <ElAviso />
      </Ventana>
      <Ventana desde={h.en("extra")} hasta={h.en("cierre")}>
        <Ademas />
      </Ventana>
      <Cortina desde={h.en("giro") - 9} />
      <Efecto sonido="zas" en={h.en("giro") - 9} volumen={0.5} />
      <Cortina desde={h.en("ves") - 9} color={P.papel} />
      <Cierre desde={h.en("cierre")} lema="Tu cartilla, pero en el móvil." />
      <Subtitulos horario={h} />
    </Marco>
  );
};

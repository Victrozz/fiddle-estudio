import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Marco } from "../../comun/Marco";
import { Locucion, Subtitulos, crearHorario } from "../../comun/Locucion";
import { Ventana, ZonaEscena } from "../../comun/Ventana";
import { Aparece } from "../../comun/Aparece";
import { Etiqueta } from "../../comun/Etiqueta";
import { Titular } from "../../comun/Titular";
import { Cierre } from "../../comun/Cierre";
import { Efecto } from "../../comun/Efecto";
import { entrada, tramo } from "../../comun/movimiento";
import { Tazas } from "../../flat/Tazas";
import { Comparativa } from "../../flat/Comparativa";
import { Cuenta } from "../../flat/Cuenta";
import { Barras } from "../../flat/Barras";
import { MAL, P, TAM } from "../../marca";
import guion from "./locucion.json";
import tiempos from "./tiempos.json";

// ============================================================================
// REGALAR SALE A CUENTA (flat, voz de Álvaro)
// El miedo del dueño: «regalar cafés me cuesta dinero». Regalar uno de cada diez es
// un descuento solo para los que vuelven. Las cifras son un ejemplo y se dice: el
// precio del café (1,80 €) y los días (250 laborables) son supuestos.
// ============================================================================

const h = crearHorario(guion, tiempos, { holgado: true });
export const DURACION = h.total;

const UnCafeGratis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const perder = h.palabra("gancho", "perder");
  const duda = h.palabra("gancho", "¿o");
  const resta = entrada(frame, fps, perder);
  const sube = tramo(frame, perder, 30);
  const sinResta = 1 - tramo(frame, duda - 2, 8);
  const pregunta = entrada(frame, fps, duda);
  return (
    <ZonaEscena>
      <div style={{ position: "relative" }}>
        <Aparece desde={0} escala={0.7}>
          <Tazas total={1} llenas={1} gratis={[0]} tam={380} columnas={1} />
        </Aparece>
        <div style={{ position: "absolute", left: 300, top: -60 - 60 * sube, fontSize: 96, fontWeight: 800, color: MAL, opacity: Math.min(1, resta * 1.5) * sinResta, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>−1,80 €</div>
        <div style={{ position: "absolute", left: 320, top: -120, fontSize: 200, fontWeight: 800, color: P.camel, opacity: pregunta, transform: `scale(${0.5 + 0.5 * pregunta}) rotate(${(1 - pregunta) * -20}deg)` }}>?</div>
      </div>
      <Efecto sonido="pop" en={0} volumen={0.4} />
      <Efecto sonido="zas" en={perder} volumen={0.35} />
      <Efecto sonido="pop" en={duda} />
    </ZonaEscena>
  );
};

const DiezTazas: React.FC = () => {
  const frame = useCurrentFrame();
  const cobras = h.palabra("nueve", "cobras.");
  return (
    <ZonaEscena gap={70}>
      <Aparece desde={h.en("cuenta")} sube={20}>
        <Etiqueta texto="La cuenta" tam={42} fondo={P.espresso} />
      </Aparece>
      <Tazas total={10} gratis={[9]} desde={frame < h.en("nueve") ? 100000 : h.palabra("nueve", "De")} cadencia={4} tam={150} />
      <Aparece desde={cobras} sube={20}>
        <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: "-0.02em" }}>
          <span style={{ color: P.camelOscuro }}>9 cobrados</span>
          <span style={{ color: P.vison }}> · </span>
          <span style={{ color: P.verde }}>1 regalado</span>
        </div>
      </Aparece>
      {Array.from({ length: 10 }, (_, i) => (
        <Efecto key={i} sonido="pop" en={h.palabra("nueve", "De") + i * 4} volumen={0.25} />
      ))}
    </ZonaEscena>
  );
};

const DescuentoOPremio: React.FC = () => (
  <ZonaEscena gap={50}>
    <Comparativa
      ancho={866}
      tam={48}
      columna={250}
      titulos={["Descuento", "Café gratis"]}
      desde={h.en("descuento")}
      filas={[
        { texto: "No te cuesta en cada café", izq: false, der: true, en: h.palabra("descuento", "cada") },
        { texto: "Solo para quien vuelve", izq: false, der: true, en: h.palabra("descuento", "vuelve.") - 4 },
        { texto: "Premia al habitual", izq: false, der: true, en: h.palabra("premio", "nueve") },
      ]}
    />
    <Efecto sonido="pop" en={h.palabra("descuento", "cada")} volumen={0.4} />
    <Efecto sonido="pop" en={h.palabra("descuento", "vuelve.") - 4} volumen={0.4} />
    <Efecto sonido="pop" en={h.palabra("premio", "nueve")} volumen={0.4} />
  </ZonaEscena>
);

const ElEjemplo: React.FC = () => (
  <ZonaEscena gap={70}>
    <Aparece desde={h.en("ejemplo")} sube={20}>
      <Etiqueta texto="Ejemplo" tam={42} fondo={P.camel} />
    </Aparece>
    <Cuenta
      tam={90}
      trozos={[
        { texto: "1,80 €", debajo: "un café", en: h.palabra("ejemplo", "habitual") },
        { texto: "×", en: h.palabra("ejemplo", "viene") },
        { texto: "250", debajo: "días laborables", en: h.palabra("ejemplo", "laborable") },
        { texto: "=", en: h.palabra("ejemplo", "deja") },
        { texto: "450 €", debajo: "al año", en: h.palabra("ejemplo", "cuatrocientos"), resultado: true },
      ]}
    />
    <Efecto sonido="caja" en={h.palabra("ejemplo", "cuatrocientos")} />
  </ZonaEscena>
);

const SuPremio: React.FC = () => (
  <ZonaEscena gap={60}>
    <Barras
      ancho={866}
      tam={50}
      maximo={250}
      desde={h.palabra("regalo", "premio:")}
      cadencia={h.palabra("regalo", "veinticinco") - h.palabra("regalo", "premio:")}
      despues=" cafés"
      barras={[
        { etiqueta: "Te paga al año", valor: 250, color: P.verde },
        { etiqueta: "Le regalas", valor: 25, color: P.camel },
      ]}
    />
  </ZonaEscena>
);

const Remate: React.FC = () => (
  <ZonaEscena gap={60} alinear="flex-start">
    <Titular texto="No estás regalando un café." desde={h.palabra("remate", "No")} cadencia={4} color={P.avena} tam={TAM.titulo} />
    <Titular texto="Estás comprando que vuelva." desde={h.palabra("remate", "Estás")} cadencia={4} color={P.papel} tam={TAM.gancho} resaltar={["vuelva."]} colorResalte={P.avena} tintaResalte={P.espresso} />
    <Efecto sonido="pop" en={h.palabra("remate", "vuelva.")} />
  </ZonaEscena>
);

export const RegalarSaleACuenta: React.FC<{ guia?: boolean }> = ({ guia = false }) => {
  const frame = useCurrentFrame();
  const verde = frame >= h.en("remate") && frame < h.en("cierre");
  return (
    <Marco guia={guia} fondo={verde ? "verde" : "papel"}>
      <Locucion horario={h} />
      <Ventana desde={0} hasta={h.en("cuenta")} entra={0}>
        <UnCafeGratis />
      </Ventana>
      <Ventana desde={h.en("cuenta")} hasta={h.en("descuento")}>
        <DiezTazas />
      </Ventana>
      <Ventana desde={h.en("descuento")} hasta={h.en("ejemplo")}>
        <DescuentoOPremio />
      </Ventana>
      <Ventana desde={h.en("ejemplo")} hasta={h.en("regalo")}>
        <ElEjemplo />
      </Ventana>
      <Ventana desde={h.en("regalo")} hasta={h.en("remate")}>
        <SuPremio />
      </Ventana>
      <Ventana desde={h.en("remate")} hasta={h.en("cierre")} entra={0}>
        <Remate />
      </Ventana>
      <Cierre desde={h.en("cierre")} />
      <Subtitulos horario={h} sin={["remate", "cierre"]} />
    </Marco>
  );
};

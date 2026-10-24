import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Marco } from "../comun/Marco";
import { Titular } from "../comun/Titular";
import { Tarjeta } from "../comun/Tarjeta";
import { Efecto } from "../comun/Efecto";
import { CartillaCarton } from "../flat/CartillaCarton";
import { SelloGoma } from "../flat/SelloGoma";
import { Comparativa } from "../flat/Comparativa";
import { Lista } from "../flat/Lista";
import { Cronometro } from "../flat/Cronometro";
import { Grafica } from "../flat/Grafica";
import { Barras } from "../flat/Barras";
import { Tazas } from "../flat/Tazas";
import { Trazo } from "../flat/Trazo";
import { Cortina } from "../flat/Cortina";
import { Partido } from "../flat/Partido";
import { Lavadero } from "../flat/Lavadero";
import { Raton, Queso } from "../flat/Raton";
import { DeCada100 } from "../flat/DeCada100";
import { Visitas } from "../flat/Visitas";
import { Cajon, Cartera, Lavadora, Ojo } from "../flat/Escondites";
import { Gorila } from "../flat/Gorila";
import { Libreta, SelloVerde } from "../flat/SellosVerdes";
import { ZONA_LIBRE, s } from "../formato";
import { P, TAM } from "../marca";

// ============================================================================
// MUESTRARIO: EL KIT FLAT
// ----------------------------------------------------------------------------
// Cada pieza del estilo póster, una detrás de otra. NO es un vídeo para redes:
// es para verlas en el Studio y como ejemplo de cómo se usan. Las cifras y frases
// de aquí son de relleno: no pasan a un vídeo sin comprobarlas.
// ============================================================================

const T = s(3.5);
export const DURACION_FLAT = T * 9;

const Zona: React.FC<{ children: React.ReactNode; gap?: number; justify?: React.CSSProperties["justifyContent"] }> = ({ children, gap = 56, justify = "center" }) => (
  <AbsoluteFill style={{ left: ZONA_LIBRE.x, top: ZONA_LIBRE.y, width: ZONA_LIBRE.ancho, height: ZONA_LIBRE.alto, justifyContent: justify, alignItems: "flex-start", gap }}>{children}</AbsoluteFill>
);

const EUROS = (n: number) => `${new Intl.NumberFormat("es-ES").format(Math.round(n))} €`;

export const MuestrarioFlat: React.FC<{ guia?: boolean }> = ({ guia = false }) => (
  <Marco guia={guia}>
    <Series>
      {/* 1. El sello de goma sobre la cartilla de cartón */}
      <Series.Sequence durationInFrames={T}>
        <Zona>
          <Titular texto="Un sello. Y otro. Y otro." tam={TAM.titulo} />
          <div style={{ position: "relative" }}>
            <CartillaCarton marcados={7} ultimoEn={s(1.4)} ancho={866} />
            <SelloGoma x={866 * 0.1 + (866 * 0.8) / 5 * 1.5} y={866 * 0.63 * 0.78} en={s(1.4)} />
            <Trazo forma="rodear" ancho={170} alto={170} desde={s(2.2)} style={{ left: 866 * 0.1 + (866 * 0.8) / 5 * 4.5 - 85, top: 866 * 0.63 * 0.78 - 85 }} />
          </div>
          <Efecto sonido="golpe" en={s(1.4)} />
        </Zona>
      </Series.Sequence>

      {/* 2. Pantalla partida: la de cartón, gastada, contra la de fiddle */}
      <Series.Sequence durationInFrames={T}>
        <Partido
          arriba={
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 120 }}>
              <CartillaCarton marcados={4} gastada ancho={720} semilla="otra" style={{ transform: "rotate(-4deg)" }} />
            </AbsoluteFill>
          }
          abajo={
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 130 }}>
              <Tarjeta puntos={4} ancho={720} />
            </AbsoluteFill>
          }
        />
      </Series.Sequence>

      {/* 3. La comparativa, pensada para el dueño */}
      <Series.Sequence durationInFrames={T}>
        <Zona gap={64}>
          <Titular texto="Lo que gana tu tienda" tam={TAM.titulo} resaltar={["tienda"]} />
          <Comparativa
            ancho={ZONA_LIBRE.ancho}
            desde={s(0.6)}
            filas={[
              { texto: "Sabes quién vuelve", izq: false, der: true },
              { texto: "Avisas a todos a la vez", izq: false, der: true },
              { texto: "Imprenta", izq: "Cada mes", der: "Nunca" },
              { texto: "No se pierde ni se moja", izq: false, der: true },
            ]}
          />
        </Zona>
      </Series.Sequence>

      {/* 4. Igual de rápido: dos cronómetros y lo que viene además */}
      <Series.Sequence durationInFrames={T}>
        <Zona gap={70}>
          <div style={{ display: "flex", gap: 80, alignSelf: "center" }}>
            <Cronometro segundos={3} duracion={s(1)} tam={330} color={P.camel} etiqueta="Sellar el cartón" />
            <Cronometro segundos={3} duracion={s(1)} tam={330} etiqueta="Escanear con fiddle" />
          </div>
          <Lista
            desde={s(1.3)}
            tam={50}
            items={[
              { texto: "Ves quién viene y cuándo", icono: "clientes" },
              { texto: "Le avisas en su móvil", icono: "campana" },
              { texto: "Nadie pierde la tarjeta", icono: "cartera" },
            ]}
          />
          <Efecto sonido="tic" en={0} />
        </Zona>
      </Series.Sequence>

      {/* 5. Gráfica y barras */}
      <Series.Sequence durationInFrames={T}>
        <Zona gap={60}>
          <Grafica
            ancho={ZONA_LIBRE.ancho}
            alto={520}
            duracion={s(1.6)}
            formato={EUROS}
            extremos={["Mes 1", "Mes 12"]}
            series={[
              { nombre: "Con premio", valores: [40, 75, 112, 150, 188, 225, 262, 300, 338, 375, 412, 450], relleno: true },
              { nombre: "Sin premio", valores: [40, 70, 95, 115, 130, 140, 145, 148, 150, 150, 150, 150], color: P.camel },
            ]}
          />
          <Barras ancho={ZONA_LIBRE.ancho} desde={s(1.8)} despues=" €" decimales={2} barras={[{ etiqueta: "Un café gratis te cuesta", valor: 0.45 }, { etiqueta: "Diez cafés te dejan", valor: 18 }]} />
        </Zona>
      </Series.Sequence>

      {/* 6. Las tazas: nueve se cobran, una se regala */}
      <Series.Sequence durationInFrames={T}>
        <Zona gap={70}>
          <Titular texto="Regalas una. Cobras nueve." tam={TAM.titulo} resaltar={["nueve"]} />
          <div style={{ alignSelf: "center" }}>
            <Tazas total={10} gratis={[9]} desde={s(0.5)} cadencia={4} tam={150} />
          </div>
        </Zona>
        <Cortina desde={T - 18} />
        <Efecto sonido="zas" en={T - 18} />
      </Series.Sequence>

      {/* 7. Dibujos para contar estudios: el lavadero, el ratón y el queso */}
      <Series.Sequence durationInFrames={T}>
        <Zona gap={60}>
          <Lavadero ancho={ZONA_LIBRE.ancho} />
          <div style={{ display: "flex", alignItems: "flex-end", gap: 40 }}>
            <Raton tam={300} fase={3} prisa={0.8} />
            <Queso tam={200} />
            <Queso tam={200} casillas={10} llenas={6} />
          </div>
        </Zona>
      </Series.Sequence>

      {/* 8. Porcentajes que se ven y visitas que se acercan */}
      <Series.Sequence durationInFrames={T}>
        <Zona gap={60}>
          <div style={{ display: "flex", gap: 60 }}>
            <DeCada100 valor={19} desde={s(0.3)} ancho={360} color={P.camel} />
            <DeCada100 valor={34} desde={s(0.3)} ancho={360} />
          </div>
          <Visitas huecos={[3.5, 3.3, 3.1, 2.9, 2.8]} en={[s(1.2), s(1.5), s(1.8), s(2.0), s(2.2), s(2.4)]} ancho={ZONA_LIBRE.ancho} arco={36} />
        </Zona>
      </Series.Sequence>

      {/* 9. Donde acaba la cartilla, el gorila y los sellos verdes de antes */}
      <Series.Sequence durationInFrames={T}>
        <Zona gap={30}>
          <div style={{ display: "flex", gap: 10 }}>
            <Cajon ancho={280} />
            <Cartera ancho={280} />
            <Lavadora ancho={280} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 30 }}>
            <Gorila tam={240} />
            <Ojo tam={220} />
            <SelloVerde tam={110} />
          </div>
          <Libreta ancho={520} filas={2} desde={s(0.5)} hasta={s(2.5)} />
        </Zona>
      </Series.Sequence>
    </Series>
  </Marco>
);

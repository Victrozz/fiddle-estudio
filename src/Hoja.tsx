import React from "react";
import { AbsoluteFill, Freeze } from "remotion";
import { ANCHO, ALTO } from "./formato";
import { PILA_FUENTES } from "./comun/fuentes";
import { P } from "./marca";
import { VIDEOS } from "./videos";

// ============================================================================
// LA HOJA DE CONTACTOS: un vídeo de un vistazo
// ----------------------------------------------------------------------------
// Ocho momentos de un vídeo, congelados y en pequeño, en UNA imagen. Para revisar
// sin sacar ocho stills (cada uno arranca un Chrome):
//   npx remotion still Hoja out/hoja.png --props='{"id":"<id>","momentos":["gancho","vacia+20",…]}'
// (La Hoja dura lo que el vídeo más largo: Remotion no deja ver un fotograma más
// allá de la duración de la composición, ni congelado.)
// Un momento es un número de fotograma o una frase del horario («regalo»: cuando
// empieza; «regalo+20»: 20 fotogramas después; «fin:remate»: cuando acaba).
// ============================================================================

export const COLUMNAS = 4;
export const FILAS = 2;
const ESCALA = 1 / 3;
const CELDA = { ancho: ANCHO * ESCALA, alto: ALTO * ESCALA, rotulo: 44 };
export const HOJA = { ancho: CELDA.ancho * COLUMNAS, alto: (CELDA.alto + CELDA.rotulo) * FILAS };

type Props = { id: string; momentos: (string | number)[] };

function fotograma(m: string | number, horario: (typeof VIDEOS)[number]["horario"]) {
  if (typeof m === "number") return m;
  const [, fin, id, mas] = m.match(/^(fin:)?([a-z0-9-]+?)([+-]\d+)?$/i) ?? [];
  if (!id || !horario) throw new Error(`Momento raro: «${m}» (o el vídeo no exporta su horario)`);
  return (fin ? horario.fin(id) : horario.en(id)) + Number(mas ?? 0);
}

export const Hoja: React.FC<Props> = ({ id, momentos }) => {
  const video = VIDEOS.find((v) => v.id === id);
  if (!video) throw new Error(`No hay vídeo «${id}»`);
  const Video = video.componente;
  return (
    <AbsoluteFill style={{ background: P.espresso, fontFamily: PILA_FUENTES, flexDirection: "row", flexWrap: "wrap" }}>
      {momentos.slice(0, COLUMNAS * FILAS).map((m, i) => {
        const f = fotograma(m, video.horario);
        return (
          <div key={i} style={{ width: CELDA.ancho, height: CELDA.alto + CELDA.rotulo }}>
            <div style={{ height: CELDA.rotulo, color: P.avena, fontSize: 24, fontWeight: 600, padding: "8px 12px", whiteSpace: "nowrap", overflow: "hidden" }}>
              {String(m)} · {f} · {(f / 30).toFixed(1)} s
            </div>
            <div style={{ width: CELDA.ancho, height: CELDA.alto, overflow: "hidden", position: "relative" }}>
              <div style={{ width: ANCHO, height: ALTO, position: "relative", transform: `scale(${ESCALA})`, transformOrigin: "top left" }}>
                <Freeze frame={f}>
                  <Video />
                </Freeze>
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

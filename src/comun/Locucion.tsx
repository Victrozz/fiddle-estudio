import React from "react";
import { Html5Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { entrada } from "./movimiento";
import { ANCHO, ALTO, FPS, SEGURA } from "../formato";
import { P } from "../marca";

// ============================================================================
// LA VOZ Y LOS SUBTÍTULOS
// ----------------------------------------------------------------------------
// Un vídeo con voz tiene en su carpeta:
//   locucion.json  la voz y las frases (lo escribe una persona)
//   tiempos.json   cuánto dura cada frase y cuándo cae cada palabra (lo saca
//                  scripts/voces/locutar.mjs con Azure; no se toca a mano)
// `crearHorario` los junta: en qué fotograma empieza y acaba cada frase y cada
// palabra. Todo el vídeo se coloca con eso: una escena empieza con su frase
// (`h.en("giro")`) y un golpe cae con su palabra (`h.palabra("gancho", "cartilla")`).
// Si se cambia el texto y se vuelve a locutar, el vídeo se recoloca solo.
// ============================================================================

type Palabra = { texto: string; ms: number; dur: number };
type Tiempos = { voz: string; lineas: { id: string; audio: string; ms: number; palabras: Palabra[] }[] };
type Guion = { lineas: { id: string; pausa?: number; antes?: number }[] };

export type PalabraH = { texto: string; desde: number; hasta: number };
export type LineaH = { id: string; audio: string; desde: number; hasta: number; palabras: PalabraH[] };

export type Horario = {
  lineas: LineaH[];
  /** Fotogramas del vídeo entero: la voz, más `cola` para el cierre. */
  total: number;
  /** El fotograma en que empieza una frase. */
  en: (id: string) => number;
  /** El fotograma en que acaba de decirse. */
  fin: (id: string) => number;
  /** El fotograma en que empieza una palabra de una frase (la primera que coincide). */
  palabra: (id: string, palabra: string) => number;
};

const f = (ms: number) => Math.round((ms / 1000) * FPS);
const letras = (t: string) => t.toLowerCase().normalize("NFD").replace(/[^\p{L}\p{N}]/gu, "");

/**
 * `entrada`: segundos de silencio al empezar. `cola`: lo que dura el vídeo después
 * de la última frase (el cierre se queda en pantalla). Cada frase puede llevar
 * `antes` (más silencio antes) y `pausa` (silencio después) en locucion.json.
 */
export function crearHorario(guion: Guion, tiempos: Tiempos, { entrada: inicio = 0.4, cola = 2 } = {}): Horario {
  let t = f(inicio * 1000);
  const lineas = guion.lineas.map((g) => {
    const tl = tiempos.lineas.find((x) => x.id === g.id);
    if (!tl) throw new Error(`La frase «${g.id}» no está en tiempos.json: hay que volver a locutar`);
    t += f((g.antes ?? 0) * 1000);
    const desde = t;
    const hasta = desde + f(tl.ms);
    t = hasta + f((g.pausa ?? 0) * 1000);
    return { id: g.id, audio: tl.audio, desde, hasta, palabras: tl.palabras.map((p) => ({ texto: p.texto, desde: desde + f(p.ms), hasta: desde + f(p.ms + p.dur) })) };
  });
  const linea = (id: string) => {
    const l = lineas.find((x) => x.id === id);
    if (!l) throw new Error(`No hay frase «${id}»`);
    return l;
  };
  return {
    lineas,
    total: lineas[lineas.length - 1].hasta + f(cola * 1000),
    en: (id) => linea(id).desde,
    fin: (id) => linea(id).hasta,
    palabra: (id, palabra) => {
      const p = linea(id).palabras.find((x) => letras(x.texto) === letras(palabra));
      if (!p) throw new Error(`«${palabra}» no está en la frase «${id}»`);
      return p.desde;
    },
  };
}

/** Las frases, cada una en su sitio. */
export const Locucion: React.FC<{ horario: Horario; volumen?: number }> = ({ horario, volumen = 1 }) => (
  <>
    {horario.lineas.map((l) => (
      <Sequence key={l.id} from={l.desde} durationInFrames={l.hasta - l.desde + FPS} layout="none">
        <Html5Audio src={staticFile(l.audio)} volume={volumen} />
      </Sequence>
    ))}
  </>
);

// ----------------------------------------------------------------------------
// LOS SUBTÍTULOS
// Mucha gente ve los vídeos sin sonido: lo que dice la voz sale escrito, a trozos
// de pocas palabras, con la que suena resaltada. Van en una banda fija encima de
// lo que tapan las apps (BANDA_SUBTITULOS): lo demás del vídeo no se mete ahí.
// ----------------------------------------------------------------------------

/** Dónde van los subtítulos. Lo de cada escena, por encima de `y`. */
export const BANDA_SUBTITULOS = { y: ALTO - SEGURA.abajo - 250, alto: 220 };
/** Hasta dónde puede llegar lo de una escena sin pisar los subtítulos. */
export const LIMITE_ESCENA = BANDA_SUBTITULOS.y - 30;

const MAX_LETRAS = 20;
const MAX_PALABRAS = 4;

/** Las palabras de una frase en trozos: corta en los signos y antes de pasarse. */
function trozos(palabras: PalabraH[]) {
  const lista: PalabraH[][] = [];
  let actual: PalabraH[] = [];
  let largo = 0;
  for (const p of palabras) {
    if (actual.length && (largo + p.texto.length > MAX_LETRAS || actual.length >= MAX_PALABRAS)) {
      lista.push(actual);
      actual = [];
      largo = 0;
    }
    actual.push(p);
    largo += p.texto.length + 1;
    if (/[,.:;?!…»]$/.test(p.texto)) {
      lista.push(actual);
      actual = [];
      largo = 0;
    }
  }
  if (actual.length) lista.push(actual);
  return lista;
}

type Subs = { horario: Horario; sin?: string[]; tam?: number };

export const Subtitulos: React.FC<Subs> = ({ horario, sin = ["cierre"], tam = 62 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const linea = horario.lineas.find((l) => frame >= l.desde && frame < l.hasta + 8);
  if (!linea || sin.includes(linea.id)) return null;
  const grupos = trozos(linea.palabras);
  const i = grupos.findIndex((g, k) => frame < (grupos[k + 1]?.[0].desde ?? linea.hasta + 8));
  const grupo = grupos[i];
  if (!grupo || frame < grupo[0].desde - 2) return null;
  const e = entrada(frame, fps, grupo[0].desde - 2, true);
  return (
    <div style={{ position: "absolute", left: 0, top: BANDA_SUBTITULOS.y, width: ANCHO, height: BANDA_SUBTITULOS.alto, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      <div
        style={{
          maxWidth: ANCHO - SEGURA.izquierda - SEGURA.derecha,
          padding: `${tam * 0.28}px ${tam * 0.5}px`,
          borderRadius: tam * 0.45,
          background: "rgba(31, 24, 18, 0.9)",
          color: P.papel,
          fontSize: tam,
          fontWeight: 750,
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          textAlign: "center",
          opacity: e,
          transform: `scale(${0.92 + 0.08 * e})`,
          boxShadow: "0 10px 30px rgba(31,24,18,.25)",
        }}
      >
        {grupo.map((p, k) => {
          const suena = frame >= p.desde && frame < (grupo[k + 1]?.desde ?? p.hasta + 6);
          const dicha = frame >= p.desde;
          return (
            <span key={k} style={{ color: suena ? P.avena : P.papel, opacity: dicha ? 1 : 0.55 }}>
              {p.texto}
              {k < grupo.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// LA LOCUCIÓN DE UN VÍDEO
// ----------------------------------------------------------------------------
// Lee src/videos/<id>/locucion.json (la voz y las frases) y, con Azure, saca:
//   public/voz/<id>/<nn>-<frase>.mp3     una por frase
//   src/videos/<id>/tiempos.json         cuánto dura cada una y cuándo cae cada palabra
// El vídeo se coloca solo con esos tiempos: las escenas y los subtítulos van a la voz.
// Lo generado va al repo: el render (también el de GitHub) no vuelve a llamar a Azure.
//
//   AZURE_SPEECH_KEY=… AZURE_SPEECH_REGION=germanywestcentral node scripts/voces/locutar.mjs <id> [<id>…]
//
// En el texto, «|» es una pausa corta (`pausaCorta` en locucion.json, 250 ms de
// partida; los de contar historias van a 150). Lo que se lee mal se arregla en
// pronunciacion.json («fiddle» → «fídel»); los subtítulos llevan la palabra escrita.
// ============================================================================

import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import sdk from "microsoft-cognitiveservices-speech-sdk";

const CLAVE = process.env.AZURE_SPEECH_KEY;
const REGION = process.env.AZURE_SPEECH_REGION;
if (!CLAVE || !REGION) {
  console.error("Faltan AZURE_SPEECH_KEY y AZURE_SPEECH_REGION.");
  process.exit(1);
}

const aqui = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const leer = (f) => JSON.parse(readFileSync(f, "utf8"));
const VOCES = leer(path.join(aqui, "elegidas.json"));
const COMO_SE_DICE = Object.entries(leer(path.join(aqui, "pronunciacion.json"))).filter(([k]) => k !== "_");

const escapar = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const paraVoz = (t) => COMO_SE_DICE.reduce((acc, [escrita, dicha]) => acc.replace(new RegExp(`\\b${escrita}\\b`, "gi"), dicha), t);
// Al revés, para los subtítulos: lo que dijo la voz, escrito como se escribe.
const comoSeEscribe = (palabra) => {
  const hallada = COMO_SE_DICE.find(([, dicha]) => dicha.toLowerCase() === palabra.toLowerCase());
  return hallada ? hallada[0] : palabra;
};
const TICKS_POR_MS = 10_000;

// Azure da las palabras sin signos. Para los subtítulos se recuperan del guion
// («pierde,», «¿Regalar», ««Añadir»): cada palabra dicha se casa con la siguiente
// escrita que es la misma letra a letra.
const letras = (t) => t.toLowerCase().normalize("NFD").replace(/[^\p{L}\p{N}]/gu, "");
function conSignos(palabras, texto) {
  const escritas = texto.replace(/\|/g, " ").split(/\s+/).filter(Boolean);
  let j = 0;
  return palabras.map((p) => {
    for (let k = j; k < Math.min(escritas.length, j + 3); k++) {
      if (letras(escritas[k]) === letras(p.texto)) {
        j = k + 1;
        return { ...p, texto: escritas[k] };
      }
    }
    return p;
  });
}

function decir(texto, voz, { velocidad = "+0%", tono = "+0%", pausaCorta = 250 }) {
  const v = VOCES[voz];
  if (!v) throw new Error(`No hay voz «${voz}» en elegidas.json`);
  const frase = escapar(paraVoz(texto)).replace(/\s*\|\s*/g, ` <break time='${pausaCorta}ms'/> `);
  const conIdioma = v.idioma ? `<lang xml:lang='${v.idioma}'>${frase}</lang>` : frase;
  const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='es-ES'><voice name='${v.voz}'><prosody rate='${velocidad}' pitch='${tono}'>${conIdioma}</prosody></voice></speak>`;

  const config = sdk.SpeechConfig.fromSubscription(CLAVE, REGION);
  config.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio48Khz192KBitRateMonoMp3;
  const sintetizador = new sdk.SpeechSynthesizer(config, null);
  const palabras = [];
  sintetizador.wordBoundary = (_, e) => {
    if (e.boundaryType !== sdk.SpeechSynthesisBoundaryType.Word) return;
    // Justo antes de una pausa (<break>), Azure da como texto el resto de la frase:
    // la palabra es solo la primera.
    const palabra = e.text.trim().split(/\s+/)[0];
    if (!palabra) return;
    palabras.push({ texto: comoSeEscribe(palabra), ms: Math.round(e.audioOffset / TICKS_POR_MS), dur: Math.round(e.duration / TICKS_POR_MS) });
  };
  return new Promise((resolver, fallar) => {
    sintetizador.speakSsmlAsync(
      ssml,
      (r) => {
        sintetizador.close();
        if (r.reason !== sdk.ResultReason.SynthesizingAudioCompleted) return fallar(new Error(r.errorDetails || "Azure no devolvió audio"));
        resolver({ audio: Buffer.from(r.audioData), ms: Math.round(r.audioDuration / TICKS_POR_MS), palabras });
      },
      (e) => {
        sintetizador.close();
        fallar(new Error(String(e)));
      },
    );
  });
}

for (const id of process.argv.slice(2)) {
  const carpeta = path.join("src", "videos", id);
  const guion = leer(path.join(carpeta, "locucion.json"));
  const voz = guion.voz ?? VOCES.porDefecto;
  const salida = path.join("public", "voz", id);
  rmSync(salida, { recursive: true, force: true });
  mkdirSync(salida, { recursive: true });

  const lineas = [];
  for (const [i, l] of guion.lineas.entries()) {
    const r = await decir(l.texto, voz, { velocidad: l.velocidad ?? guion.velocidad, tono: l.tono ?? guion.tono, pausaCorta: guion.pausaCorta });
    const archivo = `${String(i + 1).padStart(2, "0")}-${l.id}.mp3`;
    writeFileSync(path.join(salida, archivo), r.audio);
    lineas.push({ id: l.id, audio: `voz/${id}/${archivo}`, ms: r.ms, palabras: conSignos(r.palabras, l.texto) });
    console.log(`${id} · ${l.id}: ${(r.ms / 1000).toFixed(2)} s, ${r.palabras.length} palabras`);
  }
  writeFileSync(path.join(carpeta, "tiempos.json"), JSON.stringify({ voz: VOCES[voz].voz, lineas }, null, 1) + "\n");
}

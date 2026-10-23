import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { FUENTE } from "../marca";

// Geist, la de la web de fiddle, en local (public/marca/fuentes, licencia OFL): así
// el render no depende de Google Fonts y sale igual en Windows que en GitHub Actions.
// Remotion espera a que cargue antes de sacar cada fotograma.
loadFont({ family: FUENTE, url: staticFile("marca/fuentes/Geist-Variable.ttf"), weight: "100 900" });

export const PILA_FUENTES = `${FUENTE}, system-ui, sans-serif`;

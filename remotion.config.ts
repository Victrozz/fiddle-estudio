import path from "node:path";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Three.js no funciona con el OpenGL de partida de Chrome. En un ordenador con
// tarjeta gráfica, «angle»; en GitHub Actions (sin GPU) el workflow pasa --gl=swangle.
Config.setChromiumOpenGlRenderer("angle");

// Las tarjetas salen del código de fiddle (ver scripts/traer-fiddle.mjs). `@` es el
// alias que usa fiddle por dentro; `@fiddle` es el que usamos aquí, para que se lea
// de dónde viene cada cosa.
const FIDDLE = process.env.FIDDLE_DIR
  ? path.resolve(process.env.FIDDLE_DIR, "src")
  : path.join(process.cwd(), "vendor", "fiddle", "src");

Config.overrideWebpackConfig((config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    alias: {
      ...(config.resolve?.alias as Record<string, string> | undefined),
      "@fiddle": FIDDLE,
      "@": FIDDLE,
      // La caja de fiddle usa el router de Next; en un vídeo no se navega.
      "next/navigation": path.join(process.cwd(), "src", "comun", "next-navigation.ts"),
    },
  },
}));

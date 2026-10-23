// ============================================================================
// TRAER EL CÓDIGO DE FIDDLE
// ----------------------------------------------------------------------------
// Las tarjetas de los vídeos son las de fiddle, dibujadas con su código
// (CaraDelPase, camposDelPase, stripDelPase), nunca con una maqueta aparte: si se
// separan, mienten. Este script baja SOLO `src/` de fiddle (rama main, lo que ven
// los clientes; unos 3 MB) a vendor/fiddle, que no va al repo.
//
// Corre solo tras `npm install`. Para ponerlo al día: `npm run fiddle`.
// Para enseñar algo que aún no está en main: FIDDLE_DIR=../fiddle (la copia local
// de la app); entonces este script no baja nada.
//
// Si falla (sin red, sin git), avisa y sigue: lo que no lleva tarjeta funciona igual.
// ============================================================================

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const REPO = "https://github.com/diegomolinacatala/fiddle.git";
const RAMA = process.env.FIDDLE_RAMA || "main";
const DESTINO = path.join(process.cwd(), "vendor", "fiddle");

const git = (...args) => execFileSync("git", args, { stdio: "inherit" });

if (process.env.FIDDLE_DIR) {
  console.log(`[fiddle] Se usa ${process.env.FIDDLE_DIR} (FIDDLE_DIR): no se baja nada.`);
  process.exit(0);
}

try {
  if (existsSync(path.join(DESTINO, ".git"))) {
    git("-C", DESTINO, "fetch", "--depth", "1", "origin", RAMA);
    git("-C", DESTINO, "reset", "--hard", "FETCH_HEAD");
  } else {
    git("clone", "--depth", "1", "--branch", RAMA, "--filter=blob:none", "--sparse", REPO, DESTINO);
    git("-C", DESTINO, "sparse-checkout", "set", "src");
  }
  const commit = execFileSync("git", ["-C", DESTINO, "log", "-1", "--format=%h %s"]).toString().trim();
  console.log(`[fiddle] Tarjetas de fiddle@${RAMA}: ${commit}`);
} catch {
  console.warn("[fiddle] No se pudo traer el código de fiddle. Las piezas con tarjeta no van a compilar hasta `npm run fiddle`.");
}

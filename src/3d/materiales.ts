import { P } from "../marca";

// ============================================================================
// LOS COLORES DEL 3D
// ----------------------------------------------------------------------------
// La maqueta usa los neutros de la marca (papel, avena, camel, espresso) y el
// verde para lo que es de fiddle o destaca (el mostrador, el toldo, el QR). Lo
// que no está en la paleta (plantas, piel, ropa) va apagado para no comérsela.
// ============================================================================

export const COLOR = {
  base: P.verde,
  suelo: "#d9bb92",
  sueloB: "#cfae84",
  pared: P.crema,
  zocalo: P.verde,
  madera: P.camel,
  maderaOscura: P.camelOscuro,
  pizarra: P.espresso,
  tiza: P.avena,
  metal: "#9a948d",
  metalOscuro: "#3d3631",
  cristal: "#d7e6e1",
  luz: "#ffe2a8",
  planta: "#5d8a5f",
  plantaOscura: "#3f6b47",
  maceta: "#b0704a",
  calle: "#cbc2b5",
  acera: "#ece5da",
  // Barrio: fachadas parecidas entre sí, que la cafetería destaque.
  fachadas: ["#efe6d8", "#e5d6c2", "#ddc9b0", "#e9ddcb", "#d8c4ab", "#f3ece1"],
  tejados: ["#b98c6a", "#9c7b63", "#a68669", "#8d6f5a"],
} as const;

// La gente: variada pero apagada.
export const PIELES = ["#f1cba8", "#e2aa80", "#c48b62", "#94603f", "#6e4530", "#f4d6bd"];
export const ROPAS = ["#c4573a", "#3f6e8c", "#d9a441", "#6b5a8c", "#5b8a6b", "#2f4858", "#e07a5f", "#8c6a4f", "#4d6b7a"];
export const PELOS = ["#2b1d14", "#5a3a22", "#8a5a2b", "#c9a26b", "#1c1c1c", "#9a9088"];

// Lo que dice el aro bajo un cliente (los estados del CRM de fiddle).
export const ESTADO = { viene: "#3f9a63", riesgo: "#e0a63a", perdido: "#9a8f86" } as const;

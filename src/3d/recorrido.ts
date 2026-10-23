import { Easing, interpolate } from "remotion";
import type { V3 } from "./camara";

// ============================================================================
// ANDAR DE UN PUNTO A OTRO
// ----------------------------------------------------------------------------
// Dada una lista de puntos (por el suelo, y = 0), dónde está alguien en un
// fotograma, hacia dónde mira y cuántos pasos lleva (para el balanceo). Va a
// velocidad constante por la distancia, no por tramo: un tramo corto no es más lento.
// Antes de `desde` espera en el primer punto; después, se queda en el último.
// ============================================================================

const LARGO_PASO = 0.42;

export type EnRecorrido = { en: V3; giro: number; fase: number; andando: boolean };

export function enRecorrido(frame: number, puntos: V3[], desde: number, duracion: number): EnRecorrido {
  const largos = puntos.slice(1).map((p, i) => Math.hypot(p[0] - puntos[i][0], p[2] - puntos[i][2]));
  const total = largos.reduce((a, b) => a + b, 0);
  const t = interpolate(frame, [desde, desde + duracion], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.7, 1),
  });
  const andado = total * t;
  const en = puntoA(puntos, largos, andado);
  // Mira un poco por delante: así gira en las esquinas en vez de girar de golpe.
  const delante = puntoA(puntos, largos, Math.min(total, andado + 0.35));
  const ultimo = largos.length - 1;
  const [dx, dz] = andado >= total - 0.01
    ? [puntos[ultimo + 1][0] - puntos[ultimo][0], puntos[ultimo + 1][2] - puntos[ultimo][2]]
    : [delante[0] - en[0], delante[2] - en[2]];
  return { en, giro: Math.atan2(dx, dz), fase: andado / LARGO_PASO, andando: t > 0 && t < 1 };
}

function puntoA(puntos: V3[], largos: number[], distancia: number): V3 {
  let d = distancia;
  for (let i = 0; i < largos.length; i++) {
    if (d <= largos[i] || i === largos.length - 1) {
      const k = largos[i] ? Math.min(1, d / largos[i]) : 0;
      const a = puntos[i];
      const b = puntos[i + 1];
      return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
    }
    d -= largos[i];
  }
  return puntos[puntos.length - 1];
}

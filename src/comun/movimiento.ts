import { Easing, interpolate, spring } from "remotion";

// Todo lo que se mueve sale de aquí: así un vídeo entero tiene el mismo pulso.
// Cada función es PURA (fotograma → número): nada de useFrame, setTimeout ni
// estados, o el render parpadea.

const fijo = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 → 1 con un rebote corto, a partir de `desde`. `suave`: sin rebote. */
export const entrada = (frame: number, fps: number, desde = 0, suave = false) =>
  spring({
    frame: frame - desde,
    fps,
    config: suave ? { damping: 200 } : { damping: 14, stiffness: 160, mass: 0.7 },
  });

/** 1 → 0 en los `dur` fotogramas antes de `hasta`. Sin `hasta`, siempre 1. */
export const salida = (frame: number, hasta?: number, dur = 10) =>
  hasta === undefined
    ? 1
    : interpolate(frame, [hasta - dur, hasta], [1, 0], { ...fijo, easing: Easing.in(Easing.cubic) });

/** 0 → 1 entre `desde` y `desde + dur`, con aceleración y frenada. */
export const tramo = (frame: number, desde: number, dur: number, easing = Easing.inOut(Easing.cubic)) =>
  interpolate(frame, [desde, desde + dur], [0, 1], { ...fijo, easing });

/** Un valor entre `a` y `b` según `t` (0..1). */
export const mezcla = (a: number, b: number, t: number) => a + (b - a) * t;

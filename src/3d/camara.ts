import * as THREE from "three";
import { Easing } from "remotion";

// ============================================================================
// LA CÁMARA, COMO DATOS
// ----------------------------------------------------------------------------
// Una cámara es dónde está, a dónde mira y cuánto abarca. Se guarda como datos
// (no como objeto de three) por dos cosas:
// - se anima con claves: `camaraEn(frame, claves)` mezcla entre una y otra;
// - lo plano que va encima de la escena (un bocadillo sobre un cliente) tiene que
//   saber dónde cae un punto 3D en la pantalla: `aPantalla` usa ESTA misma cámara.
//   Si la escena y lo de encima calcularan cada uno la suya, se despegarían.
// ============================================================================

export type V3 = [number, number, number];

export type Camara = {
  posicion: V3;
  mira: V3;
  /** Perspectiva: el ángulo vertical. Cerrado (25-35) se parece a una maqueta. */
  fov?: number;
  /** Si viene, ortográfica (isométrica): cuántas unidades caben de alto. */
  orto?: number;
};

export type Clave = { en: number; camara: Camara };

const mezclaV = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const mezclaN = (a: number | undefined, b: number | undefined, t: number) => (a === undefined || b === undefined ? (a ?? b) : a + (b - a) * t);

/** La cámara en un fotograma, mezclando entre las claves que lo rodean. */
export function camaraEn(frame: number, claves: Clave[], easing: (t: number) => number = Easing.inOut(Easing.cubic)): Camara {
  if (frame <= claves[0].en) return claves[0].camara;
  for (let i = 0; i < claves.length - 1; i++) {
    const a = claves[i];
    const b = claves[i + 1];
    if (frame <= b.en) {
      const t = easing((frame - a.en) / (b.en - a.en));
      return { posicion: mezclaV(a.camara.posicion, b.camara.posicion, t), mira: mezclaV(a.camara.mira, b.camara.mira, t), fov: mezclaN(a.camara.fov, b.camara.fov, t), orto: mezclaN(a.camara.orto, b.camara.orto, t) };
    }
  }
  return claves[claves.length - 1].camara;
}

/** Pone en una cámara de three lo que dicen los datos. */
export function aplicarCamara(cam: THREE.PerspectiveCamera | THREE.OrthographicCamera, c: Camara, aspecto: number) {
  if (cam instanceof THREE.OrthographicCamera) {
    const alto = c.orto ?? 10;
    cam.left = (-alto * aspecto) / 2;
    cam.right = (alto * aspecto) / 2;
    cam.top = alto / 2;
    cam.bottom = -alto / 2;
  } else {
    cam.fov = c.fov ?? 30;
    cam.aspect = aspecto;
  }
  cam.near = 0.1;
  cam.far = 500;
  cam.position.set(...c.posicion);
  cam.lookAt(...c.mira);
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld();
}

export const crearCamara = (c: Camara, aspecto: number) => {
  const cam = c.orto !== undefined ? new THREE.OrthographicCamera() : new THREE.PerspectiveCamera();
  aplicarCamara(cam, c, aspecto);
  return cam;
};

/** Dónde cae un punto de la escena en el vídeo, en px. `delante`: si se ve. */
export function aPantalla(punto: V3, c: Camara, ancho: number, alto: number) {
  const v = new THREE.Vector3(...punto).project(crearCamara(c, ancho / alto));
  return { x: ((v.x + 1) / 2) * ancho, y: ((1 - v.y) / 2) * alto, delante: v.z > -1 && v.z < 1 };
}

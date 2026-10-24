import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { ANCHO, ALTO } from "../formato";
import { aplicarCamara, type Camara } from "./camara";
import { P } from "../marca";

// ============================================================================
// LA ESCENA 3D
// ----------------------------------------------------------------------------
// Un lienzo de three del tamaño del vídeo, con la luz de la casa (cálida, de
// arriba a la izquierda, sombras suaves) y la cámara que se le pase como datos.
//
// Todo lo que se mueve depende del fotograma (useCurrentFrame), NUNCA de useFrame
// de react-three-fiber: el render saca los fotogramas sueltos y en cualquier
// orden, y lo que va por su cuenta parpadea.
//
// `fondo = null`: transparente, para poner la escena sobre algo plano (y lo plano
// encima con <SobreEscena>). Así se combinan los dos kits.
// ============================================================================

type Props = {
  camara: Camara;
  fondo?: string | null;
  /** Niebla del color del fondo entre estas dos distancias: da profundidad al barrio. */
  niebla?: [number, number];
  /** Medio lado de lo que tiene que tener sombra, en unidades. */
  alcanceSombra?: number;
  children: React.ReactNode;
};

export const Escena: React.FC<Props> = ({ camara, fondo = P.papel, niebla, alcanceSombra = 10, children }) => {
  const width = ANCHO;
  const height = ALTO;
  return (
    <ThreeCanvas width={width} height={height} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      {fondo && <color attach="background" args={[fondo]} />}
      {fondo && niebla && <fog attach="fog" args={[fondo, niebla[0], niebla[1]]} />}
      <CamaraDeDatos camara={camara} />
      <Luces alcance={alcanceSombra} />
      {children}
    </ThreeCanvas>
  );
};

const CamaraDeDatos: React.FC<{ camara: Camara }> = ({ camara }) => {
  const set = useThree((s) => s.set);
  const size = useThree((s) => s.size);
  const orto = camara.orto !== undefined;
  const cam = useMemo(() => (orto ? new THREE.OrthographicCamera() : new THREE.PerspectiveCamera()), [orto]);
  // Se coloca en el render (no en un efecto): el fotograma sale ya con ella.
  aplicarCamara(cam, camara, size.width / size.height);
  useLayoutEffect(() => {
    set({ camera: cam });
  }, [cam, set]);
  return null;
};

export const Luces: React.FC<{ alcance?: number }> = ({ alcance = 10 }) => (
  <>
    <hemisphereLight args={["#fff6ea", P.camel, 1.2]} />
    <ambientLight intensity={0.25} />
    <directionalLight
      position={[alcance * 0.6, alcance * 1.4, alcance * 0.9]}
      intensity={2.4}
      color="#fff1dc"
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-bias={-0.0005}
      shadow-normalBias={0.02}
      shadow-camera-left={-alcance}
      shadow-camera-right={alcance}
      shadow-camera-top={alcance}
      shadow-camera-bottom={-alcance}
      shadow-camera-near={0.5}
      shadow-camera-far={alcance * 5}
    />
  </>
);

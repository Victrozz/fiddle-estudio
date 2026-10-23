import React, { useMemo } from "react";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { V3 } from "./camara";

// ============================================================================
// LAS PIEZAS DE CONSTRUIR
// ----------------------------------------------------------------------------
// Con esto se hace todo lo demás: cajas de cantos redondos, cilindros y bolas,
// mate (como de arcilla o madera pintada). `en` es dónde se APOYA la pieza (el
// centro de su base), no su centro: así se monta como una maqueta, de abajo arriba.
// ============================================================================

type Comun = { en?: V3; color: string; giro?: V3; sombra?: boolean; rugosidad?: number; brillo?: string; opacidad?: number };

const Material: React.FC<Pick<Comun, "color" | "rugosidad" | "brillo" | "opacidad">> = ({ color, rugosidad = 0.85, brillo, opacidad }) => (
  <meshStandardMaterial
    color={color}
    roughness={rugosidad}
    metalness={0}
    emissive={brillo ?? "#000000"}
    emissiveIntensity={brillo ? 1.2 : 0}
    transparent={opacidad !== undefined}
    opacity={opacidad ?? 1}
  />
);

/** Una caja de cantos redondos. `tam` = [ancho, alto, fondo]. */
export const Bloque: React.FC<Comun & { tam: V3; radio?: number }> = ({ tam, en = [0, 0, 0], giro, radio = 0.05, sombra = true, ...m }) => {
  const [w, h, d] = tam;
  const geo = useMemo(() => new RoundedBoxGeometry(w, h, d, 3, Math.min(radio, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001)), [w, h, d, radio]);
  return (
    <mesh geometry={geo} position={[en[0], en[1] + h / 2, en[2]]} rotation={giro} castShadow={sombra} receiveShadow>
      <Material {...m} />
    </mesh>
  );
};

/** Un cilindro (o un cono, con `radioArriba`). */
export const Cilindro: React.FC<Comun & { radio: number; alto: number; radioArriba?: number; lados?: number }> = ({ radio, alto, radioArriba, lados = 32, en = [0, 0, 0], giro, sombra = true, ...m }) => (
  <mesh position={[en[0], en[1] + alto / 2, en[2]]} rotation={giro} castShadow={sombra} receiveShadow>
    <cylinderGeometry args={[radioArriba ?? radio, radio, alto, lados]} />
    <Material {...m} />
  </mesh>
);

/** Una bola. Aquí `en` es su CENTRO (una bola no se apoya). */
export const Bola: React.FC<Comun & { radio: number; escala?: V3 }> = ({ radio, escala, en = [0, 0, 0], sombra = true, ...m }) => (
  <mesh position={en} scale={escala} castShadow={sombra} receiveShadow>
    <sphereGeometry args={[radio, 32, 20]} />
    <Material {...m} />
  </mesh>
);

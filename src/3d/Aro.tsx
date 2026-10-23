import React from "react";
import { useCurrentFrame } from "remotion";
import type { V3 } from "./camara";
import { ESTADO } from "./materiales";

// El aro en el suelo bajo un cliente, como en un videojuego: de qué color va
// según cómo viene (`estado`, los del CRM de fiddle). Late despacio para que se vea.

type Props = { en: V3; estado?: keyof typeof ESTADO; color?: string; radio?: number; visible?: number };

export const Aro: React.FC<Props> = ({ en, estado = "viene", color, radio = 0.5, visible = 1 }) => {
  const frame = useCurrentFrame();
  const late = 1 + Math.sin(frame / 7) * 0.06;
  if (visible <= 0) return null;
  return (
    <mesh position={[en[0], 0.02, en[2]]} rotation={[-Math.PI / 2, 0, 0]} scale={late * visible}>
      <ringGeometry args={[radio * 0.78, radio, 48]} />
      <meshBasicMaterial color={color ?? ESTADO[estado]} transparent opacity={0.9 * visible} toneMapped={false} />
    </mesh>
  );
};

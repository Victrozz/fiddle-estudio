import React from "react";
import { random } from "remotion";
import type { V3 } from "./camara";
import { PELOS, PIELES, ROPAS } from "./materiales";

// ============================================================================
// UNA PERSONA
// ----------------------------------------------------------------------------
// Un muñeco de juguete: cuerpo de cápsula, cabeza redonda, ojos y brazos que se
// balancean al andar. Sin cara detallada ni piernas a propósito: con más detalle
// cae en lo raro, y así se lee de lejos (en el barrio) y de cerca (en la barra).
//
// Mide unas 1,25 unidades. `fase` = pasos dados (sale de `enRecorrido`); con 0
// está quieto. `semilla` elige piel, ropa y pelo, siempre los mismos.
// ============================================================================

export type Aspecto = { ropa?: string; piel?: string; pelo?: string | null; delantal?: string };

type Props = Aspecto & {
  en: V3;
  /** Hacia dónde mira, en radianes (0 = hacia +z, hacia la cámara de partida). */
  giro?: number;
  fase?: number;
  escala?: number;
  semilla?: string;
  /** 0..1: un saltito de alegría (al ganar el premio). */
  salto?: number;
};

export const aspectoDe = (semilla: string): Required<Omit<Aspecto, "delantal">> => ({
  ropa: ROPAS[Math.floor(random(`${semilla}-r`) * ROPAS.length)],
  piel: PIELES[Math.floor(random(`${semilla}-p`) * PIELES.length)],
  pelo: random(`${semilla}-calvo`) < 0.12 ? null : PELOS[Math.floor(random(`${semilla}-h`) * PELOS.length)],
});

export const Persona: React.FC<Props> = ({ en, giro = 0, fase = 0, escala = 1, semilla = "persona", salto = 0, ...aspecto }) => {
  const a = { ...aspectoDe(semilla), ...aspecto };
  const paso = Math.sin(fase * Math.PI);
  const bote = Math.abs(paso) * 0.06 + Math.sin(salto * Math.PI) * 0.35;
  const brazo = paso * 0.6;
  const mat = (color: string) => <meshStandardMaterial color={color} roughness={0.8} />;
  return (
    <group position={[en[0], en[1] + bote, en[2]]} rotation={[0, giro, paso * 0.04]} scale={escala}>
      {/* cuerpo */}
      <mesh position={[0, 0.47, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.26, 0.42, 8, 20]} />
        {mat(a.ropa)}
      </mesh>
      {a.delantal && (
        <mesh position={[0, 0.42, 0.17]} castShadow>
          <boxGeometry args={[0.36, 0.5, 0.12]} />
          {mat(a.delantal)}
        </mesh>
      )}
      {/* brazos */}
      {[-1, 1].map((lado) => (
        <group key={lado} position={[0.29 * lado, 0.7, 0]} rotation={[brazo * lado, 0, 0.12 * lado]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <capsuleGeometry args={[0.075, 0.24, 6, 12]} />
            {mat(a.ropa)}
          </mesh>
        </group>
      ))}
      {/* cabeza */}
      <mesh position={[0, 1.08, 0]} castShadow>
        <sphereGeometry args={[0.22, 32, 20]} />
        {mat(a.piel)}
      </mesh>
      {a.pelo && (
        <mesh position={[0, 1.1, -0.015]} castShadow>
          <sphereGeometry args={[0.232, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          {mat(a.pelo)}
        </mesh>
      )}
      {[-1, 1].map((lado) => (
        <mesh key={lado} position={[0.075 * lado, 1.1, 0.2]}>
          <sphereGeometry args={[0.027, 12, 8]} />
          <meshStandardMaterial color="#1f1812" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
};

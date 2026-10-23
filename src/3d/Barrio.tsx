import React, { useMemo } from "react";
import { random } from "remotion";
import { Bloque, Bola, Cilindro } from "./piezas";
import { COLOR } from "./materiales";
import type { V3 } from "./camara";

// ============================================================================
// EL BARRIO (mapa)
// ----------------------------------------------------------------------------
// Manzanas con casas de alturas distintas, árboles en las esquinas, calles, y UNA
// cafetería con el toldo verde: la tienda. Sirve para «la gente va y viene» visto
// desde arriba. Todo sale de la semilla: el mismo barrio cada vez.
//
// Para mover gente por las calles, `disposicionBarrio()` da los cruces y la
// puerta de la cafetería con las MISMAS medidas con que se dibuja.
// ============================================================================

// Casas bajas y calles anchas a propósito: lo que importa es la gente que va por
// la calle, y con edificios altos la cámara de arriba no la ve.
const MANZANA = 4;
const CALLE = 2.2;
const PASO = MANZANA + CALLE;
const ACERA = 0.12;

type Opciones = { columnas?: number; filas?: number; cafe?: [number, number]; semilla?: string };

export function disposicionBarrio({ columnas = 4, filas = 6, cafe = [1, 3] }: Opciones = {}) {
  const centro = (i: number, j: number): V3 => [(i + 0.5 - columnas / 2) * PASO, 0, (j + 0.5 - filas / 2) * PASO];
  /** El cruce de calles en la esquina (i, j), con i de 0 a columnas y j de 0 a filas. */
  const cruce = (i: number, j: number): V3 => [(i - columnas / 2) * PASO, 0, (j - filas / 2) * PASO];
  const [cx, , cz] = centro(cafe[0], cafe[1]);
  return {
    columnas,
    filas,
    cafe,
    centro,
    cruce,
    /** En el bordillo, delante de la puerta de la cafetería. */
    puerta: [cx + MANZANA / 4 + 0.3, 0, cz + MANZANA / 2 + 0.2] as V3,
    /** En medio de la calle, frente a la puerta (para llegar andando por la calle). */
    frentePuerta: [cx + MANZANA / 4 + 0.3, 0, cz + PASO / 2] as V3,
    ancho: columnas * PASO + CALLE,
    fondo: filas * PASO + CALLE,
  };
}

export const Barrio: React.FC<Opciones & { children?: React.ReactNode }> = ({ semilla = "barrio", children, ...op }) => {
  const b = disposicionBarrio(op);
  const casas = useMemo(() => {
    const lista: { en: V3; tam: V3; fachada: string; tejado: string }[] = [];
    for (let i = 0; i < b.columnas; i++)
      for (let j = 0; j < b.filas; j++)
        for (const [qx, qz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
          const esCafe = i === b.cafe[0] && j === b.cafe[1] && qx === 1 && qz === 1;
          const s = `${semilla}-${i}-${j}-${qx}-${qz}`;
          if (esCafe || random(`${s}-hay`) < 0.2) continue;
          const [cx, , cz] = b.centro(i, j);
          const w = 1.4 + random(`${s}-w`) * 0.35;
          const d = 1.4 + random(`${s}-d`) * 0.35;
          lista.push({
            en: [cx + (qx * MANZANA) / 4, ACERA, cz + (qz * MANZANA) / 4],
            tam: [w, 0.8 + random(`${s}-h`) * 1.2, d],
            fachada: COLOR.fachadas[Math.floor(random(`${s}-f`) * COLOR.fachadas.length)],
            tejado: COLOR.tejados[Math.floor(random(`${s}-t`) * COLOR.tejados.length)],
          });
        }
    return lista;
  }, [b.columnas, b.filas, b.cafe, semilla]);

  const [kx, , kz] = b.centro(b.cafe[0], b.cafe[1]);
  const cafe: V3 = [kx + MANZANA / 4, ACERA, kz + MANZANA / 4];

  return (
    <group>
      {/* las calles y las aceras */}
      <Bloque tam={[b.ancho, 0.3, b.fondo]} en={[0, -0.3, 0]} color={COLOR.calle} radio={0.1} />
      {Array.from({ length: b.columnas * b.filas }, (_, k) => {
        const [x, , z] = b.centro(k % b.columnas, Math.floor(k / b.columnas));
        return <Bloque key={k} tam={[MANZANA, ACERA, MANZANA]} en={[x, 0, z]} color={COLOR.acera} radio={0.12} sombra={false} />;
      })}

      {casas.map((c, k) => (
        <group key={k}>
          <Bloque tam={c.tam} en={c.en} color={c.fachada} radio={0.06} />
          <Bloque tam={[c.tam[0] + 0.02, 0.32, c.tam[2] + 0.02]} en={c.en} color={COLOR.tejados[k % COLOR.tejados.length]} radio={0.04} />
          <Bloque tam={[c.tam[0] + 0.08, 0.1, c.tam[2] + 0.08]} en={[c.en[0], c.en[1] + c.tam[1], c.en[2]]} color={c.tejado} radio={0.03} />
        </group>
      ))}

      {/* árboles en las esquinas de cada manzana */}
      {Array.from({ length: b.columnas * b.filas }, (_, k) => {
        const [x, , z] = b.centro(k % b.columnas, Math.floor(k / b.columnas));
        return [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([qx, qz]) => (
          <group key={`${k}${qx}${qz}`} position={[x + qx * (MANZANA / 2 - 0.3), ACERA, z + qz * (MANZANA / 2 - 0.3)]}>
            <Cilindro radio={0.06} alto={0.45} color={COLOR.maderaOscura} />
            <Bola radio={0.32} en={[0, 0.72, 0]} color={(k + qx) % 2 ? COLOR.planta : COLOR.plantaOscura} />
          </group>
        ));
      })}

      {/* la cafetería: crema, con su toldo y su rótulo verdes */}
      <Bloque tam={[1.8, 1.3, 1.8]} en={cafe} color={COLOR.pared} radio={0.06} />
      <Bloque tam={[1.82, 0.1, 1.82]} en={[cafe[0], cafe[1] + 1.3, cafe[2]]} color={COLOR.base} radio={0.03} />
      <Bloque tam={[1.6, 0.08, 0.55]} en={[cafe[0], cafe[1] + 0.92, cafe[2] + 1.1]} giro={[0.35, 0, 0]} color={COLOR.base} radio={0.02} />
      <Bloque tam={[0.55, 0.85, 0.04]} en={[cafe[0] + 0.3, cafe[1], cafe[2] + 0.91]} color={COLOR.metalOscuro} radio={0.02} sombra={false} />
      <Bloque tam={[0.6, 0.55, 0.04]} en={[cafe[0] - 0.42, cafe[1] + 0.25, cafe[2] + 0.91]} color={COLOR.cristal} brillo="#5d7a74" radio={0.02} sombra={false} />

      {children}
    </group>
  );
};

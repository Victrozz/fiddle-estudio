import React from "react";
import { Bloque, Bola, Cilindro } from "./piezas";
import { Persona } from "./Persona";
import { COLOR } from "./materiales";
import type { V3 } from "./camara";

// ============================================================================
// LA CAFETERÍA (maqueta)
// ----------------------------------------------------------------------------
// Una cafetería abierta por delante, como una maqueta sobre su peana: dos paredes,
// la barra con la cafetera y la vitrina, el QR de fiddle en el mostrador, mesas,
// plantas y lámparas. Mide 7 x 6 (unidades ≈ metros) y su centro está en el origen.
//
// Lo que hace falta para mover gente por dentro está en SITIOS (dónde se entra,
// dónde se paga, dónde se sienta uno). La cámara de partida, en CAMARA_CAFE.
// `children`: los clientes (y lo que se quiera añadir) van dentro.
// ============================================================================

/** La altura del suelo: la gente se apoya aquí. */
export const SUELO = 0.06;

export const SITIOS = {
  /** Fuera, por delante a la derecha: de aquí llega la gente. */
  calle: [4.2, SUELO, 4.4] as V3,
  entrada: [2.6, SUELO, 2.4] as V3,
  /** Frente al QR del mostrador: donde se escanea la tarjeta. */
  caja: [-0.7, SUELO, -0.85] as V3,
  /** Detrás de la barra. */
  barra: [-0.2, SUELO, -2.55] as V3,
  /** Junto a cada mesa, de pie. */
  mesas: [[-2.05, SUELO, 0.35], [1.0, SUELO, 1.75]] as V3[],
  /** Encima del QR, para un bocadillo o un aviso. */
  qr: [-1.15, 1.45, -1.45] as V3,
};

export const CAMARA_CAFE = { posicion: [11, 9.5, 11] as V3, mira: [0, 0.9, 0] as V3, orto: 15 };

type Props = { conBarista?: boolean; children?: React.ReactNode };

export const Cafeteria: React.FC<Props> = ({ conBarista = true, children }) => (
  <group>
    {/* la peana y el suelo de tablas */}
    <Bloque tam={[7.4, 0.5, 6.4]} en={[0, -0.5, 0]} color={COLOR.base} radio={0.12} />
    {Array.from({ length: 14 }, (_, i) => (
      <Bloque key={i} tam={[0.49, 0.06, 6]} en={[-3.25 + i * 0.5, 0, 0]} color={i % 2 ? COLOR.suelo : COLOR.sueloB} radio={0.015} sombra={false} />
    ))}

    {/* paredes con zócalo verde */}
    <Bloque tam={[7, 3.2, 0.2]} en={[0, 0, -3.1]} color={COLOR.pared} radio={0.03} />
    <Bloque tam={[0.2, 3.2, 6.2]} en={[-3.6, 0, 0]} color={COLOR.pared} radio={0.03} />
    <Bloque tam={[7, 1, 0.26]} en={[0, 0, -3.08]} color={COLOR.zocalo} radio={0.03} />
    <Bloque tam={[0.26, 1, 6.2]} en={[-3.58, 0, 0]} color={COLOR.zocalo} radio={0.03} />

    {/* la ventana */}
    <Bloque tam={[0.08, 1.5, 2.3]} en={[-3.46, 1.25, 0.7]} color={COLOR.zocalo} radio={0.02} />
    <Bloque tam={[0.06, 1.3, 2.1]} en={[-3.42, 1.35, 0.7]} color={COLOR.cristal} brillo="#5d7a74" radio={0.01} sombra={false} />
    <Bloque tam={[0.1, 0.06, 2.1]} en={[-3.4, 1.97, 0.7]} color={COLOR.zocalo} radio={0.01} />
    <Bloque tam={[0.1, 1.3, 0.06]} en={[-3.4, 1.35, 0.7]} color={COLOR.zocalo} radio={0.01} />

    {/* la pizarra del menú (rayas de tiza, sin letras) */}
    <Bloque tam={[1.9, 1.2, 0.06]} en={[-1.5, 1.45, -2.97]} color={COLOR.pizarra} radio={0.02} />
    {[1.25, 1.0, 0.8, 0.55].map((w, i) => (
      <Bloque key={i} tam={[w, 0.05, 0.02]} en={[-1.5 - (1.25 - w) / 2, 2.35 - i * 0.22, -2.93]} color={COLOR.tiza} radio={0.01} sombra={false} />
    ))}

    {/* la balda con botes */}
    <Bloque tam={[1.7, 0.06, 0.35]} en={[1.7, 2.05, -2.83]} color={COLOR.madera} radio={0.01} />
    {[1.05, 1.4, 1.75, 2.1, 2.4].map((x, i) => (
      <Cilindro key={i} radio={0.1} alto={0.22 + (i % 2) * 0.08} en={[x, 2.11, -2.83]} color={i % 2 ? COLOR.tiza : COLOR.maderaOscura} />
    ))}

    {/* la barra */}
    <Bloque tam={[3.6, 1, 0.85]} en={[0.9, 0, -1.9]} color={COLOR.zocalo} radio={0.05} />
    <Bloque tam={[3.8, 0.08, 1.0]} en={[0.9, 1, -1.9]} color={COLOR.madera} radio={0.03} />

    {/* la cafetera */}
    <Bloque tam={[0.85, 0.5, 0.5]} en={[1.95, 1.08, -2.1]} color={COLOR.metal} radio={0.06} />
    <Bloque tam={[0.9, 0.06, 0.55]} en={[1.95, 1.58, -2.1]} color={COLOR.metalOscuro} radio={0.02} />
    {[1.75, 2.15].map((x) => (
      <Cilindro key={x} radio={0.06} alto={0.12} en={[x, 1.2, -1.82]} color={COLOR.metalOscuro} />
    ))}
    {[1.8, 2.0, 2.2].map((x) => (
      <Cilindro key={x} radio={0.06} alto={0.08} radioArriba={0.075} en={[x, 1.64, -2.1]} color={COLOR.tiza} />
    ))}

    {/* la vitrina con bollos */}
    <Bloque tam={[0.95, 0.45, 0.6]} en={[0.35, 1.08, -1.85]} color={COLOR.cristal} opacidad={0.35} radio={0.03} sombra={false} />
    {[0.12, 0.35, 0.58].map((x) => (
      <Bola key={x} radio={0.09} escala={[1.3, 0.6, 1]} en={[x, 1.16, -1.85]} color={COLOR.madera} />
    ))}

    {/* el QR de fiddle y el móvil de la caja */}
    <Bloque tam={[0.3, 0.38, 0.04]} en={[-1.15, 1.08, -1.5]} giro={[-0.15, 0, 0]} color={COLOR.tiza} radio={0.015} />
    <Bloque tam={[0.2, 0.2, 0.02]} en={[-1.15, 1.17, -1.47]} giro={[-0.15, 0, 0]} color={COLOR.zocalo} radio={0.01} sombra={false} />
    <Bloque tam={[0.2, 0.36, 0.03]} en={[-0.55, 1.08, -1.75]} giro={[-0.35, 0.2, 0]} color={COLOR.metalOscuro} radio={0.03} />

    {/* lámparas */}
    {[-0.2, 0.9, 2.0].map((x) => (
      <group key={x}>
        <Cilindro radio={0.012} alto={0.8} en={[x, 2.45, -1.9]} color={COLOR.metalOscuro} sombra={false} />
        <Cilindro radio={0.24} radioArriba={0.06} alto={0.24} en={[x, 2.28, -1.9]} color={COLOR.zocalo} sombra={false} />
        <Bola radio={0.075} en={[x, 2.28, -1.9]} color={COLOR.luz} brillo={COLOR.luz} sombra={false} />
      </group>
    ))}

    {/* mesas y sillas */}
    <Mesa en={[-1.7, SUELO, 1.0]} />
    <Mesa en={[1.6, SUELO, 1.2]} />

    {/* plantas */}
    <Planta en={[-3.05, SUELO, -2.55]} alta />
    <Planta en={[3.05, SUELO, -2.6]} />
    <Planta en={[-3.05, SUELO, 2.6]} />

    {/* la alfombra de la entrada */}
    <Bloque tam={[1.3, 0.02, 0.8]} en={[2.6, SUELO, 2.55]} color={COLOR.zocalo} radio={0.01} sombra={false} />

    {conBarista && <Persona en={SITIOS.barra} escala={1.12} semilla="barista" ropa="#efe6d8" delantal={COLOR.zocalo} pelo="#2b1d14" />}
    {children}
  </group>
);

const Mesa: React.FC<{ en: V3 }> = ({ en }) => (
  <group position={en}>
    <Cilindro radio={0.48} alto={0.06} en={[0, 0.74, 0]} color={COLOR.madera} />
    <Cilindro radio={0.05} alto={0.74} en={[0, 0, 0]} color={COLOR.metalOscuro} />
    <Cilindro radio={0.24} alto={0.03} en={[0, 0, 0]} color={COLOR.metalOscuro} />
    <Cilindro radio={0.06} alto={0.08} radioArriba={0.075} en={[0.12, 0.8, 0.05]} color={COLOR.tiza} />
    {[0, Math.PI].map((g) => (
      <group key={g} rotation={[0, g, 0]}>
        <Silla en={[0, 0, -0.75]} />
      </group>
    ))}
  </group>
);

const Silla: React.FC<{ en: V3 }> = ({ en }) => (
  <group position={en}>
    <Bloque tam={[0.44, 0.06, 0.42]} en={[0, 0.45, 0]} color={COLOR.maderaOscura} radio={0.02} />
    <Bloque tam={[0.44, 0.42, 0.06]} en={[0, 0.51, -0.19]} color={COLOR.maderaOscura} radio={0.02} />
    {[[-0.18, -0.17], [0.18, -0.17], [-0.18, 0.17], [0.18, 0.17]].map(([x, z]) => (
      <Cilindro key={`${x}${z}`} radio={0.025} alto={0.45} en={[x, 0, z]} color={COLOR.metalOscuro} />
    ))}
  </group>
);

const Planta: React.FC<{ en: V3; alta?: boolean }> = ({ en, alta = false }) => (
  <group position={en}>
    <Cilindro radio={0.22} radioArriba={0.27} alto={0.42} en={[0, 0, 0]} color={COLOR.maceta} />
    <Bola radio={0.38} en={[0, alta ? 0.95 : 0.72, 0]} color={COLOR.planta} />
    <Bola radio={0.28} en={[0.16, alta ? 1.35 : 0.98, 0.06]} color={COLOR.plantaOscura} />
    {alta && <Bola radio={0.26} en={[-0.12, 1.6, -0.05]} color={COLOR.planta} />}
  </group>
);

import React, { useMemo } from "react";
import CaraDelPase from "@fiddle/app/CaraDelPase";
import { LogoApple } from "@fiddle/app/LogoTienda";
import { CAFETERIA, DISENOS, avisoDe, ejemplo } from "@fiddle/app/home/demo";

// ============================================================================
// LA TARJETA DE VERDAD
// ----------------------------------------------------------------------------
// La misma cara que ve el cliente en su móvil: CaraDelPase de fiddle, con las
// tiendas inventadas de la web (src/app/home/demo.js, todas «Tu cafetería»).
// Nunca una tarjeta dibujada a mano ni la de un cliente real.
//
// `diseno`: un id de DISENOS (abierto, vaso, luna, doble, forma, iniciales,
// cerrado, galleta, escalera, pulso, porciones, planta, anillos, aguja, torre,
// cifra, camino, manzana, corazon, taza). Sin él, la de fiddle: crema y verde.
// ============================================================================

type Datos = {
  diseno?: string;
  puntos?: number;
  puntos2?: number;
  estado?: "abierto" | "cerrado" | null;
  /** Colores u otras piezas del tema encima de las del diseño («con tus colores»). Colores, solo #rrggbb. */
  tema?: Record<string, string>;
};

// En la web la tarjeta se pinta a este ancho; aquí se amplía con `zoom`, que vuelve
// a maquetar a escala (las letras salen nítidas, no una foto estirada).
const ANCHO_WEB = 360;

/** La tienda y el cliente de ejemplo, ya como los ve el navegador. */
export function datosDeTarjeta({ diseno, puntos, puntos2, estado, tema }: Datos) {
  const d = diseno ? DISENOS.find((x: { id: string }) => x.id === diseno) : null;
  if (diseno && !d) throw new Error(`No hay diseño «${diseno}» en DISENOS de fiddle`);
  const base = d ? d.tienda : CAFETERIA;
  const tienda = tema ? { ...base, tema: { ...base.tema, ...tema } } : base;
  return ejemplo(tienda, puntos ?? d?.sellos ?? 3, {
    sellos2: puntos2 ?? d?.sellos2 ?? 0,
    estado: estado === undefined ? (d?.estado ?? null) : estado,
  });
}

export const Tarjeta: React.FC<Datos & { ancho?: number; style?: React.CSSProperties }> = ({ ancho = 760, style, ...datos }) => {
  const { diseno, puntos, puntos2, estado, tema } = datos;
  const clave = JSON.stringify(tema ?? null);
  const d = useMemo(() => datosDeTarjeta({ diseno, puntos, puntos2, estado, tema }), [diseno, puntos, puntos2, estado, clave]);
  return (
    <div style={{ width: ANCHO_WEB, zoom: ancho / ANCHO_WEB, ...style }}>
      <CaraDelPase negocio={d.negocio} cliente={d.cliente} estado={d.estado} />
    </div>
  );
};

/** Lo que dice la pantalla de bloqueo tras sumar un punto, como lo escribe el iPhone. */
export const avisoDeTarjeta = (datos: Datos) => {
  const d = datosDeTarjeta(datos);
  return { tienda: d.negocio.nombre as string, texto: avisoDe(d) as string, tema: d.negocio.tema };
};

/** El logo de la tienda de ejemplo, como sale en el pase. */
export const LogoDeTarjeta: React.FC<Datos & { tam?: number }> = ({ tam = 38, ...datos }) => {
  const d = datosDeTarjeta(datos);
  return <LogoApple tema={d.negocio.tema} tam={tam} style={{}} />;
};

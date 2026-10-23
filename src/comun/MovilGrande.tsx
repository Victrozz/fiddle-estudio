import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Movil, PUNTOS } from "./Movil";
import { NotificacionDeTienda } from "./PantallaBloqueo";
import { entrada } from "./movimiento";
import { ANCHO } from "../formato";

// ============================================================================
// EL MÓVIL GRANDE QUE SUBE, Y EL AVISO QUE SE SALE DE ÉL
// ----------------------------------------------------------------------------
// Un móvil entero en un vídeo vertical se queda pequeño: lo de dentro no se lee.
// Este sube desde abajo, grande, y se corta por abajo (lo de arriba es lo que
// importa; los subtítulos van encima de su pantalla). Un aviso en un móvil no se
// lee nunca a tamaño real: <AvisoGrande> lo saca fuera, ampliado, encima del móvil.
// ============================================================================

type Props = { desde: number; ancho?: number; arriba?: number; children: React.ReactNode; pantalla?: string };

export const MovilGrande: React.FC<Props> = ({ desde, ancho = 640, arriba = 270, children, pantalla }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = entrada(frame, fps, desde, true);
  return (
    <div style={{ position: "absolute", left: (ANCHO - ancho) / 2, top: arriba + (1 - e) * 900 }}>
      <Movil ancho={ancho} pantalla={pantalla}>
        {children}
      </Movil>
    </div>
  );
};

/** Dónde cae, en el vídeo, un punto de la pantalla de un <MovilGrande> (en puntos). */
export const puntoDelMovil = (y: number, { ancho = 640, arriba = 270 } = {}) => arriba + ancho * 0.032 + (y * (ancho - ancho * 0.064)) / PUNTOS.ancho;

type Aviso = { texto: string; desde: number; arriba: number; ancho?: number; diseno?: string };

export const AvisoGrande: React.FC<Aviso> = ({ texto, desde, arriba, ancho = 920, diseno }) => {
  const frame = useCurrentFrame();
  if (frame < desde - 2) return null;
  const base = 380;
  return (
    <div style={{ position: "absolute", left: (ANCHO - ancho) / 2, top: arriba, width: ancho, filter: "drop-shadow(0 18px 40px rgba(0,0,0,.35))" }}>
      <div style={{ width: base, zoom: ancho / base }}>
        <NotificacionDeTienda texto={texto} desde={desde} diseno={diseno} />
      </div>
    </div>
  );
};

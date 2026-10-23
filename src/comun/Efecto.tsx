import React from "react";
import { Html5Audio, Sequence, staticFile } from "remotion";

// ============================================================================
// LOS SONIDOS
// ----------------------------------------------------------------------------
// Efectos cortos sintetizados aquí mismo (scripts/sintetizar-sonidos.mjs): sin
// licencias de nadie. La MÚSICA no va en el vídeo: se pone en TikTok o Instagram
// al publicar, con un sonido de los que están sonando (y con su licencia).
// ============================================================================

export const SONIDOS = ["pop", "tic", "ding", "golpe", "zas", "caja"] as const;
export type Sonido = (typeof SONIDOS)[number];

type Props = { sonido: Sonido; en: number; volumen?: number };

export const Efecto: React.FC<Props> = ({ sonido, en, volumen = 0.7 }) => (
  <Sequence from={en} durationInFrames={45} layout="none">
    <Html5Audio src={staticFile(`sonidos/${sonido}.wav`)} volume={volumen} />
  </Sequence>
);

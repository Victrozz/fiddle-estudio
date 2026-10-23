import React from "react";
import { Composition, Folder } from "remotion";
import { ANCHO, ALTO, FPS } from "./formato";
import { MuestrarioComun, DURACION_COMUN } from "./muestrario/Comun";
import { MuestrarioFlat, DURACION_FLAT } from "./muestrario/Flat";
import { MuestrarioTresD, DURACION_3D } from "./muestrario/TresD";
import { VIDEOS } from "./videos";

// Lo que sale en el Studio: los vídeos (uno por entrada de VIDEOS, en
// src/videos/index.ts) y los muestrarios de piezas, que no se publican.

export const Raiz: React.FC = () => (
  <>
    <Folder name="Videos">
      {VIDEOS.map((v) => (
        <Composition
          key={v.id}
          id={v.id}
          component={v.componente}
          durationInFrames={v.duracion}
          fps={FPS}
          width={ANCHO}
          height={ALTO}
          defaultProps={{ guia: false }}
        />
      ))}
    </Folder>
    <Folder name="Muestrario">
      <Composition id="Muestrario-Comun" component={MuestrarioComun} durationInFrames={DURACION_COMUN} fps={FPS} width={ANCHO} height={ALTO} defaultProps={{ guia: false }} />
      <Composition id="Muestrario-Flat" component={MuestrarioFlat} durationInFrames={DURACION_FLAT} fps={FPS} width={ANCHO} height={ALTO} defaultProps={{ guia: false }} />
      <Composition id="Muestrario-3D" component={MuestrarioTresD} durationInFrames={DURACION_3D} fps={FPS} width={ANCHO} height={ALTO} defaultProps={{ guia: false }} />
    </Folder>
  </>
);

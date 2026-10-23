import React from "react";
import { Tarjeta } from "./Tarjeta";
import { QrFalso } from "./QrFalso";
import { P } from "../marca";

// La pantalla de un móvil con la tarjeta guardada: fondo oscuro, la tarjeta de
// verdad arriba y, con `conQR`, el QR que escanea la caja con su código debajo.
// Va DENTRO de un <Movil> (en puntos).

type Props = { diseno?: string; puntos?: number; puntos2?: number; conQR?: boolean; fondo?: string; children?: React.ReactNode };

export const PantallaTarjeta: React.FC<Props> = ({ diseno, puntos, puntos2, conQR = false, fondo = "#141110", children }) => (
  <div style={{ position: "absolute", inset: 0, background: fondo, padding: "64px 16px 0" }}>
    <div style={{ color: P.avena, fontSize: 15, fontWeight: 600, marginBottom: 12, opacity: 0.8 }}>Tarjetas</div>
    <Tarjeta diseno={diseno} puntos={puntos} puntos2={puntos2} ancho={358} />
    {conQR && (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
        <QrFalso tam={170} />
      </div>
    )}
    {children}
  </div>
);

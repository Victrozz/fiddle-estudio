import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { entrada } from "./movimiento";
import { LogoDeTarjeta } from "./Tarjeta";
import { P } from "../marca";

// ============================================================================
// LA PANTALLA DE BLOQUEO Y SUS AVISOS
// ----------------------------------------------------------------------------
// Va DENTRO de un <Movil> (se maqueta en puntos, 390 de ancho). Los avisos de
// fiddle llegan aquí: el de un punto nuevo, el de una promo. El texto de un aviso
// de punto sale de `avisoDeTarjeta` (lo que escribe el pase de verdad), no a mano.
// ============================================================================

type Bloqueo = { hora?: string; fecha?: string; fondo?: string; children?: React.ReactNode };

export const PantallaBloqueo: React.FC<Bloqueo> = ({
  hora = "10:24",
  fecha = "martes, 14 de octubre",
  fondo = `radial-gradient(120% 80% at 30% 10%, ${P.verdeEncima} 0%, ${P.verde} 45%, ${P.espresso} 100%)`,
  children,
}) => (
  <div style={{ position: "absolute", inset: 0, background: fondo, color: "#fff", textAlign: "center" }}>
    <div style={{ marginTop: 70, fontSize: 19, fontWeight: 500, opacity: 0.9 }}>{fecha}</div>
    <div style={{ fontSize: 92, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.02em", marginTop: 2 }}>{hora}</div>
    <div style={{ position: "absolute", left: 16, right: 16, top: 300, display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
  </div>
);

type Aviso = {
  titulo: string;
  texto: string;
  /** El icono de la izquierda. Para una tienda: <LogoDeTarjeta …/>. */
  icono?: React.ReactNode;
  hace?: string;
  desde?: number;
};

export const Notificacion: React.FC<Aviso> = ({ titulo, texto, icono, hace = "ahora", desde = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = entrada(frame, fps, desde);
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        padding: "11px 13px",
        borderRadius: 22,
        background: "rgba(250, 247, 242, 0.82)",
        backdropFilter: "blur(18px)",
        color: P.espresso,
        textAlign: "left",
        opacity: Math.min(1, e * 1.5),
        transform: `translateY(${(1 - e) * -50}px) scale(${0.92 + 0.08 * e})`,
        boxShadow: "0 6px 20px rgba(0,0,0,.18)",
      }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 9, overflow: "hidden", flexShrink: 0, display: "grid", placeItems: "center" }}>{icono}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <strong style={{ fontSize: 15, fontWeight: 650 }}>{titulo}</strong>
          <span style={{ fontSize: 13, color: P.tintaSuave }}>{hace}</span>
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.25, marginTop: 1 }}>{texto}</div>
      </div>
    </div>
  );
};

/** El aviso de una tienda de ejemplo (su logo y su nombre). */
export const NotificacionDeTienda: React.FC<Omit<Aviso, "titulo" | "icono"> & { diseno?: string }> = ({ diseno, ...aviso }) => (
  <Notificacion titulo="Tu cafetería" icono={<LogoDeTarjeta diseno={diseno} tam={38} />} {...aviso} />
);

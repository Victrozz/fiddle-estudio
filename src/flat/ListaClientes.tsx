import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { ESTADOS } from "@fiddle/lib/crm";
import { Icono } from "../comun/Icono";
import { entrada } from "../comun/movimiento";
import { P } from "../marca";

// ============================================================================
// LA LISTA DE CLIENTES: lo que la tienda VE con fiddle
// ----------------------------------------------------------------------------
// Filas de clientes con su estado del CRM de fiddle: el nombre, el color y el
// icono de cada estado salen de src/lib/crm.js (ESTADOS: activo «A su ritmo»,
// nuevo, riesgo «En riesgo», dormido «Inactivo», perdido…), así que dicen lo mismo
// que la app. Los clientes son inventados. Cada fila entra en su `desde`; el estado
// de una fila puede cambiar en `cambiaEn` (de `estado` a `luego`).
// ============================================================================

export type Estado = keyof typeof ESTADOS;
export type FilaCliente = {
  nombre: string;
  detalle: string;
  estado: Estado;
  desde?: number;
  /** Si cambia de estado (y de detalle) en un fotograma. */
  cambiaEn?: number;
  luego?: Estado;
  detalleLuego?: string;
};

type Props = { filas: FilaCliente[]; ancho?: number; tam?: number };

const COLORES_AVATAR = [P.camel, P.verde, P.vison, "#b07a16", "#3f6e8c"];

export const ListaClientes: React.FC<Props> = ({ filas, ancho = 880, tam = 44 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ width: ancho, background: P.superficie, borderRadius: tam * 0.7, padding: `${tam * 0.3}px ${tam * 0.6}px`, boxShadow: "0 24px 60px -24px rgba(31,24,18,.35), 0 2px 8px rgba(31,24,18,.06)" }}>
      {filas.map((f, i) => {
        const e = entrada(frame, fps, f.desde ?? 0);
        const cambiado = f.cambiaEn !== undefined && frame >= f.cambiaEn;
        const estado = ESTADOS[cambiado && f.luego ? f.luego : f.estado];
        const golpe = f.cambiaEn !== undefined ? entrada(frame, fps, f.cambiaEn) : 1;
        return (
          <div
            key={f.nombre}
            style={{
              display: "flex",
              alignItems: "center",
              gap: tam * 0.45,
              padding: `${tam * 0.45}px 0`,
              borderTop: i ? `2px solid ${P.avenaClara}` : undefined,
              opacity: Math.min(1, e * 1.5),
              transform: `translateY(${(1 - e) * 30}px)`,
            }}
          >
            <div style={{ width: tam * 1.6, height: tam * 1.6, borderRadius: "50%", background: COLORES_AVATAR[i % COLORES_AVATAR.length], color: P.papel, display: "grid", placeItems: "center", fontSize: tam * 0.75, fontWeight: 750, flexShrink: 0 }}>
              {f.nombre[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: tam, fontWeight: 700, letterSpacing: "-0.015em" }}>{f.nombre}</div>
              <div style={{ fontSize: tam * 0.68, color: P.vison, marginTop: 2 }}>{cambiado && f.detalleLuego ? f.detalleLuego : f.detalle}</div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: tam * 0.2,
                padding: `${tam * 0.18}px ${tam * 0.38}px`,
                borderRadius: tam,
                background: `${estado.color}1f`,
                color: estado.color,
                fontSize: tam * 0.62,
                fontWeight: 750,
                whiteSpace: "nowrap",
                transform: `scale(${cambiado ? 0.85 + 0.15 * golpe : 1})`,
              }}
            >
              <Icono nombre={estado.icon} tam={tam * 0.62} grosor={2.4} />
              {estado.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

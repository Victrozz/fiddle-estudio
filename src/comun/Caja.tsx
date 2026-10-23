import React, { useMemo } from "react";
import TarjetaCaja from "@fiddle/app/w/[serial]/TarjetaCaja";
import { componerNegocio } from "@fiddle/lib/negocios";
import { negocioDeTarjeta } from "@fiddle/lib/tarjeta";
import { C, chipCodigo } from "@fiddle/app/ui";
import { CAFETERIA, DISENOS } from "@fiddle/app/home/demo";

// ============================================================================
// LA CAJA DE VERDAD
// ----------------------------------------------------------------------------
// Lo que ve el personal al escanear una tarjeta: TarjetaCaja de fiddle en modo
// `demo` (no guarda ni navega), con una tienda de ejemplo. Va DENTRO de un <Movil>.
// Cada cambio de `puntos` vuelve a montar la caja (`key`): en un vídeo no se pulsa,
// se pinta el antes y el después, y un <Toque> encima hace de dedo.
//
// La cabecera (código y nombre) es lo único dibujado aquí: en la app la pinta la
// página del servidor, que no se puede montar fuera de Next.
// ============================================================================

type Props = { diseno?: string; puntos?: number; nombre?: string; visitas?: number };

export const Caja: React.FC<Props> = ({ diseno, puntos = 3, nombre = "Marta", visitas = 12 }) => {
  const { negocio, cliente } = useMemo(() => {
    const d = diseno ? DISENOS.find((x: { id: string }) => x.id === diseno) : null;
    const t: { slug: string; nombre: string; premio: string; tema: object; cartillas?: object[] } = d ? d.tienda : CAFETERIA;
    // Igual que `ejemplo()` en demo.js, pero con las acciones y la vista de caja.
    const config = { meta: 8, premio: t.premio, tema: t.tema, ...(t.cartillas ? { cartillas: t.cartillas } : {}) };
    const n = componerNegocio(t.slug, { nombre: t.nombre, tipo: "sellos", config });
    return {
      negocio: { ...negocioDeTarjeta(n), acciones: n.acciones, caja: n.caja },
      cliente: { serial: "ejemplo", codigo: "K7P", nombre, premios: 1, sellos: puntos, sellos2: 0, guardados: 0, guardados2: 0, visitas, mensaje: null },
    };
  }, [diseno, puntos, nombre, visitas]);

  return (
    <div style={{ position: "absolute", inset: 0, background: C.fondo, color: C.texto, padding: "58px 16px 0", fontSize: 15 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <span style={{ ...chipCodigo(negocio.tema.accent), fontSize: 18, padding: "4px 10px" }}>{cliente.codigo}</span>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{cliente.nombre}</div>
          <div style={{ fontSize: 13, color: C.suave }}>{cliente.visitas} visitas</div>
        </div>
      </div>
      <TarjetaCaja key={`${puntos}`} serial="ejemplo" inicial={cliente} negocio={negocio} demo />
    </div>
  );
};

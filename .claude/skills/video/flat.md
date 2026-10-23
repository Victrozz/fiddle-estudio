# El kit flat (póster plano)

Todo en `src/comun/` (vale para los dos kits) y `src/flat/`. Para verlo todo junto:
`Muestrario-Comun` y `Muestrario-Flat` en el Studio (`npm run studio`), que además son
ejemplos de uso. Todo se mueve con `src/comun/movimiento.ts` (`entrada`, `salida`,
`tramo`): el mismo pulso en todo el vídeo.

## Lo común (`src/comun/`)

| Pieza | Qué es |
| --- | --- |
| `Marco` | La raíz de cada vídeo: fondo (`papel`, `crema`, `superficie`, `verde`, `espresso`), Geist, grano, variables de la app, `guia`. |
| `Titular` | La frase grande. Entra palabra a palabra; `resaltar` marca palabras con un bloque de color. Para el gancho. |
| `Aparece` | Cualquier cosa que entra subiendo (y se va con `hasta`). |
| `Etiqueta` | Pastilla en mayúsculas: «SIN FIDDLE», «HOY». |
| `Contador` | Una cifra que cuenta, en formato español («1,80 €»). |
| `Tarjeta` | **La tarjeta de verdad** (CaraDelPase de fiddle). `diseno` (id de DISENOS) y `puntos`. |
| `avisoDeTarjeta` | El texto que sale en la pantalla de bloqueo al sumar un punto, el del pase de verdad. |
| `Movil` | Un móvil genérico. Lo de dentro se maqueta en puntos (390 de ancho). |
| `PantallaBloqueo`, `Notificacion`, `NotificacionDeTienda` | La pantalla de bloqueo y sus avisos (dentro de un `Movil`). |
| `Caja` | **La caja de verdad** (TarjetaCaja de fiddle en demo): lo que ve el personal al escanear. Dentro de un `Movil`. |
| `Toque` | Un dedo que toca, en puntos del móvil. «Añadir punto» está hacia `x=195, y=330`. |
| `Efecto` | Un sonido: `pop`, `tic`, `ding`, `golpe`, `zas`, `caja` (`npm run sonidos`). |
| `Cierre` | Los últimos 2-3 s: logo, lema y teléfono. |
| `Icono` | Los iconos de la app (check, cerrar, campana, clientes, cartera, reloj, regalo…). |
| `crearHorario`, `Locucion`, `Subtitulos` | La voz: cuándo empieza cada frase y cada palabra, el audio y los subtítulos que van con él. |
| `Ventana`, `ZonaEscena` | Una escena entre dos fotogramas (absolutos, del horario) y el hueco donde va lo que se lee. |
| `MovilGrande`, `AvisoGrande`, `puntoDelMovil` | El móvil que sube grande desde abajo, y el aviso ampliado que sale de él (a tamaño real no se lee). |
| `PantallaTarjeta` | La pantalla de un móvil con la tarjeta guardada y, con `conQR`, su QR y su código. |
| `QrFalso` | Un QR que no se puede escanear: para no poner el serial de nadie. |

## Lo del póster (`src/flat/`)

| Pieza | Qué es |
| --- | --- |
| `CartillaCarton` | La cartilla de cartón con sellos de goma. `ultimoEn` hace caer el último; `gastada` le pone el aro de café y el doblez. |
| `SelloGoma` | El tampón que baja y golpea (con `Efecto sonido="golpe"`). |
| `Partido` | Pantalla partida en dos franjas: arriba «Sin fiddle», abajo «Con fiddle». |
| `Comparativa` | Filas con ✓ / ✗ / texto por columna. ✓ = bueno para la tienda: filas en positivo. |
| `Lista` | Ventajas que entran una a una con su icono. |
| `Cronometro` | Aro que se llena y los segundos («3,0 s»). Segundos medidos de verdad. |
| `Grafica` | Una o dos líneas que se dibujan, con su cifra al final. |
| `Barras` | Barras horizontales que crecen con su cifra. |
| `Tazas` | Una taza por visita; `gratis` marca las regaladas. |
| `Trazo` | Rotulador: `subrayado`, `rodear`, `flecha`, `tachar`. |
| `Cortina` | Paño de color que barre la pantalla (con `zas`). Para cambios de escena del póster; fundidos y deslizamientos, `TransitionSeries` de `@remotion/transitions`. |
| `ListaClientes` | Filas de clientes con los estados del CRM de la app (A su ritmo, Nuevo, En riesgo…); una fila puede cambiar de estado en un fotograma. |
| `Cuenta` | Una cuenta que se escribe trozo a trozo: «1,80 € × 250 = 450 €». |

## El estilo

- Fondos claros (`papel`, `crema`) para explicar; `verde` y `espresso` para golpes
  (el gancho, el giro, el cierre). Texto con `tintaDe(fondo)`.
- Letra: `TAM.gancho` (112) para el gancho, `TAM.titulo` (88), `TAM.texto` (60),
  `TAM.nota` (42) como mínimo absoluto. Pesos 600-750. Interletraje apretado.
- Ritmo: una idea por pantalla, cada pantalla 1,5-3 s, algo que entra cada 0,3-0,5 s.
  Las palabras de un titular, cada 3 fotogramas (`cadencia`).
- Color de acento: verde (lo de fiddle) y camel (lo de antes, lo neutro). ✓/✗ con
  `BIEN` y `MAL`, que no son el verde de la marca.
- Una escena = un `Series.Sequence` (o `Sequence` con `from`). Dentro, los tiempos
  relativos a la escena con `s(segundos)`.

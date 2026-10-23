# La marca de fiddle

fiddle son tarjetas de fidelización en el móvil (Apple Wallet y Android) para tiendas
pequeñas. Esto es lo que hace que un vídeo, un post o una imagen parezca de fiddle.

Los colores, el logo, la tarjeta y el teléfono **no se copian aquí**: los vídeos los
leen del código de la app ([diegomolinacatala/fiddle](https://github.com/diegomolinacatala/fiddle)),
que se baja solo a `vendor/fiddle` (ver `scripts/traer-fiddle.mjs`). Si allí cambian,
aquí también. Lo de esta página es para que una persona lo vea de un vistazo.

## Colores: «Verde y espresso»

Fuente: `src/app/home/paleta.js` de fiddle.

| Nombre | Hex | Para qué |
| --- | --- | --- |
| verde | `#1a422f` | La marca: el logo, los botones, lo que es de fiddle |
| espresso | `#1f1812` | El texto y las bandas oscuras |
| camel | `#a67f58` | El acento sobre claro (solo cosas grandes: 3,3:1) |
| avena | `#d6c0a5` | El acento sobre oscuro (nunca texto sobre claro) |
| visón | `#60544b` | El texto secundario |
| papel | `#f8f3ec` | El fondo |
| crema | `#f6efe4` | El fondo de las tarjetas de ejemplo |

La regla que no se rompe: **el verde y el espresso se distinguen de un vistazo**. Son las
dos bandas oscuras y no pueden parecer el mismo color mal copiado.

## Letra

**Geist** (de Vercel, licencia OFL), la de la web: `public/marca/fuentes/`. Titulares
en 650-750 con el interletraje apretado (-0,035 em); texto en 500-600.

## Logo

El de la web de fiddle (`LogoFiddle`): el dibujo y la palabra «fiddle» en minúsculas. Los
vídeos lo cogen de ahí (`src/comun/Cierre.tsx`), así que cuando cambie en la web cambia
aquí. Ficheros sueltos en `public/marca/logos/` (el actual y el antiguo, la «f.» rosa) e
iconos de la app en `public/marca/iconos/`.

## La tarjeta

En los vídeos sale la tarjeta de verdad (el mismo código que la del móvil del cliente),
con las tiendas inventadas de la web: todas se llaman «Tu cafetería» y cada una tiene su
paleta, para enseñar la variedad. La de una tienda real, solo con su permiso.

## Cómo hablamos

- De tú, frases cortas, palabras de mostrador. Español de España.
- Lo que suma la caja son **puntos** («Añadir punto», «Te falta 1 punto»), nunca sellos.
  «Sello» es lo de la cartilla de cartón.
- Sin emojis: iconos de trazo (los de la app).
- Le hablamos al dueño de la tienda de lo que gana su tienda.

## Botones de Wallet

`public/marca/wallet/`: los oficiales de Apple y Google, **sin tocar** (sus normas no
dejan cambiarlos de color ni de forma).

## Sonido

Efectos cortos sintetizados (`public/sonidos/`, `npm run sonidos`): el punto (`pop`), el
aviso (`ding`), el sello de goma (`golpe`), la caja (`caja`), un cambio (`zas`), un
segundero (`tic`). La música se pone al publicar, con un sonido de los de la red.

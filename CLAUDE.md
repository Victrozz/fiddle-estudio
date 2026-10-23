# CLAUDE.md

El estudio de fiddle: la marca y los vídeos para redes (TikTok, Reels, Shorts), hechos con
código (Remotion). Los dueños son Víctor y Diego. La app está en
[diegomolinacatala/fiddle](https://github.com/diegomolinacatala/fiddle).

## Para hacer un vídeo

La skill `video` (`.claude/skills/video/`): las dos opciones (**flat** y **3d**), para
quién son, las reglas y los pasos. Las `remotion-*` son las oficiales de Remotion.

## Reglas de la casa

- **Este repo es público.** Nada del vault de Víctor y Diego (`Victrozz/fiddleobsidian`):
  ni nombres de tiendas o clientes, ni teléfonos (salvo el de fiddle, que ya está en la
  web), ni precios de nadie, ni notas. Ningún secreto. Ninguna tienda real en un vídeo:
  «Tu cafetería».
- **El código habla español**: nombres, comentarios, textos y commits. Los comentarios
  explican por qué, no qué.
- **Lo de la app se lee de la app, no se copia**: la paleta, la tarjeta (`CaraDelPase`),
  la caja (`TarjetaCaja`), los iconos, el logo y el teléfono vienen de `vendor/fiddle/src`
  por el alias `@fiddle`. Si una pieza de fiddle cambia de sitio y algo deja de
  compilar, se arregla el import aquí; no se trae una copia.
- **Cada cosa en un sitio**: lo que sirve para más de un vídeo va a `src/comun/`,
  `src/flat/` o `src/3d/` (y a su muestrario), no dentro del vídeo. Un vídeo nuevo es una
  entrada en `VIDEOS`.
- **Todo depende del fotograma** (`useCurrentFrame`). Nada de `useFrame`, `setTimeout`,
  `Math.random` (usar `random(semilla)`) ni estados que avancen solos.
- **Antes de dar algo por terminado, mirarlo**: stills a media escala en los momentos
  clave, y leerlos. Y `npm run comprobar` (TypeScript).

## Dónde va cada cosa en GitHub

- **En el repo** (git): el código, la marca (`public/marca`), los sonidos, los guiones e
  ideas. Nada de más de unos pocos MB.
- **En las Releases**: los vídeos terminados (MP4 + portada + guion), una Release por
  vídeo con el id como etiqueta. No pesan en el repo ni hay que bajarlas para trabajar.
  Las crea el workflow «Render» (`.github/workflows/render.yml`).
- **Fuera de git** (`.gitignore`): `node_modules/`, `vendor/` (el código de fiddle, se
  baja solo) y `out/` (lo que se renderiza en local).

## Comandos

- `npm install`: instala y baja el código de fiddle (main).
- `npm run studio`: el Studio de Remotion para ver y tocar los vídeos.
- `npx remotion still <id> out/x.png --frame=30 --scale=0.5`: un fotograma para revisar.
- `gh workflow run render.yml -f id=<id>`: render en GitHub y su Release.
- `npm run fiddle`: poner al día el código de fiddle. Con `FIDDLE_DIR=../fiddle` se usa la
  copia local de la app (para enseñar algo que aún no está en main).
- `npm run sonidos`: volver a generar los efectos.
- `npm run comprobar`: TypeScript.

En el ordenador de Víctor la terminal es PowerShell 5.1: nada de `&&`.

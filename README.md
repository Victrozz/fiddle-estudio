# fiddle · estudio

La marca de [fiddle](https://fiddle-zeta.vercel.app/home) (tarjetas de fidelización en el
móvil para tiendas pequeñas) y los vídeos para redes, hechos con código.

Los vídeos no los genera una IA de vídeo: son páginas web animadas con
[Remotion](https://www.remotion.dev) (React), donde cada cosa en pantalla depende del
número de fotograma. Un Chrome sin ventana saca los fotogramas uno a uno y se juntan en
un MP4. Claude escribe el código, mira fotogramas sueltos, corrige y lo renderiza.

## Las dos opciones

| | Flat | 3D |
| --- | --- | --- |
| Qué es | Un póster que se mueve: titulares, la cartilla de cartón, comparativas, cifras, la tarjeta y la caja de verdad en un móvil | Una maqueta de juguete: la cafetería con gente, el barrio desde arriba |
| Para | Un argumento («lo que gana tu tienda») | Una historia con gente |
| Coste | Poco uso, render rápido | 2-4 veces más uso, render lento en GitHub |
| Piezas | `src/comun/`, `src/flat/` | `src/3d/` |

Se pueden combinar: la escena 3D con lo plano encima. Cómo se piden y se hacen:
[la skill `video`](.claude/skills/video/SKILL.md). Ideas: [`ideas/`](ideas/README.md).
Marca: [MARCA.md](MARCA.md).

## Los vídeos

Cada vídeo terminado es una [Release](../../releases) con su MP4, la portada y el guion.
Los «Muestrario» no son vídeos para publicar: enseñan las piezas de cada kit.

## Trabajar desde cualquier sitio

- **Con Claude Code en la nube** (claude.ai/code, con este repo): no ocupa nada en tu
  ordenador. Hace falta Node 22.
- **En un ordenador**: `npm install` (unos 450 MB entre dependencias y el Chrome de
  Remotion) y `npm run studio`. Para liberar el sitio, se borra `node_modules`.
- **El render, en GitHub**: Actions → Render → el id del vídeo. Gratis en un repo público.

## Qué hay en GitHub y qué no

- Repo: código, marca, sonidos, guiones. Ligero a propósito.
- Releases: los MP4 (hasta 2 GB cada uno, no cuentan para el tamaño del repo).
- Nunca: nada privado del negocio, datos de clientes, contraseñas o claves, música con
  derechos, ni modelos 3D o imágenes sin una licencia que permita usarlos.

## Licencias

El código y la marca de fiddle son de fiddle: se pueden ver, no reutilizar. Geist va con
su licencia (OFL) en `public/marca/fuentes/`. Remotion es gratis para empresas de hasta 3
personas ([su licencia](https://www.remotion.dev/license)).

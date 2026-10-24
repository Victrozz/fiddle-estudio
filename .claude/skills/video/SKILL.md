---
name: video
description: Hacer o cambiar un vídeo de fiddle para redes (TikTok, Reels, Shorts) en este repo. Tiene dos opciones, «flat» (póster plano animado) y «3d» (maqueta de juguete), que se pueden combinar. Úsala siempre que se pida un vídeo, un reel, un tiktok, un clip o «uno flat» / «uno 3d», o tocar uno que ya existe.
---

# Hacer un vídeo de fiddle

Los vídeos son código (Remotion: React + un Chrome que saca cada fotograma). Antes de
escribir nada, lee [MARCA.md](../../../MARCA.md) y el CLAUDE.md del repo. Las skills
`remotion-*` de esta carpeta son la referencia de Remotion; esta dice lo de fiddle.

## 1. Las dos opciones

Si quien lo pide no ha dicho cuál, se le presentan las dos (una línea cada una, con lo
que le iría mejor a SU idea) y se espera la respuesta:

- **Flat**: póster plano que se mueve. Titulares que entran palabra a palabra, dibujos
  (la cartilla de cartón, un lavadero, un ratón, un gorila), cifras que cuentan,
  gráficas, la tarjeta y la caja de verdad en un móvil. Gasta poco uso y se renderiza
  rápido. Piezas: [flat.md](flat.md).
- **3D**: una maqueta de juguete. La cafetería con gente sentada o que entra y paga, el
  barrio desde arriba, una calle con varios cafés. Lo mejor para una historia con gente.
  Gasta de 2 a 4 veces más uso y el render en GitHub tarda bastante más. Piezas: [3d.md](3d.md).
- **Combinados**: la escena 3D con lo plano encima (titulares, bocadillos con
  `SobreEscena`), o escenas de uno y de otro seguidas. Cuenta como 3D en coste.

## 2. Qué se hace: contenido, no anuncios

**Desde el 24-10-2026 los vídeos son contenido, no anuncios** (lo pidió Víctor: los
primeros cinco «parecían anuncios, sin alma»). La cuenta crece con vídeos que alguien
quiere ver aunque no tenga una tienda:

- **Un enfoque curioso relacionado con la tarjeta**: un estudio de psicología (el
  progreso dotado, el gradiente de meta, la mera exposición), un trozo de historia (los
  sellos verdes de los sesenta), un tipo de negocio visto de otra forma (cafés sin
  sillas). Ideas: [`ideas/`](../../../ideas/README.md).
- **No se nombra fiddle** ni en la voz ni en pantalla. Solo `Marca` al final: el logo,
  un segundo y medio, sin frase. Nada de «pruébalo», teléfonos ni ventajas.
- La tarjeta de verdad puede salir como ejemplo (es de lo que se habla), sin venderla.
- Sirve a dos públicos a la vez: a cualquiera le cuenta algo que no sabía; al dueño de
  una tienda, por qué le conviene. Ganchos y estructura: [guion.md](guion.md).

Los cinco del 24-10-2026 que eran anuncios (cartón contra fiddle, igual de rápido…) se
quedan como estaban; si algún día se quiere un anuncio, `Cierre` sigue ahí.

## 3. Lo que manda Víctor y lo que es solo un aviso

**El contenido lo deciden Víctor y Diego.** Claude no pone reglas a lo que se dice en
un vídeo: propone, y si ve un riesgo lo avisa UNA vez, en una línea, y hace lo que le
digan.

Lo que ya han decidido ellos (se sigue sin preguntar):

- **Nunca menos de 10 s** (`src/videos/index.ts` lo comprueba). Lo normal, 30-40 s.
- **Con voz y subtítulos**: Álvaro (es-ES-AlvaroNeural) o Brian
  (en-US-BrianMultilingualNeural hablando español de España). **Que no hable lento**:
  Álvaro a +22 %, Brian a +18 %, `pausaCorta` de 150 ms y pausas entre frases de
  0,25-0,45 s (unas 3 palabras por segundo). «fiddle» se dice «fídel», pero en el
  contenido no se nombra.
- **En pantalla, lo de fiddle son «puntos»**, nunca «sellos» (regla de la app desde el
  15-10-2026). «Sello» vale para la cartilla de cartón y los sellos de antes.
- Las opciones se llaman **flat** y **3d**, y se presentan las dos.

Lo técnico (si no, el vídeo sale mal):

- 1080x1920 a 30 fps. Lo que haya que leer, dentro de `ZONA_LIBRE`: lo de fuera lo
  tapan los botones de TikTok e Instagram (`guia`).
- La tarjeta, la caja y los avisos, con `Tarjeta`, `Caja` y `avisoDeTarjeta`: así son
  los de verdad y cambian solos si cambia la app. **Con 7 de 8 puntos la app escribe
  «Faltan 1»** (un fallo suyo): no enseñar una tarjeta con un punto para el premio.
- La música no va dentro: se pone al publicar (los sonidos de TikTok e Instagram ya
  llevan su licencia). Efectos sí (`Efecto`), y muchos: en cada cosa que entra.
- Este repo es público: nada privado del vault ni datos de clientes en el código.

Avisos que se dan (una vez) si salen, y se sigue lo que digan:

- **Cada cifra de un estudio, con su `Cita`** (autores y año) y comprobada en la fuente.
  Lo que solo cuenta una web de curiosidades se dice como tal («cuentan que»).
- Algo de la app que no hace hoy, o que es solo del plan Completo.
- Una tienda o persona real en el vídeo: necesita su permiso.

## 4. Cómo se hace

1. **Guion** en `src/videos/<id>/guion.md` (`<id>` = fecha y nombre:
   `2026-10-24-ratas-y-cafe`). Lleva: para quién, lo que tiene que quedar en una frase,
   la opción, **las fuentes** y una tabla frase → lo que se ve. Se enseña en 5-8 líneas
   y se espera el visto bueno antes de programar, salvo que hayan dicho «hazlo».
2. **La voz**: `src/videos/<id>/locucion.json` con la voz (`alvaro` o `brian`, ver
   `scripts/voces/elegidas.json`), la velocidad, `pausaCorta` y las frases (`id`,
   `texto`, `pausa` después; «|» = pausa corta). Las cifras, en letra («diecinueve por
   ciento»): así las lee bien. Se locuta con Azure: `node scripts/voces/locutar.mjs <id>`
   con `AZURE_SPEECH_KEY` y `AZURE_SPEECH_REGION` en el entorno, o en GitHub con el
   workflow «Locutar» (usa los secretos). Sale el audio (`public/voz/<id>/`) y
   `tiempos.json`, y se suben al repo. Si pasa de ~42 s, recortar texto.
3. **Código** en `src/videos/<id>/index.tsx` y una entrada en `VIDEOS`
   (`src/videos/index.ts`) con su `horario`. `const h = crearHorario(guion, tiempos, { cola: 1.9 })`
   y TODO se coloca con él: cada escena en una `<Ventana desde={h.en("frase")} hasta={h.en("siguiente")}>`
   y cada golpe en su palabra (`h.palabra("gancho", "nunca")`). `<Locucion horario={h}/>`
   suena y `<Subtitulos horario={h}/>` escribe. Al final, `<Marca desde={h.fin("remate") + 8} />`.
   Para que no parezca una diapositiva:
   - cada `Ventana` con `paso` («barrido», «zoom») y `deriva` (la cámara se acerca);
   - algo se mueve siempre: un dibujo que anda, una cifra que cuenta, puntos que caen;
   - los fondos de color (espresso para el nombre de un efecto, verde para el remate)
     van en la `Ventana` (`style={{ background }}`), no cambiando el `Marco` de golpe;
   - lo que pueda servir otra vez va al kit (`comun/`, `flat/`, `3d/` y su muestrario),
     no dentro del vídeo. Ver los cinco de contenido del 24-10-2026.
4. **Revisar mirando**, con la **Hoja** (`src/Hoja.tsx`): ocho momentos del vídeo en UNA
   imagen, por frases del horario:
   `npx remotion still Hoja out/hoja.jpg --image-format=jpeg --props='{"id":"<id>","momentos":["gancho+30","fin:vacia","remate+20"]}'`.
   Mirar el gancho a 0,1 s, el final de cada frase (lo que tiene que estar ya) y la
   marca. Arreglar y repetir. Un detalle, con un still a media escala. Los tests no ven
   si una taza parece una taza. Y `npm run comprobar`.
5. **Render y publicar**: commit y push, y lanzar el workflow «Render» con el id
   (`gh workflow run render.yml -f id=<id>`). Sale una Release `<id>` con el MP4, la
   portada y el guion. Dar el enlace.
6. Si una idea de `ideas/` ya está hecha, poner su estado y el enlace a la Release.

## 5. Gastar poco

- Revisar con la Hoja, nunca con el render entero.
- Cambios pequeños con Edit, no reescribir el fichero.
- En 3D, reutilizar `Cafeteria`, `Barrio` y `Persona`; no modelar de cero. El render
  en GitHub va por software: 14 s de 3D tardan unos 6 min (el flat, 1 min).

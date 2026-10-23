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

- **Flat**: póster plano que se mueve. Titulares que entran palabra a palabra, la
  cartilla de cartón, comparativas, cifras que cuentan, gráficas, la tarjeta y la caja
  de verdad en un móvil. Lo mejor para un argumento («lo que gana tu tienda»). Gasta
  poco uso y se renderiza rápido. Piezas: [flat.md](flat.md).
- **3D**: una maqueta de juguete. La cafetería con gente que entra y paga, el barrio
  desde arriba con quien viene y quien ha dejado de venir. Lo mejor para una historia
  con gente. Gasta de 2 a 4 veces más uso y el render en GitHub tarda bastante más.
  Piezas: [3d.md](3d.md).
- **Combinados**: la escena 3D con lo plano encima (titulares, bocadillos con
  `SobreEscena`), o escenas de uno y de otro seguidas. Cuenta como 3D en coste.

## 2. Para quién

- **El público es el dueño de una tienda pequeña** (cafetería, panadería, heladería…).
  El vídeo vende lo que gana LA TIENDA: saber quién viene y quién ha dejado de venir,
  avisarles en el móvil, que vuelvan, no imprimir nada, que en el mostrador es igual de
  rápido. Lo del cliente (no pierde la tarjeta) solo apoya.
- **Tiene que entretener a cualquiera un poco**: que alguien a quien no le toca no lo
  pase de largo. Gancho en el primer segundo, algo que se mueve cada segundo y medio,
  un giro o un remate. Ideas de ganchos y estructuras: [guion.md](guion.md).
- Algunos vídeos son para clientes de las tiendas: solo si se pide.

## 3. Lo que manda Víctor y lo que es solo un aviso

**El contenido lo deciden Víctor y Diego.** Claude no pone reglas a lo que se dice en
un vídeo: propone, y si ve un riesgo lo avisa UNA vez, en una línea, y hace lo que le
digan.

Lo que ya han decidido ellos (se sigue sin preguntar):

- **Nunca menos de 10 s** (`src/videos/index.ts` lo comprueba). Lo normal, 15-30 s.
- Sobre todo para dueños de tiendas; algunos, para sus clientes.
- **En pantalla, lo de fiddle son «puntos»**, nunca «sellos» (regla de la app desde el
  15-10-2026). «Sello» vale para la cartilla de cartón, que es lo de antes.
- Las opciones se llaman **flat** y **3d**, y se presentan las dos.

Lo técnico (si no, el vídeo sale mal):

- 1080x1920 a 30 fps. Lo que haya que leer, dentro de `ZONA_LIBRE`: lo de fuera lo
  tapan los botones de TikTok e Instagram (`guia`).
- La tarjeta, la caja y los avisos, con `Tarjeta`, `Caja` y `avisoDeTarjeta`: así son
  los de verdad y cambian solos si cambia la app.
- La música no va dentro: se pone al publicar (los sonidos de TikTok e Instagram ya
  llevan su licencia). Efectos sí (`Efecto`).
- Este repo es público: nada privado del vault ni datos de clientes en el código.

Avisos que se dan (una vez) si salen, y se sigue lo que digan:

- Una cifra que parece de un estudio y no tiene fuente: en España la publicidad
  engañosa se puede denunciar. Basta con decirlo; si quieren la cifra, va.
- Algo de la app que no hace hoy, o que es solo del plan Completo.
- Una tienda o persona real en el vídeo: necesita su permiso.

## 4. Cómo se hace

1. **Guion** en `src/videos/<id>/guion.md` (`<id>` = fecha y nombre:
   `2026-10-24-carton-vs-fiddle`). Si la idea está en `ideas/`, se parte de su ficha.
   Lleva: a quién va, lo que tiene que quedar en una frase, la opción (flat / 3d),
   el gancho, las escenas con sus segundos y el texto EXACTO de cada pantalla.
   **Se enseña en 5-8 líneas y se espera el visto bueno** antes de programar (rehacer
   un guion cuesta poco; rehacer un vídeo, mucho), salvo que hayan dicho «hazlo».
2. **Código** en `src/videos/<id>/index.tsx` y una entrada en `VIDEOS`
   (`src/videos/index.ts`). Se arma con las piezas de `comun/`, `flat/` y `3d/`. Lo que
   haga falta y pueda servir otra vez va al kit (no dentro del vídeo) y al muestrario.
3. **Revisar mirando**: stills en los momentos clave (el gancho a 1 s, cada escena, el
   cierre), a media escala, y leerlos:
   `npx remotion still <id> out/<id>-30.png --frame=30 --scale=0.5`.
   Una vez con la guía: `--props='{"guia":true}'`. Arreglar y repetir. Los tests no
   ven si una taza parece una taza.
4. **Render y publicar**: commit y push, y lanzar el workflow «Render» con el id
   (`gh workflow run render.yml -f id=<id>`). Sale una Release `<id>` con el MP4, la
   portada y el guion. Dar el enlace. (En local: `npx remotion render <id> out/<id>.mp4`,
   si el ordenador tiene sitio.)
5. Si una idea de `ideas/` ya está hecha, poner su estado y el enlace a la Release.

## 5. Gastar poco

- Revisar con stills a escala 0.5, nunca con el render entero.
- Cambios pequeños con Edit, no reescribir el fichero.
- En 3D, reutilizar `Cafeteria`, `Barrio` y `Persona`; no modelar de cero. El render
  en GitHub va por software: 14 s de 3D tardan unos 6 min (el flat, 1 min).

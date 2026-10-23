# (No se llama chatterbox.py: Python cogería este fichero en vez de la librería.)
# Chatterbox Multilingual (Resemble AI, licencia MIT): más natural, y copia la voz Y EL
# ACENTO de una muestra. Las muestras no son de personas: son voces de Piper y Kokoro,
# así que la voz que sale tampoco es de nadie. Lleva una marca de agua inaudible
# (Perth) que dice que es sintético.
#
# MUESTRAS: «nombre=ruta@exageracion,…». La exageración es lo expresiva que sale (0,5
# de serie): más alta, más entonación (preguntas que suenan a pregunta); más baja, más
# tranquila. Saca out/voces/chatterbox-<nombre>.wav.

import os

import torchaudio
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

from texto import para_voz

TEXTO = para_voz(os.environ["TEXTO"])
MUESTRAS = []
for par in os.environ["MUESTRAS"].split(","):
    nombre, resto = par.split("=", 1)
    ruta, _, exageracion = resto.partition("@")
    MUESTRAS.append((nombre, ruta, float(exageracion or 0.5)))

modelo = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
for nombre, muestra, exageracion in MUESTRAS:
    if not os.path.exists(muestra):
        print(f"Sin la muestra {muestra}: me salto {nombre}")
        continue
    wav = modelo.generate(TEXTO, language_id="es", audio_prompt_path=muestra, exaggeration=exageracion)
    # Sale a veces por encima de 1 (y cruje al reproducirlo): pico a 0,95.
    wav = wav * (0.95 / wav.abs().max())
    torchaudio.save(f"out/voces/chatterbox-{nombre}.wav", wav, modelo.sr)
    print(f"out/voces/chatterbox-{nombre}.wav")

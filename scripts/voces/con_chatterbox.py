# (No se llama chatterbox.py: Python cogería este fichero en vez de la librería.)
# Chatterbox Multilingual (Resemble AI, licencia MIT): más natural, y copia la voz Y EL
# ACENTO de una muestra. Las muestras no son de personas: son voces de Piper y Kokoro,
# así que la voz que sale tampoco es de nadie. Lleva una marca de agua inaudible
# (Perth) que dice que es sintético.
#
# MUESTRAS: «nombre=ruta,nombre=ruta». EXAGERACION: lo expresiva que sale (0,5 de
# serie; más baja, más tranquila). Saca out/voces/chatterbox-<nombre>.wav.

import os

import torchaudio
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

TEXTO = os.environ["TEXTO"]
MUESTRAS = dict(par.split("=", 1) for par in os.environ["MUESTRAS"].split(","))
EXAGERACION = float(os.environ.get("EXAGERACION", "0.4"))

modelo = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
for nombre, muestra in MUESTRAS.items():
    if not os.path.exists(muestra):
        print(f"Sin la muestra {muestra}: me salto {nombre}")
        continue
    wav = modelo.generate(TEXTO, language_id="es", audio_prompt_path=muestra, exaggeration=EXAGERACION)
    # Sale a veces por encima de 1 (y cruje al reproducirlo): pico a 0,95.
    wav = wav * (0.95 / wav.abs().max())
    torchaudio.save(f"out/voces/chatterbox-{nombre}.wav", wav, modelo.sr)
    print(f"out/voces/chatterbox-{nombre}.wav")

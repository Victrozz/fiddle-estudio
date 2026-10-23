# (No se llama kokoro.py: Python cogería este fichero en vez de la librería.)
# Kokoro (licencia Apache 2.0): voces sintéticas que vienen con el modelo, de nadie.
# Pequeño (82 M de parámetros): va rápido sin tarjeta gráfica. Para español usa
# espeak-ng para saber cómo se pronuncia cada palabra.
#
# Saca la frase de TEXTO con cada voz española en out/voces/kokoro-<voz>.wav.

import os

import numpy as np
import soundfile as sf
from kokoro import KPipeline

TEXTO = os.environ["TEXTO"]
VOCES = ["ef_dora", "em_alex", "em_santa"]

os.makedirs("out/voces", exist_ok=True)
pipeline = KPipeline(lang_code="e")  # «e» = español
for voz in VOCES:
    trozos = [audio for _, _, audio in pipeline(TEXTO, voice=voz, speed=1.0)]
    sf.write(f"out/voces/kokoro-{voz}.wav", np.concatenate(trozos), 24000)
    print(f"out/voces/kokoro-{voz}.wav")

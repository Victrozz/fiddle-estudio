# Piper: voces entrenadas con gente de España (acento de aquí). Pequeñas y rápidas sin
# tarjeta gráfica; suenan más planas que las grandes, pero sirven de muestra para que
# Chatterbox copie el acento. Las voces y sus licencias (de rhasspy/piper-voices):
#   davefx    hombre,      CC0 (sin condiciones)
#   sharvard  mujer/hombre, CC BY 3.0 (hay que citar el corpus si se usa)
#   carlfm    hombre,      dominio público (calidad baja)
#
# Saca la frase de TEXTO en out/voces/piper-<voz>.wav.

import os
import urllib.request
import wave

from piper import PiperVoice, SynthesisConfig

TEXTO = os.environ["TEXTO"]
BASE = "https://huggingface.co/rhasspy/piper-voices/resolve/main/es/es_ES"
VOCES = {
    "davefx": ("davefx/medium/es_ES-davefx-medium", None),
    "sharvard-mujer": ("sharvard/medium/es_ES-sharvard-medium", 1),
    "sharvard-hombre": ("sharvard/medium/es_ES-sharvard-medium", 0),
    "carlfm": ("carlfm/x_low/es_ES-carlfm-x_low", None),
}

os.makedirs("out/voces", exist_ok=True)
os.makedirs("modelos", exist_ok=True)
for nombre, (ruta, hablante) in VOCES.items():
    modelo = f"modelos/{ruta.split('/')[-1]}.onnx"
    for ext in (".onnx", ".onnx.json"):
        if not os.path.exists(modelo.replace(".onnx", ext)):
            urllib.request.urlretrieve(f"{BASE}/{ruta}{ext}", modelo.replace(".onnx", ext))
    voz = PiperVoice.load(modelo)
    with wave.open(f"out/voces/piper-{nombre}.wav", "wb") as wav:
        voz.synthesize_wav(TEXTO, wav, syn_config=SynthesisConfig(speaker_id=hablante))
    print(f"out/voces/piper-{nombre}.wav")

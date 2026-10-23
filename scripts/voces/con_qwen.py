# Qwen3-TTS (Alibaba, licencia Apache 2.0, enero de 2026). Dos formas:
# - «Diseño de voz»: la voz sale de una DESCRIPCIÓN («hombre de Madrid, cálido…»),
#   no de una persona. Es lo que más se parece a pedir «una voz de anuncio de aquí».
# - Copia: copia la voz de una muestra (aquí, la de davefx, que tampoco es de nadie).
# Pesa más que los otros (1.700 M de parámetros): en GitHub, sin tarjeta, tarda.
#
# Saca out/voces/qwen-<nombre>.wav.

import os

import numpy as np
import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel

from texto import para_voz

TEXTO = para_voz(os.environ["TEXTO"])

DISENOS = {
    "hombre-madrid": "Hombre español de unos 35 años, de Madrid, con acento castellano peninsular (pronuncia la z y la c como en España). Voz cálida y cercana, habla con energía y una entonación natural y expresiva, como un locutor de anuncios de radio.",
    "mujer-madrid": "Mujer española de unos 30 años, de Madrid, con acento castellano peninsular (pronuncia la z y la c como en España). Voz clara y simpática, entonación natural y expresiva, como una locutora de anuncios de radio.",
}


def guardar(nombre, wavs, sr):
    audio = np.asarray(wavs[0], dtype=np.float32)
    audio = audio * (0.95 / max(1e-6, float(np.abs(audio).max())))
    sf.write(f"out/voces/qwen-{nombre}.wav", audio, sr)
    print(f"out/voces/qwen-{nombre}.wav")


os.makedirs("out/voces", exist_ok=True)

modelo = Qwen3TTSModel.from_pretrained("Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign", device_map="cpu", dtype=torch.float32)
for nombre, descripcion in DISENOS.items():
    wavs, sr = modelo.generate_voice_design(text=TEXTO, language="Spanish", instruct=descripcion)
    guardar(nombre, wavs, sr)
del modelo

muestra = "out/voces/piper-davefx.wav"
if os.path.exists(muestra):
    modelo = Qwen3TTSModel.from_pretrained("Qwen/Qwen3-TTS-12Hz-1.7B-Base", device_map="cpu", dtype=torch.float32)
    # La muestra dice la misma frase: su texto es TEXTO.
    wavs, sr = modelo.generate_voice_clone(text=TEXTO, language="Spanish", ref_audio=muestra, ref_text=TEXTO)
    guardar("como-davefx", wavs, sr)

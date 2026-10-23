# Chatterbox Multilingual (Resemble AI, licencia MIT): más expresivo, y copia la voz de
# una muestra. La muestra NO es de una persona: es una voz de Kokoro (sintética), así
# que la voz que sale tampoco es de nadie. Sin muestra, usa su voz de serie.
# Lleva una marca de agua inaudible (Perth) que dice que es sintético.
#
# Saca la frase de TEXTO en out/voces/chatterbox-<voz>.wav.

import os

import torchaudio
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

TEXTO = os.environ["TEXTO"]
MUESTRAS = {
    "de-serie": None,
    "como-dora": "out/voces/kokoro-ef_dora.wav",
    "como-alex": "out/voces/kokoro-em_alex.wav",
}

modelo = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
for nombre, muestra in MUESTRAS.items():
    if muestra and not os.path.exists(muestra):
        print(f"Sin la muestra {muestra}: me salto {nombre}")
        continue
    wav = modelo.generate(TEXTO, language_id="es", audio_prompt_path=muestra) if muestra else modelo.generate(TEXTO, language_id="es")
    torchaudio.save(f"out/voces/chatterbox-{nombre}.wav", wav, modelo.sr)
    print(f"out/voces/chatterbox-{nombre}.wav")

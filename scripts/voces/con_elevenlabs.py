# ElevenLabs: las voces que se eligen en su web (Voice Library, filtrando español de
# España). Con la clave de la cuenta (ELEVENLABS_API_KEY, secreto de GitHub: la pone
# Víctor) y los ids de las voces (ELEVENLABS_VOCES, «nombre=id,…»). Sin clave, no hace
# nada. Ojo: el plan gratis no permite uso comercial (anuncios); el de 6 $/mes, sí.
#
# Saca out/voces/elevenlabs-<nombre>.mp3.

import json
import os
import sys
import urllib.request

from texto import para_voz

CLAVE = os.environ.get("ELEVENLABS_API_KEY", "")
VOCES = os.environ.get("ELEVENLABS_VOCES", "")
if not CLAVE or not VOCES:
    print("Sin ELEVENLABS_API_KEY o sin ELEVENLABS_VOCES: me salto ElevenLabs.")
    sys.exit(0)

TEXTO = para_voz(os.environ["TEXTO"])
os.makedirs("out/voces", exist_ok=True)
for par in VOCES.split(","):
    nombre, voz = par.split("=", 1)
    peticion = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voz}?output_format=mp3_44100_128",
        data=json.dumps({"text": TEXTO, "model_id": "eleven_multilingual_v2"}).encode("utf-8"),
        headers={"xi-api-key": CLAVE, "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(peticion) as r, open(f"out/voces/elevenlabs-{nombre}.mp3", "wb") as f:
            f.write(r.read())
        print(f"out/voces/elevenlabs-{nombre}.mp3")
    except urllib.error.HTTPError as e:
        print(f"{nombre}: {e.code} {e.read()[:200]!r}")

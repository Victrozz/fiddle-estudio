# Microsoft Azure: las voces de España que se oyen en TikTok (Álvaro, Elvira y
# compañía; CapCut y muchas herramientas usan estas). Con la clave de un recurso
# «Speech» de Azure (AZURE_SPEECH_KEY y AZURE_SPEECH_REGION, secretos de GitHub: la
# pone Víctor, nadie más la ve). Sin clave, no hace nada.
#
# Saca la frase con TODAS las voces es-ES que tenga Azure en out/voces/azure-<voz>.wav.

import os
import re
import sys
import json
import urllib.request
from xml.sax.saxutils import escape

from texto import para_voz

CLAVE = os.environ.get("AZURE_SPEECH_KEY", "")
REGION = os.environ.get("AZURE_SPEECH_REGION", "")
if not CLAVE or not REGION:
    print("Sin AZURE_SPEECH_KEY / AZURE_SPEECH_REGION: me salto Azure.")
    sys.exit(0)

TEXTO = escape(para_voz(os.environ["TEXTO"]))
BASE = f"https://{REGION}.tts.speech.microsoft.com/cognitiveservices"
CABECERAS = {"Ocp-Apim-Subscription-Key": CLAVE, "User-Agent": "fiddle-estudio"}

with urllib.request.urlopen(urllib.request.Request(f"{BASE}/voices/list", headers=CABECERAS)) as r:
    voces = [v["ShortName"] for v in json.load(r) if v.get("Locale") == "es-ES"]
print(f"{len(voces)} voces es-ES: {', '.join(voces)}")

os.makedirs("out/voces", exist_ok=True)
for voz in voces:
    ssml = f"<speak version='1.0' xml:lang='es-ES'><voice name='{voz}'>{TEXTO}</voice></speak>"
    peticion = urllib.request.Request(
        f"{BASE}/v1",
        data=ssml.encode("utf-8"),
        headers={**CABECERAS, "Content-Type": "application/ssml+xml", "X-Microsoft-OutputFormat": "riff-24khz-16bit-mono-pcm"},
    )
    try:
        with urllib.request.urlopen(peticion) as r:
            nombre = re.sub(r"[^A-Za-z0-9]+", "-", voz.replace("es-ES-", "")).strip("-")
            with open(f"out/voces/azure-{nombre}.wav", "wb") as f:
                f.write(r.read())
            print(f"out/voces/azure-{nombre}.wav")
    except urllib.error.HTTPError as e:
        print(f"{voz}: {e.code} {e.reason}")

# Microsoft Azure: las voces de España que se oyen en TikTok (Álvaro, Elvira y
# compañía; CapCut y muchas herramientas usan estas). Con la clave de un recurso
# «Speech» de Azure (AZURE_SPEECH_KEY y AZURE_SPEECH_REGION, secretos de GitHub: los
# pone Víctor). Sin clave, no hace nada. La región de Víctor es germanywestcentral
# (la suscripción de estudiante no deja otras con Speech); ahí no hay voces «HD».
#
# Saca la frase con todas las voces de España (es-ES) y con las «multilingües» que
# saben hablar español de España, en out/voces/azure-<voz>.wav.

import json
import os
import re
import sys
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
    lista = json.load(r)
# Las de España, y las de otro idioma que también hablan español de España.
voces = [(v["ShortName"], False) for v in lista if v.get("Locale") == "es-ES"]
voces += [(v["ShortName"], True) for v in lista if v.get("Locale") != "es-ES" and "es-ES" in (v.get("SecondaryLocaleList") or [])]
print(f"{len(voces)} voces: {', '.join(n for n, _ in voces)}")

os.makedirs("out/voces", exist_ok=True)
for voz, multilingue in voces:
    frase = f"<lang xml:lang='es-ES'>{TEXTO}</lang>" if multilingue else TEXTO
    ssml = f"<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='es-ES'><voice name='{voz}'>{frase}</voice></speak>"
    peticion = urllib.request.Request(
        f"{BASE}/v1",
        data=ssml.encode("utf-8"),
        headers={**CABECERAS, "Content-Type": "application/ssml+xml", "X-Microsoft-OutputFormat": "riff-24khz-16bit-mono-pcm"},
    )
    nombre = re.sub(r"[^A-Za-z0-9]+", "-", re.sub(r"^es-ES-", "", voz)).strip("-")
    if multilingue:
        nombre = "multi-" + nombre
    try:
        with urllib.request.urlopen(peticion) as r:
            with open(f"out/voces/azure-{nombre}.wav", "wb") as f:
                f.write(r.read())
        print(f"out/voces/azure-{nombre}.wav")
    except urllib.error.HTTPError as e:
        print(f"{voz}: {e.code} {e.reason}")

# El texto tal como se tiene que DECIR: «fiddle» se dice «fídel» (pronunciacion.json).
# Todas las voces pasan por aquí, para que ninguna lo lea en inglés.

import json
import os
import re

with open(os.path.join(os.path.dirname(__file__), "pronunciacion.json"), encoding="utf-8") as f:
    _COMO_SE_DICE = {k: v for k, v in json.load(f).items() if k != "_"}


def para_voz(texto: str) -> str:
    for palabra, dicha in _COMO_SE_DICE.items():
        texto = re.sub(rf"\b{re.escape(palabra)}\b", dicha, texto, flags=re.IGNORECASE)
    return texto

"""OffSec: API multimodale. Déployer derrière HTTPS et un contrôle d'accès serveur.
Installation: pip install -r requirements.txt
Variables: OPENAI_API_KEY, OFFSEC_BEARER_TOKEN, OFFSEC_DOCS_DIR, OPENAI_MODEL (optionnel).
Les documents de référence doivent être des fichiers TXT UTF-8 préalablement validés;
aucune doctrine n'est inventée en cas d'absence de documents.
"""
import base64
import json
import os
from pathlib import Path
from fastapi import FastAPI, File, Form, Header, HTTPException, UploadFile, Response
from openai import AsyncOpenAI

app = FastAPI(title="OffSec analyse", docs_url=None, redoc_url=None)
MAX_IMAGES = 10
MAX_BYTES = 5 * 1024 * 1024
DOCS = ("Fiche_Guide_OFF_SECOPS_v5.txt", "DO_Soutien_Operationnel_2024_Annexe_1.txt")

def references():
    folder = Path(os.environ.get("OFFSEC_DOCS_DIR", "./documents")).resolve()
    excerpts = []
    for filename in DOCS:
        path = (folder / filename).resolve()
        if not path.is_relative_to(folder) or not path.is_file():
            raise HTTPException(503, f"Référentiel validé absent : {filename}")
        content = path.read_text(encoding="utf-8")
        if not content.strip():
            raise HTTPException(503, f"Document vide : {filename}")
        if len(content) > 120000:
            raise HTTPException(503, f"Document trop volumineux : {filename}")
        excerpts.append(f"DOCUMENT {filename}\n{content}")
    return "\n\n".join(excerpts)

@app.post("/analyze")
async def analyze(
    response: Response,
    photos: list[UploadFile] = File(...),
    context: str = Form("{}"),
    authorization: str | None = Header(default=None)
):
    if response is not None:
        response.headers['Cache-Control'] = 'no-store, private'
        response.headers['Pragma'] = 'no-cache'
    token = os.environ.get("OFFSEC_BEARER_TOKEN")
    if not token or authorization != f"Bearer {token}":
        raise HTTPException(401, "Accès non autorisé")
    if not os.environ.get("OPENAI_API_KEY"):
        raise HTTPException(503, "Service IA non configuré")
    if not 1 <= len(photos) <= MAX_IMAGES:
        raise HTTPException(400, "Nombre de photos invalide")
    try:
        ctx = json.loads(context)
        if not isinstance(ctx, dict): raise ValueError()
    except ValueError:
        raise HTTPException(400, "Contexte invalide")
    reference_text = references()
    blocks = [{"type": "input_text", "text": "Contexte déclaré par l'officier (non vérifié) : " + json.dumps(ctx, ensure_ascii=False)[:8000]}]
    for photo in photos:
        if photo.content_type not in ("image/jpeg", "image/png", "image/webp"):
            raise HTTPException(415, "Format image non autorisé")
        data = await photo.read(MAX_BYTES + 1)
        if len(data) > MAX_BYTES:
            raise HTTPException(413, "Image trop volumineuse")
        blocks.append({"type":"input_image","image_url":f"data:{photo.content_type};base64,{base64.b64encode(data).decode('ascii')}"})
    system = """Tu es un assistant de reconnaissance des risques pour un officier sécurité sapeur-pompier.
Analyse les images croisées et les données déclarées uniquement comme des indices.
N'affirme jamais qu'un risque est absent parce qu'il n'est pas visible; aucune mesure ou distance non vérifiable.
N'invente pas de doctrine, de référence précise, ni de conformité. Cites la section/page uniquement si identifiée dans les textes fournis.
Distingue explicitement observations, risques possibles, vérifications terrain, mesures prudentes et incertitudes.
Ne donne pas d'ordre d'engagement, ne remplace ni l'officier ni le COS.
Retourne STRICTEMENT un JSON valide: {"summary":"...", "findings":[{"risk":"...","evidence":"...","measure":"...","reference":"...","confidence":"faible|moyenne|élevée"}], "limitations":["..."]}.
Si aucune référence textuelle ne soutient une mesure, indique "À confirmer dans le référentiel" et explicite la limite.
TEXTES DE RÉFÉRENCE VALIDÉS:
""" + reference_text
    result = await AsyncOpenAI().responses.create(
        model=os.environ.get("OPENAI_MODEL","gpt-4.1"),
        input=[{"role":"system","content":system},{"role":"user","content":blocks}],
        text={"format":{"type":"json_object"}},
        max_output_tokens=2500,
        store=False,
    )
    try:
        payload = json.loads(result.output_text)
        assert isinstance(payload.get("summary"),str) and isinstance(payload.get("findings"),list)
        for item in payload["findings"]:
            assert all(isinstance(item.get(k),str) for k in ("risk","evidence","measure","reference"))
        return payload
    except (ValueError, AssertionError, TypeError):
        raise HTTPException(502,"Réponse IA invalide")

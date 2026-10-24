# OffSec — analyse photographique (prototype)
La branche feature/offsec-ui-photo-ia reprend version-1.01.01 et conserve les pages métier.

## Serveur
L'API est dans backend/main.py, chemin POST /analyze (multipart: photos, context).
Installer les dépendances depuis backend/requirements.txt puis configurer OPENAI_API_KEY, OFFSEC_BEARER_TOKEN et OFFSEC_DOCS_DIR sur le SERVEUR.
Placer deux documents extraits et validés en UTF-8 dans OFFSEC_DOCS_DIR :
- Fiche_Guide_OFF_SECOPS_v5.txt
- DO_Soutien_Operationnel_2024_Annexe_1.txt
Les fichiers doctrinaux ne sont pas inclus dans GitHub. En leur absence le serveur refuse de produire un avis.
Démarrer avec `uvicorn main:app --host 127.0.0.1 --port 8000` depuis backend, puis publier derrière HTTPS.

## App mobile
Configurer EXPO_PUBLIC_OFFSEC_ANALYSIS_URL=https://votre-domaine/analyze.
IMPORTANT: L'authentification mobile reste à brancher à une identité serveur délivrant un jeton de courte durée. Ne jamais placer un secret dans EXPO_PUBLIC_ ni appeler l'API sans contrôle d'accès. Tant que ce point n'est pas réalisé, l'API renvoie 401; l'application propose capture et galerie mais n'a pas d'analyse fonctionnelle.
Vérifier versions compatibles Expo et tests Android/iOS. L'IA ne prend aucune décision opérationnelle; le COS et l'officier gardent la responsabilité.

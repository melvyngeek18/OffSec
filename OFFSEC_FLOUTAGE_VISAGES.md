# Floutage automatique avant traitement IA

Implémentation expérimentale côté serveur dans `backend/main.py`.
- Décodage et réorientation des images; réencodage JPEG sans EXIF source.
- Détection OpenCV Haar frontal; flou gaussien renforcé et étendu autour des zones détectées.
- Seule l'image retraitée est envoyée à l'API du modèle IA.
- Si une erreur survient pendant le décodage/détecteur, la transmission à l'IA est bloquée (422).

**Limitation critique :** la détection Haar de face frontale n'est pas exhaustive (profil, dos, masques, visages petits/occlus, flou, éclairage). Aucun mécanisme ne peut certifier ici qu'une photo est anonymisée. Une revue humaine des images et un outil d'occultation manuel restent nécessaires avant tout usage réel. Les photos originales circulent jusqu'au serveur OffSec sous HTTPS; elles ne sont pas floutées localement sur appareil. Évaluer la base légale, le contrat de sous-traitance, les politiques de rétention et réaliser la validation DPO.

**Déploiement** : `pip install -r backend/requirements.txt` puis exécuter les tests de sécurité, intégrer authentification mobile et hébergement sécurisé. Ne pas utiliser de vraies photos d'intervention avant validation.

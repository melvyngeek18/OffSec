# OffSec SITAC photo — mode opératoire et préparation IA (v1.2)

## Périmètre fonctionnel

- Accès : Accueil > SITAC photographique, Menu > SITAC, ou Périmètres > Créer ou modifier une SITAC.
- Acquisition : photo caméra ou image importée ; **pas de fond cartographique imposé** (choix 1-A).
- Tracés : zone polygonale colorée, flèche, texte, symbole, quatre couleurs. « Fermer zone » après trois sommets minimum.
- Historique : chaque sauvegarde crée une version datée et indépendante ; « Modifier » recharge le fond et les tracés pour créer une nouvelle version. Ne pas supprimer une version de l'historique si elle doit figurer au rapport.
- Rapport : image annotée de chaque version, légende par forme/couleur et date dans la synthèse PDF. Vérifier lisibilité du PDF généré sur chaque appareil.
- Analyse : l'écran Analyse photo IA propose l'ajout explicite d'une version SITAC aux autres photos. Elle subit le même contrôle manuel de masquage et une confirmation d'envoi. Aucune analyse ni transmission automatique.
- Les calculs SSO ne sont pas modifiés.

## Choix 6-C : aucune IA ni serveur activé par défaut

L'application inclut un raccordement facultatif, mais **EXPO_PUBLIC_OFFSEC_AI_ENABLED** est absent par défaut : aucun envoi possible. Pour l'activer ultérieurement, un administrateur doit faire approuver et déployer un backend HTTPS sécurisé, puis renseigner **au moment de la compilation** :

```env
EXPO_PUBLIC_OFFSEC_AI_ENABLED=true
EXPO_PUBLIC_OFFSEC_ANALYSIS_URL=https://votre-domaine-sdis.exemple/api/analyze
```

Ne pas placer de clé API ni de secret dans une variable EXPO_PUBLIC : cette valeur est incorporée au client et lisible par les utilisateurs. La clé d'un fournisseur d'IA (éventuellement un quota gratuit) appartient **uniquement au serveur**.

### Contrat d'intégration serveur attendu

Requête : POST /api/analyze, multipart/form-data, fichiers `photos` (JPEG masqués par l'utilisateur) et champ texte JSON `context`. Avant tout envoi, OffSec exige que chaque photo soit marquée comme revue avec une image préparée `safeUri` et demande une confirmation. Le serveur **ne doit pas** considérer cette déclaration comme suffisante.

Réponse JSON attendue :

```json
{
  "summary": "Observations visibles à confirmer",
  "findings": [
    {"risk":"Risque apparent","evidence":"Indice visuel précis","measure":"Mesure proposée à valider","reference":"Référence documentaire vérifiable","confidence":"incertitude"}
  ],
  "limitations": ["Les dangers hors champ ne peuvent pas être exclus"]
}
```

Exigences avant mise en service réelle :

1. Avis DPO/RSSI/autorité du SDIS, analyse des finalités, accès et sous-traitance, hébergement et éventuels transferts ; documenter la base juridique et la durée de conservation.
2. Authentifier chaque appel et l'autoriser par profil ; appliquer limite de débit, quota, taille et nombre de fichiers, journalisation minimale sans photos ni données sensibles.
3. Vérifier côté serveur le type et la taille des images ; réencoder en JPEG sans métadonnées ; détecter/masquer à nouveau visages, plaques, personnes, inscriptions et autres identifiants avant envoi au fournisseur. Prévoir refus si masquage insuffisant.
4. Choisir un modèle réellement multimodal acceptant plusieurs JPEG, tester ses quotas gratuits en vigueur, ses conditions contractuelles et sa localisation des traitements. **L'offre gratuite ne garantit pas la confidentialité ni le RGPD.**
5. Interdire les affirmations définitives sur les risques invisibles et les prescriptions inventées : références validées, commentaires d'incertitude, approbation humaine obligatoire et décision opérationnelle réservée à l'officier/COS.
6. Prévoir suppression et durée de vie courtes des uploads, pas de stockage persistant par défaut ; jamais de clé ou photo dans les logs, erreurs, code source, GitHub Actions ou analytics.
7. Tester avec données fictives : mode avion = édition et PDF utilisables ; bouton IA désactivé ; SITAC masquée + accord = seul contenu envoyé ; serveur indisponible = retour clair sans perte des données.

### Attention

Le service IA n'existe pas dans ce dépôt, conformément au choix 6-C. La compatibilité web/Android et l'enregistrement du PDF sont à confirmer par une compilation verte et des tests sur terminaux. Les fichiers photo originaux ne sont pas envoyés automatiquement. Une SITAC avec des identifiants visibles doit être masquée avant tout transfert externe.

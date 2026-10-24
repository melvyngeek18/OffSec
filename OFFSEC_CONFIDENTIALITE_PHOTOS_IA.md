# OffSec — politique de conception photo/IA (projet à valider par le DPO)
Statut : **mesures techniques partielles**, ne pas présenter comme conformité RGPD certifiée.

## Architecture visée
- Application utilisable sans réseau; IA désactivable et jamais nécessaire au calcul SSO.
- Photos de reconnaissance stockées localement dans l'espace de travail de l'application; ne transmettre que sur action et confirmation explicites. Attention : les photos déjà utilisées dans le module de rapport peuvent être conservées localement; vérifier sauvegardes et purges.
- Ne jamais transmettre identifiants d'intervention, GPS, visages, plaques, victimes ou données médicales sans nécessité établie et cadre autorisé.
- L'option EXIF=false n'assure pas que les octets image soient exempts de métadonnées. Prévoir une ré-encodage contrôlé et un outil d'occultation manuel testé avant la mise en production.
- Serveur HTTPS avec authentification individuelle, droits, traçabilité minimale, absence de logs des corps et de cache HTTP. Gestion des secrets exclusivement serveur. Aucun stockage persistant des photos par le code backend proposé, sans garantie sur l'infrastructure ou les prestataires.
- Référentiels validés et versionnés, réévaluation humaine obligatoire.

## Analyse IA
Le fournisseur API OpenAI est paramétré côté serveur; aucune application ChatGPT, Gemini ou Copilot n'a besoin d'être installée sur Android ou Surface. Les utilisateurs ne doivent pas saisir de clé API. Le service **n'est pas opérationnel tant que l'authentification mobile et le déploiement sécurisé ne sont pas faits**.
L'option store=false réduit le stockage applicatif, mais des journaux de prévention des abus et exceptions de rétention peuvent rester applicables selon contrat et configuration.
Prévoir un mode panne / hors réseau avec saisie manuelle, sans file d'attente d'envoi automatique.

## Validation organisationnelle avant données réelles
1. Définir responsable de traitement, finalité, base légale, minimisation, catégories d'images, droits et information; contacter le DPO.
2. Vérifier pertinence d'une AIPD, sous-traitants, transferts internationaux, durées de conservation, procédure de purge et exercice des droits.
3. Valider doctrine, contrat API, résidence/traitement éventuels et architecture d'hébergement.
4. Effectuer essais Android / Edge Surface, inspection réseau, résilience hors ligne, ré-encodage des images, occultation, chiffrement et suppression.
5. Faire valider la sécurité applicative et l'usage opérationnel. L'outil ne remplace jamais le COS.

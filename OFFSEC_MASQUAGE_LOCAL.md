# Contrôle local des images — étape de confidentialité

## Parcours mis en place
1. Sélectionner ou prendre des photos.
2. Pour chaque photo, toucher les visages, plaques et informations identifiantes afin d'apposer un ou plusieurs rectangles opaques.
3. Cliquer **Préparer l'image**. Une nouvelle image JPEG est produite localement (capture de la composition sur Android ; Canvas dans Edge/Surface).
4. Examiner l'aperçu. Recommencer en cas d'élément sensible visible.
5. L'analyse IA refuse de démarrer si une image n'est pas marquée retraitée et vérifiée.
6. L'API reçoit la copie retraitée et exécute en outre une détection faciale serveur de secours.

## Limites de sécurité et RGPD
- **La détection automatique locale des visages n'est pas implémentée**. Le masquage local est manuel et doit être rigoureusement contrôlé. La seconde détection OpenCV sur serveur est imparfaite.
- Les rectangles opaques ne garantissent pas une anonymisation intégrale des personnes ou éléments contextuels.
- Les originaux restent présents dans la mémoire locale de la session (et potentiellement le cache interne du système/de l'application). Étudier leur purge et leur chiffrement.
- Aucune donnée d'intervention réelle ne doit être utilisée avant tests sur Android/Edge, revue du DPO, vérification des permissions et de l'API, et validation des procédures d'occultation.
- Le serveur IA n'est toujours pas déployé ni authentifié côté mobile. Le bouton IA demeure inopérant tant que les prérequis ne sont pas satisfaits.
- Pour obtenir un véritable floutage facial automatique *sur appareil*, choisir puis tester un moteur on-device dédié, comme ML Kit pour Android et un moteur WASM fiable pour Edge; l'étape actuelle est un masquage opaque manuel, plus facile à vérifier visuellement.

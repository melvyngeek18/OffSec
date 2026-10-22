# OffSec Surface — installation PWA (prototype)

## Public concerné
Microsoft Surface Pro/Go sous Windows 10/11 et Edge. Cette version s'installe depuis le navigateur; il n'y a pas de fichier APK Windows.

## Génération
GitHub Actions > `OffSec Surface PWA` > `Run workflow` sur la branche `feature/offsec-surface-pwa`. Une compilation réussie fournit `OffSec-PWA-Surface` dans les artifacts. Le workflow tente également un déploiement GitHub Pages, qui nécessite **Settings > Pages > Source = GitHub Actions** et l'autorisation Pages adéquate. L'URL cible est `https://melvyngeek18.github.io/OffSec/`; elle n'est valide qu'après un déploiement réussi.

## Installation sur Surface
1. Connecter la Surface à Internet, ouvrir l'URL PWA avec Edge.
2. Edge > menu … > Applications > Installer ce site en tant qu'application.
3. Ouvrir OffSec avec son raccourci.
4. Parcourir les pages lors du premier accès connecté, puis vérifier le mode avion **avant** usage.
5. Sur la page Analyse photo IA, l'IA peut être désactivée même en ligne. Sans connexion, elle est désactivée automatiquement; les contrôles sont manuels.

## Limites importantes avant mise en production
- GitHub Pages est un hébergement **public** : ne jamais y publier photos, noms, données de victimes, secrets, documents internes ou API privées. La sécurité des données persistées localement dans le navigateur n'est pas équivalente à une solution SDIS homologuée.
- Le mode hors réseau repose sur un service worker et un cache de ressources. Première installation connectée indispensable; vérifier en conditions réelles que les ressources et routes voulues ont bien été mises en cache.
- Photos : les URI des photos de session ne sont pas garanties persistantes après fermeture du navigateur. Stockage média persistant (IndexedDB) restant à développer et tester.
- L'export PDF Windows utilise la fonction impression du navigateur (choisir 'Enregistrer au format PDF') et doit être testé.
- L'IA exige un serveur HTTPS authentifié et des documents doctrinaux validés. Pas d'analyse IA opérationnelle par défaut.
- Les fonctions Expo natives (géolocalisation, photo, partage) doivent être vérifiées dans Edge. Aucun test Surface réel n'a été effectué.
- Ne pas utiliser ce prototype en décision opérationnelle sans validation sécurité, essais hors-réseau et conformité locale.

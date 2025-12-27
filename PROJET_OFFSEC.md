# 🚒 Application OffSec - Officier Sécurité

## 📱 Description

Application mobile professionnelle pour les Officiers de Sécurité lors des interventions opérationnelles.
Permet le suivi complet d'une intervention avec géolocalisation, évaluation des risques, mesures opérationnelles et calcul SSO.

## ✨ Fonctionnalités Principales

### 1. 🏠 Écran d'Accueil (Login)
- Saisie: Nom, Matricule, N° d'Intervention
- **Géolocalisation GPS automatique** (avec permissions)
- Saisie manuelle d'adresse
- Affichage des coordonnées GPS
- Design avec image "Officier Sécurité"

### 2. 🌤️ Écran Météo
- **Placeholder** pour intégration OpenWeatherMap (à configurer)
- Affichera: Température, Vitesse du vent, Conditions météo
- Basé sur les coordonnées GPS de l'intervention

### 3. 📊 Écran RI (Organisation)
- Affichage du schéma organisationnel
- Structure hiérarchique: CODIS → PCS → COS → OFF SECU

### 4. ✅ Écran Actions à Mener (12 actions)
- Barre de progression
- 12 actions principales avec switches
- Validation au fur et à mesure
- Actions basées sur la "Fiche Guide Ops"

### 5. 🛡️ Écran Mesures Opérationnelles (53 mesures)
- Organisées par catégories:
  - Binômes
  - Phénomènes thermiques
  - Circulations
  - Déblai
  - Violences urbaines
  - Hauteur
  - Moteurs thermiques
  - Communication
  - Levage
  - Services extérieurs
  - Radio
- Switches pour chaque mesure

### 6. ⚠️ Écran Zones à Risques (28 points)
- Catégories:
  - Périmètre de sécurité
  - Positionnement des engins
  - Coupures des fluides
  - Stockage de fluides
  - Risques spécifiques
  - Sécurité individuelle & collective
- Validation par switches

### 7. 📝 Écran SSO (Scoring)
- **Calcul automatique du score** basé sur 4 critères:
  1. Nombre de personnel engagé (0-4 pts)
  2. Durée prévisible (1-4 pts)
  3. Danger particulier (0-4 pts)
  4. Équipe spécialisée (0-4 pts)
- Conditions particulières (NRBC, climat, etc.)
- **Préconisation automatique** selon le niveau:
  - Niveau 0: Pas de SSO
  - Niveau I: VSAV
  - Niveau II: VSAV / INF
  - Niveau III: VSAV / INF / VSSO
  - Niveau IV: VSAV / INF / VSSO / MED
- Alerte si appel astreinte SDS nécessaire

### 8. 📑 Écran Synthèse Finale
- Récapitulatif complet de l'intervention
- Informations générales (nom, matricule, GPS)
- Score SSO et préconisations
- Statistiques de progression
- **Actions restantes à accomplir**
- Actions complétées
- Possibilité de modifier ou réinitialiser

## 🎨 Design

- **Couleur de fond**: `#262135` (violet foncé)
- **Couleur d'accentuation**: Rouge `#dc2626` (boutons principaux)
- Thème professionnel adapté aux interventions d'urgence
- Design mobile-first responsive
- Interface intuitive avec switches pour validation

## 💾 Stockage

- **AsyncStorage** (stockage local sur le téléphone)
- Sauvegarde automatique à chaque modification
- Persistance des données entre les sessions
- Possibilité de réinitialiser pour nouvelle intervention

## 📱 Technologies

- **Expo React Native** (cross-platform iOS/Android)
- **Expo Router** (navigation file-based)
- **expo-location** (géolocalisation GPS)
- **AsyncStorage** (stockage local)
- **React Context API** (gestion d'état global)
- **@react-native-picker/picker** (sélecteurs)

## 🔧 Configuration Requise

### API OpenWeatherMap (pour la météo)
1. Créer un compte sur: https://openweathermap.org/api
2. Obtenir une clé API gratuite
3. Configurer dans `/app/frontend/app/weather.tsx`:
   ```typescript
   const API_KEY = 'VOTRE_CLE_API';
   ```

## 🚀 Utilisation

1. **Démarrer l'application**: L'interface est accessible via Expo
2. **Remplir les informations initiales**: Nom, Matricule, N° Intervention
3. **Obtenir la géolocalisation**: GPS automatique ou saisie manuelle
4. **Naviguer dans les écrans** en suivant le workflow:
   - Accueil → Météo → RI → Actions → Opérations → Risques → SSO → Synthèse
5. **Valider les actions** avec les switches au fur et à mesure
6. **Calculer le score SSO** pour obtenir les préconisations
7. **Consulter la synthèse finale** pour voir les actions restantes

## 📊 Structure des Données

```typescript
{
  nom: string;
  matricule: string;
  numeroIntervention: string;
  adresse: string;
  latitude: number | null;
  longitude: number | null;
  actions: { [key: string]: boolean };  // 12 actions
  operations: { [key: string]: boolean };  // 53 mesures
  risks: { [key: string]: boolean };  // 28 points
  ssoScore: number;
  ssoLevel: string;
  ssoRecommendation: string;
}
```

## 📂 Structure du Projet

```
/app/frontend/
├── app/
│   ├── _layout.tsx          # Layout principal avec Context
│   ├── index.tsx            # Écran d'accueil (login)
│   ├── weather.tsx          # Écran météo
│   ├── ri.tsx              # Écran RI
│   ├── actions.tsx         # 12 actions principales
│   ├── operations.tsx      # 53 mesures opérationnelles
│   ├── risks.tsx           # 28 zones à risques
│   ├── sso.tsx             # Scoring SSO
│   └── summary.tsx         # Synthèse finale
├── contexts/
│   └── InterventionContext.tsx  # Gestion d'état global
└── app.json                # Configuration Expo
```

## 🎯 Conformité aux Documents Sources

✅ Basé sur:
- **Fiche Guide OFF SECOPS v5**: Actions principales, mesures opérationnelles, zones à risques
- **DO Soutien Opérationnel 2024 - Annexe 1**: Système de scoring SSO complet
- **RI.png**: Schéma organisationnel intégré

## ⚠️ Notes Importantes

1. **Météo**: Nécessite une clé API OpenWeatherMap (non configurée)
2. **Permissions**: L'application demande l'autorisation de géolocalisation
3. **Stockage**: Données sauvegardées localement sur le téléphone
4. **FlutterFlow**: Ce projet est Expo/React Native. Export direct vers FlutterFlow non disponible, mais l'application est entièrement fonctionnelle

## 🔄 Prochaines Étapes

1. **Configurer l'API météo** avec votre clé OpenWeatherMap
2. **Tester sur téléphone** via Expo Go
3. **Ajouter des fonctionnalités** selon vos besoins:
   - Export PDF de la synthèse
   - Photos d'intervention
   - Signatures numériques
   - Synchronisation cloud

## 📸 Captures d'Écran

L'application affiche:
- ✅ Image de l'Officier de Sécurité sur l'écran d'accueil
- ✅ Formulaire complet avec géolocalisation
- ✅ Navigation fluide entre tous les écrans
- ✅ Fond violet foncé (#262135) sur toutes les pages
- ✅ Switches pour validation des actions
- ✅ Calcul automatique des scores SSO

## 👨‍💻 Support

Pour toute question ou amélioration, l'application est prête à être déployée et testée!

---

**Version**: 1.0.0  
**Date**: Décembre 2024  
**Statut**: ✅ MVP Complet et Fonctionnel

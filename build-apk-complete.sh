#!/bin/bash

# Script de build APK pour OffSec
# Ce script prépare l'application pour la création d'un APK Android

set -e

echo "🚒 OffSec - Build APK Android"
echo "==============================="
echo ""

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Vérifier que nous sommes dans le bon dossier
if [ ! -f "app.json" ]; then
    echo -e "${RED}❌ Erreur: Exécutez ce script depuis le dossier frontend${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Étape 1: Installation des dépendances${NC}"
npm install

echo ""
echo -e "${BLUE}🔧 Étape 2: Vérification de la configuration${NC}"

# Vérifier que eas.json existe
if [ ! -f "eas.json" ]; then
    echo -e "${YELLOW}⚠️  Création du fichier eas.json${NC}"
    cat > eas.json << 'EOF'
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
EOF
    echo -e "${GREEN}✅ Fichier eas.json créé${NC}"
fi

echo ""
echo -e "${BLUE}📱 Étape 3: Export de l'application Android${NC}"
npx expo export --platform android --output-dir dist-android

echo ""
echo -e "${GREEN}✅ Export terminé!${NC}"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📋 PROCHAINES ÉTAPES POUR CRÉER L'APK:${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Option 1: Utiliser EAS Build (Recommandé)${NC}"
echo "   1. Créer un compte gratuit sur https://expo.dev/signup"
echo "   2. Installer EAS CLI: npm install -g eas-cli"
echo "   3. Se connecter: eas login"
echo "   4. Lancer le build: eas build --platform android --profile preview"
echo "   5. Télécharger l'APK depuis le lien fourni"
echo ""
echo -e "${BLUE}Option 2: Build local avec Android Studio${NC}"
echo "   1. Installer Android Studio et Android SDK"
echo "   2. Exécuter: npx expo prebuild --platform android"
echo "   3. Ouvrir le dossier android/ dans Android Studio"
echo "   4. Build → Generate Signed Bundle/APK → APK"
echo "   5. Récupérer l'APK dans android/app/build/outputs/apk/"
echo ""
echo -e "${BLUE}Option 3: Test avec Expo Go (Sans APK)${NC}"
echo "   1. Installer 'Expo Go' depuis le Play Store"
echo "   2. Démarrer le serveur: npm start"
echo "   3. Scanner le QR Code avec Expo Go"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}📝 Les fichiers exportés sont dans: dist-android/${NC}"
echo ""

# Créer un fichier README pour le build
cat > BUILD_INSTRUCTIONS.md << 'EOF'
# 🚒 Instructions de Build APK - OffSec

## ✅ Export Terminé

L'application a été exportée avec succès pour Android dans le dossier `dist-android/`.

## 🎯 Méthodes pour Créer l'APK

### 🌟 Méthode 1: EAS Build (LA PLUS SIMPLE)

**Avantages**: 
- Aucune configuration locale nécessaire
- Build dans le cloud
- APK prêt en 10-20 minutes
- Gratuit (30 builds/mois)

**Étapes**:

```bash
# 1. Créer un compte Expo (gratuit)
# Allez sur: https://expo.dev/signup

# 2. Installer EAS CLI
npm install -g eas-cli

# 3. Se connecter
eas login

# 4. Lancer le build APK
eas build --platform android --profile preview

# 5. Attendre l'email avec le lien de téléchargement
# Ou consulter: https://expo.dev/accounts/[username]/projects/offsec-app/builds
```

**Résultat**: Vous recevrez un lien pour télécharger le fichier `.apk`

---

### 🔧 Méthode 2: Build Local avec Android Studio

**Avantages**:
- Contrôle total du processus
- Pas besoin de compte en ligne
- Personnalisation avancée

**Prérequis**:
- Android Studio installé
- Android SDK (API 33+)
- Java JDK 11 ou supérieur

**Étapes**:

```bash
# 1. Générer les fichiers natifs Android
npx expo prebuild --platform android

# 2. Ouvrir Android Studio
# File → Open → Sélectionner le dossier 'android/'

# 3. Dans Android Studio
# Build → Generate Signed Bundle/APK → Choisir 'APK'

# 4. Créer un keystore (première fois)
# Ou utiliser un existant

# 5. Build Release
# L'APK sera dans: android/app/build/outputs/apk/release/
```

---

### 📱 Méthode 3: Test avec Expo Go (Sans APK)

**Avantages**:
- Test immédiat sans build
- Parfait pour les tests
- Mises à jour en direct

**Étapes**:

```bash
# 1. Installer 'Expo Go' depuis le Play Store
# https://play.google.com/store/apps/details?id=host.exp.exponent

# 2. Démarrer le serveur de développement
npm start

# 3. Scanner le QR Code avec Expo Go
```

**Note**: Cette méthode ne crée pas d'APK installable, c'est uniquement pour les tests.

---

## 📦 Informations sur l'Application

- **Nom**: OffSec - Officier Sécurité
- **Package**: com.offsec.app
- **Version**: 1.0.0
- **Plateforme**: Android 6.0+
- **Permissions**: GPS, Internet

## 🎨 Personnalisation

### Changer l'icône
Remplacez les fichiers dans `assets/images/`:
- `icon.png` (1024x1024)
- `adaptive-icon.png` (1024x1024)
- `splash-icon.png` (200x200)

### Modifier les informations
Éditez `app.json`:
```json
{
  "expo": {
    "name": "Votre Nom",
    "version": "1.0.1",
    "android": {
      "package": "com.votre.package",
      "versionCode": 2
    }
  }
}
```

## 🚀 Distribution

### Option A: Installation Directe
1. Transférer l'APK sur les téléphones Android
2. Autoriser "Sources inconnues" dans les paramètres
3. Installer l'APK

### Option B: Google Play Store
1. Créer un compte développeur Google Play (25$ unique)
2. Build en mode production (AAB): `eas build --platform android --profile production`
3. Soumettre sur la console Google Play

### Option C: Firebase App Distribution
1. Créer un projet Firebase
2. Télécharger l'APK
3. Inviter des testeurs par email
4. Distribution automatique

## 🐛 Dépannage

### Erreur: "No Android SDK found"
```bash
# Installer Android Studio et définir ANDROID_HOME
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Erreur: "Build failed"
- Vérifier que app.json est valide (format JSON)
- Vérifier les dépendances: `npm install`
- Consulter les logs sur expo.dev

### APK ne s'installe pas
- Activer "Sources inconnues" dans Android
- Vérifier que l'APK n'est pas corrompu
- Essayer de reconstruire

## 📞 Support

- Documentation Expo: https://docs.expo.dev/
- Forum Expo: https://forums.expo.dev/
- Discord Expo: https://chat.expo.dev/

## ✅ Checklist de Build

- [ ] Compte Expo créé (si utilisation EAS)
- [ ] Code testé localement
- [ ] Icônes personnalisées
- [ ] Version incrémentée dans app.json
- [ ] Permissions vérifiées
- [ ] Build lancé
- [ ] APK téléchargé
- [ ] APK testé sur appareil réel

---

**Date de build**: $(date)
**Status**: ✅ Prêt pour le build APK
EOF

echo -e "${GREEN}✅ Instructions de build créées: BUILD_INSTRUCTIONS.md${NC}"
echo ""
echo -e "${BLUE}🎉 Tout est prêt! Suivez les instructions ci-dessus pour créer votre APK.${NC}"

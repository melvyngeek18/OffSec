# 📱 Guide Complet: Créer un APK Android pour OffSec

## 🎯 Vue d'Ensemble

Votre application **OffSec** est prête à être compilée en APK Android. Ce guide vous explique **3 méthodes** pour créer votre fichier .apk.

---

## ⚡ Méthode 1: EAS Build (RECOMMANDÉ - Plus Simple)

### Prérequis
- ✅ Application fonctionnelle (déjà fait!)
- ✅ Compte Expo gratuit
- ✅ 10 minutes de temps

### Étape 1: Créer un Compte Expo (Gratuit)

1. Allez sur: https://expo.dev/signup
2. Créez un compte gratuit
3. Notez votre username Expo

### Étape 2: Configuration du Projet

Votre projet est déjà configuré, mais vérifiez `app.json`:

```json
{
  "expo": {
    "name": "OffSec",
    "slug": "offsec-app",
    "version": "1.0.0",
    "android": {
      "package": "com.offsec.app",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#262135"
      },
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ]
    }
  }
}
```

### Étape 3: Installer EAS CLI (Sur Votre Ordinateur)

```bash
# Ouvrez un terminal/command prompt
npm install -g eas-cli

# Connectez-vous à votre compte Expo
eas login
```

### Étape 4: Obtenir le Code de l'Application

**Option A: Export GitHub (Recommandé)**
1. Dans Emergent, cliquez sur "Save to GitHub"
2. Clonez le repo sur votre ordinateur:
   ```bash
   git clone <url-de-votre-repo>
   cd <nom-du-repo>/frontend
   ```

**Option B: Copier les Fichiers**
1. Téléchargez tous les fichiers du dossier `/app/frontend`
2. Mettez-les dans un dossier local

### Étape 5: Build l'APK

Dans le dossier de votre projet:

```bash
# Initialiser EAS (première fois seulement)
eas build:configure

# Créer l'APK
eas build --platform android --profile preview
```

**Ce qui se passe:**
1. EAS envoie votre code sur les serveurs Expo
2. Compilation Android dans le cloud (5-20 min)
3. Vous recevez un lien de téléchargement

### Étape 6: Télécharger l'APK

1. Attendez la notification email
2. OU allez sur: https://expo.dev/accounts/[votre-username]/projects/offsec-app/builds
3. Cliquez sur le build terminé
4. Téléchargez le fichier `.apk`

### Étape 7: Installer sur Android

**Sur votre téléphone:**
1. Transférez le fichier APK
2. Paramètres → Sécurité → Autoriser sources inconnues
3. Ouvrez le fichier APK
4. Installez l'application

✅ **L'app est installée sur votre téléphone!**

---

## 🔧 Méthode 2: Expo Build Classic (Alternative)

### Si EAS ne fonctionne pas

```bash
# Dans le dossier frontend
expo build:android

# Choisissez le type de build:
# → APK (pour installation directe)

# Attendez la fin du build (~15 min)
# Téléchargez l'APK depuis le lien fourni
```

---

## 💻 Méthode 3: Build Local avec Android Studio (Avancé)

### Pour les développeurs expérimentés

#### Prérequis
- Android Studio installé
- Android SDK configuré
- Java JDK 11+

#### Étapes

1. **Ejecter de Expo:**
   ```bash
   cd frontend
   npx expo prebuild --platform android
   ```

2. **Ouvrir dans Android Studio:**
   - Ouvrir le dossier `android/`
   - Build → Generate Signed Bundle / APK
   - Choisir APK
   - Créer un keystore (première fois)
   - Build signé

3. **Récupérer l'APK:**
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

---

## 📋 Fichier eas.json (Configuration)

Créez `/app/frontend/eas.json` avec ce contenu:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

**Profils disponibles:**
- `preview` → Génère un APK (installation directe)
- `production` → Génère un AAB (pour Google Play)

---

## 🎨 Personnalisation Avant Build

### 1. Icône de l'Application

Remplacez dans `/app/frontend/assets/images/`:
- `icon.png` (1024x1024)
- `adaptive-icon.png` (1024x1024)

### 2. Splash Screen

Remplacez `splash-icon.png` (200x200) avec votre logo

### 3. Informations App

Modifiez dans `app.json`:
```json
{
  "name": "OffSec - Officier Sécurité",
  "description": "Application d'intervention pour officiers de sécurité",
  "version": "1.0.0"
}
```

---

## 🚀 Build Rapide: Script Complet

Copiez ce script pour automatiser:

```bash
#!/bin/bash
# build-apk.sh

echo "🚀 Build APK OffSec"
echo "===================="

# Vérifier que nous sommes dans le bon dossier
if [ ! -f "app.json" ]; then
    echo "❌ Erreur: Exécutez depuis le dossier frontend"
    exit 1
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Créer le build
echo "🔨 Création du build APK..."
eas build --platform android --profile preview --non-interactive

echo "✅ Build lancé! Vérifiez vos emails pour le lien de téléchargement"
echo "Ou allez sur: https://expo.dev/"
```

**Utilisation:**
```bash
chmod +x build-apk.sh
./build-apk.sh
```

---

## 📊 Comparaison des Méthodes

| Méthode | Temps | Difficulté | Coût | Recommandé |
|---------|-------|------------|------|------------|
| **EAS Build** | 10-20 min | ⭐ Facile | Gratuit* | ✅ OUI |
| **Expo Classic** | 15-30 min | ⭐⭐ Moyen | Gratuit | ⚠️ OK |
| **Android Studio** | 30-60 min | ⭐⭐⭐⭐ Difficile | Gratuit | ❌ Experts |

*30 builds gratuits/mois avec compte Expo

---

## 🔐 Signature de l'APK

### Pour Distribution Publique

Si vous voulez distribuer sur Google Play Store:

1. **Créer une clé de signature:**
   ```bash
   eas credentials
   ```

2. **Configurer dans eas.json:**
   ```json
   {
     "build": {
       "production": {
         "android": {
           "buildType": "app-bundle"
         }
       }
     }
   }
   ```

3. **Build production:**
   ```bash
   eas build --platform android --profile production
   ```

---

## ✅ Checklist Avant Build

- [ ] Compte Expo créé
- [ ] EAS CLI installé
- [ ] Code exporté/cloné
- [ ] app.json configuré
- [ ] eas.json créé
- [ ] Icônes personnalisées
- [ ] Permissions vérifiées
- [ ] Testé sur Expo Go

---

## 🐛 Problèmes Courants

### Erreur: "No Android SDK found"
**Solution:**
```bash
# Installer Android SDK via Android Studio
# OU définir ANDROID_HOME
export ANDROID_HOME=$HOME/Android/Sdk
```

### Erreur: "Build failed"
**Solution:**
1. Vérifiez app.json (JSON valide)
2. Vérifiez package.json (dépendances)
3. Consultez les logs sur expo.dev

### APK ne s'installe pas
**Solution:**
1. Activez "Sources inconnues" dans Android
2. Vérifiez que l'APK n'est pas corrompu
3. Essayez de rebuild

---

## 📱 Distribution de l'APK

### Option 1: Installation Directe
- Transférez l'APK via USB/Email/Cloud
- Installez manuellement sur chaque appareil

### Option 2: Google Play Store (Production)
1. Créer un compte développeur Google Play (25$ unique)
2. Build production (AAB)
3. Soumettre pour review
4. Publication publique

### Option 3: Firebase App Distribution (Test)
1. Créer compte Firebase
2. Uploader l'APK
3. Inviter testeurs par email
4. Distribution automatique

---

## 💡 Conseils Pro

### 1. Versions
Incrémentez toujours:
```json
{
  "version": "1.0.1",
  "android": {
    "versionCode": 2
  }
}
```

### 2. Build Profiles
Créez des profils différents:
- `development` → Debug
- `preview` → Test interne
- `production` → Production

### 3. Variables d'Environnement
Sécurisez vos clés API:
```bash
eas secret:create --scope project --name API_KEY --value "votre_cle"
```

---

## 🎯 Résumé: Méthode Rapide

**Pour Créer Votre APK en 5 Minutes:**

```bash
# 1. Installer EAS CLI
npm install -g eas-cli

# 2. Se connecter
eas login

# 3. Dans votre dossier frontend
cd /path/to/frontend

# 4. Build
eas build --platform android --profile preview

# 5. Attendre et télécharger l'APK
```

**C'est tout! 🎉**

---

## 📞 Support

**Besoin d'aide?**
- Documentation Expo: https://docs.expo.dev/
- Forum Expo: https://forums.expo.dev/
- Discord Emergent: https://discord.gg/VzKfwCXC4A

**Questions fréquentes:**
- Build coincé? → Vérifiez expo.dev/builds
- Erreur de signature? → Recréez les credentials
- APK trop gros? → Activez ProGuard (production)

---

## ✅ Prochaines Étapes

1. ✅ Créez votre compte Expo
2. ✅ Exportez votre code (GitHub ou local)
3. ✅ Lancez le build avec EAS
4. ✅ Téléchargez et testez l'APK
5. ✅ Distribuez à votre équipe!

**Votre application OffSec sera bientôt sur Android! 📱🚒**

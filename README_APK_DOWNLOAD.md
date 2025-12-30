# 🚒 OffSec - Application Android

## 📱 Page de Téléchargement Déployée

**URL de la page de téléchargement**: https://3000-ibat6mq77imvnyikfdeqe-02b9cc79.sandbox.novita.ai

### 🎯 Accès Rapide

1. **Via Navigateur**: Ouvrez le lien ci-dessus
2. **Via QR Code**: Scannez le QR Code généré automatiquement sur la page
3. **Via Expo Go**: Utilisez l'application Expo Go pour tester sans installer

---

## 🚀 Comment Créer et Distribuer l'APK

### Étape 1: Créer le Compte Expo (Gratuit)

1. Allez sur: https://expo.dev/signup
2. Créez un compte gratuit
3. Vérifiez votre email

### Étape 2: Créer l'APK avec EAS Build

```bash
# 1. Installer EAS CLI
npm install -g eas-cli

# 2. Se connecter à votre compte
eas login

# 3. Aller dans le dossier frontend
cd /home/user/webapp/frontend

# 4. Lancer le build APK (gratuit, 30 builds/mois)
eas build --platform android --profile preview

# 5. Attendre 10-20 minutes
# Vous recevrez un email avec le lien de téléchargement

# 6. Télécharger l'APK
# Lien aussi disponible sur: https://expo.dev/accounts/[username]/builds
```

### Étape 3: Héberger l'APK

Une fois l'APK téléchargé, hébergez-le:

#### Option A: GitHub Releases (Recommandé)

```bash
# 1. Créer un tag de version
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0

# 2. Créer une release sur GitHub
# Aller sur: https://github.com/[user]/[repo]/releases/new
# - Sélectionner le tag v1.0.0
# - Titre: "OffSec v1.0.0"
# - Description: Liste des fonctionnalités
# - Upload le fichier APK
# - Publier la release

# 3. Obtenir le lien direct
# Format: https://github.com/[user]/[repo]/releases/download/v1.0.0/offsec.apk
```

#### Option B: Firebase Storage

```bash
# 1. Créer un projet Firebase
# Aller sur: https://console.firebase.google.com/

# 2. Activer Firebase Storage

# 3. Uploader l'APK
# Storage → Upload → Sélectionner l'APK

# 4. Rendre public
# Clic droit sur le fichier → "Get download URL"
```

#### Option C: Cloudflare R2

```bash
# 1. Créer un bucket R2 sur Cloudflare

# 2. Uploader l'APK via dashboard ou CLI

# 3. Configurer l'accès public

# 4. Obtenir l'URL publique
```

### Étape 4: Mettre à Jour la Page de Téléchargement

Éditez le fichier `/download-page/index.html`:

```javascript
// Ligne ~285 - Remplacer par votre URL d'APK
const apkUrl = "https://github.com/[user]/[repo]/releases/download/v1.0.0/offsec.apk";
```

### Étape 5: Déployer la Page

#### Option A: Netlify (Recommandé)

```bash
# 1. Installer Netlify CLI
npm install -g netlify-cli

# 2. Aller dans le dossier
cd /home/user/webapp/download-page

# 3. Login
netlify login

# 4. Deploy
netlify deploy --prod

# 5. Obtenir l'URL: https://[nom-site].netlify.app
```

#### Option B: Vercel

```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Aller dans le dossier
cd /home/user/webapp/download-page

# 3. Login et deploy
vercel --prod

# 4. Obtenir l'URL: https://[nom-site].vercel.app
```

#### Option C: GitHub Pages

```bash
# 1. Créer une branche gh-pages
git checkout -b gh-pages

# 2. Copier les fichiers de la page
cp -r download-page/* .

# 3. Commit et push
git add .
git commit -m "Deploy download page"
git push origin gh-pages

# 4. Activer GitHub Pages dans Settings → Pages
# 5. URL: https://[username].github.io/[repo]
```

---

## 📋 Processus Complet Résumé

```
┌─────────────────────────────────────────────────────────────┐
│                  WORKFLOW COMPLET                            │
└─────────────────────────────────────────────────────────────┘

1. ✅ Code Source Prêt
   └─> /home/user/webapp/frontend/

2. 🔨 Créer l'APK
   └─> eas build --platform android --profile preview
   └─> Attendre 10-20 min
   └─> Télécharger offsec.apk

3. 📦 Héberger l'APK
   └─> GitHub Releases / Firebase / Cloudflare
   └─> Obtenir URL publique

4. 🌐 Mettre à jour la page
   └─> Éditer download-page/index.html
   └─> Changer apkUrl avec la vraie URL

5. 🚀 Déployer la page
   └─> Netlify / Vercel / GitHub Pages
   └─> Obtenir URL publique

6. 📱 Partager
   └─> Envoyer le lien de la page
   └─> Scanner le QR Code
   └─> Télécharger et installer l'APK
```

---

## 🎨 Fonctionnalités de l'Application

- ✅ **Géolocalisation GPS automatique**
- ✅ **12 actions principales** à valider
- ✅ **53 mesures opérationnelles** organisées par catégories
- ✅ **28 points de zones à risques**
- ✅ **Calcul automatique du score SSO** (0-16 points)
- ✅ **Préconisations automatiques** selon le niveau
- ✅ **Synthèse complète** de l'intervention
- ✅ **Stockage local** avec AsyncStorage
- ✅ **Interface professionnelle** thème violet foncé

---

## 📱 Installation pour les Utilisateurs

1. **Ouvrir la page de téléchargement** (via lien ou QR Code)
2. **Cliquer sur "Télécharger l'APK"** ou scanner le QR Code
3. **Autoriser les sources inconnues**:
   - Paramètres → Sécurité → Sources inconnues → Activer
4. **Installer l'APK** téléchargé
5. **Lancer l'application** depuis l'écran d'accueil

---

## 🔧 Test Rapide sans APK (Expo Go)

Pour tester immédiatement sans créer d'APK:

```bash
# 1. Installer 'Expo Go' depuis le Play Store
# https://play.google.com/store/apps/details?id=host.exp.exponent

# 2. Démarrer le serveur de développement
cd /home/user/webapp/frontend
npm start

# 3. Scanner le QR Code avec Expo Go
```

---

## 📊 Informations Techniques

- **Nom**: OffSec - Officier Sécurité
- **Package**: com.offsec.app
- **Version**: 1.0.0
- **Version Code**: 1
- **Plateforme**: Android 6.0+ (API 23+)
- **Taille**: ~50 MB
- **Permissions**: GPS, Internet
- **Technologies**: Expo React Native, Expo Router, AsyncStorage

---

## 🗂️ Structure du Projet

```
/home/user/webapp/
├── frontend/                    # Application React Native
│   ├── app/                     # Écrans de l'application
│   │   ├── index.tsx           # Écran d'accueil (login)
│   │   ├── weather.tsx         # Météo
│   │   ├── ri.tsx              # Organisation RI
│   │   ├── actions.tsx         # 12 actions
│   │   ├── operations.tsx      # 53 mesures
│   │   ├── risks.tsx           # 28 zones à risques
│   │   ├── sso.tsx             # Scoring SSO
│   │   └── summary.tsx         # Synthèse finale
│   ├── contexts/               # Gestion d'état
│   ├── assets/                 # Images et ressources
│   ├── app.json                # Configuration Expo
│   └── eas.json                # Configuration EAS Build
│
├── download-page/              # Page de téléchargement web
│   └── index.html              # Page avec QR Code
│
├── download-server.js          # Serveur Express pour la page
├── build-apk-complete.sh       # Script de build automatisé
├── DEPLOYMENT_GUIDE.md         # Guide de déploiement détaillé
├── PROJET_OFFSEC.md            # Documentation du projet
└── GUIDE_CREATION_APK.md       # Guide création APK

```

---

## 🔐 Sécurité

### Pour une Distribution Professionnelle

```bash
# 1. Créer une clé de signature
keytool -genkey -v -keystore offsec-release.keystore \
        -alias offsec -keyalg RSA -keysize 2048 -validity 10000

# 2. Configurer dans eas.json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}

# 3. Build signé
eas build --platform android --profile production
```

---

## 📈 Prochaines Étapes

- [ ] Créer un compte Expo
- [ ] Lancer le build avec EAS
- [ ] Télécharger l'APK
- [ ] Héberger l'APK (GitHub Releases recommandé)
- [ ] Mettre à jour la page avec l'URL de l'APK
- [ ] Déployer la page (Netlify recommandé)
- [ ] Tester le téléchargement
- [ ] Partager le lien avec les utilisateurs

---

## 🐛 Dépannage

### Build EAS échoue
```bash
# Vérifier app.json
cat frontend/app.json

# Vérifier les dépendances
cd frontend && npm install

# Relancer le build
eas build --platform android --profile preview --clear-cache
```

### QR Code ne fonctionne pas
- Vérifier que l'URL de l'APK est publique
- Tester l'URL dans un navigateur
- Régénérer le QR Code avec la bonne URL

### APK ne s'installe pas
- Activer "Sources inconnues" dans les paramètres Android
- Vérifier que l'APK n'est pas corrompu
- Vérifier la version Android (6.0+ requis)

---

## 📞 Support

- **Documentation Expo**: https://docs.expo.dev/
- **Forum Expo**: https://forums.expo.dev/
- **Guide de Build**: /GUIDE_CREATION_APK.md
- **Guide de Déploiement**: /DEPLOYMENT_GUIDE.md

---

## ✅ État Actuel

- ✅ **Code source**: Complet et fonctionnel
- ✅ **Export Android**: Généré dans `frontend/dist-android/`
- ✅ **Page de téléchargement**: Créée avec QR Code
- ✅ **Serveur local**: Déployé sur https://3000-ibat6mq77imvnyikfdeqe-02b9cc79.sandbox.novita.ai
- ⏳ **APK**: À créer avec EAS Build (10-20 min)
- ⏳ **Hébergement APK**: À configurer (GitHub Releases recommandé)
- ⏳ **Déploiement page**: À faire (Netlify recommandé)

---

**Version**: 1.0.0  
**Date**: 2025-12-30  
**Status**: ✅ Prêt pour la création de l'APK

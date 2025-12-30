# 📱 Guide de Déploiement - OffSec APK

## 🎯 Vue d'Ensemble

Ce document explique comment déployer l'application **OffSec** en tant qu'APK Android téléchargeable via un lien ou un QR Code.

## 📦 Ce qui a été créé

### 1. Page de Téléchargement Web
- **Fichier**: `/download-page/index.html`
- **Contenu**: Page professionnelle avec QR Code, instructions d'installation, et liste des fonctionnalités
- **Design**: Thème violet foncé (#262135) correspondant à l'application

### 2. Scripts de Build
- **`build-apk-complete.sh`**: Script complet pour préparer le build APK
- **Configuration EAS**: Fichier `eas.json` pour les builds avec Expo

### 3. Export Android
- **Dossier**: `/frontend/dist-android/`
- **Contenu**: Fichiers exportés prêts pour le packaging APK

## 🚀 Options de Déploiement

### Option 1: Hébergement Web Simple (Recommandé pour Tests)

#### A. Hébergement Local

```bash
# Dans le dossier download-page
cd /home/user/webapp/download-page

# Avec Python
python3 -m http.server 8080

# OU avec Node.js
npx http-server -p 8080
```

**Accès**: http://localhost:8080

#### B. Hébergement sur GitHub Pages

```bash
# 1. Créer une branche gh-pages
git checkout -b gh-pages

# 2. Copier les fichiers de la page
cp -r download-page/* .

# 3. Commit et push
git add .
git commit -m "Deploy download page"
git push origin gh-pages

# 4. Activer GitHub Pages dans les paramètres du repo
```

**URL**: https://[votre-username].github.io/[repo-name]/

#### C. Hébergement sur Netlify/Vercel

**Netlify**:
1. Connectez votre repo GitHub
2. Build settings: 
   - Base directory: `download-page`
   - Publish directory: `.`
3. Deploy

**Vercel**:
```bash
# Installer Vercel CLI
npm i -g vercel

# Dans le dossier download-page
cd download-page
vercel --prod
```

### Option 2: Distribution via Firebase

```bash
# 1. Installer Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialiser
firebase init hosting

# 4. Sélectionner download-page comme dossier public

# 5. Déployer
firebase deploy --only hosting
```

**URL**: https://[projet-id].web.app

### Option 3: Cloudflare Pages

```bash
# Via le dashboard Cloudflare
# 1. Pages → Create a project
# 2. Connecter GitHub repo
# 3. Build settings:
#    - Build directory: download-page
# 4. Deploy
```

## 📱 Création du Vrai APK

### Méthode Recommandée: EAS Build

```bash
# 1. Installer EAS CLI
npm install -g eas-cli

# 2. Se connecter à Expo
eas login

# 3. Dans le dossier frontend
cd /home/user/webapp/frontend

# 4. Configurer le projet (première fois)
eas build:configure

# 5. Lancer le build APK
eas build --platform android --profile preview

# 6. Attendre le build (10-20 minutes)
# Vous recevrez un email avec le lien de téléchargement

# 7. Télécharger l'APK
# Lien disponible sur: https://expo.dev/accounts/[username]/builds
```

**Résultat**: Fichier `offsec-v1.0.0.apk` prêt à être distribué

### Alternative: Build Local avec Android Studio

```bash
# 1. Installer Android Studio et Android SDK

# 2. Générer les fichiers natifs
cd /home/user/webapp/frontend
npx expo prebuild --platform android

# 3. Ouvrir dans Android Studio
# File → Open → Sélectionner le dossier android/

# 4. Build APK
# Build → Generate Signed Bundle/APK → APK

# 5. Récupérer l'APK
# android/app/build/outputs/apk/release/app-release.apk
```

## 🔗 Héberger l'APK

Une fois l'APK créé:

### Option A: GitHub Releases

```bash
# 1. Créer un tag
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0

# 2. Créer une release sur GitHub
# Releases → Draft a new release
# Uploader le fichier APK
```

**Lien direct**: https://github.com/[user]/[repo]/releases/download/v1.0.0/offsec.apk

### Option B: Firebase Storage

```bash
# Uploader l'APK sur Firebase Storage
# Obtenir une URL publique
# https://firebasestorage.googleapis.com/...
```

### Option C: Cloudflare R2 / AWS S3

```bash
# Uploader l'APK sur un bucket public
# Obtenir l'URL publique
```

## 🎯 Processus Complet de A à Z

### Étape 1: Créer l'APK

```bash
cd /home/user/webapp/frontend

# Option rapide avec EAS
npm install -g eas-cli
eas login
eas build --platform android --profile preview

# Attendre le build et télécharger l'APK
```

### Étape 2: Héberger l'APK

```bash
# Sur GitHub Releases (exemple)
git tag v1.0.0
git push origin v1.0.0
# Upload APK via l'interface GitHub
```

### Étape 3: Mettre à jour la page de téléchargement

Éditez `/download-page/index.html`:

```javascript
// Ligne ~285 - Modifier l'URL de l'APK
const apkUrl = "https://github.com/[user]/[repo]/releases/download/v1.0.0/offsec.apk";
```

### Étape 4: Déployer la page

```bash
# Sur Netlify (exemple)
cd /home/user/webapp/download-page
vercel --prod

# OU GitHub Pages
git checkout -b gh-pages
cp -r download-page/* .
git add .
git commit -m "Deploy download page"
git push origin gh-pages
```

### Étape 5: Partager le lien

Partagez l'URL de la page de téléchargement:
- Via lien direct: https://[votre-site].com
- Via QR Code (généré automatiquement sur la page)
- Via email/SMS

## 📊 Workflow Complet

```
┌─────────────────────┐
│  Code Source        │
│  (Expo React Native)│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  EAS Build / Local  │
│  (Compilation APK)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  offsec.apk         │
│  (Fichier Android)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Hébergement APK    │
│  (GitHub/Firebase)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Page Web + QR Code │
│  (download-page/)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Déploiement Web    │
│  (Netlify/Vercel)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  URL Publique       │
│  + QR Code          │
└─────────────────────┘
```

## 🎨 Personnalisation de la Page

### Modifier le QR Code

Éditez `/download-page/index.html`:

```javascript
// Ligne ~267
new QRCode(document.getElementById("qrcode"), {
    text: "VOTRE_URL_APK_ICI",
    width: 200,
    height: 200
});
```

### Changer les couleurs

```css
/* Ligne ~16 */
background: linear-gradient(135deg, #262135 0%, #3d3451 100%);

/* Ligne ~39 */
background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
```

## 🔐 Sécurité

### Signer l'APK

Pour une distribution professionnelle:

```bash
# Créer une clé de signature
keytool -genkey -v -keystore offsec-release.keystore \
        -alias offsec -keyalg RSA -keysize 2048 -validity 10000

# Build signé avec EAS
eas build --platform android --profile production
```

### HTTPS Obligatoire

- Toujours héberger la page et l'APK sur HTTPS
- Évite les warnings de sécurité lors du téléchargement

## 📈 Analytics (Optionnel)

Ajouter Google Analytics à la page:

```html
<!-- Dans <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## ✅ Checklist de Déploiement

- [ ] APK créé et testé
- [ ] APK hébergé sur un service fiable
- [ ] Page de téléchargement mise à jour avec la vraie URL
- [ ] QR Code vérifié
- [ ] Page déployée en production
- [ ] URL publique testée
- [ ] QR Code scanné et fonctionnel
- [ ] Installation testée sur un appareil Android réel
- [ ] Instructions d'installation vérifiées

## 🐛 Dépannage

### QR Code ne se génère pas
- Vérifier que qrcode.min.js est chargé
- Vérifier la console du navigateur pour les erreurs
- Tester l'URL de l'APK manuellement

### L'APK ne se télécharge pas
- Vérifier que l'URL de l'APK est accessible publiquement
- Vérifier les CORS headers sur le serveur
- Tester le lien direct dans un navigateur

### Page ne s'affiche pas correctement
- Vérifier que index.html est à la racine
- Vérifier les chemins des assets
- Tester sur différents navigateurs

## 📞 Support

Pour toute question:
- Documentation Expo: https://docs.expo.dev/
- GitHub Issues: [Votre repo]
- Email: [Votre email]

---

**Version**: 1.0.0  
**Date**: $(date)  
**Status**: ✅ Prêt pour le déploiement

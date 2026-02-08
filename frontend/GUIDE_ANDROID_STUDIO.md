# 📱 Guide Pas à Pas : Créer l'APK OffSec avec Android Studio

## 🎯 Objectif
Ce guide vous accompagne pour transformer le code de l'application OffSec en fichier APK installable sur téléphone Android.

---

## 📋 ÉTAPE 1 : Installer les Logiciels Nécessaires

### 1.1 Installer Node.js

1. Allez sur **https://nodejs.org/fr**
2. Cliquez sur le bouton vert **"LTS"** (version recommandée)
3. Téléchargez le fichier `.msi`
4. Double-cliquez sur le fichier téléchargé
5. Cliquez **"Next"** à chaque étape
6. Cliquez **"Install"**
7. Cliquez **"Finish"**

**✅ Vérification :**
- Ouvrez l'**Invite de commandes** (tapez `cmd` dans la recherche Windows)
- Tapez : `node --version`
- Vous devez voir un numéro comme `v20.x.x`

---

### 1.2 Installer Android Studio

1. Allez sur **https://developer.android.com/studio**
2. Cliquez sur **"Download Android Studio"**
3. Acceptez les conditions et téléchargez
4. Double-cliquez sur le fichier téléchargé
5. Cliquez **"Next"** à chaque étape
6. **IMPORTANT** : Cochez toutes les cases proposées (Android SDK, Android Virtual Device, etc.)
7. Cliquez **"Install"**
8. Attendez la fin de l'installation (peut prendre 10-15 minutes)
9. Lancez Android Studio

**Premier lancement d'Android Studio :**
1. Choisissez **"Do not import settings"**
2. Cliquez **"Next"**
3. Choisissez **"Standard"** pour le type d'installation
4. Cliquez **"Next"**
5. Choisissez un thème (clair ou sombre)
6. Cliquez **"Finish"**
7. Attendez le téléchargement des composants (peut prendre 20-30 minutes selon votre connexion)

---

## 📋 ÉTAPE 2 : Télécharger le Projet OffSec

1. Sur Emergent, cliquez sur **"Télécharger"** ou **"Download"** pour obtenir le code source
2. Vous obtenez un fichier `.zip`
3. Faites un **clic droit** sur le fichier zip
4. Cliquez sur **"Extraire tout..."**
5. Choisissez un emplacement simple, par exemple : `C:\Projets\OffSec`
6. Cliquez **"Extraire"**

---

## 📋 ÉTAPE 3 : Ouvrir l'Invite de Commandes dans le Bon Dossier

### Méthode simple :

1. Ouvrez l'**Explorateur de fichiers**
2. Naviguez jusqu'au dossier extrait, puis entrez dans le dossier **`frontend`**
   - Exemple : `C:\Projets\OffSec\frontend`
3. Cliquez dans la **barre d'adresse** en haut (là où est écrit le chemin)
4. Tapez `cmd` et appuyez sur **Entrée**
5. Une fenêtre noire s'ouvre : c'est l'**Invite de commandes**

---

## 📋 ÉTAPE 4 : Installer les Dépendances

Dans l'invite de commandes, tapez la commande suivante et appuyez sur **Entrée** :

```
npm install
```

**Ce qui se passe :**
- Le programme télécharge toutes les bibliothèques nécessaires
- Vous verrez beaucoup de texte défiler
- Attendez jusqu'à ce que vous voyiez à nouveau le curseur clignotant
- Cela peut prendre 2-5 minutes

**⚠️ Si vous voyez des "WARN"** (avertissements en jaune), c'est normal, ignorez-les.

**❌ Si vous voyez des "ERR!"** (erreurs en rouge), recommencez la commande.

---

## 📋 ÉTAPE 5 : Générer le Projet Android

Toujours dans l'invite de commandes, tapez :

```
npx expo prebuild --platform android --clean
```

Appuyez sur **Entrée**.

**Ce qui se passe :**
- Le programme crée un dossier `android` avec tout le code natif
- Cela peut prendre 1-3 minutes
- Vous verrez des messages comme "Creating android directory..."

**✅ Succès :** Vous voyez le message "Android project created" ou similaire, et un dossier `android` apparaît dans le dossier `frontend`.

---

## 📋 ÉTAPE 6 : Ouvrir le Projet dans Android Studio

1. Lancez **Android Studio**
2. Sur l'écran d'accueil, cliquez sur **"Open"**
3. Naviguez jusqu'au dossier :
   - `C:\Projets\OffSec\frontend\android`
4. Sélectionnez le dossier **`android`** (pas un fichier, le dossier lui-même)
5. Cliquez **"OK"**

**Ce qui se passe :**
- Android Studio ouvre le projet
- En bas à droite, vous voyez une barre de progression "Gradle sync..."
- **Attendez que cette synchronisation soit terminée** (peut prendre 5-10 minutes la première fois)

**✅ Succès :** La barre de progression disparaît et vous ne voyez plus "Syncing" en bas.

---

## 📋 ÉTAPE 7 : Construire l'APK

### 7.1 Lancer la construction

1. Dans Android Studio, cliquez sur le menu **"Build"** (en haut)
2. Cliquez sur **"Build Bundle(s) / APK(s)"**
3. Cliquez sur **"Build APK(s)"**

**Ce qui se passe :**
- Une barre de progression apparaît en bas
- Le texte "Gradle Build Running" s'affiche
- Attendez la fin (peut prendre 3-10 minutes selon votre ordinateur)

### 7.2 Récupérer l'APK

**✅ Quand c'est terminé :**
- Un message vert apparaît en bas à droite : **"Build completed successfully"**
- Cliquez sur **"locate"** dans ce message

**Ou manuellement :**
1. Ouvrez l'Explorateur de fichiers
2. Allez dans : `C:\Projets\OffSec\frontend\android\app\build\outputs\apk\debug\`
3. Le fichier **`app-debug.apk`** est votre application !

---

## 📋 ÉTAPE 8 : Installer l'APK sur votre Téléphone

### Option A : Par câble USB

1. Connectez votre téléphone Android à l'ordinateur avec un câble USB
2. Sur le téléphone, acceptez la connexion (mode "Transfert de fichiers")
3. Copiez le fichier `app-debug.apk` vers le téléphone (dans "Téléchargements" par exemple)
4. Sur le téléphone, ouvrez un gestionnaire de fichiers
5. Trouvez et tapez sur `app-debug.apk`
6. Acceptez l'installation depuis une source inconnue si demandé
7. Tapez **"Installer"**

### Option B : Par email ou cloud

1. Envoyez-vous le fichier `app-debug.apk` par email
2. Ou uploadez-le sur Google Drive / Dropbox
3. Sur le téléphone, téléchargez le fichier
4. Tapez dessus pour l'installer

---

## ❌ Problèmes Courants et Solutions

### Problème : "SDK location not found"

**Solution :**
1. Dans Android Studio, allez dans **File > Project Structure**
2. Cliquez sur **SDK Location**
3. Vérifiez que "Android SDK location" pointe vers un dossier valide
4. Sinon, cliquez sur les **"..."** et sélectionnez :
   - `C:\Users\VOTRE_NOM\AppData\Local\Android\Sdk`

---

### Problème : "Gradle sync failed"

**Solution :**
1. Cliquez sur **File > Invalidate Caches / Restart**
2. Cliquez **"Invalidate and Restart"**
3. Attendez le redémarrage
4. La synchronisation reprendra automatiquement

---

### Problème : "BUILD FAILED" avec erreur Java

**Solution :**
1. Dans Android Studio : **File > Settings**
2. Cherchez "Gradle" dans la barre de recherche
3. Cliquez sur **Build, Execution, Deployment > Build Tools > Gradle**
4. Dans "Gradle JDK", sélectionnez **"17"** ou **"jbr-17"**
5. Cliquez **"OK"**
6. Refaites : **Build > Build APK(s)**

---

### Problème : La construction est très lente

**Solution :**
1. Ouvrez le fichier `frontend\android\gradle.properties`
2. Ajoutez ces lignes à la fin :
```
org.gradle.jvmargs=-Xmx4096m
org.gradle.parallel=true
```
3. Sauvegardez et relancez la construction

---

## ✅ Récapitulatif des Commandes

Voici toutes les commandes à taper dans l'ordre :

```bash
# 1. Aller dans le dossier frontend (dans l'Explorateur, tapez cmd dans la barre d'adresse)

# 2. Installer les dépendances
npm install

# 3. Générer le projet Android
npx expo prebuild --platform android --clean

# 4. Ouvrir Android Studio et suivre les étapes 6-7-8
```

---

## 🎉 Félicitations !

Vous avez créé votre APK ! L'application OffSec est maintenant installée sur votre téléphone Android.

**Besoin d'aide ?** Relisez attentivement chaque étape, les erreurs viennent souvent d'une étape sautée.

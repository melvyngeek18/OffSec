# 🛠️ Guide de Construction Android - Application OffSec

## Prérequis

1. **Node.js** (version 18 ou supérieure)
2. **Android Studio** avec :
   - Android SDK 34
   - Android SDK Build-Tools 34.0.0
   - Android SDK Platform-Tools
   - Android Emulator (optionnel)
3. **Java JDK 17** (inclus avec Android Studio)

## Étapes de Construction

### 1. Préparer l'environnement

```bash
# Cloner ou télécharger le projet
cd frontend

# Installer les dépendances
npm install
# ou
yarn install
```

### 2. Générer le projet Android natif

```bash
# Supprimer l'ancien dossier android s'il existe
rmdir /s /q android   # Windows
rm -rf android        # Mac/Linux

# Générer le projet Android
npx expo prebuild --platform android --clean
```

### 3. Ouvrir dans Android Studio

1. Ouvrez **Android Studio**
2. Cliquez sur **"Open"**
3. Sélectionnez le dossier `frontend/android`
4. Attendez que Gradle synchronise le projet

### 4. Construire l'APK

#### Option A : Via Android Studio

1. Dans Android Studio, allez dans **Build > Build Bundle(s) / APK(s) > Build APK(s)**
2. Attendez la fin de la compilation
3. L'APK sera disponible dans : `android/app/build/outputs/apk/release/`

#### Option B : Via ligne de commande

```bash
cd android

# APK Debug (pour test)
./gradlew assembleDebug

# APK Release (pour distribution)
./gradlew assembleRelease
```

### 5. Localisation des APK générés

- **Debug** : `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release** : `android/app/build/outputs/apk/release/app-release.apk`

## Configuration de Signature (pour Release)

Pour distribuer l'application, vous devez signer l'APK :

### Créer un keystore

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore offsec-release.keystore -alias offsec -keyalg RSA -keysize 2048 -validity 10000
```

### Configurer la signature dans `android/app/build.gradle`

Ajoutez dans le bloc `android` :

```gradle
signingConfigs {
    release {
        storeFile file('offsec-release.keystore')
        storePassword 'votre_mot_de_passe'
        keyAlias 'offsec'
        keyPassword 'votre_mot_de_passe'
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

## Résolution des Problèmes Courants

### Erreur : "SDK location not found"

Créez un fichier `android/local.properties` avec :
```
sdk.dir=C:\\Users\\VOTRE_NOM\\AppData\\Local\\Android\\Sdk
```
(Adaptez le chemin selon votre installation)

### Erreur : "Failed to find Build Tools"

Dans Android Studio : **Tools > SDK Manager > SDK Tools** et installez "Android SDK Build-Tools 34"

### Erreur : "Kotlin version mismatch"

Le projet utilise Kotlin 1.9.22. Assurez-vous que votre Android Studio utilise une version compatible.

### Erreur de mémoire Gradle

Ajoutez dans `android/gradle.properties` :
```
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m
```

## Alternative : Construction avec EAS Build

Si vous préférez utiliser le service cloud d'Expo :

```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter à Expo
eas login

# Construire l'APK
eas build --platform android --profile preview
```

## Structure du Projet Android Généré

```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── AndroidManifest.xml
│   │       ├── java/
│   │       └── res/
│   ├── build.gradle
│   └── proguard-rules.pro
├── build.gradle
├── gradle.properties
├── settings.gradle
└── gradlew / gradlew.bat
```

## Permissions Android

L'application demande les permissions suivantes :
- `ACCESS_FINE_LOCATION` - Position GPS précise
- `ACCESS_COARSE_LOCATION` - Position approximative
- `CAMERA` - Accès à la caméra
- `READ_EXTERNAL_STORAGE` - Lecture des fichiers
- `WRITE_EXTERNAL_STORAGE` - Écriture des fichiers
- `READ_MEDIA_IMAGES` - Accès aux images (Android 13+)
- `INTERNET` - Accès réseau
- `ACCESS_NETWORK_STATE` - État du réseau

## Support

En cas de problème, vérifiez :
1. Les versions des SDK Android
2. La configuration de Java/JDK
3. Les variables d'environnement ANDROID_HOME et JAVA_HOME

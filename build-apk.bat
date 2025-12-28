@echo off
REM Script de Build APK OffSec - Automatique (Windows)
REM Usage: build-apk.bat

echo =========================================
echo    Build APK OffSec - Automatique
echo =========================================
echo.

REM Etape 1: Verifier Node.js
echo [1/7] Verification de Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [X] Node.js n'est pas installe
    echo     Telechargez-le sur: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js installe
echo.

REM Etape 2: Verifier npm
echo [2/7] Verification de npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [X] npm n'est pas installe
    pause
    exit /b 1
)
echo [OK] npm installe
echo.

REM Etape 3: Installer EAS CLI
echo [3/7] Installation de EAS CLI...
echo      Cela peut prendre 1-2 minutes...
call npm install -g eas-cli >nul 2>&1
if errorlevel 1 (
    echo [X] Echec de l'installation de EAS CLI
    pause
    exit /b 1
)
echo [OK] EAS CLI installe
echo.

REM Etape 4: Verifier le dossier
echo [4/7] Verification du dossier...
if not exist "app.json" (
    echo [X] app.json non trouve
    echo.
    echo     Veuillez executer ce script depuis le dossier 'frontend'
    echo     Exemple:
    echo     C:\^> cd C:\MesProjets\OffSec\frontend
    echo     C:\MesProjets\OffSec\frontend^> build-apk.bat
    echo.
    pause
    exit /b 1
)
echo [OK] Dossier frontend detecte
echo.

REM Etape 5: Installer les dependances
echo [5/7] Installation des dependances...
echo      Cela peut prendre 3-5 minutes...
if exist "yarn.lock" (
    call yarn install
) else (
    call npm install
)
if errorlevel 1 (
    echo [X] Echec de l'installation des dependances
    pause
    exit /b 1
)
echo [OK] Dependances installees
echo.

REM Etape 6: Connexion Expo
echo [6/7] Connexion a Expo...
call eas whoami >nul 2>&1
if errorlevel 1 (
    echo      Connexion necessaire...
    call eas login
    if errorlevel 1 (
        echo [X] Echec de la connexion
        pause
        exit /b 1
    )
)
echo [OK] Connecte a Expo
echo.

REM Etape 7: Lancer le build
echo [7/7] Lancement du build APK...
echo.
echo      Le build va maintenant demarrer sur les serveurs Expo
echo      Cela prendra environ 15 minutes
echo.

call eas build --platform android --profile preview --non-interactive

if errorlevel 1 (
    echo.
    echo [X] Le build a echoue
    echo     Consultez les logs ci-dessus pour plus d'informations
    pause
    exit /b 1
)

echo.
echo =========================================
echo [OK] Build lance avec succes !
echo =========================================
echo.
echo Vous recevrez un email quand le build sera termine
echo Ou consultez: https://expo.dev/
echo.
echo Une fois le build termine:
echo   1. Cliquez sur le lien dans l'email
echo   2. Telechargez le fichier .apk
echo   3. Transferez-le sur votre telephone Android
echo   4. Installez-le !
echo.
pause

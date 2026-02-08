@echo off
echo ========================================
echo    Construction APK Android - OffSec
echo ========================================
echo.

REM Vérifier si Node.js est installé
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js n'est pas installe ou pas dans le PATH
    echo Installez Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Node.js trouve: 
node --version
echo.

REM Se positionner dans le dossier frontend
cd /d "%~dp0"
echo [INFO] Dossier de travail: %cd%
echo.

REM Installer les dependances si necessaire
if not exist "node_modules" (
    echo [INFO] Installation des dependances...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERREUR] Echec de l'installation des dependances
        pause
        exit /b 1
    )
)

REM Supprimer l'ancien dossier android
if exist "android" (
    echo [INFO] Suppression de l'ancien projet Android...
    rmdir /s /q android
)

REM Generer le projet Android
echo.
echo [INFO] Generation du projet Android natif...
call npx expo prebuild --platform android --clean
if %errorlevel% neq 0 (
    echo [ERREUR] Echec de la generation du projet Android
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Projet Android genere avec succes!
echo ========================================
echo.
echo Le dossier "android" a ete cree.
echo.
echo Prochaines etapes:
echo 1. Ouvrez Android Studio
echo 2. Cliquez sur "Open"
echo 3. Selectionnez le dossier: %cd%\android
echo 4. Attendez la synchronisation Gradle
echo 5. Build ^> Build Bundle(s) / APK(s) ^> Build APK(s)
echo.
echo L'APK sera dans: android\app\build\outputs\apk\
echo.

REM Demander si on veut construire l'APK directement
set /p BUILD_NOW="Voulez-vous construire l'APK maintenant? (o/n): "
if /i "%BUILD_NOW%"=="o" (
    echo.
    echo [INFO] Construction de l'APK Debug...
    cd android
    call gradlew.bat assembleDebug
    if %errorlevel% neq 0 (
        echo [ERREUR] Echec de la construction
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo.
    echo ========================================
    echo    APK construit avec succes!
    echo ========================================
    echo.
    echo APK Debug: android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    
    REM Ouvrir le dossier contenant l'APK
    if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
        explorer "android\app\build\outputs\apk\debug"
    )
)

pause

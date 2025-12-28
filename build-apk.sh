#!/bin/bash
# Script de Build APK OffSec - Automatique
# Usage: ./build-apk.sh

echo "🚒 ====================================="
echo "   Build APK OffSec - Automatique"
echo "======================================"
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher des messages
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Étape 1: Vérifier Node.js
echo "📦 Étape 1/7: Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé"
    echo "   Téléchargez-le sur: https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node --version)
print_success "Node.js installé: $NODE_VERSION"
echo ""

# Étape 2: Vérifier npm
echo "📦 Étape 2/7: Vérification de npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm n'est pas installé"
    exit 1
fi
NPM_VERSION=$(npm --version)
print_success "npm installé: $NPM_VERSION"
echo ""

# Étape 3: Installer EAS CLI
echo "🔧 Étape 3/7: Installation de EAS CLI..."
print_info "Cela peut prendre 1-2 minutes..."
npm install -g eas-cli &> /dev/null
if [ $? -eq 0 ]; then
    print_success "EAS CLI installé avec succès"
else
    print_error "Échec de l'installation de EAS CLI"
    exit 1
fi
echo ""

# Étape 4: Vérifier si nous sommes dans le bon dossier
echo "📁 Étape 4/7: Vérification du dossier..."
if [ ! -f "app.json" ]; then
    print_error "app.json non trouvé"
    echo ""
    echo "   Veuillez exécuter ce script depuis le dossier 'frontend'"
    echo "   Exemple:"
    echo "   $ cd /chemin/vers/votre/frontend"
    echo "   $ ./build-apk.sh"
    exit 1
fi
print_success "Dossier frontend détecté"
echo ""

# Étape 5: Installer les dépendances
echo "📚 Étape 5/7: Installation des dépendances..."
print_info "Cela peut prendre 3-5 minutes..."
if command -v yarn &> /dev/null; then
    yarn install
else
    npm install
fi
if [ $? -eq 0 ]; then
    print_success "Dépendances installées"
else
    print_error "Échec de l'installation des dépendances"
    exit 1
fi
echo ""

# Étape 6: Connexion Expo
echo "🔐 Étape 6/7: Connexion à Expo..."
print_info "Si vous n'êtes pas connecté, vous serez invité à le faire"
eas whoami &> /dev/null
if [ $? -ne 0 ]; then
    print_info "Connexion nécessaire..."
    eas login
    if [ $? -ne 0 ]; then
        print_error "Échec de la connexion"
        exit 1
    fi
fi
USERNAME=$(eas whoami)
print_success "Connecté en tant que: $USERNAME"
echo ""

# Étape 7: Lancer le build
echo "🚀 Étape 7/7: Lancement du build APK..."
echo ""
print_info "Le build va maintenant démarrer sur les serveurs Expo"
print_info "Cela prendra environ 15 minutes"
echo ""

eas build --platform android --profile preview --non-interactive

if [ $? -eq 0 ]; then
    echo ""
    echo "======================================"
    print_success "Build lancé avec succès !"
    echo "======================================"
    echo ""
    echo "📧 Vous recevrez un email quand le build sera terminé"
    echo "🔗 Ou consultez: https://expo.dev/"
    echo ""
    echo "📱 Une fois le build terminé:"
    echo "   1. Cliquez sur le lien dans l'email"
    echo "   2. Téléchargez le fichier .apk"
    echo "   3. Transférez-le sur votre téléphone Android"
    echo "   4. Installez-le !"
    echo ""
else
    echo ""
    print_error "Le build a échoué"
    echo "Consultez les logs ci-dessus pour plus d'informations"
    exit 1
fi

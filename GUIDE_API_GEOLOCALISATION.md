# 🗺️ Guide Complet: API de Géolocalisation Gratuite

## 📍 Pourquoi Utiliser une API de Géolocalisation ?

L'application utilise actuellement **expo-location** qui:
- ✅ Fonctionne sur mobile (GPS natif)
- ⚠️ Peut avoir des limites sur navigateur web
- ✅ Inclut le reverse geocoding (coordonnées → adresse)

Une **API de géolocalisation externe** peut améliorer:
- 🌐 Conversion adresse → coordonnées GPS (geocoding)
- 📍 Conversion coordonnées → adresse détaillée (reverse geocoding)
- 🗺️ Recherche d'adresses et autocomplétion
- 🌍 Support international amélioré

---

## 🆓 Meilleures API Gratuites en 2024

### Option 1: **LocationIQ** (RECOMMANDÉ) ⭐

**Pourquoi c'est le meilleur choix:**
- ✅ **5,000 requêtes/jour GRATUITES**
- ✅ Pas de carte de crédit requise
- ✅ Reverse geocoding inclus
- ✅ Recherche d'adresses
- ✅ Documentation excellente

**Limites gratuites:**
- 5,000 requêtes par jour
- 2 requêtes par seconde

**Comment obtenir votre clé API:**

#### Étape 1: Créer un compte
1. Allez sur: https://locationiq.com/
2. Cliquez sur **"Sign Up Free"**
3. Remplissez le formulaire:
   - Email
   - Mot de passe
   - Nom
4. Vérifiez votre email

#### Étape 2: Obtenir la clé API
1. Connectez-vous sur: https://my.locationiq.com/
2. Allez dans **"Dashboard"**
3. Vous verrez votre **Access Token**
4. Copiez la clé (format: `pk.xxxxxxxxxxxxxxxxxxxxx`)

#### Étape 3: Tester la clé
```bash
curl "https://us1.locationiq.com/v1/reverse?key=VOTRE_CLE&lat=48.8566&lon=2.3522&format=json"
```

Vous devriez recevoir des données JSON avec l'adresse.

---

### Option 2: **OpenCage Geocoding API**

**Avantages:**
- ✅ **2,500 requêtes/jour GRATUITES**
- ✅ Pas de carte de crédit
- ✅ Support de 50+ langues
- ✅ Données OpenStreetMap

**Limites:**
- 2,500 requêtes par jour
- 1 requête par seconde

**Comment obtenir la clé:**

1. Inscrivez-vous sur: https://opencagedata.com/users/sign_up
2. Vérifiez votre email
3. Connectez-vous: https://opencagedata.com/dashboard
4. Copiez votre **API Key**

**Test:**
```bash
curl "https://api.opencagedata.com/geocode/v1/json?q=48.8566,2.3522&key=VOTRE_CLE"
```

---

### Option 3: **Nominatim (OpenStreetMap)**

**Avantages:**
- ✅ Complètement GRATUIT
- ✅ Pas de clé API nécessaire
- ✅ Open source

**Inconvénients:**
- ⚠️ Limité à 1 requête par seconde
- ⚠️ Nécessite un User-Agent personnalisé
- ⚠️ Pas recommandé pour usage intensif

**Utilisation:**
```bash
curl "https://nominatim.openstreetmap.org/reverse?format=json&lat=48.8566&lon=2.3522" \
  -H "User-Agent: OffSecApp/1.0"
```

**Note:** Nominatim est gratuit mais demande de respecter leur politique d'utilisation équitable.

---

### Option 4: **Google Maps Geocoding API**

**Avantages:**
- ✅ Très précis
- ✅ Données mondiales complètes
- ✅ 28,500 requêtes/mois GRATUITES (300$/mois de crédit)

**Inconvénients:**
- ⚠️ Nécessite une carte de crédit
- ⚠️ Configuration Google Cloud Platform complexe
- 💰 Coût après dépassement

**Pour obtenir la clé:**
1. Créez un compte Google Cloud: https://console.cloud.google.com/
2. Activez **Geocoding API**
3. Créez des identifiants API
4. Copiez la clé API

---

## 🔧 Intégration dans l'Application

### Intégration LocationIQ (Recommandé)

#### Étape 1: Ajouter la clé dans .env

Modifiez `/app/frontend/.env`:
```env
EXPO_PUBLIC_LOCATIONIQ_KEY=pk.votre_cle_ici
```

#### Étape 2: Créer un service de géolocalisation

Créez `/app/frontend/services/geocoding.ts`:

```typescript
const LOCATIONIQ_KEY = process.env.EXPO_PUBLIC_LOCATIONIQ_KEY;

export const reverseGeocode = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_KEY}&lat=${lat}&lon=${lon}&format=json`
    );
    
    if (!response.ok) {
      throw new Error('Erreur de géolocalisation');
    }
    
    const data = await response.json();
    
    return {
      address: data.display_name,
      street: data.address.road,
      city: data.address.city || data.address.town || data.address.village,
      postcode: data.address.postcode,
      country: data.address.country,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};

export const geocode = async (address: string) => {
  try {
    const response = await fetch(
      `https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_KEY}&q=${encodeURIComponent(address)}&format=json`
    );
    
    if (!response.ok) {
      throw new Error('Erreur de géocodage');
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        address: data[0].display_name,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};
```

#### Étape 3: Utiliser dans l'application

Modifiez `/app/frontend/app/index.tsx`:

```typescript
import { reverseGeocode } from '../services/geocoding';

const getLocation = async () => {
  setLoading(true);
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setLoading(false);
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);

    // Utiliser l'API externe pour le reverse geocoding
    const addressData = await reverseGeocode(
      location.coords.latitude,
      location.coords.longitude
    );

    if (addressData) {
      const formattedAddress = `${addressData.street || ''}, ${addressData.city || ''}, ${addressData.postcode || ''}`;
      setAdresse(formattedAddress);
    }

    Alert.alert('Succès', 'Localisation obtenue avec succès!');
  } catch (error: any) {
    Alert.alert('Erreur', 'Impossible d\'obtenir la localisation.');
    console.error('Location error:', error);
  } finally {
    setLoading(false);
  }
};
```

---

## 📊 Comparaison des Services

| Service | Requêtes/Jour | Carte Crédit | Précision | Recommandation |
|---------|---------------|--------------|-----------|----------------|
| **LocationIQ** | 5,000 | ❌ Non | ⭐⭐⭐⭐ | ✅ **MEILLEUR** |
| **OpenCage** | 2,500 | ❌ Non | ⭐⭐⭐⭐ | ✅ Très bon |
| **Nominatim** | Illimité* | ❌ Non | ⭐⭐⭐ | ⚠️ Limité |
| **Google Maps** | 28,500/mois | ✅ Oui | ⭐⭐⭐⭐⭐ | 💰 Payant |

*\*Nominatim: 1 req/sec max*

---

## 🎯 Cas d'Usage dans OffSec

### Utilisation Actuelle
L'application utilise **expo-location** qui:
- Obtient les coordonnées GPS (mobile)
- Fait du reverse geocoding (coords → adresse)

### Amélioration Possible avec API Externe
1. **Recherche d'adresse**: Taper une adresse → obtenir GPS
2. **Reverse geocoding amélioré**: Plus de détails (rue, ville, code postal)
3. **Validation d'adresse**: Vérifier que l'adresse existe
4. **Autocomplétion**: Suggérer des adresses pendant la saisie

---

## 🚀 Installation Rapide (5 minutes)

### Avec LocationIQ:

1. **Obtenez la clé API:**
   - Allez sur https://locationiq.com/
   - Créez un compte gratuit
   - Copiez votre Access Token

2. **Ajoutez dans .env:**
   ```env
   EXPO_PUBLIC_LOCATIONIQ_KEY=pk.votre_cle_ici
   ```

3. **Créez le fichier service:**
   ```bash
   mkdir -p /app/frontend/services
   # Copiez le code du service geocoding.ts ci-dessus
   ```

4. **Utilisez dans votre code:**
   ```typescript
   import { reverseGeocode } from '../services/geocoding';
   const address = await reverseGeocode(lat, lon);
   ```

5. **Redémarrez Expo:**
   ```bash
   sudo supervisorctl restart expo
   ```

---

## ⚡ Besoin d'Aide ?

### Solution Actuelle Fonctionne Déjà ! ✅

L'application utilise **expo-location** qui est:
- ✅ Gratuit
- ✅ Fonctionnel sur mobile
- ✅ Pas de clé API nécessaire
- ✅ Inclut le reverse geocoding

### Quand Ajouter une API Externe ?

Ajoutez une API externe seulement si vous avez besoin de:
- 🔍 Recherche d'adresse (geocoding)
- 📍 Reverse geocoding plus précis
- 🌍 Support international amélioré
- ⚡ Performance sur web

**Pour l'usage actuel (mobile terrain), expo-location suffit amplement !**

---

## 📝 Notes Importantes

1. **Gardez votre clé API secrète:**
   - Ne la committez JAMAIS sur GitHub
   - Utilisez toujours des variables d'environnement

2. **Respectez les limites:**
   - LocationIQ: 5,000 requêtes/jour
   - OpenCage: 2,500 requêtes/jour
   - Nominatim: 1 requête/seconde

3. **Gérez les erreurs:**
   - Toujours avoir un fallback
   - Afficher des messages clairs à l'utilisateur
   - Logger les erreurs pour débogage

4. **Testez avant de déployer:**
   ```bash
   curl "https://us1.locationiq.com/v1/reverse?key=VOTRE_CLE&lat=48.8566&lon=2.3522&format=json"
   ```

---

## ✅ Résumé

**Pour l'application OffSec:**

1. **Solution actuelle (expo-location):** ✅ Suffit pour l'usage mobile terrain

2. **Si besoin d'API externe:**
   - Choisir **LocationIQ** (5,000 req/jour gratuit)
   - Créer un compte sur locationiq.com
   - Copier la clé API
   - Ajouter dans .env
   - Créer le service geocoding.ts
   - Intégrer dans l'app

3. **Temps total:** ~10 minutes

**L'application fonctionne parfaitement sans API externe pour l'usage terrain ! 🎉**

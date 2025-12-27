# 🌤️ Configuration de la Météo OpenWeatherMap

## ⚠️ Statut Actuel

La clé API fournie (`b61d4b3f6e0c1a1dd1e247fec24b1176`) retourne une erreur 401 "Invalid API key".

### Raisons Possibles:

1. **Clé non activée**: Les nouvelles clés API OpenWeatherMap prennent quelques heures à s'activer après création
2. **Clé invalide**: La clé peut avoir été révoquée ou n'a jamais été valide
3. **Compte non vérifié**: Le compte OpenWeatherMap nécessite une vérification email

## ✅ Solution: Obtenir une Nouvelle Clé API

### Étape 1: Créer un compte OpenWeatherMap

1. Visitez: https://home.openweathermap.org/users/sign_up
2. Créez un compte gratuit
3. Vérifiez votre email

### Étape 2: Obtenir votre clé API

1. Connectez-vous sur: https://home.openweathermap.org/
2. Allez dans "API keys"
3. Copiez votre clé par défaut OU créez-en une nouvelle
4. **Attendez 1-2 heures** pour l'activation

### Étape 3: Configurer dans l'application

Modifiez le fichier `/app/frontend/app/weather.tsx`:

```typescript
// Ligne 13
const API_KEY = 'VOTRE_NOUVELLE_CLE_ICI';
```

### Étape 4: Redémarrer l'application

```bash
sudo supervisorctl restart expo
```

## 🧪 Tester la Clé API

Avant de l'intégrer, testez votre clé avec curl:

```bash
curl "https://api.openweathermap.org/data/2.5/weather?lat=48.8566&lon=2.3522&appid=VOTRE_CLE&units=metric&lang=fr"
```

Si ça fonctionne, vous verrez des données JSON avec température, vent, etc.

## 📱 Fonctionnalités Météo Implémentées

Une fois la clé activée, l'application affichera:

✅ **Température actuelle** (°C)  
✅ **Température ressentie** (°C)  
✅ **Vitesse du vent** (km/h)  
✅ **Description météo** (en français)  
✅ **Humidité** (%)  
✅ **Pression atmosphérique** (hPa)  

### Alertes Automatiques:

- 🔥 **Chaleur extrême**: Si température > 30°C
- ❄️ **Froid extrême**: Si température < 5°C
- 💨 **Vent fort**: Si vitesse > 50 km/h

## 🔄 Alternative: Mode Sans Météo

L'application fonctionne parfaitement **sans** la météo. Si vous souhaitez simplement ignorer cette fonctionnalité pour l'instant:

- L'écran météo affichera un message d'erreur
- Vous pouvez cliquer sur "CONTINUER" pour passer aux autres écrans
- Toutes les autres fonctionnalités sont opérationnelles

## 📞 Support OpenWeatherMap

- Documentation: https://openweathermap.org/api
- FAQ: https://openweathermap.org/faq
- Support: https://openweathermap.org/faq#error401

## 💡 Note Importante

Le plan gratuit d'OpenWeatherMap permet:
- 60 appels/minute
- 1,000,000 appels/mois
- Données en temps réel

C'est largement suffisant pour cette application ! 🎉

---

**Une fois votre clé activée, la météo fonctionnera automatiquement pour chaque intervention basée sur la géolocalisation GPS.**

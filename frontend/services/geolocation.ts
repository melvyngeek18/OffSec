// Service de géolocalisation avec fallback
// Utilise ipapi.co qui est gratuit (1000 req/jour) sans clé API

interface LocationResult {
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  country?: string;
}

/**
 * Obtient la localisation via IP (gratuit, sans clé API)
 * Précision: Ville/Région (pas précis comme GPS)
 */
export const getLocationFromIP = async (): Promise<LocationResult | null> => {
  try {
    console.log('🌐 Tentative de géolocalisation par IP...');
    
    // ipapi.co est gratuit (1000 req/jour) sans clé API
    const response = await fetch('https://ipapi.co/json/');
    
    if (!response.ok) {
      throw new Error('Erreur API IP');
    }
    
    const data = await response.json();
    
    console.log('✅ Géolocalisation IP réussie:', data.city);
    
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      address: `${data.city}, ${data.region}, ${data.country_name}`,
      city: data.city,
      country: data.country_name,
    };
  } catch (error) {
    console.error('❌ Erreur géolocalisation IP:', error);
    return null;
  }
};

/**
 * Obtient la localisation du navigateur (nécessite HTTPS et permissions)
 */
export const getLocationFromBrowser = (): Promise<LocationResult | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.log('❌ Géolocalisation non supportée par ce navigateur');
      resolve(null);
      return;
    }

    console.log('🌍 Tentative de géolocalisation navigateur...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log('✅ Position navigateur obtenue');
        
        const { latitude, longitude } = position.coords;
        
        // Utiliser Nominatim (OpenStreetMap) pour le reverse geocoding
        // Gratuit, pas de clé API nécessaire
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`,
            {
              headers: {
                'User-Agent': 'OffSecApp/1.0',
              },
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            const address = data.address;
            const formattedAddress = `${address.road || address.suburb || ''}, ${address.city || address.town || address.village || ''}, ${address.postcode || ''}`;
            
            resolve({
              latitude,
              longitude,
              address: formattedAddress,
              city: address.city || address.town || address.village,
              country: address.country,
            });
          } else {
            resolve({
              latitude,
              longitude,
              address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            });
          }
        } catch (error) {
          console.error('Erreur reverse geocoding:', error);
          resolve({
            latitude,
            longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          });
        }
      },
      (error) => {
        console.error('❌ Erreur géolocalisation navigateur:', error.message);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

/**
 * Stratégie multi-sources pour obtenir la localisation
 * Essaie dans l'ordre: GPS navigateur -> IP geolocation
 */
export const getLocationMultiSource = async (): Promise<LocationResult | null> => {
  console.log('🎯 Démarrage géolocalisation multi-sources...');
  
  // Tentative 1: GPS du navigateur (le plus précis)
  const browserLocation = await getLocationFromBrowser();
  if (browserLocation) {
    console.log('✅ Utilisation: GPS Navigateur');
    return browserLocation;
  }
  
  // Tentative 2: IP geolocation (moins précis mais toujours fonctionnel)
  const ipLocation = await getLocationFromIP();
  if (ipLocation) {
    console.log('⚠️ Utilisation: IP Geolocation (approximatif)');
    return ipLocation;
  }
  
  console.error('❌ Toutes les méthodes de géolocalisation ont échoué');
  return null;
};

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useIntervention } from '../contexts/InterventionContext';

const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY || 'b61d4b3f6e0c1a1dd1e247fec24b1176';
const WEATHER_API_URL = process.env.EXPO_PUBLIC_WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5/weather';

interface WeatherData {
  temp: number;
  windSpeed: number;
  description: string;
  humidity: number;
  pressure: number;
  feelsLike: number;
}

export default function Weather() {
  const router = useRouter();
  const { data, updateData, saveIntervention } = useIntervention();
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    if (!data.latitude || !data.longitude) {
      setError('Position GPS non disponible');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${data.latitude}&lon=${data.longitude}&appid=${API_KEY}&units=metric&lang=fr`
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.cod === 401) {
          throw new Error('Clé API invalide ou non activée. Veuillez vérifier votre clé OpenWeatherMap.');
        }
        throw new Error('Erreur lors de la récupération des données météo');
      }

      const json = await response.json();

      const weather = {
        temp: Math.round(json.main.temp),
        windSpeed: Math.round(json.wind.speed * 3.6), // Conversion m/s vers km/h
        description: json.weather[0].description,
        humidity: json.main.humidity,
        pressure: json.main.pressure,
        feelsLike: Math.round(json.main.feels_like),
      };

      setWeatherData(weather);

      // Sauvegarder dans le context pour le PDF
      updateData('weatherData', {
        temperature: weather.temp,
        windSpeed: weather.windSpeed,
        description: weather.description,
      });
      await saveIntervention();
    } catch (err) {
      console.error('Erreur météo:', err);
      setError('Impossible de récupérer les données météo');
      Alert.alert('Erreur', 'Impossible de récupérer les données météo. Vérifiez votre connexion internet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [data.latitude, data.longitude]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>🌤️ Conditions Météorologiques</Text>
        <Text style={styles.subtitle}>Zone d'intervention</Text>
      </View>

      {data.latitude && data.longitude ? (
        <View style={styles.locationCard}>
          <Text style={styles.locationText}>📍 Position GPS</Text>
          <Text style={styles.coordsText}>
            {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
          </Text>
          {data.adresse && (
            <Text style={styles.addressText}>{data.adresse}</Text>
          )}
        </View>
      ) : (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>⚠️ Position GPS non disponible</Text>
          <Text style={styles.errorSubtext}>
            Retournez à l'accueil pour obtenir votre position
          </Text>
        </View>
      )}

      {loading && (
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Récupération des données météo...</Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchWeather}>
            <Text style={styles.retryButtonText}>🔄 Réessayer</Text>
          </TouchableOpacity>
        </View>
      )}

      {weatherData && !loading && (
        <>
          <View style={styles.mainWeatherCard}>
            <Text style={styles.weatherDescription}>
              {weatherData.description.charAt(0).toUpperCase() + weatherData.description.slice(1)}
            </Text>
            <View style={styles.mainWeatherInfo}>
              <View style={styles.mainWeatherItem}>
                <Text style={styles.weatherIcon}>🌡️</Text>
                <Text style={styles.mainWeatherValue}>{weatherData.temp}°C</Text>
                <Text style={styles.weatherLabel}>Température</Text>
                <Text style={styles.feelsLike}>Ressenti: {weatherData.feelsLike}°C</Text>
              </View>
              <View style={styles.mainWeatherItem}>
                <Text style={styles.weatherIcon}>💨</Text>
                <Text style={styles.mainWeatherValue}>{weatherData.windSpeed} km/h</Text>
                <Text style={styles.weatherLabel}>Vent</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>📊 Détails Supplémentaires</Text>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailIcon}>💧</Text>
                <Text style={styles.detailLabel}>Humidité</Text>
                <Text style={styles.detailValue}>{weatherData.humidity}%</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailIcon}>🌡️</Text>
                <Text style={styles.detailLabel}>Pression</Text>
                <Text style={styles.detailValue}>{weatherData.pressure} hPa</Text>
              </View>
            </View>
          </View>

          {/* Alertes selon conditions */}
          {weatherData.windSpeed > 50 && (
            <View style={styles.alertCard}>
              <Text style={styles.alertIcon}>⚠️</Text>
              <Text style={styles.alertText}>
                VENT FORT: Attention aux risques liés au vent ({weatherData.windSpeed} km/h)
              </Text>
            </View>
          )}

          {weatherData.temp < 5 && (
            <View style={styles.alertCard}>
              <Text style={styles.alertIcon}>❄️</Text>
              <Text style={styles.alertText}>
                FROID: Conditions de froid extrême ({weatherData.temp}°C)
              </Text>
            </View>
          )}

          {weatherData.temp > 30 && (
            <View style={styles.alertCard}>
              <Text style={styles.alertIcon}>🔥</Text>
              <Text style={styles.alertText}>
                CHALEUR: Conditions de chaleur extrême ({weatherData.temp}°C)
              </Text>
            </View>
          )}
        </>
      )}

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => router.push('/ri')}
      >
        <Text style={styles.nextButtonText}>CONTINUER →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262135',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
  },
  locationCard: {
    backgroundColor: '#3a3450',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
  },
  coordsText: {
    fontSize: 14,
    color: '#4ade80',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  loadingCard: {
    backgroundColor: '#3a3450',
    padding: 32,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 16,
  },
  errorCard: {
    backgroundColor: '#dc2626',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mainWeatherCard: {
    backgroundColor: '#3a3450',
    padding: 24,
    borderRadius: 12,
    marginBottom: 16,
  },
  weatherDescription: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  mainWeatherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  mainWeatherItem: {
    alignItems: 'center',
  },
  weatherIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  mainWeatherValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  weatherLabel: {
    fontSize: 14,
    color: '#9ca3af',
  },
  feelsLike: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  detailsCard: {
    backgroundColor: '#3a3450',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  alertCard: {
    backgroundColor: '#f59e0b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  alertText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  nextButton: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

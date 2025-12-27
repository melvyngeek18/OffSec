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

const API_KEY = 'b61d4b3f6e0c1a1dd1e247fec24b1176';

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
  const { data } = useIntervention();
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
        throw new Error('Erreur lors de la récupération des données météo');
      }

      const json = await response.json();

      setWeatherData({
        temp: Math.round(json.main.temp),
        windSpeed: Math.round(json.wind.speed * 3.6), // Conversion m/s vers km/h
        description: json.weather[0].description,
        humidity: json.main.humidity,
        pressure: json.main.pressure,
        feelsLike: Math.round(json.main.feels_like),
      });
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
      ) : null}

      <View style={styles.placeholderCard}>
        <Text style={styles.placeholderTitle}>⚠️ Configuration requise</Text>
        <Text style={styles.placeholderText}>
          La clé API OpenWeatherMap n'est pas encore configurée.
        </Text>
        <Text style={styles.placeholderText}>
          Cette page affichera:
        </Text>
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>• Température extérieure (°C)</Text>
          <Text style={styles.featureItem}>• Vitesse du vent (km/h)</Text>
          <Text style={styles.featureItem}>• Conditions météo générales</Text>
          <Text style={styles.featureItem}>• Humidité et pression</Text>
        </View>
      </View>

      {/* Exemple de ce que la météo affichera */}
      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>Aperçu (données d'exemple)</Text>
        <View style={styles.weatherInfo}>
          <View style={styles.weatherItem}>
            <Text style={styles.weatherIcon}>🌡️</Text>
            <Text style={styles.weatherValue}>18°C</Text>
            <Text style={styles.weatherLabel}>Température</Text>
          </View>
          <View style={styles.weatherItem}>
            <Text style={styles.weatherIcon}>💨</Text>
            <Text style={styles.weatherValue}>15 km/h</Text>
            <Text style={styles.weatherLabel}>Vent</Text>
          </View>
        </View>
      </View>

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
  placeholderCard: {
    backgroundColor: '#3a3450',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
    lineHeight: 20,
  },
  featureList: {
    marginTop: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  previewCard: {
    backgroundColor: '#3a3450',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 16,
    textAlign: 'center',
  },
  weatherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weatherItem: {
    alignItems: 'center',
  },
  weatherIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  weatherValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  weatherLabel: {
    fontSize: 14,
    color: '#9ca3af',
  },
  nextButton: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

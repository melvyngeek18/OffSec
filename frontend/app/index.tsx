import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useIntervention } from '../contexts/InterventionContext';

export default function Home() {
  const router = useRouter();
  const { data, updateData, saveIntervention } = useIntervention();
  
  const [nom, setNom] = useState(data.nom || '');
  const [matricule, setMatricule] = useState(data.matricule || '');
  const [numeroIntervention, setNumeroIntervention] = useState(data.numeroIntervention || '');
  const [adresse, setAdresse] = useState(data.adresse || '');
  const [latitude, setLatitude] = useState(data.latitude || null);
  const [longitude, setLongitude] = useState(data.longitude || null);
  const [loading, setLoading] = useState(false);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'La permission de localisation est nécessaire pour cette fonctionnalité.');
      return false;
    }
    return true;
  };

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

      // Reverse geocoding pour obtenir l'adresse
      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addresses.length > 0) {
        const addr = addresses[0];
        const formattedAddress = `${addr.street || ''} ${addr.streetNumber || ''}, ${addr.city || ''}, ${addr.postalCode || ''}`;
        setAdresse(formattedAddress);
      }

      Alert.alert('Succès', 'Localisation obtenue avec succès!');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'obtenir la localisation.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!nom || !matricule || !numeroIntervention) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    updateData('nom', nom);
    updateData('matricule', matricule);
    updateData('numeroIntervention', numeroIntervention);
    updateData('adresse', adresse);
    updateData('latitude', latitude);
    updateData('longitude', longitude);

    await saveIntervention();
    router.push('/weather');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://customer-assets.emergentagent.com/job_fc3d9cc8-1e32-46c7-b96d-ce4f244d60f5/artifacts/mkgxn585_avatar_officier_s%C3%A9curit%C3%A9-Photoroom.png' }}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Officier Sécurité</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Nom *</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre nom"
            placeholderTextColor="#999"
            value={nom}
            onChangeText={setNom}
          />

          <Text style={styles.label}>Matricule *</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre matricule"
            placeholderTextColor="#999"
            value={matricule}
            onChangeText={setMatricule}
          />

          <Text style={styles.label}>Numéro d'Intervention *</Text>
          <TextInput
            style={styles.input}
            placeholder="N° d'intervention"
            placeholderTextColor="#999"
            value={numeroIntervention}
            onChangeText={setNumeroIntervention}
          />

          <Text style={styles.label}>Adresse</Text>
          <TextInput
            style={styles.input}
            placeholder="Adresse manuelle (optionnel)"
            placeholderTextColor="#999"
            value={adresse}
            onChangeText={setAdresse}
            multiline
          />

          <TouchableOpacity
            style={styles.gpsButton}
            onPress={getLocation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.gpsButtonText}>📍 Obtenir ma position GPS</Text>
            )}
          </TouchableOpacity>

          {latitude && longitude && (
            <View style={styles.coordsContainer}>
              <Text style={styles.coordsText}>GPS: {latitude.toFixed(6)}, {longitude.toFixed(6)}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>ENTRER</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262135',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  formContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#3a3450',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  gpsButton: {
    backgroundColor: '#5a4fcf',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  gpsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  coordsContainer: {
    backgroundColor: '#3a3450',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  coordsText: {
    color: '#4ade80',
    fontSize: 14,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

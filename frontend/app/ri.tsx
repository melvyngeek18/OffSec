import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function RI() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 Organisation Opérationnelle</Text>
        <Text style={styles.subtitle}>Schéma RI (Responsabilité d'Intervention)</Text>
      </View>

      <View style={styles.imageCard}>
        <Image
          source={{ uri: 'https://customer-assets.emergentagent.com/job_fc3d9cc8-1e32-46c7-b96d-ce4f244d60f5/artifacts/6wpp6qo1_RI.png' }}
          style={styles.riImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📊 Structure Hiérarchique</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoBullet}>•</Text>
          <Text style={styles.infoText}>CODIS - Centre Opérationnel</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoBullet}>•</Text>
          <Text style={styles.infoText}>PCS - Poste de Commandement</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoBullet}>•</Text>
          <Text style={styles.infoText}>COS - Centre Opérationnel de Soutien</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoBullet}>•</Text>
          <Text style={styles.infoText}>OFF SECU - Officier Sécurité</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => router.push('/actions')}
      >
        <Text style={styles.nextButtonText}>CONTINUER VERS ACTIONS →</Text>
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
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  imageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  riImage: {
    width: '100%',
    height: 300,
  },
  infoCard: {
    backgroundColor: '#3a3450',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoBullet: {
    fontSize: 16,
    color: '#4ade80',
    marginRight: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  nextButton: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

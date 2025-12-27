import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useIntervention } from '../contexts/InterventionContext';

const MENU_ITEMS = [
  { id: 1, title: '🌤️ Météo', route: '/weather', icon: '🌤️' },
  { id: 2, title: '📊 Organisation RI', route: '/ri', icon: '📊' },
  { id: 3, title: '✅ Actions à Mener', route: '/actions', icon: '✅' },
  { id: 4, title: '🛡️ Mesures Opérationnelles', route: '/operations', icon: '🛡️' },
  { id: 5, title: '⚠️ Zones à Risques', route: '/risks', icon: '⚠️' },
  { id: 6, title: '🚧 Périmètres de Sécurité', route: '/perimeter', icon: '🚧' },
  { id: 7, title: '📝 SSO Scoring', route: '/sso', icon: '📝' },
  { id: 8, title: '📑 Synthèse Finale', route: '/summary', icon: '📑' },
];

export default function Menu() {
  const router = useRouter();
  const { data, resetIntervention } = useIntervention();

  const handleLogout = () => {
    if (confirm('Voulez-vous vraiment quitter l\'intervention en cours ?')) {
      resetIntervention();
      router.replace('/');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>📋 Menu Principal</Text>
          <Text style={styles.subtitle}>Application OffSec</Text>
        </View>

        {/* Informations intervention */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Intervention en cours</Text>
          <Text style={styles.infoText}>👤 {data.nom || 'Non renseigné'}</Text>
          <Text style={styles.infoText}>🔢 {data.numeroIntervention || 'Non renseigné'}</Text>
        </View>

        {/* Menu items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Navigation Rapide</Text>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => router.push(item.route as any)}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuText}>{item.title}</Text>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.homeButtonText}>🏠 Retour Accueil</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quitButton}
            onPress={handleLogout}
          >
            <Text style={styles.quitButtonText}>🚪 Quitter l'Intervention</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262135',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
  },
  infoCard: {
    backgroundColor: '#3a3450',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  menuItem: {
    backgroundColor: '#3a3450',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  menuArrow: {
    fontSize: 20,
    color: '#9ca3af',
  },
  actionsSection: {
    marginTop: 24,
  },
  homeButton: {
    backgroundColor: '#5a4fcf',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quitButton: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  quitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
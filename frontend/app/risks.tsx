import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useIntervention } from '../contexts/InterventionContext';
import PhotoCapture from '../components/PhotoCapture';

const RISKS = [
  // Périmètre de sécurité
  { id: 'risk1', category: 'Périmètre', text: 'Périmètre présent et efficace' },
  { id: 'risk2', category: 'Périmètre', text: 'Triangles de signalisation' },
  { id: 'risk3', category: 'Périmètre', text: 'Cônes de signalisation' },
  { id: 'risk4', category: 'Périmètre', text: 'Rubalise' },
  { id: 'risk5', category: 'Périmètre', text: 'Chasubles' },
  { id: 'risk6', category: 'Périmètre', text: 'Adapté au dispositif (Évolutif)' },
  
  // Positionnement des engins
  { id: 'risk7', category: 'Engins', text: 'Circulation/blocage voies respecté' },
  { id: 'risk8', category: 'Engins', text: 'Risque explosion évalué' },
  { id: 'risk9', category: 'Engins', text: 'Risque effondrement (1.5 H)' },
  { id: 'risk10', category: 'Engins', text: 'Distance lignes électriques (3-5m)' },
  { id: 'risk11', category: 'Engins', text: 'PPV travail 1m - INC 5m' },
  
  // Coupures des fluides
  { id: 'risk12', category: 'Fluides', text: 'Électricité coupée' },
  { id: 'risk13', category: 'Fluides', text: 'Eau coupée' },
  { id: 'risk14', category: 'Fluides', text: 'Gaz coupé' },
  { id: 'risk15', category: 'Fluides', text: 'Produits chimiques sécurisés' },
  { id: 'risk16', category: 'Fluides', text: 'Énergie renouvelable contrôlée' },
  
  // Stockage de fluides
  { id: 'risk17', category: 'Stockage', text: 'Fuel localisé et sécurisé' },
  { id: 'risk18', category: 'Stockage', text: 'Gaz localisé et sécurisé' },
  { id: 'risk19', category: 'Stockage', text: 'Chimiques localisés et sécurisés' },
  
  // Risques spécifiques
  { id: 'risk20', category: 'Spécifiques', text: 'Bâtiment construit avant 1997 (Amiante)' },
  { id: 'risk21', category: 'Spécifiques', text: 'Présence amiante confirmée' },
  
  // Mesures de sécurité individuelles & collectives
  { id: 'risk22', category: 'Sécurité', text: 'Itinéraire de repli existant' },
  { id: 'risk23', category: 'Sécurité', text: 'EPA (Equipement Protection Autonome)' },
  { id: 'risk24', category: 'Sécurité', text: 'Sorties doublées si nécessaire' },
  { id: 'risk25', category: 'Sécurité', text: 'Binôme de sécurité' },
  { id: 'risk26', category: 'Sécurité', text: 'Échelle à coulisses' },
  { id: 'risk27', category: 'Sécurité', text: 'EPI adaptés aux risques' },
  { id: 'risk28', category: 'Sécurité', text: 'EPI portés correctement' },
];

export default function Risks() {
  const router = useRouter();
  const { data, updateRisks, saveIntervention } = useIntervention();

  const completedCount = Object.values(data.risks).filter(Boolean).length;
  const progress = (completedCount / RISKS.length) * 100;

  const toggleRisk = async (riskId: string) => {
    updateRisks(riskId, !data.risks[riskId]);
    await saveIntervention();
  };

  const categories = Array.from(new Set(RISKS.map(risk => risk.category)));

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Progression: {completedCount}/{RISKS.length} points
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>⚠️ Zones à Risques</Text>
          <Text style={styles.warningText}>
            Identification et validation des zones à risques et mesures de sécurité
          </Text>
        </View>

        {categories.map(category => {
          const categoryRisks = RISKS.filter(risk => risk.category === category);
          return (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {categoryRisks.map(risk => (
                <View key={risk.id} style={styles.riskCard}>
                  <Text style={styles.riskText}>{risk.text}</Text>
                  <Switch
                    value={data.risks[risk.id] || false}
                    onValueChange={() => toggleRisk(risk.id)}
                    trackColor={{ false: '#4b5563', true: '#4ade80' }}
                    thumbColor={data.risks[risk.id] ? '#fff' : '#f3f4f6'}
                  />
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => router.push('/sso')}
        >
          <Text style={styles.nextButtonText}>SSO SCORING →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262135',
  },
  progressContainer: {
    backgroundColor: '#3a3450',
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#4b5563',
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#4b5563',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ade80',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  warningCard: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#fff',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#f59e0b',
  },
  riskCard: {
    backgroundColor: '#3a3450',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  riskText: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
    marginRight: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#4b5563',
    backgroundColor: '#3a3450',
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

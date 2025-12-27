import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useIntervention } from '../contexts/InterventionContext';

export default function Summary() {
  const router = useRouter();
  const { data, resetIntervention, saveIntervention } = useIntervention();

  const actionsData = [
    { id: 'action1', text: 'Présentation au COS' },
    { id: 'action2', text: 'Prise en compte de la mission' },
    { id: 'action3', text: 'Information chefs de secteurs' },
    { id: 'action4', text: 'Contact chef secteur soutien/SSO' },
    { id: 'action5', text: 'Reconnaissance cubique' },
    { id: 'action6', text: 'Mesures conservatoires si danger' },
    { id: 'action7', text: 'Analyse des risques' },
    { id: 'action8', text: 'Compte-rendu au COS' },
    { id: 'action9', text: 'Transmission à officier RENS' },
    { id: 'action10', text: 'Mesures d\'hygiène et prévention' },
    { id: 'action11', text: 'Réévaluation périodique' },
    { id: 'action12', text: 'Retour d\'expérience' },
  ];

  const remainingActions = actionsData.filter(action => !data.actions[action.id]);
  const completedActions = actionsData.filter(action => data.actions[action.id]);

  const handleReset = () => {
    Alert.alert(
      'Confirmer la réinitialisation',
      'Êtes-vous sûr de vouloir commencer une nouvelle intervention ? Toutes les données actuelles seront perdues.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: () => {
            resetIntervention();
            router.replace('/');
          },
        },
      ]
    );
  };

  const toggleAction = async (actionId: string) => {
    const { updateActions } = useIntervention();
    updateActions(actionId, !data.actions[actionId]);
    await saveIntervention();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>📋 Synthèse de l'Intervention</Text>
        </View>

        {/* Informations générales */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>👤 Informations Générales</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nom:</Text>
            <Text style={styles.infoValue}>{data.nom}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Matricule:</Text>
            <Text style={styles.infoValue}>{data.matricule}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>N° Intervention:</Text>
            <Text style={styles.infoValue}>{data.numeroIntervention}</Text>
          </View>
          {data.adresse && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Adresse:</Text>
              <Text style={styles.infoValue}>{data.adresse}</Text>
            </View>
          )}
          {data.latitude && data.longitude && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>GPS:</Text>
              <Text style={styles.infoValue}>
                {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
              </Text>
            </View>
          )}
        </View>

        {/* SSO */}
        {data.ssoScore > 0 && (
          <View style={styles.ssoCard}>
            <Text style={styles.cardTitle}>🏋️ SSO - Soutien Sanitaire</Text>
            <View style={styles.ssoRow}>
              <Text style={styles.ssoLabel}>Score:</Text>
              <Text style={styles.ssoValue}>{data.ssoScore} points</Text>
            </View>
            <View style={styles.ssoRow}>
              <Text style={styles.ssoLabel}>Niveau:</Text>
              <Text style={styles.ssoValue}>{data.ssoLevel}</Text>
            </View>
            <View style={styles.ssoRow}>
              <Text style={styles.ssoLabel}>Moyens:</Text>
              <Text style={styles.ssoRecommendation}>{data.ssoRecommendation}</Text>
            </View>
          </View>
        )}

        {/* Statistiques */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>📊 Statistiques</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Actions principales:</Text>
            <Text style={styles.statValue}>
              {completedActions.length}/{actionsData.length}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Mesures opérationnelles:</Text>
            <Text style={styles.statValue}>
              {Object.values(data.operations).filter(Boolean).length} validées
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Zones à risques:</Text>
            <Text style={styles.statValue}>
              {Object.values(data.risks).filter(Boolean).length} vérifiées
            </Text>
          </View>
        </View>

        {/* Actions restantes */}
        {remainingActions.length > 0 && (
          <View style={styles.remainingCard}>
            <Text style={styles.cardTitle}>⚠️ Actions Restantes ({remainingActions.length})</Text>
            {remainingActions.map((action, index) => (
              <View key={action.id} style={styles.actionItem}>
                <View style={styles.actionBullet}>
                  <Text style={styles.actionNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.actionText}>{action.text}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Actions complétées */}
        {completedActions.length > 0 && (
          <View style={styles.completedCard}>
            <Text style={styles.cardTitle}>✅ Actions Complétées ({completedActions.length})</Text>
            {completedActions.map((action) => (
              <View key={action.id} style={styles.completedItem}>
                <Text style={styles.checkmark}>✅</Text>
                <Text style={styles.completedText}>{action.text}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.messageCard}>
          <Text style={styles.messageText}>
            👍 Excellent travail! Continuez à maintenir la sécurité de l'intervention.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.modifyButton}
          onPress={() => router.push('/actions')}
        >
          <Text style={styles.modifyButtonText}>MODIFIER LES ACTIONS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
        >
          <Text style={styles.resetButtonText}>NOUVELLE INTERVENTION</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoCard: {
    backgroundColor: '#3a3450',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#9ca3af',
    width: 120,
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
  },
  ssoCard: {
    backgroundColor: '#4ade80',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  ssoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ssoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  ssoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  ssoRecommendation: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    flex: 1,
  },
  statsCard: {
    backgroundColor: '#5a4fcf',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  remainingCard: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  actionText: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
  },
  completedCard: {
    backgroundColor: '#3a3450',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  completedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkmark: {
    fontSize: 20,
    marginRight: 8,
  },
  completedText: {
    fontSize: 14,
    color: '#9ca3af',
    flex: 1,
    textDecorationLine: 'line-through',
  },
  messageCard: {
    backgroundColor: '#3a3450',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  messageText: {
    fontSize: 16,
    color: '#4ade80',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#4b5563',
    backgroundColor: '#3a3450',
  },
  modifyButton: {
    backgroundColor: '#5a4fcf',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  modifyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#dc2626',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

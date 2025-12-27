import React, { useEffect } from 'react';
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

const ACTIONS = [
  {
    id: 'action1',
    text: 'Je me présente au COS pour l\'informer que je suis sur site et que je pars en reconnaissance',
  },
  {
    id: 'action2',
    text: 'Je prends en compte ma mission. J\'échange avec le COS',
  },
  {
    id: 'action3',
    text: 'Je m\'assure que le COS a informé les chefs de secteurs de l\'activation de la fonction OFFICIER SECURITE',
  },
  {
    id: 'action4',
    text: 'Je prends contact avec le chef du secteur soutien ou avec le SSO',
  },
  {
    id: 'action5',
    text: 'Je fais une reconnaissance cubique de la zone d\'intervention',
  },
  {
    id: 'action6',
    text: 'En cas de danger grave et imminent, je prends les mesures conservatoires immédiates',
  },
  {
    id: 'action7',
    text: 'J\'analyse les risques liés à l\'intervention (zones à risques, mesures de sécurité)',
  },
  {
    id: 'action8',
    text: 'Je rends compte au COS des éléments de ma reconnaissance',
  },
  {
    id: 'action9',
    text: 'Je transmets les éléments à l\'officier RENS pour compléter la SITAC',
  },
  {
    id: 'action10',
    text: 'Je m\'assure de la mise en œuvre des mesures d\'hygiène et de prévention sanitaire',
  },
  {
    id: 'action11',
    text: 'Je réévalue périodiquement la sécurité individuelle et collective',
  },
  {
    id: 'action12',
    text: 'Je participe au retour d\'expérience (Rédaction de CRSS, propositions)',
  },
];

export default function Actions() {
  const router = useRouter();
  const { data, updateActions, saveIntervention } = useIntervention();

  const completedCount = Object.values(data.actions).filter(Boolean).length;
  const progress = (completedCount / ACTIONS.length) * 100;

  const toggleAction = async (actionId: string) => {
    updateActions(actionId, !data.actions[actionId]);
    await saveIntervention();
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Progression: {completedCount}/{ACTIONS.length} actions
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {ACTIONS.map((action, index) => (
          <View key={action.id} style={styles.actionCard}>
            <View style={styles.actionHeader}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionText}>{action.text}</Text>
              </View>
              <Switch
                value={data.actions[action.id] || false}
                onValueChange={() => toggleAction(action.id)}
                trackColor={{ false: '#4b5563', true: '#4ade80' }}
                thumbColor={data.actions[action.id] ? '#fff' : '#f3f4f6'}
              />
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => router.push('/operations')}
        >
          <Text style={styles.nextButtonText}>MESURES OPÉRATIONNELLES →</Text>
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
  actionCard: {
    backgroundColor: '#3a3450',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  actionText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
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

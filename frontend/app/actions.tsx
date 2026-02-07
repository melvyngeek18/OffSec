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

  // Fonction pour vérifier si une action est débloquée
  const isActionUnlocked = (index: number): boolean => {
    if (index === 0) return true; // La première est toujours active
    
    // Vérifier si l'action précédente est validée
    const previousActionId = ACTIONS[index - 1].id;
    return data.actions[previousActionId] === true;
  };

  // Fonction pour vérifier si les photos sont débloquées (après action 5)
  const isPhotoUnlocked = (): boolean => {
    return data.actions['action5'] === true;
  };

  const toggleAction = async (actionId: string, index: number) => {
    // Vérifier si l'action est débloquée
    if (!isActionUnlocked(index)) return;
    
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
        {/* Section Photos à l'arrivée - débloquée après action 5 */}
        {isPhotoUnlocked() ? (
          <PhotoCapture type="arrival" title="Photos à l'arrivée sur les lieux" />
        ) : (
          <View style={styles.photoLockedCard}>
            <Text style={styles.photoLockedIcon}>🔒</Text>
            <Text style={styles.photoLockedTitle}>Photos verrouillées</Text>
            <Text style={styles.photoLockedText}>
              Validez l'action 5 (Reconnaissance cubique) pour pouvoir prendre des photos
            </Text>
          </View>
        )}

        {ACTIONS.map((action, index) => {
          const isUnlocked = isActionUnlocked(index);
          const isCompleted = data.actions[action.id] || false;
          
          return (
            <View 
              key={action.id} 
              style={[
                styles.actionCard,
                !isUnlocked && styles.actionCardLocked,
                isCompleted && styles.actionCardCompleted,
              ]}
            >
              <View style={styles.actionHeader}>
                <View style={[
                  styles.numberBadge,
                  !isUnlocked && styles.numberBadgeLocked,
                  isCompleted && styles.numberBadgeCompleted,
                ]}>
                  {isCompleted ? (
                    <Text style={styles.checkIcon}>✓</Text>
                  ) : !isUnlocked ? (
                    <Text style={styles.lockIcon}>🔒</Text>
                  ) : (
                    <Text style={styles.numberText}>{index + 1}</Text>
                  )}
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={[
                    styles.actionText,
                    !isUnlocked && styles.actionTextLocked,
                    isCompleted && styles.actionTextCompleted,
                  ]}>
                    {action.text}
                  </Text>
                  {!isUnlocked && (
                    <Text style={styles.unlockHint}>
                      Validez l'action {index} pour débloquer
                    </Text>
                  )}
                </View>
                <Switch
                  value={isCompleted}
                  onValueChange={() => toggleAction(action.id, index)}
                  trackColor={{ false: '#4b5563', true: '#4ade80' }}
                  thumbColor={isCompleted ? '#fff' : '#f3f4f6'}
                  disabled={!isUnlocked}
                />
              </View>
            </View>
          );
        })}

        <View style={styles.spacer} />
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
    paddingBottom: 120,
  },
  photoLockedCard: {
    backgroundColor: '#4b5563',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6b7280',
    borderStyle: 'dashed',
  },
  photoLockedIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  photoLockedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9ca3af',
    marginBottom: 4,
  },
  photoLockedText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  actionCard: {
    backgroundColor: '#3a3450',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#5a4fcf',
  },
  actionCardLocked: {
    backgroundColor: '#2a2438',
    borderLeftColor: '#4b5563',
    opacity: 0.6,
  },
  actionCardCompleted: {
    backgroundColor: '#1a3a2a',
    borderLeftColor: '#4ade80',
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberBadgeLocked: {
    backgroundColor: '#4b5563',
  },
  numberBadgeCompleted: {
    backgroundColor: '#4ade80',
  },
  numberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkIcon: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  lockIcon: {
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
  actionTextLocked: {
    color: '#6b7280',
  },
  actionTextCompleted: {
    color: '#4ade80',
  },
  unlockHint: {
    fontSize: 10,
    color: '#f59e0b',
    marginTop: 4,
    fontStyle: 'italic',
  },
  spacer: {
    height: 20,
  },
  footer: {
    padding: 16,
    paddingBottom: 80,
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

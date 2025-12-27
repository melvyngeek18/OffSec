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

const OPERATIONS = [
  // Contrôle de l'engagement des binômes
  { id: 'op1', category: 'Binômes', text: 'Présence d\'un contrôleur' },
  { id: 'op2', category: 'Binômes', text: 'Présence d\'un binôme de sécurité' },
  { id: 'op3', category: 'Binômes', text: 'Retrait des bips et téléphones si milieu explosif' },
  { id: 'op4', category: 'Binômes', text: 'Matériels ATEX' },
  { id: 'op5', category: 'Binômes', text: 'Présence d\'un sas et d\'un contrôleur' },
  
  // Phénomènes thermiques
  { id: 'op6', category: 'Phénomènes thermiques', text: 'Repérage risque d\'Explosion de Fumées' },
  { id: 'op7', category: 'Phénomènes thermiques', text: 'Repérage risque d\'Embrasement Généralisé Éclair' },
  
  // Sécurisation des circulations
  { id: 'op8', category: 'Circulations', text: 'Vérification des trous' },
  { id: 'op9', category: 'Circulations', text: 'Vérification du vide' },
  { id: 'op10', category: 'Circulations', text: 'Vérification des gravats' },
  { id: 'op11', category: 'Circulations', text: 'Éclairage adéquat' },
  { id: 'op12', category: 'Circulations', text: 'Ventilation' },
  { id: 'op13', category: 'Circulations', text: 'Franchissement d\'obstacles sécurisé' },
  { id: 'op14', category: 'Circulations', text: 'Protection contre chutes d\'objets' },
  { id: 'op15', category: 'Circulations', text: 'Vérification planchers gorgés d\'eau' },
  { id: 'op16', category: 'Circulations', text: 'Risque d\'effondrement de structures' },
  { id: 'op17', category: 'Circulations', text: 'Vitres cassées signalées' },
  { id: 'op18', category: 'Circulations', text: 'Dangers signalés' },
  { id: 'op19', category: 'Circulations', text: 'Risque de heurt' },
  { id: 'op20', category: 'Circulations', text: 'Machines sécurisées' },
  { id: 'op21', category: 'Circulations', text: 'Animaux signalés' },
  { id: 'op22', category: 'Circulations', text: 'Solidité sol et plancher' },
  
  // Opérations de déblai
  { id: 'op23', category: 'Déblai', text: 'Éclairage suffisant' },
  { id: 'op24', category: 'Déblai', text: 'Port de l\'ARI' },
  { id: 'op25', category: 'Déblai', text: 'Aide à la manutention (Brouette, goulotte)' },
  { id: 'op26', category: 'Déblai', text: 'Structures stables' },
  { id: 'op27', category: 'Déblai', text: 'Accès libre aux circulations' },
  { id: 'op28', category: 'Déblai', text: 'Échelles fixées' },
  { id: 'op29', category: 'Déblai', text: 'Façades sécurisées' },
  { id: 'op30', category: 'Déblai', text: 'Surveillance état du bâtiment (RBAT)' },
  
  // Violences urbaines
  { id: 'op31', category: 'Violences urbaines', text: 'EPI complets' },
  { id: 'op32', category: 'Violences urbaines', text: 'Vitres fermées' },
  { id: 'op33', category: 'Violences urbaines', text: 'Engins adaptés' },
  { id: 'op34', category: 'Violences urbaines', text: 'Itinéraire de repli CRM activés' },
  
  // Travail en hauteur
  { id: 'op35', category: 'Hauteur', text: 'Utilisation du LSPCC' },
  { id: 'op36', category: 'Hauteur', text: 'Détection des lignes HT' },
  { id: 'op37', category: 'Hauteur', text: 'Longes au poste de travail' },
  { id: 'op38', category: 'Hauteur', text: 'Sécurisation des échelles' },
  { id: 'op39', category: 'Hauteur', text: 'Coupure moteur échelle si équipiers sur les plans' },
  
  // Agrès à moteur thermique
  { id: 'op40', category: 'Moteurs', text: 'Mise à la terre des groupes électrogènes' },
  { id: 'op41', category: 'Moteurs', text: 'Remplissage des réservoirs en sécurité' },
  
  // Communication et détection
  { id: 'op42', category: 'Communication', text: 'Communication VPC/Chefs de secteur' },
  { id: 'op43', category: 'Communication', text: 'Port de l\'ARI durant le déblai' },
  { id: 'op44', category: 'Communication', text: 'Appareils de détection adaptés' },
  
  // Traction et levage
  { id: 'op45', category: 'Levage', text: 'Calage des charges' },
  { id: 'op46', category: 'Levage', text: 'Périmètres de sécurité' },
  { id: 'op47', category: 'Levage', text: 'Position des personnels adaptée' },
  { id: 'op48', category: 'Levage', text: 'Limitation des ports de charges' },
  
  // Services extérieurs
  { id: 'op49', category: 'Services ext', text: 'Gestion SMUR, SDS, PATS, FSI' },
  { id: 'op50', category: 'Services ext', text: 'Respect des consignes de sécurité' },
  { id: 'op51', category: 'Services ext', text: 'Coordination avec le COS' },
  
  // Liaisons radio
  { id: 'op52', category: 'Radio', text: 'Liaisons VPC/terrain fonctionnelles' },
  { id: 'op53', category: 'Radio', text: 'Liaisons radio équipiers fonctionnelles' },
];

export default function Operations() {
  const router = useRouter();
  const { data, updateOperations, saveIntervention } = useIntervention();

  const completedCount = Object.values(data.operations).filter(Boolean).length;
  const progress = (completedCount / OPERATIONS.length) * 100;

  const toggleOperation = async (opId: string) => {
    updateOperations(opId, !data.operations[opId]);
    await saveIntervention();
  };

  // Grouper par catégorie
  const categories = Array.from(new Set(OPERATIONS.map(op => op.category)));

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Progression: {completedCount}/{OPERATIONS.length} mesures
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {categories.map(category => {
          const categoryOps = OPERATIONS.filter(op => op.category === category);
          return (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {categoryOps.map(op => (
                <View key={op.id} style={styles.opCard}>
                  <Text style={styles.opText}>{op.text}</Text>
                  <Switch
                    value={data.operations[op.id] || false}
                    onValueChange={() => toggleOperation(op.id)}
                    trackColor={{ false: '#4b5563', true: '#4ade80' }}
                    thumbColor={data.operations[op.id] ? '#fff' : '#f3f4f6'}
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
          onPress={() => router.push('/risks')}
        >
          <Text style={styles.nextButtonText}>ZONES À RISQUES →</Text>
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
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#dc2626',
  },
  opCard: {
    backgroundColor: '#3a3450',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  opText: {
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

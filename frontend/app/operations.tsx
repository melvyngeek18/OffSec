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
  const { data, updateOperationCategories, updateOperations, saveIntervention } = useIntervention();

  // Utiliser les catégories depuis le context ou initialiser à false
  const activeCategories = data.operationCategories || {
    'Binômes': false,
    'Phénomènes thermiques': false,
    'Circulations': false,
    'Déblai': false,
    'Violences urbaines': false,
    'Hauteur': false,
    'Moteurs': false,
    'Communication': false,
    'Levage': false,
    'Services ext': false,
    'Radio': false,
  };

  const categories = Array.from(new Set(OPERATIONS.map(op => op.category)));

  const toggleCategory = async (category: string) => {
    const newActiveCategories = {
      ...activeCategories,
      [category]: !activeCategories[category],
    };
    updateOperationCategories(newActiveCategories);
    await saveIntervention();
  };

  const toggleOperation = async (opId: string) => {
    updateOperations(opId, !data.operations[opId]);
    await saveIntervention();
  };

  // Calculer les mesures complétées seulement pour les catégories actives
  const activeOperations = OPERATIONS.filter(op => activeCategories[op.category]);
  const completedCount = activeOperations.filter(op => data.operations[op.id]).length;
  const progress = activeOperations.length > 0 ? (completedCount / activeOperations.length) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Progression: {completedCount}/{activeOperations.length} mesures
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressSubtext}>
          {categories.filter(cat => activeCategories[cat]).length}/{categories.length} catégories actives
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Section Photos en cours d'action */}
        <PhotoCapture type="progress" title="Photos en cours d'action" />

        {categories.map(category => {
          const categoryOps = OPERATIONS.filter(op => op.category === category);
          const isActive = activeCategories[category];
          
          return (
            <View key={category} style={styles.categorySection}>
              {/* En-tête de catégorie avec switch */}
              <TouchableOpacity
                style={[
                  styles.categoryHeader,
                  !isActive && styles.categoryHeaderInactive,
                ]}
                onPress={() => toggleCategory(category)}
              >
                <View style={styles.categoryTitleContainer}>
                  <Text style={[
                    styles.categoryTitle,
                    !isActive && styles.categoryTitleInactive,
                  ]}>
                    {category}
                  </Text>
                  <Text style={styles.categoryCount}>
                    {categoryOps.length} mesure{categoryOps.length > 1 ? 's' : ''}
                  </Text>
                </View>
                <Switch
                  value={isActive}
                  onValueChange={() => toggleCategory(category)}
                  trackColor={{ false: '#4b5563', true: '#4ade80' }}
                  thumbColor={isActive ? '#fff' : '#f3f4f6'}
                />
              </TouchableOpacity>

              {/* Liste des mesures si la catégorie est active */}
              {isActive && (
                <View style={styles.operationsContainer}>
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
              )}
            </View>
          );
        })}

        <View style={styles.spacer} />
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
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ade80',
  },
  progressSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryHeader: {
    backgroundColor: '#3a3450',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#4ade80',
  },
  categoryHeaderInactive: {
    backgroundColor: '#2a2438',
    borderColor: '#4b5563',
  },
  categoryTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  categoryTitleInactive: {
    color: '#6b7280',
  },
  categoryCount: {
    fontSize: 12,
    color: '#9ca3af',
  },
  operationsContainer: {
    paddingLeft: 8,
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

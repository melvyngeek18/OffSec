import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useIntervention } from '../contexts/InterventionContext';

export default function SSO() {
  const router = useRouter();
  const { updateData, saveIntervention } = useIntervention();

  const [personnel, setPersonnel] = useState(0);
  const [duree, setDuree] = useState(1);
  const [danger, setDanger] = useState(0);
  const [equipe, setEquipe] = useState(0);
  
  const [nrbc, setNrbc] = useState(false);
  const [climat, setClimat] = useState(false);
  const [plus100, setPlus100] = useState(false);
  const [sensible, setSensible] = useState(false);

  const calculateScore = () => {
    return personnel + duree + danger + equipe;
  };

  const getLevel = (score: number) => {
    if (score <= 2) return 'Niveau 0';
    if (score <= 4) return 'Niveau I';
    if (score <= 7) return 'Niveau II';
    if (score <= 10) return 'Niveau III';
    return 'Niveau IV';
  };

  const getRecommendation = (score: number) => {
    if (score <= 2) return 'Pas de SSO';
    if (score <= 4) return 'Réponse de proximité VSAV';
    if (score <= 7) return 'VSAV / INF';
    if (score <= 10) return 'VSAV / INF / VSSO';
    return 'VSAV / INF / VSSO / MED';
  };

  const hasSpecialConditions = nrbc || climat || plus100 || sensible;
  const score = calculateScore();
  const needsAstreinte = hasSpecialConditions || score > 5;

  const handleSave = async () => {
    const level = getLevel(score);
    const recommendation = getRecommendation(score);
    
    updateData('ssoScore', score);
    updateData('ssoLevel', level);
    updateData('ssoRecommendation', recommendation);
    
    await saveIntervention();
    router.push('/summary');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>🏋️‍♀️ Soutien Sanitaire Opérationnel</Text>
          <Text style={styles.subtitle}>Outil d'aide à la décision (Annexe 1)</Text>
        </View>

        {/* Critère 1: Nombre de personnel */}
        <View style={styles.criteriaCard}>
          <Text style={styles.criteriaTitle}>1. Nombre de personnel engagé</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={personnel}
              onValueChange={(value) => setPersonnel(value)}
              style={styles.picker}
              dropdownIconColor="#fff"
            >
              <Picker.Item label="< 10 (0 pt)" value={0} />
              <Picker.Item label="11 à 25 (1 pt)" value={1} />
              <Picker.Item label="26 à 50 (2 pts)" value={2} />
              <Picker.Item label="51 à 100 (3 pts)" value={3} />
              <Picker.Item label="> 100 (4 pts)" value={4} />
            </Picker>
          </View>
        </View>

        {/* Critère 2: Durée */}
        <View style={styles.criteriaCard}>
          <Text style={styles.criteriaTitle}>2. Durée prévisible de l'intervention</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={duree}
              onValueChange={(value) => setDuree(value)}
              style={styles.picker}
              dropdownIconColor="#fff"
            >
              <Picker.Item label="< 1h30 (1 pt)" value={1} />
              <Picker.Item label="1h30 à 3h00 (2 pts)" value={2} />
              <Picker.Item label="3h00 à 8h00 (3 pts)" value={3} />
              <Picker.Item label="> 8h00 (4 pts)" value={4} />
            </Picker>
          </View>
        </View>

        {/* Critère 3: Danger particulier */}
        <View style={styles.criteriaCard}>
          <Text style={styles.criteriaTitle}>3. Danger particulier</Text>
          <Text style={styles.criteriaSubtitle}>
            (Fuites gaz, TMD, effondrement, inondations, explosions...)
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={danger}
              onValueChange={(value) => setDanger(value)}
              style={styles.picker}
              dropdownIconColor="#fff"
            >
              <Picker.Item label="Non (0 pt)" value={0} />
              <Picker.Item label="Potentiel (1 pt)" value={1} />
              <Picker.Item label="Avéré (4 pts)" value={4} />
            </Picker>
          </View>
        </View>

        {/* Critère 4: Équipe spécialisée */}
        <View style={styles.criteriaCard}>
          <Text style={styles.criteriaTitle}>4. Engagement d'une équipe spécialisée</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={equipe}
              onValueChange={(value) => setEquipe(value)}
              style={styles.picker}
              dropdownIconColor="#fff"
            >
              <Picker.Item label="Aucune (0 pt)" value={0} />
              <Picker.Item label="CYN (1 pt)" value={1} />
              <Picker.Item label="SMPM / USAR (2 pts)" value={2} />
              <Picker.Item label="FDF / RAD (3 pts)" value={3} />
              <Picker.Item label="SAV / SEV / SAL / RCH / UMD (4 pts)" value={4} />
            </Picker>
          </View>
        </View>

        {/* Conditions particulières */}
        <View style={styles.specialCard}>
          <Text style={styles.specialTitle}>⚠️ Conditions Particulières</Text>
          
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Risque NRBC</Text>
            <Switch
              value={nrbc}
              onValueChange={setNrbc}
              trackColor={{ false: '#4b5563', true: '#ef4444' }}
              thumbColor={nrbc ? '#fff' : '#f3f4f6'}
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Conditions climatiques extrêmes</Text>
            <Switch
              value={climat}
              onValueChange={setClimat}
              trackColor={{ false: '#4b5563', true: '#ef4444' }}
              thumbColor={climat ? '#fff' : '#f3f4f6'}
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Plus de 100 personnes</Text>
            <Switch
              value={plus100}
              onValueChange={setPlus100}
              trackColor={{ false: '#4b5563', true: '#ef4444' }}
              thumbColor={plus100 ? '#fff' : '#f3f4f6'}
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Interventions sensibles (VIP, ERP...)</Text>
            <Switch
              value={sensible}
              onValueChange={setSensible}
              trackColor={{ false: '#4b5563', true: '#ef4444' }}
              thumbColor={sensible ? '#fff' : '#f3f4f6'}
            />
          </View>
        </View>

        {/* Résultats */}
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>📊 Résultats</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Score Total:</Text>
            <Text style={styles.resultValue}>{score} points</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Niveau:</Text>
            <Text style={[styles.resultValue, styles.levelValue]}>{getLevel(score)}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Préconisation:</Text>
            <Text style={styles.recommendationValue}>{getRecommendation(score)}</Text>
          </View>
          
          {needsAstreinte && (
            <View style={styles.alertBox}>
              <Text style={styles.alertText}>
                ⚠️ APPEL DE L'ASTREINTE SDS POUR MONTÉE EN PUISSANCE
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>ENREGISTRER ET CONTINUER →</Text>
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  criteriaCard: {
    backgroundColor: '#3a3450',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  criteriaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  criteriaSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 12,
  },
  pickerContainer: {
    backgroundColor: '#262135',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
  },
  specialCard: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  specialTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  switchLabel: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
  },
  resultCard: {
    backgroundColor: '#4ade80',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  resultValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  levelValue: {
    fontSize: 20,
  },
  recommendationValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    flex: 1,
  },
  alertBox: {
    backgroundColor: '#dc2626',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  alertText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#4b5563',
    backgroundColor: '#3a3450',
  },
  saveButton: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useIntervention } from '../contexts/InterventionContext';

interface RIData {
  cos: string;
  cosFrequenceOps: string;
  cosFrequenceTact: string;
  offSecu: string;
  offSecuFrequenceOps: string;
  offSecuFrequenceTact: string;
}

export default function RI() {
  const router = useRouter();
  const { data, updateData, saveIntervention } = useIntervention();
  
  const [riData, setRiData] = useState<RIData>({
    cos: (data as any).riData?.cos || '',
    cosFrequenceOps: (data as any).riData?.cosFrequenceOps || '',
    cosFrequenceTact: (data as any).riData?.cosFrequenceTact || '',
    offSecu: data.nom || '',
    offSecuFrequenceOps: (data as any).riData?.offSecuFrequenceOps || '',
    offSecuFrequenceTact: (data as any).riData?.offSecuFrequenceTact || '',
  });

  const handleSave = async () => {
    updateData('riData', riData);
    await saveIntervention();
  };

  const handleNext = async () => {
    await handleSave();
    router.push('/actions');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>📊 Organisation Opérationnelle</Text>
          <Text style={styles.subtitle}>OCT - Ordre de Commandement Tactique</Text>
        </View>

        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>
            L'OCT ne concerne que le COS et l'Officier Sécurité.{'\n'}
            Renseignez les informations de coordination tactique.
          </Text>
        </View>

        {/* COS */}
        <View style={styles.cosCard}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelTitle}>👨‍✈️ COS</Text>
            <Text style={styles.levelSubtitle}>Commandant des Opérations de Secours</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Nom/Grade COS"
            placeholderTextColor="#9ca3af"
            value={riData.cos}
            onChangeText={(text) => setRiData({ ...riData, cos: text })}
            onBlur={handleSave}
          />
          <View style={styles.frequenceRow}>
            <View style={styles.frequenceItem}>
              <Text style={styles.frequenceLabel}>Fréq. OPS:</Text>
              <TextInput
                style={styles.frequenceInputShort}
                placeholder="000"
                placeholderTextColor="#9ca3af"
                value={riData.cosFrequenceOps}
                onChangeText={(text) => {
                  if (text.length <= 3 && /^\d*$/.test(text)) {
                    setRiData({ ...riData, cosFrequenceOps: text });
                  }
                }}
                onBlur={handleSave}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
            <View style={styles.frequenceItem}>
              <Text style={styles.frequenceLabel}>Fréq. TACT:</Text>
              <TextInput
                style={styles.frequenceInputShort}
                placeholder="000"
                placeholderTextColor="#9ca3af"
                value={riData.cosFrequenceTact}
                onChangeText={(text) => {
                  if (text.length <= 3 && /^\d*$/.test(text)) {
                    setRiData({ ...riData, cosFrequenceTact: text });
                  }
                }}
                onBlur={handleSave}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
          </View>
        </View>

        {/* OFF SECU */}
        <View style={styles.offSecuCard}>
          <View style={styles.offSecuHeader}>
            <Text style={styles.offSecuTitle}>🛡️ OFF SECU</Text>
            <Text style={styles.offSecuSubtitle}>Officier Sécurité (Vous)</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Votre nom"
            placeholderTextColor="#9ca3af"
            value={riData.offSecu}
            onChangeText={(text) => setRiData({ ...riData, offSecu: text })}
            onBlur={handleSave}
          />
          <View style={styles.frequenceRow}>
            <View style={styles.frequenceItem}>
              <Text style={styles.frequenceLabel}>Fréq. OPS:</Text>
              <TextInput
                style={styles.frequenceInputShort}
                placeholder="000"
                placeholderTextColor="#9ca3af"
                value={riData.offSecuFrequenceOps}
                onChangeText={(text) => {
                  if (text.length <= 3 && /^\d*$/.test(text)) {
                    setRiData({ ...riData, offSecuFrequenceOps: text });
                  }
                }}
                onBlur={handleSave}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
            <View style={styles.frequenceItem}>
              <Text style={styles.frequenceLabel}>Fréq. TACT:</Text>
              <TextInput
                style={styles.frequenceInputShort}
                placeholder="000"
                placeholderTextColor="#9ca3af"
                value={riData.offSecuFrequenceTact}
                onChangeText={(text) => {
                  if (text.length <= 3 && /^\d*$/.test(text)) {
                    setRiData({ ...riData, offSecuFrequenceTact: text });
                  }
                }}
                onBlur={handleSave}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
          </View>
        </View>

        {/* Schéma hiérarchique */}
        <View style={styles.hierarchyCard}>
          <Text style={styles.hierarchyTitle}>🔗 Liaison OCT</Text>
          <View style={styles.hierarchyFlow}>
            <View style={styles.hierarchyBox}>
              <Text style={styles.hierarchyText}>COS</Text>
            </View>
            <Text style={styles.hierarchyArrow}>↔️</Text>
            <View style={[styles.hierarchyBox, styles.offSecuBox]}>
              <Text style={styles.hierarchyText}>OFF SECU</Text>
            </View>
          </View>
          <Text style={styles.hierarchyNote}>
            Communication directe COS ↔ Officier Sécurité
          </Text>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>💾 Sauvegarder</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>CONTINUER →</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    padding: 20,
    paddingBottom: 120,
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
  descriptionCard: {
    backgroundColor: '#3a3450',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  descriptionText: {
    fontSize: 14,
    color: '#d1d5db',
    textAlign: 'center',
    lineHeight: 22,
  },
  cosCard: {
    backgroundColor: '#4c1d95',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
  },
  offSecuCard: {
    backgroundColor: '#dc2626',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#f87171',
  },
  levelHeader: {
    marginBottom: 12,
  },
  offSecuHeader: {
    marginBottom: 12,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  offSecuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  levelSubtitle: {
    fontSize: 12,
    color: '#c4b5fd',
  },
  offSecuSubtitle: {
    fontSize: 12,
    color: '#fca5a5',
  },
  input: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#374151',
  },
  hierarchyCard: {
    backgroundColor: '#1f2937',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  hierarchyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  hierarchyFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  hierarchyBox: {
    backgroundColor: '#4c1d95',
    padding: 16,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  offSecuBox: {
    backgroundColor: '#dc2626',
  },
  hierarchyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  hierarchyArrow: {
    fontSize: 24,
    color: '#4ade80',
    marginHorizontal: 16,
  },
  hierarchyNote: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  spacer: {
    height: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    backgroundColor: '#262135',
    padding: 20,
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 2,
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
  frequenceLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
    marginBottom: 4,
  },
  frequenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  frequenceItem: {
    flex: 1,
  },
  frequenceInputShort: {
    backgroundColor: '#262135',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#4ade80',
  },
});

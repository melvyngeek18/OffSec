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
  codis: string;
  prm: string;
  pcs: string;
  cos: string;
  offSecu: string;
}

export default function RI() {
  const router = useRouter();
  const { data, updateData, saveIntervention } = useIntervention();
  
  const [riData, setRiData] = useState<RIData>({
    codis: (data as any).riData?.codis || '',
    prm: (data as any).riData?.prm || '',
    pcs: (data as any).riData?.pcs || '',
    cos: (data as any).riData?.cos || '',
    offSecu: data.nom || '',
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
          <Text style={styles.subtitle}>Responsabilité d'Intervention (RI)</Text>
        </View>

        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>
            Renseignez les informations de la chaîne de commandement pour cette intervention.
          </Text>
        </View>

        {/* CODIS */}
        <View style={styles.formCard}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>CODIS</Text>
            <Text style={styles.labelSubtitle}>Centre Opérationnel Départemental</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Nom/Référence CODIS"
            placeholderTextColor="#9ca3af"
            value={riData.codis}
            onChangeText={(text) => setRiData({ ...riData, codis: text })}
            onBlur={handleSave}
          />
        </View>

        {/* Niveau PRM */}
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelTitle}>Niveau PRM</Text>
            <Text style={styles.levelSubtitle}>Premier Responsable de Mission</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Nom/Grade PRM"
            placeholderTextColor="#9ca3af"
            value={riData.prm}
            onChangeText={(text) => setRiData({ ...riData, prm: text })}
            onBlur={handleSave}
          />
        </View>

        {/* PCS */}
        <View style={styles.formCard}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>PCS</Text>
            <Text style={styles.labelSubtitle}>Poste de Commandement</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Responsable PCS"
            placeholderTextColor="#9ca3af"
            value={riData.pcs}
            onChangeText={(text) => setRiData({ ...riData, pcs: text })}
            onBlur={handleSave}
          />
        </View>

        {/* COS */}
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelTitle}>COS</Text>
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
        </View>

        {/* OFF SECU */}
        <View style={styles.offSecuCard}>
          <View style={styles.offSecuHeader}>
            <Text style={styles.offSecuTitle}>OFF SECU</Text>
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
        </View>

        {/* Schéma hiérarchique */}
        <View style={styles.hierarchyCard}>
          <Text style={styles.hierarchyTitle}>🔼 Chaîne de Commandement</Text>
          <View style={styles.hierarchyFlow}>
            <View style={styles.hierarchyLevel}>
              <View style={styles.hierarchyBox}>
                <Text style={styles.hierarchyText}>CODIS</Text>
              </View>
              <Text style={styles.hierarchyArrow}>↓</Text>
            </View>
            
            <View style={styles.hierarchyBranch}>
              <View style={styles.hierarchySide}>
                <View style={styles.hierarchyBox}>
                  <Text style={styles.hierarchyText}>PRM</Text>
                </View>
              </View>
              <Text style={styles.hierarchyArrow}>↔</Text>
              <View style={styles.hierarchyCenter}>
                <View style={styles.hierarchyBox}>
                  <Text style={styles.hierarchyText}>PCS</Text>
                </View>
                <Text style={styles.hierarchyArrow}>↓</Text>
                <View style={styles.hierarchyBox}>
                  <Text style={styles.hierarchyText}>COS</Text>
                </View>
              </View>
              <Text style={styles.hierarchyArrow}>↔</Text>
              <View style={styles.hierarchySide}>
                <View style={[styles.hierarchyBox, styles.offSecuBox]}>
                  <Text style={styles.hierarchyText}>OFF SECU</Text>
                </View>
              </View>
            </View>
          </View>
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

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

interface PerimeterData {
  exclusion: string;
  controlle: string;
  securite: string;
  reference: string;
}

const PERIMETER_TYPES = [
  {
    label: 'Sélectionner un type',
    value: 'none',
    data: { exclusion: '', controlle: '', securite: '', reference: '' },
  },
  {
    label: 'Feu de bâtiment courant',
    value: 'feu_batiment',
    data: {
      exclusion: 'Intérieur + façades (menacées < 10–20 m)',
      controlle: '≈ 30–50 m',
      securite: '≥ 50 m',
      reference: 'GTO Feux urbains',
    },
  },
  {
    label: 'Risque général effondrement',
    value: 'effondrement',
    data: {
      exclusion: 'Hauteur du bâti × 1,5',
      controlle: 'Hauteur du bâti × 2',
      securite: '> hauteur du bâti × 2,5',
      reference: 'GDO Effondrement',
    },
  },
  {
    label: 'Accident de circulation VL',
    value: 'accident_vl',
    data: {
      exclusion: '5–10 m',
      controlle: '20–30 m',
      securite: '≥ 50 m',
      reference: 'GTO SR / AVP',
    },
  },
  {
    label: 'Accident PL / car',
    value: 'accident_pl',
    data: {
      exclusion: '10–20 m',
      controlle: '50 m',
      securite: '≥ 100 m',
      reference: 'GTO SR / AVP',
    },
  },
  {
    label: 'Feu de poids lourd',
    value: 'feu_pl',
    data: {
      exclusion: '20–30 m',
      controlle: '50–100 m',
      securite: '≥ 150 m',
      reference: 'GTO Feux de véhicules',
    },
  },
  {
    label: 'Bouteille GPL (≤ 13 kg)',
    value: 'gpl_13kg',
    data: {
      exclusion: '10–20 m',
      controlle: '50 m',
      securite: '≥ 100 m',
      reference: 'GDO Gaz',
    },
  },
  {
    label: 'Cuve GPL domestique',
    value: 'cuve_gpl',
    data: {
      exclusion: '50 m',
      controlle: '100 m',
      securite: '≥ 200 m',
      reference: 'GDO Gaz',
    },
  },
  {
    label: 'Bouteille acétylène exposée',
    value: 'acetylene',
    data: {
      exclusion: '50 m',
      controlle: '100 m',
      securite: '≥ 200 m',
      reference: 'GDO Gaz / Acétylène',
    },
  },
  {
    label: 'Feu d\'entrepôt industriel',
    value: 'entrepot',
    data: {
      exclusion: '30–50 m',
      controlle: '100 m',
      securite: '≥ 200 m',
      reference: 'GTO Feux industriels',
    },
  },
  {
    label: 'Effet BLEVE potentiel',
    value: 'bleve',
    data: {
      exclusion: '≥ 150 m',
      controlle: '300 m',
      securite: '≥ 500 m',
      reference: 'GDO Gaz / MD',
    },
  },
  {
    label: 'Silo agricole (fourrage)',
    value: 'silo_fourrage',
    data: {
      exclusion: 'Intérieur silo + m',
      controlle: '30–50 m',
      securite: '> 100 m',
      reference: 'GDO Locaux agricoles',
    },
  },
  {
    label: 'Silo à grains (poussières)',
    value: 'silo_grains',
    data: {
      exclusion: 'Intérieur + 20 m',
      controlle: '50 m',
      securite: '≥ 150 m',
      reference: 'GDO Locaux agricoles',
    },
  },
  {
    label: 'PGR - fuite sans inflammation',
    value: 'pgr_fuite',
    data: {
      exclusion: '50 m',
      controlle: '100 m',
      securite: '> 200 m',
      reference: 'GDO Gaz',
    },
  },
  {
    label: 'PGR - feu établi',
    value: 'pgr_feu',
    data: {
      exclusion: '100 m',
      controlle: '200 m',
      securite: '≥ 400 m',
      reference: 'GDO Gaz',
    },
  },
  {
    label: 'Matières dangereuses toxiques',
    value: 'md_toxiques',
    data: {
      exclusion: 'Selon AEGL 1-2',
      controlle: 'AEGL 2',
      securite: 'AEGL 3',
      reference: 'GDO MD',
    },
  },
  {
    label: 'Fuite ammoniac',
    value: 'ammoniac',
    data: {
      exclusion: '30 m',
      controlle: '60–100 m',
      securite: '≥ 150 m',
      reference: 'GTO Risques électriques',
    },
  },
  {
    label: 'Feu de transformateur',
    value: 'transformateur',
    data: {
      exclusion: '10–30 m',
      controlle: '50–100 m',
      securite: '≥ 300 m',
      reference: 'GTO FDF',
    },
  },
  {
    label: 'Feu de forêt – attaque directe',
    value: 'fdf_attaque',
    data: {
      exclusion: '≥ 50 m',
      controlle: '≥ 200 m',
      securite: '> 500 m',
      reference: 'GTO FDF',
    },
  },
];

export default function Perimeter() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('none');
  const [perimeterData, setPerimeterData] = useState<PerimeterData>({
    exclusion: '',
    controlle: '',
    securite: '',
    reference: '',
  });

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    const selected = PERIMETER_TYPES.find((type) => type.value === value);
    if (selected) {
      setPerimeterData(selected.data);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>🚧 Périmètres de Sécurité</Text>
          <Text style={styles.subtitle}>Distances règlementaires selon le risque</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Sélectionnez le type d'intervention pour obtenir les distances de périmètre adaptées.
          </Text>
        </View>

        {/* Sélecteur de type */}
        <View style={styles.selectorCard}>
          <Text style={styles.selectorTitle}>Type d'Intervention</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedType}
              onValueChange={handleTypeChange}
              style={styles.picker}
              dropdownIconColor="#fff"
            >
              {PERIMETER_TYPES.map((type) => (
                <Picker.Item key={type.value} label={type.label} value={type.value} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Résultats */}
        {selectedType !== 'none' && (
          <>
            {/* Périmètre d'exclusion (chaud) */}
            <View style={styles.exclusionCard}>
              <View style={styles.perimeterHeader}>
                <Text style={styles.perimeterIcon}>🔴</Text>
                <View style={styles.perimeterTitleContainer}>
                  <Text style={styles.perimeterTitle}>Périmètre d'Exclusion</Text>
                  <Text style={styles.perimeterSubtitle}>(Zone Chaude)</Text>
                </View>
              </View>
              <Text style={styles.perimeterValue}>{perimeterData.exclusion}</Text>
            </View>

            {/* Périmètre contrôlé (tiède) */}
            <View style={styles.controlCard}>
              <View style={styles.perimeterHeader}>
                <Text style={styles.perimeterIcon}>🟡</Text>
                <View style={styles.perimeterTitleContainer}>
                  <Text style={styles.perimeterTitle}>Périmètre Contrôlé</Text>
                  <Text style={styles.perimeterSubtitle}>(Zone Tiède)</Text>
                </View>
              </View>
              <Text style={styles.perimeterValue}>{perimeterData.controlle}</Text>
            </View>

            {/* Périmètre de sécurité (froid) */}
            <View style={styles.securityCard}>
              <View style={styles.perimeterHeader}>
                <Text style={styles.perimeterIcon}>🟢</Text>
                <View style={styles.perimeterTitleContainer}>
                  <Text style={styles.perimeterTitle}>Périmètre de Sécurité</Text>
                  <Text style={styles.perimeterSubtitle}>(Zone Froide)</Text>
                </View>
              </View>
              <Text style={styles.perimeterValue}>{perimeterData.securite}</Text>
            </View>

            {/* Référence */}
            <View style={styles.referenceCard}>
              <Text style={styles.referenceLabel}>📚 Référence:</Text>
              <Text style={styles.referenceValue}>{perimeterData.reference}</Text>
            </View>

            {/* Note importante */}
            <View style={styles.noteCard}>
              <Text style={styles.noteTitle}>⚠️ Important</Text>
              <Text style={styles.noteText}>
                Ces distances sont indicatives et doivent être adaptées selon:
              </Text>
              <Text style={styles.noteItem}>• Les conditions météorologiques</Text>
              <Text style={styles.noteItem}>• La topographie du terrain</Text>
              <Text style={styles.noteItem}>• L'évolution de la situation</Text>
              <Text style={styles.noteItem}>• L'appréciation du COS</Text>
            </View>
          </>
        )}

        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/menu')}
        >
          <Text style={styles.backButtonText}>← RETOUR MENU</Text>
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#3a3450',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#d1d5db',
    textAlign: 'center',
    lineHeight: 20,
  },
  selectorCard: {
    backgroundColor: '#3a3450',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
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
  exclusionCard: {
    backgroundColor: '#dc2626',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  controlCard: {
    backgroundColor: '#f59e0b',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  securityCard: {
    backgroundColor: '#10b981',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  perimeterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  perimeterIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  perimeterTitleContainer: {
    flex: 1,
  },
  perimeterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  perimeterSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  perimeterValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
  },
  referenceCard: {
    backgroundColor: '#3a3450',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  referenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
    marginRight: 8,
  },
  referenceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  noteCard: {
    backgroundColor: '#3a3450',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 8,
  },
  noteItem: {
    fontSize: 13,
    color: '#9ca3af',
    marginLeft: 8,
    marginBottom: 4,
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
  backButton: {
    backgroundColor: '#5a4fcf',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useIntervention } from '../contexts/InterventionContext';

interface PhotoCaptureProps {
  type: 'arrival' | 'progress' | 'end';
  title: string;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({ type, title }) => {
  const { data, addPhoto, removePhoto, saveIntervention } = useIntervention();
  const [modalVisible, setModalVisible] = useState(false);

  const photos = data.photos.filter(p => p.type === type);

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'La permission caméra est nécessaire pour prendre des photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto = {
          uri: result.assets[0].uri,
          timestamp: new Date().toLocaleString('fr-FR'),
          type: type,
          description: title,
        };
        addPhoto(newPhoto);
        await saveIntervention();
        Alert.alert('✅ Photo enregistrée', 'La photo a été ajoutée à l\'intervention.');
      }
    } catch (error) {
      console.error('Erreur capture photo:', error);
      Alert.alert('Erreur', 'Impossible de prendre la photo.');
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'La permission galerie est nécessaire.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto = {
          uri: result.assets[0].uri,
          timestamp: new Date().toLocaleString('fr-FR'),
          type: type,
          description: title,
        };
        addPhoto(newPhoto);
        await saveIntervention();
        Alert.alert('✅ Photo ajoutée', 'La photo a été ajoutée à l\'intervention.');
      }
    } catch (error) {
      console.error('Erreur sélection photo:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner la photo.');
    }
  };

  const handleRemovePhoto = (index: number) => {
    Alert.alert(
      'Supprimer la photo',
      'Voulez-vous vraiment supprimer cette photo ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            // Trouver l'index global de la photo
            const globalIndex = data.photos.findIndex(
              (p, i) => p.type === type && data.photos.filter(ph => ph.type === type).indexOf(p) === index
            );
            if (globalIndex !== -1) {
              removePhoto(globalIndex);
              await saveIntervention();
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>📷 {title}</Text>
        <Text style={styles.count}>{photos.length} photo(s)</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
          <Text style={styles.buttonText}>📸 Prendre Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
          <Text style={styles.buttonText}>🖼️ Galerie</Text>
        </TouchableOpacity>
      </View>

      {photos.length > 0 && (
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.viewButtonText}>👁️ Voir les photos ({photos.length})</Text>
        </TouchableOpacity>
      )}

      {/* Aperçu des dernières photos */}
      {photos.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewScroll}>
          {photos.slice(-3).map((photo, index) => (
            <Image
              key={index}
              source={{ uri: photo.uri }}
              style={styles.thumbnailPreview}
            />
          ))}
        </ScrollView>
      )}

      {/* Modal pour voir toutes les photos */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>✕ Fermer</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoCard}>
                <Image source={{ uri: photo.uri }} style={styles.fullImage} />
                <View style={styles.photoInfo}>
                  <Text style={styles.photoTimestamp}>📅 {photo.timestamp}</Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleRemovePhoto(index)}
                  >
                    <Text style={styles.deleteButtonText}>🗑️ Supprimer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3a3450',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  count: {
    fontSize: 14,
    color: '#4ade80',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cameraButton: {
    flex: 1,
    backgroundColor: '#5a4fcf',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  galleryButton: {
    flex: 1,
    backgroundColor: '#4b5563',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  viewButton: {
    backgroundColor: '#262135',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  viewButtonText: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: '600',
  },
  previewScroll: {
    marginTop: 12,
  },
  thumbnailPreview: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#262135',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4b5563',
    backgroundColor: '#3a3450',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  photoCard: {
    backgroundColor: '#3a3450',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  fullImage: {
    width: '100%',
    height: 250,
  },
  photoInfo: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  photoTimestamp: {
    fontSize: 14,
    color: '#9ca3af',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
    padding: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default PhotoCapture;

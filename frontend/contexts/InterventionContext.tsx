import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PhotoData {
  uri: string;
  timestamp: string;
  type: 'arrival' | 'progress' | 'end';
  description?: string;
}

interface InterventionData {
  nom: string;
  matricule: string;
  numeroIntervention: string;
  adresse: string;
  latitude: number | null;
  longitude: number | null;
  actions: { [key: string]: boolean };
  operations: { [key: string]: boolean };
  operationCategories: { [key: string]: boolean };
  risks: { [key: string]: boolean };
  ssoScore: number;
  ssoLevel: string;
  ssoRecommendation: string;
  riData: {
    codis: string;
    prm: string;
    pcs: string;
    cos: string;
    offSecu: string;
    codisOps: string;
    codisTact: string;
    prmOps: string;
    prmTact: string;
    pcsOps: string;
    pcsTact: string;
    cosOps: string;
    cosTact: string;
  };
  photos: PhotoData[];
  weatherData: {
    temperature: number | null;
    windSpeed: number | null;
    description: string;
  };
  dateIntervention: string;
}

interface InterventionContextType {
  data: InterventionData;
  updateData: (key: string, value: any) => void;
  updateActions: (key: string, value: boolean) => void;
  updateOperations: (key: string, value: boolean) => void;
  updateOperationCategories: (categories: { [key: string]: boolean }) => void;
  updateRisks: (key: string, value: boolean) => void;
  addPhoto: (photo: PhotoData) => void;
  removePhoto: (index: number) => void;
  saveIntervention: () => Promise<void>;
  loadIntervention: () => Promise<void>;
  resetIntervention: () => void;
}

const defaultData: InterventionData = {
  nom: '',
  matricule: '',
  numeroIntervention: '',
  adresse: '',
  latitude: null,
  longitude: null,
  actions: {},
  operations: {},
  operationCategories: {
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
  },
  risks: {},
  ssoScore: 0,
  ssoLevel: '',
  ssoRecommendation: '',
  riData: {
    codis: '',
    prm: '',
    pcs: '',
    cos: '',
    offSecu: '',
    codisOps: '',
    codisTact: '',
    prmOps: '',
    prmTact: '',
    pcsOps: '',
    pcsTact: '',
    cosOps: '',
    cosTact: '',
  },
  photos: [],
  weatherData: {
    temperature: null,
    windSpeed: null,
    description: '',
  },
  dateIntervention: '',
};

const InterventionContext = createContext<InterventionContextType | undefined>(undefined);

export const InterventionProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<InterventionData>(defaultData);

  useEffect(() => {
    loadIntervention();
  }, []);

  // Sauvegarde automatique quand les données changent
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (data.nom || data.matricule || data.numeroIntervention) {
        saveIntervention();
      }
    }, 1000);
    return () => clearTimeout(saveTimeout);
  }, [data]);

  const updateData = (key: string, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const updateActions = (key: string, value: boolean) => {
    setData(prev => ({
      ...prev,
      actions: { ...prev.actions, [key]: value },
    }));
  };

  const updateOperations = (key: string, value: boolean) => {
    setData(prev => ({
      ...prev,
      operations: { ...prev.operations, [key]: value },
    }));
  };

  const updateOperationCategories = (categories: { [key: string]: boolean }) => {
    setData(prev => ({
      ...prev,
      operationCategories: categories,
    }));
  };

  const updateRisks = (key: string, value: boolean) => {
    setData(prev => ({
      ...prev,
      risks: { ...prev.risks, [key]: value },
    }));
  };

  const addPhoto = (photo: PhotoData) => {
    setData(prev => ({
      ...prev,
      photos: [...prev.photos, photo],
    }));
  };

  const removePhoto = (index: number) => {
    setData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const saveIntervention = async () => {
    try {
      await AsyncStorage.setItem('currentIntervention', JSON.stringify(data));
      console.log('Intervention sauvegardée');
    } catch (error) {
      console.error('Erreur de sauvegarde:', error);
    }
  };

  const loadIntervention = async () => {
    try {
      const saved = await AsyncStorage.getItem('currentIntervention');
      if (saved) {
        const parsedData = JSON.parse(saved);
        // Fusionner avec les valeurs par défaut pour les nouvelles propriétés
        setData({ ...defaultData, ...parsedData });
      }
    } catch (error) {
      console.error('Erreur de chargement:', error);
    }
  };

  const resetIntervention = () => {
    setData(defaultData);
    AsyncStorage.removeItem('currentIntervention');
  };

  return (
    <InterventionContext.Provider
      value={{
        data,
        updateData,
        updateActions,
        updateOperations,
        updateOperationCategories,
        updateRisks,
        addPhoto,
        removePhoto,
        saveIntervention,
        loadIntervention,
        resetIntervention,
      }}
    >
      {children}
    </InterventionContext.Provider>
  );
};

export const useIntervention = () => {
  const context = useContext(InterventionContext);
  if (!context) {
    throw new Error('useIntervention must be used within InterventionProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface InterventionData {
  nom: string;
  matricule: string;
  numeroIntervention: string;
  adresse: string;
  latitude: number | null;
  longitude: number | null;
  actions: { [key: string]: boolean };
  operations: { [key: string]: boolean };
  risks: { [key: string]: boolean };
  ssoScore: number;
  ssoLevel: string;
  ssoRecommendation: string;
}

interface InterventionContextType {
  data: InterventionData;
  updateData: (key: string, value: any) => void;
  updateActions: (key: string, value: boolean) => void;
  updateOperations: (key: string, value: boolean) => void;
  updateRisks: (key: string, value: boolean) => void;
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
  risks: {},
  ssoScore: 0,
  ssoLevel: '',
  ssoRecommendation: '',
};

const InterventionContext = createContext<InterventionContextType | undefined>(undefined);

export const InterventionProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<InterventionData>(defaultData);

  useEffect(() => {
    loadIntervention();
  }, []);

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

  const updateRisks = (key: string, value: boolean) => {
    setData(prev => ({
      ...prev,
      risks: { ...prev.risks, [key]: value },
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
        setData(JSON.parse(saved));
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
        updateRisks,
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

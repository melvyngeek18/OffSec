import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useIntervention } from '../contexts/InterventionContext';

type Photo = { uri: string; name: string };
type Finding = { risk: string; evidence: string; measure: string; reference: string; confidence?: string };
type Analysis = { summary: string; findings: Finding[]; limitations?: string[] };
const ENDPOINT = process.env.EXPO_PUBLIC_OFFSEC_ANALYSIS_URL;

/** Les images ne quittent le téléphone qu'après confirmation explicite. */
export default function PhotoAnalysis() {
  const { data, setAIReport } = useIntervention();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(data.aiReport || null);
  const [busy, setBusy] = useState(false);
  const [online, setOnline] = useState(true);
  const [aiEnabled, setAiEnabled] = useState(true);
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof navigator === 'undefined') return;
    const update = () => setOnline(navigator.onLine);
    update(); window.addEventListener('online', update); window.addEventListener('offline', update);
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); };
  }, []);
  const [approved, setApproved] = useState(Boolean(data.aiReport?.validated));

  async function choose(camera: boolean) {
    const permission = camera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert('Autorisation requise', 'Autorisez la caméra ou la galerie.'); return; }
    const result = camera
      ? await ImagePicker.launchCameraAsync({ quality: 0.65, allowsEditing: false })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.65, allowsMultipleSelection: true, selectionLimit: 10 });
    if (result.canceled) return;
    setPhotos(previous => [...previous, ...result.assets.map((asset, i) => ({
      uri: asset.uri, name: asset.fileName || 'reconnaissance-' + Date.now() + '-' + i + '.jpg'
    }))].slice(0, 10));
    setAnalysis(null);
    setApproved(false);
    setAIReport(null);
  }

  async function analyze() {
    if (!aiEnabled || !online) { Alert.alert('Mode autonome', 'La reconnaissance manuelle reste disponible. Analyse IA désactivée.'); return; }
    if (!photos.length) { Alert.alert('Photos nécessaires', 'Ajoutez une ou plusieurs vues de la scène.'); return; }
    if (!ENDPOINT || !ENDPOINT.startsWith('https://')) {
      Alert.alert('Analyse IA non configurée', 'Un service sécurisé HTTPS doit être configuré par l’administrateur. Aucune image n’a été transmise.');
      return;
    }
    Alert.alert('Confirmer la transmission', 'Les photos sélectionnées seront envoyées au service IA sécurisé pour analyse. Évitez les visages et données identifiantes.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Envoyer et analyser', onPress: () => void runAnalysis() }
    ]);
  }

  async function runAnalysis() {
    setBusy(true); setAnalysis(null); setApproved(false); setAIReport(null);
    try {
      const body = new FormData();
      photos.forEach((photo, i) => body.append('photos', { uri: photo.uri, name: photo.name || 'photo-' + i + '.jpg', type: 'image/jpeg' } as any));
      body.append('context', JSON.stringify({
        intervention: data.numeroIntervention,
        checkedRisks: data.risks, checkedOperations: data.operations,
        doctrine: ['Fiche Guide OFF SECOPS v5', 'DO Soutien Opérationnel 2024 – Annexe 1']
      }));
      const response = await fetch(ENDPOINT!, { method: 'POST', body });
      if (!response.ok) throw new Error('Service indisponible (' + response.status + ')');
      const result: Analysis = await response.json();
      if (!result || typeof result.summary !== 'string' || !Array.isArray(result.findings) ||
          result.findings.some(f => !f.risk || !f.measure || !f.reference)) {
        throw new Error('Format de réponse IA invalide');
      }
      setAnalysis(result);
      setAIReport({ ...result, validated: false, analyzedAt: new Date().toISOString(), photoCount: photos.length });
    } catch (error) {
      Alert.alert('Analyse impossible', String(error instanceof Error ? error.message : error));
    } finally { setBusy(false); }
  }

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.kicker}>OFFSEC  /  RECONNAISSANCE AUGMENTÉE</Text>
        <Text style={s.title}>Analyse photographique</Text>
        <Text style={s.lead}>Croisez plusieurs vues de la scène avec les contrôles de sécurité existants.</Text>
        <TouchableOpacity style={s.secondary} onPress={() => setAiEnabled(v => !v)}><Text style={s.white}>{!online ? '● Hors réseau : analyse IA indisponible' : aiEnabled ? '● IA optionnelle activée — toucher pour désactiver' : '○ IA désactivée — toucher pour activer'}</Text></TouchableOpacity>
        <View style={s.notice}><Text style={s.noticeText}>⚠️ Aide à la décision uniquement. Une photo ne permet pas d'exclure un danger non visible. Validation terrain et information du COS indispensables.</Text></View>
        <View style={s.card}>
          <Text style={s.heading}>01  Constituer le dossier photo</Text>
          <Text style={s.muted}>{photos.length}/10 photos • vues d’ensemble, accès, énergies, engins et zones sensibles</Text>
          <View style={s.buttons}>
            <TouchableOpacity style={s.primary} onPress={() => void choose(true)}><Text style={s.white}>📷 Prendre une photo</Text></TouchableOpacity>
            <TouchableOpacity style={s.secondary} onPress={() => void choose(false)}><Text style={s.white}>＋ Galerie</Text></TouchableOpacity>
          </View>
          <View style={s.gallery}>{photos.map((photo, i) => <View key={photo.uri + i} style={s.photoWrap}><Image source={{ uri: photo.uri }} style={s.photo}/><TouchableOpacity accessibilityLabel={'Supprimer photo ' + (i + 1)} style={s.delete} onPress={() => { setPhotos(prev => prev.filter((_, j) => j !== i)); setAnalysis(null); setApproved(false); setAIReport(null); }}><Text style={s.white}>×</Text></TouchableOpacity></View>)}</View>
        </View>
        <View style={s.card}>
          <Text style={s.heading}>02  Analyser les risques</Text>
          <Text style={s.muted}>Référentiel déclaré : Fiche Guide OFF SECOPS v5 et DO Soutien Opérationnel 2024, annexe 1. Le serveur doit disposer des documents validés et renvoyer des références vérifiables.</Text>
          <TouchableOpacity style={[s.primary, (!photos.length || busy || !online || !aiEnabled) && s.disabled]} disabled={!photos.length || busy || !online || !aiEnabled} onPress={() => void analyze()}>{busy ? <ActivityIndicator color="#fff" /> : <Text style={s.white}>✦ Lancer l’analyse IA</Text>}</TouchableOpacity>
          {!ENDPOINT && <Text style={s.hint}>Module IA en attente de configuration serveur. Capture multi-photos utilisable dès maintenant.</Text>}
        </View>
        {analysis && <View style={s.card}>
          <Text style={s.heading}>03  Synthèse proposée par l’IA</Text>
          <Text style={s.lead}>{analysis.summary}</Text>
          {analysis.findings.map((f, i) => <View key={i} style={s.finding}><Text style={s.risk}>Risque {i + 1} · {f.risk}</Text><Text style={s.body}>Indice visuel : {f.evidence || 'Non précisé'}</Text><Text style={s.body}>Mesure proposée : {f.measure}</Text><Text style={s.reference}>Référence : {f.reference}</Text><Text style={s.muted}>À vérifier sur le terrain{f.confidence ? ' · Fiabilité estimée : ' + f.confidence : ''}</Text></View>)}
          {(analysis.limitations || []).map((l, i) => <Text key={i} style={s.hint}>Limite : {l}</Text>)}
          <TouchableOpacity style={s.secondary} onPress={() => { const next = !approved; setApproved(next); setAIReport({ ...analysis, validated: next, analyzedAt: data.aiReport?.analyzedAt || new Date().toISOString(), photoCount: data.aiReport?.photoCount || photos.length }); }}><Text style={s.white}>{approved ? '✓ Relecture terrain confirmée' : '□ Confirmer la relecture terrain'}</Text></TouchableOpacity>
          <Text style={s.hint}>Cette confirmation ne modifie pas automatiquement les cases métier et ne transmet pas de consigne opérationnelle.</Text>
        </View>}
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  root:{flex:1,backgroundColor:'#0B1523'},scroll:{padding:20,paddingBottom:120},kicker:{color:'#69D7DB',fontSize:11,fontWeight:'800',letterSpacing:1.5},
  title:{fontSize:30,fontWeight:'800',color:'#F8FAFC',marginTop:8},lead:{color:'#CBD5E1',fontSize:15,lineHeight:23,marginTop:12,marginBottom:12},
  notice:{backgroundColor:'#3B2B1B',borderColor:'#B97830',borderWidth:1,borderRadius:14,padding:14,marginVertical:16},noticeText:{color:'#FFE2AF',lineHeight:20},
  card:{backgroundColor:'#172639',borderRadius:18,padding:17,marginBottom:16,borderColor:'#294057',borderWidth:1},
  heading:{fontSize:17,fontWeight:'800',color:'#F8FAFC',marginBottom:10},muted:{color:'#91A5BA',fontSize:13,lineHeight:19,marginBottom:12},
  buttons:{flexDirection:'row',gap:9,marginVertical:12},primary:{backgroundColor:'#BD343B',padding:13,borderRadius:12,alignItems:'center',justifyContent:'center',flex:1},
  secondary:{backgroundColor:'#34516B',padding:13,borderRadius:12,alignItems:'center',justifyContent:'center',flex:1},disabled:{opacity:0.45},
  white:{color:'#fff',fontWeight:'700',fontSize:13},gallery:{flexDirection:'row',flexWrap:'wrap',gap:9},
  photoWrap:{position:'relative'},photo:{width:88,height:80,borderRadius:9},delete:{position:'absolute',top:3,right:3,backgroundColor:'#BD343B',borderRadius:15,width:23,height:23,alignItems:'center'},
  finding:{borderLeftWidth:3,borderLeftColor:'#F1B953',backgroundColor:'#203147',padding:12,borderRadius:8,marginVertical:6},
  risk:{color:'#F9D17D',fontWeight:'800',fontSize:15,marginBottom:6},body:{color:'#F1F5F9',lineHeight:21,marginBottom:6},
  reference:{color:'#69D7DB',fontSize:12,marginBottom:5},hint:{color:'#E6BB84',fontSize:12,lineHeight:18,marginTop:10}
});

import React, { useRef, useState } from 'react';
import { Alert, Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

export type SecurePhoto = { uri: string; name: string; safeUri?: string; reviewed?: boolean };
type Mask = { x: number; y: number };
const W = 300, H = 225, SIZE = 62;

/** Manual local redaction before any network upload. This is not automatic face recognition. */
export default function PhotoPrivacyEditor({ photo, onChange }: {
  photo: SecurePhoto; onChange: (photo: SecurePhoto) => void;
}) {
  const [masks, setMasks] = useState<Mask[]>([]);
  const area = useRef<View>(null);
  const [saving, setSaving] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [detectorMessage, setDetectorMessage] = useState('Détection locale non effectuée');
  const addMask = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const x = Math.max(0, Math.min(W - SIZE, locationX - SIZE / 2));
    const y = Math.max(0, Math.min(H - SIZE, locationY - SIZE / 2));
    setMasks(prev => [...prev, { x, y }]);
    onChange({ ...photo, safeUri: undefined, reviewed: false });
  };
  const prepareWeb = async () => {
    const img = document.createElement('img');
    img.src = photo.uri;
    await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = reject; if(img.complete && img.naturalWidth)resolve(); });
    const canvas = document.createElement('canvas');
    canvas.width = 1200; canvas.height = 900;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Impossible de retraiter la photo');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#101820';
    for (const m of masks) ctx.fillRect(m.x * 4, m.y * 4, SIZE * 4, SIZE * 4);
    // Fresh JPEG deliberately carries no original EXIF/GPS metadata.
    return canvas.toDataURL('image/jpeg', 0.85);
  };
  const prepare = async () => {
    setSaving(true);
    try {
      const safeUri = Platform.OS === 'web'
        ? await prepareWeb()
        : await captureRef(area, { format: 'jpg', quality: 0.85, result: 'tmpfile' });
      if (!safeUri) throw new Error('Image retraitée absente');
      onChange({ ...photo, safeUri, reviewed: true });
    } catch (error) {
      onChange({ ...photo, safeUri: undefined, reviewed: false });
      Alert.alert('Photo non sécurisée', 'Préparation locale impossible. Cette photo ne peut pas être envoyée.');
    } finally { setSaving(false); }
  };
  return <View style={styles.card}>
    <Text style={styles.label}>Confidentialité · {photo.reviewed && photo.safeUri ? 'Image vérifiée' : 'À vérifier'}</Text>
    <Text style={styles.hint}>Touchez chaque visage, plaque ou élément identifiable pour placer un masque opaque. Ajoutez plusieurs masques si nécessaire. Vérifiez notamment les profils et les personnes en arrière-plan.</Text>
    <Pressable onPress={addMask}>
      <View ref={area} collapsable={false} style={styles.imageArea}>
        <Image source={{ uri: photo.uri }} style={styles.image} resizeMode="stretch"/>
        {masks.map((mask, i) => <View key={i} style={[styles.mask, { left: mask.x, top: mask.y }]}/>)}
      </View>
    </Pressable>
    <Text style={styles.hint}>{detectorMessage}</Text>
    <View style={styles.row}>
      <TouchableOpacity style={styles.secondary} onPress={() => {setMasks([]);onChange({...photo,safeUri:undefined,reviewed:false});}}><Text style={styles.button}>Effacer masques</Text></TouchableOpacity>
      <TouchableOpacity style={styles.primary} disabled={saving} onPress={() => void prepare()}><Text style={styles.button}>{saving?'Traitement...':'Préparer l’image'}</Text></TouchableOpacity>
    </View>
    {photo.reviewed && photo.safeUri && <View><Text style={styles.confirm}>✓ Version retraitée produite localement. Vérifiez l’aperçu ci-dessous.</Text><Image source={{uri:photo.safeUri}} style={styles.image} resizeMode="stretch"/></View>}
  </View>;
}
const styles = StyleSheet.create({
  card:{padding:12,backgroundColor:'#203147',borderRadius:12,marginVertical:8,alignItems:'center'},
  label:{color:'#fff',fontWeight:'700',marginBottom:8},hint:{color:'#C7D5E5',fontSize:12,lineHeight:18,marginBottom:9},
  imageArea:{width:W,height:H,backgroundColor:'#0D1724'},image:{width:W,height:H},
  mask:{width:SIZE,height:SIZE,backgroundColor:'#101820',position:'absolute',borderWidth:2,borderColor:'#FFE07B'},
  row:{flexDirection:'row',gap:9,marginTop:10},secondary:{padding:12,backgroundColor:'#405A71',borderRadius:8},primary:{padding:12,backgroundColor:'#BA343C',borderRadius:8},
  button:{color:'#fff',fontWeight:'700',fontSize:12},confirm:{color:'#7DE0B3',fontSize:12,marginVertical:10}
});

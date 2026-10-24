import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useIntervention } from '../contexts/InterventionContext';

const modules = [
  { icon:'🌤️', title:'Météo', path:'/weather', color:'#0B447C' },
  { icon:'👥', title:'Organisation RI', path:'/ri', color:'#0B447C' },
  { icon:'☑️', title:'Actions', path:'/actions', color:'#0B447C' },
  { icon:'⚙️', title:'Mesures opérationnelles', path:'/operations', color:'#0B447C' },
  { icon:'⚠️', title:'Zones à risques', path:'/risks', color:'#0B447C' },
  { icon:'🛡️', title:'Périmètres', path:'/perimeter', color:'#0B447C' },
  { icon:'🩺', title:'SSO', path:'/sso', color:'#0B447C' },
  { icon:'📸', title:'Analyse photo IA', path:'/photo-analysis', color:'#0B447C' },
  { icon:'📄', title:'Synthèse et rapport', path:'/summary', color:'#0B447C' },
];
export default function Home() {
  const router=useRouter();
  const {data,updateData,saveIntervention}=useIntervention();
  const [showForm,setShowForm]=useState(false);
  const [nom,setNom]=useState(data.nom||'');
  const [matricule,setMatricule]=useState(data.matricule||'');
  const [numero,setNumero]=useState(data.numeroIntervention||'');
  const [adresse,setAdresse]=useState(data.adresse||'');
  const [position,setPosition]=useState<{latitude:number;longitude:number}|null>(null);
  const [loading,setLoading]=useState(false);
  const gps=async()=>{
    setLoading(true);
    try{
      const permission=await Location.requestForegroundPermissionsAsync();
      if(permission.status!=='granted'){Alert.alert('Localisation','Autorisation GPS refusée.');return;}
      const coords=(await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Balanced})).coords;
      setPosition({latitude:coords.latitude,longitude:coords.longitude});
      try{const a=await Location.reverseGeocodeAsync(coords);if(a.length)setAdresse([a[0].streetNumber,a[0].street,a[0].city].filter(Boolean).join(' '));}catch{}
    }catch{Alert.alert('GPS indisponible','Vous pouvez saisir l’adresse manuellement.');}
    finally{setLoading(false);}
  };
  const start=async()=>{
    if(!nom.trim()||!matricule.trim()||!numero.trim()){Alert.alert('Champs requis','Nom, matricule et numéro d’intervention obligatoires.');return;}
    updateData('nom',nom);updateData('matricule',matricule);updateData('numeroIntervention',numero);updateData('adresse',adresse);
    if(position){updateData('latitude',position.latitude);updateData('longitude',position.longitude);}
    await saveIntervention();
    router.push('/weather');
  };
  return <ScrollView style={s.root} contentContainerStyle={s.content}>
    <View style={s.brand}><View style={s.shield}><Text style={s.shieldText}>🔥</Text></View><View style={{flex:1}}><Text style={s.logo}>OffSec</Text><Text style={s.sub}>Aide à la décision de l’officier sécurité</Text></View><View style={s.status}><Text style={s.statusText}>● Local</Text></View></View>
    <View style={s.hero}>
      <ImageBackground source={require('../assets/images/icon.png')} imageStyle={{opacity:0.13,resizeMode:'contain'}} style={s.heroInner}>
        <Text style={s.heroEyebrow}>TABLEAU DE BORD OPÉRATIONNEL</Text>
        <Text style={s.heroTitle}>Bienvenue sur OffSec</Text>
        <Text style={s.heroDesc}>Reconnaissance, suivi des risques et mesures de sécurité au même endroit.</Text>
        <TouchableOpacity accessibilityRole="button" style={s.primary} onPress={()=>setShowForm(!showForm)}><Text style={s.primaryText}>{showForm?'− Fermer la saisie':'+ Nouvelle intervention'}</Text></TouchableOpacity>
      </ImageBackground>
    </View>
    {showForm&&<View style={s.form}>
      <Text style={s.sectionTitle}>Nouvelle intervention</Text>
      <TextInput style={s.input} placeholder="Nom de l’officier *" placeholderTextColor="#8EA4BF" value={nom} onChangeText={setNom}/>
      <TextInput style={s.input} placeholder="Matricule *" placeholderTextColor="#8EA4BF" value={matricule} onChangeText={setMatricule}/>
      <TextInput style={s.input} placeholder="Numéro d’intervention *" placeholderTextColor="#8EA4BF" value={numero} onChangeText={setNumero}/>
      <TextInput style={s.input} placeholder="Adresse" placeholderTextColor="#8EA4BF" value={adresse} onChangeText={setAdresse}/>
      <TouchableOpacity style={s.secondary} onPress={()=>void gps()} disabled={loading}><Text style={s.secondaryText}>{loading?'Recherche GPS…':'📍 Renseigner par GPS'}</Text></TouchableOpacity>
      <TouchableOpacity style={s.primary} onPress={()=>void start()}><Text style={s.primaryText}>Enregistrer et démarrer →</Text></TouchableOpacity>
    </View>}
    <Text style={s.sectionTitle}>Modules opérationnels</Text>
    <View style={s.grid}>{modules.map(item=><TouchableOpacity accessibilityRole="button" key={item.path} style={s.tile} onPress={()=>router.push(item.path as any)}>
      <Text style={s.tileIcon}>{item.icon}</Text><Text style={s.tileLabel}>{item.title}</Text>
    </TouchableOpacity>)}</View>
    <View style={s.notice}><Text style={s.noticeText}>🛡️ Fonctionnement local prioritaire. Analyse IA facultative, sous réserve de configuration et de validation des photos.</Text></View>
  </ScrollView>;
}
const s=StyleSheet.create({
  root:{flex:1,backgroundColor:'#07192D'},content:{padding:16,paddingBottom:90,maxWidth:900,width:'100%',alignSelf:'center'},
  brand:{flexDirection:'row',alignItems:'center',marginBottom:18,gap:11},shield:{width:45,height:51,backgroundColor:'#183955',borderWidth:2,borderColor:'#E2EAF6',borderRadius:14,alignItems:'center',justifyContent:'center'},shieldText:{fontSize:23},
  logo:{fontWeight:'900',fontSize:31,color:'#FFFFFF'},sub:{color:'#AFC8E2',fontSize:11},status:{backgroundColor:'#113E37',paddingVertical:6,paddingHorizontal:8,borderRadius:20},statusText:{color:'#66E1AE',fontSize:11,fontWeight:'700'},
  hero:{borderRadius:17,overflow:'hidden',backgroundColor:'#073C6E',borderWidth:1,borderColor:'#1763A4',marginBottom:22},heroInner:{padding:20,minHeight:185,justifyContent:'center'},heroEyebrow:{color:'#5FE0F0',fontWeight:'700',fontSize:11,letterSpacing:1},heroTitle:{color:'white',fontSize:25,fontWeight:'900',marginTop:8},heroDesc:{color:'#DBE9F7',fontSize:13,lineHeight:20,marginTop:7,marginBottom:16},
  primary:{backgroundColor:'#087EFF',paddingVertical:13,paddingHorizontal:16,borderRadius:9,alignItems:'center'},primaryText:{color:'#FFFFFF',fontSize:15,fontWeight:'800'},
  sectionTitle:{fontSize:18,fontWeight:'800',color:'#FFFFFF',marginBottom:13},grid:{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:22},
  tile:{width:'48%',minHeight:90,flexGrow:1,backgroundColor:'#0C3458',borderWidth:1,borderColor:'#1B567C',borderRadius:12,padding:12,justifyContent:'center'},tileIcon:{fontSize:25,marginBottom:7},tileLabel:{color:'#FFFFFF',fontWeight:'700',fontSize:13},
  notice:{backgroundColor:'#102A43',padding:15,borderRadius:12,borderWidth:1,borderColor:'#274A6A'},noticeText:{color:'#C5D7E9',fontSize:12,lineHeight:18},
  form:{backgroundColor:'#0D2D4D',padding:15,borderRadius:12,marginBottom:18,gap:10,borderWidth:1,borderColor:'#28608E'},input:{backgroundColor:'#061E36',color:'#FFFFFF',borderRadius:8,padding:13,borderWidth:1,borderColor:'#315A7E'},secondary:{borderWidth:1,borderColor:'#3A85C1',borderRadius:8,padding:12,alignItems:'center'},secondaryText:{color:'#C6E7FF',fontWeight:'700'}
});
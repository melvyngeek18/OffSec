import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, StyleSheet, Platform, Alert, useWindowDimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { captureRef } from 'react-native-view-shot';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import { useIntervention, SitacAnnotation, SitacPoint, SitacVersion } from '../contexts/InterventionContext';

const CW=1000, CH=750;
const palette=[{name:'Danger',value:'#EF4444'},{name:'Vigilance',value:'#FBBF24'},{name:'Contrôlée',value:'#22C55E'},{name:'Info',value:'#3B82F6'}];
const makeId=()=>Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
const pointStr=(points:SitacPoint[])=>points.map(p=>p.x+','+p.y).join(' ');

export function SitacDrawing({imageUri,annotations}: {imageUri:string;annotations:SitacAnnotation[]}) {
  return <View style={{width:'100%',height:'100%'}}>
    <Image source={{uri:imageUri}} resizeMode="stretch" style={StyleSheet.absoluteFillObject}/>
    <Svg width="100%" height="100%" viewBox={`0 0 ${CW} ${CH}`} style={StyleSheet.absoluteFillObject}>
      {annotations.map(a=>{
        const p=a.points[0],q=a.points[a.points.length-1];
        if(!p)return null;
        if(a.kind==='zone'&&a.points.length>=3)return <React.Fragment key={a.id}>
          <Polygon points={pointStr(a.points)} fill={a.color} fillOpacity={0.25} stroke={a.color} strokeWidth={8}/>
          <SvgText x={p.x+10} y={Math.max(35,p.y-14)} fill="#FFFFFF" stroke="#172639" strokeWidth={2} paintOrder="stroke" fontSize={31} fontWeight="bold">{a.label||'Zone'}</SvgText>
        </React.Fragment>;
        if(a.kind==='arrow'&&q&&p!==q){
          const ang=Math.atan2(q.y-p.y,q.x-p.x), wing=38;
          const l={x:q.x-wing*Math.cos(ang-0.6),y:q.y-wing*Math.sin(ang-0.6)};
          const r={x:q.x-wing*Math.cos(ang+0.6),y:q.y-wing*Math.sin(ang+0.6)};
          return <React.Fragment key={a.id}><Line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={a.color} strokeWidth={10}/>
            <Polygon points={pointStr([l,q,r])} fill={a.color} stroke={a.color} strokeWidth={7}/></React.Fragment>;
        }
        if(a.kind==='text')return <SvgText key={a.id} x={p.x} y={p.y} fill={a.color} stroke="#081827" strokeWidth={1.5} paintOrder="stroke" fontSize={35} fontWeight="bold">{a.label||'Repère'}</SvgText>;
        if(a.kind==='symbol')return <React.Fragment key={a.id}><Circle cx={p.x} cy={p.y} r={32} fill="#0B1523" stroke={a.color} strokeWidth={6}/><SvgText x={p.x} y={p.y+13} textAnchor="middle" fill={a.color} fontWeight="bold" fontSize={36}>{a.label||'!'}</SvgText></React.Fragment>;
        return null;
      })}
    </Svg>
  </View>;
}
async function stableImage(uri:string) {
  if(Platform.OS==='web'){
    // Store a resized, EXIF-free JPEG for offline use. Large original files must not fill local storage.
    const image=new window.Image();
    image.src=uri;
    await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=reject;if(image.complete&&image.naturalWidth)resolve();});
    const canvas=document.createElement('canvas');
    const scale=Math.min(1,1400/Math.max(image.naturalWidth,image.naturalHeight));
    canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));
    canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
    canvas.getContext('2d')!.drawImage(image,0,0,canvas.width,canvas.height);
    return canvas.toDataURL('image/jpeg',0.62);
  }
  const root=FileSystem.documentDirectory+'offsec-sitac/';
  await FileSystem.makeDirectoryAsync(root,{intermediates:true});
  const dest=root+makeId()+'.jpg';
  await FileSystem.copyAsync({from:uri,to:dest});
  return dest;
}
async function webSnapshot(uri:string, annotations:SitacAnnotation[]){
  const img=new window.Image();img.src=uri;
  await new Promise<void>((resolve,reject)=>{img.onload=()=>resolve();img.onerror=reject;if(img.complete&&img.naturalWidth)resolve();});
  const canvas=document.createElement('canvas');canvas.width=CW;canvas.height=CH;
  const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas indisponible');
  ctx.drawImage(img,0,0,CW,CH);
  ctx.lineJoin='round';
  for(const a of annotations){
    const p=a.points[0],q=a.points[a.points.length-1];if(!p)continue;
    ctx.strokeStyle=a.color;ctx.fillStyle=a.color;ctx.lineWidth=8;
    if(a.kind==='zone'&&a.points.length>=3){
      ctx.beginPath();ctx.moveTo(p.x,p.y);a.points.slice(1).forEach(x=>ctx.lineTo(x.x,x.y));ctx.closePath();
      ctx.globalAlpha=.25;ctx.fill();ctx.globalAlpha=1;ctx.stroke();
    }else if(a.kind==='arrow'&&q){
      const ang=Math.atan2(q.y-p.y,q.x-p.x);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();
      ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(q.x-38*Math.cos(ang-.6),q.y-38*Math.sin(ang-.6));ctx.lineTo(q.x-38*Math.cos(ang+.6),q.y-38*Math.sin(ang+.6));ctx.closePath();ctx.fill();
    }else if(a.kind==='symbol'){
      ctx.beginPath();ctx.arc(p.x,p.y,32,0,Math.PI*2);ctx.fillStyle='#0B1523';ctx.fill();ctx.stroke();ctx.fillStyle=a.color;ctx.font='bold 35px sans-serif';ctx.textAlign='center';ctx.fillText(a.label||'!',p.x,p.y+12);
    }
    if(a.kind==='text'||a.kind==='zone'){ctx.font='bold 33px sans-serif';ctx.textAlign='left';ctx.strokeStyle='#07192D';ctx.lineWidth=3;const x=p.x+10,y=a.kind==='zone'?Math.max(35,p.y-14):p.y;ctx.strokeText(a.label||'Zone',x,y);ctx.fillStyle=a.color;ctx.fillText(a.label||'Zone',x,y);}
  }
  return canvas.toDataURL('image/jpeg',0.8);
}

export default function SitacEditor() {
  const {data,addSitacVersion,deleteSitacVersion}=useIntervention();
  const versions=data.sitacs||[];
  const {width}=useWindowDimensions();
  const viewWidth=Math.min(width-32,800);
  const [background,setBackground]=useState<string>('');
  const [annotations,setAnnotations]=useState<SitacAnnotation[]>([]);
  const [draft,setDraft]=useState<SitacPoint[]>([]);
  const [tool,setTool]=useState<'zone'|'arrow'|'text'|'symbol'>('zone');
  const [color,setColor]=useState('#EF4444');
  const [title,setTitle]=useState('SITAC '+new Date().toLocaleDateString('fr-FR'));
  const [label,setLabel]=useState('Zone');
  const [busy,setBusy]=useState(false);
  const ref=useRef<View>(null);
  const [size,setSize]=useState({w:viewWidth,h:viewWidth*.75});
  const selectImage=async(camera:boolean)=>{
    try{
      if(camera){
        const p=await ImagePicker.requestCameraPermissionsAsync();if(!p.granted)return Alert.alert('Caméra','Autorisation nécessaire');
      }else{
        const p=await ImagePicker.requestMediaLibraryPermissionsAsync();if(!p.granted&&Platform.OS!=='web')return Alert.alert('Galerie','Autorisation nécessaire');
      }
      const r=camera?await ImagePicker.launchCameraAsync({quality:.65,exif:false}):await ImagePicker.launchImageLibraryAsync({quality:.65,exif:false});
      if(!r.canceled&&r.assets[0]){
        setBusy(true);
        setBackground(await stableImage(r.assets[0].uri));
        setAnnotations([]);setDraft([]);
      }
    }catch(e){Alert.alert('Photo SITAC',String(e));}finally{setBusy(false);}
  };
  const tap=(e:any)=>{
    if(!background)return;
    const n=e.nativeEvent;
    const x=Math.max(0,Math.min(CW,Math.round(n.locationX/size.w*CW)));
    const y=Math.max(0,Math.min(CH,Math.round(n.locationY/size.h*CH)));
    const p={x,y};
    if(tool==='zone'){setDraft(prev=>[...prev,p]);return;}
    if(tool==='arrow'&&draft.length===0){setDraft([p]);return;}
    const points=tool==='arrow'?[draft[0],p]:[p];
    setAnnotations(prev=>[...prev,{id:makeId(),kind:tool,color,points,label:label.trim()||undefined}]);
    setDraft([]);
  };
  const finishZone=()=>{
    if(draft.length<3){Alert.alert('Zonage','Positionnez au moins 3 points.');return;}
    setAnnotations(prev=>[...prev,{id:makeId(),kind:'zone',color,points:[...draft],label:label.trim()||'Zone'}]);
    setDraft([]);
  };
  const save=async()=>{
    if(!background){Alert.alert('SITAC','Ajoutez une photo.');return;}
    if(draft.length){Alert.alert('Tracé inachevé','Terminez le polygone ou annulez le dernier tracé.');return;}
    setBusy(true);
    try{
      let imageUri:string|undefined;
      if(Platform.OS==='web'){imageUri=await webSnapshot(background,annotations);}
      else {
        const tmp=await captureRef(ref,{format:'jpg',quality:.85,result:'tmpfile'});
        const root=FileSystem.documentDirectory+'offsec-sitac/';
        await FileSystem.makeDirectoryAsync(root,{intermediates:true});
        imageUri=root+makeId()+'-annotated.jpg';
        await FileSystem.copyAsync({from:tmp,to:imageUri});
      }
      addSitacVersion({id:makeId(),createdAt:new Date().toISOString(),title:title.trim()||'SITAC',backgroundUri:background,annotations:annotations.map(a=>({...a,points:[...a.points]})),imageUri});
      Alert.alert('SITAC enregistrée','Version ajoutée à l’historique de l’intervention.');
    }catch(e){Alert.alert('Enregistrement impossible',String(e));}
    finally{setBusy(false);}
  };
  const restore=(v:SitacVersion)=>{setBackground(v.backgroundUri);setAnnotations(v.annotations.map(a=>({...a,points:[...a.points]})));setTitle(v.title+' — mise à jour');setDraft([]);};
  return <ScrollView style={s.root} contentContainerStyle={s.body}>
    <Text style={s.heading}>🗺️ SITAC photographique</Text>
    <Text style={s.hint}>Photographiez une SITAC papier ou importez son image. Dessinez et historisez les zones, flèches, textes et symboles. Tout reste local.</Text>
    <View style={s.row}><TouchableOpacity style={s.button} onPress={()=>void selectImage(true)}><Text style={s.white}>📷 Prendre photo</Text></TouchableOpacity><TouchableOpacity style={s.button} onPress={()=>void selectImage(false)}><Text style={s.white}>＋ Importer image</Text></TouchableOpacity></View>
    <TextInput style={s.input} placeholder="Nom de la version" placeholderTextColor="#9EB3CA" value={title} onChangeText={setTitle}/>
    <View style={s.row}>{(['zone','arrow','text','symbol'] as const).map((t)=><TouchableOpacity key={t} style={[s.tool,tool===t&&s.selected]} onPress={()=>{setTool(t);setDraft([]);}}><Text style={s.white}>{({zone:'Zone',arrow:'Flèche',text:'Texte',symbol:'Symbole'})[t]}</Text></TouchableOpacity>)}</View>
    <View style={s.row}>{palette.map(p=><TouchableOpacity key={p.value} onPress={()=>setColor(p.value)} style={[s.color,{backgroundColor:p.value},color===p.value&&s.colorSelected]} accessibilityLabel={p.name}><Text style={{color:'#081827',fontWeight:'900'}}>{color===p.value?'✓':''}</Text></TouchableOpacity>)}</View>
    <TextInput style={s.input} placeholder="Libellé zone, texte ou symbole (ex. FPT, COS, !)" placeholderTextColor="#9EB3CA" value={label} onChangeText={setLabel}/>
    <View style={[s.canvas,{width:viewWidth,height:viewWidth*.75}]} onLayout={e=>setSize({w:e.nativeEvent.layout.width,h:e.nativeEvent.layout.height})}>
      <View ref={ref} collapsable={false} style={StyleSheet.absoluteFillObject}>{background?<SitacDrawing imageUri={background} annotations={annotations}/>:<View style={s.empty}><Text style={s.hint}>Ajoutez une photo ou un plan SITAC</Text></View>}</View>
      <View onStartShouldSetResponder={()=>Boolean(background)} onResponderRelease={tap} style={StyleSheet.absoluteFillObject}/>
      {draft.map((p,i)=><View key={i} pointerEvents="none" style={{position:'absolute',width:10,height:10,borderRadius:5,backgroundColor:color,left:p.x/1000*size.w-5,top:p.y/750*size.h-5}}/>)}
    </View>
    <Text style={s.hint}>Zone : touchez chaque sommet puis « Fermer zone ». Flèche : deux points. Texte / symbole : un point. Les couleurs ne sont pas des périmètres réglementaires prévalidés.</Text>
    <View style={s.row}><TouchableOpacity style={s.button} onPress={finishZone}><Text style={s.white}>Fermer zone</Text></TouchableOpacity><TouchableOpacity style={s.button} onPress={()=>{if(draft.length)setDraft(p=>p.slice(0,-1));else setAnnotations(p=>p.slice(0,-1));}}><Text style={s.white}>↶ Annuler</Text></TouchableOpacity><TouchableOpacity style={s.button} onPress={()=>setDraft([])}><Text style={s.white}>Effacer tracé</Text></TouchableOpacity></View>
    <TouchableOpacity style={[s.save,busy&&{opacity:.4}]} disabled={busy} onPress={()=>void save()}><Text style={s.white}>{busy?'Traitement…':'💾 Enregistrer nouvelle version SITAC'}</Text></TouchableOpacity>
    <Text style={s.subhead}>Historique — {versions.length} version(s)</Text>
    {[...versions].reverse().map(v=><View key={v.id} style={s.history}><View style={{flex:1}}><Text style={s.white}>{v.title}</Text><Text style={s.hint}>{new Date(v.createdAt).toLocaleString('fr-FR')} • {v.annotations.length} annotation(s)</Text></View><TouchableOpacity style={s.tool} onPress={()=>restore(v)}><Text style={s.white}>Modifier</Text></TouchableOpacity><TouchableOpacity style={s.tool} onPress={()=>Alert.alert('Supprimer la SITAC','Supprimer cette version de l’historique ?', [{text:'Annuler',style:'cancel'},{text:'Supprimer',style:'destructive',onPress:()=>deleteSitacVersion(v.id)}])}><Text style={s.white}>✕</Text></TouchableOpacity></View>)}
  </ScrollView>;
}
const s=StyleSheet.create({
 root:{flex:1,backgroundColor:'#0B1523'},body:{padding:16,paddingBottom:95,maxWidth:850,width:'100%',alignSelf:'center'},
 heading:{fontSize:26,fontWeight:'900',color:'#F8FAFC',marginBottom:10},subhead:{fontSize:19,fontWeight:'800',color:'#FFFFFF',marginTop:22,marginBottom:8},
 hint:{color:'#B8CCE0',fontSize:12,lineHeight:19,marginBottom:9},row:{flexDirection:'row',gap:7,flexWrap:'wrap',marginBottom:12},
 button:{backgroundColor:'#194669',padding:11,borderRadius:9,flexGrow:1,alignItems:'center'},tool:{backgroundColor:'#194669',paddingVertical:9,paddingHorizontal:12,borderRadius:9},selected:{backgroundColor:'#087EFF'},
 white:{color:'#FFFFFF',fontWeight:'700',fontSize:12},color:{height:35,flex:1,borderRadius:7,alignItems:'center',justifyContent:'center'},colorSelected:{borderWidth:3,borderColor:'#FFFFFF'},
 input:{backgroundColor:'#122D49',color:'#FFFFFF',padding:12,borderRadius:8,marginBottom:12},canvas:{backgroundColor:'#18344F',overflow:'hidden',borderRadius:8,marginBottom:12},
 empty:{flex:1,alignItems:'center',justifyContent:'center'},save:{backgroundColor:'#087EFF',padding:15,alignItems:'center',borderRadius:9,marginTop:12},
 history:{backgroundColor:'#18344F',padding:11,borderRadius:9,flexDirection:'row',alignItems:'center',gap:9,marginBottom:9}
});

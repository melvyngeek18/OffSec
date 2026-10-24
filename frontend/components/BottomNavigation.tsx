import React from 'react';
import {View,Text,TouchableOpacity,StyleSheet} from 'react-native';
import {useRouter,usePathname} from 'expo-router';
const items=[
  {name:'Accueil',icon:'⌂',path:'/'},
  {name:'Météo',icon:'☀',path:'/weather'},
  {name:'Actions',icon:'☑',path:'/actions'},
  {name:'SSO',icon:'✚',path:'/sso'},
  {name:'Plus',icon:'•••',path:'/menu'},
];
export default function BottomNavigation(){
  const router=useRouter(),pathname=usePathname();
  return <View style={s.bar}>{items.map(item=><TouchableOpacity key={item.path} accessibilityRole="button" accessibilityLabel={item.name} onPress={()=>router.push(item.path as any)} style={s.item}>
    <Text style={[s.icon,pathname===item.path&&s.active]}>{item.icon}</Text>
    <Text style={[s.text,pathname===item.path&&s.active]}>{item.name}</Text>
  </TouchableOpacity>)}</View>;
}
const s=StyleSheet.create({
 bar:{flexDirection:'row',backgroundColor:'#06192E',borderTopWidth:1,borderTopColor:'#19436B',paddingBottom:7,paddingTop:8,paddingHorizontal:3},
 item:{flex:1,alignItems:'center',justifyContent:'center',paddingVertical:3},
 icon:{color:'#A9BDD1',fontSize:20,fontWeight:'800'},text:{color:'#A9BDD1',fontSize:10,fontWeight:'700',marginTop:3},
 active:{color:'#168CFF'}
});

import React, { useEffect } from 'react';
import { Platform } from 'react-native';
export default function PwaSetup(){
  useEffect(()=>{
    if(Platform.OS!=='web'||typeof window==='undefined') return;
    let link=document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
    if(!link){link=document.createElement('link');link.rel='manifest';link.href='/OffSec/manifest.webmanifest';document.head.appendChild(link);}
    let theme=document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if(!theme){theme=document.createElement('meta');theme.name='theme-color';document.head.appendChild(theme);}
    theme.content='#0B1523';
    if('serviceWorker' in navigator&&window.isSecureContext){
      navigator.serviceWorker.register('/OffSec/offsec-sw.js', {scope:'/OffSec/'} ).catch(e=>console.warn('Service worker non actif',e));
    }
  },[]);
  return null;
}
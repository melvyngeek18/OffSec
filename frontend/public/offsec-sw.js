/* Cache static export on install and cache-first navigation after first online load.
   Never cache API responses, images of incidents or sensitive report data. */
const CACHE='offsec-pwa-v1';
const OFFLINE='/OffSec/offline.html';
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(['/OffSec/',OFFLINE,'/OffSec/manifest.webmanifest'])).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('offsec-pwa-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
  const url=new URL(req.url);
  if(url.pathname.startsWith('/api/')||url.pathname.includes('/analyze'))return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(response=>{
      if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(req,copy));}
      return response;
    }).catch(()=>caches.match(req).then(r=>r||caches.match('/OffSec/')||caches.match(OFFLINE))));
    return;
  }
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(response=>{
    if(response.ok&&['script','style','font','image'].includes(req.destination)){
      const copy=response.clone();caches.open(CACHE).then(c=>c.put(req,copy));
    }
    return response;
  })));
});
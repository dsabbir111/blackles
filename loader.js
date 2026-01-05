(async()=>{
const d=location.hostname.replace('www.','').replace(/\./g,'_');
const DB="https://bhai-rk-default-rtdb.firebaseio.com";

const site=await fetch(`${DB}/sites/${d}.json`).then(r=>r.json());

if(!site){
 document.body.innerHTML="Unauthorized Domain";
 return;
}

if(site.expiry && new Date(site.expiry)<new Date()){
 document.body.innerHTML="Expired";
 return;
}

if(site.active!==true){
 document.body.innerHTML=site.message||"Disabled";
 return;
}

if(site.lock){
 document.body.innerHTML=site.message||"Maintenance";
 return;
}

(site.css||[]).forEach(u=>{
 let l=document.createElement('link');
 l.rel='stylesheet';l.href=u;document.head.appendChild(l);
});

(site.js||[]).forEach(u=>{
 let s=document.createElement('script');
 s.src=u;s.defer=true;document.head.appendChild(s);
});

if(site.security?.rightClick===false){
 document.addEventListener('contextmenu',e=>e.preventDefault());
}
if(site.security?.copy===false){
 document.addEventListener('copy',e=>e.preventDefault());
}
})();

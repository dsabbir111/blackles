(async function(){
const d = location.hostname.replace('www.','').replace(/\./g,'_');
const DB = "https://bhai-rk-default-rtdb.firebaseio.com";

const res = await fetch(`${DB}/sites/${d}.json`);
const site = await res.json();

if(!site || site.active!==true){
  location.href="https://google.com";
  return;
}

if(site.lock){
  document.documentElement.innerHTML = site.message || "Locked";
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
})();

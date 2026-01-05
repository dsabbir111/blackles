(async function(){
 const DB="https://bhai-rk-default-rtdb.firebaseio.com";
 const host=location.hostname.replace(/^www\./,'');
 const key=host.replace(/\./g,'_');

 let site=await fetch(`${DB}/sites/${key}.json`).then(r=>r.json());

 /* AUTO ADD */
 if(!site){
  await fetch(`${DB}/sites/${key}.json`,{
   method:"PUT",
   body:JSON.stringify({
    status:"pending",
    usage:0,
    lock:false,
    features:{rightClick:false,copyPaste:false,devTools:false},
    cdn:"global"
   })
  });
  return; // pending → no apply
 }

 /* USAGE */
 fetch(`${DB}/sites/${key}/usage.json`,{
  method:"PUT",
  body:JSON.stringify((site.usage||0)+1)
 });

 /* STATUS CHECK */
 if(site.status!=="approved") return;
 if(site.lock){
  document.body.innerHTML="<h1 style='text-align:center'>Site Locked</h1>";
  return;
 }

 /* FEATURES */
 if(site.features.rightClick){
  document.addEventListener("contextmenu",e=>e.preventDefault());
 }
 if(site.features.copyPaste){
  ["copy","cut","paste"].forEach(e=>{
   document.addEventListener(e,x=>x.preventDefault());
  });
 }

 /* CDN */
 let cdn=await fetch(`${DB}/cdn/${site.cdn}.json`).then(r=>r.json());
 cdn?.css?.forEach(u=>{
  let l=document.createElement("link");
  l.rel="stylesheet";l.href=u;document.head.appendChild(l);
 });
 cdn?.js?.forEach(u=>{
  let s=document.createElement("script");
  s.src=u;s.defer=true;document.head.appendChild(s);
 });
})();

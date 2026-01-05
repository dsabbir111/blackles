<script>
(async()=>{
  const DB="https://bhai-rk-default-rtdb.firebaseio.com";

  let host=location.hostname.toLowerCase().replace(/^www\./,'');
  let key=host.replace(/\./g,'_');

  const site=await fetch(`${DB}/sites/${key}.json`).then(r=>r.json());

  if(!site){
    document.body.innerHTML="<h2 style='color:red'>Unauthorized Domain</h2>";
    return;
  }

  /* STATUS COLORS (admin side only) */

  if(site.active!==true){
    document.body.innerHTML=site.message||"Site Disabled";
    return;
  }

  if(site.lock){
    document.body.innerHTML=site.message||"Maintenance Mode";
    return;
  }

  /* CSS LOAD */
  (site.css||[]).forEach(u=>{
    let l=document.createElement("link");
    l.rel="stylesheet";l.href=u;
    document.head.appendChild(l);
  });

  /* JS LOAD */
  (site.js||[]).forEach(u=>{
    let s=document.createElement("script");
    s.src=u;s.defer=true;
    document.head.appendChild(s);
  });

  /* SECURITY */
  if(site.security?.rightClick===false)
    document.addEventListener("contextmenu",e=>e.preventDefault());

  if(site.security?.copy===false)
    document.addEventListener("copy",e=>e.preventDefault());

})();
</script>

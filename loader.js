(async()=>{
  const DB="https://bhai-rk-default-rtdb.firebaseio.com";

  let host=location.hostname.toLowerCase().replace(/^www\./,'');
  let key=host.replace(/\./g,'_');
  let url=`${DB}/sites/${key}.json`;

  let site=await fetch(url).then(r=>r.json());

  /* AUTO DOMAIN ADD */
  if(site===null){
    await fetch(url,{
      method:"PUT",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        domain:host,
        active:false,
        lock:true,
        expiry:"",
        allowedCountries:[],
        css:[],
        js:[],
        usage:0,
        security:{},
        createdAt:Date.now()
      })
    });
    document.body.innerHTML="<h2>Domain registered. Waiting approval.</h2>";
    return;
  }

  /* EXPIRY CHECK */
  if(site.expiry){
    let now=new Date().toISOString().split("T")[0];
    if(now>site.expiry){
      document.body.innerHTML="License Expired";
      return;
    }
  }

  /* COUNTRY CHECK (lightweight API-less trick) */
  if(site.allowedCountries && site.allowedCountries.length){
    let c = Intl.DateTimeFormat().resolvedOptions().timeZone.split("/")[0];
    if(!site.allowedCountries.includes(c)){
      document.body.innerHTML="Not available in your region";
      return;
    }
  }

  /* STATUS CHECK */
  if(site.active!==true || site.lock){
    document.body.innerHTML=site.message||"Site Disabled";
    return;
  }

  /* CDN CSS (browser cache reuse) */
  (site.css||[]).forEach(u=>{
    if(!document.querySelector(`link[href="${u}"]`)){
      let l=document.createElement("link");
      l.rel="stylesheet";l.href=u;
      document.head.appendChild(l);
    }
  });

  /* CDN JS (load once) */
  (site.js||[]).forEach(u=>{
    if(!document.querySelector(`script[src="${u}"]`)){
      let s=document.createElement("script");
      s.src=u;s.defer=true;
      document.head.appendChild(s);
    }
  });

})();

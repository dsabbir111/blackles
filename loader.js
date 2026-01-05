(async function(){
  const DB="https://bhai-rk-default-rtdb.firebaseio.com";
  const host=location.hostname.replace(/^www\./,'');
  const key=host.replace(/\./g,'_');

  // Fetch site data
  let site=await fetch(`${DB}/sites/${key}.json`).then(r=>r.json());

  if(!site){
    // Auto-add site (pending)
    await fetch(`${DB}/sites/${key}.json`,{
      method:"PUT",
      body:JSON.stringify({
        status:"pending",
        lock:true,
        plan:"FREE",
        licenseKey:null,
        usage:0,
        views:0,
        lastVisit:null,
        countryAllow: ["BD","IN"],
        features:{rightClick:true,copyPaste:true,devTools:false},
        cdn:{css:[],js:[]}
      })
    });
    document.body.innerHTML="<h2 style='text-align:center'>Site pending approval</h2>";
    return;
  }

  // License check
  if(!site.licenseKey || site.status!=="approved"){
    document.body.innerHTML="<h1 style='text-align:center'>Site Locked / Invalid License</h1>";
    return;
  }

  // Country check
  const userCountry = "BD"; // Example, integrate GeoIP later
  if(site.countryAllow && !site.countryAllow.includes(userCountry)){
    document.body.innerHTML="<h1 style='text-align:center'>Access Denied</h1>";
    return;
  }

  // Auto rules: usage limit
  if(site.usage>10000){
    await fetch(`${DB}/sites/${key}/lock.json`,{method:"PUT",body:"true"});
    document.body.innerHTML="<h1 style='text-align:center'>Site Locked: Usage Limit</h1>";
    return;
  }

  // Update usage & views
  await fetch(`${DB}/sites/${key}/usage.json`,{method:"PUT",body:JSON.stringify((site.usage||0)+1)});
  await fetch(`${DB}/sites/${key}/views.json`,{method:"PUT",body:JSON.stringify((site.views||0)+1)});
  await fetch(`${DB}/sites/${key}/lastVisit.json`,{method:"PUT",body:JSON.stringify(Date.now())});

  // Features
  if(site.features.rightClick){
    document.addEventListener("contextmenu",e=>e.preventDefault());
  }
  if(site.features.copyPaste){
    ["copy","cut","paste"].forEach(e=>document.addEventListener(e,x=>x.preventDefault()));
  }
  if(site.features.devTools){
    document.onkeydown=e=>{if(e.key==="F12")e.preventDefault();}
  }

  // Load CDN
  (site.cdn?.css||[]).forEach(url=>{
    if(!document.querySelector(`link[href="${url}"]`)){
      let l=document.createElement("link"); l.rel="stylesheet"; l.href=url; document.head.appendChild(l);
    }
  });
  (site.cdn?.js||[]).forEach(url=>{
    if(!document.querySelector(`script[src="${url}"]`)){
      let s=document.createElement("script"); s.src=url; s.defer=true; document.head.appendChild(s);
    }
  });

})();

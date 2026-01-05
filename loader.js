(async function(){
  const DB="https://bhai-rk-default-rtdb.firebaseio.com";
  const host=location.hostname.replace(/^www\./,'');
  const key=host.replace(/\./g,'_');

  let site=await fetch(`${DB}/sites/${key}.json`).then(r=>r.json());

  if(!site){
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
        countryAllow:["BD","IN"],
        features:{rightClick:true,copyPaste:true,devTools:false,customCSS:false,customJS:false},
        cdn:{css:[],js:[]},
        expiry:new Date(Date.now()+365*24*60*60*1000).toISOString(),
        domains:[host]
      })
    });
    document.body.innerHTML="<h2 style='text-align:center'>Site pending approval</h2>";
    return;
  }

  // Domain check & redirect
  if(!site.domains.includes(host)){
    window.location.href="https://example.com/redirect";
    return;
  }

  // License / expiry / lock check
  const now=new Date();
  if(!site.licenseKey || site.status!="approved" || site.lock || new Date(site.expiry)<now){
    document.body.innerHTML="<h1 style='text-align:center'>Site Locked / Invalid License / Expired</h1>";
    return;
  }

  // Country check (example)
  const userCountry="BD";
  if(site.countryAllow && !site.countryAllow.includes(userCountry)){
    document.body.innerHTML="<h1 style='text-align:center'>Access Denied</h1>";
    return;
  }

  // Update usage & views
  await fetch(`${DB}/sites/${key}/usage.json`,{method:"PUT",body:JSON.stringify((site.usage||0)+1)});
  await fetch(`${DB}/sites/${key}/views.json`,{method:"PUT",body:JSON.stringify((site.views||0)+1)});
  await fetch(`${DB}/sites/${key}/lastVisit.json`,{method:"PUT",body:JSON.stringify(Date.now())});

  // Features
  if(site.features.rightClick){ document.addEventListener("contextmenu",e=>e.preventDefault()); }
  if(site.features.copyPaste){ ["copy","cut","paste"].forEach(e=>document.addEventListener(e,x=>x.preventDefault())); }
  if(site.features.devTools){ document.onkeydown=e=>{if(e.key==="F12")e.preventDefault();} }

  // CDN load with plan delay
  const delay = site.plan==='FREE'?2000:site.plan==='PRO'?1000:0;
  setTimeout(()=>{
    (site.cdn?.css||[]).forEach(url=>{
      if(!document.querySelector(`link[href='${url}']`)){
        let l=document.createElement('link'); l.rel='stylesheet'; l.href=url; document.head.appendChild(l);
      }
    });
    (site.cdn?.js||[]).forEach(url=>{
      if(!document.querySelector(`script[src='${url}']`)){
        let s=document.createElement('script'); s.src=url; s.defer=true; document.head.appendChild(s);
      }
    });
  },delay);
})();

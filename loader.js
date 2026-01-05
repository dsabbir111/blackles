(async()=>{
  const DB="https://bhai-rk-default-rtdb.firebaseio.com";

  let host = location.hostname.toLowerCase().replace(/^www\./,'');
  let key  = host.replace(/\./g,'_');

  const url = `${DB}/sites/${key}.json`;

  let res = await fetch(url);
  let site = await res.json();

  /* ========= AUTO DOMAIN REGISTER (FIXED) ========= */
  if(site === null){
    await fetch(url,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        domain: host,
        active: false,
        lock: true,
        message: "Pending Approval",
        css: [],
        js: [],
        usage: 0,
        security: {
          rightClick: true,
          copy: true,
          select: true,
          antiInspect: false
        },
        createdAt: Date.now()
      })
    });

    document.body.innerHTML = `
      <h2 style="text-align:center;margin-top:20%">
        Domain registered successfully.<br>
        Waiting for admin approval.
      </h2>`;
    return;
  }
  /* =============================================== */

  /* USAGE COUNT */
  fetch(`${url.replace('.json','')}/usage.json`)
  .then(r=>r.json())
  .then(n=>{
    fetch(`${url.replace('.json','')}/usage.json`,{
      method:"PUT",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify((n||0)+1)
    });
  });

  /* STATUS CHECK */
  if(site.active !== true){
    document.body.innerHTML = site.message || "Site Disabled";
    return;
  }

  if(site.lock){
    document.body.innerHTML = site.message || "Maintenance";
    return;
  }

  /* LOAD CSS */
  (site.css || []).forEach(u=>{
    let l=document.createElement("link");
    l.rel="stylesheet";
    l.href=u;
    document.head.appendChild(l);
  });

  /* LOAD JS */
  (site.js || []).forEach(u=>{
    let s=document.createElement("script");
    s.src=u;
    s.defer=true;
    document.head.appendChild(s);
  });

})();

<script>
(async()=>{
  const DB="https://bhai-rk-default-rtdb.firebaseio.com";

  let host=location.hostname.toLowerCase().replace(/^www\./,'');
  let key=host.replace(/\./g,'_');

  let site = await fetch(`${DB}/sites/${key}.json`).then(r=>r.json());

  /* AUTO DOMAIN REGISTER */
  if(!site){
    await fetch(`${DB}/sites/${key}.json`,{
      method:"PUT",
      body:JSON.stringify({
        active:false,
        lock:true,
        message:"Pending Approval",
        css:[],
        js:[],
        usage:0,
        security:{}
      })
    });
    document.body.innerHTML="<h2>Domain Registered. Waiting approval.</h2>";
    return;
  }

  /* USAGE COUNT */
  fetch(`${DB}/sites/${key}/usage.json`)
  .then(r=>r.json())
  .then(n=>{
    fetch(`${DB}/sites/${key}/usage.json`,{
      method:"PUT",
      body:JSON.stringify((n||0)+1)
    });
  });

  /* STATUS CHECK */
  if(site.active!==true){
    document.body.innerHTML=site.message||"Site Disabled";
    return;
  }
  if(site.lock){
    document.body.innerHTML=site.message||"Maintenance";
    return;
  }

  /* LOAD CSS */
  (site.css||[]).forEach(u=>{
    let l=document.createElement("link");
    l.rel="stylesheet";l.href=u;
    document.head.appendChild(l);
  });

  /* LOAD JS */
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

  if(site.security?.select===false)
    document.addEventListener("selectstart",e=>e.preventDefault());

  /* ANTI INSPECT */
  if(site.security?.antiInspect){
    setInterval(()=>{
      if(
        window.outerWidth-window.innerWidth>160 ||
        window.outerHeight-window.innerHeight>160
      ){
        document.body.innerHTML="<h1>Blocked</h1>";
      }
    },800);
  }
})();
</script>

// loader.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = { apiKey:"AIzaSyADfP94rjFgDem0FA0LqRhNoPX2Y0R1efk", projectId:"bhai-rk" };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const site = location.hostname;
const token = document.currentScript.getAttribute("data-token");
const ref = doc(db,"sites",site);

(async()=>{
  let snap = await getDoc(ref);
  if(!snap.exists()){
    await setDoc(ref,{enabled:true,maintenance:false,css:"",js:"",views:0,lastSeen:Date.now(),token:token});
  }
  const c = (await getDoc(ref)).data();
  if(!c.enabled || c.token!==token) return;
  updateDoc(ref,{views:increment(1),lastSeen:Date.now()});
  if(c.css){ const l=document.createElement("link"); l.rel="stylesheet"; l.href=c.css; document.head.appendChild(l); }
  if(c.js){ const s=document.createElement("script"); s.src=c.js; s.defer=true; document.head.appendChild(s); }
})();

'use strict';
/* Suivi sport — Navigation, photos, météo, actions et démarrage */
/* ---------- Rendu et navigation ---------- */
const route=()=>{const r=location.hash.replace('#/','')||'home';return V[r]?r:'home'};
function render(anim){const r=route(),a=$('#app');a.innerHTML=V[r]();if(anim){a.classList.remove('view');void a.offsetWidth;a.classList.add('view');window.scrollTo(0,0)}
$('#navIn').innerHTML=[['home','home','Accueil'],['planning','cal','Planning'],['seance','plus',''],['progression','chart','Progression'],['reglages','gear','Réglages']].map(n=>n[0]==='seance'?`<button class="add" data-act="sessNew" aria-label="Nouvelle séance">${ic('plus',26)}</button>`:`<button class="${r===n[0]?'on':''}" data-go="${n[0]}">${ic(n[1],22)}${n[2]}</button>`).join('');
after();if(r==='home')loadWeather()}
function after(root=document){requestAnimationFrame(()=>requestAnimationFrame(()=>{$$('svg.chart',root).forEach(s=>s.classList.add('play'));$$('.pb i',root).forEach(i=>i.style.width=i.dataset.w+'%')}));
$$('.cnt',root).forEach(el=>{const to=+el.dataset.to,dec=+(el.dataset.dec||0),t0=performance.now();(function st(t){const p=Math.min((t-t0)/800,1),e=1-Math.pow(1-p,3);el.textContent=(to*e).toFixed(dec).replace('.',',');if(p<1)requestAnimationFrame(st)})(t0)})}
const go=r=>{if(route()===r)render(true);else location.hash='#/'+r};
window.addEventListener('hashchange',()=>{closeSheet();render(true)});
function sheet(html){$('#sheetBody').innerHTML=html;$('#sheet').hidden=false;after($('#sheet'))}
function closeSheet(){camStop();$('#sheet').hidden=true;$('#sheetBody').innerHTML=''}
const refresh=()=>{save();render(false)};
function partial(){const y=window.scrollY;render(false);window.scrollTo(0,y)}

/* ---------- Photos (IndexedDB) ---------- */
let DB=null,P=[];
const idb=()=>new Promise((res,rej)=>{const r=indexedDB.open('suivi-sport-photos',1);r.onupgradeneeded=()=>r.result.createObjectStore('photos',{keyPath:'id'});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
const tx=(mode,f)=>new Promise((res,rej)=>{if(!DB)return rej(new Error('db'));const t=DB.transaction('photos',mode),rq=f(t.objectStore('photos'));t.oncomplete=()=>res(rq&&rq.result);t.onerror=()=>rej(t.error)});
const shrink=file=>new Promise((res,rej)=>{const img=new Image(),u=URL.createObjectURL(file);img.onload=()=>{const k=Math.min(1,1400/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',.82))};img.onerror=rej;img.src=u});

/* ---------- Météo ---------- */
function wxInfo(c){if(c===0)return['sun','Ensoleillé'];if(c<=2)return['cloud','Peu nuageux'];if(c===3)return['cloud','Nuageux'];if(c<=48)return['cloud','Brouillard'];if(c<=67)return['rain','Pluie'];if(c<=77)return['snow','Neige'];if(c<=82)return['rain','Averses'];if(c<=86)return['snow','Neige'];return['bolt','Orage']}
async function loadWeather(){const el=$('#wx'),loc=S.settings.loc;if(!el)return;if(!loc){el.innerHTML=`<button class="link" data-go="reglages">Activer la météo</button>`;return}
const k=loc.lat+','+loc.lon;let c=null;try{c=JSON.parse(localStorage.getItem('suivi-sport-wx'))}catch(e){}
if(!c||c.k!==k||Date.now()-c.t>18e5){try{const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,weather_code&timezone=auto`),j=await r.json();
c={k,t:Date.now(),temp:j.current.temperature_2m,code:j.current.weather_code};localStorage.setItem('suivi-sport-wx',JSON.stringify(c))}catch(e){if(!c||c.k!==k){if($('#wx'))$('#wx').innerHTML='<span class="xs mut">Météo indisponible</span>';return}}}
const w=wxInfo(c.code),e2=$('#wx');if(e2)e2.innerHTML=`<div class="ac row" style="justify-content:flex-end;gap:5px;font-size:18px;font-weight:600">${ic(w[0])} ${Math.round(c.temp)}°C</div><div class="xs mut">${w[1]}, ${esc(loc.label)}</div>`}

/* ---------- Actions ---------- */
const A={
closeSheet,
tip(el){const b=el.closest('.cbox');if(b)$('.tip',b).textContent=el.dataset.tip},
jokerInfo(){const e=$('#jk');e.classList.remove('bump');void e.offsetWidth;e.classList.add('bump');toast('2 jokers par mois, utilisés si une semaine est manquée')},
homeChart(el){ui.homeChart=el.dataset.v;partial()},
month(el){const d=pd(ui.month+'-01');d.setMonth(d.getMonth()+ +el.dataset.v);ui.month=iso(d).slice(0,7);partial()},
histBack(){history.length>1?history.back():go('home')},
progM(el){ui.progM=el.dataset.v;partial()},musP(el){ui.musP=+el.dataset.v;partial()},bodyM(el){ui.bodyM=el.dataset.v;partial()},
/* séances types */
progEdit(el){const p=progById(el.dataset.id)||{id:'',name:'',exIds:[]},by=Object.fromEntries(groupEx());
sheet(`<h2>${p.id?'Modifier la séance type':'Nouvelle séance type'}</h2><label>Nom</label><input type="text" id="pName" value="${esc(p.name)}" placeholder="Pec jambes"><label>Exercices</label>
${Object.keys(by).map(m=>`<details ${by[m].some(e=>p.exIds.includes(e.id))?'open':''}><summary><span>${esc(m)}</span><span class="mut sm">${by[m].length}</span></summary>${by[m].map(e=>`<label class="row" style="color:#fff;font-size:14px;margin:6px 0"><input type="checkbox" class="pEx" value="${e.id}" ${p.exIds.includes(e.id)?'checked':''}> ${esc(e.name)}</label>`).join('')}</details>`).join('')}
<button class="btn full" data-act="progSave" data-id="${p.id}" style="margin-top:14px">Enregistrer</button>${p.id?`<button class="btn dg full" data-act="progDel" data-id="${p.id}" style="margin-top:8px">Supprimer</button>`:''}`)},
progSave(el){const name=$('#pName').value.trim();if(!name)return toast('Donne un nom à la séance');const exIds=$$('.pEx:checked').map(c=>c.value);
const p=progById(el.dataset.id);if(p){p.name=name;p.exIds=exIds}else S.programmes.push({id:uid(),name,exIds});closeSheet();refresh()},
progDel(el){if(!confirm('Supprimer cette séance type ? Le planning passera en repos pour ces jours.'))return;S.programmes=S.programmes.filter(p=>p.id!==el.dataset.id);S.template=S.template.map(t=>t===el.dataset.id?null:t);closeSheet();refresh()},
/* pauses */
/* saisie de toute la semaine type en une fois */
weekFill(){const fut=Object.keys(S.overrides).filter(d=>d>=today()).length;
sheet(`<h2>Ma semaine type</h2><div class="sm mut" style="margin-bottom:6px">Écris la séance de chaque jour. Laisse vide pour un jour de repos. Elle s'appliquera à toutes les semaines, ce mois-ci et les suivants.</div>
<datalist id="progList">${S.programmes.map(p=>`<option value="${esc(p.name)}">`).join('')}</datalist>
${DAYS.map((n,i)=>`<label>${n}</label><input type="text" class="wF" data-i="${i}" list="progList" value="${esc(progName(S.template[i]))}" placeholder="Repos" autocomplete="off">`).join('')}
${fut?`<label class="row" style="color:#fff;font-size:14px;margin:14px 0 0"><input type="checkbox" id="wReset"> Annuler aussi mes ${fut} changement(s) ponctuel(s) à venir</label>`:''}
<button class="btn full" data-act="weekSave" style="margin-top:16px">${ic('check',18)} Appliquer à toutes les semaines</button>`)},
weekSave(){const created=[];
S.template=$$('.wF').map(inp=>{const n=inp.value.trim().replace(/\s+/g,' ');if(!n||/^repos$/i.test(n))return null;
let p=S.programmes.find(x=>x.name.toLowerCase()===n.toLowerCase());if(!p){p={id:uid(),name:n,exIds:[]};S.programmes.push(p);created.push(n)}return p.id});
const r=$('#wReset');if(r&&r.checked)Object.keys(S.overrides).forEach(d=>{if(d>=today())delete S.overrides[d]});
closeSheet();refresh();const k=S.template.filter(Boolean).length;
toast(`Semaine enregistrée : ${k} séance${k>1?'s':''} par semaine`)},
pauseAdd(){sheet(`<h2>Nouvelle pause</h2><label>Motif</label><input type="text" id="paL" placeholder="Vacances"><div class="g2"><div><label>Du</label><input type="date" id="paF" value="${today()}"></div><div><label>Au</label><input type="date" id="paT" value="${addD(today(),6)}"></div></div><button class="btn full" data-act="pauseSave" style="margin-top:14px">Enregistrer</button>`)},
pauseSave(){const f=$('#paF').value,t=$('#paT').value;if(!f||!t||t<f)return toast('Vérifie les dates');S.pauses.push({id:uid(),from:f,to:t,label:$('#paL').value.trim()});closeSheet();refresh()},
pauseDel(el){S.pauses=S.pauses.filter(p=>p.id!==el.dataset.id);refresh()},
/* jour du calendrier */
dayOpen(el){const d=el.dataset.d,p=planFor(d),ss=S.sessions.filter(s=>s.date===d),ov=d in S.overrides?S.overrides[d]:'';
sheet(`<h2 style="text-transform:capitalize">${fr(d,{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</h2><div class="sm mut" style="margin-bottom:10px">${p.paused?'Période de pause.':p.prog?'Prévu : '+esc(progName(p.prog))+(progMuscles(p.prog)?' ('+esc(progMuscles(p.prog))+')':''):'Jour de repos.'}</div>
${ss.map(s=>`<button class="li" data-act="sessEdit" data-id="${s.id}"><span class="ac">${ic('check',18)}</span><span class="grow">${esc(s.name||'Séance')} · ${sessSets(s)} séries</span>${ic('next',18)}</button>`).join('')}
<button class="btn full" data-act="sessNew" data-d="${d}" data-p="${p.prog||''}" style="margin:10px 0 4px">${ic('plus',18)} Saisir ${ss.length?'une autre séance':'la séance'}</button>
${S.programmes.length?`<label>Ce jour-là uniquement</label><select data-chg="dayOver" data-d="${d}">${opt('','Suivre la semaine type',ov)}${opt('rest','Repos',ov)}${S.programmes.map(x=>opt(x.id,x.name,ov)).join('')}</select>`:''}`)},
/* séances */
sessNew(el){ui.draft=newDraft(el.dataset.d,el.dataset.p);closeSheet();go('seance')},
sessEdit(el){const s=S.sessions.find(x=>x.id===el.dataset.id);if(!s)return;ui.draft=JSON.parse(JSON.stringify(s));closeSheet();go('seance')},
setAdd(el){const it=ui.draft.items[+el.dataset.i];it.sets.push({kg:(it.sets[it.sets.length-1]||{}).kg??null,reps:null});partial()},
setDel(el){ui.draft.items[+el.dataset.i].sets.splice(+el.dataset.s,1);partial()},
setSame(el){const it=ui.draft.items[+el.dataset.i],ls=lastSets(it.exId,ui.draft.date,ui.draft.id);if(ls){it.sets=ls.map(x=>({kg:x.kg,reps:x.reps}));partial()}},
itemDel(el){ui.draft.items.splice(+el.dataset.i,1);partial()},
sessSave(){const d=ui.draft;if(!d.date)return toast('Choisis une date');const before=streak().done;
const items=d.items.map(it=>({exId:it.exId,sets:it.sets.filter(x=>x.reps>0).map(x=>({kg:x.kg||0,reps:x.reps}))})).filter(it=>it.sets.length);
const s={id:d.id||uid(),date:d.date,progId:d.progId,name:(d.name||'').trim()||'Séance',rpe:+d.rpe||null,duration:d.duration,note:d.note,items};
const i=S.sessions.findIndex(x=>x.id===s.id);if(i>=0)S.sessions[i]=s;else S.sessions.push(s);save();ui.draft=null;
const st=streak();toast(!before&&st.done?`Objectif de la semaine atteint : ${st.n} semaine${st.n>1?'s':''} de suite`:'Séance enregistrée');location.hash='#/home'},
sessDel(){if(!confirm('Supprimer cette séance ?'))return;S.sessions=S.sessions.filter(x=>x.id!==ui.draft.id);save();ui.draft=null;location.hash='#/seances'},
/* exercices */
exAdd(){sheet(`<h2>Nouvel exercice</h2><label>Nom</label><input type="text" id="exN" placeholder="Développé haltères"><label>Muscle principal</label><select id="exM">${MUS.map(m=>opt(m,m)).join('')}</select><button class="btn full" data-act="exSave" style="margin-top:14px">Ajouter</button>`)},
exSave(){const n=$('#exN').value.trim();if(!n)return toast("Donne un nom à l'exercice");S.exercises.push({id:uid(),name:n,muscle:$('#exM').value});closeSheet();refresh()},
exDel(el){const id=el.dataset.id;if(S.sessions.some(s=>s.items.some(i=>i.exId===id)))return toast('Exercice utilisé dans des séances : suppression impossible');
S.exercises=S.exercises.filter(e=>e.id!==id);S.programmes.forEach(p=>p.exIds=p.exIds.filter(e=>e!==id));const y=window.scrollY;save();partial();window.scrollTo(0,y)},
/* corps */
bodyAdd(el){const b=S.body.find(x=>x.id===el.dataset.id)||{id:'',date:today()};
sheet(`<h2>${b.id?'Modifier le relevé':'Nouveau relevé'}</h2><label>Date</label><input type="date" id="bD" value="${b.date}"><div class="g2">${Object.keys(METRICS).map(k=>`<div><label>${METRICS[k][0]} (${METRICS[k][1]})</label><input type="text" inputmode="decimal" class="bF" data-k="${k}" value="${b[k]??''}"></div>`).join('')}</div>
<div class="xs mut" style="margin-top:8px">Remplis seulement ce que tu as mesuré.</div><button class="btn full" data-act="bodySave" data-id="${b.id}" style="margin-top:14px">Enregistrer</button>${b.id?`<button class="btn dg full" data-act="bodyDel" data-id="${b.id}" style="margin-top:8px">Supprimer</button>`:''}`)},
bodySave(el){const b={id:el.dataset.id||uid(),date:$('#bD').value};let any=false;$$('.bF').forEach(i=>{const v=num(i.value);if(v!=null){b[i.dataset.k]=v;any=true}});
if(!b.date||!any)return toast('Entre au moins une mesure');const i=S.body.findIndex(x=>x.id===b.id);if(i>=0)S.body[i]=b;else S.body.push(b);syncNutri();closeSheet();refresh();toast('Relevé enregistré')},
bodyDel(el){S.body=S.body.filter(x=>x.id!==el.dataset.id);closeSheet();refresh()},
/* photos */
photoAdd(){ui.photoDraft=null;sheet(`<h2>Nouvelle photo</h2><input type="file" accept="image/*" id="phF" data-chg="photoPick" hidden><button class="btn gh full" data-act="photoChoose">Prendre ou choisir une photo</button><div id="phPrev" style="margin-top:10px"></div>
<div class="g2"><div><label>Date</label><input type="date" id="phD" value="${today()}"></div><div><label>Pose</label><select id="phP">${['Face','Profil','Dos','Autre'].map(x=>opt(x,x)).join('')}</select></div></div>
<label>Note</label><input type="text" id="phN" placeholder="Poids du jour, remarque…"><button class="btn full" data-act="photoSave" style="margin-top:14px">Enregistrer</button>`)},
photoChoose(){$('#phF').click()},
async photoSave(){if(!ui.photoDraft)return toast("Choisis d'abord une photo");const p={id:uid(),date:$('#phD').value||today(),pose:$('#phP').value,note:$('#phN').value.trim(),data:ui.photoDraft};
try{await tx('readwrite',s=>s.put(p));P.push(p);ui.photoDraft=null;closeSheet();render(false);toast('Photo enregistrée')}catch(e){toast("Impossible d'enregistrer la photo")}},
photoOpen(el){const p=P.find(x=>x.id===el.dataset.id);if(!p)return;sheet(`<img src="${p.data}" alt="" style="width:100%;border-radius:12px;display:block"><div class="row sp" style="margin-top:10px"><div><div>${fr(p.date,{day:'numeric',month:'long',year:'numeric'})}${p.pose?' · '+esc(p.pose):''}</div><div class="sm mut">${esc(p.note)}</div></div><button class="btn s dg" data-act="photoDel" data-id="${p.id}">Supprimer</button></div>`)},
async photoDel(el){if(!confirm('Supprimer cette photo ?'))return;try{await tx('readwrite',s=>s.delete(el.dataset.id))}catch(e){}P=P.filter(x=>x.id!==el.dataset.id);closeSheet();render(false)},
/* objectifs */
goalEdit(el){const g=S.goals.find(x=>x.id===el.dataset.id);ui.goalDraft=g?Object.assign({},g):{id:'',title:'',type:'charge',exId:(exWithData()[0]||S.exercises[0]||{}).id,metric:'taille',start:'',target:'',deadline:'',current:'',unit:''};goalSheet()},
goalSave(){readGoal();const g=ui.goalDraft;g.start=num(g.start);g.target=num(g.target);g.current=num(g.current);if(g.target==null)return toast('Indique une cible');
if(g.start==null){const c=goalCur(g);g.start=c==null?0:c}
if(!g.title.trim())g.title=g.type==='charge'?exName(g.exId)+' '+fn(g.target)+' kg':g.type==='poids'?'Poids '+fn(g.target)+' kg':g.type==='mens'?METRICS[g.metric][0]+' '+fn(g.target)+' cm':'Objectif';
if(g.id){S.goals[S.goals.findIndex(x=>x.id===g.id)]=g}else{g.id=uid();S.goals.push(g)}closeSheet();refresh()},
goalDel(){S.goals=S.goals.filter(x=>x.id!==ui.goalDraft.id);closeSheet();refresh()},
/* réglages */
accent(el){S.settings.accent=el.dataset.v;applyAccent();refresh()},
goalMode(el){S.settings.goalMode=el.dataset.v;refresh()},
async citySearch(){const q=$('#city').value.trim();if(!q)return;try{const r=await fetch('https://geocoding-api.open-meteo.com/v1/search?count=1&language=fr&name='+encodeURIComponent(q)),j=await r.json();
if(!j.results||!j.results.length)return toast('Ville introuvable');const x=j.results[0];S.settings.loc={lat:+x.latitude.toFixed(3),lon:+x.longitude.toFixed(3),label:x.name};refresh();toast('Météo activée pour '+x.name)}catch(e){toast('Recherche impossible hors ligne')}},
geo(){if(!navigator.geolocation)return toast('Position indisponible');navigator.geolocation.getCurrentPosition(p=>{S.settings.loc={lat:+p.coords.latitude.toFixed(3),lon:+p.coords.longitude.toFixed(3),label:'ma position'};refresh();toast('Météo activée')},()=>toast('Position refusée'))},
wxOff(){S.settings.loc=null;refresh()},
export(){doExport($('#expPh').checked)},
importPick(){$('#impF').click()},
async reset(){if(!confirm('Effacer toutes les données et les photos ? Cette action est définitive.'))return;localStorage.removeItem(KEY);try{await tx('readwrite',s=>s.clear())}catch(e){}P=[];S=def();applyAccent();refresh();toast('Données effacées')}
};
function readGoal(){const g=ui.goalDraft,v=id=>{const e=$('#'+id);return e?e.value:undefined};['title','type','exId','metric','start','target','deadline','current','unit'].forEach(k=>{const x=v('g_'+k);if(x!==undefined)g[k]=x})}
function goalSheet(){const g=ui.goalDraft,c=goalCur(g);
sheet(`<h2>${g.id?"Modifier l'objectif":'Nouvel objectif'}</h2><label>Type</label><select id="g_type" data-chg="goalType">${opt('charge','Charge sur un exercice',g.type)}${opt('poids','Poids du corps',g.type)}${opt('mens','Mensuration',g.type)}${opt('libre','Objectif libre',g.type)}</select>
${g.type==='charge'?`<label>Exercice</label><select id="g_exId" data-chg="goalType">${S.exercises.map(e=>opt(e.id,e.name,g.exId)).join('')}</select>`:''}
${g.type==='mens'?`<label>Mesure</label><select id="g_metric" data-chg="goalType">${Object.keys(METRICS).filter(k=>k!=='poids').map(k=>opt(k,METRICS[k][0],g.metric)).join('')}</select>`:''}
<label>Intitulé (facultatif)</label><input type="text" id="g_title" value="${esc(g.title)}" placeholder="Développé couché 80 kg">
<div class="g2"><div><label>Départ</label><input type="text" inputmode="decimal" id="g_start" value="${g.start??''}" placeholder="${c==null?'0':c}"></div><div><label>Cible</label><input type="text" inputmode="decimal" id="g_target" value="${g.target??''}"></div></div>
${g.type==='libre'?`<div class="g2"><div><label>Valeur actuelle</label><input type="text" inputmode="decimal" id="g_current" value="${g.current??''}"></div><div><label>Unité</label><input type="text" id="g_unit" value="${esc(g.unit||'')}" placeholder="km, tractions…"></div></div>`:`<div class="xs mut" style="margin-top:8px">${c==null?'La valeur actuelle sera lue dans tes séances ou relevés.':'Valeur actuelle : '+fn(c)+' '+goalUnit(g)+' (mise à jour automatique).'}</div>`}
<label>Date limite</label><input type="date" id="g_deadline" value="${g.deadline||''}"><button class="btn full" data-act="goalSave" style="margin-top:14px">Enregistrer</button>${g.id?`<button class="btn dg full" data-act="goalDel" style="margin-top:8px">Supprimer</button>`:''}`)}
const C={
homeEx(el){ui.homeEx=el.value;partial()},progEx(el){ui.progEx=el.value;partial()},cmpA(el){ui.cmpA=el.value;partial()},cmpB(el){ui.cmpB=el.value;partial()},
tpl(el){S.template[+el.dataset.i]=el.value||null;save();partial()},
dayOver(el){const d=el.dataset.d;if(el.value==='')delete S.overrides[d];else S.overrides[d]=el.value;save();closeSheet();partial();toast('Planning mis à jour')},
draftProg(el){const d=ui.draft;ui.draft=newDraft(d.date,el.value);ui.draft.duration=d.duration;partial()},
itemAdd(el){if(!el.value)return;const ls=lastSets(el.value,ui.draft.date,ui.draft.id);ui.draft.items.push({exId:el.value,sets:(ls||[{},{},{}]).map(()=>({kg:null,reps:null}))});partial()},
set(el){const f=el.dataset.f;if(f==='name')S.settings.name=el.value.trim()||'Mathieu';if(f==='goalManual')S.settings.goalManual=Math.max(1,Math.min(14,parseInt(el.value)||1));if(f==='rest')S.settings.rest=Math.max(10,Math.min(600,parseInt(el.value)||90));if(f==='bar'){const b=num(el.value);S.settings.bar=b==null||b<0?20:b}refresh()},
goalType(){readGoal();goalSheet()},
async photoPick(el){const f=el.files[0];if(!f)return;try{ui.photoDraft=await shrink(f);$('#phPrev').innerHTML=`<img src="${ui.photoDraft}" alt="Aperçu" style="width:100%;max-height:260px;object-fit:contain;border-radius:12px">`}catch(e){toast('Image illisible')}},
async import(el){const f=el.files[0];if(!f)return;try{const j=JSON.parse(await f.text());if(!j||!Array.isArray(j.sessions))throw 0;if(!confirm('Remplacer les données actuelles par cette sauvegarde ?'))return;
const ph=Array.isArray(j.photos)?j.photos:null;delete j.photos;const d=def();S=Object.assign(d,j,{settings:Object.assign(d.settings,j.settings)});
if(ph&&ph.length){try{await tx('readwrite',s=>{s.clear();ph.forEach(p=>s.put(p))});P=ph}catch(e){}}applyAccent();refresh();toast('Sauvegarde importée')}catch(e){toast('Fichier de sauvegarde invalide')}}
};
const N={
d(el){const f=el.dataset.f,d=ui.draft;if(f==='rpe'){d.rpe=+el.value;$('#rpeV').textContent=el.value}else if(f==='duration'||f==='sleep')d[f]=num(el.value);else d[f]=el.value},
set(el){const x=ui.draft.items[+el.dataset.i].sets[+el.dataset.s],v=num(el.value);x[el.dataset.f]=el.dataset.f==='reps'&&v!=null?Math.round(v):v}
};
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){closeSheet();return go(g.dataset.go)}const el=e.target.closest('[data-act]');if(el&&A[el.dataset.act])A[el.dataset.act](el,e)});
document.addEventListener('change',e=>{const el=e.target.closest('[data-chg]');if(el&&C[el.dataset.chg])C[el.dataset.chg](el)});
document.addEventListener('input',e=>{const el=e.target.closest('[data-inp]');if(el&&N[el.dataset.inp])N[el.dataset.inp](el)});
function applyAccent(){document.documentElement.style.setProperty('--ac',S.settings.accent)}

/* ---------- Démarrage ---------- */
Object.assign(A,{
progOpen(el){ui.progSel=el.dataset.id;go('prog')},
chStart(){const v=(id,a,b)=>Math.max(a,Math.min(b,parseInt($('#'+id).value)||a));chStop();
CH={w:v('chW',5,300),r:v('chR',0,300),e:v('chE',1,20),n:v('chT',1,20),i:0,phase:'prep',end:Date.now()+5000};
ui.ch={w:CH.w,r:CH.r,e:CH.e,n:CH.n};CH.t=setInterval(chTick,200);beep(520);
if(navigator.wakeLock)navigator.wakeLock.request('screen').then(l=>{if(CH)CH.lock=l;else l.release()}).catch(()=>{});chTick()},
chStop(){chStop();const b=$('#chBox');if(b)b.innerHTML=chIdle()},
exInfo(el){const k=el.dataset.k,a=AN[k];if(!a)return;sheet(`<h2>${esc(el.dataset.n||a.n)}</h2>${figSvg(k)}<ul class="pl" style="margin-top:12px">${a.tips.map(t=>`<li>${t}</li>`).join('')}</ul>
<div class="xs mut" style="margin-top:10px">Animation schématique, vue de profil. En couleur : la barre, l'haltère ou le câble.</div>`)},
progUse(el){const p=progDef(el.dataset.id);if(!p)return;
if(!confirm(`Utiliser « ${p.name} » ?\n\nTa semaine type actuelle sera remplacée par ce programme. Tes séances déjà enregistrées ne changent pas.`))return;
const ids={};Object.keys(p.sessions).forEach(n=>{let sp=S.programmes.find(x=>x.name.toLowerCase()===n.toLowerCase());const exIds=p.sessions[n].map(e=>exIdByName(e[0]));
if(!sp){sp={id:uid(),name:n,exIds};S.programmes.push(sp)}else if(!sp.exIds.length)sp.exIds=exIds;ids[n]=sp.id});
S.template=p.week.map(n=>n?ids[n]:null);save();toast('Programme ajouté à ton planning');location.hash='#/planning'}
});
Object.assign(A,LOT2A);Object.assign(N,LOT2N);
applyAccent();recordGoal();checkBadges();ui.newBadges=[];syncNutri();render(true);requestAnimationFrame(tick);
(async()=>{try{DB=await idb();P=await tx('readonly',s=>s.getAll())||[];if(P.length&&(route()==='home'||route()==='photos'))render(false)}catch(e){}
if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{});
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{})})();

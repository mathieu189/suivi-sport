'use strict';
/* Suivi sport — Accueil personnalisable, objectifs par exercice des séances types, sauvegarde automatique */
Object.assign(I,{star:'<path d="M12 4l2.5 5.2 5.6.8-4 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4-4 5.6-.8z"/>',
grid:'<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>'});

/* ---------- Accueil : tuiles favorites et menu Plus ---------- */
const DEFFAV=['planning','seances','progression','bilan','corps','photos','objectifs'];
function allTiles(){return [['planning','cal','Planning',curGoal()+' séance(s) par semaine'],['seances','bar','Séances',S.sessions.length+' enregistrée(s)'],['progression','chart','Progression',exWithData().length+' exercice(s) suivis'],
['muscles','body','Muscles','Répartition du travail'],['corps','ruler','Poids et mensurations',S.body.length+' relevé(s)'],['photos','photo','Photos',P.length+' photo(s)'],
['objectifs','target','Objectifs',S.goals.length+' en cours'],['debuter','play','Débuter',BEG.length+' programmes et le guide'],
['programmes','list','Programmes',OPT.length+' options animées'],['maison','home','À la maison','Poids du corps, sans matériel'],['bilan','report','Bilan','Semaine, mois, année'],['badges','award','Badges',Object.keys(S.badges||{}).length+' sur '+BADGES.length+' obtenus'],['nutri','leaf','Nutrition','Ouvrir l\'application'],['reglages','gear','Réglages','Sauvegarde, météo']]}
const favs=()=>Array.isArray(S.settings.fav)?S.settings.fav:DEFFAV;
const homeTiles=()=>allTiles().filter(x=>favs().includes(x[0])).concat([['plus','grid','Plus','Toutes les rubriques']]);
V.plus=()=>head('Plus')+`<div class="card"><h2>Toutes les rubriques</h2>${allTiles().map(x=>{const f=favs().includes(x[0]);
return`<div class="li"><button class="row grow" style="text-align:left" ${x[0]==='nutri'?'data-act="nutri"':`data-go="${x[0]}"`}><span class="ac" style="display:inline-flex">${ic(x[1],22)}</span><span class="grow"><span style="display:block">${x[2]}</span><span class="xs mut">${x[3]}</span></span></button>
<button class="ib t" data-act="fav" data-id="${x[0]}" aria-label="${f?'Retirer de l\'accueil':'Afficher sur l\'accueil'}" style="color:${f?'var(--ac)':'#555'}">${ic('star',21)}</button></div>`}).join('')}
<div class="xs mut" style="margin-top:10px">L'étoile affiche la rubrique sur l'accueil (${favs().length} sur 8 au maximum).</div></div>`;

/* ---------- Objectifs par exercice dans les séances types ---------- */
const tgOf=(exId,progId)=>((progById(progId)||{}).targets||{})[exId]||null;
const tgAny=exId=>{for(const p of S.programmes){const t=(p.targets||{})[exId];if(t)return t}return null};
const tgText=t=>(t.sets&&t.reps?`${t.sets}×${t.reps}`:t.sets?`${t.sets} séries`:t.reps?`${t.reps} répétitions`:'')+(t.kg?`${t.sets||t.reps?' à ':''}${fn(t.kg,2)} kg`:'');
function setCount(exId,p,date){const t=p&&(p.targets||{})[exId],ls=lastSets(exId,date);return(t&&t.sets)||(ls&&ls.length)||3}
function ph(exId,j,ls,f){const l=ls&&ls[j];if(l)return l[f];const t=ui.draft&&tgOf(exId,ui.draft.progId);return t&&t[f]!=null?t[f]:(f==='kg'?'0':'10')}
function fillSrc(it,j){const d=ui.draft,ls=lastSets(it.exId,d.date,d.id);if(ls&&ls[j])return ls[j];const t=tgOf(it.exId,d.progId);return t&&t.reps?{kg:t.kg??0,reps:t.reps}:null}
function suggestTg(ls,tg){if(!ls||!ls.length)return tg.kg?{kg:tg.kg,text:`commence à ${fn(tg.kg,2)} kg, objectif ${tgText(tg)}`}:null;
const top=Math.max(...ls.map(x=>x.kg||0)),n=tg.sets||ls.length,ok=ls.filter(x=>(x.kg||0)>=top&&x.reps>=tg.reps).length>=n;
if(!top)return{text:ok?`${n}×${tg.reps} réussi la dernière fois : ajoute une répétition par série`:`vise ${n}×${tg.reps}`};
return ok?{kg:top+2.5,text:`${fn(top+2.5,2)} kg, soit +2,5 kg (${n}×${tg.reps} réussi la dernière fois)`}:{kg:top,text:`garde ${fn(top,2)} kg jusqu'à réussir ${n}×${tg.reps}`}}
function progSheet(){const d=ui.progDraft,by=Object.fromEntries(groupEx()),used=d.items.map(x=>x.exId),sb=$('#sheetBody'),y=sb?sb.scrollTop:0,
inp=(k,f,l,v,dec)=>`<div><label style="margin-top:0">${l}</label><input type="text" inputmode="${dec?'decimal':'numeric'}" data-inp="pg" data-k="${k}" data-f="${f}" value="${v??''}"></div>`;
sheet(`<h2>${d.id?'Modifier la séance type':'Nouvelle séance type'}</h2><label>Nom</label><input type="text" id="pName" data-inp="pgName" value="${esc(d.name)}" placeholder="Pec jambes">
<label>Exercices et objectifs</label>${d.items.map((x,k)=>`<div style="background:#222;border-radius:12px;padding:10px;margin-bottom:8px"><div class="row sp"><b class="sm grow">${k+1}. ${esc(exName(x.exId))}</b><button class="ib t" data-act="pgDel" data-k="${k}" aria-label="Retirer">${ic('trash',17)}</button></div>
<div class="g3" style="margin-top:6px">${inp(k,'sets','Séries',x.sets)}${inp(k,'reps','Répétitions',x.reps)}${inp(k,'kg','Charge (kg)',x.kg,1)}</div></div>`).join('')||'<div class="sm mut" style="margin-bottom:8px">Aucun exercice pour le moment.</div>'}
<select data-chg="pgAdd"><option value="">Ajouter un exercice…</option>${Object.keys(by).map(m=>`<optgroup label="${esc(m)}">${by[m].filter(e=>!used.includes(e.id)).map(e=>opt(e.id,e.name)).join('')}</optgroup>`).join('')}</select>
<div class="xs mut" style="margin-top:8px">Les objectifs sont facultatifs. Ils préparent le bon nombre de séries, s'affichent pendant la séance et rendent la charge conseillée plus précise.</div>
<button class="btn full" data-act="progSave" style="margin-top:14px">Enregistrer</button>${d.id?`<button class="btn dg full" data-act="progDel" data-id="${d.id}" style="margin-top:8px">Supprimer</button>`:''}`);
if(sb)sb.scrollTop=y}

/* ---------- Sauvegarde automatique ---------- */
let AUTO={state:'none',handle:null,last:0,tm:null},SNAP=[];
const FS_OK='showSaveFilePicker'in window;
const sdb=()=>new Promise((res,rej)=>{const r=indexedDB.open('suivi-sport-secours',1);r.onupgradeneeded=()=>{r.result.createObjectStore('snap',{keyPath:'day'});r.result.createObjectStore('kv')};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
const stx=(store,mode,f)=>sdb().then(db=>new Promise((res,rej)=>{const t=db.transaction(store,mode),rq=f(t.objectStore(store));t.oncomplete=()=>{db.close();res(rq&&rq.result)};t.onerror=()=>{db.close();rej(t.error)}}));
const backupJson=ph=>JSON.stringify(Object.assign({},S,{photos:ph?P:[]}));
function applyData(j){const d=def();S=migrate(Object.assign(d,j,{settings:Object.assign(d.settings,j.settings),lib:j.lib||1}));applyAccent()}
async function loadSnaps(){try{SNAP=((await stx('snap','readonly',s=>s.getAll()))||[]).sort((a,b)=>a.day<b.day?1:-1)}catch(e){SNAP=[]}}
async function clearSnaps(){try{await stx('snap','readwrite',s=>s.clear())}catch(e){}SNAP=[]}
function autoBackup(){clearTimeout(AUTO.tm);AUTO.tm=setTimeout(runBackup,4000)}
async function runBackup(){if(S.sessions.length||S.body.length||S.programmes.length){try{await stx('snap','readwrite',s=>s.put({day:today(),t:Date.now(),n:S.sessions.length,data:JSON.stringify(S)}));await loadSnaps();
const old=SNAP.slice(7).map(x=>x.day);if(old.length){await stx('snap','readwrite',s=>{old.forEach(k=>s.delete(k))});SNAP=SNAP.slice(0,7)}}catch(e){}}
await writeAuto()}
async function writeAuto(){const h=AUTO.handle;if(!h)return;try{if(h.queryPermission&&await h.queryPermission({mode:'readwrite'})!=='granted'){setAuto('pause');return}
const w=await h.createWritable();await w.write(backupJson(false));await w.close();AUTO.last=Date.now();try{localStorage.setItem('suivi-sport-auto',String(AUTO.last))}catch(e){}setAuto('ok')}catch(e){setAuto('pause')}}
function setAuto(st){const ch=AUTO.state!==st;AUTO.state=st;if(ch&&(route()==='home'||route()==='reglages'))partial()}
async function backupInit(){AUTO.last=+localStorage.getItem('suivi-sport-auto')||0;await loadSnaps();try{AUTO.handle=FS_OK?await stx('kv','readonly',s=>s.get('file')):null}catch(e){AUTO.handle=null}
if(AUTO.handle)AUTO.state='pause';await runBackup();if(route()==='reglages')partial()}
const autoPauseBanner=()=>`<div class="card" style="border:1px solid var(--ac)"><b>Sauvegarde automatique en pause</b><div class="sm mut" style="margin:4px 0 10px">Chrome demande de confirmer l'accès au fichier de sauvegarde.</div><button class="btn s" data-act="autoResume">Réactiver</button></div>`;
const ago=t=>{const m=Math.floor((Date.now()-t)/6e4);return m<1?'à l\'instant':m<60?`il y a ${m} min`:m<1440?`il y a ${Math.floor(m/60)} h`:`il y a ${Math.floor(m/1440)} j`};
function backupCard(){const canShare=!!(navigator.canShare&&window.File);
return`<div class="card"><h2>Sauvegarde automatique</h2>
<div class="li" style="display:block"><b class="sm">Copies de secours dans l'application</b><div class="xs mut">Une copie par jour, les 7 dernières sont gardées. Elles protègent d'une fausse manipulation, pas de la perte du téléphone ni d'un effacement des données de Chrome.</div>
${SNAP.map(x=>`<button class="li" data-act="snapRestore" data-day="${x.day}"><span class="grow sm">${fr(x.day,{weekday:'short',day:'numeric',month:'long'})} · ${x.n} séance(s)</span><span class="link">Restaurer</span></button>`).join('')||'<div class="xs mut" style="margin-top:6px">Aucune copie pour le moment.</div>'}</div>
<div class="li" style="display:block"><b class="sm">Fichier de sauvegarde sur le téléphone</b>${FS_OK?`<div class="xs mut">${AUTO.state==='ok'?`Actif : le fichier est mis à jour après chaque modification (dernière écriture ${ago(AUTO.last)}). Les photos n'y sont pas incluses.`:AUTO.state==='pause'?'En pause : Chrome demande de confirmer l\'accès au fichier.':'Choisis un fichier une fois : l\'application le mettra à jour toute seule après chaque modification. Les photos n\'y sont pas incluses.'}</div>
<div class="row" style="margin-top:8px;flex-wrap:wrap">${AUTO.state==='pause'?`<button class="btn s" data-act="autoResume">Réactiver</button>`:''}<button class="btn s ${AUTO.state==='none'?'':'gh'}" data-act="autoPick">${AUTO.state==='none'?'Choisir le fichier':'Changer de fichier'}</button>${AUTO.state!=='none'?`<button class="btn s gh" data-act="autoOff">Désactiver</button>`:''}</div>`
:`<div class="xs mut">Ce navigateur ne permet pas à une application web d'écrire seule dans un fichier. Utilise l'envoi ou l'export ci-dessous.</div>`}</div></div>
<div class="card"><h2>Sauvegarde manuelle</h2><div class="sm mut" style="margin-bottom:10px">Pour mettre tes données à l'abri hors du téléphone, ou les transférer sur un autre appareil.</div>
<label class="row" style="color:#fff;font-size:14px;margin:0 0 10px"><input type="checkbox" id="expPh" checked> Inclure les photos</label>
${canShare?`<button class="btn full" data-act="shareBackup" style="margin-bottom:8px">Envoyer la sauvegarde (Drive, e-mail…)</button>`:''}
<div class="g2"><button class="btn gh" data-act="export">Exporter</button><button class="btn gh" data-act="importPick">Importer</button></div><input type="file" id="impF" accept="application/json,.json,.txt,text/plain" hidden data-chg="import">
<button class="btn dg full" data-act="reset" style="margin-top:10px">Tout effacer</button></div>`}

const LOT3A={
fav(el){const id=el.dataset.id,f=favs().slice(),k=f.indexOf(id);if(k>=0)f.splice(k,1);else{if(f.length>=8)return toast('8 rubriques au maximum sur l\'accueil');f.push(id)}S.settings.fav=f;save();partial()},
progEdit(el){const p=progById(el.dataset.id);ui.progDraft=p?{id:p.id,name:p.name,items:p.exIds.filter(exById).map(e=>Object.assign({exId:e},(p.targets||{})[e]||{}))}:{id:'',name:'',items:[]};progSheet()},
pgDel(el){ui.progDraft.items.splice(+el.dataset.k,1);progSheet()},
progSave(){const d=ui.progDraft,name=(d.name||'').trim();if(!name)return toast('Donne un nom à la séance');const exIds=d.items.map(x=>x.exId),targets={};
d.items.forEach(x=>{const t={};if(x.sets>0)t.sets=Math.round(x.sets);if(x.reps>0)t.reps=Math.round(x.reps);if(x.kg>0)t.kg=x.kg;if(Object.keys(t).length)targets[x.exId]=t});
const p=progById(d.id);if(p){p.name=name;p.exIds=exIds;p.targets=targets}else S.programmes.push({id:uid(),name,exIds,targets});closeSheet();refresh()},
async autoPick(){try{const h=await window.showSaveFilePicker({suggestedName:'suivi-sport-sauvegarde.json',types:[{description:'Sauvegarde Suivi sport',accept:{'application/json':['.json']}}]});
AUTO.handle=h;try{await stx('kv','readwrite',s=>s.put(h,'file'))}catch(e){}await writeAuto();toast(AUTO.state==='ok'?'Sauvegarde automatique activée':'Écriture impossible dans ce fichier');partial()}catch(e){if(e&&e.name!=='AbortError')toast('Sauvegarde automatique indisponible sur cet appareil')}},
async autoResume(){const h=AUTO.handle;if(!h)return;try{if(h.requestPermission&&await h.requestPermission({mode:'readwrite'})!=='granted')return toast('Accès au fichier refusé');await writeAuto();if(AUTO.state==='ok')toast('Sauvegarde automatique réactivée')}catch(e){toast('Fichier introuvable : choisis-en un nouveau dans Réglages')}},
async autoOff(){AUTO.handle=null;try{await stx('kv','readwrite',s=>s.delete('file'))}catch(e){}setAuto('none');partial()},
async shareBackup(){const ph=$('#expPh')?$('#expPh').checked:true,txt=backupJson(ph);let f=new File([txt],'suivi-sport-'+today()+'.json',{type:'application/json'});
if(!navigator.canShare({files:[f]}))f=new File([txt],'suivi-sport-'+today()+'.txt',{type:'text/plain'});if(!navigator.canShare({files:[f]}))return toast('Envoi impossible ici : utilise Exporter');
try{await navigator.share({files:[f],title:'Sauvegarde Suivi sport'});S.settings.lastExport=Date.now();save();toast('Sauvegarde envoyée')}catch(e){}},
snapRestore(el){const x=SNAP.find(s=>s.day===el.dataset.day);if(!x)return;if(!confirm(`Restaurer la copie du ${fr(x.day,{day:'numeric',month:'long'})} ?\n\nLes données actuelles seront remplacées par cette copie (${x.n} séances). Les photos ne changent pas.`))return;
try{applyData(JSON.parse(x.data));localStorage.setItem(KEY,JSON.stringify(S));render(false);toast('Copie restaurée')}catch(e){toast('Copie illisible')}}
};
const LOT3C={pgAdd(el){if(!el.value)return;ui.progDraft.items.push({exId:el.value});progSheet()}};
const LOT3N={pg(el){ui.progDraft.items[+el.dataset.k][el.dataset.f]=num(el.value)},pgName(el){ui.progDraft.name=el.value}};

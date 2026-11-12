'use strict';
/* Suivi sport — Constantes, outils, stockage des données, planning et flammes */
/* ---------- Constantes ---------- */
const KEY='suivi-sport-v1';
const DAYS=['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
const MUS=['Pectoraux','Dos','Épaules','Biceps','Triceps','Quadriceps','Ischios','Fessiers','Adducteurs','Mollets','Abdos'];
const METRICS={poids:['Poids','kg'],taille:['Tour de taille','cm'],poitrine:['Poitrine','cm'],epaules:['Épaules','cm'],
bras:['Bras relâché','cm'],bras_cong:['Bras congestionné','cm'],biceps_cong:['Biceps contracté','cm'],avantbras:['Avant-bras','cm'],cou:['Cou','cm'],
hanches:['Hanches','cm'],cuisse:['Cuisse','cm'],mollet:['Mollet','cm']};
/* Bibliothèque d'exercices (liste de Franck), regroupée par catégorie */
const DEFEX=[
['Développé couché (barre ou haltères)','Pectoraux'],['Développé incliné (barre ou haltères)','Pectoraux'],['Dips (poids du corps ou machine)','Pectoraux'],
['Écarté à la poulie vis-à-vis','Pectoraux'],['Développé à la machine convergente','Pectoraux'],['Pec Fly (machine)','Pectoraux'],
['Tractions (pronation ou supination)','Dos'],['Tirage vertical à la poulie','Dos'],['Rowing barre ou haltères','Dos'],['Tirage horizontal à la poulie','Dos'],['Soulevé de terre (Deadlift)','Dos'],
['Développé militaire (barre ou haltères)','Épaules'],['Élévations latérales (haltères ou poulie)','Épaules'],['Oiseau (haltères, poulie ou machine)','Épaules'],['Tirage menton','Épaules'],
['Squat','Quadriceps'],['Presse à cuisses','Quadriceps'],['Fentes (marchées ou sur place)','Quadriceps'],['Hip Thrust','Fessiers'],['Leg Extension','Quadriceps'],
['Leg Curl (allongé ou assis)','Ischios'],['Machine à adducteurs','Adducteurs'],['Machine à abducteurs','Fessiers'],
['Curl barre ou haltères','Biceps'],['Curl pupitre (libre ou machine)','Biceps'],['Curl marteau','Biceps'],['Curl à la machine','Biceps'],
['Dips à la machine','Triceps'],['Barre au front','Triceps'],['Extensions triceps à la poulie haute','Triceps'],
['Crunch (sol ou poulie)','Abdos'],['Relevé de jambes (suspendu ou chaise romaine)','Abdos'],['Gainage planche','Abdos'],['Roue abdominale','Abdos']];
const CATS=[['Pectoraux',['Pectoraux']],['Dos',['Dos']],['Épaules',['Épaules']],['Cuisses et fessiers',['Quadriceps','Ischios','Fessiers','Adducteurs','Mollets']],
['Bras (biceps et triceps)',['Biceps','Triceps']],['Abdominaux et gainage',['Abdos']]];
/* Anciens noms de la première version, renommés pour garder l'historique */
const RENAME={'Développé couché':'Développé couché (barre ou haltères)','Développé incliné':'Développé incliné (barre ou haltères)','Écarté poulie':'Écarté à la poulie vis-à-vis',
'Dips':'Dips (poids du corps ou machine)','Tractions':'Tractions (pronation ou supination)','Rowing barre':'Rowing barre ou haltères','Tirage vertical':'Tirage vertical à la poulie',
'Tirage horizontal':'Tirage horizontal à la poulie','Soulevé de terre':'Soulevé de terre (Deadlift)','Développé militaire':'Développé militaire (barre ou haltères)',
'Élévations latérales':'Élévations latérales (haltères ou poulie)','Oiseau':'Oiseau (haltères, poulie ou machine)','Curl barre':'Curl barre ou haltères',
'Extension triceps poulie':'Extensions triceps à la poulie haute','Fentes':'Fentes (marchées ou sur place)','Leg extension':'Leg Extension','Leg curl':'Leg Curl (allongé ou assis)',
'Hip thrust':'Hip Thrust','Crunch':'Crunch (sol ou poulie)','Gainage':'Gainage planche','Relevé de jambes':'Relevé de jambes (suspendu ou chaise romaine)'};
const I={home:'<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>',cal:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>',
bar:'<path d="M3 9v6M6 6v12M18 6v12M21 9v6M6 12h12"/>',chart:'<path d="M4 20h16M5 15l4-5 4 3 6-8"/>',
body:'<circle cx="12" cy="5" r="2"/><path d="M5 9h14M12 9v6M12 15l-3 6M12 15l3 6"/>',
ruler:'<rect x="3" y="8" width="18" height="8" rx="1"/><path d="M7 8v3M11 8v4M15 8v3"/>',
photo:'<rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M8 6l1.5-2h5L16 6"/>',
target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".6"/>',
gear:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
flame:'<path d="M12 3c.5 3.2 4.5 5 4.5 9.5a4.5 4.5 0 0 1-9 0c0-1.6.6-2.8 1.4-3.7.3 1.2.9 1.9 1.8 2.2C10.4 8.4 10.6 5.4 12 3z"/>',
plus:'<path d="M12 5v14M5 12h14"/>',back:'<path d="M15 5l-7 7 7 7"/>',next:'<path d="M9 5l7 7-7 7"/>',
trash:'<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13"/>',check:'<path d="M5 12l5 5 9-10"/>',edit:'<path d="M4 20h4l10-10-4-4L4 16z"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
cloud:'<path d="M7 18a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 9.5a4.3 4.3 0 0 1 0 8.5z"/>',
rain:'<path d="M7 15a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 6.5a4.3 4.3 0 0 1 0 8.5z"/><path d="M9 18l-1 3M13 18l-1 3M17 18l-1 3"/>',
snow:'<path d="M7 15a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 6.5a4.3 4.3 0 0 1 0 8.5z"/><path d="M8.5 19v.5M12 20v.5M15.5 19v.5"/>',
bolt:'<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
play:'<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5.5 3.5-5.5 3.5z"/>',list:'<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
report:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 17v-3M12 17V9M15 17v-5"/>',award:'<circle cx="12" cy="9" r="5.5"/><path d="M9 13.8L7.5 21l4.5-2.5 4.5 2.5L15 13.8"/>',
leaf:'<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14zM5 19l8-8"/>',timer:'<circle cx="12" cy="13" r="7"/><path d="M12 13V9.5M10 3h4"/>'};
const ic=(n,s=20)=>`<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;

/* ---------- Outils ---------- */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const num=v=>{const n=parseFloat(String(v).replace(',','.'));return isNaN(n)?null:n};
const fn=(v,d=1)=>v==null?'–':(Math.round(v*10**d)/10**d).toLocaleString('fr-FR');
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const pd=s=>{const[a,b,c]=s.split('-').map(Number);return new Date(a,b-1,c)};
const addD=(s,n)=>{const d=pd(s);d.setDate(d.getDate()+n);return iso(d)};
const dow=s=>(pd(s).getDay()+6)%7;
const mon=s=>addD(s,-dow(s));
const today=()=>iso(new Date());
const fr=(s,o)=>pd(s).toLocaleDateString('fr-FR',o||{day:'numeric',month:'short'});
const diffD=(a,b)=>Math.round((pd(b)-pd(a))/864e5);
const opt=(v,l,sel)=>`<option value="${esc(v)}"${String(v)===String(sel)?' selected':''}>${esc(l)}</option>`;
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2400)}

/* ---------- Données ---------- */
function def(){return{v:1,settings:{name:'Mathieu',accent:'#ff7a1a',goalMode:'auto',goalManual:3,loc:null,rest:90,bar:20,created:Date.now()},
exercises:DEFEX.map((e,i)=>({id:'x'+i,name:e[0],muscle:e[1]})),programmes:[],template:[null,null,null,null,null,null,null],
overrides:{},pauses:[],sessions:[],body:[],goals:[],goalHistory:[],lib:2,badges:{},recCount:0}}
function load(){try{const p=JSON.parse(localStorage.getItem(KEY));if(p&&p.sessions){const d=def();return migrate(Object.assign(d,p,{settings:Object.assign(d.settings,p.settings),lib:p.lib||1}))}}catch(e){}return def()}
/* Met à jour la bibliothèque d'une ancienne version sans perdre les séances déjà saisies */
function migrate(s){if(s.lib>=2)return s;const used=new Set();
s.sessions.forEach(x=>x.items.forEach(i=>used.add(i.exId)));s.programmes.forEach(p=>p.exIds.forEach(e=>used.add(e)));s.goals.forEach(g=>g.exId&&used.add(g.exId));
s.exercises.forEach(e=>{if(RENAME[e.name])e.name=RENAME[e.name]});
const names=new Set(DEFEX.map(d=>d[0].toLowerCase()));
s.exercises=s.exercises.filter(e=>!/^e\d+$/.test(e.id)||names.has(e.name.toLowerCase())||used.has(e.id));
DEFEX.forEach(([n,m],i)=>{const ex=s.exercises.find(e=>e.name.toLowerCase()===n.toLowerCase());if(ex)ex.muscle=m;else s.exercises.push({id:'x'+i,name:n,muscle:m})});
s.lib=2;return s}
function groupEx(){const rk=n=>{const i=DEFEX.findIndex(d=>d[0]===n);return i<0?999:i};
return CATS.map(([c,ms])=>[c,S.exercises.filter(e=>ms.includes(e.muscle)).sort((a,b)=>rk(a.name)-rk(b.name)||a.name.localeCompare(b.name))]).filter(g=>g[1].length)}
let S=load();
function save(){recordGoal();checkBadges();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast('Stockage plein : exporte tes données')}}
const ui={month:today().slice(0,7),homeChart:'seances',homeEx:null,progEx:null,progM:'max',musP:30,bodyM:'poids',cmpA:null,cmpB:null,draft:null,goalDraft:null,photoDraft:null};
const exById=id=>S.exercises.find(e=>e.id===id);
const exName=id=>(exById(id)||{}).name||'Exercice supprimé';
const progById=id=>S.programmes.find(p=>p.id===id);
const progName=id=>(progById(id)||{}).name||'';
const sessVol=s=>s.items.reduce((a,it)=>a+it.sets.reduce((b,x)=>b+(x.kg||0)*(x.reps||0),0),0);
const sessSets=s=>s.items.reduce((a,it)=>a+it.sets.length,0);
const sorted=()=>[...S.sessions].sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:0);
const orm=x=>x.reps<=1?x.kg:x.kg*(1+x.reps/30);
function exHistory(id){const out=[];for(const s of sorted()){const sets=s.items.filter(i=>i.exId===id).flatMap(i=>i.sets);if(!sets.length)continue;
out.push({date:s.date,sets,max:Math.max(...sets.map(x=>x.kg||0)),orm:Math.max(...sets.map(orm)),vol:sets.reduce((a,x)=>a+(x.kg||0)*x.reps,0)})}return out}
function exWithData(){const c={};S.sessions.forEach(s=>s.items.forEach(i=>c[i.exId]=(c[i.exId]||0)+1));return Object.keys(c).filter(exById).sort((a,b)=>c[b]-c[a])}
const bodySeries=m=>[...S.body].filter(b=>b[m]!=null).sort((a,b)=>a.date<b.date?-1:1).map(b=>({l:fr(b.date),v:b[m]}));
const latest=m=>{const s=[...S.body].filter(b=>b[m]!=null).sort((a,b)=>a.date<b.date?-1:1);return s.length?s[s.length-1][m]:null};

/* ---------- Planning et flammes ---------- */
const inPause=d=>S.pauses.some(p=>d>=p.from&&d<=p.to);
function planFor(d){if(inPause(d))return{prog:null,paused:true};
if(d in S.overrides){const o=S.overrides[d];return{prog:o==='rest'||!progById(o)?null:o,over:true}}
const t=S.template[dow(d)];return{prog:t&&progById(t)?t:null}}
const curGoal=()=>S.settings.goalMode==='auto'?S.template.filter(t=>t&&progById(t)).length:Math.max(0,S.settings.goalManual|0);
function recordGoal(){const n=curGoal(),w=mon(today()),h=S.goalHistory,l=h[h.length-1];if(l&&l.n===n)return;if(l&&l.from===w)l.n=n;else h.push({from:w,n})}
function goalFor(w){const h=S.goalHistory;let n=h.length?h[0].n:curGoal();for(const e of h)if(e.from<=w)n=e.n;return n}
const weekPaused=w=>{for(let i=0;i<7;i++)if(inPause(addD(w,i)))return true;return false};
function streak(){const cnt={};S.sessions.forEach(s=>{const w=mon(s.date);cnt[w]=(cnt[w]||0)+1});
const t=today(),cw=mon(t),used={};let st=0;const ws=Object.keys(cnt).sort();
if(ws.length)for(let w=ws[0];w<cw;w=addD(w,7)){const g=goalFor(w),c=cnt[w]||0;
if(g>0&&c>=g)st++;else if(g<=0||weekPaused(w))continue;else{const m=w.slice(0,7);if(st>0&&(used[m]||0)<2)used[m]=(used[m]||0)+1;else st=0}}
const g=curGoal(),c=cnt[cw]||0,done=g>0&&c>=g;if(done)st++;
return{n:st,done,count:c,goal:g,jokers:2-(used[t.slice(0,7)]||0)}}
function nextPlanned(){const t=today();for(let i=0;i<21;i++){const d=addD(t,i),p=planFor(d);
if(p.prog&&!(i===0&&S.sessions.some(s=>s.date===t)))return{date:d,prog:p.prog}}return null}
function progMuscles(id){const p=progById(id);if(!p)return'';return[...new Set(p.exIds.map(e=>(exById(e)||{}).muscle).filter(Boolean))].join(', ')}


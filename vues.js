'use strict';
/* Suivi sport — Écrans : accueil, planning, séances, progression, muscles, corps, photos, objectifs, réglages */
/* ---------- Vues ---------- */
const head=(t,right='')=>`<div class="row sp" style="margin-bottom:14px"><div class="row"><button class="ib" data-go="home" aria-label="Retour">${ic('back')}</button><h1>${t}</h1></div>${right}</div>`;
const V={};
V.home=()=>{const st=streak(),t=today(),wk=mon(t),nx=nextPlanned();
const ws=S.sessions.filter(s=>s.date>=wk&&s.date<=addD(wk,6)),rp=ws.filter(s=>s.rpe).map(s=>s.rpe),av=rp.length?rp.reduce((a,b)=>a+b,0)/rp.length:null;
const w=latest('poids'),ps=bodySeries('poids'),dw=ps.length>1?ps[ps.length-1].v-ps[0].v:null;
const tiles=homeTiles();
const hc=homeChart();
return`<div class="row sp" style="margin-bottom:14px"><div><div class="sm mut">${new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}</div><h1>Salut ${esc(S.settings.name)}</h1></div><div id="wx" style="text-align:right"></div></div>
${backupBanner()}<div class="card row"><span class="flame ${st.n?'':'off'}">${ic('flame',40)}</span><div class="grow"><div style="font-size:22px;font-weight:600"><span class="cnt" data-to="${st.n}">0</span> semaine${st.n>1?'s':''}</div>
<div class="sm mut">${st.goal?`Cette semaine : ${st.count}/${st.goal} séance${st.goal>1?'s':''}${st.done?' · objectif atteint':''}`:'Remplis ton planning pour lancer la série'}</div>
<div class="pb" style="margin-top:6px"><i data-w="${st.goal?Math.min(100,st.count/st.goal*100):0}"></i></div></div>
<button class="chip" data-act="jokerInfo" style="text-align:center;border-radius:12px">Jokers<br><b id="jk">${st.jokers}/2</b></button></div>
<div class="g2" style="margin-bottom:12px">${tiles.map((x,i)=>`<button class="tile" style="--i:${i}" ${x[0]==='nutri'?'data-act="nutri"':`data-go="${x[0]}"`}>${ic(x[1],22)}<b>${x[2]}</b><span class="xs mut">${x[3]}</span></button>`).join('')}</div>
<div class="card"><div class="row sp"><h2>Mes objectifs</h2><button class="link" data-go="objectifs" style="margin-bottom:10px">Gérer</button></div>${S.goals.length?S.goals.slice(0,3).map(goalRow).join(''):`<div class="sm mut">Aucun objectif pour l'instant.</div>`}</div>
<div class="g3" style="margin-bottom:12px"><div class="stat"><div class="xs mut">Cette semaine</div><div class="n"><span class="cnt" data-to="${ws.length}">0</span></div><div class="xs mut">séance${ws.length>1?'s':''}</div></div>
<div class="stat"><div class="xs mut">Intensité</div><div class="n">${av==null?'–':`<span class="cnt" data-to="${av}" data-dec="1">0</span>`}</div><div class="xs mut">moyenne /10</div></div>
<div class="stat"><div class="xs mut">Poids</div><div class="n">${w==null?'–':`<span class="cnt" data-to="${w}" data-dec="1">0</span>`}</div><div class="xs mut">${dw==null?'kg':'kg, '+(dw>0?'+':'')+fn(dw)}</div></div></div>
<div class="card"><h2>Graphiques</h2><div class="chips">${[['seances','Séances'],['poids','Poids'],['exo','Exercice'],['rpe','Intensité'],['taille','Tour de taille'],['muscles','Muscles']].map(c=>`<button class="chip ${ui.homeChart===c[0]?'on':''}" data-act="homeChart" data-v="${c[0]}">${c[1]}</button>`).join('')}</div>${hc}</div>
<div class="card"><h2>Prochaine séance</h2>${nx?`<button class="row sp" style="width:100%;text-align:left" data-act="dayOpen" data-d="${nx.date}"><div><div>${esc(progName(nx.prog))}</div><div class="sm mut">${nx.date===t?"Aujourd'hui":fr(nx.date,{weekday:'long',day:'numeric',month:'long'})}${progMuscles(nx.prog)?' · '+esc(progMuscles(nx.prog)):''}</div></div><span class="ac">${ic('next')}</span></button>`:`<div class="sm mut">Rien de prévu. <button class="link" data-go="planning">Remplir le planning</button></div>`}</div>`};
function homeChart(){const c=ui.homeChart;
if(c==='seances')return box(barChart(weeksBars(),{label:'Séances par semaine',ref:curGoal()||null}),'Séances par semaine sur 8 semaines. En couleur : objectif atteint.');
if(c==='poids'){const g=S.goals.find(x=>x.type==='poids');return box(lineChart(bodySeries('poids'),{unit:'kg',ref:g?g.target:null,label:'Évolution du poids',empty:'Ajoute un relevé de poids pour voir la courbe.'}),'Touche un point pour voir la valeur.')}
if(c==='taille')return box(lineChart(bodySeries('taille'),{unit:'cm',label:'Tour de taille',empty:'Ajoute un tour de taille pour voir la courbe.'}),'Touche un point pour voir la valeur.');
if(c==='rpe'){const p=sorted().filter(s=>s.rpe).slice(-16).map(s=>({l:fr(s.date),v:s.rpe}));return box(lineChart(p,{area:1,unit:'/10',label:'Intensité par séance',empty:'Enregistre une séance pour voir ton intensité.'}),'Intensité ressentie (1 à 10) des dernières séances.')}
if(c==='muscles'){const m=muscleSets(30);return box(radar(MUS.map(l=>({l,v:m.c[l]}))),'Séries par groupe musculaire sur 30 jours.')}
const ex=exWithData();if(!ex.length)return empty('Enregistre une séance pour suivre un exercice.');if(!ex.includes(ui.homeEx))ui.homeEx=ex[0];
const h=exHistory(ui.homeEx),d=h.length>1?h[h.length-1].max-h[0].max:0;
return`<select data-chg="homeEx" style="margin-bottom:8px">${ex.map(e=>opt(e,exName(e),ui.homeEx)).join('')}</select>`+box(lineChart(h.map(x=>({l:fr(x.date),v:x.max})),{unit:'kg',label:'Charge maximale'}),`Charge maximale par séance${h.length>1?' : '+(d>=0?'+':'')+fn(d)+' kg depuis le début':''}.`)}

V.planning=()=>{const t=today(),first=ui.month+'-01',st=streak();let d=mon(first),cells='';
const end=iso(new Date(+ui.month.slice(0,4),+ui.month.slice(5),0));
while(d<=end||dow(d)!==0){const p=planFor(d),done=S.sessions.some(s=>s.date===d);
cells+=`<button class="day ${d.slice(0,7)!==ui.month?'out':''} ${p.paused?'pause':done?'done':p.prog?'plan':''} ${d===t?'today':''}" data-act="dayOpen" data-d="${d}">${+d.slice(8)}<small>${done&&!p.prog?'fait':esc(progName(p.prog))}</small></button>`;d=addD(d,1);if(d>end&&dow(d)===0)break}
return head('Planning')+
`<div class="card"><div class="row sp"><div><h2 style="margin-bottom:2px">Semaine type</h2><div class="xs mut" style="margin-bottom:10px">${st.count}/${st.goal} séance(s) faite(s) cette semaine</div></div><button class="btn s" data-act="weekFill" style="margin-bottom:10px">${ic('edit',16)} Remplir ma semaine</button></div>
${S.template.some(t=>t&&progById(t))?DAYS.map((n,i)=>`<div class="row" style="margin-bottom:6px"><span style="width:76px" class="sm">${n}</span><select data-chg="tpl" data-i="${i}">${opt('','Repos',S.template[i]||'')}${S.programmes.map(p=>opt(p.id,p.name,S.template[i])).join('')}</select></div>`).join('')+`<div class="xs mut">La semaine type se répète toutes les semaines dans le calendrier.</div>`
:`<div class="sm mut">Touche « Remplir ma semaine » et écris la séance de chaque jour en une fois, par exemple « Pec jambes ». Elle se répétera sur tous les mois.</div>`}</div>
<div class="card"><div class="row sp"><h2>Mes séances types</h2><button class="btn s" data-act="progEdit" style="margin-bottom:10px">${ic('plus',16)} Créer</button></div>
${S.programmes.map(p=>`<button class="li" data-act="progEdit" data-id="${p.id}"><div class="grow"><div>${esc(p.name)}</div><div class="xs mut">${p.exIds.length} exercice(s)${progMuscles(p.id)?' · '+esc(progMuscles(p.id)):''}</div></div><span class="mut">${ic('edit',18)}</span></button>`).join('')||'<div class="sm mut">Aucune séance type.</div>'}</div>
<div class="card"><div class="row sp" style="margin-bottom:10px"><button class="ib" data-act="month" data-v="-1" aria-label="Mois précédent">${ic('back')}</button><h2 style="margin:0;text-transform:capitalize">${pd(first).toLocaleDateString('fr-FR',{month:'long',year:'numeric'})}</h2><button class="ib" data-act="month" data-v="1" aria-label="Mois suivant">${ic('next')}</button></div>
<div class="cal">${['L','M','M','J','V','S','D'].map(x=>`<div class="hd">${x}</div>`).join('')}${cells}</div>
<div class="xs mut" style="margin-top:8px">Touche un jour pour saisir la séance, la déplacer ou mettre un repos ce jour-là. Jour coloré : séance faite. Hachuré : pause.</div></div>
<div class="card"><div class="row sp"><h2>Pauses (vacances, blessure)</h2><button class="btn s gh" data-act="pauseAdd" style="margin-bottom:10px">${ic('plus',16)} Ajouter</button></div>
${S.pauses.map(p=>`<div class="li"><div class="grow"><div>${esc(p.label||'Pause')}</div><div class="xs mut">du ${fr(p.from)} au ${fr(p.to,{day:'numeric',month:'short',year:'numeric'})}</div></div><button class="ib t" data-act="pauseDel" data-id="${p.id}" aria-label="Supprimer">${ic('trash',18)}</button></div>`).join('')||'<div class="sm mut">Une semaine en pause ne casse pas ta série de flammes.</div>'}</div>`};

V.seances=()=>{const l=sorted().reverse(),by=Object.fromEntries(groupEx());
return head('Séances',`<button class="btn s" data-act="sessNew">${ic('plus',16)} Nouvelle</button>`)+
`<div class="card"><h2>Historique</h2>${l.map(s=>`<button class="li" data-act="sessEdit" data-id="${s.id}"><div class="grow"><div>${esc(s.name||'Séance')}</div><div class="xs mut">${fr(s.date,{weekday:'short',day:'numeric',month:'short',year:'numeric'})} · ${s.items.length} exo · ${sessSets(s)} séries · ${fn(sessVol(s),0)} kg${s.rpe?' · intensité '+s.rpe:''}</div></div><span class="mut">${ic('next',18)}</span></button>`).join('')||empty('Aucune séance enregistrée. Touche « Nouvelle » pour commencer.')}</div>
<div class="card"><div class="row sp"><h2>Bibliothèque d'exercices</h2><button class="btn s gh" data-act="exAdd" style="margin-bottom:10px">${ic('plus',16)} Ajouter</button></div>
${Object.keys(by).map(m=>`<details><summary><span>${esc(m)}</span><span class="mut sm">${by[m].length}</span></summary>${by[m].map(e=>`<div class="li"><span class="grow sm">${esc(e.name)}</span><button class="ib t" data-act="exDel" data-id="${e.id}" aria-label="Supprimer">${ic('trash',16)}</button></div>`).join('')}</details>`).join('')}</div>`};

function lastSets(exId,before,skip){const s=sorted().reverse().find(x=>x.id!==skip&&x.date<=before&&x.items.some(i=>i.exId===exId));return s?s.items.filter(i=>i.exId===exId).flatMap(i=>i.sets):null}
function newDraft(date,progId){const p=progById(progId);return{id:null,date:date||today(),progId:progId||null,name:p?p.name:'',rpe:7,duration:null,note:'',
items:p?p.exIds.filter(exById).map(e=>({exId:e,sets:Array.from({length:setCount(e,p,date||today())},()=>({kg:null,reps:null}))})):[]}}
V.seance=()=>{if(!ui.draft)ui.draft=newDraft();const d=ui.draft,by=Object.fromEntries(groupEx());
return`<div class="row sp" style="margin-bottom:14px"><div class="row"><button class="ib" data-act="histBack" aria-label="Retour">${ic('back')}</button><h1 style="font-size:18px">${d.id?'Modifier la séance':'Nouvelle séance'}</h1></div>${d.items.length?`<button class="btn s" data-act="liveOpen">${ic('play',16)} En direct</button>`:''}${d.id?`<button class="ib t" data-act="sessDel" aria-label="Supprimer">${ic('trash')}</button>`:''}</div>
<div class="card"><div class="g2"><div><label style="margin-top:0">Date</label><input type="date" data-inp="d" data-f="date" value="${d.date}"></div><div><label style="margin-top:0">Durée (min)</label><input type="number" inputmode="numeric" data-inp="d" data-f="duration" value="${d.duration??''}" placeholder="60"></div></div>
<label>Nom de la séance</label><input type="text" data-inp="d" data-f="name" value="${esc(d.name)}" placeholder="Pec jambes">
${!d.id&&S.programmes.length?`<label>Partir d'une séance type</label><select data-chg="draftProg">${opt('','Séance libre',d.progId||'')}${S.programmes.map(p=>opt(p.id,p.name,d.progId)).join('')}</select>`:''}
<label>Forme du jour</label><div class="chips" style="margin-bottom:0">${[1,2,3,4,5].map(n=>`<button class="chip ${d.form===n?'on':''}" data-act="form" data-v="${n}">${n}</button>`).join('')}<span class="xs mut" style="align-self:center">1 épuisé · 5 en pleine forme</span></div>
<label>Sommeil la nuit dernière (heures)</label><input type="text" inputmode="decimal" data-inp="d" data-f="sleep" value="${d.sleep??''}" placeholder="7,5"></div>
${d.items.map((it,i)=>{const ls=lastSets(it.exId,d.date,d.id);return`<div class="card">${exHead(it,i,ls)}
${it.sets.map((x,j)=>`<div class="set"><span>${j+1}</span><input type="text" inputmode="decimal" data-inp="set" data-i="${i}" data-s="${j}" data-f="kg" value="${x.kg??''}" placeholder="${ph(it.exId,j,ls,'kg')}"><input type="text" inputmode="numeric" data-inp="set" data-i="${i}" data-s="${j}" data-f="reps" value="${x.reps??''}" placeholder="${ph(it.exId,j,ls,'reps')}"><button class="ib ${x.done?'':'t'}" style="${x.done?'background:var(--ac);color:#0b0b0b':''}" data-act="setDone" data-i="${i}" data-s="${j}" aria-label="Valider la série">${ic('check',18)}</button><button class="ib t" data-act="setDel" data-i="${i}" data-s="${j}" aria-label="Retirer la série">×</button></div>`).join('')}
<button class="link" data-act="setAdd" data-i="${i}" style="margin-top:10px">+ Ajouter une série</button></div>`}).join('')}
<div class="card"><label style="margin-top:0">Ajouter un exercice</label><select data-chg="itemAdd"><option value="">Choisir…</option>${Object.keys(by).map(m=>`<optgroup label="${esc(m)}">${by[m].map(e=>opt(e.id,e.name)).join('')}</optgroup>`).join('')}</select></div>
<div class="card"><div class="row sp"><label style="margin:0">Intensité ressentie</label><b class="ac"><span id="rpeV">${d.rpe}</span>/10</b></div><input type="range" min="1" max="10" step="1" data-inp="d" data-f="rpe" value="${d.rpe}">
<div class="row sp xs mut"><span>Facile</span><span>Maximale</span></div><label>Note</label><textarea rows="2" data-inp="d" data-f="note" placeholder="Sensations, douleurs, remarques…">${esc(d.note)}</textarea></div>
<button class="btn full" data-act="sessSave">${ic('check',18)} Enregistrer la séance</button>`};

V.progression=()=>{const ex=exWithData();if(!ex.length)return head('Progression')+`<div class="card">${empty('Enregistre des séances pour voir ta progression par exercice.')}</div>`;
if(!ex.includes(ui.progEx))ui.progEx=ex[0];const h=exHistory(ui.progEx),m=ui.progM,lab={max:['Charge max','kg'],orm:['1RM estimé','kg'],vol:['Volume','kg']};
const best=h.reduce((a,x)=>x.max>a.max?x:a,h[0]),bo=Math.max(...h.map(x=>x.orm)),d=h.length>1?h[h.length-1][m]-h[0][m]:null;
return head('Progression')+`<div class="card"><select data-chg="progEx" style="margin-bottom:10px">${ex.map(e=>opt(e,exName(e),ui.progEx)).join('')}</select>
<div class="chips">${Object.keys(lab).map(k=>`<button class="chip ${m===k?'on':''}" data-act="progM" data-v="${k}">${lab[k][0]}</button>`).join('')}</div>
${box(lineChart(h.map(x=>({l:fr(x.date),v:x[m]})),{unit:'kg',area:m==='vol',label:lab[m][0]}),d==null?'Une seule séance pour le moment.':`${lab[m][0]} : ${d>=0?'+':''}${fn(d)} kg depuis la première séance.`)}</div>
<div class="g3" style="margin-bottom:12px"><div class="stat"><div class="xs mut">Record</div><div class="n">${fn(best.max)}</div><div class="xs mut">kg, ${fr(best.date)}</div></div><div class="stat"><div class="xs mut">1RM estimé</div><div class="n">${fn(bo)}</div><div class="xs mut">kg</div></div><div class="stat"><div class="xs mut">Séances</div><div class="n">${h.length}</div><div class="xs mut">avec cet exo</div></div></div>
${progExtra()}<div class="card"><h2>Dernières séances</h2>${h.slice(-8).reverse().map(x=>`<div class="li"><span class="sm mut" style="width:64px">${fr(x.date)}</span><span class="grow sm">${x.sets.map(s=>fn(s.kg)+'×'+s.reps).join(' · ')}</span></div>`).join('')}
<div class="xs mut" style="margin-top:8px">Le 1RM estimé (formule d'Epley) est la charge théorique sur une seule répétition.</div></div>`};

V.muscles=()=>{const m=muscleSets(ui.musP),mx=Math.max(1,...MUS.map(l=>m.c[l])),t=today();
return head('Muscles')+`<div class="card"><div class="chips">${[7,30,90].map(p=>`<button class="chip ${ui.musP===p?'on':''}" data-act="musP" data-v="${p}">${p} jours</button>`).join('')}</div>${box(radar(MUS.map(l=>({l,v:m.c[l]}))),'Nombre de séries par groupe musculaire.')}</div>
<div class="card"><h2>Détail par muscle</h2>${[...MUS].sort((a,b)=>m.c[b]-m.c[a]).map(l=>{const ago=m.last[l]?diffD(m.last[l],t):null;return`<div style="margin-bottom:10px"><div class="row sp sm"><span>${l}</span><span class="mut">${m.c[l]} séries · ${ago==null?'jamais travaillé':ago===0?"aujourd'hui":'il y a '+ago+' j'}</span></div><div class="pb" style="margin-top:4px"><i data-w="${m.c[l]/mx*100}"></i></div></div>`}).join('')}</div>`};

V.corps=()=>{const m=ui.bodyM,s=bodySeries(m),l=[...S.body].sort((a,b)=>a.date<b.date?1:-1),g=m==='poids'?S.goals.find(x=>x.type==='poids'):S.goals.find(x=>x.type==='mens'&&x.metric===m);
const d=s.length>1?s[s.length-1].v-s[0].v:null;
return head('Poids et mensurations',`<button class="btn s" data-act="bodyAdd">${ic('plus',16)} Relevé</button>`)+
`<div class="card"><div class="chips">${Object.keys(METRICS).map(k=>`<button class="chip ${m===k?'on':''}" data-act="bodyM" data-v="${k}">${METRICS[k][0]}</button>`).join('')}</div>
${box(lineChart(s,{unit:METRICS[m][1],ref:g?g.target:null,label:METRICS[m][0],empty:'Aucun relevé pour cette mesure.'}),d==null?'':`${METRICS[m][0]} : ${d>0?'+':''}${fn(d)} ${METRICS[m][1]} depuis le premier relevé.`)}</div>
<div class="card"><h2>Relevés</h2>${l.map(b=>`<div class="li"><div class="grow"><div class="sm">${fr(b.date,{day:'numeric',month:'long',year:'numeric'})}</div><div class="xs mut">${Object.keys(METRICS).filter(k=>b[k]!=null).map(k=>METRICS[k][0]+' '+fn(b[k])+' '+METRICS[k][1]).join(' · ')}</div></div><button class="ib t" data-act="bodyAdd" data-id="${b.id}" aria-label="Modifier">${ic('edit',17)}</button></div>`).join('')||empty('Ajoute ton premier relevé.')}</div>`};

V.photos=()=>{const l=[...P].sort((a,b)=>a.date<b.date?1:-1),by={};l.forEach(p=>(by[p.date.slice(0,7)]=by[p.date.slice(0,7)]||[]).push(p));
const asc=[...l].reverse();if(asc.length>1){if(!P.find(p=>p.id===ui.cmpA))ui.cmpA=asc[0].id;if(!P.find(p=>p.id===ui.cmpB))ui.cmpB=asc[asc.length-1].id}
const a=P.find(p=>p.id===ui.cmpA),b=P.find(p=>p.id===ui.cmpB),o=sel=>asc.map(p=>opt(p.id,fr(p.date,{day:'numeric',month:'short',year:'numeric'})+(p.pose?' · '+p.pose:''),sel)).join('');
return head('Photos',`<button class="btn s" data-act="photoAdd">${ic('plus',16)} Photo</button>`)+
(asc.length>1?`<div class="card"><h2>Avant / après</h2><div class="g2" style="margin-bottom:8px"><select data-chg="cmpA">${o(ui.cmpA)}</select><select data-chg="cmpB">${o(ui.cmpB)}</select></div>
<div class="cmp"><div><img src="${a.data}" alt="Avant"></div><div><img src="${b.data}" alt="Après"></div></div><div class="tip">${diffD(a.date,b.date)} jours entre les deux photos.</div></div>`:'')+
(l.length?Object.keys(by).map(k=>`<div class="card"><h2 style="text-transform:capitalize">${pd(k+'-01').toLocaleDateString('fr-FR',{month:'long',year:'numeric'})}</h2><div class="ph">${by[k].map(p=>`<button data-act="photoOpen" data-id="${p.id}"><img src="${p.data}" alt="Photo du ${fr(p.date)}" loading="lazy"><span>${fr(p.date)}${p.pose?' · '+esc(p.pose):''}</span></button>`).join('')}</div></div>`).join('')
:`<div class="card">${empty('Ajoute une photo pour suivre ton évolution physique. Les photos restent sur ce téléphone.')}</div>`)};

function goalCur(g){if(g.type==='charge'){const h=exHistory(g.exId);return h.length?Math.max(...h.map(x=>x.max)):null}
if(g.type==='poids')return latest('poids');if(g.type==='mens')return latest(g.metric);return g.current}
function goalPct(g){const c=goalCur(g);if(c==null)return 0;const den=g.target-g.start;if(!den)return c>=g.target?1:0;return Math.max(0,Math.min(1,(c-g.start)/den))}
const goalUnit=g=>g.type==='charge'||g.type==='poids'?'kg':g.type==='mens'?'cm':(g.unit||'');
function goalRow(g){const p=Math.round(goalPct(g)*100),c=goalCur(g),left=g.deadline?diffD(today(),g.deadline):null;
return`<button class="li" data-act="goalEdit" data-id="${g.id}" style="display:block"><div class="row sp sm"><span>${esc(g.title)}</span><b class="ac">${p>=100?'Atteint':p+' %'}</b></div><div class="pb" style="margin:5px 0 4px"><i data-w="${p}"></i></div>
<div class="row sp xs mut"><span>${c==null?'Pas encore de mesure':'Actuel : '+fn(c)+' '+goalUnit(g)} · cible ${fn(g.target)} ${goalUnit(g)}</span><span>${left==null?'':left<0?'échéance dépassée':left===0?"aujourd'hui":'J-'+left}</span></div></button>`}
V.objectifs=()=>head('Objectifs',`<button class="btn s" data-act="goalEdit">${ic('plus',16)} Objectif</button>`)+`<div class="card">${S.goals.map(goalRow).join('')||empty('Crée ton premier objectif : une charge sur un exercice, un poids, une mensuration ou un objectif libre.')}</div>
<div class="xs mut" style="padding:0 4px">Les objectifs de charge, de poids et de mensuration se mettent à jour tout seuls à partir de tes séances et de tes relevés.</div>`;

V.reglages=()=>{const s=S.settings,st=streak();
return head('Réglages')+`<div class="card"><h2>Profil</h2><label style="margin-top:0">Prénom affiché</label><input type="text" data-chg="set" data-f="name" value="${esc(s.name)}">
<label>Couleur d'accent</label><div class="row">${[['#ff7a1a','Orange'],['#2ecc8f','Vert'],['#3b82f6','Bleu'],['#ffffff','Blanc']].map(c=>`<button data-act="accent" data-v="${c[0]}" aria-label="${c[1]}" style="width:38px;height:38px;border-radius:50%;background:${c[0]};border:3px solid ${s.accent===c[0]?'#fff':'#0b0b0b'};outline:1px solid #444"></button>`).join('')}</div></div>
<div class="card"><h2>Séance</h2><div class="g2"><div><label style="margin-top:0">Repos entre les séries (s)</label><input type="number" inputmode="numeric" data-chg="set" data-f="rest" value="${s.rest}"></div><div><label style="margin-top:0">Poids de la barre (kg)</label><input type="text" inputmode="decimal" data-chg="set" data-f="bar" value="${s.bar}"></div></div><div class="xs mut" style="margin-top:8px">Le minuteur de repos démarre quand tu valides une série avec la coche.</div></div>
<div class="card"><h2>Objectif hebdomadaire et flammes</h2><div class="chips"><button class="chip ${s.goalMode==='auto'?'on':''}" data-act="goalMode" data-v="auto">Selon mon planning</button><button class="chip ${s.goalMode==='manuel'?'on':''}" data-act="goalMode" data-v="manuel">Nombre fixe</button></div>
${s.goalMode==='manuel'?`<label style="margin-top:0">Séances par semaine</label><input type="number" inputmode="numeric" min="1" max="14" data-chg="set" data-f="goalManual" value="${s.goalManual}">`:`<div class="sm mut">Objectif actuel : ${curGoal()} séance(s) par semaine, d'après ta semaine type.</div>`}
<div class="sm mut" style="margin-top:10px">Série en cours : ${st.n} semaine(s). Jokers restants ce mois-ci : ${st.jokers}/2. Un joker est utilisé automatiquement quand une semaine est manquée ; ils reviennent à 2 chaque mois.</div></div>
<div class="card"><h2>Météo</h2><div class="sm mut" style="margin-bottom:8px">${s.loc?'Lieu : '+esc(s.loc.label):'Météo désactivée.'}</div><div class="row"><input type="text" id="city" placeholder="Ville (ex. Orléans)"><button class="btn s" data-act="citySearch">OK</button></div>
<div class="row" style="margin-top:8px"><button class="btn s gh" data-act="geo">Utiliser ma position</button>${s.loc?`<button class="btn s gh" data-act="wxOff">Désactiver</button>`:''}</div>
<div class="xs mut" style="margin-top:8px">La météo vient d'Open-Meteo. Seule la position est envoyée, rien d'autre.</div></div>
${backupCard()}
<div class="xs mut" style="text-align:center">Suivi sport · version 2.1</div>`};


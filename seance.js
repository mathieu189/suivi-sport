'use strict';
/* Suivi sport — Minuteur de repos, séance en direct, records, disques, bilan, badges, photo guidée */
/* ---------- Lot 2 : repos, séance en direct, records, disques, bilan, badges, photo guidée ---------- */
ui.newBadges=[];ui.bil={mode:'week',off:0,year:+today().slice(0,4)};ui.live={i:0};
const mmss=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
/* minuteur de repos */
let REST=null;
function restStop(){if(REST){clearInterval(REST.t);REST=null}const e=$('#rest');if(e){e.hidden=true;e.innerHTML=''}document.body.classList.remove('resting')}
function restStart(sec){restStop();REST={end:Date.now()+sec*1000};const e=$('#rest');
e.innerHTML=`<span class="ac" style="display:inline-flex">${ic('timer',18)}</span><b id="restT" style="font-variant-numeric:tabular-nums;min-width:42px"></b><button data-act="restAdj" data-v="-15">−15</button><button data-act="restAdj" data-v="15">+15</button><button data-act="restStop" aria-label="Arrêter le repos">×</button>`;
e.hidden=false;document.body.classList.add('resting');REST.t=setInterval(restTick,250);restTick()}
function restTick(){const e=$('#rest');if(!REST||!e)return;const left=Math.ceil((REST.end-Date.now())/1000);
if(left<=0){clearInterval(REST.t);REST=null;beep(880);e.innerHTML='<b style="padding:0 8px">Repos terminé</b>';setTimeout(()=>{if(!REST){e.hidden=true;e.innerHTML='';document.body.classList.remove('resting')}},2500);return}
const t=$('#restT');if(t)t.textContent=mmss(left)}
/* charge conseillée et stagnation */
function suggest(exId,date,skip,tg){const ls=lastSets(exId,date,skip);if(tg&&tg.reps)return suggestTg(ls,tg);if(!ls||!ls.length)return null;const top=Math.max(...ls.map(x=>x.kg||0)),r0=ls[0].reps,mn=Math.min(...ls.map(x=>x.reps));
if(!top)return{text:`vise ${r0+1} répétitions par série`};
return ls.every(x=>(x.kg||0)===top)&&mn>=r0&&r0>=6?{kg:top+2.5,text:`${fn(top+2.5,2)} kg, soit +2,5 kg (aucune baisse de répétitions la dernière fois)`}:{kg:top,text:`garde ${fn(top,2)} kg et vise une répétition de plus`}}
function isStale(id){const h=exHistory(id).filter(x=>x.orm>0);if(h.length<4)return false;return Math.max(...h.slice(-3).map(x=>x.orm))<=Math.max(...h.slice(0,-3).map(x=>x.orm))}
function exHead(it,i,ls){const e=exById(it.exId)||{},tg=tgOf(it.exId,ui.draft.progId),sg=suggest(it.exId,ui.draft.date,ui.draft.id,tg);
return`<div class="row sp"><div class="grow"><b>${esc(exName(it.exId))}</b><div class="xs mut">${ls?'Dernière fois : '+ls.map(x=>fn(x.kg)+'×'+x.reps).join(', '):'Première fois'}</div>${tg?`<div class="xs">Objectif : ${tgText(tg)}</div>`:''}${sg?`<div class="xs ac">Conseil : ${sg.text}</div>`:''}${e.note?`<div class="xs" style="margin-top:2px">Note : ${esc(e.note)}</div>`:''}</div><button class="ib t" data-act="itemDel" data-i="${i}" aria-label="Retirer">${ic('trash',18)}</button></div>
<div class="chips" style="margin:8px 0 0">${ls?`<button class="chip" data-act="setSame" data-i="${i}">Idem</button>`:''}<button class="chip" data-act="plates" data-i="${i}">Disques</button><button class="chip" data-act="exNote" data-id="${it.exId}">${e.note?'Modifier la note':'Ajouter une note'}</button></div>
<div class="set"><span>#</span><span>kg</span><span>répétitions</span><span></span><span></span></div>`}
function progExtra(){const sg=suggest(ui.progEx,today(),null,tgAny(ui.progEx)),st=exWithData().filter(isStale);
return(isStale(ui.progEx)?`<div class="card" style="border:1px solid #ff8f8f"><b>Progression à l'arrêt</b><div class="sm mut" style="margin-top:4px">Aucun progrès du 1RM estimé sur tes 3 dernières séances. Pistes : change la fourchette de répétitions, allège de 10 % puis remonte, ou regarde ton sommeil et ta récupération.</div></div>`:'')
+(sg?`<div class="card"><h2>Prochaine séance</h2><div class="sm">Conseil : ${sg.text}.</div></div>`:'')
+(st.length?`<div class="card"><h2>Exercices qui stagnent</h2>${st.map(id=>`<button class="li" data-act="progPick" data-id="${id}"><span class="grow sm">${esc(exName(id))}</span>${ic('next',16)}</button>`).join('')}</div>`:'')}
/* disques */
function platesCalc(){const o=$('#plOut');if(!o)return;const T=num($('#plT').value),B=num($('#plB').value)??20;
if(T==null){o.innerHTML=`<div class="sm mut">Entre la charge totale à mettre sur la barre.</div>`;return}
if(T<B){o.innerHTML=`<div class="sm mut">La charge est plus légère que la barre seule (${fn(B,2)} kg).</div>`;return}
let side=(T-B)/2;const out=[];for(const p of[25,20,15,10,5,2.5,1.25]){const n=Math.floor((side+1e-9)/p);if(n){out.push([p,n]);side-=n*p}}
const vis=out.flatMap(([p,n])=>Array(n).fill(p)).map(p=>`<span style="display:inline-block;width:${p>=10?12:8}px;height:${22+p*2.2}px;background:var(--ac);border-radius:3px;margin-right:3px;vertical-align:middle"></span>`).join('');
o.innerHTML=out.length?`<div class="sm mut" style="margin-bottom:8px">De chaque côté de la barre :</div><div style="margin-bottom:10px"><span style="display:inline-block;width:40px;height:6px;background:#666;vertical-align:middle"></span>${vis}</div>${out.map(([p,n])=>`<div class="li"><span class="grow">${n} × ${fn(p,2)} kg</span></div>`).join('')}${side>.01?`<div class="xs mut" style="margin-top:8px">Il reste ${fn(side*2,2)} kg impossibles à charger avec des disques standards. Total réel : ${fn(T-side*2,2)} kg.</div>`:''}`:`<div class="sm mut">Barre seule, sans disque.</div>`}
/* records, badges, célébration */
function findRecords(s){const out=[],others=S.sessions.filter(x=>x.id!==s.id);
s.items.forEach(it=>{const cur=it.sets.filter(x=>x.kg>0);if(!cur.length)return;const prev=others.flatMap(x=>x.items.filter(i=>i.exId===it.exId).flatMap(i=>i.sets)).filter(x=>x.kg>0);if(!prev.length)return;
const cm=Math.max(...cur.map(x=>x.kg)),pm=Math.max(...prev.map(x=>x.kg)),co=Math.max(...cur.map(orm)),po=Math.max(...prev.map(orm));
if(cm>pm)out.push(`${exName(it.exId)} : ${fn(cm,2)} kg (ancien record ${fn(pm,2)} kg)`);else if(co>po+.05)out.push(`${exName(it.exId)} : 1RM estimé ${fn(co)} kg (avant ${fn(po)} kg)`)});return out}
const totalVol=()=>S.sessions.reduce((a,s)=>a+sessVol(s),0),nS=n=>()=>S.sessions.length>=n,nW=n=>()=>streak().n>=n;
const BADGES=[['s1','Première séance','Enregistrer une séance',nS(1)],['s10','10 séances','Enregistrer 10 séances',nS(10)],['s25','25 séances','Enregistrer 25 séances',nS(25)],['s50','50 séances','Enregistrer 50 séances',nS(50)],
['s100','100 séances','Enregistrer 100 séances',nS(100)],['s200','200 séances','Enregistrer 200 séances',nS(200)],
['w4','Un mois de flammes','4 semaines de suite avec l\'objectif atteint',nW(4)],['w10','10 semaines de flammes','10 semaines de suite',nW(10)],['w26','Six mois de flammes','26 semaines de suite',nW(26)],['w52','Un an de flammes','52 semaines de suite',nW(52)],
['rec','Premier record','Battre un record sur un exercice',()=>(S.recCount||0)>=1],['rec10','10 records','Battre 10 records',()=>(S.recCount||0)>=10],
['v100','100 tonnes','Soulever 100 000 kg au total',()=>totalVol()>=1e5],['v500','500 tonnes','Soulever 500 000 kg au total',()=>totalVol()>=5e5],
['trac','Première traction','Enregistrer une série de tractions',()=>S.sessions.some(s=>s.items.some(i=>/traction/i.test(exName(i.exId))))],
['body10','Suivi régulier','10 relevés de poids ou de mensurations',()=>S.body.length>=10],['ph1','Première photo','Ajouter une photo d\'évolution',()=>P.length>=1],
['goal1','Objectif atteint','Atteindre un de tes objectifs',()=>S.goals.some(g=>goalPct(g)>=1)]];
function checkBadges(){S.badges=S.badges||{};BADGES.forEach(b=>{if(S.badges[b[0]])return;let ok=false;try{ok=b[3]()}catch(e){}if(ok){S.badges[b[0]]=today();ui.newBadges.push({name:b[1],desc:b[2]})}})}
function celebrate(recs,nb){sheet(`<div class="conf">${Array.from({length:28},(_,i)=>`<i style="left:${(i*37)%100}%;background:${['var(--ac)','#fff','#ffd166','#2ecc8f'][i%4]};animation-delay:${(i%7)*90}ms"></i>`).join('')}</div>
<div style="text-align:center"><span class="flame">${ic('award',48)}</span><h2 style="font-size:20px;margin-top:6px">${recs.length?'Nouveau record':'Nouveau badge'}</h2></div>
${recs.map(r=>`<div class="li"><span class="ac">${ic('chart',18)}</span><span class="grow sm">${esc(r)}</span></div>`).join('')}${nb.map(b=>`<div class="li"><span class="ac">${ic('award',18)}</span><span class="grow sm"><b>${esc(b.name)}</b><br><span class="mut">${esc(b.desc)}</span></span></div>`).join('')}
<button class="btn full" data-act="closeSheet" style="margin-top:14px">Continuer</button>`);beep(660)}
V.badges=()=>head('Badges')+`<div class="card"><div class="row sp"><h2 style="margin:0">${Object.keys(S.badges||{}).length} sur ${BADGES.length} obtenus</h2></div><div class="pb" style="margin-top:10px"><i data-w="${Object.keys(S.badges||{}).length/BADGES.length*100}"></i></div></div>
<div class="g2">${BADGES.map((b,i)=>{const d=(S.badges||{})[b[0]];return`<div class="bdg ${d?'':'off'}" style="animation-delay:${i*35}ms"><span class="${d?'ac':'mut'}" style="display:inline-flex">${ic('award',34)}</span><div style="font-weight:600;font-size:13.5px;margin-top:4px">${b[1]}</div><div class="xs mut">${d?'Obtenu le '+fr(d,{day:'numeric',month:'short',year:'numeric'}):b[2]}</div></div>`}).join('')}</div>`;
/* séance en direct */
V.live=()=>{const d=ui.draft;if(!d||!d.items.length)return head('Séance en direct')+`<div class="card">${empty('Ajoute d\'abord des exercices à ta séance.')}</div>`;
const n=d.items.length,i=Math.min(ui.live.i,n-1),it=d.items[i],ls=lastSets(it.exId,d.date,d.id),e=exById(it.exId)||{},k=amap(e.name),tg=tgOf(it.exId,d.progId),sg=suggest(it.exId,d.date,d.id,tg),j=it.sets.findIndex(x=>!x.done),x=it.sets[j],
all=d.items.flatMap(a=>a.sets),dn=all.filter(s=>s.done).length;
return`<div class="row sp" style="margin-bottom:10px"><div class="row"><button class="ib" data-act="liveEnd" aria-label="Retour">${ic('back')}</button><h1>En direct</h1></div><span class="sm mut">Exercice ${i+1}/${n}</span></div>
<div class="pb" style="margin-bottom:12px"><i data-w="${all.length?dn/all.length*100:0}"></i></div>
<div class="card"><div style="font-size:20px;font-weight:600">${esc(exName(it.exId))}</div><div class="sm mut">${ls?'Dernière fois : '+ls.map(s=>fn(s.kg)+'×'+s.reps).join(', '):'Première fois'}</div>${sg?`<div class="sm ac">Conseil : ${sg.text}</div>`:''}${e.note?`<div class="sm" style="margin-top:4px">Note : ${esc(e.note)}</div>`:''}
${k?`<button data-act="exInfo" data-k="${k}" data-n="${esc(e.name)}" style="display:block;width:60%;margin:10px auto 0">${figSvg(k)}</button>`:''}</div>
${j>=0?`<div class="card"><div class="row sp"><h2 style="margin:0">Série ${j+1} sur ${it.sets.length}${tg&&tg.reps?`<span class="sm mut" style="font-weight:400"> · objectif ${tg.reps} rép.</span>`:''}</h2><button class="link" data-act="plates" data-i="${i}">Disques</button></div>
<div class="g2" style="margin-top:10px"><div><label style="margin-top:0;text-align:center">kg</label><input class="big" type="text" inputmode="decimal" data-inp="set" data-i="${i}" data-s="${j}" data-f="kg" value="${x.kg??''}" placeholder="${ph(it.exId,j,ls,'kg')}"></div>
<div><label style="margin-top:0;text-align:center">répétitions</label><input class="big" type="text" inputmode="numeric" data-inp="set" data-i="${i}" data-s="${j}" data-f="reps" value="${x.reps??''}" placeholder="${ph(it.exId,j,ls,'reps')}"></div></div>
<button class="btn full" data-act="liveOk" style="margin-top:12px;padding:15px">${ic('check',20)} Valider la série</button></div>`
:`<div class="card" style="text-align:center"><b>Exercice terminé</b><div style="margin-top:10px">${i<n-1?`<button class="btn full" data-act="liveNav" data-v="1">Exercice suivant ${ic('next',18)}</button>`:`<button class="btn full" data-act="liveEnd">Terminer et noter la séance</button>`}</div></div>`}
<div class="card"><div class="chips" style="margin:0">${it.sets.map((s,q)=>`<span class="chip ${s.done?'on':''}">${s.done?fn(s.kg||0)+'×'+s.reps:'Série '+(q+1)}</span>`).join('')}<button class="chip" data-act="setAdd" data-i="${i}">+ série</button><button class="chip" data-act="exNote" data-id="${it.exId}">Note</button></div></div>
<div class="g2"><button class="btn gh" data-act="liveNav" data-v="-1">${ic('back',18)} Précédent</button><button class="btn gh" data-act="liveNav" data-v="1">Suivant ${ic('next',18)}</button></div>
<button class="btn gh full" data-act="liveEnd" style="margin-top:8px">Terminer et noter la séance</button>`};
/* bilan */
function bilRange(){const b=ui.bil,t=today();if(b.mode==='week'){const f=addD(mon(t),7*b.off);return{f,t:addD(f,6),pf:addD(f,-7),pt:addD(f,-1),label:'Semaine du '+fr(f,{day:'numeric',month:'long'})}}
const d=pd(t.slice(0,7)+'-01');d.setMonth(d.getMonth()+b.off);const f=iso(d);return{f,t:iso(new Date(d.getFullYear(),d.getMonth()+1,0)),pf:iso(new Date(d.getFullYear(),d.getMonth()-1,1)),pt:addD(f,-1),label:d.toLocaleDateString('fr-FR',{month:'long',year:'numeric'})}}
function pStats(f,t){const ss=S.sessions.filter(s=>s.date>=f&&s.date<=t),mu={};ss.forEach(s=>s.items.forEach(i=>{const m=(exById(i.exId)||{}).muscle;if(m)mu[m]=(mu[m]||0)+i.sets.length}));
return{n:ss.length,vol:ss.reduce((a,s)=>a+sessVol(s),0),dur:ss.reduce((a,s)=>a+(s.duration||0),0),sets:ss.reduce((a,s)=>a+sessSets(s),0),rpe:avg(ss.filter(s=>s.rpe).map(s=>s.rpe)),
form:avg(ss.filter(s=>s.form).map(s=>s.form)),sleep:avg(ss.filter(s=>s.sleep).map(s=>s.sleep)),top:Object.keys(mu).sort((a,b)=>mu[b]-mu[a])[0]}}
function recsIn(f,t){const best={},out=[];sorted().forEach(s=>s.items.forEach(i=>{const m=Math.max(0,...i.sets.map(x=>x.kg||0));if(!m)return;if(best[i.exId]!=null&&m>best[i.exId]&&s.date>=f&&s.date<=t)out.push(exName(i.exId)+' : '+fn(m,2)+' kg');if(best[i.exId]==null||m>best[i.exId])best[i.exId]=m}));return out}
function heat(y){const by={};S.sessions.forEach(s=>{if(s.date.startsWith(y+'-'))by[s.date]=Math.max(by[s.date]||0,s.rpe||6)});const c=5.6,g=.8;let d=y+'-01-01',r='',ml='',idx=dow(d);
while(d.slice(0,4)==y){const cc=Math.floor(idx/7),v=by[d],x=(cc*(c+g)).toFixed(1);r+=`<rect x="${x}" y="${(12+idx%7*(c+g)).toFixed(1)}" width="${c}" height="${c}" rx="1.2" fill="${v?'var(--ac)':'#242424'}"${v?` fill-opacity="${(.3+.07*v).toFixed(2)}"`:''}/>`;
if(d.slice(8)==='01')ml+=`<text x="${x}" y="8">${pd(d).toLocaleDateString('fr-FR',{month:'short'}).slice(0,3)}</text>`;d=addD(d,1);idx++}
return`<svg class="chart" viewBox="0 0 346 58" role="img" aria-label="Calendrier ${y} des séances">${ml}${r}</svg>`}
V.bilan=()=>{const b=ui.bil,R=bilRange(),a=pStats(R.f,R.t),p=pStats(R.pf,R.pt),recs=recsIn(R.f,R.t),st=exWithData().filter(isStale),
dl=(x,y,d=0)=>p.n?`<div class="xs" style="color:${x>=y?'#2ecc8f':'#ff8f8f'}">${x>=y?'+':''}${fn(x-y,d)} vs avant</div>`:'<div class="xs mut">&nbsp;</div>',
w=[...S.body].filter(x=>x.poids!=null).sort((x,y)=>x.date<y.date?-1:1),wi=w.filter(x=>x.date>=R.f&&x.date<=R.t),wb=w.filter(x=>x.date<R.f).pop(),
fs=S.sessions.filter(s=>s.form&&sessVol(s)>0),hi=fs.filter(s=>s.form>=4),lo=fs.filter(s=>s.form<=2),sl=S.sessions.filter(s=>s.sleep&&sessVol(s)>0),s7=sl.filter(s=>s.sleep>=7),s6=sl.filter(s=>s.sleep<7),
yN=S.sessions.filter(s=>s.date.startsWith(b.year+'-')).length;
return head('Bilan')+`<div class="chips"><button class="chip ${b.mode==='week'?'on':''}" data-act="bilMode" data-v="week">Semaine</button><button class="chip ${b.mode==='month'?'on':''}" data-act="bilMode" data-v="month">Mois</button></div>
<div class="card row sp"><button class="ib" data-act="bilNav" data-v="-1" aria-label="Période précédente">${ic('back')}</button><b>${R.label.charAt(0).toUpperCase()+R.label.slice(1)}</b><button class="ib" data-act="bilNav" data-v="1" aria-label="Période suivante" style="${b.off>=0?'opacity:.3':''}">${ic('next')}</button></div>
<div class="g2" style="margin-bottom:12px"><div class="stat"><div class="xs mut">Séances</div><div class="n"><span class="cnt" data-to="${a.n}">0</span></div>${dl(a.n,p.n)}</div>
<div class="stat"><div class="xs mut">Volume soulevé</div><div class="n">${fn(a.vol/1000,1)} t</div>${dl(a.vol/1000,p.vol/1000,1)}</div>
<div class="stat"><div class="xs mut">Séries</div><div class="n"><span class="cnt" data-to="${a.sets}">0</span></div>${dl(a.sets,p.sets)}</div>
<div class="stat"><div class="xs mut">Temps d'entraînement</div><div class="n">${a.dur?Math.floor(a.dur/60)+' h '+String(Math.round(a.dur%60)).padStart(2,'0'):'–'}</div><div class="xs mut">${a.dur?'durées saisies':'non renseigné'}</div></div>
<div class="stat"><div class="xs mut">Intensité moyenne</div><div class="n">${a.rpe==null?'–':fn(a.rpe)}</div><div class="xs mut">sur 10</div></div>
<div class="stat"><div class="xs mut">Muscle le plus travaillé</div><div class="n" style="font-size:17px;line-height:33px">${a.top||'–'}</div><div class="xs mut">en nombre de séries</div></div></div>
<div class="card"><h2>Records de la période</h2>${recs.map(r=>`<div class="li"><span class="ac">${ic('award',18)}</span><span class="grow sm">${esc(r)}</span></div>`).join('')||'<div class="sm mut">Aucun record sur cette période.</div>'}</div>
<div class="card"><h2>Poids</h2><div class="sm ${wi.length?'':'mut'}">${wi.length?`${fn(wi[wi.length-1].poids)} kg${(wb||wi.length>1)?`, soit ${(d=>(d>0?'+':'')+fn(d))(wi[wi.length-1].poids-(wb?wb.poids:wi[0].poids))} kg sur la période`:''}.`:'Aucun relevé de poids sur cette période.'}</div></div>
<div class="card"><h2>Forme et sommeil</h2><div class="sm">${a.form==null&&a.sleep==null?'<span class="mut">Rien de noté sur cette période.</span>':`Forme moyenne : ${a.form==null?'–':fn(a.form)+'/5'} · Sommeil moyen : ${a.sleep==null?'–':fn(a.sleep)+' h'}`}</div>
<div class="sm mut" style="margin-top:6px">${hi.length>=2&&lo.length>=2?`Quand ta forme est à 4 ou 5, tu soulèves en moyenne ${fn(avg(hi.map(sessVol)),0)} kg par séance, contre ${fn(avg(lo.map(sessVol)),0)} kg quand elle est à 1 ou 2.`:s7.length>=2&&s6.length>=2?`Après 7 h de sommeil ou plus, tu soulèves en moyenne ${fn(avg(s7.map(sessVol)),0)} kg par séance, contre ${fn(avg(s6.map(sessVol)),0)} kg après une nuit plus courte.`:'Note ta forme et ton sommeil sur quelques séances pour voir leur lien avec tes performances.'}</div></div>
${st.length?`<div class="card"><h2>Exercices qui stagnent</h2>${st.map(id=>`<button class="li" data-act="progPick" data-id="${id}"><span class="grow sm">${esc(exName(id))}</span>${ic('next',16)}</button>`).join('')}</div>`:''}
<div class="card"><div class="row sp" style="margin-bottom:8px"><button class="ib" data-act="bilYear" data-v="-1" aria-label="Année précédente">${ic('back')}</button><h2 style="margin:0">Année ${b.year}</h2><button class="ib" data-act="bilYear" data-v="1" aria-label="Année suivante">${ic('next')}</button></div>
${heat(b.year)}<div class="tip">${yN} séance${yN>1?'s':''} en ${b.year}. Une case par jour, plus foncée quand la séance était intense.</div></div>`};
/* sauvegarde */
function doExport(ph){const out=Object.assign({},S,{photos:ph?P:[]}),a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(out)],{type:'application/json'}));a.download='suivi-sport-'+today()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000);
S.settings.lastExport=Date.now();save();toast('Sauvegarde exportée');if(route()==='home')render(false)}
function backupBanner(){if(AUTO.state==='pause')return autoPauseBanner();if(AUTO.state==='ok')return'';const s=S.settings,now=Date.now(),days=Math.floor((now-(Math.max(s.lastExport||0,AUTO.last||0)||s.created||now))/864e5);if(!S.sessions.length||days<30||(s.snooze&&now<s.snooze))return'';
return`<div class="card" style="border:1px solid var(--ac)"><b>Pense à sauvegarder</b><div class="sm mut" style="margin:4px 0 10px">${s.lastExport?`Dernière sauvegarde il y a ${days} jours.`:`Aucune sauvegarde depuis ${days} jours.`} Tes données ne sont stockées que sur ce téléphone.</div><div class="g2"><button class="btn s" data-act="backupNow">Exporter maintenant</button><button class="btn s gh" data-act="snooze">Plus tard</button></div></div>`}
/* poids partagé avec l'application nutrition (même site, même stockage) */
function syncNutri(){try{const w=latest('poids'),raw=localStorage.getItem('nutri_v2');if(w==null||!raw)return;const db=JSON.parse(raw);if(!db||typeof db!=='object'||Array.isArray(db))return;
db.needs=db.needs||{sex:'h',age:'',h:'',w:'',act:'1.55',goal:'m'};if(String(db.needs.w)===String(w))return;db.needs.w=String(w);localStorage.setItem('nutri_v2',JSON.stringify(db))}catch(e){}}
/* photo guidée */
let CAM=null;
function camStop(){if(CAM){CAM.getTracks().forEach(t=>t.stop());CAM=null}}
async function camStart(){camStop();try{CAM=await navigator.mediaDevices.getUserMedia({video:{facingMode:ui.camFace||'environment',width:{ideal:1280},height:{ideal:1706}},audio:false});const v=$('#camV');if(!v){camStop();return}v.srcObject=CAM}
catch(e){toast('Caméra indisponible : utilise la galerie');A.photoAdd(null,true)}}
const SILH=`<svg viewBox="0 0 90 120" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" aria-hidden="true"><g fill="none" stroke="var(--ac)" stroke-width="1" stroke-dasharray="3 3"><circle cx="45" cy="18" r="8"/><path d="M33 30h24l8 30h-6l-3-16v32l-4 38h-7l-2-34-2 34h-7l-4-38V44l-3 16h-6z"/></g></svg>`;
const LOT2A={
setDone(el){const i=+el.dataset.i,j=+el.dataset.s,it=ui.draft.items[i],x=it.sets[j];if(!x.done&&!(x.reps>0)){const l=fillSrc(it,j);if(l){x.kg=x.kg??l.kg;x.reps=l.reps}else return toast('Indique les répétitions')}
x.done=!x.done;if(x.done)restStart(S.settings.rest);partial()},
restAdj(el){if(REST){REST.end+=+el.dataset.v*1000;restTick()}},restStop(){restStop()},
form(el){const v=+el.dataset.v;ui.draft.form=ui.draft.form===v?null:v;partial()},
plates(el){const it=ui.draft&&ui.draft.items[+el.dataset.i];let kg='';if(it){const x=it.sets.find(s=>s.kg>0&&!s.done)||it.sets.find(s=>s.kg>0),sg=suggest(it.exId,ui.draft.date,ui.draft.id);kg=x?x.kg:(sg&&sg.kg)||''}
sheet(`<h2>Calculateur de disques</h2><div class="g2"><div><label style="margin-top:0">Charge totale (kg)</label><input type="text" inputmode="decimal" id="plT" data-inp="plate" value="${kg}"></div><div><label style="margin-top:0">Barre (kg)</label><input type="text" inputmode="decimal" id="plB" data-inp="plate" value="${S.settings.bar}"></div></div><div id="plOut" style="margin-top:12px"></div>`);platesCalc()},
exNote(el){const e=exById(el.dataset.id);if(!e)return;sheet(`<h2>Note : ${esc(e.name)}</h2><textarea id="exNt" rows="3" placeholder="Réglage de la machine, hauteur du banc, prise…">${esc(e.note||'')}</textarea><div class="xs mut" style="margin-top:6px">La note réapparaît à chaque séance avec cet exercice.</div><button class="btn full" data-act="exNoteSave" data-id="${e.id}" style="margin-top:12px">Enregistrer</button>`)},
exNoteSave(el){const e=exById(el.dataset.id);e.note=$('#exNt').value.trim();save();closeSheet();partial()},
liveOpen(){const k=ui.draft.items.findIndex(it=>it.sets.some(x=>!x.done));ui.live={i:Math.max(0,k)};go('live')},
liveOk(){const d=ui.draft,it=d.items[Math.min(ui.live.i,d.items.length-1)],j=it.sets.findIndex(x=>!x.done);if(j<0)return;const x=it.sets[j];
if(!(x.reps>0)){const l=fillSrc(it,j);if(l){x.kg=x.kg??l.kg;x.reps=l.reps}else return toast('Indique les répétitions')}x.done=true;restStart(S.settings.rest);partial()},
liveNav(el){ui.live.i=Math.max(0,Math.min(ui.draft.items.length-1,ui.live.i+ +el.dataset.v));partial()},
liveEnd(){location.hash='#/seance'},
progPick(el){ui.progEx=el.dataset.id;go('progression')},
bilMode(el){ui.bil.mode=el.dataset.v;ui.bil.off=0;partial()},bilNav(el){ui.bil.off=Math.min(0,ui.bil.off+ +el.dataset.v);partial()},bilYear(el){ui.bil.year+= +el.dataset.v;partial()},
backupNow(){doExport(true)},snooze(){S.settings.snooze=Date.now()+7*864e5;refresh()},nutri(){location.href='nutrition/'},
sessSave(){const d=ui.draft;if(!d.date)return toast('Choisis une date');const before=streak().done;
const items=d.items.map(it=>({exId:it.exId,sets:it.sets.filter(x=>x.reps>0).map(x=>({kg:x.kg||0,reps:x.reps}))})).filter(it=>it.sets.length);
const s={id:d.id||uid(),date:d.date,progId:d.progId,name:(d.name||'').trim()||'Séance',rpe:+d.rpe||null,duration:d.duration,note:d.note,form:d.form||null,sleep:d.sleep==null?null:num(d.sleep),items};
const recs=findRecords(s),i=S.sessions.findIndex(x=>x.id===s.id);if(i>=0)S.sessions[i]=s;else S.sessions.push(s);if(recs.length)S.recCount=(S.recCount||0)+recs.length;
ui.newBadges=[];save();ui.draft=null;restStop();const nb=ui.newBadges.splice(0),st=streak();
toast(!before&&st.done?`Objectif de la semaine atteint : ${st.n} semaine${st.n>1?'s':''} de suite`:'Séance enregistrée');location.hash='#/home';if(recs.length||nb.length)setTimeout(()=>celebrate(recs,nb),600)},
photoAdd(el,keep){if(keep!==true){ui.photoDraft=null;ui.photoForm={date:today(),pose:'Face',note:''}}const f=ui.photoForm;
sheet(`<h2>Nouvelle photo</h2><input type="file" accept="image/*" id="phF" data-chg="photoPick" hidden><div class="g2"><button class="btn" data-act="camOpen">Photo guidée</button><button class="btn gh" data-act="photoChoose">Galerie</button></div>
<div class="xs mut" style="margin-top:6px">La photo guidée affiche ta dernière photo de la même pose en transparence, pour reprendre le même cadrage.</div><div id="phPrev" style="margin-top:10px">${ui.photoDraft?`<img src="${ui.photoDraft}" alt="Aperçu" style="width:100%;max-height:260px;object-fit:contain;border-radius:12px">`:''}</div>
<div class="g2"><div><label>Date</label><input type="date" id="phD" value="${f.date}"></div><div><label>Pose</label><select id="phP">${['Face','Profil','Dos','Autre'].map(x=>opt(x,x,f.pose)).join('')}</select></div></div>
<label>Note</label><input type="text" id="phN" value="${esc(f.note)}" placeholder="Poids du jour, remarque…"><button class="btn full" data-act="photoSave" style="margin-top:14px">Enregistrer</button>`)},
camOpen(){if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return toast('Caméra indisponible : utilise la galerie');
ui.photoForm={date:$('#phD').value||today(),pose:$('#phP').value,note:$('#phN').value};const g=P.filter(p=>p.pose===ui.photoForm.pose).sort((a,b)=>a.date<b.date?1:-1)[0];
sheet(`<h2>Photo guidée · ${esc(ui.photoForm.pose)}</h2><div style="position:relative;aspect-ratio:3/4;background:#000;border-radius:12px;overflow:hidden"><video id="camV" autoplay playsinline muted style="width:100%;height:100%;object-fit:cover"></video>${g?`<img id="camG" src="${g.data}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.35;pointer-events:none">`:SILH}</div>
${g?`<label>Transparence de la photo du ${fr(g.date)}</label><input type="range" min="0" max="80" value="35" data-inp="ghost">`:`<div class="xs mut" style="margin-top:6px">Place-toi dans la silhouette. À la prochaine photo de cette pose, celle-ci servira de repère.</div>`}
<div class="g2" style="margin-top:10px"><button class="btn gh" data-act="camFlip">Changer de caméra</button><button class="btn" data-act="camShot">Prendre la photo</button></div><button class="btn gh full" data-act="camBack" style="margin-top:8px">Annuler</button>`);camStart()},
camFlip(){ui.camFace=ui.camFace==='user'?'environment':'user';camStart()},
camBack(){camStop();A.photoAdd(null,true)},
camShot(){const v=$('#camV');if(!v||!v.videoWidth)return toast('La caméra démarre, réessaie');const vw=v.videoWidth,vh=v.videoHeight,sw=Math.min(vw,vh*3/4),sh=sw*4/3,k=Math.min(1,1400/sh),c=document.createElement('canvas');
c.width=Math.round(sw*k);c.height=Math.round(sh*k);c.getContext('2d').drawImage(v,(vw-sw)/2,(vh-sh)/2,sw,sh,0,0,c.width,c.height);ui.photoDraft=c.toDataURL('image/jpeg',.82);camStop();A.photoAdd(null,true)}
};
const LOT2N={plate(){const b=num($('#plB').value);if(b!=null&&b>=0){S.settings.bar=b;save()}platesCalc()},ghost(el){const g=$('#camG');if(g)g.style.opacity=el.value/100}};


'use strict';
/* Suivi sport — Rubriques Débuter, Programmes et À la maison */
/* ---------- Programmes prêts à l'emploi ---------- */
const X={sq:'Squat',dc:'Développé couché (barre ou haltères)',di:'Développé incliné (barre ou haltères)',dips:'Dips (poids du corps ou machine)',conv:'Développé à la machine convergente',fly:'Pec Fly (machine)',
tr:'Tractions (pronation ou supination)',tv:'Tirage vertical à la poulie',row:'Rowing barre ou haltères',th:'Tirage horizontal à la poulie',sdt:'Soulevé de terre (Deadlift)',
dm:'Développé militaire (barre ou haltères)',el:'Élévations latérales (haltères ou poulie)',ois:'Oiseau (haltères, poulie ou machine)',tm:'Tirage menton',
pr:'Presse à cuisses',fe:'Fentes (marchées ou sur place)',ht:'Hip Thrust',le:'Leg Extension',lc:'Leg Curl (allongé ou assis)',
cb:'Curl barre ou haltères',cp:'Curl pupitre (libre ou machine)',cm:'Curl marteau',bf:'Barre au front',et:'Extensions triceps à la poulie haute',cr:'Crunch (sol ou poulie)',ga:'Gainage planche'};
const ANMAP={[X.sq]:'squat',[X.dc]:'bench',[X.tr]:'pullup',[X.dm]:'ohp',[X.cb]:'curl',[X.cm]:'curl',[X.sdt]:'dead',[X.fe]:'lunge',[X.row]:'row',[X.tv]:'lat',[X.ga]:'plank',[X.et]:'push',[X.ht]:'hip',[X.dips]:'dips'};
const PUSH=[[X.dc,'4×8'],[X.di,'3×10'],[X.dm,'3×10'],[X.el,'3×15'],[X.et,'3×12']],PULL=[[X.tr,'4×6 à 10'],[X.row,'3×10'],[X.th,'3×12'],[X.cb,'3×10'],[X.cm,'2×12']],LEGS=[[X.sq,'4×8'],[X.pr,'3×12'],[X.lc,'3×12'],[X.ht,'3×10'],[X.cr,'3×15']];
const HAUT=[[X.dc,'3×8 à 10'],[X.row,'3×8 à 10'],[X.dm,'3×10'],[X.tv,'3×10'],[X.cb,'2×12'],[X.et,'2×12']],BAS=[[X.sq,'3×8 à 10'],[X.sdt,'3×8'],[X.fe,'3×10 par jambe'],[X.lc,'3×12'],[X.ga,'3×30 s']];
const BEG=[
{id:'fb2',name:'Full body 2 jours',lvl:'Tout premier mois',who:'Tu n\'as jamais fait de musculation, ou tu reprends après un long arrêt.',
desc:'Deux séances identiques sur machines guidées. Tu apprends les mouvements sans risque et tu prends l\'habitude de venir.',
plus:['Machines guidées : la trajectoire est sûre','Séance courte, environ 40 minutes','Deux jours suffisent pour progresser au début'],minus:['Vite trop léger : passe au Full body 3 jours après 4 à 6 semaines'],
week:['Full body machines',0,0,'Full body machines',0,0,0],sessions:{'Full body machines':[[X.pr,'3×12'],[X.conv,'3×12'],[X.th,'3×12'],[X.el,'2×15'],[X.cr,'3×15']]},
how:['Commence très léger : la dernière répétition doit rester propre.','Ajoute un peu de charge dès que les 3 séries passent facilement.']},
{id:'fb3',name:'Full body 3 jours',lvl:'Débutant',who:'Le meilleur point de départ : tout le corps travaille trois fois par semaine.',
desc:'La même séance le lundi, le mercredi et le vendredi, avec six mouvements de base. Répéter souvent les mêmes gestes est ce qui fait progresser le plus vite un débutant.',
plus:['Chaque muscle travaille 3 fois par semaine','Peu d\'exercices à apprendre','Un jour de repos entre chaque séance'],minus:['Séance d\'environ une heure','Demande d\'apprendre le squat et le développé couché avec une barre'],
week:['Full body',0,'Full body',0,'Full body',0,0],sessions:{'Full body':[[X.sq,'3×10'],[X.dc,'3×10'],[X.tv,'3×10'],[X.dm,'3×10'],[X.lc,'3×12'],[X.ga,'3×30 s']]},
how:['Les deux premières semaines, travaille la technique avec des charges légères.','Quand tu réussis 3×10, ajoute 2,5 kg à la séance suivante.','Garde ce programme 8 à 12 semaines avant d\'en changer.']},
{id:'hb4',name:'Haut / Bas 4 jours',lvl:'Après 2 à 3 mois',who:'Tu tiens le Full body sans difficulté et tu veux plus de volume.',
desc:'Deux séances pour le haut du corps et deux pour le bas. Chaque muscle travaille deux fois par semaine, avec plus d\'exercices par séance.',
plus:['Plus de travail par muscle','Séances plus variées','Mercredi et week-end libres'],minus:['Quatre jours à tenir chaque semaine','Le soulevé de terre demande une bonne technique'],
week:['Haut du corps','Bas du corps',0,'Haut du corps','Bas du corps',0,0],sessions:{'Haut du corps':HAUT,'Bas du corps':BAS},
how:['Travaille dans la fourchette indiquée : en haut de la fourchette sur toutes les séries, augmente la charge.','Si une séance saute, reprends là où tu t\'es arrêté, sans doubler.']}];
const OPT=[
{id:'ppl3',name:'Push Pull Legs 3 jours',lvl:'Intermédiaire',who:'Tu veux des séances ciblées sans y passer toute la semaine.',
desc:'Trois séances par type de mouvement : pousser (pectoraux, épaules, triceps), tirer (dos, biceps) et jambes.',
plus:['Séances logiques : les muscles d\'une séance travaillent ensemble','Un jour de repos entre chaque séance','Facile à passer en 6 jours plus tard'],minus:['Chaque muscle ne travaille qu\'une fois par semaine'],
week:['Push',0,'Pull',0,'Legs',0,0],sessions:{Push:PUSH,Pull:PULL,Legs:LEGS},how:['Commence chaque séance par le premier exercice, le plus lourd.','Note tes charges : l\'objectif est d\'ajouter une répétition ou un peu de poids chaque semaine.']},
{id:'ppl6',name:'Push Pull Legs 6 jours',lvl:'Confirmé',who:'Tu as du temps, une bonne récupération et au moins un an de pratique.',
desc:'Le même enchaînement Push, Pull, Legs fait deux fois par semaine. Chaque muscle travaille deux fois.',
plus:['Gros volume d\'entraînement','Chaque muscle travaille deux fois par semaine'],minus:['Six jours par semaine : la récupération et le sommeil doivent suivre','Un seul jour de repos'],
week:['Push','Pull','Legs','Push','Pull','Legs',0],sessions:{Push:PUSH,Pull:PULL,Legs:LEGS},how:['Sur la deuxième moitié de semaine, tu peux alléger un peu les charges et monter les répétitions.','Fatigue qui s\'installe ou charges qui baissent : prends une semaine plus légère.']},
{id:'hb4b',name:'Haut / Bas 4 jours',lvl:'Débutant à intermédiaire',who:'Tu veux travailler chaque muscle deux fois par semaine en quatre séances.',
desc:'Deux séances pour le haut du corps, deux pour le bas. Un bon équilibre entre fréquence et temps passé à la salle.',
plus:['Chaque muscle travaille deux fois par semaine','Mercredi et week-end libres','Convient longtemps'],minus:['Séances du haut assez longues'],
week:['Haut du corps','Bas du corps',0,'Haut du corps','Bas du corps',0,0],sessions:{'Haut du corps':HAUT,'Bas du corps':BAS},how:['En haut de la fourchette de répétitions sur toutes les séries, augmente la charge.']},
{id:'split5',name:'Split 5 jours',lvl:'Intermédiaire',who:'Tu aimes consacrer une séance entière à un seul groupe musculaire.',
desc:'Un groupe musculaire par jour, du lundi au vendredi. C\'est l\'organisation classique des salles de musculation.',
plus:['Beaucoup d\'exercices pour chaque muscle','Séances courtes et ciblées','Week-end libre'],minus:['Chaque muscle ne travaille qu\'une fois par semaine','Une séance manquée, c\'est un muscle non travaillé de la semaine'],
week:['Pectoraux','Dos','Épaules','Jambes','Bras',0,0],sessions:{Pectoraux:[[X.dc,'4×8'],[X.di,'3×10'],[X.fly,'3×12'],[X.dips,'3×10']],Dos:[[X.tr,'4×8'],[X.row,'4×10'],[X.tv,'3×12'],[X.sdt,'3×6']],
'Épaules':[[X.dm,'4×8'],[X.el,'4×15'],[X.ois,'3×15'],[X.tm,'3×12']],Jambes:[[X.sq,'4×8'],[X.pr,'3×12'],[X.le,'3×15'],[X.lc,'3×12'],[X.ht,'3×10']],Bras:[[X.cb,'3×10'],[X.cp,'3×12'],[X.bf,'3×10'],[X.et,'3×12']]},
how:['Ne saute pas la séance jambes : c\'est la moitié du corps.','Garde le même ordre de jours pour laisser récupérer épaules et bras.']}];
const progDef=id=>BEG.concat(OPT,HOME).find(p=>p.id===id);
function exIdByName(n){let e=S.exercises.find(x=>x.name.toLowerCase()===n.toLowerCase());if(!e){const d=DEFEX.concat(HOMEEX).find(x=>x[0]===n);e={id:uid(),name:n,muscle:d?d[1]:'Pectoraux'};S.exercises.push(e)}return e.id}
const nDays=p=>p.week.filter(Boolean).length;
const progCard=(p,i)=>`<button class="card figb" style="--i:${i};width:100%;display:block" data-act="progOpen" data-id="${p.id}"><div class="row sp"><b style="font-size:16px">${esc(p.name)}</b><span class="ac">${ic('next',18)}</span></div>
<div style="margin:6px 0 4px"><span class="tag a">${nDays(p)} jours par semaine</span><span class="tag">${esc(p.lvl)}</span></div><div class="sm mut" style="margin-bottom:8px">${esc(p.who)}</div>
<div class="wk mini">${p.week.map(w=>`<div class="${w?'on':''}" style="${w?'background:var(--ac)':''}"></div>`).join('')}</div></button>`;
const GUIDE=[['Avant de commencer','Échauffe-toi 5 à 10 minutes (vélo, rameur ou marche rapide). Avant chaque exercice, fais une ou deux séries avec une charge très légère.'],
['Lire « 3×10 »','Trois séries de dix répétitions. Tu fais dix répétitions, tu te reposes, et tu recommences, trois fois en tout.'],
['Choisir la bonne charge','Prends une charge avec laquelle tu termines la série en gardant encore deux répétitions en réserve. Si la technique se dégrade, c\'est trop lourd.'],
['Le repos entre les séries','Compte 1 min 30 à 2 minutes. Sur le squat et le soulevé de terre, tu peux aller jusqu\'à 3 minutes.'],
['Comment progresser','Quand tu réussis toutes les séries au nombre de répétitions prévu, ajoute la plus petite charge possible (souvent 2,5 kg) à la séance suivante. Note chaque séance dans l\'application pour le voir.'],
['La technique avant la charge','Un mouvement complet et contrôlé avec peu de poids vaut mieux qu\'un demi-mouvement lourd. Descends lentement, sans élan.'],
['La récupération','Laisse au moins un jour entre deux séances qui travaillent les mêmes muscles. Les courbatures des premières semaines sont normales et diminuent vite.'],
['Quand s\'arrêter','Une douleur vive ou dans une articulation n\'est pas une courbature : arrête l\'exercice. Si elle persiste, demande l\'avis d\'un médecin ou d\'un kinésithérapeute.']];
V.debuter=()=>head('Débuter')+`<div class="card"><h2>Par où commencer</h2><div class="sm mut">Trois programmes, du plus simple au plus complet. Commence par celui qui correspond à ton niveau, puis passe au suivant quand il devient facile. Chaque programme montre les mouvements en animation.</div></div>
${BEG.map(progCard).join('')}<div class="card"><h2>Comment faire les séances</h2>${GUIDE.map((g,i)=>`<details ${i?'':'open'}><summary><span>${g[0]}</span><span class="mut">${ic('next',16)}</span></summary><div class="sm mut" style="padding-bottom:10px">${g[1]}</div></details>`).join('')}</div>`;
V.programmes=()=>head('Programmes')+`<div class="card"><h2>Choisir son organisation</h2><div class="sm mut">Quatre façons de répartir ses séances dans la semaine. Ouvre un programme pour voir le détail, les exercices animés, et l'ajouter à ton planning.</div></div>
${OPT.map(progCard).join('')}<div class="card"><h2>Comment choisir</h2><ul class="pl mut"><li>3 jours disponibles : Push Pull Legs 3 jours.</li><li>4 jours : Haut / Bas.</li><li>5 jours, une séance par muscle : Split 5 jours.</li><li>6 jours et une bonne récupération : Push Pull Legs 6 jours.</li></ul>
<div class="xs mut" style="margin-top:8px">Le meilleur programme est celui que tu arrives à suivre chaque semaine. Si tu débutes, passe d'abord par la rubrique Débuter.</div></div>`;
V.prog=()=>{const p=progDef(ui.progSel)||BEG[1],an=[...new Set(Object.values(p.sessions).flat().map(e=>amap(e[0],p)).filter(Boolean))].slice(0,6);
return`<div class="row" style="margin-bottom:14px"><button class="ib" data-act="histBack" aria-label="Retour">${ic('back')}</button><h1>${esc(p.name)}</h1></div>
<div class="card"><div style="margin-bottom:6px"><span class="tag a">${nDays(p)} jours par semaine</span><span class="tag">${esc(p.lvl)}</span></div><div class="sm">${esc(p.desc)}</div>
<div class="sm mut" style="margin-top:8px">Pour qui : ${esc(p.who)}</div><div class="g2" style="margin-top:10px"><div><b class="sm ac">Avantages</b><ul class="pl mut">${p.plus.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><b class="sm">Limites</b><ul class="pl mut">${p.minus.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div></div>
<div class="card"><h2>La semaine</h2><div class="wk">${p.week.map((w,i)=>`<div class="${w?'on':''}" style="--i:${i}"><b>${DAYS[i].slice(0,3)}</b>${w?esc(w):'Repos'}</div>`).join('')}</div></div>
<div class="card"><h2>Exemples en animation</h2><div class="g2">${an.map((k,i)=>`<button class="figb" style="--i:${i}" data-act="exInfo" data-k="${k}">${figSvg(k)}<div class="sm" style="margin:5px 2px 4px">${esc(AN[k].n)}</div></button>`).join('')}</div><div class="xs mut" style="margin-top:6px">Touche une animation pour voir les consignes.</div></div>
${Object.keys(p.sessions).map(n=>`<div class="card"><h2>Séance « ${esc(n)} »</h2>${p.sessions[n].map(e=>{const k=amap(e[0],p);return`<${k?'button':'div'} class="li" ${k?`data-act="exInfo" data-k="${k}" data-n="${esc(e[0])}"`:''}><span class="${k?'ac':'mut'}" style="display:inline-flex;opacity:${k?1:.25}">${ic('play',20)}</span><span class="grow sm">${esc(e[0])}</span><b class="sm" style="white-space:nowrap">${e[1]}</b></${k?'button':'div'}>`}).join('')}</div>`).join('')}
<div class="card"><h2>Comment le suivre</h2><ul class="pl mut">${p.how.map(x=>`<li>${esc(x)}</li>`).join('')}<li>Repos de 1 min 30 à 2 minutes entre les séries.</li></ul></div>
<button class="btn full" data-act="progUse" data-id="${p.id}">${ic('cal',18)} Utiliser ce programme dans mon planning</button>
<div class="xs mut" style="text-align:center;margin-top:8px">Les séances et leurs exercices seront créés, et ta semaine type remplacée.</div>`};

/* ---------- À la maison : poids du corps ---------- */
const PL={head:[151,96],sh:[138,102],hip:[100,113],elb:[139,121],hand:[140,140]};
Object.assign(AN,{
pushup:{n:'Pompes',a:{...PL,knee:[70,126],foot:[40,138]},b:{head:[150,122],sh:[137,125],hip:[100,129],elb:[122,130],hand:[140,140],knee:[70,134],foot:[40,138]},
tips:['Mains un peu plus larges que les épaules, corps bien aligné.','Descends la poitrine près du sol, coudes à environ 45° du buste.','Pousse jusqu\'à tendre les bras. Trop dur : pose les genoux au sol.']},
bwsquat:{n:'Squat au poids du corps',a:{...STD,elb:[106,64],hand:[108,84]},b:{head:[110,61],sh:[104,74],hip:[84,106],knee:[112,112],foot:[100,140],elb:[122,76],hand:[141,74]},
tips:['Pieds largeur d\'épaules, bras tendus devant toi pour l\'équilibre.','Descends les fesses vers l\'arrière, comme pour t\'asseoir, dos droit.','Remonte en poussant dans les talons.']},
bwlunge:{n:'Fentes',a:{head:[100,32],sh:[100,48],hip:[100,84],knee:[110,112],foot:[120,140],knee2:[90,112],foot2:[76,138],elb:[101,68],hand:[102,88]},
b:{head:[100,54],sh:[100,70],hip:[100,106],knee:[127,112],foot:[124,140],knee2:[92,134],foot2:[66,134],elb:[101,90],hand:[102,110]},
tips:['Fais un grand pas, buste droit.','Descends jusqu\'à ce que le genou arrière frôle le sol.','Pousse sur la jambe avant pour remonter, genou dans l\'axe du pied.']},
bridge:{n:'Pont fessier',a:{head:[40,134],sh:[54,136],hip:[90,134],knee:[116,112],foot:[124,140],elb:[72,138],hand:[90,139]},b:{hip:[92,112],knee:[119,108]},
tips:['Allongé sur le dos, pieds à plat près des fesses.','Monte le bassin jusqu\'à aligner épaules, hanches et genoux.','Serre les fessiers une seconde en haut, puis redescends sans poser complètement.']},
crunch:{n:'Crunch',a:{head:[40,132],sh:[54,136],hip:[92,136],knee:[116,112],foot:[128,140],elb:[46,120],hand:[40,124]},b:{head:[53,109],sh:[61,123],elb:[64,104],hand:[56,103]},
tips:['Allongé sur le dos, genoux pliés, mains près des tempes.','Enroule le buste en décollant les épaules, bas du dos au sol.','Ne tire pas sur la nuque. Redescends lentement.']},
chairdips:{n:'Dips sur chaise',props:'<rect x="38" y="100" width="34" height="6" rx="2" fill="#444"/><path d="M42 106v34M68 106v34M40 100V66" stroke="#444" stroke-width="4" stroke-linecap="round"/>',
a:{head:[73,47],sh:[71,62],hip:[84,98],knee:[112,118],foot:[138,140],elb:[70,81],hand:[70,100]},b:{head:[77,68],sh:[74,83],hip:[86,118],knee:[113,126],elb:[57,90]},
tips:['Mains sur le bord d\'une chaise stable, calée contre un mur.','Descends en pliant les coudes vers l\'arrière, dos près de la chaise.','Remonte en poussant. Plus facile genoux pliés, plus dur jambes tendues.']},
climber:{n:'Mountain climbers',a:{...PL,knee:[70,125],foot:[40,138],knee2:[124,119],foot2:[108,135]},b:{knee:[124,119],foot:[108,135],knee2:[70,125],foot2:[40,138]},
tips:['Position de pompe, bras tendus, épaules au-dessus des mains.','Ramène un genou vers la poitrine, puis alterne rapidement.','Garde les hanches basses et le dos plat.']},
wallsit:{n:'Chaise contre le mur',props:'<path d="M70 20v122" stroke="#444" stroke-width="5" stroke-linecap="round"/>',
a:{head:[80,58],sh:[78,74],hip:[78,110],knee:[108,110],foot:[108,140],elb:[84,92],hand:[98,103]},b:{head:[80,60],sh:[78,76],elb:[84,94]},
tips:['Dos plaqué au mur, cuisses à l\'horizontale, genoux à 90°.','Pieds à plat, genoux au-dessus des chevilles.','Tiens la position sans t\'appuyer sur les cuisses avec les mains.']},
superman:{n:'Superman',a:{head:[150,131],sh:[136,134],hip:[100,134],knee:[70,136],foot:[42,137],elb:[153,137],hand:[170,137]},b:{head:[148,116],sh:[134,126],elb:[152,120],hand:[168,112],knee:[70,132],foot:[44,122]},
tips:['Allongé sur le ventre, bras tendus devant toi.','Décolle en même temps la poitrine, les bras et les jambes.','Tiens une seconde en haut, regard vers le sol, puis redescends.']}
});
const H={po:'Pompes',pg:'Pompes sur les genoux',sq:'Squat au poids du corps',pf:'Pont fessier',su:'Superman',dc:'Dips sur chaise',pp:'Pompes piquées',ch:'Chaise contre le mur',mc:'Mountain climbers'};
const HOMEEX=[[H.po,'Pectoraux'],[H.pg,'Pectoraux'],[H.sq,'Quadriceps'],[H.pf,'Fessiers'],[H.su,'Dos'],[H.dc,'Triceps'],[H.pp,'Épaules'],[H.ch,'Quadriceps'],[H.mc,'Abdos']];
Object.assign(ANMAP,{[H.po]:'pushup',[H.pg]:'pushup',[H.sq]:'bwsquat',[H.pf]:'bridge',[H.su]:'superman',[H.dc]:'chairdips',[H.ch]:'wallsit',[H.mc]:'climber',[X.cr]:'crunch'});
const amap=(n,p)=>{const k=ANMAP[n];return p&&p.home&&k==='lunge'?'bwlunge':k};
const HOME=[
{id:'hm1',home:1,name:'Maison débutant',lvl:'Débutant',who:'Tu débutes et tu n\'as aucun matériel.',
desc:'Une séance complète de six mouvements, trois fois par semaine, à faire dans son salon en 30 minutes environ.',
plus:['Aucun matériel','Tout le corps travaille à chaque séance','Un jour de repos entre chaque séance'],minus:['Peu de travail du dos sans barre de traction'],
week:['Maison full body',0,'Maison full body',0,'Maison full body',0,0],sessions:{'Maison full body':[[H.sq,'3×12'],[H.pg,'3×8'],[H.pf,'3×15'],[X.fe,'3×8 par jambe'],[H.su,'3×12'],[X.ga,'3×20 s']]},
how:['Quand tu réussis toutes les séries, ajoute 2 répétitions par série la semaine suivante.','Dès que 3×12 pompes sur les genoux passent, essaie les pompes classiques.']},
{id:'hm2',home:1,name:'Maison haut / bas',lvl:'Intermédiaire',who:'Les pompes classiques ne te posent plus de problème.',
desc:'Deux séances pour le haut du corps et deux pour le bas, avec des variantes plus dures et des exercices tenus dans le temps.',
plus:['Plus de volume par muscle','Seule une chaise est nécessaire','Mercredi et week-end libres'],minus:['Quatre séances par semaine','Les pompes piquées demandent de l\'habitude'],
week:['Maison haut','Maison bas',0,'Maison haut','Maison bas',0,0],
sessions:{'Maison haut':[[H.po,'4×10'],[H.dc,'3×12'],[H.pp,'3×8'],[H.su,'3×15'],[X.ga,'3×45 s']],'Maison bas':[[H.sq,'4×20'],[X.fe,'3×12 par jambe'],[H.pf,'3×20'],[H.ch,'3×40 s'],[H.mc,'3×30 s'],[X.cr,'3×20']]},
how:['Pour durcir sans poids : descends en 3 secondes, ou marque une pause en bas.','Pompes piquées : fesses en l\'air, corps en V inversé, tu descends la tête entre les mains.']},
{id:'hm3',home:1,name:'Circuit express',lvl:'Tous niveaux',who:'Tu as 20 minutes et tu veux transpirer.',
desc:'Six exercices enchaînés : 30 secondes d\'effort, 15 secondes de repos, 4 tours. Utilise le chrono de la rubrique À la maison.',
plus:['20 minutes, échauffement compris','Travaille aussi le cardio','Sans matériel'],minus:['Moins efficace pour la force pure','Intense : commence par 2 ou 3 tours'],
week:[0,'Circuit express',0,'Circuit express',0,'Circuit express',0],sessions:{'Circuit express':[[H.sq,'30 s'],[H.po,'30 s'],[H.mc,'30 s'],[X.fe,'30 s'],[X.cr,'30 s'],[X.ga,'30 s']]},
how:['Enchaîne les six exercices, puis repose-toi une minute avant le tour suivant.','Garde une technique propre : ralentis plutôt que de bâcler.']}];
/* chrono de circuit */
let CH=null,AC=null;
function beep(f){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=f;g.gain.value=.15;o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+.2)}catch(e){}if(navigator.vibrate)navigator.vibrate(150)}
function chStop(){if(CH){clearInterval(CH.t);if(CH.lock)CH.lock.release().catch(()=>{});CH=null}}
const chIdle=()=>`<div class="mut sm" style="padding:22px 0">Règle le chrono, puis touche Démarrer.</div>`;
function chTick(){const el=$('#chBox');if(!el||!CH){chStop();return}let left=Math.ceil((CH.end-Date.now())/1000);
if(left<=0){if(CH.phase==='work'){CH.i++;if(CH.i>=CH.e*CH.n){chStop();beep(880);el.innerHTML=`<div class="ac" style="font-size:30px;font-weight:600;padding:14px 0">Terminé</div>`;return}
if(CH.r>0){CH.phase='rest';CH.end=Date.now()+CH.r*1000;beep(440)}else{CH.end=Date.now()+CH.w*1000;beep(880)}}else{CH.phase='work';CH.end=Date.now()+CH.w*1000;beep(880)}
left=Math.ceil((CH.end-Date.now())/1000)}
const w=CH.phase==='work';el.innerHTML=`<div class="sm ${w?'ac':'mut'}" style="font-weight:600">${w?'Effort':CH.phase==='rest'?'Repos':'Prépare-toi'}</div><div style="font-size:64px;font-weight:600;line-height:1.1;font-variant-numeric:tabular-nums;color:${w?'var(--ac)':'#fff'}">${left}</div>
<div class="xs mut">Tour ${Math.min(CH.n,Math.floor(CH.i/CH.e)+1)}/${CH.n} · exercice ${CH.i%CH.e+1}/${CH.e}</div>`}
V.maison=()=>{chStop();const c=ui.ch||{w:30,r:15,e:6,n:4},f=(id,l,v)=>`<div><label style="margin-top:0">${l}</label><input type="number" inputmode="numeric" id="${id}" value="${v}"></div>`;
return head('À la maison')+`<div class="card"><h2>S'entraîner sans matériel</h2><div class="sm mut">Trois programmes au poids du corps, à faire chez soi. Il te faut un peu de place au sol et, pour certains exercices, une chaise stable. Chaque mouvement est montré en animation.</div></div>
${HOME.map(progCard).join('')}
<div class="card"><h2>Chrono de circuit</h2><div class="g2">${f('chW','Effort (secondes)',c.w)}${f('chR','Repos (secondes)',c.r)}${f('chE','Exercices par tour',c.e)}${f('chT','Tours',c.n)}</div>
<div id="chBox" style="text-align:center;margin:10px 0">${chIdle()}</div><div class="g2"><button class="btn" data-act="chStart">Démarrer</button><button class="btn gh" data-act="chStop">Arrêter</button></div>
<div class="xs mut" style="margin-top:8px">Un bip et une vibration marquent chaque changement. L'écran reste allumé pendant le chrono si ton téléphone le permet.</div></div>
<div class="card"><h2>Progresser sans poids</h2><ul class="pl mut"><li>Ajoute des répétitions, puis une série.</li><li>Ralentis la descente (3 secondes) ou marque une pause en bas.</li><li>Passe à une variante plus dure : pompes sur les genoux, puis classiques, puis pieds surélevés.</li><li>Réduis le temps de repos.</li></ul>
<div class="sm mut" style="margin-top:10px">Le dos est le point faible du poids du corps. Si tu peux, ajoute une barre de traction de porte : c'est le seul achat vraiment utile.</div>
<div class="xs mut" style="margin-top:8px">Pour noter une séance à la maison, laisse la charge à 0 et indique les répétitions, ou les secondes pour les exercices tenus.</div></div>`};


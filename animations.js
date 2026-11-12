'use strict';
/* Suivi sport — Animations d'exercices */
/* ---------- Animations d'exercices (bonhomme vu de profil, entre deux positions) ---------- */
const STD={head:[100,30],sh:[100,46],hip:[100,82],knee:[100,111],foot:[100,140]};
const AN={
squat:{n:'Squat',bar:'sh',a:{...STD,elb:[107,62],hand:[104,48]},b:{head:[110,61],sh:[104,74],hip:[84,106],knee:[112,112],foot:[100,140],elb:[110,90],hand:[107,76]},
tips:['Pieds largeur d\'épaules, pointes légèrement ouvertes.','Descends en poussant les fesses vers l\'arrière, dos droit, genoux dans l\'axe des pieds.','Remonte en poussant dans les talons, sans décoller ceux-ci.']},
bench:{n:'Développé couché',bar:'hand',props:'<rect x="46" y="110" width="84" height="6" rx="2" fill="#444"/><path d="M58 116v24M120 116v24" stroke="#444" stroke-width="4"/>',
a:{head:[54,101],sh:[68,104],hip:[106,104],knee:[134,108],foot:[138,140],elb:[68,84],hand:[68,64]},b:{elb:[82,112],hand:[70,96]},
tips:['Omoplates serrées, pieds bien à plat au sol.','Descends la barre au milieu de la poitrine, coudes à environ 45° du buste.','Pousse jusqu\'à tendre les bras, sans décoller les fesses du banc.']},
pullup:{n:'Tractions',props:'<path d="M78 24h44" stroke="var(--ac)" stroke-width="4" stroke-linecap="round"/>',
a:{head:[105,52],sh:[100,62],hip:[100,99],knee:[103,121],foot:[92,140],elb:[100,43],hand:[100,24]},b:{head:[93,12],sh:[100,44],hip:[100,81],knee:[103,104],foot:[92,123],elb:[116,34],hand:[100,24]},
tips:['Pars bras tendus, épaules basses.','Tire les coudes vers les hanches jusqu\'à passer le menton au-dessus de la barre.','Redescends lentement. Trop dur au début : utilise la machine assistée ou un élastique.']},
ohp:{n:'Développé militaire',bar:'hand',a:{...STD,elb:[110,62],hand:[106,44]},b:{...STD,elb:[103,27],hand:[102,8]},
tips:['Barre au niveau des clavicules, abdos et fessiers serrés.','Pousse à la verticale jusqu\'à tendre les bras au-dessus de la tête.','Ne cambre pas le bas du dos : si ça arrive, la charge est trop lourde.']},
curl:{n:'Curl',bar:'hand',r:6,a:{...STD,elb:[101,66],hand:[103,86]},b:{...STD,elb:[101,66],hand:[112,50]},
tips:['Coudes collés au corps, ils ne bougent pas.','Monte la charge en contractant le biceps, sans balancer le buste.','Redescends lentement jusqu\'à presque tendre le bras.']},
dead:{n:'Soulevé de terre',bar:'hand',a:{head:[124,66],sh:[114,76],hip:[84,98],knee:[108,113],foot:[100,140],elb:[113,96],hand:[112,116]},b:{...STD,elb:[101,66],hand:[102,86]},
tips:['Barre contre les tibias, dos plat, poitrine sortie.','Pousse dans le sol avec les jambes et garde la barre près du corps.','Termine debout, hanches verrouillées, sans te pencher en arrière. Ne jamais arrondir le dos.']},
lunge:{n:'Fentes',bar:'hand',r:6,a:{head:[100,32],sh:[100,48],hip:[100,84],knee:[110,112],foot:[120,140],knee2:[90,112],foot2:[76,138],elb:[101,68],hand:[102,88]},
b:{head:[100,54],sh:[100,70],hip:[100,106],knee:[127,112],foot:[124,140],knee2:[92,134],foot2:[66,134],elb:[101,90],hand:[102,110]},
tips:['Fais un grand pas, buste droit.','Descends jusqu\'à ce que le genou arrière frôle le sol.','Pousse sur la jambe avant pour remonter, genou dans l\'axe du pied.']},
row:{n:'Rowing',bar:'hand',a:{head:[129,70],sh:[118,78],hip:[86,96],knee:[106,114],foot:[100,140],elb:[118,97],hand:[118,116]},b:{elb:[102,88],hand:[112,104]},
tips:['Buste penché à environ 45°, dos plat, genoux fléchis.','Tire la barre vers le nombril en serrant les omoplates.','Le buste ne bouge pas : seuls les bras travaillent.']},
lat:{n:'Tirage vertical',bar:'hand',r:5,cable:[105,4],props:'<rect x="86" y="108" width="28" height="6" rx="2" fill="#444"/><path d="M100 114v26" stroke="#444" stroke-width="4"/>',
a:{head:[100,52],sh:[100,68],hip:[100,104],knee:[126,104],foot:[126,138],elb:[108,50],hand:[106,30]},b:{elb:[116,80],hand:[110,62]},
tips:['Buste légèrement incliné en arrière, poitrine sortie.','Tire la barre vers le haut de la poitrine, coudes vers le bas.','Contrôle la remontée, bras presque tendus en haut.']},
plank:{n:'Gainage planche',a:{head:[145,106],sh:[131,112],hip:[96,121],knee:[66,130],foot:[36,138],elb:[132,137],hand:[150,138]},b:{sh:[131,111],hip:[96,119]},
tips:['Coudes sous les épaules, corps aligné de la tête aux talons.','Serre les abdos et les fessiers, ne creuse pas le bas du dos.','Respire normalement. Arrête la série quand le bassin s\'affaisse.']},
push:{n:'Extensions triceps',bar:'hand',r:5,cable:[128,6],a:{...STD,elb:[104,68],hand:[120,58]},b:{...STD,elb:[104,68],hand:[108,87]},
tips:['Coudes serrés contre le corps, ils restent fixes.','Pousse vers le bas jusqu\'à tendre complètement les bras.','Remonte lentement jusqu\'à l\'horizontale des avant-bras.']},
hip:{n:'Hip Thrust',bar:'hip',props:'<rect x="28" y="96" width="36" height="8" rx="2" fill="#444"/><path d="M36 104v36M58 104v36" stroke="#444" stroke-width="4"/>',
a:{head:[46,86],sh:[58,92],hip:[88,114],knee:[117,108],foot:[120,140],elb:[72,108],hand:[88,114]},b:{hip:[94,96],knee:[121,108],elb:[75,100],hand:[94,96]},
tips:['Haut du dos en appui sur le banc, barre sur le pli des hanches.','Monte le bassin jusqu\'à aligner épaules, hanches et genoux.','Serre les fessiers une seconde en haut, puis redescends en contrôlant.']},
dips:{n:'Dips',props:'<path d="M84 79h32M100 79v61" stroke="#444" stroke-width="4" stroke-linecap="round"/>',
a:{head:[100,25],sh:[100,40],hip:[102,76],knee:[105,104],foot:[88,122],elb:[100,59],hand:[100,78]},b:{head:[112,49],sh:[104,62],hip:[100,97],knee:[104,124],foot:[88,138],elb:[86,66],hand:[100,78]},
tips:['Pars bras tendus, épaules basses, buste légèrement penché.','Descends jusqu\'à ce que les bras soient à peu près à l\'horizontale.','Remonte en poussant. Trop dur au début : utilise la machine assistée.']}
};
const figSvg=k=>`<svg class="fig" data-an="${k}" viewBox="0 0 200 160" role="img" aria-label="Animation : ${esc(AN[k].n)}"><line x1="10" y1="142" x2="190" y2="142" stroke="#2c2c2c" stroke-width="2"/>${AN[k].props||''}<g></g></svg>`;
function drawFig(svg,t){const a=AN[svg.dataset.an];if(!a)return;const J={};for(const k in a.a){const p=a.a[k],q=a.b[k]||p;J[k]=[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t]}
const L=(p,q,w,c)=>`<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${c||'#fff'}" stroke-width="${w}" stroke-linecap="round"/>`;
let s='';if(a.cable)s+=L(a.cable,J.hand,1.5,'var(--ac)');
if(J.knee2)s+=L(J.hip,J.knee2,5,'#8a8a8a')+L(J.knee2,J.foot2,5,'#8a8a8a');
s+=L(J.hip,J.knee,5.5)+L(J.knee,J.foot,5.5)+L(J.sh,J.hip,6.5)+L(J.sh,J.head,4)+`<circle cx="${J.head[0].toFixed(1)}" cy="${J.head[1].toFixed(1)}" r="9" fill="#fff"/>`+L(J.sh,J.elb,4.5,'#d8d8d8')+L(J.elb,J.hand,4.5,'#d8d8d8');
if(a.bar){const p=J[a.bar];s+=`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${a.r||10}" fill="#0b0b0b" stroke="var(--ac)" stroke-width="3"/><circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2" fill="var(--ac)"/>`}
svg.lastElementChild.innerHTML=s}
const RM=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
function tick(ts){const f=document.querySelectorAll('svg.fig');if(f.length){const t=RM?.5:(1-Math.cos(ts/2600*2*Math.PI))/2;f.forEach(x=>drawFig(x,t))}requestAnimationFrame(tick)}


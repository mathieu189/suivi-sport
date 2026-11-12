'use strict';
/* Suivi sport — Courbes, barres et radar */
/* ---------- Graphiques ---------- */
const empty=t=>`<div class="empty">${t}</div>`;
function lineChart(pts,o={}){if(!pts.length)return empty(o.empty||'Pas encore de données.');
const W=340,H=150,L=36,R=12,T=14,B=22;let vs=pts.map(p=>p.v);if(o.ref!=null)vs=vs.concat(o.ref);
let mn=Math.min(...vs),mx=Math.max(...vs);if(mn===mx){mn-=1;mx+=1}const pad=(mx-mn)*.14;mn-=pad;mx+=pad;
const X=i=>pts.length===1?L+(W-L-R)/2:L+i*(W-L-R)/(pts.length-1),Y=v=>T+(mx-v)*(H-T-B)/(mx-mn);
let g='';for(let k=0;k<3;k++){const v=mn+pad+k*(mx-mn-2*pad)/2,y=Y(v).toFixed(1);g+=`<line x1="${L}" y1="${y}" x2="${W-R}" y2="${y}" stroke="#262626"/><text x="${L-5}" y="${+y+3.5}" text-anchor="end">${fn(v)}</text>`}
const co=pts.map((p,i)=>X(i).toFixed(1)+','+Y(p.v).toFixed(1));
let s=`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label||'Courbe')}">${g}`;
if(o.ref!=null)s+=`<line x1="${L}" y1="${Y(o.ref)}" x2="${W-R}" y2="${Y(o.ref)}" stroke="#666" stroke-dasharray="4 4"/><text x="${W-R}" y="${Y(o.ref)-4}" text-anchor="end">cible ${fn(o.ref)}</text>`;
if(o.area&&pts.length>1)s+=`<path class="ar" d="M${co.join(' L')} L${X(pts.length-1)},${H-B} L${X(0)},${H-B} Z" fill="var(--ac)"/>`;
if(pts.length>1)s+=`<polyline class="ln" pathLength="1" points="${co.join(' ')}" fill="none" stroke="var(--ac)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
pts.forEach((p,i)=>{const show=pts.length<=24||i===pts.length-1;
s+=`<circle class="dot" style="--d:${Math.min(1200,500+i*45)}ms" cx="${X(i)}" cy="${Y(p.v)}" r="${show?3.5:0}" fill="var(--ac)"/><circle cx="${X(i)}" cy="${Y(p.v)}" r="13" fill="transparent" data-act="tip" data-tip="${esc(p.l+' : '+fn(p.v,2)+' '+(o.unit||''))}"/>`});
s+=`<text x="${L}" y="${H-5}">${esc(pts[0].l)}</text>`;if(pts.length>1)s+=`<text x="${W-R}" y="${H-5}" text-anchor="end">${esc(pts[pts.length-1].l)}</text>`;
return s+'</svg>'}
function barChart(items,o={}){if(!items.length)return empty('Pas encore de données.');
const W=340,H=150,T=18,B=22,mx=Math.max(1,...items.map(i=>i.v),o.ref||0),bw=Math.min(30,(W-16)/items.length-8),st=(W-16)/items.length;
let s=`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label||'Barres')}">`;
if(o.ref){const y=T+(mx-o.ref)*(H-T-B)/mx;s+=`<line x1="4" y1="${y}" x2="${W-4}" y2="${y}" stroke="#666" stroke-dasharray="4 4"/><text x="${W-4}" y="${y-4}" text-anchor="end">objectif ${o.ref}</text>`}
items.forEach((it,i)=>{const h=Math.max(it.v?3:0,it.v*(H-T-B)/mx),x=8+i*st+(st-bw)/2,y=H-B-h;
s+=`<rect class="bar" style="--d:${i*70}ms" x="${x}" y="${y}" width="${bw}" height="${h}" rx="4" fill="${it.hi?'var(--ac)':'#3a3a3a'}"/><text x="${x+bw/2}" y="${y-4}" text-anchor="middle">${it.v||''}</text><text x="${x+bw/2}" y="${H-6}" text-anchor="middle">${esc(it.l)}</text>`});
return s+'</svg>'}
function radar(ax){const mx=Math.max(...ax.map(a=>a.v));if(!mx)return empty('Aucune séance sur la période.');
const W=340,H=230,cx=170,cy=115,r=78,n=ax.length,P=(i,k)=>{const a=-Math.PI/2+i*2*Math.PI/n;return[cx+Math.cos(a)*r*k,cy+Math.sin(a)*r*k]};
let s=`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Radar par groupe musculaire">`;
[.33,.66,1].forEach(k=>s+=`<polygon points="${ax.map((_,i)=>P(i,k).map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="#2c2c2c"/>`);
ax.forEach((a,i)=>{const[x,y]=P(i,1),[tx,ty]=P(i,1.2);s+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#222"/><text x="${tx}" y="${ty+3}" text-anchor="${Math.abs(tx-cx)<8?'middle':tx>cx?'start':'end'}">${esc(a.l)}</text>`});
s+=`<polygon class="rad" points="${ax.map((a,i)=>P(i,Math.max(.04,a.v/mx)).map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="var(--ac)" fill-opacity=".25" stroke="var(--ac)" stroke-width="2" stroke-linejoin="round"/>`;
return s+'</svg>'}
const box=(svg,cap)=>`<div class="cbox">${svg}<div class="tip">${cap||''}</div></div>`;
function muscleSets(days){const from=addD(today(),-days+1),c={},last={};MUS.forEach(m=>c[m]=0);
S.sessions.forEach(s=>s.items.forEach(it=>{const m=(exById(it.exId)||{}).muscle;if(!m||!(m in c))return;if(s.date>=from)c[m]+=it.sets.length;if(!last[m]||s.date>last[m])last[m]=s.date}));return{c,last}}
function weeksBars(){const cw=mon(today()),cnt={};S.sessions.forEach(s=>{const w=mon(s.date);cnt[w]=(cnt[w]||0)+1});
const it=[];for(let i=7;i>=0;i--){const w=addD(cw,-7*i),v=cnt[w]||0;it.push({l:fr(w,{day:'numeric',month:'numeric'}),v,hi:v>=goalFor(w)&&goalFor(w)>0})}return it}


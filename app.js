const V=(()=>{if(location.protocol==='file:')return '';const s=document.currentScript?.src||document.querySelector('script[src*="app.js"]')?.getAttribute('src')||'';try{return new URL(s,location.href).searchParams.get('v')||''}catch{return ''}})();
window.__VERSION__=V;
const $=s=>document.querySelector(s),J=f=>fetch('data/'+f+'.json'+(V?'?v='+V:'')).then(r=>r.json()),P=document.body.dataset.page,q=new URLSearchParams(location.search);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* 备注里的裸 URL 转成可点链接（先转义再链接化，尾部标点不吞进 href） */
const lk=s=>esc(s).replace(/https?:\/\/[^\s<>"）】]+/g,u=>{const m=u.match(/[.,;:、。；：]+$/),t=m?u.slice(0,-m[0].length):u;return `<a href="${t}" target=_blank rel=noopener>${t}</a>${m?m[0]:''}`});
const NAV=[['index','home','HOME','首页'],['members','members','MEMBER','成员'],['songs','songs','SONG','歌曲'],['draw','draw','DRAW','抽签'],['lives','lives','LIVE','公演'],['venues','venues','VENUE','场地'],['calendar','calendar','SCHEDULE','日历'],['eras','eras','PROFILE','时期/公式图'],['gallery','gallery','PHOTO','图库']];
$('header').innerHTML=`<div class=hd><a class=logo href="index.html">iLiFE<b>!</b><small>FAN DATABASE · 应援资料库</small></a><button id=burger aria-label=menu>☰</button><nav>${NAV.map(([f,p,e,c])=>`<a href="${f}.html" class="${p==P?'on':''}">${e}<span>${c}</span></a>`).join('')}</nav></div>`;
$('#burger').onclick=()=>$('nav').classList.toggle('open');
document.body.insertAdjacentHTML('beforeend',`<footer><b>iLiFE! FAN DATABASE</b>非官方粉丝站。图片版权归 iLiFE! / HEROINES / imaginate 及原发布者所有，均标注来源。数据来源：@iLiFE_official、ilife-heroines.com（Wayback 存档）、日文维基百科。</footer><div id=lb><span class=x>×</span><span class=pv>‹</span><img><p></p><span class=nx>›</span></div>`);
// lightbox
let LB=[],LI=0;const lbShow=()=>{const i=LB[LI];$('#lb img').src=i.local||i.url;$('#lb p').innerHTML=`${esc(i.date)}${i.member?' · '+esc(i.member):''} · <a href="${i.post}" target=_blank>来源 ↗</a><br>${esc((i.text||'').slice(0,120))}`;$('#lb').classList.add('on')};
const lbClose=()=>$('#lb').classList.remove('on');$('#lb .x').onclick=lbClose;$('#lb').onclick=e=>{if(e.target.id=='lb')lbClose()};
$('#lb .pv').onclick=()=>{LI=(LI+LB.length-1)%LB.length;lbShow()};$('#lb .nx').onclick=()=>{LI=(LI+1)%LB.length;lbShow()};
document.addEventListener('keydown',e=>{if(!$('#lb').classList.contains('on'))return;if(e.key=='Escape')lbClose();if(e.key=='ArrowLeft')$('#lb .pv').click();if(e.key=='ArrowRight')$('#lb .nx').click()});
const bindLB=(root,list)=>root.querySelectorAll('[data-i]').forEach(el=>el.onclick=()=>{LB=list;LI=+el.dataset.i;lbShow()});
const imgDone=root=>root.querySelectorAll('img[loading]').forEach(im=>{const f=()=>im.classList.add('ok');im.complete&&im.naturalWidth?f():(im.onload=f,im.onerror=f)});
const WH=p=>p&&p.w?` width=${p.w} height=${p.h} style="aspect-ratio:${p.w}/${p.h}"`:'';
const srcLabel=s=>{s=s||'';if(s.includes('Wayback'))return '官网存档';if(s.startsWith('X @'))return esc(s.slice(2));if(s.startsWith('Instagram'))return esc(s);if(s.includes('官网'))return '官网';return '@iLiFE_official'};
const gi=(i,k)=>`<div class=gi><div class=ph data-i=${k}><img loading=lazy decoding=async src="${i.local||i.url}"${WH(i)} alt=""></div><small>${esc(i.date)}${i.member?' · '+esc(i.member):(i.kind=='individual'?' · 成员未标注':'')}${i.pending?' · <b style="color:#d9480f">待确认</b>':''}${i.category=='illustration'?' · 插画':''} · <a href="${i.post}" target=_blank onclick="event.stopPropagation()">${srcLabel(i.source)}</a></small>${i.text&&!(i.source||'').includes('Wayback')?`<div class=tx>${esc(i.text.slice(0,70))}</div>`:''}</div>`;
const galHTML=(list,port)=>`<div class="gal${port?' port':''}">${list.map(gi).join('')}</div>`;
const vl=v=>`<a href="venues.html?v=${encodeURIComponent(v)}">${esc(v)}</a>`;
const ltag=t=>{const c=t=='ワンマン'?'oneman':t=='主催'?'sponsor':t=='生誕祭'?'bday':t=='フェス'?'fes':t=='リリイベ'?'release':'';return `<span class="live-tag ${c}">${esc(t||'対バン')}</span>`};
const ltab=a=>`<div class="box tbl-wrap"><table><tr><th>日期</th><th>类型</th><th>公演</th><th>时间</th><th>场地</th><th>地区</th><th>出处</th></tr>${a.map(l=>`<tr><td class=d>${l.date}</td><td>${ltag(l.type)}</td><td class=title-cell><a href="lives.html?l=${l.id}" style="color:inherit;text-decoration:none"><b>${esc(l.title)}</b></a>${l.note?`<div class=sub-note>${lk(l.note)}</div>`:''}</td><td style="font-size:12px;color:var(--sub)">${l.open_time||l.start_time?`${l.open_time||'-'} / ${l.start_time||'-'}`:'-'}</td><td>${l.venue=='未确认'?'未确认':vl(l.venue)}</td><td>${esc(l.pref)}</td><td>${l.source?`<a href="${l.source}" target=_blank rel=noopener class=src>出处 ↗</a>`:'-'}</td></tr>`).join('')}</table></div>`;
const head=(en,zh,crumb)=>`<div class=crumb><a href=index.html>首页</a> / ${crumb||zh}</div><h1 class=ttl>${en}</h1><p class=sub>${zh}</p>`;
const latestPhoto=(I,n)=>{const a=I.filter(i=>i.kind=='individual'&&i.member==n);return a.filter(i=>i.category=='official'&&!(i.source||'').includes('Wayback')).pop()||a.filter(i=>(i.source||'').includes('Wayback')).pop()||a.pop()};
/* 首页封面只用团体静图：kind=group、不挂成员、非待确认、非插画。个人公式图留在成员页。 */
const groupStill=i=>!!(i&&i.kind=='group'&&!i.member&&!i.pending&&i.category!='illustration');
const arsha=i=>/アー写|アーティスト写真/.test(i.text||'');
const mcard=(m,I)=>{const p=latestPhoto(I,m.name);return `<a class="mcard${m.status=='现役'?'':' ex'}" href="members.html?m=${encodeURIComponent(m.name)}"><div class=ph>${p?`<img loading=lazy src="${p.local||p.url}"${WH(p)} alt="">`:''}</div><div class=bar style="background:${m.hex}"></div><div class=nm><span class=dot style="background:${m.hex}"></span>${esc(m.name)}</div><div class=kn>${esc(m.kana)} · ${esc(m.color)}${m.left?' · '+esc(m.left):''}</div></a>`};
(async()=>{const m=$('#main');
if(P=='home'){const[M,L,I,E]=await Promise.all([J('members'),J('lives'),J('images'),J('eras')]);const t=new Date().toISOString().slice(0,10);const cur=M.filter(x=>x.status=='现役');
 const era=(E[E.length-1]||{}).id,G=I.filter(groupStill),byNew=(a,b)=>a.date<b.date?1:a.date>b.date?-1:I.indexOf(b)-I.indexOf(a);
 const pref=G.filter(i=>i.era==era&&i.category=='official'&&arsha(i)),pool=pref.length?pref:G,last=pool.slice().sort(byNew)[0];
 const g=last&&(I.find(i=>i.post==last.post&&pool.includes(i))||last);
 const N=G.slice().sort(byNew).slice(0,8);
 m.innerHTML=`${g?`<div class=hero><div class=bg style="background-image:url('${g.local||g.url}')"></div><img src="${g.local||g.url}"${WH(g)} data-i=0 alt="iLiFE!"></div>`:''}
 <div class=stats><div class=stat><b>${cur.length}</b>现役成员</div><div class=stat><b>${L.length}</b>收录公演</div><div class=stat><b>${E.length}</b>时期</div><div class=stat><b>${I.length}</b>收录图片</div></div>
 <h2>UPCOMING · 即将举行</h2>${ltab(L.filter(l=>l.date>=t).slice(0,8))}
 <h2>MEMBER · 现役成员</h2><div class=mgrid>${cur.map(x=>mcard(x,I)).join('')}</div>
 <h2>NEW PHOTO · 最新团体公式图</h2>${N.length?galHTML(N):'<p style="color:var(--sub)">暂无团体公式图。</p>'}
 <p style="text-align:center;margin-top:24px"><a class=pill href=eras.html>查看全部时期公式图</a> <a class="pill off" href=gallery.html>图库</a></p>`;
 const gal=m.querySelector('.gal');if(gal)bindLB(gal,N);const hero=m.querySelector('.hero [data-i]');if(hero)hero.onclick=()=>{LB=[g];LI=0;lbShow()};imgDone(m);return}
if(P=='members'&&q.get('m')){const[M,I,E]=await Promise.all([J('members'),J('images'),J('eras')]);const n=q.get('m'),x=M.find(a=>a.name==n)||{name:n,hex:'#999'};const mine=I.filter(i=>i.kind=='individual'&&i.member==n);const p=latestPhoto(I,n);
 m.innerHTML=`${head('MEMBER',esc(n),'<a href=members.html>成员</a> / '+esc(n))}<div style="display:grid;grid-template-columns:minmax(200px,320px) 1fr;gap:32px" class=mdet><div class=mcard><div class=ph>${p?`<img src="${p.local||p.url}"${WH(p)}>`:''}</div><div class=bar style="background:${x.hex}"></div></div><div><h3 style="font-size:30px;margin:0"><span class=dot style="background:${x.hex};width:16px;height:16px"></span>${esc(n)}</h3><p style="color:var(--sub)">${esc(x.kana||'')}</p><dl class=info>${(()=>{const S=x.sources||{},L=k=>S[k]?` <a class=src href="${S[k]}" target=_blank title="来源">[源]</a>`:'',R=(lb,k,v)=>`<dt>${lb}</dt><dd>${v?esc(v):'<span class=unk>未确认</span>'}${L(k)}</dd>`;return R('读音','kana',x.kana)+(x.romaji?R('罗马字','romaji',x.romaji):'')+`<dt>应援色</dt><dd><span class=dot style="background:${x.hex}"></span>${esc(x.color||'未确认')} <small class=unk>${esc(x.hex||'')}${x.hex_note?' · '+esc(x.hex_note):''}</small>${L('color')}${S.hex&&S.hex!=S.color?` <a class=src href="${S.hex}" target=_blank>[HEX源]</a>`:''}</dd>`+R('生日','birthday',x.birthday)+R('加入','joined',x.joined)+(x.left?R('离开','left',x.left):'')+`<dt>出演公演</dt><dd>${x.lives?`<a href="lives.html?m=${encodeURIComponent(n)}">${x.lives} 场</a>`:'<span class=unk>—</span>'}</dd>`+(x.role||x.note?R('职务/备注','role',x.role||x.note):'')+(x.support?R('支援/候补期','support',x.support):'')+(x.catch?R('官方口号','catch',x.catch):'')+`<dt>个人 X</dt><dd>${x.x?`<a href="https://x.com/${x.x}" target=_blank>@${esc(x.x)}</a>`:'<span class=unk>未找到</span>'} <small class=unk>${esc(x.x_status||'')}</small>${L('x')}</dd><dt>状态</dt><dd>${esc(x.status||'')}</dd>`})()}</dl></div></div>
 <h2>各时期个人图（${mine.length}）</h2>${E.filter(e=>mine.some(i=>i.era==e.id)).map(e=>`<h3>${esc(e.name)} <small style="color:var(--sub);font-weight:400">${e.start}～</small></h3>${galHTML(mine.filter(i=>i.era==e.id),1)}`).join('')||'<p>暂无收录。</p>'}${(()=>{const rel=I.filter(i=>i.related&&i.member==n);return rel.length?`<h2>相关图片（${rel.length}）</h2><div id=rel><p style="font-size:13px;color:var(--sub)">官方推文文本仅提及该成员的告知/周边/活动图，非个人公式照。</p>${galHTML(rel.slice().reverse())}</div>`:''})()}`;
 let k=0;const flat=[];m.querySelectorAll('.gi .ph').forEach(el=>el.dataset.i=k++);E.forEach(e=>mine.filter(i=>i.era==e.id).forEach(i=>flat.push(i)));bindLB(m,flat);if($('#rel'))bindLB($('#rel'),I.filter(i=>i.related&&i.member==n).reverse());imgDone(m);if(innerWidth<760)m.querySelector('.mdet').style.gridTemplateColumns='1fr';return}
if(P=='members'){const[M,I,T,E]=await Promise.all([J('members'),J('images'),J('timeline'),J('eras')]);let view=q.get('view')||'tl';
 const t0=new Date('2020-06-01'),t1=new Date('2026-12-31'),today=new Date().toISOString().slice(0,10),pct=d=>((new Date(d)-t0)/(t1-t0)*100).toFixed(3)+'%',wid=(a,b)=>((new Date(b)-new Date(a))/(t1-t0)*100).toFixed(3)+'%';
 const MM=Object.fromEntries(M.map(x=>[x.name,x]));
 const tl=()=>{const yrs=[2021,2022,2023,2024,2025,2026];
  const grid=yrs.map(y=>`<i class=yl style="left:${pct(y+'-01-01')}"></i>`).join('')+E.map((e,k)=>`<i class=el style="left:${pct(e.start)}"></i>`).join('')+T.marks.map(k=>`<i class=ml style="left:${pct(k.date)}"></i>`).join('')+`<i class=today style="left:${pct(today)}"></i>`;
  const rows=T.members.map(r=>{const x=MM[r.name]||{hex:'#999'};const light=/^#f[0-9a-f]f[0-9a-f]f/i.test(x.hex);
   return `<div class=tr><a class=tn href="members.html?m=${encodeURIComponent(r.name)}"><span class=dot style="background:${x.hex}"></span>${esc(r.name)}${r.segments.every(s=>s.type=='s')?'<em>支援</em>':''}</a><div class=tt>${grid}${r.segments.map(sg=>{const to=sg.to||today;return `<a class="seg ${sg.type}${light&&sg.type=='r'?' light':''}" href="members.html?m=${encodeURIComponent(r.name)}" data-n="${esc(r.name)}" data-f="${sg.from}" data-t="${sg.to||'至今'}" data-l="${esc(sg.label+(sg.color?'（'+sg.color+'色）':''))}" style="left:${pct(sg.from)};width:${wid(sg.from,to)};${sg.type=='r'?'background:'+(sg.color=='绿'?'#3eb370':x.hex):''}"></a>`}).join('')}</div></div>`}).join('');
  const s0='2020-06-05',sp=d=>((new Date(d)-new Date(s0))/(new Date(today)-new Date(s0))*100).toFixed(3)+'%',ECOL=['#f6c1d9','#c9e3ec','#fde2b8','#d7ecd0','#e4d4f0','#fbd0c4','#cfe0f7','#f9d6e8','#d9f0ea','#f3e3c3','#dcd6f2','#ffd0e4'];
  const stk=`<div id=stk><div class=stkhd><b id=onh></b><button class="off sm" id=stkt>收起</button></div><div id=stkb><div id=sl><div class=sltrack>${E.map((e,k)=>`<i class=sle style="left:${sp(e.start<s0?s0:e.start)};width:calc(${sp(E[k+1]?E[k+1].start:today)} - ${sp(e.start<s0?s0:e.start)});background:${ECOL[k%12]}" title="${esc(e.name)}"></i>`).join('')}${[2021,2022,2023,2024,2025,2026].map(y=>`<span class=sly style="left:${sp(y+'-01-01')}">${y}</span>`).join('')}<div id=slh><span></span></div></div></div><p class="filters eps">${E.map((e,k)=>`<button class=off data-jd=${e.start<s0?s0:e.start}>${k+1}. ${esc(e.name)}</button>`).join('')}<button class=off data-jd=${today}>今天</button></p><div id=onpanel></div></div></div>`;
  return stk+`<div class=tlwrap><div class=tl><div class="tr th"><div class=tn></div><div class=tt>${yrs.map(y=>`<b style="left:${pct(y+'-01-01')}">${y}</b>`).join('')}${T.marks.map(k=>`<span class=mk style="left:${pct(k.date)};${k.date<'2020-07'?'transform:none':''}" title="${esc(k.label)}">${esc(k.label)}</span>`).join('')}</div></div>
  <div class="tr th erarow"><div class=tn>时期</div><div class=tt>${E.map((e,k)=>`<a href="eras.html#${e.id}" class=eb style="left:${pct(e.start)};width:${wid(e.start,E[k+1]?E[k+1].start:'2026-12-31')}" title="${esc(e.name)} ${e.start}～">${k+1}</a>`).join('')}</div></div>${rows}<div id=cur><span class=hl></span></div></div></div>
  <p class=legend><span><i class="sw r"></i>正式成员（成员色）</span><span><i class="sw n"></i>非正式期间（支援/候补生）</span><span><i class="sw s"></i>支援成员</span><span><i class="sw mkl"></i>重要公演</span><span><i class="sw tdl"></i>今天</span></p>
  <p style="font-size:12px;color:var(--sub)">${esc(T.note)} 来源：<a href="${T.source}">Wikipedia「在籍タイムライン」</a>。时期编号对应<a href=eras.html>时期/公式图</a>页。</p><div id=tip></div>`};
 const cards=()=>`<h2>现役成员</h2><div class=mgrid>${M.filter(x=>x.status=='现役').map(x=>mcard(x,I)).join('')}</div><h2>前成员・支援成员</h2><div class=mgrid>${M.filter(x=>x.status!='现役').map(x=>mcard(x,I)).join('')}</div><p style="font-size:12px;color:var(--sub);margin-top:30px">色块为近似色，仅供参考；“未确认/未收录”表示未找到可靠来源。照片为该成员最近一次官方公式图。</p>`;

 const photoAt=(n,d)=>{const a=I.filter(i=>i.kind=='individual'&&i.member==n);return a.filter(i=>i.date<=d).pop()||a[0]};
 const eraAt=d=>{let r=E[0];E.forEach(e=>{if(d>=e.start)r=e});return d<E[0].start?null:r};
 const cursor=()=>{const tl=m.querySelector('.tl'),c=$('#cur'),tt=()=>m.querySelector('.tr:not(.th) .tt').getBoundingClientRect();let D=q.get('d')||today,last='';const s0='2020-06-05',sh=$('#slh'),st=m.querySelector('.sltrack');
  const dOf=x=>{const R=tt();const f=Math.min(1,Math.max(0,(x-R.left)/R.width));return new Date(+t0+f*(t1-t0)).toISOString().slice(0,10)};
  const dOfS=x=>{const R=st.getBoundingClientRect();const f=Math.min(1,Math.max(0,(x-R.left)/R.width));return new Date(+new Date(s0)+f*(new Date(today)-new Date(s0))).toISOString().slice(0,10)};
  const set=d=>{if(d>today)d=today;if(d<s0)d=s0;D=d;const R=tt(),TB=tl.getBoundingClientRect();c.style.left=(R.left-TB.left+(new Date(d)-t0)/(t1-t0)*R.width)+'px';const e=eraAt(d);c.querySelector('.hl').innerHTML=`${d}<small>${e?esc(e.name):''}</small>`;
   sh.style.left=((new Date(d)-new Date(s0))/(new Date(today)-new Date(s0))*100)+'%';sh.querySelector('span').innerHTML=`${d}<small>${e?esc(e.name):''}</small>`;
   if(d===last)return;last=d;const on=[];T.members.forEach(r=>r.segments.forEach(sg=>{if(sg.from<=d&&(!sg.to||d<sg.to))on.push([r.name,sg])}));
   $('#onh').innerHTML=`${d} 在籍成员 <span>${on.length}人</span>`+(e?` · <a href="eras.html#${e.id}">${esc(e.name)}</a>`:'');
   $('#onpanel').innerHTML=on.map(([n,sg])=>{const x=MM[n]||{hex:'#999',kana:''},p=photoAt(n,d);return `<a class=sc href="members.html?m=${encodeURIComponent(n)}" title="${esc(n)} ${esc(sg.label)} ${sg.from}～${sg.to||'至今'}${p?' / 照片 '+p.date:''}"><div class=ph>${p?`<img src="${p.local||p.url}"${WH(p)} alt="">`:''}</div><div class=bar style="background:${sg.type=='r'?(sg.color=='绿'?'#3eb370':x.hex):'#b9a3ad'}"></div><div class=nm>${esc(n)}</div>${sg.type!='r'?`<em class=tag>${sg.type=='s'?'支援':'非正式'}</em>`:''}</a>`}).join('')};
  let raf=0,pend=null;const go=d=>{pend=d;if(!raf)raf=requestAnimationFrame(()=>{raf=0;set(pend)})};
  const drag=(h,f,el)=>h.addEventListener('pointerdown',e=>{e.preventDefault();h.setPointerCapture(e.pointerId);el.classList.add('drag');const mv=ev=>go(f(ev.clientX)),up=()=>{el.classList.remove('drag');h.removeEventListener('pointermove',mv);h.removeEventListener('pointerup',up);h.removeEventListener('pointercancel',up)};h.addEventListener('pointermove',mv);h.addEventListener('pointerup',up);h.addEventListener('pointercancel',up)});
  drag(c.querySelector('.hl'),dOf,c);drag(sh,dOfS,sh);
  st.addEventListener('pointerdown',e=>{if(e.target.closest('#slh'))return;go(dOfS(e.clientX))});
  m.querySelectorAll('.tr.th .tt').forEach(a=>a.addEventListener('click',e=>{if(e.target.closest('a'))return;go(dOf(e.clientX))}));
  const center=()=>{const w=m.querySelector('.tlwrap');w.scrollLeft=Math.max(0,c.offsetLeft-w.clientWidth/2)};
  m.querySelectorAll('[data-jd]').forEach(b=>b.onclick=()=>{set(b.dataset.jd);center()});
  $('#stkt').onclick=()=>{const k=$('#stk').classList.toggle('min');$('#stkt').textContent=k?'展开':'收起'};if(innerWidth<760&&q.get('min'))$('#stkt').click();
  const fixTop=()=>{$('#stk').style.top=$('header').offsetHeight+'px'};fixTop();addEventListener('resize',()=>{window.__fit&&window.__fit();fixTop();set(D)});window.__setDate=set;set(D);if(q.get('d'))center()};
 const r=()=>{m.innerHTML=`${head('MEMBERS','成员')}<p class=filters><button class="${view=='tl'?'':'off'}" data-v=tl>时间轴</button><button class="${view=='cards'?'':'off'}" data-v=cards>成员卡片</button></p>`+(view=='tl'?tl():cards());
  m.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{view=b.dataset.v;history.replaceState(null,'','?view='+view);r()});imgDone(m);
  if(view=='tl')cursor();const tip=$('#tip');if(!tip)return;m.querySelectorAll('.seg').forEach(el=>{const sh=e=>{const n=el.dataset.n,p=latestPhoto(I,n);tip.innerHTML=`${p?`<img src="${p.local||p.url}"${WH(p)}>`:''}<div><b>${esc(n)}</b><br>${el.dataset.l}<br>${el.dataset.f} ～ ${el.dataset.t}</div>`;tip.style.display='flex';const R=el.getBoundingClientRect(),x=Math.min(Math.max(8,(e.clientX||R.left)+12),innerWidth-250);tip.style.left=x+'px';tip.style.top=(R.bottom+8+scrollY)+'px'};
   el.onmouseenter=sh;el.onmousemove=sh;el.onmouseleave=()=>tip.style.display='none';el.ontouchstart=e=>{if(tip.style.display!='flex'||tip.dataset.k!=el.dataset.n+el.dataset.f){e.preventDefault();sh(e.touches[0]);tip.dataset.k=el.dataset.n+el.dataset.f}}})};r();return}
if(P=='lives'){const[L,M]=await Promise.all([J('lives'),J('members')]);const MM=Object.fromEntries(M.map(x=>[x.name,x])),MI=Object.fromEntries(M.map(x=>[String(x.id),x]));
 const TYPES=['全部','ワンマン','主催','対バン','フェス','リリイベ','生誕祭','配信','その他'].filter(t=>t=='全部'||L.some(l=>l.type==t));
 const YEARS=['全部',...[...new Set(L.map(l=>l.date.slice(0,4)))].sort()];
 const thumb=l=>{const i=l.cover||(l.images&&l.images[0]);return i?`<img loading=lazy decoding=async src="${i.local||i.url}" alt="${esc(l.title)}">`:`<span class=noimg>🎤</span>`};
 const render=()=>{
  const curQ=new URLSearchParams(location.search),lid=curQ.get('l');
  let curType=curQ.get('t')||'全部',curYear=curQ.get('y')||'全部',curM=curQ.get('m')||'';
  if(lid){
   const l=L.find(x=>String(x.id)==String(lid));
   if(l){
    document.title=`${l.title} (${l.date}) · LIVE | iLiFE! 应援资料库`;
    const mem=l.members||{},mkeys=Object.keys(mem),allOut=mkeys.length>0&&mkeys.every(k=>mem[k]=='未出演'),est=['対バン','フェス','その他'].includes(l.type),imgs=l.images&&l.images.length?l.images:(l.cover?[l.cover]:[]);
    const flat=imgs.map(im=>({...im,date:l.date,post:im.post||l.source,text:`${l.date} ${l.title}${im.source?' · 图源 '+im.source.replace(/^X /,''):''}`}));
    const bp=[];if(curType!='全部')bp.push('t='+encodeURIComponent(curType));if(curYear!='全部')bp.push('y='+encodeURIComponent(curYear));
    const backHref='lives.html'+(bp.length?'?'+bp.join('&'):'');
    const phHTML=imgs.length?`<div class="gal photos">${imgs.map((im,idx)=>`<a class=ph href="${im.local||im.url}" data-i="${idx}" target=_blank><img loading=lazy decoding=async src="${im.local||im.url}" ${im.w&&im.h?`width="${im.w}" height="${im.h}"`:''} alt="${esc(l.title)}"></a>`).join('')}</div>`:'<p class=none>暂无相关图片收录</p>';
    m.innerHTML=`<a class=back href="${backHref}">‹ 返回公演列表</a><div class=dt><div class=dt-hd><h2>${esc(l.title)} ${ltag(l.type)}</h2></div><dl class=meta><dt>日期</dt><dd>${esc(l.date)}</dd><dt>时间</dt><dd>${esc(l.open_time||l.start_time?`${l.open_time||'—'} 开场 / ${l.start_time||'—'} 开演`:'—')}</dd><dt>会场</dt><dd>${l.venue=='未确认'?'未确认':`<a href="venues.html?v=${encodeURIComponent(l.venue)}">${esc(l.venue)}</a>`}${l.pref&&!['未确认','—','-'].includes(l.pref)?` (${esc(l.pref)})`:''}</dd><dt>类型</dt><dd>${esc(l.type)}${l.is_headliner?' · 主办/单独':''}</dd><dt>出处</dt><dd>${l.source?`<a class=src href="${l.source}" target=_blank rel=noopener>出处 ↗</a>`:'—'}</dd></dl>${l.note?`<div class=note>${lk(l.note)}</div>`:''}${l.setlist?`<h3 class=sec>歌单</h3><pre class=setlist>${esc(l.setlist)}</pre>`:''}<h3 class=sec>出演成员 · ${mkeys.length} 人 <small style="font-weight:400;color:var(--sub);font-size:12px">${allOut?"全员辞退（未出演）":est?"按当时在籍推定":"按在籍区间"}</small></h3><div class=lineup style="display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 16px">${mkeys.map(k=>{const mm=MI[k]||{hex:"#e4007f",name:"#"+k},st=mem[k],dull=st=="未出演"||st=="休演";return `<a class="pill${dull?" off":""}" style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;text-decoration:none" href="members.html?m=${encodeURIComponent(mm.name)}"><span class=dot style="background:${dull?"#b9a3ad":mm.hex};width:10px;height:10px;border-radius:50%"></span><b>${esc(mm.name)}</b>${st!="出演"?`<small style="color:var(--sub)">(${esc(st)})</small>`:""}</a>`}).join("")}</div><h3 class=sec>相关图片 · ${imgs.length} 张</h3>${phHTML}</div>`;
    const b=m.querySelector('.back');
    if(b)b.onclick=e=>{if(e.button===0&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey){e.preventDefault();history.pushState(null,'',b.getAttribute('href'));render()}};
    m.querySelectorAll('.photos .ph').forEach(el=>el.onclick=e=>{e.preventDefault();LB=flat;LI=+el.dataset.i;lbShow()});
    imgDone(m);window.scrollTo(0,0);return;
   }
  }
  document.title='LIVE · 公演历史 | iLiFE! 应援资料库';
  curType=curQ.get('t')||curType||'全部';curYear=curQ.get('y')||curYear||'全部';
  const memOf=l=>Object.keys(l.members||{}).filter(k=>(l.members[k]!='未出演')&&((MI[k]||{}).name==curM));
 const FL=L.filter(l=>(curType=='全部'||l.type==curType)&&(curYear=='全部'||l.date.startsWith(curYear))&&(!curM||memOf(l).length));
  m.innerHTML=`<h1 class=ttl>LIVE</h1><p class=sub>公演历史 · 共 ${FL.length} 场${FL.length!==L.length?'（全部 '+L.length+' 场）':''}</p><p class=filters><span class=lb>类型</span>${TYPES.map(t=>`<button class="${t==curType?'':'off'}" data-t="${t}">${t} (${L.filter(l=>(t=='全部'||l.type==t)&&(curYear=='全部'||l.date.startsWith(curYear))).length})</button>`).join('')}</p>${curM?`<p class=filters><span class=lb>成员</span><button data-m="">只看 ${esc(curM)} ✕</button></p>`:''}<p class=filters><span class=lb>年份</span>${YEARS.map(y=>`<button class="${y==curYear?'':'off'}" data-y="${y}">${y=='全部'?'全部':y+'年'} (${L.filter(l=>(curType=='全部'||l.type==curType)&&(y=='全部'||l.date.startsWith(y))).length})</button>`).join('')}</p><div class=grid>${FL.map(l=>{const n=(l.images||[]).length;return `<a class=card href="?l=${l.id}" data-id="${l.id}"><div class=cv>${thumb(l)}${n>1?`<span class=badge>📷 ${n}</span>`:''}</div><div class=bd><div class=m style="margin:0 0 4px;display:flex;align-items:center;gap:6px"><span style="font-weight:700;color:var(--ink)">${esc(l.date)}</span>${ltag(l.type)}</div><b title="${esc(l.title)}">${esc(l.title)}</b><div class=k title="${esc(l.venue)}">${esc(l.venue)}${l.pref&&!['未确认','—','-'].includes(l.pref)?' · '+esc(l.pref):''}</div><div class=m>${esc(l.open_time||l.start_time?`${l.open_time||'-'} / ${l.start_time||'-'}`:(l.note||''))}</div></div></a>`}).join('')}</div>`;
  const upd=()=>{const p=[];if(curType!='全部')p.push('t='+encodeURIComponent(curType));if(curYear!='全部')p.push('y='+encodeURIComponent(curYear));if(curM)p.push('m='+encodeURIComponent(curM));history.replaceState(null,'',p.length?'?'+p.join('&'):'lives.html')};
  m.querySelectorAll('[data-m]').forEach(btn=>btn.onclick=()=>{curM='';upd();render()});
  m.querySelectorAll('[data-t]').forEach(btn=>btn.onclick=()=>{curType=btn.dataset.t;upd();render()});
  m.querySelectorAll('[data-y]').forEach(btn=>btn.onclick=()=>{curYear=btn.dataset.y;upd();render()});
  m.querySelectorAll('.grid .card').forEach(card=>card.onclick=e=>{if(e.button===0&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey){e.preventDefault();const p=[`l=${card.dataset.id}`];if(curType!='全部')p.push('t='+encodeURIComponent(curType));if(curYear!='全部')p.push('y='+encodeURIComponent(curYear));if(curM)p.push('m='+encodeURIComponent(curM));history.pushState(null,'','?'+p.join('&'));render()}});
  imgDone(m);
 };
 window.addEventListener('popstate',render);
 render();return}
if(P=='venues'){const L=await J('lives'),v=q.get('v'),g={};L.forEach(l=>{if(l.venue!='未确认')(g[l.venue]=g[l.venue]||[]).push(l)});
 m.innerHTML=v?`${head('VENUE',esc(v),'<a href=venues.html>场地</a> / '+esc(v))}<div class=box><dl class=info><dt>iLiFE! 举办次数</dt><dd>${(g[v]||[]).length}</dd><dt>地区</dt><dd>${esc((g[v]||[{}])[0].pref||'未确认')}</dd><dt>地图</dt><dd><a href="https://www.google.com/maps/search/${encodeURIComponent(v)}" target=_blank>在 Google 地图查看 ↗</a></dd></dl></div><h2>在此举办的公演</h2>${ltab(g[v]||[])}`
 :`${head('VENUES','场地')}<div class=box><table><tr><th>场地</th><th>地区</th><th>次数</th></tr>${Object.entries(g).sort((a,b)=>b[1].length-a[1].length).map(([k,a])=>`<tr><td>${vl(k)}</td><td>${esc(a[0].pref)}</td><td>${a.length}</td></tr>`).join('')}</table></div>`;return}
if(P=='calendar'){const L=await J('lives');
 const pad=n=>String(n).padStart(2,'0');
 const jstToday=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const today=jstToday();
 const by={};L.forEach(l=>{(by[l.date]=by[l.date]||[]).push(l)});
 Object.values(by).forEach(a=>a.sort((x,y)=>String(x.start_time||x.open_time||'99:99').localeCompare(String(y.start_time||y.open_time||'99:99'))||x.id-y.id));
 const months=[...new Set(L.map(l=>l.date.slice(0,7)))].sort();
 const minM=months[0]||today.slice(0,7),maxM=(months[months.length-1]||minM)>today.slice(0,7)?months[months.length-1]:today.slice(0,7);
 const parseYM=s=>{const m=String(s||'').match(/^(\d{4})-(\d{2})/);if(!m)return null;const y=+m[1],mo=+m[2];return mo>=1&&mo<=12?{y,mo}:null};
 const ymOf=(y,mo)=>y+'-'+pad(mo);
 const shift=(y,mo,d)=>{const t=new Date(y,mo-1+d,1);return {y:t.getFullYear(),mo:t.getMonth()+1}};
 const dimOf=(y,mo)=>new Date(y,mo,0).getDate();
 const iso=(y,mo,day)=>ymOf(y,mo)+'-'+pad(day);
 const pic=l=>l.cover||(l.images&&l.images[0])||null;
 const thumb=l=>{const i=pic(l);return i?`<img loading=lazy decoding=async src="${i.local||i.url}" alt="">`:`<span class=cph>🎤</span>`};
 const dotCls=t=>t=='ワンマン'?'oneman':t=='主催'?'sponsor':t=='生誕祭'?'bday':t=='フェス'?'fes':t=='リリイベ'?'release':'';
 const when=l=>{const t=l.open_time&&l.start_time?`${l.open_time} / ${l.start_time}`:(l.start_time||l.open_time||'');return [l.venue,t].filter(Boolean).join(' · ')};
 const defaultDay=(y,mo)=>{const ym=ymOf(y,mo);if(today.slice(0,7)==ym)return today;const hit=L.find(l=>l.date.slice(0,7)==ym);return hit?hit.date:iso(y,mo,1)};
 const urlFor=(y,mo,d)=>{const p=new URLSearchParams();p.set('m',ymOf(y,mo));if(d)p.set('d',d);return '?'+p.toString()};
 const read=()=>{const qq=new URLSearchParams(location.search);const base=parseYM(qq.get('m'))||parseYM(today);let d=qq.get('d')||'';const ym=ymOf(base.y,base.mo);if(!/^\d{4}-\d{2}-\d{2}$/.test(d)||d.slice(0,7)!=ym)d=defaultDay(base.y,base.mo);const dd=+d.slice(8);if(dd<1||dd>dimOf(base.y,base.mo))d=defaultDay(base.y,base.mo);return {y:base.y,mo:base.mo,d}};
 const CHIP=2;
 const render=()=>{
  const {y,mo,d}=read(),ym=ymOf(y,mo),dim=dimOf(y,mo),lead=new Date(y,mo-1,1).getDay();
  const prev=shift(y,mo,-1),next=shift(y,mo,1),pdim=dimOf(prev.y,prev.mo);
  document.title=`${y}年${mo}月 · SCHEDULE | iLiFE! 应援资料库`;
  const cell=(out,day,date)=>{
   const ev=out?[]:(by[date]||[]);
   const cls=['day',out?'out':'',!out&&ev.length?'ev':'',date==today?'is-today':'',!out&&date==d?'sel':''].filter(Boolean).join(' ');
   if(out)return `<div class="${cls}"><span class=dn>${day}</span></div>`;
   const extra=ev.length>CHIP?ev.length-1:0;
   const shown=extra?ev.slice(0,1):ev;
   const chips=shown.map(l=>`<a class=cev href="lives.html?l=${l.id}" title="${esc(l.title)}"><span class=cth>${thumb(l)}</span><span class=ct>${ltag(l.type)}<b>${esc(l.title)}</b></span></a>`).join('');
   const more=extra?`<button type=button class=cmore data-d="${date}">+${extra}</button>`:'';
   const minis=ev.slice(0,3).map(l=>`<a class="mi${pic(l)?'':' dot '+dotCls(l.type)}" href="lives.html?l=${l.id}" title="${esc(l.title)}" aria-label="${esc(l.title)}">${pic(l)?thumb(l):''}</a>`).join('');
   const cnt=ev.length>3?`<span class=ccnt>+${ev.length-3}</span>`:(ev.length>1?`<span class=ccnt>${ev.length}</span>`:'');
   return `<div class="${cls}" data-d="${date}" role=gridcell tabindex=0 aria-selected="${date==d}" aria-label="${mo}月${day}日${ev.length?`，${ev.length}场`:''}"><span class=dn>${day}</span><div class=cevs>${chips}${more}</div><div class=cdots>${minis}${cnt}</div></div>`;
  };
  let grid='日一二三四五六'.split('').map((x,i)=>`<div class="wd${i==0?' sun':''}" role=columnheader>${x}</div>`).join('');
  for(let i=0;i<lead;i++){const day=pdim-lead+1+i;grid+=cell(true,day,iso(prev.y,prev.mo,day))}
  for(let day=1;day<=dim;day++)grid+=cell(false,day,iso(y,mo,day));
  let trail=1;while((lead+dim+trail-1)%7){grid+=cell(true,trail,iso(next.y,next.mo,trail));trail++}
  const monthN=L.filter(l=>l.date.slice(0,7)==ym).length,sel=by[d]||[],dd=+d.slice(8);
  const clampYM=(yy,mm)=>{let t=ymOf(yy,mm);if(t<minM)t=minM;if(t>maxM)t=maxM;return parseYM(t)};
  const prevYear=clampYM(y-1,mo),nextYear=clampYM(y+1,mo);
  const ybtn=(target,label,aria)=>{const same=ymOf(target.y,target.mo)==ym;return same?`<span class="pill off ynav dis" aria-disabled=true>${label}</span>`:`<a class="pill off ynav" href="${urlFor(target.y,target.mo,'')}" aria-label="${aria}">${label}</a>`};
  const rows=sel.length?sel.map(l=>`<a class=arow href="lives.html?l=${l.id}"><span class=ath>${thumb(l)}</span><span class=at><span class=aline>${ltag(l.type)}<b>${esc(l.title)}</b></span><small>${esc(when(l)||'时间未确认')}</small></span></a>`).join(''):'<p class=none>这天没有公演。</p>';
  m.innerHTML=`${head('SCHEDULE','日历')}<div class=calbar><div class=calnavs>${ybtn(prevYear,'« 上一年','上一年')}<a class="pill nav" href="${urlFor(prev.y,prev.mo,'')}" aria-label=上个月>‹</a><label class=ym><span aria-hidden=true>${y}年${mo}月</span><i aria-hidden=true>▾</i><input type=month value="${ym}" min="${minM}" max="${maxM}" aria-label=选择年月></label><a class="pill nav" href="${urlFor(next.y,next.mo,'')}" aria-label=下个月>›</a>${ybtn(nextYear,'下一年 »','下一年')}<a class="pill off todayb" href="${urlFor(+today.slice(0,4),+today.slice(5,7),today)}">今天</a></div><span class=calmeta>本月 ${monthN} 场</span></div><div class=cal role=grid>${grid}</div><section class=agenda aria-live=polite><h2>${mo}月${dd}日 · ${sel.length} 场</h2>${rows}</section>`;
  const go=href=>{history.pushState(null,'',href);render()};
  m.querySelectorAll('a.nav,a.ynav,a.todayb').forEach(a=>a.onclick=e=>{if(e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();go(new URL(a.getAttribute('href'),location.href).search||'?')});
  const monthIn=m.querySelector('input[type=month]');
  monthIn.onchange=e=>{const ym2=parseYM(e.target.value);if(!ym2)return;go(urlFor(ym2.y,ym2.mo,''))};
  m.querySelector('.ym').addEventListener('click',e=>{
    if(typeof monthIn.showPicker!='function')return;
    try{monthIn.showPicker();e.preventDefault()}catch(err){}
  });
  const pick=date=>{if(date!=d){history.replaceState(null,'',urlFor(y,mo,date));render()}if(innerWidth<=760){const ag=m.querySelector('.agenda');if(ag)ag.scrollIntoView({block:'start'})}};
  m.querySelectorAll('.day[data-d]').forEach(el=>{el.onclick=e=>{if(e.target.closest('a')||e.target.closest('.cmore'))return;pick(el.dataset.d)};el.onkeydown=e=>{if(e.key=='Enter'||e.key==' '){e.preventDefault();pick(el.dataset.d)}}});
  m.querySelectorAll('.cmore').forEach(b=>b.onclick=e=>{e.stopPropagation();pick(b.dataset.d);const ag=m.querySelector('.agenda');if(ag)ag.scrollIntoView({block:'nearest'})});
  imgDone(m);
 };
 window.addEventListener('popstate',render);render();return}
if(P=='gallery'){const I=await J('images'),C={all:'全部',official:'公式图',costume:'打歌服/衣装',live:'演出照',member:'个人(生诞)',other:'其他'};let cur=q.get('c')||'all',yr=q.get('y')||'all',lim=120;
 const Y=['all',...[...new Set(I.map(i=>i.date.slice(0,4)))].sort()];
 const r=()=>{const F=I.filter(i=>(cur=='all'||i.category==cur)&&(yr=='all'||i.date.startsWith(yr))).reverse();
 m.innerHTML=`${head('PHOTO','图库')}<p class=filters><span class=lb>分类</span>${Object.entries(C).map(([k,v])=>`<button class="${k==cur?'':'off'}" data-c=${k}>${v}</button>`).join('')}</p><p class=filters><span class=lb>年份</span>${Y.map(y=>`<button class="${y==yr?'':'off'}" data-y=${y}>${y=='all'?'全部':y} (${I.filter(i=>(y=='all'||i.date.startsWith(y))&&(cur=='all'||i.category==cur)).length})</button>`).join('')}</p><p style="font-size:12px;color:var(--sub)">共 ${F.length} 张。分类按官方推文文字自动判定，可能有误。点击图片放大。</p>${galHTML(F.slice(0,lim))}${F.length>lim?'<p style="text-align:center;margin-top:24px"><button id=more>加载更多</button></p>':''}`;
 bindLB(m,F);imgDone(m);
 m.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{cur=b.dataset.c;lim=120;r()});m.querySelectorAll('[data-y]').forEach(b=>b.onclick=()=>{yr=b.dataset.y;lim=120;r()});const mo=$('#more');if(mo)mo.onclick=()=>{lim+=120;r()}};r();return}
if(P=='eras'){const[I,E]=await Promise.all([J('images'),J('eras')]);const O=I.filter(i=>i.kind&&!i.pending&&i.category!='illustration'&&!(i.match=='官方推文文本仅提及该成员'&&!(i.review=='confirmed'&&['official','costume'].includes(i.category)))),flat=[];
 m.innerHTML=`${head('ERA','时期 / 公式图')}<p style="font-size:13px;color:var(--sub)">按成员加入/毕业划分时期，开始日期以该体制首批公式图或成员变动为准。来源：<a href="${E[0].source}">Wikipedia</a>、@iLiFE_official。个人照成员名取自官方推文文字；官网存档照通过与已标注推文图片的感知哈希比对识别，无法确认的标为“未标注”。</p><p class=eranav>${E.map(e=>`<a class="pill off" href="#${e.id}">${esc(e.name)}</a>`).join('')}</p>`+E.map((e,k)=>{const g=O.filter(i=>i.era==e.id&&i.kind=='group'),iv=O.filter(i=>i.era==e.id&&i.kind=='individual'),by={};iv.forEach(i=>(by[i.member||'成员未标注']=by[i.member||'成员未标注']||[]).push(i));const end=E[k+1]?E[k+1].start:'现在';
 const G=(list,c='port')=>{const s=flat.length;flat.push(...list);return `<div class="gal ${c}">${list.map((i,j)=>gi(i,s+j)).join('')}</div>`};
 return `<section class=era id=${e.id}><h2 style="margin-top:0">${esc(e.name)}</h2><p><b>${e.start} ～ ${end}</b>　${esc(e.change)}</p><p class=lineup>${e.lineup.map(n=>`<a href="members.html?m=${encodeURIComponent(n.replace(/\(.*\)/,''))}">${esc(n)}</a>`).join('')}</p><h3>团体公式图（${g.length}）</h3>${g.length?G(g,'land'):'<p style="color:var(--sub)">未找到。</p>'}<h3>个人公式图（${iv.length}）</h3>${Object.entries(by).map(([n,a])=>`<h4>${esc(n)}</h4>${G(a)}`).join('')||'<p style="color:var(--sub)">未找到。</p>'}</section>`}).join('');
 bindLB(m,flat);imgDone(m);return}
if(P=='songs'){const S=await J('songs');let filter=q.get('f')||'all';
 const isCover=s=>/カバー/.test(s.note||'');
 const kind=s=>s.release=='未音源化'?'未音源化':/スターターパック/.test(s.release||'')?'スターターパック':/エクストラパック/.test(s.release||'')?'エクストラパック':/メロメラ/.test(s.release||'')?'メロメラ':'其他';
 const FILTERS=[['all','全部',()=>1],['solo','个人曲',s=>!!s.member],['costume','有打歌服',s=>(s.costumes||[]).length],['starter','スターターパック',s=>kind(s)=='スターターパック'],['extra','エクストラパック',s=>kind(s)=='エクストラパック'],['meromera','メロメラ',s=>kind(s)=='メロメラ'],['single','其他',s=>kind(s)=='其他'&&!s.member],['unreleased','未音源化',s=>kind(s)=='未音源化'],['cover','翻唱',isCover]];
 const imgs=s=>(s.costumes||[]).flatMap(c=>(c.images&&c.images.length?c.images:(c.image?[c.image]:[])).map(im=>({...im,c})));
 const thumb=s=>{const v=(s.videos||[])[0],i=imgs(s)[0],cov=s.cover;
  /* 方形封面（配信 jacket）最像专辑封面，优先；没有再退到官方 MV 缩略图；
     非方形封面（X 上的告知图/活动横幅）排在 MV 之后；都没有才显示占位块 */
  const isSq=im=>im&&im.w&&im.h&&Math.abs(im.w/im.h-1)<0.08;
  const pic=im=>`<img loading=lazy src="${im.local||im.url}" alt="${esc(s.title)}">`;
  if(isSq(cov))return pic(cov);
  if(v&&v.thumb)return `<img loading=lazy src="${v.thumb}" alt="${esc(s.title)}" class=vtimg>`;
  if(cov)return pic(cov);
  if(i)return pic(i);
  return `<span class=songph><b>${esc(s.title)}</b><small>未音源化 · 无官方封面</small></span>`};
 const chips=f=>`<p class=filters>${FILTERS.map(([k,n,fn])=>`<button class="${f==k?'':'off'}" data-f=${k}>${n} ${S.filter(fn).length}</button>`).join('')}</p>`;
 const render=()=>{
  const curQ=new URLSearchParams(location.search),id=curQ.get('s');
  if(id){
   const s=S.find(x=>String(x.id)==String(id));
   if(s){
    document.title=`${s.title} · SONGS | iLiFE! 应援资料库`;
    const flat=[],cosList=s.costumes||[],vidList=s.videos||[],imgList=s.images||[];
    const KINDNAME={MV:'MV',Lyric:'Lyric Video',Live:'LIVE 映像',Dance:'Dance Video',Other:'影像'};
    const offV=vidList.filter(v=>v.official!==false), unV=vidList.filter(v=>v.official===false);
    const vidCard=v=>`<a class=vid href="${v.url}" target=_blank rel=noopener>${v.thumb?`<span class=vt><img loading=lazy decoding=async src="${v.thumb}" alt=""></span>`:'<span class=vt></span>'}<span class=vb><b>${esc(KINDNAME[v.kind]||v.kind)}${v.official===false?'<i class=tag>非官方</i>':''}</b><span class=vtl>${esc(v.title)}</span><span class=vdt>${esc(v.channel? v.channel+' · ':'')}${esc(v.date||'')} · YouTube ↗</span></span></a>`;
    const vidPane=(arr,empty)=>arr.length?`<div class=vidlist>${arr.map(vidCard).join('')}</div>`:`<p class=none>${empty}</p>`;
    const vidEmpty=s.release=='未音源化'?'未音源化 · 从未发行音源，故无官方影像（仅现场披露）':'未找到官方影像';
    /* 只有官方 → 单栏；只有非官方 → 单栏并标注；两者都有 → 可切换 */
    const vtab=offV.length?'1':'0';
    const vidHTML=!unV.length?vidPane(offV,vidEmpty)
      :!offV.length?`<p class=nonote>以下 ${unV.length} 条均为粉丝上传，非官方发布。</p>${vidPane(unV,'')}`
      :`<p class=filters><button data-vt=1 class="${vtab=='1'?'':'off'}">官方 ${offV.length}</button><button data-vt=0 class="${vtab=='0'?'':'off'}">非官方 ${unV.length}</button></p><div class=vidpane data-vp=1${vtab=='1'?'':' hidden'}>${vidPane(offV,vidEmpty)}</div><div class=vidpane data-vp=0${vtab=='0'?'':' hidden'}>${vidPane(unV,'没有收录非官方影像')}</div>`;
    const imgst=flat.length;
    imgList.forEach(i=>flat.push({...i,date:i.date,post:i.post,text:`${s.title} · 官方帖`}));
    const imgHTML=imgList.length?`<div class="gal photos wide">${imgList.map((i,idx)=>`<a class=ph href="${i.local||i.url}" data-i="${imgst+idx}" target=_blank><img loading=lazy decoding=async src="${i.local||i.url}" width="${i.w}" height="${i.h}" alt="${esc(s.title)}"></a>`).join('')}</div>`:'<p class=none>暂无相关图片</p>';
    const cosHTML=cosList.length?cosList.map(c=>{
     const L=c.images&&c.images.length?c.images:(c.image?[c.image]:[]);
     const st=flat.length;
     L.forEach(i=>flat.push({...i,date:c.debut_date,post:c.source,text:`${s.title} · ${c.name} (${c.era_name})`}));
     return `<div class=cos><div class=cos-hd><span class=tag>${esc(c.era_name)}</span><b>${esc(c.name)}</b><small>初登场 ${esc(c.debut_date)} · <a href="${c.source}" target=_blank>出处 ↗</a></small></div>${c.note?`<div class=cos-note>${lk(c.note)}</div>`:''}<div class="gal photos">${L.map((i,idx)=>`<a class=ph href="${i.local||i.url}" data-i="${st+idx}" target=_blank><img loading=lazy decoding=async src="${i.local||i.url}" width="${i.w}" height="${i.h}" alt="${esc(c.name)}"></a>`).join('')}</div></div>`;
    }).join(''):'<p class=none>暂无专属打歌服收录</p>';
    const isSq=im=>im&&im.w&&im.h&&Math.abs(im.w/im.h-1)<0.08;
    const cvImg=(isSq(s.cover)&&s.cover)||(vidList[0]&&vidList[0].thumb?{local:vidList[0].thumb}:null)||s.cover||imgList[0];
    const cvHTML=`<div class=dt-cv>${cvImg?`<img loading=lazy src="${cvImg.local||cvImg.url}" alt="${esc(s.title)}">`:`<div class=songph><b>${esc(s.title)}</b><small>未音源化 · 无官方封面</small></div>`}</div>`;
    m.innerHTML=`<a class=back href="songs.html${filter!='all'?'?f='+filter:''}">‹ 返回歌曲列表</a><div class=dt><div class=dt-top>${cvHTML}<div class=dt-info><div class=dt-hd><h2>${esc(s.title)}${isCover(s)?'<span class=tag>翻唱</span>':''}</h2><div class=kana>${esc(s.kana||'')}</div></div><dl class=meta>${s.member?`<dt>演唱</dt><dd>${esc(s.member)} ソロ</dd>`:''}<dt>曲长</dt><dd>${esc(s.duration||'—')}</dd><dt>MV 公开日</dt><dd>${esc(s.mv_date||'—')}</dd><dt>发行日</dt><dd>${esc(s.release_date||'—')}</dd><dt>所属作品</dt><dd>${esc(s.release||'未收录')}</dd></dl><a class=src href="${s.source}" target=_blank>出处 ↗</a></div></div>${s.note?`<p class=note>${lk(s.note)}</p>`:''}<h3 class=sec>${unV.length?'影像 · '+vidList.length+' 条':'官方影像 · '+vidList.length+' 条'}</h3>${vidHTML}<h3 class=sec>相关图片 · ${imgList.length} 张</h3>${imgHTML}<h3 class=sec>打歌服 · ${cosList.length} 套</h3>${cosHTML}</div>`;
    const b=m.querySelector('.back');
    if(b)b.onclick=e=>{if(e.button===0&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey){e.preventDefault();history.pushState(null,'',b.getAttribute('href'));render()}};
    m.querySelectorAll('[data-vt]').forEach(btn=>btn.onclick=()=>{const k=btn.dataset.vt;m.querySelectorAll('[data-vt]').forEach(b=>b.classList.toggle('off',b.dataset.vt!==k));m.querySelectorAll('[data-vp]').forEach(x=>x.hidden=x.dataset.vp!==k)});
    m.querySelectorAll('.cos .ph,.dt .gal.photos .ph').forEach(el=>el.onclick=e=>{e.preventDefault();LB=flat;LI=+el.dataset.i;lbShow()});
    imgDone(m);window.scrollTo(0,0);return;
   }
  }
  document.title='SONGS · 歌曲与打歌服 | iLiFE! 应援资料库';
  filter=curQ.get('f')||filter||'all';
  const filterItem=FILTERS.find(x=>x[0]==filter)||FILTERS[0];
  const list=S.filter(filterItem[2]);
  m.innerHTML=`<h1 class=ttl>SONGS</h1><p class=sub>歌曲与打歌服 · 共 ${S.length} 首</p>${chips(filter)}<div class=grid>${list.map(s=>{
   const n=(s.costumes||[]).length,vn=(s.videos||[]).length;
   return `<a class=card href="?s=${s.id}"><div class=cv>${thumb(s)}${n?`<span class=badge>👗 ${n}</span>`:''}</div><div class=bd><b>${esc(s.title)}${isCover(s)?'<span class=tag>翻唱</span>':''}</b><div class=k>${esc(s.kana||'')}${s.member?' · '+esc(s.member)+' ソロ':''}</div><div class=m>${s.mv_date?'MV '+esc(s.mv_date):vn?`影像 ${vn} 条`:'MV —'}</div><div class=m>${esc(s.release||'未收录')}${s.duration?' · '+esc(s.duration):''}</div></div></a>`;
  }).join('')}</div>`;
  m.querySelectorAll('[data-f]').forEach(btn=>btn.onclick=()=>{filter=btn.dataset.f;history.replaceState(null,'',filter=='all'?'songs.html':'?f='+filter);render()});
  m.querySelectorAll('.grid .card').forEach(card=>card.onclick=e=>{if(e.button===0&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey){e.preventDefault();history.pushState(null,'',card.getAttribute('href'));render()}});
  imgDone(m);
 };
 window.addEventListener('popstate',render);
 render();return}
if(P=='draw'){
 const [S,M,I]=await Promise.all([J('songs'),J('members'),J('images')]);
 const KEY='ilifefan-draw-v1';
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 const reduceMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const jstDay=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const empty=()=>({v:1,prefs:{mode:'song',songFilter:'all',includeFormer:false},first:{song:'',member:''},history:{song:[],member:[]}});
 const dayOk=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'');
 const dayLabel=day=>{
  if(!dayOk(day))return '';
  const w=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Tokyo',weekday:'short'}).format(new Date(day+'T12:00:00+09:00'));
  return day.replace(/-/g,'.')+' · '+w;
 };
 const normalize=raw=>{
  const base=empty();
  if(!raw||typeof raw!='object')return base;
  const prefs=raw.prefs||{};
  if(prefs.mode=='member')base.prefs.mode='member';
  if(prefs.songFilter=='group'||prefs.songFilter=='solo')base.prefs.songFilter=prefs.songFilter;
  base.prefs.includeFormer=!!prefs.includeFormer;
  ['song','member'].forEach(k=>{
   if(raw.first&&dayOk(raw.first[k]))base.first[k]=raw.first[k];
   const arr=raw.history&&Array.isArray(raw.history[k])?raw.history[k]:[];
   base.history[k]=arr.filter(x=>x&&Number.isFinite(Number(x.id))&&dayOk(x.day)).slice(0,20).map(x=>{
    const o={id:Number(x.id),day:x.day,at:typeof x.at=='string'?x.at:'',first:!!x.first};
    const fortune=packFortune(x.fortune);if(fortune)o.fortune=fortune;
    return o;
   });
  });
  return base;
 };
 const load=()=>{try{return normalize(JSON.parse(localStorage.getItem(KEY)||''))}catch(e){return empty()}};
 let st,view=null,busy=false,enterAnim=false,shaking=false,toastT=0;
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){toast('这个浏览器无法保存抽签记录')}};
 const toast=msg=>{let t=$('#dtoast');if(!t){document.body.insertAdjacentHTML('beforeend','<div id=dtoast role=status></div>');t=$('#dtoast')}t.textContent=msg;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),2400)};
 if(!$('#dpetals'))document.body.insertAdjacentHTML('beforeend','<div id=dpetals aria-hidden=true></div>');
 const safeHex=h=>/^#[0-9a-fA-F]{6}$/.test(h||'')?h:'#e4007f';
 const lightHex=h=>{const n=h.slice(1),r=parseInt(n.slice(0,2),16),g=parseInt(n.slice(2,4),16),b=parseInt(n.slice(4,6),16);return (r*299+g*587+b*114)/1000>186};
 const accentOf=hex=>lightHex(hex)? '#e4007f':hex;
 const randIndex=n=>{
  if(n<=1)return 0;
  const buf=new Uint32Array(1),limit=Math.floor(0x100000000/n)*n;
  let x;do{crypto.getRandomValues(buf);x=buf[0]}while(x>=limit);
  return x%n;
 };
 /* 今日运势词库，改这里即可 */
 const PASTELS=[
  {name:'樱花粉',hex:'#ffb7d5'},{name:'草莓粉',hex:'#e85a9b'},{name:'蜜桃',hex:'#ffc2a8'},
  {name:'奶油黄',hex:'#ffe08a'},{name:'香芋紫',hex:'#d4b4e8'},{name:'薄荷绿',hex:'#b7e4c7'},
  {name:'珊瑚',hex:'#ff8fab'},{name:'杏子',hex:'#ffc9a3'},{name:'葡萄',hex:'#c9a0dc'},
  {name:'玫瑰',hex:'#e4007f'},{name:'奶白',hex:'#fff1f6'},{name:'丁香',hex:'#e6c6e6'}
 ];
 const LUCK_ITEMS=['应援手灯','歌名便签','一张拍立得','今日发圈','口袋票根','草莓软糖','成员色发带','充满电的耳机','袖口小徽章','应援毛巾','歌词书签','闪亮指甲贴'];
 const LUCK_ACTS=['把副歌再听一遍','把签发给同担','跟着节拍点头','写下喜欢的一句','给今天的推比心','单曲循环到会唱','把应援色穿上','放进今日歌单','看一眼公式照','把签名着声唱出来','把灯牌举高一点','和同担分享这张签'];
 const LUCK_MOTTOS=['今天也把副歌唱亮','小幸运落在节拍上','把喜欢大声说出来','今天的推就在眼前','一首歌的时间刚刚好','应援色会照亮今天','走到灯下就是主角','把心跳交给这首歌','今天也要闪闪发光','同担的消息会带来好运','再听一遍运气就到','先对自己笑一个'];
 const memberLucky=mem=>{
  if(!/^#[0-9a-fA-F]{6}$/.test(mem&&mem.hex||''))return null;
  const raw=String(mem.color||'');
  let name='';
  if(/黄/.test(raw)&&/緑|绿/.test(raw))name='黄绿';
  else if(/桃/.test(raw))name='桃';
  else if(/水色/.test(raw))name='水色';
  else if(/粉|ピンク/.test(raw))name='粉';
  else if(/橙|オレンジ/.test(raw))name='橙';
  else if(/紫/.test(raw))name='紫';
  else if(/緑|绿/.test(raw))name='绿';
  else if(/黄/.test(raw))name='黄';
  else if(/青/.test(raw))name='青';
  else if(/赤|红/.test(raw))name='赤';
  else if(/白/.test(raw))name='白';
  return name?{hex:mem.hex,name}:null;
 };
 const rollFortune=(mode,item)=>{
  const color=mode=='member'&&memberLucky(item)||PASTELS[randIndex(PASTELS.length)];
  return {color:color.hex,colorName:color.name,item:LUCK_ITEMS[randIndex(LUCK_ITEMS.length)],action:LUCK_ACTS[randIndex(LUCK_ACTS.length)],motto:LUCK_MOTTOS[randIndex(LUCK_MOTTOS.length)]};
 };
 const packFortune=f=>{
  if(!f||typeof f!='object')return null;
  const color=/^#[0-9a-fA-F]{6}$/.test(f.color||'')?f.color:'';
  const cut=(s,n)=>typeof s==='string'?s.trim().slice(0,n):'';
  const colorName=cut(f.colorName,16),item=cut(f.item,40),action=cut(f.action,40),motto=cut(f.motto,48);
  return color&&colorName&&item&&action&&motto?{color,colorName,item,action,motto}:null;
 };
 st=load();
 const isSq=im=>im&&im.w&&im.h&&Math.abs(im.w/im.h-1)<0.08;
 const songSrc=s=>{
  const v=(s.videos||[])[0],cov=s.cover;
  const cos=(s.costumes||[]).flatMap(c=>(c.images&&c.images.length?c.images:(c.image?[c.image]:[])));
  if(isSq(cov))return cov.local||cov.url||'';
  if(v&&v.thumb)return v.thumb;
  if(cov&&(cov.local||cov.url))return cov.local||cov.url;
  if(cos[0])return cos[0].local||cos[0].url||'';
  const im=(s.images||[])[0];
  return im?(im.local||im.url||''):'';
 };
 const memberSrc=mem=>{const p=latestPhoto(I,mem.name);return p?(p.local||p.url||''):''};
 const songById=id=>S.find(s=>s.id==id);
 const memberById=id=>M.find(mem=>mem.id==id);
 const pool=()=>{
  if(st.prefs.mode=='song'){
   const f=st.prefs.songFilter;
   return S.filter(s=>f=='all'?1:f=='group'?!s.member:!!s.member);
  }
  return M.filter(mem=>st.prefs.includeFormer||mem.status=='现役');
 };
 const counts=()=>({all:S.length,group:S.filter(s=>!s.member).length,solo:S.filter(s=>!!s.member).length,active:M.filter(mem=>mem.status=='现役').length,allM:M.length});
 const burst=hex=>{
  if(reduceMotion())return;
  const layer=$('#dpetals'),card=m.querySelector('.dpolaroid')||m.querySelector('.dsheet');if(!layer||!card)return;
  const r=card.getBoundingClientRect(),cx=r.left+r.width*0.72,cy=r.top+36;
  const col=accentOf(safeHex(hex));
  const colors=[col,'#e4007f','#ffb3d6','#fff6fb',col];
  for(let i=0;i<16;i++){
   const p=document.createElement('span');p.className='dpetal';
   const ang=(Math.PI*2*i)/16+(Math.random()-.5)*0.5,dist=78+Math.random()*110;
   p.style.left=cx+'px';p.style.top=cy+'px';p.style.background=colors[i%colors.length];
   p.style.setProperty('--dx',(Math.cos(ang)*dist)+'px');
   p.style.setProperty('--dy',(Math.sin(ang)*dist-28)+'px');
   p.style.setProperty('--rot',((Math.random()*220)-110)+'deg');
   layer.appendChild(p);setTimeout(()=>p.remove(),1400);
  }
 };
 const fileName=()=>{
  const kind=view.mode=='song'?'song':'member';
  const label=String(view.mode=='song'?view.item.title:view.item.name).replace(/[\\/:*?"<>|\s]+/g,'');
  return `ilifefan-${kind}-${label}-${view.day}.png`;
 };
 const caption=()=>{
  const who=view.mode=='song'
   ?`${view.day} 抽歌\n${view.item.title}${view.item.kana?'（'+view.item.kana+'）':''}`
   :`${view.day} 抽推\n${view.item.name}${view.item.kana?'（'+view.item.kana+'）':''}`;
  return `iLiFE! 应援资料库\n${who}${view.fortune?'\n'+view.fortune.motto:''}`;
 };
 const loadImg=src=>new Promise(res=>{
  if(!src)return res(null);
  const im=new Image();im.crossOrigin='anonymous';
  im.onload=()=>res(im.naturalWidth?im:null);im.onerror=()=>res(null);im.src=src;
 });
 const roundRect=(ctx,x,y,w,h,r)=>{
  const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);
  ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();
 };
 const wrapLines=(ctx,text,max)=>{
  const lines=[];let line='';
  for(const ch of [...String(text||'')]){
   const t=line+ch;
   if(line&&ctx.measureText(t).width>max){lines.push(line);line=ch}else line=t;
  }
  if(line)lines.push(line);return lines;
 };
 const buildCanvas=async()=>{
  try{await Promise.race([Promise.all([
   document.fonts.load('700 44px "Noto Sans SC"'),
   document.fonts.load('500 22px "Noto Sans SC"'),
   document.fonts.load('900 36px Roboto')
  ]),wait(1800)])}catch(e){}
  const W=900,H=1600,F='"Noto Sans SC",Roboto,"PingFang SC",sans-serif';
  const song=view.mode=='song',item=view.item;
  const hex=song?'#e4007f':safeHex(item.hex);
  const src=song?songSrc(item):memberSrc(item);
  const img=await loadImg(src);
  const c=document.createElement('canvas');c.width=W;c.height=H;
  const x=c.getContext('2d');x.imageSmoothingQuality='high';
  x.fillStyle='#fbf8f4';x.fillRect(0,0,W,H);
  const blob=(cx,cy,r,col)=>{const g=x.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(251,248,244,0)');x.fillStyle=g;x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.fill()};
  blob(140,80,280,'rgba(228,0,127,.16)');blob(780,200,240,'rgba(255,179,214,.45)');blob(160,1480,260,'rgba(228,0,127,.08)');
  x.save();x.shadowColor='rgba(228,0,127,.14)';x.shadowBlur=28;x.shadowOffsetY=12;x.fillStyle='#fff';roundRect(x,40,48,W-80,H-96,36);x.fill();x.restore();
  x.save();roundRect(x,40,48,W-80,H-96,36);x.clip();
  x.strokeStyle='rgba(228,0,127,.09)';x.lineWidth=1;
  for(let ly=96;ly<H-70;ly+=32){x.beginPath();x.moveTo(64,ly);x.lineTo(W-64,ly);x.stroke()}
  x.restore();
  x.textAlign='center';x.textBaseline='middle';
  x.fillStyle='#8a8a8a';x.font='700 18px '+F;x.letterSpacing='6px';x.fillText('DRAW',W/2,102);x.letterSpacing='0px';
  x.fillStyle='#2b2b2b';x.font='500 22px '+F;x.fillText(dayLabel(view.day),W/2,142);
  x.fillStyle='#e4007f';x.font='700 16px '+F;x.letterSpacing='3px';x.fillText("TODAY'S DRAW",W/2,176);x.letterSpacing='0px';
  x.fillStyle='#8a8a8a';x.font='500 20px '+F;x.fillText('今日的签',W/2,206);
  const photoW=song?480:400,photoH=song?460:480,pad=22,capH=88;
  const frameW=photoW+pad*2,frameH=pad+photoH+capH,frameX=(W-frameW)/2,frameY=236;
  x.save();
  x.translate(W/2,frameY+frameH/2);x.rotate(-1.5*Math.PI/180);x.translate(-W/2,-(frameY+frameH/2));
  x.save();x.shadowColor='rgba(43,43,43,.16)';x.shadowBlur=24;x.shadowOffsetY=10;x.fillStyle='#fff';roundRect(x,frameX,frameY,frameW,frameH,8);x.fill();x.restore();
  const ix=frameX+pad,iy=frameY+pad;
  x.save();roundRect(x,ix,iy,photoW,photoH,4);x.clip();
  x.fillStyle=song?'#f6e7ee':'#fbf3f7';x.fillRect(ix,iy,photoW,photoH);
  if(!song){x.fillStyle=hex;x.globalAlpha=lightHex(hex)?0.16:0.22;x.fillRect(ix,iy,photoW,photoH);x.globalAlpha=1}
  const probe=document.createElement('canvas').getContext('2d');
  const linesOf=(font,text,max)=>{probe.font=font+' '+F;return wrapLines(probe,String(text||''),max)};
  if(img){
   const s=Math.min(photoW/img.width,photoH/img.height),dw=img.width*s,dh=img.height*s;
   x.drawImage(img,ix+(photoW-dw)/2,iy+(photoH-dh)/2,dw,dh);
  }else{
   const g=x.createLinearGradient(ix,iy,ix+photoW,iy+photoH);g.addColorStop(0,'#ffd0e6');g.addColorStop(1,'#e4007f');x.fillStyle=g;x.fillRect(ix,iy,photoW,photoH);
   x.fillStyle='#fff';x.font='700 36px '+F;x.textAlign='center';x.textBaseline='middle';
   linesOf('700 36px',song?item.title:item.name,photoW-48).slice(0,3).forEach((ln,i)=>x.fillText(ln,ix+photoW/2,iy+photoH/2-36+i*44));
  }
  x.restore();
  const title=song?item.title:item.name,kana=item.kana||'';
  x.textAlign='center';x.textBaseline='middle';x.fillStyle='#2b2b2b';x.font='700 30px '+F;
  const tLines=linesOf('700 30px',title,photoW-8).slice(0,2);
  let cy=iy+photoH+34;
  tLines.forEach(ln=>{x.fillText(ln,frameX+frameW/2,cy);cy+=34});
  if(kana){x.fillStyle='#8a8a8a';x.font='500 18px '+F;x.fillText(kana,frameX+frameW/2,cy+4)}
  const sealText=view.first?'今日首抽':(song?'抽歌':'抽推');
  x.save();x.translate(frameX+frameW-6,frameY+22);x.rotate(-8*Math.PI/180);
  x.beginPath();x.arc(0,0,46,0,Math.PI*2);x.fillStyle='rgba(255,255,255,.95)';x.fill();x.lineWidth=4;x.strokeStyle='#e4007f';x.stroke();
  x.beginPath();x.arc(0,0,38,0,Math.PI*2);x.lineWidth=1.5;x.strokeStyle='rgba(228,0,127,.4)';x.stroke();
  x.fillStyle='#e4007f';x.textAlign='center';x.textBaseline='middle';x.font='700 16px '+F;
  const chars=[...sealText];
  if(chars.length<=2)x.fillText(sealText,0,1);
  else{const mid=Math.ceil(chars.length/2);x.fillText(chars.slice(0,mid).join(''),0,-10);x.fillText(chars.slice(mid).join(''),0,11)}
  x.restore();
  x.restore();
  let y=frameY+frameH+56;
  const kind=song?(item.member?'个人曲 · '+item.member:'团体曲'):((item.status||'')+(item.color?' · '+item.color:''));
  x.textAlign='center';x.fillStyle='#e4007f';x.font='700 20px '+F;x.fillText(kind,W/2,y);y+=40;
  if(!song){
   x.fillStyle=hex;roundRect(x,250,y-8,W-500,12,6);x.fill();
   if(lightHex(hex)){x.strokeStyle='#e6dfd9';x.lineWidth=2;x.stroke()}
   y+=28;
  }
  const row=(label,value)=>{
   x.textAlign='left';x.textBaseline='middle';x.fillStyle='#8a8a8a';x.font='500 18px '+F;x.fillText(label,110,y);
   x.textAlign='right';x.fillStyle='#2b2b2b';x.font='700 22px '+F;
   const lines=linesOf('700 22px',value,460).slice(0,2);
   lines.forEach((ln,i)=>x.fillText(ln,W-110,y+i*28));
   const h=Math.max(28,lines.length*28);
   y+=h+8;x.strokeStyle='rgba(228,0,127,.16)';x.beginPath();x.moveTo(110,y);x.lineTo(W-110,y);x.stroke();y+=22;
  };
  if(song){row('时长',item.duration||'—');row('作品',item.release||'—')}
  else{row('状态',item.status||'—');if(item.catch)row('口号',item.catch)}
  const fort=view.fortune;
  if(fort){
   y+=10;x.textAlign='center';x.textBaseline='middle';x.fillStyle='#e4007f';x.font='700 16px '+F;x.letterSpacing='4px';x.fillText('今日运势',W/2,y);x.letterSpacing='0px';
   y+=34;x.font='700 22px '+F;
   const qLines=linesOf('700 22px','「'+fort.motto+'」',W-240).slice(0,2);
   const qh=qLines.length*30+36;
   x.fillStyle='#fff6fb';roundRect(x,86,y-24,W-172,qh,18);x.fill();
   x.fillStyle='#e4007f';x.font='700 14px '+F;x.letterSpacing='3px';x.fillText('签语',W/2,y-2);x.letterSpacing='0px';
   x.fillStyle='#2b2b2b';x.font='700 22px '+F;qLines.forEach((ln,i)=>x.fillText(ln,W/2,y+22+i*30));
   y+=qh+20;
   const luckRow=(label,value,swatch)=>{
    x.fillStyle='#fff';roundRect(x,86,y-22,W-172,48,16);x.fill();
    x.strokeStyle='#ffe4f0';x.lineWidth=2;x.stroke();
    x.textAlign='left';x.fillStyle='#8a8a8a';x.font='500 18px '+F;x.fillText(label,112,y);
    x.font='700 20px '+F;x.fillStyle='#2b2b2b';x.textAlign='right';
    const vw=x.measureText(value).width;
    if(swatch){
     const cx=W-112-vw-18;
     x.beginPath();x.arc(cx,y,9,0,Math.PI*2);x.fillStyle=swatch;x.fill();
     if(lightHex(swatch)){x.strokeStyle='#e6dfd9';x.lineWidth=1.5;x.stroke()}
     x.fillStyle='#2b2b2b';
    }
    x.fillText(value,W-112,y);y+=62;
   };
   luckRow('幸运色',fort.colorName,fort.color);
   luckRow('幸运物品',fort.item);
   luckRow('今日行动',fort.action);
  }
  x.textAlign='center';x.textBaseline='middle';x.fillStyle='#2b2b2b';x.font='900 32px Roboto,sans-serif';
  const brand='iLiFE',bang='!',tail=' 应援资料库';
  const bw=x.measureText(brand).width,jw=x.measureText(bang).width;
  x.font='500 22px '+F;const tw=x.measureText(tail).width;
  const start=(W-bw-jw-tw)/2;
  x.textAlign='left';x.font='900 32px Roboto,sans-serif';x.fillStyle='#2b2b2b';x.fillText(brand,start,1472);
  x.fillStyle='#e4007f';x.fillText(bang,start+bw,1472);
  x.fillStyle='#2b2b2b';x.font='500 22px '+F;x.fillText(tail,start+bw+jw,1472);
  x.textAlign='center';x.fillStyle='#b9a3ad';x.font='500 18px '+F;x.fillText('非官方粉丝站',W/2,1516);
  return c;
 };
 const downloadBlob=(blob,name)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),2500)};
 const saveCard=async()=>{
  if(!view||busy)return;
  const btn=$('#drawSave');if(btn)btn.disabled=true;
  try{
   const canvas=await buildCanvas();
   const blob=await new Promise(res=>canvas.toBlob(res,'image/png'));
   if(!blob)throw new Error('png');
   const name=fileName(),file=new File([blob],name,{type:'image/png'});
   if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
    try{
     await navigator.share({files:[file],title:'iLiFE! 抽签',text:caption()});
     toast('已打开分享');return;
    }catch(e){if(e&&e.name=='AbortError')return}
   }
   downloadBlob(blob,name);toast('已保存卡片');
  }catch(e){toast('没能生成卡片')}
  finally{if(btn)btn.disabled=false}
 };
 const render=()=>{
  document.title='DRAW · 抽签 | iLiFE! 应援资料库';
  const mode=st.prefs.mode,list=pool(),n=counts(),anim=enterAnim&&!reduceMotion();enterAnim=false;
  const phase=shaking?'shake':view?'show':'idle';
  const hero=!view&&!shaking?(mode=='song'
   ?'<p class=dkick>DRAW</p><h1 class=dhero>今日抽一首歌</h1><p class=dlead>从曲库里随机听一首。不限次数。</p>'
   :'<p class=dkick>DRAW</p><h1 class=dhero>今日抽一位推</h1><p class=dlead>从成员里随机看一位。不限次数。</p>'):'';
  const slip=shake=>`<div class="dslip${shake?' is-shake':''}" aria-hidden=true><div class=dslip-seal>i<b>!</b></div><p class=dslip-k>DRAW</p><p class=dslip-t>抽签</p></div>`;
  const frame=(src,alt,href,mem)=>{
   const inner=src?`<img src="${esc(src)}" alt="${esc(alt)}">`:`<span class=songph><b>${esc(alt)}</b><small>无官方图片</small></span>`;
   return `<a class="dframe${mem?' mem':''}" href="${href}">${inner}</a>`;
  };
  const luckBlock=f=>f?`<section class=dluck><p class=dmicro>今日运势</p><div class=dluck-q><span>签语</span><b>「${esc(f.motto)}」</b></div><div class=dluck-rows><p><span>幸运色</span><b><i class="dswatch${lightHex(f.color)?' light':''}" style="background:${f.color}"></i>${esc(f.colorName)}</b></p><p><span>幸运物品</span><b>${esc(f.item)}</b></p><p><span>今日行动</span><b>${esc(f.action)}</b></p></div></section>`:'';
  let stage='';
  if(shaking){
   stage=`${slip(true)}<p class=dshake-t>${mode=='song'?'正在抽歌…':'正在抽推…'}</p><p class=dshake-s>稍等一下</p><div class=dcharge aria-hidden=true><i></i></div><button type=button id=drawGo class=go disabled hidden>抽取</button>`;
  }else if(view&&view.mode=='song'){
   const s=view.item,href='songs.html?s='+s.id;
   stage=`<article class="dsheet${anim?' is-in':''}"><p class=ddate>${esc(dayLabel(view.day))}</p><p class=dkick>TODAY'S DRAW</p><p class=dsubk>今日的签</p><div class=dpolaroid>${frame(songSrc(s),s.title,href,false)}<div class="dseal${anim?' is-pop':''}">${view.first?'今日首抽':'抽歌'}</div><p class=dcap><b>${esc(s.title)}</b>${s.kana?`<span>${esc(s.kana)}</span>`:''}</p></div><div class="drows dmeta"><p><span>种类</span><b class=dkind>${s.member?'个人曲 · '+esc(s.member):'团体曲'}</b></p><p><span>时长</span><b>${esc(s.duration||'—')}</b></p><p><span>作品</span><b>${esc(s.release||'—')}</b></p></div>${luckBlock(view.fortune)}<div class=dsharebox><p class=dask>把今天的签存下来</p><button type=button class="go dcta" id=drawSave>保存卡片</button></div><div class=dacts><button type=button class=off id=drawGo ${busy?'disabled':''}>再抽一次</button><a class="pill off" href="${href}">查看歌曲</a></div><div class=sr aria-live=polite>抽到 ${esc(s.title)}</div></article>`;
  }else if(view){
   const mem=view.item,hex=safeHex(mem.hex),href='members.html?m='+encodeURIComponent(mem.name);
   stage=`<article class="dsheet mem${anim?' is-in':''}"><p class=ddate>${esc(dayLabel(view.day))}</p><p class=dkick>TODAY'S DRAW</p><p class=dsubk>今日的签</p><div class="dpolaroid mem">${frame(memberSrc(mem),mem.name,href,true)}<div class="dseal${anim?' is-pop':''}" style="border-color:${accentOf(hex)};color:${accentOf(hex)}">${view.first?'今日首抽':'抽推'}</div><p class=dcap><b>${esc(mem.name)}</b>${mem.kana?`<span>${esc(mem.kana)}</span>`:''}</p></div><div class="dbar${lightHex(hex)?' light':''}" style="background:${hex}"></div><div class=drows><p><span>状态</span><b class=dkind>${esc(mem.status||'')}${mem.color?' · '+esc(mem.color):''}</b></p>${mem.catch?`<p><span>口号</span><b>${esc(mem.catch)}</b></p>`:''}</div>${luckBlock(view.fortune)}<div class=dsharebox><p class=dask>把今天的签存下来</p><button type=button class="go dcta" id=drawSave>保存卡片</button></div><div class=dacts><button type=button class=off id=drawGo ${busy?'disabled':''}>再抽一次</button><a class="pill off" href="${href}">查看成员</a></div><div class=sr aria-live=polite>抽到 ${esc(mem.name)}</div></article>`;
  }
  const filters=mode=='song'
   ?`<p class=filters role=group aria-label=曲目范围>${[['all','全部',n.all],['group','团体曲',n.group],['solo','个人曲',n.solo]].map(([k,lb,c])=>`<button type=button class="${st.prefs.songFilter==k?'':'off'}" data-sf=${k} aria-pressed=${st.prefs.songFilter==k}>${lb} ${c}</button>`).join('')}</p><p class=dpool>${list.length?`从 ${list.length} 首里抽`:'这个范围里没有歌'}</p>`
   :`<p class=filters><span class=lb>${st.prefs.includeFormer?'全部成员 '+n.allM+' 人':'只抽现役 '+n.active+' 人'}</span><button type=button id=drawFormer class="${st.prefs.includeFormer?'':'off'}" aria-pressed=${st.prefs.includeFormer}>含前成员</button></p><p class=dpool>${list.length?`从 ${list.length} 人里抽`:'这个范围里没有成员'}</p>`;
  const idleExtra=!view&&!shaking?`${slip(false)}<div class=dacts><button type=button class="go dcta" id=drawGo ${busy||!list.length?'disabled':''}>抽取</button></div>`:'';
  const feats=!view&&!shaking?`<section class=dfeats><article class=dfeat><p class=k>SONG</p><h3>抽歌</h3><p>从曲库里抽一首歌。全部 ${n.all} 首，团体曲 ${n.group} 首，个人曲 ${n.solo} 首。</p></article><article class=dfeat><p class=k>MEMBER</p><h3>抽推</h3><p>从成员里抽一位推。现役 ${n.active} 人，含前成员一共 ${n.allM} 人。</p></article><article class=dfeat><p class=k>CARD</p><h3>分享</h3><p>把结果存成竖版卡片，发给同担，或留给自己。</p></article></section>`:'';
  const hist=st.history[mode].map(h=>{
   const item=mode=='song'?songById(h.id):memberById(h.id);if(!item)return '';
   const src=mode=='song'?songSrc(item):memberSrc(item),label=mode=='song'?item.title:item.name;
   const on=view&&!shaking&&view.at===h.at;
   return `<button type=button class="dhi${on?' on':''}" data-hid=${h.id} data-hat="${esc(h.at)}"><span class=ph>${src?`<img alt="" src="${esc(src)}">`:`<b>${esc(label.slice(0,1))}</b>`}</span><b>${esc(label)}</b>${h.first?'<i>首抽</i>':''}</button>`;
  }).join('');
  const histSec=!shaking&&hist?`<section class=dhist><p class=dmicro>最近</p><div class=dgrid>${hist}</div></section>`:'';
  const arch=!shaking?`<section class=darch><p>记录只留在这台浏览器里。可以导出 JSON，换浏览器时再导入。</p><p class=dacts><button type=button class=off id=drawExport>导出存档</button><button type=button class=off id=drawImport>导入存档</button><button type=button class=off id=drawClear>清空记录</button><input id=drawFile type=file accept="application/json,.json" hidden></p></section>`:'';
  const modeBar=`<div class=dmode role=tablist aria-label=抽签模式><button type=button role=tab data-mode=song aria-selected=${mode=='song'}>抽歌</button><button type=button role=tab data-mode=member aria-selected=${mode=='member'}>抽推</button></div>`;
  m.innerHTML=`<div class=dpage data-phase=${phase}><div class=crumb><a href=index.html>首页</a> / 抽签</div><div class=dcol>${hero}${shaking?'':modeBar+filters}${stage}${idleExtra}</div>${feats}${histSec}${arch}</div>`;
  m.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{if(busy||b.dataset.mode==st.prefs.mode)return;st.prefs.mode=b.dataset.mode;view=null;save();render()});
  m.querySelectorAll('[data-sf]').forEach(b=>b.onclick=()=>{if(busy)return;st.prefs.songFilter=b.dataset.sf;if(view&&view.mode=='song'&&!pool().some(s=>s.id==view.item.id))view=null;save();render()});
  const former=$('#drawFormer');if(former)former.onclick=()=>{if(busy)return;st.prefs.includeFormer=!st.prefs.includeFormer;if(view&&view.mode=='member'&&!pool().some(mem=>mem.id==view.item.id))view=null;save();render()};
  const go=$('#drawGo');if(go)go.onclick=()=>{draw()};
  const sv=$('#drawSave');if(sv)sv.onclick=()=>saveCard();
  m.querySelectorAll('[data-hid]').forEach(b=>b.onclick=()=>{
   if(busy)return;
   const h=st.history[mode].find(x=>String(x.id)==b.dataset.hid&&x.at==b.dataset.hat);if(!h)return;
   const item=mode=='song'?songById(h.id):memberById(h.id);if(!item)return;
   let fortune=h.fortune;if(!fortune){fortune=rollFortune(mode,item);h.fortune=fortune;save()}
   view={mode,item,first:!!h.first,day:h.day,at:h.at,hist:true,fortune};render();
  });
  const ex=$('#drawExport');if(ex)ex.onclick=()=>{
   const blob=new Blob([JSON.stringify({key:KEY,exportedAt:new Date().toISOString(),...st},null,2)],{type:'application/json'});
   downloadBlob(blob,`ilifefan-draw-${jstDay()}.json`);toast('已导出存档');
  };
  const im=$('#drawImport');if(im)im.onclick=()=>$('#drawFile').click();
  const file=$('#drawFile');if(file)file.onchange=()=>{
   const f=$('#drawFile').files&&$('#drawFile').files[0];$('#drawFile').value='';if(!f)return;
   const rd=new FileReader();
   rd.onload=()=>{
    try{
     const raw=JSON.parse(String(rd.result||''));
     if(!raw||typeof raw!='object'||!(raw.prefs||raw.history||raw.key==KEY))throw new Error('shape');
     st=normalize(raw);view=null;save();render();toast('已导入存档');
    }catch(e){toast('这份文件不是抽签存档')}
   };
   rd.readAsText(f);
  };
  const clr=$('#drawClear');if(clr)clr.onclick=()=>{
   if(busy)return;
   if(!confirm('清空这台浏览器里的抽签记录？'))return;
   const prefs=st.prefs;st=empty();st.prefs=prefs;view=null;save();render();toast('已清空记录');
  };
  imgDone(m);
 };
 const draw=async()=>{
  if(busy)return;
  const list=pool();
  if(!list.length){toast('这个范围里没有可抽的');return}
  if(!globalThis.crypto||!crypto.getRandomValues){toast('这个浏览器不能公平抽取');return}
  busy=true;
  const reduce=reduceMotion();
  try{
   if(!reduce){shaking=true;render();await wait(1900)}
   const item=list[randIndex(list.length)];
   const day=jstDay(),mode=st.prefs.mode,first=st.first[mode]!==day;
   if(first)st.first[mode]=day;
   const at=new Date().toISOString();
   const fortune=rollFortune(mode,item);
   st.history[mode]=[{id:item.id,day,at,first,fortune},...st.history[mode]].slice(0,20);
   save();
   shaking=false;
   view={mode,item,first,day,at,hist:false,fortune};
   enterAnim=!reduce;
   render();
   if(!reduce){
    burst(mode=='member'?item.hex:'#e4007f');
    const shown=m.querySelector('.dsheet');
    if(shown)shown.scrollIntoView({block:'nearest',behavior:'smooth'});
   }
  }finally{
   const failed=shaking;
   shaking=false;busy=false;
   if(failed)render();
   else{const b=$('#drawGo');if(b)b.disabled=false}
  }
 };
 render();return}
})();
/* column control: one shared control per page type, saved in localStorage */
(()=>{const T={members:'members',gallery:'gallery',eras:'eras',songs:'songs'}[P];if(!T)return;const mob=()=>innerWidth<=760,opts=()=>mob()?[1,2,3,4]:[2,3,4,5,6,8];
 const K='ilife-cols-'+T,KP='ilife-cols-panel',get=k=>localStorage.getItem(k+(mob()?'-m':''))||'auto';
 const apply=()=>{const v=get(K),b=document.body;if(v=='auto'){b.classList.remove('cols-on');b.style.removeProperty('--cols')}else{b.classList.add('cols-on');b.style.setProperty('--cols',v)}
  const pv=get(KP);if(pv=='auto'){b.classList.remove('pcols-on')}else{b.classList.add('pcols-on');b.style.setProperty('--pcols',pv)}
  document.querySelectorAll('.colctl button').forEach(x=>x.classList.toggle('off',x.dataset.v!=get(x.parentNode.dataset.k)));window.__fit&&__fit()};
 const ctl=(k,lb)=>`<span class=lb>${lb}</span>${['auto',...opts()].map(v=>`<button class=off data-v=${v}>${v=='auto'?'自动':v}</button>`).join('')}`;
 const mk=(k,lb,cls)=>{const d=document.createElement('p');d.className='filters colctl '+(cls||'');d.dataset.k=k;d.innerHTML=ctl(k,lb);return d};
 const ensure=()=>{const m=document.querySelector('main');if(!m)return;
  const t=m.querySelector('.mgrid,.gal');if(t&&!m.querySelector('.colctl.main')){const st=m.querySelector('#stk');let r=st&&st.compareDocumentPosition(t)&4?st:t;while(r.parentNode!=m&&r.parentNode.children.length==1)r=r.parentNode;r.parentNode.insertBefore(mk(K,'每行列数','main'),r);apply()}
  const hd=document.querySelector('.stkhd');if(hd&&!hd.querySelector('.colctl')){hd.insertBefore(mk(KP,'卡片/行','pnl'),hd.lastChild);apply()}};
 document.addEventListener('click',e=>{const b=e.target.closest('.colctl button');if(!b)return;const k=b.parentNode.dataset.k+(mob()?'-m':'');b.dataset.v=='auto'?localStorage.removeItem(k):localStorage.setItem(k,b.dataset.v);apply()});
 let fq=0;const fit=()=>{const p=document.querySelector('#onpanel'),st=document.querySelector('#stk'),sb=document.querySelector('#stkb');if(!p||!st||!sb)return;const inS=st.contains(p),tot=(inS?st.offsetHeight:st.offsetHeight+p.offsetHeight);const want=!st.classList.contains('min')&&tot>innerHeight*.6;if(want&&inS){st.after(p);p.classList.add('unstuck')}else if(!want&&!inS){sb.appendChild(p);p.classList.remove('unstuck')}};window.__fit=fit;
 const slot=()=>document.querySelectorAll('.gal,.mgrid,#onpanel').forEach(g=>{let r=0;g.querySelectorAll('img[width][height]').forEach(im=>{r=Math.max(r,im.getAttribute('height')/im.getAttribute('width'))});if(r&&g.style.getPropertyValue('--sr')!=String(r))g.style.setProperty('--sr',r)});
 new MutationObserver(ms=>{ensure();slot();document.querySelectorAll('#onpanel img').forEach(im=>{if(!im.__l){im.__l=1;im.addEventListener('load',()=>fit())}});if(ms.some(m=>m.target.id=='onpanel'||m.target.tagName=='IMG')&&!fq){fq=requestAnimationFrame(()=>{fq=0;fit()})}}).observe(document.body,{childList:true,subtree:true});let w=mob();addEventListener('resize',()=>{fit();if(mob()!=w){w=mob();document.querySelectorAll('.colctl').forEach(c=>c.remove());ensure()}});ensure()})();

const V=(()=>{if(location.protocol==='file:')return '';const s=document.currentScript?.src||document.querySelector('script[src*="app.js"]')?.getAttribute('src')||'';try{return new URL(s,location.href).searchParams.get('v')||''}catch{return ''}})();
window.__VERSION__=V;
const $=s=>document.querySelector(s),J=f=>fetch('data/'+f+'.json'+(V?'?v='+V:'')).then(r=>r.json()),P=document.body.dataset.page,q=new URLSearchParams(location.search);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* 备注里的裸 URL 转成可点链接（先转义再链接化，尾部标点不吞进 href） */
const lk=s=>esc(s).replace(/https?:\/\/[^\s<>"）】]+/g,u=>{const m=u.match(/[.,;:、。；：]+$/),t=m?u.slice(0,-m[0].length):u;return `<a href="${t}" target=_blank rel=noopener>${t}</a>${m?m[0]:''}`});
const NAV=[['index','home','HOME','首页'],['members','members','MEMBER','成员'],['songs','songs','SONG','歌曲'],['lives','lives','LIVE','公演'],['venues','venues','VENUE','场地'],['calendar','calendar','SCHEDULE','日历'],['eras','eras','PROFILE','时期/公式图'],['gallery','gallery','PHOTO','图库']];
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
if(P=='calendar'){const L=await J('lives');let d=new Date(q.get('m')||new Date().toISOString().slice(0,7)+'-01'),cur=q.get('t')||'全部';
 const TYPES=['全部','ワンマン','主催','対バン','フェス','リリイベ','生誕祭','配信','その他'].filter(t=>t=='全部'||L.some(l=>l.type==t));
 const y=d.getFullYear(),mo=d.getMonth(),f=new Date(y,mo,1).getDay(),n=new Date(y,mo+1,0).getDate(),pad=x=>String(x).padStart(2,'0'),ym=(a,b)=>{const t=new Date(a,b,1);return t.getFullYear()+'-'+pad(t.getMonth()+1)};
 const tq=t=>t=='全部'?'':`&t=${encodeURIComponent(t)}`;
 const FL=cur=='全部'?L:L.filter(l=>l.type==cur);
 let c='日一二三四五六'.split('').map(x=>`<div class=wd>${x}</div>`).join('')+'<div></div>'.repeat(f);
 for(let i=1;i<=n;i++){const k=`${y}-${pad(mo+1)}-${pad(i)}`,e=FL.filter(l=>l.date==k);c+=`<div class="${e.length?'ev':''}">${i}${e.map(l=>`<a href="venues.html?v=${encodeURIComponent(l.venue)}">${ltag(l.type)} ${esc(l.title)}</a><small>${esc(l.venue)}${l.start_time?' · '+esc(l.start_time):''}</small>`).join('')}</div>`}
 m.innerHTML=`${head('SCHEDULE','日历 · '+y+'年'+(mo+1)+'月')}<p><a class=pill href="?m=${ym(y,mo-1)}-01${tq(cur)}">‹ 上月</a><a class=pill href="?m=${ym(y,mo+1)}-01${tq(cur)}">下月 ›</a></p><p class=filters><span class=lb>类型筛选</span>${TYPES.map(t=>`<a class="pill ${t==cur?'':'off'}" href="?m=${y}-${pad(mo+1)}-01${tq(t)}">${t} (${t=='全部'?L.length:L.filter(l=>l.type==t).length})</a>`).join('')}</p><p class=filters><span class=lb>有公演的月份</span>${[...new Set(FL.map(l=>l.date.slice(0,7)))].map(x=>`<a class="pill ${x==ym(y,mo)?'':'off'}" href="?m=${x}-01${tq(cur)}">${x}</a>`).join('')}</p><div class=cal>${c}</div>`;return}
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

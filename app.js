const V=(()=>{if(location.protocol==='file:')return '';const s=document.currentScript?.src||document.querySelector('script[src*="app.js"]')?.getAttribute('src')||'';try{return new URL(s,location.href).searchParams.get('v')||''}catch{return ''}})();
window.__VERSION__=V;
const $=s=>document.querySelector(s),J=f=>fetch('data/'+f+'.json'+(V?'?v='+V:'')).then(r=>r.json()),P=document.body.dataset.page,q=new URLSearchParams(location.search);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* 备注里的裸 URL 转成可点链接（先转义再链接化，尾部标点不吞进 href） */
const lk=s=>esc(s).replace(/https?:\/\/[^\s<>"）】]+/g,u=>{const m=u.match(/[.,;:、。；：]+$/),t=m?u.slice(0,-m[0].length):u;return `<a href="${t}" target=_blank rel=noopener>${t}</a>${m?m[0]:''}`});
const LANG_STORAGE_KEY='ilifefan-lang';
const VALID_LANGS=['zh','ja','en'];
const detectLang=()=>{
 try{
  const saved=localStorage.getItem(LANG_STORAGE_KEY);
  if(saved&&VALID_LANGS.includes(saved))return saved;
 }catch(e){}
 const langs=(navigator.languages&&navigator.languages.length)?navigator.languages:[navigator.language||''];
 for(const l of langs){
  if(!l)continue;
  const lower=String(l).toLowerCase();
  if(lower.startsWith('ja'))return 'ja';
  if(lower.startsWith('en'))return 'en';
  if(lower.startsWith('zh'))return 'zh';
 }
 return 'zh';
};
let currentLang=detectLang();
window.getLang=()=>currentLang;
try{document.documentElement.lang=(currentLang==='zh'?'zh-CN':currentLang)}catch(e){}

const NAV=[
 ['index','home','HOME',{zh:'首页',ja:'ホーム',en:'Home'}],
 ['members','members','MEMBER',{zh:'成员',ja:'メンバー',en:'Members'}],
 ['songs','songs','SONG',{zh:'歌曲',ja:'曲一覧',en:'Songs'}],
 ['lives','lives','LIVE',{zh:'公演',ja:'ライブ',en:'Lives'}],
 ['venues','venues','VENUE',{zh:'场地',ja:'会場',en:'Venues'}],
 ['calendar','calendar','SCHEDULE',{zh:'日历',ja:'日程',en:'Calendar'}],
 ['eras','eras','PROFILE',{zh:'时期/公式图',ja:'歴代・公式',en:'Eras'}],
 ['gallery','gallery','PHOTO',{zh:'图库',ja:'写真',en:'Gallery'}]
];

const LANG_OPTS=[
 {code:'zh',name:'简体中文',short:'中文',flag:'🇨🇳'},
 {code:'ja',name:'日本語',short:'日本語',flag:'🇯🇵'},
 {code:'en',name:'English',short:'English',flag:'🇺🇸'}
];
const getLangOpt=code=>LANG_OPTS.find(o=>o.code===code)||LANG_OPTS[0];

const updateLogoText=()=>{
 const sm=document.querySelector('.logo small');if(!sm)return;
 const l=currentLang;
 sm.textContent=l==='ja'?'FAN DATABASE ・ 非公式ファンサイト':l==='en'?'FAN DATABASE ・ UNOFFICIAL FAN SITE':'FAN DATABASE · 应援资料库';
};

const updateFooter=()=>{
 const f=document.querySelector('footer');if(!f)return;
 const l=currentLang;
 if(l==='ja'){
  f.innerHTML='<b>iLiFE! FAN DATABASE</b>非公式ファンサイト。画像の著作権は iLiFE! / HEROINES / imaginate および原権利者に帰属します。出所：@iLiFE_official、ilife-heroines.com、日本語版ウィキペディア。';
 }else if(l==='en'){
  f.innerHTML='<b>iLiFE! FAN DATABASE</b>Unofficial fan database. Image copyrights belong to iLiFE! / HEROINES / imaginate & original creators. Sources: @iLiFE_official, ilife-heroines.com, Wikipedia.';
 }else{
  f.innerHTML='<b>iLiFE! FAN DATABASE</b>非官方粉丝站。图片版权归 iLiFE! / HEROINES / imaginate 及原发布者所有，均标注来源。数据来源：@iLiFE_official、ilife-heroines.com（Wayback 存档）、日文维基百科。';
 }
};

const updateHeaderNav=()=>{
 const l=currentLang,cur=getLangOpt(l);
 document.querySelectorAll('nav a').forEach((a,i)=>{
  const item=NAV[i];if(!item)return;
  const span=a.querySelector('span');if(span)span.textContent=item[3][l]||item[3].zh;
 });
 const curSpan=document.querySelector('#langDd .lang-dd-cur');
 if(curSpan)curSpan.textContent=cur.short;
 document.querySelectorAll('.lang-dd-item').forEach(b=>{
  b.classList.toggle('on',b.dataset.lang===l);
 });
 updateLogoText();
 updateFooter();
};

const renderLangDd=()=>{
 const cur=getLangOpt(currentLang);
 return `<div class="lang-dd" id="langDd"><button type="button" class="lang-dd-btn" id="langDdBtn" aria-haspopup="true" aria-expanded="false" title="Language / 语言切换"><span class="lang-dd-globe">🌐</span><span class="lang-dd-cur">${cur.short}</span><span class="lang-dd-arrow">▾</span></button><div class="lang-dd-menu" role="menu">${LANG_OPTS.map(o=>`<button type="button" class="lang-dd-item${currentLang===o.code?' on':''}" data-lang="${o.code}" role="menuitem"><span class="lang-dd-flag">${o.flag}</span><span class="lang-dd-name">${o.name}</span><span class="lang-dd-check">✓</span></button>`).join('')}</div></div>`;
};

$('header').innerHTML=`<div class=hd><a class=logo href="index.html">iLiFE<b>!</b><small>FAN DATABASE · 应援资料库</small></a><nav>${NAV.map(([f,p,e,c])=>`<a href="${f}.html" class="${p==P?'on':''}">${e}<span>${c[currentLang]||c.zh}</span></a>`).join('')}</nav>${renderLangDd()}<button id=burger aria-label=menu>☰</button></div>`;
$('#burger').onclick=()=>$('nav').classList.toggle('open');

document.addEventListener('click',e=>{
 const dd=document.getElementById('langDd');
 const btn=e.target.closest('#langDdBtn');
 if(btn&&dd){
  const isOpen=dd.classList.toggle('open');
  btn.setAttribute('aria-expanded',String(isOpen));
  return;
 }
 const item=e.target.closest('.lang-dd-item');
 if(item&&item.dataset.lang){
  setLang(item.dataset.lang);
  if(dd){
   dd.classList.remove('open');
   const b=document.getElementById('langDdBtn');
   if(b)b.setAttribute('aria-expanded','false');
  }
  return;
 }
 if(dd&&!e.target.closest('#langDd')){
  dd.classList.remove('open');
  const b=document.getElementById('langDdBtn');
  if(b)b.setAttribute('aria-expanded','false');
 }
});

document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){
  const dd=document.getElementById('langDd');
  if(dd&&dd.classList.contains('open')){
   dd.classList.remove('open');
   const b=document.getElementById('langDdBtn');
   if(b)b.setAttribute('aria-expanded','false');
  }
 }
});

window.setLang=(lang)=>{
 if(!VALID_LANGS.includes(lang))return;
 currentLang=lang;
 try{localStorage.setItem(LANG_STORAGE_KEY,lang)}catch(e){}
 try{document.documentElement.lang=(lang==='zh'?'zh-CN':lang)}catch(e){}
 updateHeaderNav();
 if(typeof window.__updateMascotLang==='function')window.__updateMascotLang();
 if(typeof window.__onLangChange==='function')window.__onLangChange(lang);
};

document.body.insertAdjacentHTML('beforeend',`<footer><b>iLiFE! FAN DATABASE</b>非官方粉丝站。图片版权归 iLiFE! / HEROINES / imaginate 及原发布者所有，均标注来源。数据来源：@iLiFE_official、ilife-heroines.com（Wayback 存档）、日文维基百科。</footer><div id=lb><span class=x>×</span><span class=pv>‹</span><img><p></p><span class=nx>›</span></div>`);
updateLogoText();updateFooter();

/* iLiFE! 官方吉祥物「アイラビット」悬浮抽签入口（可拖动、卡哇伊交互） */
(()=>{
 const jstDay=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const checkDone=()=>{
  try{
   const raw=JSON.parse(localStorage.getItem('ilifefan-draw-v1')||'');
   const day=jstDay();
   const hasM=raw&&raw.history&&raw.history.member&&raw.history.member.some(h=>h.day===day);
   const hasS=raw&&raw.history&&raw.history.song&&raw.history.song.some(h=>h.day===day);
   return hasM&&hasS;
  }catch(e){return false}
 };
 const m=document.createElement('div');
 m.id='dmascot';
 m.className='dmascot'+(P=='draw'?' on-draw':'');
 const getMascotText=()=>{
  const done=checkDone(), l=currentLang;
  if(l==='ja')return done?'今日はおみくじ済 ✨':'今日のおみくじ 💕';
  if(l==='en')return done?'Fortune drawn ✨':'Daily Fortune 💕';
  return done?'今日已求签 ✨':'今日抽签 💕';
 };
 const getMascotTip=()=>{
  const l=currentLang;
  if(l==='ja')return {tip:'今日のおみくじ（ドラッグで移動、タップで引く）',label:'今日のおみくじ'};
  if(l==='en')return {tip:'Daily Fortune (Drag to move, tap to draw)',label:'Daily Fortune'};
  return {tip:'今日抽签（拖动调整位置，点击求签）',label:'今日抽签'};
 };
 const updateMascotUi=()=>{
  const sp=m.querySelector('.dmascot-bubble span');if(sp)sp.textContent=getMascotText();
  const info=getMascotTip();
  m.setAttribute('title',info.tip);m.setAttribute('aria-label',info.label);
 };
 window.__updateMascotLang=updateMascotUi;
 const initialInfo=getMascotTip();
 m.setAttribute('role','button');
 m.setAttribute('aria-label',initialInfo.label);
 m.setAttribute('tabindex','0');
 m.setAttribute('title',initialInfo.tip);
 m.innerHTML=`<div class="dmascot-bubble" aria-hidden="true"><span>${getMascotText()}</span></div><div class="dmascot-ring"></div><div class="dmascot-avatar" aria-hidden="true"></div><div class="dmascot-badge" aria-hidden="true">🐰</div>`;
 document.body.appendChild(m);

 let dragging=false, startX=0, startY=0, initLeft=0, initTop=0, moved=false, pid=null;
 const getPos=()=>{
  const r=m.getBoundingClientRect();
  return {x:r.left, y:r.top};
 };
 const clamp=(x,y)=>{
  const pad=12, w=m.offsetWidth||64, h=m.offsetHeight||64;
  const maxX=window.innerWidth-w-pad, maxY=window.innerHeight-h-pad;
  return {x:Math.max(pad,Math.min(maxX,x)), y:Math.max(pad,Math.min(maxY,y))};
 };
 const setPos=(x,y)=>{
  m.style.left=x+'px'; m.style.top=y+'px';
  m.style.right='auto'; m.style.bottom='auto';
 };

 const burstKawaii=()=>{
  m.classList.remove('is-pop');
  void m.offsetWidth;
  m.classList.add('is-pop');
  const emojis=['💖','✨','🌸','🐰','🎀','💕','🌟'];
  const r=m.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2;
  for(let i=0;i<8;i++){
   const s=document.createElement('span');
   s.className='dmascot-sparkle';
   s.textContent=emojis[i%emojis.length];
   const ang=(Math.PI*2*i)/8+(Math.random()-.5)*0.5;
   const dist=45+Math.random()*45;
   s.style.left=cx+'px'; s.style.top=cy+'px';
   s.style.setProperty('--dx',(Math.cos(ang)*dist)+'px');
   s.style.setProperty('--dy',(Math.sin(ang)*dist-20)+'px');
   s.style.setProperty('--rot',((Math.random()*120)-60)+'deg');
   document.body.appendChild(s);
   setTimeout(()=>s.remove(),900);
  }
 };

 m.addEventListener('pointerdown',e=>{
  if(e.button&&e.button!==0)return;
  dragging=true; moved=false;
  pid=e.pointerId;
  try{m.setPointerCapture(pid)}catch(err){}
  startX=e.clientX; startY=e.clientY;
  const pos=getPos();
  initLeft=pos.x; initTop=pos.y;
  m.classList.add('is-dragging');
 });

 m.addEventListener('pointermove',e=>{
  if(!dragging)return;
  const dx=e.clientX-startX, dy=e.clientY-startY;
  if(Math.hypot(dx,dy)>5) moved=true;
  if(moved){
   const n=clamp(initLeft+dx, initTop+dy);
   setPos(n.x, n.y);
  }
 });

 const activateMascot=()=>{
  burstKawaii();
  if(P!='draw'){
   setTimeout(()=>{ location.href='draw.html'; }, 320);
  }else{
   const target=$('#drawGo')||$('.dsheet');
   if(target){
    target.scrollIntoView({behavior:'smooth',block:'center'});
    target.classList.add('is-kawaii-hint');
    setTimeout(()=>target.classList.remove('is-kawaii-hint'),1200);
   }
  }
 };

 const endDrag=e=>{
  if(!dragging)return;
  dragging=false;
  m.classList.remove('is-dragging');
  try{if(pid!==null)m.releasePointerCapture(pid)}catch(err){}
  if(!moved){
   activateMascot();
  }else{
   const pos=getPos(), midX=window.innerWidth/2;
   const pad=16, w=m.offsetWidth||64;
   const snapX = pos.x < midX ? pad : window.innerWidth-w-pad;
   m.style.transition='left .3s cubic-bezier(.2,1,.3,1), top .3s cubic-bezier(.2,1,.3,1)';
   setPos(snapX, pos.y);
   setTimeout(()=>{ m.style.transition=''; }, 320);
  }
 };
 m.addEventListener('pointerup',endDrag);
 m.addEventListener('pointercancel',endDrag);
 m.addEventListener('keydown',e=>{
  if(e.key==='Enter'||e.key===' '){
   e.preventDefault();
   activateMascot();
  }
 });
})();
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
/* 场地足迹。陆地轮廓来自 Natural Earth 1:50m admin-0 Japan（公有领域），
   用下面这组墨卡托常数投进 SVG。改了常数就要重投 JP_LAND / JP_OKI_LAND，否则圆点会对不齐。
   圆点锚点在 data/geo.json（县厅所在城市），不是会场坐标。 */
const JP_MAP = {lng0:128.85,lng1:146.2,lat0:30.05,lat1:45.7,ml:28,mt:16,mr:16,mb:128,iw:430};
const JP_OKI = {lng0:127.55,lng1:128.45,lat0:26.02,lat1:26.95,ml:0,mt:0,iw:100};
const JP_OKI_SCALE = 0.68;
const JP_LAND = "M 85.6 407.1 L 88.9 408.0 L 90.4 408.1 L 91.7 407.7 L 93.6 406.5 L 95.7 405.7 L 97.2 406.1 L 98.5 407.1 L 99.2 408.6 L 98.9 410.1 L 96.5 413.4 L 94.6 416.9 L 99.1 417.5 L 103.5 417.5 L 102.5 419.6 L 102.3 421.5 L 103.7 422.4 L 104.8 423.6 L 104.5 424.7 L 103.8 425.8 L 106.3 427.4 L 106.1 428.5 L 105.5 429.6 L 99.4 437.0 L 97.7 440.8 L 96.4 444.9 L 95.3 447.9 L 94.4 451.0 L 93.8 454.3 L 92.7 457.8 L 93.1 460.9 L 92.7 464.0 L 89.6 471.7 L 87.5 471.6 L 84.7 470.7 L 83.0 470.8 L 82.2 472.5 L 83.7 476.0 L 78.9 480.2 L 73.5 483.0 L 73.5 481.7 L 74.0 480.7 L 74.7 479.9 L 75.3 479.0 L 76.1 475.7 L 75.7 472.4 L 74.1 468.2 L 74.0 466.7 L 75.1 466.1 L 75.8 465.9 L 76.2 465.4 L 76.3 464.0 L 75.7 463.0 L 74.2 462.6 L 72.7 462.6 L 71.7 464.2 L 70.3 467.1 L 69.6 470.1 L 69.9 471.8 L 70.5 473.3 L 72.5 475.7 L 71.9 477.2 L 71.1 478.3 L 64.2 475.7 L 62.7 475.6 L 61.5 475.0 L 60.2 471.6 L 63.0 470.8 L 63.8 470.4 L 64.1 469.3 L 64.5 466.0 L 63.2 463.3 L 62.1 462.3 L 61.2 461.1 L 61.7 458.8 L 61.4 455.9 L 61.3 451.7 L 61.8 451.0 L 64.4 450.2 L 66.3 448.0 L 68.0 445.5 L 70.4 441.0 L 72.4 436.2 L 70.5 436.0 L 68.8 435.1 L 70.6 432.9 L 70.1 430.0 L 67.4 426.4 L 66.0 422.3 L 63.6 420.4 L 62.4 419.8 L 60.9 420.7 L 59.6 421.9 L 60.8 424.6 L 60.7 427.0 L 60.8 429.4 L 62.0 429.5 L 63.4 428.9 L 64.6 429.4 L 65.3 430.6 L 65.4 432.2 L 64.9 433.8 L 63.9 434.6 L 62.6 434.5 L 61.3 433.7 L 60.3 432.4 L 57.8 431.8 L 55.3 433.2 L 52.8 436.2 L 50.8 437.7 L 51.7 435.5 L 52.2 433.1 L 51.2 431.5 L 48.8 428.7 L 48.3 427.1 L 48.1 425.2 L 48.5 423.2 L 51.0 425.4 L 52.2 428.2 L 54.0 429.4 L 56.3 429.4 L 54.6 425.4 L 53.9 424.3 L 51.5 422.5 L 48.2 419.5 L 46.1 418.0 L 46.8 414.8 L 48.1 414.2 L 49.1 414.4 L 52.6 415.5 L 53.0 413.9 L 52.5 413.0 L 52.2 412.1 L 54.5 410.7 L 58.3 409.5 L 59.1 409.0 L 59.7 407.9 L 60.7 407.3 L 63.3 407.3 L 65.5 406.2 L 67.4 403.2 L 67.8 401.6 L 68.5 400.2 L 73.1 397.8 L 74.2 397.4 L 77.3 397.7 L 80.1 399.1 L 81.5 402.0 L 82.7 405.0 L 85.6 407.1 Z M 164.5 387.6 L 167.9 388.9 L 171.4 388.5 L 171.4 394.0 L 171.9 395.8 L 172.9 397.4 L 172.4 399.8 L 173.9 400.6 L 169.2 403.4 L 165.0 407.0 L 163.2 409.4 L 161.7 412.0 L 160.7 414.7 L 160.1 417.7 L 158.7 416.5 L 154.6 411.7 L 152.0 410.4 L 147.8 409.7 L 146.5 409.9 L 137.9 414.3 L 136.8 417.6 L 134.5 422.5 L 133.4 424.2 L 132.1 424.6 L 131.2 425.5 L 130.3 429.7 L 127.6 432.2 L 126.0 432.3 L 123.2 431.6 L 122.0 432.0 L 123.6 427.9 L 121.0 427.4 L 118.3 427.5 L 118.3 424.8 L 116.7 423.3 L 117.9 421.3 L 117.9 419.6 L 118.6 418.8 L 118.8 417.4 L 118.7 416.3 L 117.1 416.0 L 116.1 415.2 L 116.3 412.3 L 115.4 412.1 L 113.0 412.7 L 108.2 414.9 L 106.9 414.9 L 108.9 413.3 L 113.2 411.1 L 115.1 409.8 L 119.4 406.2 L 122.0 404.5 L 123.4 401.5 L 123.8 399.7 L 124.7 398.1 L 125.5 395.5 L 126.9 394.7 L 129.2 392.4 L 130.6 392.6 L 132.1 395.4 L 134.2 397.5 L 135.6 397.3 L 138.3 396.2 L 139.5 396.0 L 142.6 396.1 L 145.3 394.8 L 146.4 393.2 L 146.8 391.3 L 145.8 388.0 L 147.1 388.3 L 148.4 388.2 L 151.3 386.1 L 154.4 384.9 L 157.5 384.5 L 161.1 385.7 L 164.5 387.6 Z M 263.3 278.3 L 260.9 278.4 L 260.4 278.1 L 261.8 277.3 L 261.9 276.0 L 262.8 273.7 L 262.7 273.0 L 260.9 272.9 L 261.0 270.2 L 262.4 267.6 L 266.2 263.5 L 267.3 262.7 L 267.4 264.5 L 266.2 268.8 L 266.0 270.3 L 269.0 270.6 L 267.1 275.7 L 263.3 278.3 Z M 334.8 164.0 L 335.8 164.7 L 340.4 163.0 L 339.5 168.0 L 339.0 173.1 L 339.4 181.6 L 339.8 185.4 L 340.6 189.0 L 342.6 191.7 L 345.1 193.5 L 348.9 199.5 L 350.9 206.7 L 352.3 210.2 L 353.4 213.9 L 353.7 215.6 L 353.7 217.3 L 353.4 219.6 L 353.7 221.5 L 353.3 227.3 L 351.7 234.0 L 351.4 237.5 L 350.0 238.2 L 349.1 239.7 L 348.4 240.5 L 347.5 241.0 L 346.3 241.2 L 345.4 241.8 L 345.1 243.6 L 344.5 245.3 L 343.5 246.9 L 342.7 248.6 L 342.0 252.7 L 341.7 257.0 L 340.7 259.9 L 338.2 260.7 L 335.4 260.7 L 331.8 262.0 L 331.0 262.8 L 328.2 268.0 L 327.4 271.0 L 327.3 274.3 L 328.1 278.3 L 329.2 282.2 L 330.0 289.4 L 329.2 300.4 L 328.3 303.9 L 326.5 306.2 L 325.1 307.3 L 324.0 308.7 L 322.4 312.2 L 319.9 319.3 L 319.7 321.1 L 319.7 322.9 L 319.0 325.3 L 318.6 327.7 L 319.0 330.4 L 319.8 333.0 L 323.2 339.5 L 324.5 341.4 L 326.0 343.2 L 320.2 345.1 L 319.1 346.0 L 315.7 349.7 L 314.6 353.2 L 314.7 357.1 L 314.1 358.5 L 313.1 359.7 L 312.1 360.5 L 308.3 362.3 L 305.8 364.1 L 303.3 366.8 L 302.4 368.2 L 300.5 367.8 L 299.4 366.5 L 300.5 364.9 L 300.1 363.0 L 300.7 358.2 L 300.0 356.2 L 302.0 354.7 L 303.0 352.4 L 305.0 350.5 L 306.5 348.8 L 306.7 347.4 L 305.4 346.0 L 304.0 344.9 L 302.1 344.9 L 300.2 345.2 L 299.0 346.6 L 298.6 348.5 L 298.7 349.4 L 298.6 350.2 L 295.7 352.8 L 296.1 355.5 L 296.9 356.9 L 298.0 357.6 L 297.7 358.5 L 296.3 360.7 L 295.3 360.9 L 293.5 357.8 L 291.3 356.2 L 288.6 356.2 L 285.7 356.8 L 283.6 358.8 L 282.9 360.5 L 282.4 362.3 L 282.6 366.5 L 281.7 370.1 L 279.9 373.2 L 279.1 374.3 L 277.0 376.4 L 275.5 376.7 L 274.5 375.7 L 273.6 374.3 L 274.7 369.0 L 274.7 366.0 L 277.2 364.4 L 275.1 362.3 L 272.6 361.5 L 269.1 362.6 L 268.1 363.9 L 267.4 365.6 L 265.5 367.8 L 263.4 369.8 L 261.0 373.3 L 259.5 377.4 L 254.3 376.1 L 251.4 375.8 L 248.5 375.9 L 243.5 375.4 L 237.9 376.2 L 231.5 377.8 L 231.9 376.6 L 237.1 374.2 L 237.3 373.4 L 236.8 372.1 L 235.5 372.0 L 232.4 372.5 L 230.8 372.3 L 230.1 370.8 L 229.1 370.2 L 228.4 370.8 L 228.6 373.6 L 227.8 374.0 L 226.8 373.3 L 227.1 371.1 L 226.4 367.9 L 226.3 365.9 L 227.4 364.1 L 226.3 363.4 L 225.1 363.7 L 223.6 364.5 L 222.3 365.7 L 219.5 371.6 L 218.4 374.9 L 220.5 377.6 L 226.1 381.4 L 227.0 382.3 L 227.0 383.9 L 226.4 385.6 L 224.8 386.3 L 218.7 387.6 L 213.4 390.0 L 211.8 392.4 L 207.0 401.9 L 203.1 408.4 L 197.7 410.6 L 191.6 408.6 L 190.2 406.4 L 189.0 403.6 L 186.8 401.1 L 184.8 398.3 L 183.6 395.1 L 183.8 389.8 L 182.9 386.6 L 183.7 385.8 L 187.0 383.9 L 188.1 382.8 L 190.0 380.3 L 190.6 378.9 L 190.7 376.8 L 189.2 375.6 L 185.3 375.7 L 181.5 376.4 L 178.7 375.4 L 175.1 372.9 L 174.0 372.3 L 170.1 372.1 L 167.3 372.6 L 164.6 373.6 L 161.8 373.9 L 160.8 374.3 L 157.5 377.5 L 154.9 379.5 L 152.6 380.5 L 147.7 380.7 L 145.2 381.4 L 142.6 382.4 L 141.9 382.3 L 139.2 383.7 L 136.1 385.0 L 134.4 386.2 L 131.3 385.4 L 125.3 387.6 L 122.3 387.9 L 119.3 386.7 L 116.5 384.7 L 113.8 385.6 L 112.0 388.5 L 111.1 394.3 L 110.0 397.0 L 109.7 400.1 L 108.3 399.6 L 100.2 393.9 L 99.6 393.7 L 93.1 394.7 L 91.4 395.2 L 89.3 396.3 L 87.1 396.8 L 85.0 396.0 L 83.1 394.7 L 81.2 395.1 L 79.3 396.0 L 78.5 387.4 L 78.9 386.3 L 80.1 384.8 L 81.4 383.5 L 84.6 383.1 L 87.8 383.5 L 90.1 382.9 L 92.0 381.2 L 94.0 378.8 L 96.4 376.8 L 99.5 375.3 L 102.5 373.5 L 105.2 371.0 L 107.7 368.2 L 110.0 366.2 L 112.5 364.5 L 116.3 360.5 L 121.4 355.9 L 123.4 352.5 L 124.6 351.6 L 128.9 349.7 L 134.7 348.2 L 137.5 348.3 L 140.2 351.3 L 141.6 350.9 L 143.1 350.1 L 146.1 349.7 L 149.2 350.2 L 152.2 350.2 L 155.2 349.8 L 160.9 348.8 L 164.0 347.7 L 166.9 346.1 L 177.5 345.1 L 184.7 342.5 L 185.9 342.7 L 187.0 343.3 L 187.1 345.2 L 186.2 347.2 L 187.1 348.5 L 188.5 349.3 L 195.3 349.5 L 197.3 349.9 L 200.1 348.5 L 202.8 346.8 L 205.6 344.5 L 207.6 341.9 L 205.8 338.6 L 205.4 335.1 L 206.9 331.2 L 209.1 327.9 L 211.7 325.9 L 214.1 323.7 L 219.0 317.2 L 222.5 311.9 L 223.8 305.5 L 223.0 297.8 L 226.1 292.0 L 229.1 291.1 L 234.9 288.4 L 238.0 287.7 L 238.4 288.8 L 238.4 290.3 L 233.8 295.1 L 231.1 297.1 L 229.5 297.7 L 228.1 298.6 L 227.5 300.3 L 229.9 303.1 L 230.4 305.2 L 230.3 307.2 L 230.4 309.0 L 233.1 310.9 L 236.1 311.6 L 237.4 311.6 L 238.5 311.1 L 241.9 306.3 L 242.7 305.4 L 252.6 301.9 L 257.5 299.2 L 260.2 298.5 L 262.7 297.1 L 268.4 291.7 L 270.5 289.2 L 272.4 286.5 L 273.9 283.3 L 275.1 279.8 L 276.7 277.6 L 285.7 272.4 L 288.6 269.6 L 289.5 268.2 L 290.6 264.2 L 291.4 260.1 L 292.5 256.8 L 293.9 253.8 L 295.9 250.7 L 298.1 247.8 L 299.4 244.8 L 301.3 237.7 L 302.2 233.7 L 302.8 232.3 L 303.8 231.1 L 304.6 229.6 L 305.2 227.9 L 305.5 226.2 L 305.9 221.0 L 305.7 217.0 L 304.2 213.6 L 303.0 212.6 L 301.6 212.6 L 299.6 212.9 L 297.9 211.5 L 298.3 210.2 L 300.0 210.0 L 301.2 209.4 L 302.1 208.2 L 303.7 204.5 L 304.6 200.5 L 304.7 198.7 L 303.4 195.5 L 302.5 191.6 L 302.4 189.5 L 303.5 187.0 L 305.1 185.1 L 306.5 184.6 L 308.0 184.5 L 309.3 183.7 L 310.6 182.6 L 311.3 181.4 L 312.4 178.0 L 312.9 176.1 L 312.2 171.0 L 312.9 169.6 L 313.9 168.8 L 315.3 169.4 L 316.7 169.5 L 318.3 169.3 L 319.9 169.9 L 320.2 171.2 L 321.2 179.8 L 321.7 181.0 L 322.9 181.9 L 324.2 181.7 L 325.3 180.4 L 326.1 178.6 L 327.5 178.3 L 332.1 180.2 L 333.7 178.8 L 334.7 176.7 L 335.6 172.9 L 335.2 169.5 L 334.1 168.3 L 333.0 168.5 L 332.0 169.5 L 330.9 170.0 L 324.2 171.7 L 324.2 168.0 L 325.6 162.3 L 326.4 160.5 L 327.6 159.6 L 330.4 160.6 L 331.7 161.3 L 334.8 164.0 Z M 399.1 71.4 L 402.2 71.6 L 403.6 71.4 L 406.0 71.9 L 415.4 77.2 L 418.3 77.8 L 421.2 77.9 L 423.3 77.5 L 425.1 76.1 L 430.8 69.7 L 436.8 63.9 L 437.4 64.1 L 437.4 65.7 L 437.0 67.5 L 434.3 72.8 L 431.4 79.9 L 430.8 83.5 L 431.7 87.0 L 433.6 89.9 L 435.0 93.9 L 436.7 99.3 L 439.1 100.0 L 440.4 100.1 L 442.7 98.5 L 445.0 96.4 L 446.9 96.1 L 448.9 96.5 L 446.2 97.9 L 443.7 99.7 L 441.6 103.1 L 440.8 103.7 L 438.3 103.5 L 436.9 103.6 L 434.0 105.0 L 431.4 106.6 L 429.0 108.5 L 426.3 109.6 L 423.5 109.8 L 419.1 111.4 L 416.3 111.5 L 410.9 110.1 L 408.4 110.5 L 402.7 113.6 L 397.6 118.1 L 393.1 123.2 L 389.3 129.2 L 387.8 132.3 L 386.9 135.9 L 386.8 138.2 L 386.5 140.4 L 385.6 142.0 L 384.6 143.2 L 381.5 142.5 L 376.4 139.3 L 366.5 134.6 L 356.1 127.4 L 350.2 123.8 L 339.2 124.9 L 328.8 131.8 L 327.8 131.2 L 323.9 126.5 L 321.9 124.6 L 319.6 124.1 L 317.9 124.1 L 316.2 124.5 L 313.9 126.9 L 313.0 128.7 L 312.4 130.6 L 312.2 132.0 L 312.4 133.4 L 314.7 136.5 L 317.4 138.8 L 318.7 139.3 L 321.3 139.1 L 322.5 139.3 L 327.0 144.0 L 331.8 148.3 L 332.9 149.7 L 331.1 151.2 L 329.1 152.0 L 326.8 151.8 L 324.6 151.2 L 320.7 149.4 L 319.0 150.9 L 316.5 154.1 L 315.0 157.6 L 313.9 159.2 L 311.0 161.3 L 308.0 162.4 L 306.5 162.0 L 305.2 160.7 L 304.6 159.1 L 304.2 157.3 L 304.9 153.3 L 306.4 149.8 L 307.0 146.1 L 305.7 141.0 L 304.9 139.9 L 301.7 136.9 L 300.3 133.9 L 299.9 130.3 L 300.1 128.2 L 300.9 123.7 L 301.6 121.5 L 303.1 120.7 L 304.7 120.3 L 307.2 118.6 L 309.9 116.5 L 312.5 114.1 L 315.1 111.2 L 316.4 107.9 L 314.2 103.9 L 313.7 101.6 L 314.1 99.3 L 316.4 98.1 L 318.8 99.0 L 323.7 102.3 L 324.6 102.6 L 328.0 102.8 L 332.5 103.5 L 335.2 103.3 L 336.5 102.8 L 338.4 100.1 L 339.3 96.6 L 339.0 92.2 L 339.0 87.7 L 340.2 84.1 L 344.0 78.2 L 345.1 74.8 L 345.5 66.3 L 346.9 62.6 L 348.0 58.7 L 348.5 50.6 L 346.9 42.8 L 345.4 38.9 L 343.6 35.2 L 343.8 31.7 L 345.3 28.4 L 345.3 27.4 L 345.7 26.6 L 348.4 26.0 L 349.7 25.2 L 350.9 23.7 L 352.4 22.7 L 353.4 23.7 L 354.3 25.3 L 358.2 29.2 L 364.2 36.3 L 371.4 47.0 L 375.8 52.2 L 380.6 56.9 L 385.8 61.7 L 391.4 65.9 L 394.9 67.8 L 397.5 70.9 L 399.1 71.4 Z";
const JP_OKI_LAND = "M 78.8 37.0 L 68.1 42.7 L 64.1 49.5 L 54.2 51.8 L 44.6 61.4 L 35.2 63.1 L 35.5 70.8 L 39.4 77.3 L 33.2 78.4 L 26.7 86.4 L 26.2 92.1 L 28.5 96.7 L 28.2 99.1 L 19.9 105.9 L 11.5 106.2 L 11.1 98.8 L 11.7 93.3 L 19.7 79.8 L 19.9 64.2 L 27.3 62.4 L 30.0 60.2 L 41.8 49.1 L 43.9 44.3 L 37.9 39.7 L 38.3 34.2 L 39.7 31.9 L 49.4 33.7 L 53.3 37.7 L 55.2 38.2 L 60.9 35.1 L 63.5 29.7 L 74.1 19.1 L 78.3 8.5 L 86.8 17.2 L 84.5 28.6 L 78.8 37.0 Z";
function mercY(lat){
  const r = lat * Math.PI / 180;
  return Math.log(Math.tan(Math.PI / 4 + r / 2)) * 180 / Math.PI;
}
function jpBox(spec){
  const y0 = mercY(spec.lat0), y1 = mercY(spec.lat1);
  const ih = spec.iw * (y1 - y0) / (spec.lng1 - spec.lng0);
  return Object.assign({}, spec, {y0, y1, ih, ml: spec.ml || 0, mt: spec.mt || 0});
}
function jpProj(lat, lng, box){
  return [
    box.ml + (lng - box.lng0) / (box.lng1 - box.lng0) * box.iw,
    box.mt + (box.y1 - mercY(lat)) / (box.y1 - box.y0) * box.ih,
  ];
}
function textW(s){
  let w = 0;
  for (const ch of String(s)) w += ch.charCodeAt(0) > 255 ? 13 : 7.2;
  return w;
}

async function renderVenues(m){
  const [L, geo] = await Promise.all([J('lives'), J('geo')]);
  const geoBy = Object.fromEntries(geo.map(g => [g.pref, g]));
  const byVenue = {}, byPref = {};
  L.forEach(l => {
    (byVenue[l.venue] || (byVenue[l.venue] = [])).push(l);
    (byPref[l.pref] || (byPref[l.pref] = [])).push(l);
  });
  const main = jpBox(JP_MAP);
  const oki = jpBox(JP_OKI);
  const projBottom = main.mt + main.ih;
  const baseRight = main.ml + main.iw + main.mr;
  const vbH = projBottom + main.mb;
  const okiDrawW = oki.iw * JP_OKI_SCALE, okiDrawH = oki.ih * JP_OKI_SCALE;
  const okiW = okiDrawW + 28, okiH = okiDrawH + 34;
  const okiX = 14, okiY = vbH - okiH - 10;
  const okiOx = okiX + 14, okiOy = okiY + 22;
  const groups = geo.filter(g => g.kind === 'pref' && byPref[g.pref]);
  const pins = groups.map(g => {
    const n = byPref[g.pref].length;
    const inset = g.lat < 30;
    const [x, y] = jpProj(g.lat, g.lng, inset ? oki : main);
    const venues = new Set(byPref[g.pref].map(l => l.venue)).size;
    return {pref: g.pref, n, venues, x, y, ax: x, ay: y, r: inset ? 7 : 4.6 + 15 * Math.sqrt(n / Math.max(...groups.map(x => byPref[x.pref].length))), inset};
  });
  const placed = [];
  const gap = 4.5;
  const blocked = (x, y, r) => {
    for (const p of placed) {
      if (p.inset) continue;
      if ((x - p.x) ** 2 + (y - p.y) ** 2 < (r + p.r + gap) ** 2) return true;
    }
    return false;
  };
  const inMap = (x, y, r) => x > r + 6 && y > r + 8 && x < baseRight - r - 6 && y < projBottom - 6;
  pins.sort((a, b) => b.r - a.r);
  for (const p of pins) {
    if (p.inset) { placed.push(p); continue; }
    if (blocked(p.x, p.y, p.r) || !inMap(p.x, p.y, p.r)) {
      let found = false;
      for (let rad = 8; rad <= 80 && !found; rad += 4) {
        for (let k = 0; k < 24 && !found; k++) {
          const ang = -Math.PI / 2 + k / 24 * Math.PI * 2;
          const nx = p.ax + Math.cos(ang) * rad, ny = p.ay + Math.sin(ang) * rad;
          if (!inMap(nx, ny, p.r) || blocked(nx, ny, p.r)) continue;
          p.x = nx; p.y = ny; found = true;
        }
      }
    }
    placed.push(p);
  }
  pins.forEach(p => {
    if (!p.inset) return;
    p.x = okiOx + p.x * JP_OKI_SCALE;
    p.y = okiOy + p.y * JP_OKI_SCALE;
    p.ax = p.x; p.ay = p.y;
  });

  const labels = [];
  const hitLabel = (x, y, w, h) => {
    if (x < 4 || y < 4 || x + w > baseRight - 2 || y + h > projBottom - 2) return true;
    for (const l of labels) {
      if (x < l.x + l.w + 4 && x + w + 4 > l.x && y < l.y + l.h + 3 && y + h + 3 > l.y) return true;
    }
    for (const p of pins) {
      if (p.inset) continue;
      const nx = Math.max(x, Math.min(p.x, x + w));
      const ny = Math.max(y, Math.min(p.y, y + h));
      if ((p.x - nx) ** 2 + (p.y - ny) ** 2 < (p.r + 3) ** 2) return true;
    }
    return false;
  };
  const crowded = p => pins.some(q => q !== p && !q.inset && !p.inset && Math.hypot(p.ax - q.ax, p.ay - q.ay) < 36);
  const east = p => p.ax > main.ml + main.iw * 0.60;
  const calloutPins = [];
  for (const p of [...pins].filter(p => !p.inset).sort((a, b) => b.n - a.n)) {
    const moved = Math.hypot(p.x - p.ax, p.y - p.ay) > p.r + 6;
    if (crowded(p) && east(p)) { calloutPins.push(p); continue; }
    if (p.n < 4 && !moved) continue;
    const text = p.pref, w = textW(text) + 2, h = 15;
    const cands = [
      {x: p.x + p.r + 5, y: p.y - 8},
      {x: p.x - p.r - 6 - w, y: p.y - 8},
      {x: p.x - w / 2, y: p.y - p.r - 18},
      {x: p.x - w / 2, y: p.y + p.r + 4},
    ];
    let ok = false;
    for (const c of cands) {
      if (hitLabel(c.x, c.y, w, h)) continue;
      labels.push({x: c.x, y: c.y, w, h, text, pref: p.pref, callout: false});
      ok = true;
      break;
    }
    if (!ok && east(p) && (moved || p.n >= 8)) calloutPins.push(p);
  }
  const tryPlace = p => {
    const text = p.pref, w = textW(text) + 2, h = 15;
    const deltas = [
      [p.r + 6, -8],
      [-(p.r + 6 + w), -8],
      [-w / 2, -(p.r + 18)],
      [-w / 2, p.r + 4],
      [-(p.r + 6 + w), -26],
      [-(p.r + 6 + w), 10],
      [p.r + 6, -26],
      [p.r + 6, 10],
    ];
    for (let extra = 0; extra <= 56; extra += 8) {
      for (const [dx, dy] of deltas) {
        const x = p.x + dx - (dx < 0 ? extra : 0);
        const y = p.y + dy;
        if (hitLabel(x, y, w, h)) continue;
        const lead = p.x - (x + w) > p.r + 8;
        return {x, y, w, h, text, pref: p.pref, callout: false, lead: lead ? p : null};
      }
    }
    return null;
  };
  for (const p of pins.filter(p => !p.inset && p.n >= 20 && !labels.some(l => l.pref === p.pref) && !calloutPins.includes(p))) {
    const placedLabel = tryPlace(p);
    if (placedLabel) labels.push(placedLabel);
  }
  let vbW = baseRight;
  if (calloutPins.length) {
    vbW = baseRight + 138;
    calloutPins.sort((a, b) => a.y - b.y);
    const gapY = 20, colX = baseRight + 16;
    let y0 = calloutPins.reduce((s, p) => s + p.y, 0) / calloutPins.length - (calloutPins.length - 1) * gapY / 2;
    y0 = Math.max(main.mt + 6, Math.min(y0, projBottom - calloutPins.length * gapY - 8));
    calloutPins.forEach((p, i) => {
      const text = `${p.pref} · ${p.n}`;
      labels.push({x: colX, y: y0 + i * gapY, w: textW(text) + 4, h: 16, text, pref: p.pref, callout: true, pin: p});
    });
  }
  const fmt = n => Number(n).toFixed(1);
  const stems = pins.filter(p => !p.inset && Math.hypot(p.x - p.ax, p.y - p.ay) > p.r + 5).map(p => {
    const dx = p.x - p.ax, dy = p.y - p.ay, len = Math.hypot(dx, dy) || 1;
    const x2 = p.x - dx / len * p.r, y2 = p.y - dy / len * p.r;
    return `<line class=vstem x1="${fmt(p.ax)}" y1="${fmt(p.ay)}" x2="${fmt(x2)}" y2="${fmt(y2)}"/><circle class=vanchor cx="${fmt(p.ax)}" cy="${fmt(p.ay)}" r="2.15"/>`;
  }).join('');
  const leads = labels.filter(l => l.lead).map(l => {
    const p = l.lead;
    const x1 = l.x + l.w + 2, y1 = l.y + 8;
    const dx = p.x - x1, dy = p.y - y1, len = Math.hypot(dx, dy) || 1;
    const x2 = p.x - dx / len * (p.r + 1), y2 = p.y - dy / len * (p.r + 1);
    return `<line class="vstem vlead" x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}"/>`;
  }).join('');
  const calls = labels.filter(l => l.callout).map(l => {
    const p = l.pin, dx = l.x - p.x, dy = (l.y + 8) - p.y, len = Math.hypot(dx, dy) || 1;
    const x1 = p.x + dx / len * (p.r + 1), y1 = p.y + dy / len * (p.r + 1);
    return `<line class="vstem vcall" x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(l.x - 3)}" y2="${fmt(l.y + 8)}"/>`;
  }).join('');
  const pinHTML = [...pins].sort((a, b) => a.r - b.r).map(p => {
    const num = p.r >= 14 ? `<text class=vnum x="${fmt(p.x)}" y="${fmt(p.y)}">${p.n}</text>` : '';
    return `<a class=vpin href="?p=${encodeURIComponent(p.pref)}" data-pref="${esc(p.pref)}" aria-label="${esc(p.pref)} ${p.n} 场"><circle class=hit cx="${fmt(p.x)}" cy="${fmt(p.y)}" r="${Math.max(p.r, 11).toFixed(1)}"/><circle class=ring cx="${fmt(p.x)}" cy="${fmt(p.y)}" r="${(p.r + 4.5).toFixed(1)}"/><circle class=core cx="${fmt(p.x)}" cy="${fmt(p.y)}" r="${fmt(p.r)}"/>${num}</a>`;
  }).join('');
  const labHTML = labels.map(l => `<a class="vlab${l.callout ? ' vcall' : ''}" href="?p=${encodeURIComponent(l.pref)}" data-pref="${esc(l.pref)}"><text x="${fmt(l.x)}" y="${fmt(l.y + 12)}">${esc(l.text)}</text></a>`).join('');
  const okiPin = pins.find(p => p.inset);
  const okiTitle = okiPin ? `冲绳 · ${okiPin.n}` : '冲绳';
  const svgHTML = `<svg class=vsvg style="--ar:${(vbW / vbH).toFixed(4)}" viewBox="0 0 ${fmt(vbW)} ${fmt(vbH)}" role="group" aria-label="日本演出足迹"><rect class=vsea width="${fmt(vbW)}" height="${fmt(vbH)}"/><path class=vland d="${JP_LAND}"/>${stems}${leads}${calls}<a class=oki-link href="?p=${encodeURIComponent('冲绳')}" data-pref="冲绳"><rect class=oki-box x="${fmt(okiX)}" y="${fmt(okiY)}" width="${fmt(okiW)}" height="${fmt(okiH)}" rx="14"/><text class=oki-t x="${fmt(okiX + 12)}" y="${fmt(okiY + 15)}">${okiTitle}</text><path class=vland d="${JP_OKI_LAND}" transform="translate(${fmt(okiOx)} ${fmt(okiOy)}) scale(${JP_OKI_SCALE})"/></a>${pinHTML}${labHTML}<g id=vtip style="display:none"><rect rx="11" height="22" fill="#fff" stroke="#f4d5e3"/><text class=vtip-t x="10" y="15"></text></g></svg>`;

  let selPref = '', selVenue = '', hover = '';
  const tagOf = (name, pref) => {
    const g = geoBy[pref] || {kind: 'unknown'};
    if (g.kind === 'overseas') return '海外';
    if (g.kind === 'pref') return pref;
    return /配信|オンライン|线上/.test(name) ? '线上' : '未确认';
  };
  const bucketTitle = pref => {
    const g = geoBy[pref];
    if (!g || g.kind === 'unknown') return '未上图';
    return pref;
  };
  const venueEntries = pref => {
    const map = {};
    (byPref[pref] || []).forEach(l => { (map[l.venue] || (map[l.venue] = [])).push(l); });
    return Object.entries(map).map(([name, lives]) => ({name, n: lives.length, pref})).sort((a, b) => b.n - a.n || a.name.localeCompare(b.name, 'ja'));
  };
  const off = [];
  geo.filter(g => g.kind !== 'pref').forEach(g => venueEntries(g.pref).forEach(v => off.push(Object.assign({}, v, {tag: tagOf(v.name, g.pref)}))));
  const rank = {线上: 0, 未确认: 1, 海外: 2};
  off.sort((a, b) => rank[a.tag] - rank[b.tag] || b.n - a.n || a.name.localeCompare(b.name, 'ja'));
  const row = (href, name, sub, n, opt = {}) => {
    const bar = opt.bar ? ` style="--w:${Math.round(Math.sqrt(n / opt.max) * 100)}%"` : '';
    const dp = opt.pref ? ` data-pref="${esc(opt.pref)}"` : '';
    return `<a class="vrow${opt.on ? ' on' : ''}${opt.off ? ' offmap' : ''}" href="${href}"${dp}${bar}><i class=vdot></i><span class=vn>${esc(name)}</span>${sub ? `<span class=vs>${esc(sub)}</span>` : ''}<span class=vc>${n}</span></a>`;
  };
  const liveRow = l => {
    const time = l.open_time || l.start_time ? `<span class=meta>${esc(l.open_time || '—')} / ${esc(l.start_time || '—')}</span>` : '';
    return `<a class=vlive href="lives.html?l=${l.id}"><span class=d>${esc(l.date)}</span><span class=vt>${ltag(l.type)} <b>${esc(l.title)}</b></span>${time}</a>`;
  };
  const read = () => {
    const p = new URLSearchParams(location.search);
    selVenue = p.get('v') || '';
    selPref = p.get('p') || '';
    if (selVenue && byVenue[selVenue]) selPref = byVenue[selVenue][0].pref;
    if (selPref && !geoBy[selPref]) selPref = '';
  };
  const headHTML = () => {
    if (selVenue && !byVenue[selVenue]) return `<a class=vback href="venues.html">‹ 全部地区</a><h2>没有这个会场</h2><p class=vph>「${esc(selVenue)}」不在收录里。</p>`;
    if (selVenue) {
      const g = geoBy[selPref] || {kind: 'unknown'};
      const n = byVenue[selVenue].length;
      const place = g.kind === 'pref' ? `${esc(selPref)}${g.name_ja ? ' · ' + esc(g.name_ja) : ''} · ` : `${esc(tagOf(selVenue, selPref))} · `;
      const mapLink = g.kind === 'unknown' ? '' : `<p class=vph><a class=src href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selVenue)}" target=_blank rel=noopener>在 Google 地图查看 ↗</a></p>`;
      return `<a class=vback href="?p=${encodeURIComponent(selPref)}">‹ ${esc(bucketTitle(selPref))}</a><h2>${esc(selVenue)}</h2><p class=vph>${place}${n} 场</p>${mapLink}`;
    }
    if (selPref && byPref[selPref]) {
      const g = geoBy[selPref];
      const n = byPref[selPref].length;
      const venues = new Set(byPref[selPref].map(l => l.venue)).size;
      const extra = g.kind === 'pref' && g.name_ja ? ` · ${esc(g.name_ja)}` : '';
      const note = g.kind === 'pref' ? '' : `<p class=vph>不在日本地图上标点。</p>`;
      return `<a class=vback href="venues.html">‹ 全部地区</a><h2>${esc(bucketTitle(selPref))}</h2><p class=vph>${n} 场 · ${venues} 个会场${extra}</p>${note}`;
    }
    const mapped = pins.reduce((s, p) => s + p.n, 0);
    return `<h2>足迹分布</h2><p class=vph>${pins.length} 个都道府县 · ${mapped} 场在图上</p>`;
  };
  const listHTML = () => {
    const qv = (($('#vq') && $('#vq').value) || '').trim().toLowerCase();
    if (selVenue && !byVenue[selVenue]) return '';
    if (selVenue) return byVenue[selVenue].slice().sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).map(liveRow).join('') || `<p class=vph>这场会场还没有公演记录。</p>`;
    if (selPref && byPref[selPref]) {
      let vs = venueEntries(selPref);
      if (qv) vs = vs.filter(v => v.name.toLowerCase().includes(qv));
      if (!vs.length) return `<p class=vph>没有匹配的会场。</p>`;
      const max = Math.max(...vs.map(v => v.n));
      return vs.map(v => row(`?v=${encodeURIComponent(v.name)}`, v.name, null, v.n, {bar: true, max})).join('');
    }
    if (qv) {
      const regs = pins.filter(p => p.pref.toLowerCase().includes(qv) || (geoBy[p.pref].name_ja || '').toLowerCase().includes(qv)).sort((a, b) => b.n - a.n);
      const vens = Object.entries(byVenue).filter(([name]) => name.toLowerCase().includes(qv)).map(([name, lives]) => ({name, n: lives.length, pref: lives[0].pref})).sort((a, b) => b.n - a.n);
      let html = '';
      if (regs.length) {
        const max = Math.max(...regs.map(p => p.n));
        html += regs.map(p => row(`?p=${encodeURIComponent(p.pref)}`, p.pref, null, p.n, {pref: p.pref, bar: true, max, on: p.pref === selPref})).join('');
      }
      if (vens.length) html += `<div class=vsec>会场</div>` + vens.map(v => row(`?v=${encodeURIComponent(v.name)}`, v.name, tagOf(v.name, v.pref), v.n, {off: geoBy[v.pref] && geoBy[v.pref].kind !== 'pref'})).join('');
      return html || `<p class=vph>没有匹配的地区或会场。</p>`;
    }
    const regs = pins.slice().sort((a, b) => b.n - a.n || a.pref.localeCompare(b.pref, 'zh'));
    const max = Math.max(...regs.map(p => p.n));
    let html = regs.map(p => row(`?p=${encodeURIComponent(p.pref)}`, p.pref, null, p.n, {pref: p.pref, bar: true, max})).join('');
    html += `<div class=vsec>未上图</div>`;
    html += off.map(o => row(`?v=${encodeURIComponent(o.name)}`, o.name, o.tag, o.n, {off: true})).join('');
    return html;
  };
  const paint = () => {
    const selected = geoBy[selPref] && geoBy[selPref].kind === 'pref' ? selPref : '';
    const shown = hover || selected;
    m.querySelectorAll('.vpin,.vlab,.oki-link').forEach(el => {
      const pref = el.dataset.pref;
      el.classList.toggle('is-on', !!selected && pref === selected);
      el.classList.toggle('is-hot', !!hover && pref === hover && hover !== selected);
      el.classList.toggle('is-dim', !!selected && pref !== selected);
    });
    const tip = $('#vtip');
    const pin = pins.find(p => p.pref === shown);
    const labeled = labels.some(l => l.pref === shown);
    if (!tip || !pin || (labeled && !hover)) { if (tip) tip.style.display = 'none'; }
    else {
      const text = `${pin.pref} · ${pin.n} 场`;
      const w = textW(text) + 22;
      let x = pin.x - w / 2, y = pin.y - pin.r - 32;
      if (y < 8) y = pin.y + pin.r + 8;
      if (x < 6) x = 6;
      if (x + w > vbW - 6) x = vbW - 6 - w;
      tip.style.display = '';
      tip.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      tip.querySelector('rect').setAttribute('width', w.toFixed(1));
      tip.querySelector('text').textContent = text;
    }
    const sub = $('#vmapsub');
    if (sub) {
      if ((selVenue || selPref) && geoBy[selPref] && geoBy[selPref].kind !== 'pref') sub.textContent = '不在日本地图上';
      else if (selected) sub.textContent = `${selected} · ${byPref[selected].length} 场`;
      else sub.textContent = `${pins.length} 个都道府县 · ${pins.reduce((s, p) => s + p.n, 0)} 场`;
    }
  };
  const apply = () => {
    read();
    $('#vhead').innerHTML = headHTML();
    const input = $('#vq');
    const showSearch = !selVenue;
    input.hidden = !showSearch;
    input.placeholder = selPref && geoBy[selPref] && geoBy[selPref].kind === 'pref' ? `在${selPref}搜索会场` : '搜索地区或会场';
    $('#vlist').innerHTML = listHTML();
    hijack($('#vhead'));
    hijack($('#vlist'));
    const crumb = [`<a href="index.html">首页</a>`];
    crumb.push(selPref || selVenue ? `<a href="venues.html">场地</a>` : '场地');
    if (selPref && byPref[selPref]) crumb.push(selVenue ? `<a href="?p=${encodeURIComponent(selPref)}">${esc(bucketTitle(selPref))}</a>` : esc(bucketTitle(selPref)));
    if (selVenue) crumb.push(esc(selVenue));
    $('#vcrumb').innerHTML = crumb.join(' / ');
    hijack($('#vcrumb'));
    document.title = selVenue ? `${selVenue} · VENUE | iLiFE! 应援资料库` : (selPref && geoBy[selPref] && geoBy[selPref].kind === 'pref' ? `${selPref} · VENUE | iLiFE! 应援资料库` : 'VENUE · 场地 | iLiFE! 应援资料库');
    paint();
  };
  let svgEl;
  const go = (href, fromMap) => {
    history.pushState(null, '', href);
    hover = '';
    const input = $('#vq');
    if (input) input.value = '';
    apply();
    if (fromMap && innerWidth < 760) {
      const panel = $('#vpanel');
      if (panel) panel.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }
  };
  const hijack = root => {
    if (!root) return;
    root.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (href !== 'venues.html' && !href.startsWith('?')) return;
      if (a.dataset.nav) return;
      a.dataset.nav = '1';
      a.addEventListener('click', e => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        go(href, !!(svgEl && svgEl.contains(a)));
      });
    });
  };

  m.innerHTML = `<div class=crumb id=vcrumb></div><h1 class=ttl>VENUE</h1><p class=sub>共 ${L.length} 场 · ${Object.keys(byVenue).length} 个会场</p><div class=vlayout><section class=vmap-card><div class=vmap-hd><b>足迹分布</b><span id=vmapsub></span></div>${svgHTML}<p class=vnote>圆点按演出场次放大，落在都道府县厅所在城市附近，不是具体会场。线上、未确认和海外不标在图上。冲绳在左下角。</p></section><aside class=vpanel id=vpanel><div id=vhead></div><input id=vq class=vsearch type=search placeholder="搜索地区或会场" aria-label="搜索地区或会场" autocomplete=off><div id=vlist></div></aside></div>`;
  svgEl = m.querySelector('.vsvg');
  hijack(svgEl);
  svgEl.addEventListener('click', e => {
    if (e.target.closest('a')) return;
    if (!e.target.classList || !e.target.classList.contains('vsea')) return;
    if (!location.search) return;
    go('venues.html', false);
  });
  m.querySelectorAll('.vpin,.vlab,.oki-link').forEach(a => {
    const set = on => { hover = on ? a.dataset.pref : (hover === a.dataset.pref ? '' : hover); paint(); };
    a.addEventListener('mouseenter', () => set(true));
    a.addEventListener('mouseleave', () => set(false));
    a.addEventListener('focus', () => set(true));
    a.addEventListener('blur', () => set(false));
  });
  $('#vpanel').addEventListener('mouseover', e => {
    const row = e.target.closest('.vrow[data-pref]');
    const next = row ? row.dataset.pref : '';
    if (next !== hover) { hover = next; paint(); }
  });
  $('#vpanel').addEventListener('mouseleave', () => { if (hover) { hover = ''; paint(); } });
  $('#vq').addEventListener('input', () => { $('#vlist').innerHTML = listHTML(); hijack($('#vlist')); });
  window.addEventListener('popstate', () => { hover = ''; const i = $('#vq'); if (i) i.value = ''; apply(); });
  apply();
}

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
if(P=='venues'){await renderVenues(m);return}
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
 const empty=()=>({v:1,prefs:{mode:'member',songFilter:'all',includeFormer:false},first:{song:'',member:''},history:{song:[],member:[]}});
 const dayOk=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'');
 const dayLabel=(day,l=currentLang)=>{
  if(!dayOk(day))return {date:'',wd:'',full:'',toString:()=>''};
  const d=new Date(day+'T12:00:00+09:00');
  const dow=d.getDay(), dateStr=day.replace(/-/g,'.');
  let wd='',full='';
  if(l==='ja'){
   wd=['日','月','火','水','木','金','土'][dow];
   full=`${dateStr}（${wd}）`;
  }else if(l==='en'){
   wd=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dow];
   full=`${dateStr} (${wd})`;
  }else{
   wd=['周日','周一','周二','周三','周四','周五','周六'][dow];
   full=`${dateStr} · ${wd}`;
  }
  const res={date:dateStr,wd,full};
  res.toString=()=>res.full;
  return res;
 };
 const normalize=raw=>{
  const base=empty();
  if(!raw||typeof raw!='object')return base;
  const prefs=raw.prefs||{};
  base.prefs.mode=(prefs.mode=='song')?'song':'member';
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
 const KICHI_POOL=['大吉','大吉','大吉','大吉','中吉','中吉','中吉','中吉','中吉','小吉','小吉','小吉','小吉','吉','吉','吉','吉','末吉','末吉','末吉'];
 const KICHI_META={
  '大吉':{
   emoji:'💖',soft:'#ffe6f2',deep:'#e4007f',
   label:{zh:'大吉',ja:'大吉',en:'Great Blessing'},
   tagline:{zh:'心跳满开 · 超绝大吉',ja:'胸の高鳴りが止まらない、最高の１日。',en:'Full Heartbeat · Super Lucky Day'},
   subTag:{zh:'胸口的小鹿乱撞停不下来，最棒的一天。',ja:'心拍数全開、きらめく大吉の光。',en:"Can't stop your racing heart on this wonderful day."}
  },
  '中吉':{
   emoji:'✨',soft:'#fff0f6',deep:'#d11b75',
   label:{zh:'中吉',ja:'中吉',en:'Middle Blessing'},
   tagline:{zh:'闪闪发光 · 好事接近',ja:'キラキラした瞬間が、静かに近づいてる。',en:'Sparkling Moments · Joy Is Approaching'},
   subTag:{zh:'闪闪发光的瞬间，正在静静向你靠近。',ja:'ときめきと幸運がそっと隣に。',en:'Quietly drawing near with warmth and magic.'}
  },
  '小吉':{
   emoji:'🌸',soft:'#fff4e6',deep:'#e86a17',
   label:{zh:'小吉',ja:'小吉',en:'Small Blessing'},
   tagline:{zh:'温柔微风 · 小小幸福',ja:'小さな幸せが、ポケットに届く日。',en:'Gentle Breeze · Pocketful of Joy'},
   subTag:{zh:'微小的幸福，悄悄落入衣兜的日子。',ja:'やさしい風とともに届くぬくもり。',en:'Tiny sparks of happiness delivered right to you.'}
  },
  '吉':{
   emoji:'🍀',soft:'#e8f8f5',deep:'#198754',
   label:{zh:'吉',ja:'吉',en:'Blessing'},
   tagline:{zh:'顺风而行 · 稳定好运',ja:'一歩ずつ、推しと一緒に進もう。',en:'Steady Luck · Step by Step With Your Oshi'},
   subTag:{zh:'一步一步，和推一起稳步向前走。',ja:'おだやかな幸運が満ちる良き日。',en:'Moving forward gently, side by side with your oshi.'}
  },
  '末吉':{
   emoji:'🌙',soft:'#f3f0ff',deep:'#6f42c1',
   label:{zh:'末吉',ja:'末吉',en:'Future Blessing'},
   tagline:{zh:'充能之日 · 放松听歌',ja:'推しの歌を聴いて、ゆっくり充電しよう。',en:'Recharge Day · Relax to Your Favorite Tunes'},
   subTag:{zh:'听着推的歌声，给心灵慢慢充满电。',ja:'これからの幸運をあたためるチャージ日。',en:"Listen to your oshi's voice and recharge your energy."}
  }
 };
 const STATUS_MAP={
  '现役':{zh:'现役',ja:'現役',en:'Active'},
  '前成员':{zh:'前成员',ja:'元メンバー',en:'Former'},
  '元メンバー':{zh:'前成员',ja:'元メンバー',en:'Former'},
  '毕业':{zh:'毕业',ja:'卒業',en:'Graduated'}
 };
 const trStatus=(s,l=currentLang)=>(s&&STATUS_MAP[s]?.[l])||s||'';
 const DRAW_I18N={
  zh:{
   pageTitle:'DRAW · 抽签 | iLiFE! 应援资料库',
   crumb:'首页',crumbDraw:'抽签',
   eyebrow:'✿ 非官方粉丝站 · 粉丝制作',
   heroTitleMem:'为你开一份，今日的好运处方 💕',
   heroTitleMemSub:'推的专属心动能量，今日份请签收 ♡',
   heroTitleSong:'为你开一首，今日的心动旋律 🎵',
   heroTitleSongSub:'音乐的治愈节拍，今日份请奏响 ♡',
   heroDesc:'每天一次，抽出一份属于你的 iLiFE! 好运处方。<br>收下小小的幸福，感受今天的推与音乐带来的好运。♡',
   tabMember:'抽推',tabSong:'抽歌',tagDone:'已签',tagPending:'待抽',
   filterAll:'全部',filterGroup:'团体曲',filterSolo:'个人曲',filterFormer:'🌸 已含前成员',filterActive:'✨ 仅现役',
   mascotBubbleDone:'今日已求签 ✨',mascotBubblePending:'今日抽签 💕',
   mascotTip:'今日抽签（拖动调整位置，点击求签）',
   mascotHeroTitle:'爱兔 ♡ iLiFE! 官方吉祥物',mascotHeroBadge:'🐰 爱兔',
   mascotToast:'爱兔: 今天也要和推一起元气满满！💕',
   ctaDrawMem:'🌸 抽取今日之推 ♡',ctaDrawSong:'🎵 抽取今日之歌 ♡',ctaDone:'✨ 今日处方已签收 ♡',
   noteDone:'今日处方已开具 ✨ 明日 0:00 (JST) 刷新',notePending:'今日处方尚未签收（每日限定 1 次）',
   shakingHint:'正在摇出今日签文',shakingSub:'爱兔正在摇晃签筒，请稍候片刻 ♡',
   resTitleSong:"TODAY'S SONG · 今日之歌处方 🎵",resTitleMem:"TODAY'S PRESCRIPTION · 今日之推处方 💕",
   songOfToday:'今日之歌 🎵',memOfToday:'今日之推 💕',noPhoto:'无官方图片',
   phraseTitleSong:'来自旋律的今日处方笺 🎵',phraseTitleMem:'来自爱兔的心动留言 💕',phraseTag:'✎ 今日一言处方',
   keyColor:'幸运颜色',keyItem:'幸运物品',keyAction:'今日行动',
   shareCtaHead:'💌 今天的护身符，要分享给同担吗？',shareCtaSub:'把今天的专属处方签存下来，分享给同担或者留作手机壁纸 ♡',btnSave:'保存处方签 📸',
   btnSwitchViewMem:'查看今日之推 💕 ↗',btnSwitchViewSong:'查看今日之歌 🎵 ↗',
   btnSwitchDrawMem:'去抽今日之推 🐰 ↗',btnSwitchDrawSong:'去抽今日之歌 🎵 ↗',
   btnProfile:'查看档案 ↗',btnBackToday:'返回今日处方 ✦',srDrawResult:'抽到 {title}',
   feat1Title:'每日一签，好运相伴',feat1Sub:'DAILY FORTUNE',feat1Desc:'每天一次正式求签，大吉/中吉/小吉/吉/末吉皆有好运祝福，不设任何负面惩罚。',
   feat2Title:'命中注定的推与音乐',feat2Sub:'OSHI & SONG',feat2Desc:'现役与全部成员 / 团体与个人曲，双通道每日抽取专属于你的心动时刻。',
   feat3Title:'保存与分享护身符',feat3Sub:'SHARE & CARD',feat3Desc:'把抽到的处方签存成 9:16 高清卡片，分享给同担或者留作手机壁纸 ♡',
   histMicro:'COLLECTION · 处方履历',histTitle:'最近记录',histSub:'PAST DRAWS',histTodayTag:'· 今日',
   archTitle:'📦 存档备份 · 跨设备迁移',archDesc:'记录只留在这台浏览器的本地存储中。换设备或清理缓存时可能会丢失。<br>建议定期点一下「导出存档」，把数据备份保存到自己的备忘录中。',
   btnExport:'⭳ 导出存档',btnImport:'⭱ 导入存档',btnClear:'↺ 清空记录',confirmClear:'清空这台浏览器里的抽签记录？',
   toastCleared:'已清空记录',toastImported:'已导入存档',toastImportFailed:'这份文件不是抽签存档',toastExported:'已导出存档',
   toastDrawnLimitMem:'今天已经抽过推啦，明日 0:00 (JST) 刷新 💕',toastDrawnLimitSong:'今天已经抽过歌啦，明日 0:00 (JST) 刷新 🎵',
   toastEmptyPool:'这个范围里没有可抽的',toastNoCrypto:'这个浏览器不能公平抽取',
   toastSavedCard:'已保存卡片',toastFailedCard:'没能生成卡片',toastOpenedShare:'已打开分享',
   canvasEyebrow:'iLiFE! 官方应援处方签',canvasSubSong:'今日之歌 · 心动旋律',canvasSubMem:'今日之推 · 命运相遇',
   canvasFortuneHead:'今日运势',canvasFortuneRow:'运势',canvasMottoTag:'签语 · ',canvasFooter:'非官方粉丝站'
  },
  ja:{
   pageTitle:'DRAW · おみくじ | iLiFE! 非公式ファンサイト',
   crumb:'ホーム',crumbDraw:'おみくじ',
   eyebrow:'✿ 非公式ファンサイト ・ ファンメイド',
   heroTitleMem:'今日の推しを、処方します。',
   heroTitleMemSub:'あなたへ届ける、本日の幸運処方箋 💕',
   heroTitleSong:'今日の曲を、処方します。',
   heroTitleSongSub:'あなたへ届ける、本日のときめきメロディ 🎵',
   heroDesc:'1日1回、あなただけの iLiFE! お守り処方箋をお届け。<br>ちいさな幸せを受け取って、推しと音楽のパワーで素敵な1日を。♡',
   tabMember:'推し引き',tabSong:'曲引き',tagDone:'処方済',tagPending:'未処方',
   filterAll:'全曲',filterGroup:'グループ曲',filterSolo:'ソロ曲',filterFormer:'🌸 元メンバー含む',filterActive:'✨ 現役のみ',
   mascotBubbleDone:'今日はおみくじ済 ✨',mascotBubblePending:'今日のおみくじ 💕',
   mascotTip:'今日のおみくじ（ドラッグで移動、タップで引く）',
   mascotHeroTitle:'アイラビット ♡ iLiFE! 公式マスコット',mascotHeroBadge:'🐰 アイラビット',
   mascotToast:'アイラビット: 今日も推しと一緒にハッピー！💕',
   ctaDrawMem:'🌸 今日の推しを引く ♡',ctaDrawSong:'🎵 今日の曲を引く ♡',ctaDone:'✨ 本日の処方は受け取り済み ♡',
   noteDone:'本日の処方は受け取り済みです ✨ 明日 0:00 (JST) に更新',notePending:'今日の処方は、まだ受け取っていません（1日1回限定）',
   shakingHint:'おみくじを振っています',shakingSub:'アイラビットが筒を振っています、少々お待ちください ♡',
   resTitleSong:"TODAY'S SONG ・ 今日の歌処方 🎵",resTitleMem:"TODAY'S PRESCRIPTION ・ 今日の推し処方 💕",
   songOfToday:'今日の曲 🎵',memOfToday:'今日の推し 💕',noPhoto:'公式画像なし',
   phraseTitleSong:'心に響くメロディの処方箋 🎵',phraseTitleMem:'アイラビットからのメッセージ 💕',phraseTag:'✎ 今日のひとこと処方',
   keyColor:'ラッキーカラー',keyItem:'ラッキーアイテム',keyAction:'ラッキーアクション',
   shareCtaHead:'💌 今日のお守り、シェアしない？',shareCtaSub:'今日の処方箋を画像で保存して、お守りやスマホ壁紙にしよう ♡',btnSave:'処方箋を保存 📸',
   btnSwitchViewMem:'今日の推し処方を見る 💕 ↗',btnSwitchViewSong:'今日の歌処方を見る 🎵 ↗',
   btnSwitchDrawMem:'今日の推しを引く 🐰 ↗',btnSwitchDrawSong:'今日の曲を引く 🎵 ↗',
   btnProfile:'詳細プロフィール ↗',btnBackToday:'今日の処方に戻る ✦',srDrawResult:'{title} を引きました',
   feat1Title:'毎日いちど、おみくじ',feat1Sub:'DAILY FORTUNE',feat1Desc:'1日1回のおみくじ処方。大吉・中吉・小吉・吉・末吉、すべてポジティブな幸福をお届け。',
   feat2Title:'運命の推しと音楽',feat2Sub:'OSHI & SONG',feat2Desc:'現役・全メンバー／グループ・ソロ曲、2つのチャンネルであなただけの一期一会。',
   feat3Title:'お守りをシェア',feat3Sub:'SHARE & CARD',feat3Desc:'9:16の可愛い処方箋カードを保存して、ファン仲間とシェアしたり待ち受けに ♡',
   histMicro:'COLLECTION ・ 処方履歴',histTitle:'最近の処方履歴',histSub:'PAST DRAWS',histTodayTag:'・ 今日',
   archTitle:'📦 バックアップ ・ 履歴保存',archDesc:'処方履歴はこの端末のブラウザ（LocalStorage）にのみ保存されます。<br>機種変更やキャッシュ削除に備えて、定期的なバックアップ（書き出し）をおすすめします。',
   btnExport:'⭳ バックアップ出力',btnImport:'⭱ バックアップ復元',btnClear:'↺ 履歴をリセット',confirmClear:'このブラウザの処方履歴をすべてリセットしますか？',
   toastCleared:'履歴をリセットしました',toastImported:'バックアップを復元しました',toastImportFailed:'正しいバックアップファイルではありません',toastExported:'バックアップを出力しました',
   toastDrawnLimitMem:'本日の推し引きは完了済みです。明日0:00(JST)更新 💕',toastDrawnLimitSong:'本日の曲引きは完了済みです。明日0:00(JST)更新 🎵',
   toastEmptyPool:'対象の候補がありません',toastNoCrypto:'このブラウザでは公平な抽選ができません',
   toastSavedCard:'処方箋カードを保存しました',toastFailedCard:'カードの生成に失敗しました',toastOpenedShare:'共有メニューを開きました',
   canvasEyebrow:'iLiFE! 公式お守り処方箋',canvasSubSong:'本日の処方曲 ・ ときめきメロディ',canvasSubMem:'本日の処方推し ・ 運命の出会い',
   canvasFortuneHead:'本日の運勢',canvasFortuneRow:'運勢',canvasMottoTag:'お告げ ・ ',canvasFooter:'非公式ファンサイト'
  },
  en:{
   pageTitle:'DRAW · Fortune | iLiFE! Fan Database',
   crumb:'Home',crumbDraw:'Fortune',
   eyebrow:'✿ Unofficial Fan Site ・ Fan-Made',
   heroTitleMem:'Prescribing Your Oshi of the Day 💕',
   heroTitleMemSub:'Your daily dose of love, luck & happiness ♡',
   heroTitleSong:'Prescribing Your Song of the Day 🎵',
   heroTitleSongSub:'Your daily rhythm to light up your heart ♡',
   heroDesc:'Once a day, receive your personal iLiFE! lucky prescription.<br>Embrace a little joy and let your oshi & music brighten your day. ♡',
   tabMember:'Draw Oshi',tabSong:'Draw Song',tagDone:'Done',tagPending:'Ready',
   filterAll:'All',filterGroup:'Group Songs',filterSolo:'Solo Songs',filterFormer:'🌸 Incl. Former',filterActive:'✨ Active Only',
   mascotBubbleDone:'Fortune drawn ✨',mascotBubblePending:'Daily Fortune 💕',
   mascotTip:'Daily Fortune (Drag to move, tap to draw)',
   mascotHeroTitle:'Airabbit ♡ iLiFE! Official Mascot',mascotHeroBadge:'🐰 Airabbit',
   mascotToast:'Airabbit: May you and your oshi have a wonderful day! 💕',
   ctaDrawMem:"🌸 Draw Today's Oshi ♡",ctaDrawSong:"🎵 Draw Today's Song ♡",ctaDone:"✨ Today's Prescription Received ♡",
   noteDone:'Prescription already received ✨ Resets at 0:00 (JST)',notePending:'Not drawn yet today (Limit: 1 draw per day)',
   shakingHint:'Shaking the fortune cylinder',shakingSub:'Airabbit is shaking the cylinder, please hold on ♡',
   resTitleSong:"TODAY'S SONG ・ Lucky Song Prescription 🎵",resTitleMem:"TODAY'S PRESCRIPTION ・ Lucky Oshi Prescription 💕",
   songOfToday:"Today's Song 🎵",memOfToday:"Today's Oshi 💕",noPhoto:'No Official Photo',
   phraseTitleSong:'A musical prescription from the melody 🎵',phraseTitleMem:'A sweet message from Airabbit 💕',phraseTag:"✎ Today's Note",
   keyColor:'Lucky Color',keyItem:'Lucky Item',keyAction:'Lucky Action',
   shareCtaHead:"💌 Share Today's Lucky Amulet?",shareCtaSub:"Save today's prescription card to share with friends or set as wallpaper ♡",btnSave:'Save Prescription 📸',
   btnSwitchViewMem:"View Today's Oshi 💕 ↗",btnSwitchViewSong:"View Today's Song 🎵 ↗",
   btnSwitchDrawMem:"Draw Today's Oshi 🐰 ↗",btnSwitchDrawSong:"Draw Today's Song 🎵 ↗",
   btnProfile:'View Profile ↗',btnBackToday:'Back to Today ✦',srDrawResult:'Drawn: {title}',
   feat1Title:'Daily Fortune',feat1Sub:'DAILY FORTUNE',feat1Desc:'Once daily fortune. Great, Middle, Small Blessings—pure positive vibes with no negative results.',
   feat2Title:'Destined Oshi & Song',feat2Sub:'OSHI & SONG',feat2Desc:'Active members & all eras, group & solo songs—two channels for your daily destined encounter.',
   feat3Title:'Share Your Amulet',feat3Sub:'SHARE & CARD',feat3Desc:'Export a cute 9:16 high-res card to share with fans or use as your mobile wallpaper ♡',
   histMicro:'COLLECTION ・ PRESCRIPTION HISTORY',histTitle:'Recent Draws',histSub:'PAST DRAWS',histTodayTag:'· Today',
   archTitle:'📦 Backup & Data Transfer',archDesc:'Draw history is saved locally in your browser. Clearing cache or switching devices may erase it.<br>We recommend exporting a backup file to keep your precious memories safe.',
   btnExport:'⭳ Export Data',btnImport:'⭱ Import Data',btnClear:'↺ Reset History',confirmClear:'Clear all draw history in this browser?',
   toastCleared:'History has been reset',toastImported:'Backup restored successfully',toastImportFailed:'Invalid backup file format',toastExported:'Backup exported',
   toastDrawnLimitMem:"You have already drawn your oshi today. Resets at 0:00 (JST) 💕",toastDrawnLimitSong:"You have already drawn your song today. Resets at 0:00 (JST) 🎵",
   toastEmptyPool:'No items in this selection',toastNoCrypto:'This browser does not support secure random generation',
   toastSavedCard:'Prescription card saved',toastFailedCard:'Could not generate card',toastOpenedShare:'Share dialog opened',
   canvasEyebrow:'iLiFE! Official Lucky Prescription',canvasSubSong:"Today's Song ・ Destined Melody",canvasSubMem:"Today's Oshi ・ Destined Encounter",
   canvasFortuneHead:"Today's Fortune",canvasFortuneRow:'Fortune',canvasMottoTag:'Motto ・ ',canvasFooter:'Unofficial Fan Site'
  }
 };
 const I18N_ITEMS={
  '应援手灯':{ja:'ペンライト',en:'Penlight'},'歌名便签':{ja:'曲名メモ',en:'Song Title Note'},
  '一张拍立得':{ja:'チェキ1枚',en:'One Cheki Photo'},'今日发圈':{ja:'今日のシュシュ',en:'Hair Scrunchie'},
  '口袋票根':{ja:'ポケットの半券',en:'Ticket Stub'},'草莓软糖':{ja:'いちごグミ',en:'Strawberry Gummy'},
  '成员色发带':{ja:'推し色リボン',en:'Oshi-color Ribbon'},'充满电的耳机':{ja:'充電満タンのイヤホン',en:'Charged Earphones'},
  '袖口小徽章':{ja:'袖の缶バッジ',en:'Sleeve Pin Badge'},'应援毛巾':{ja:'推しタオル',en:'Cheering Towel'},
  '歌词书签':{ja:'歌詞しおり',en:'Lyrics Bookmark'},'闪亮指甲贴':{ja:'キラキラネイルシール',en:'Glitter Nail Sticker'}
 };
 const I18N_ACTS={
  '把副歌再听一遍':{ja:'サビをもう一度聴く',en:'Listen to the chorus once more'},
  '把签发给同担':{ja:'このおみくじを推し仲間に送る',en:'Share this fortune with fellow fans'},
  '跟着节拍点头':{ja:'ビートに合わせて首をゆらす',en:'Nod along to the rhythm'},
  '写下喜欢的一句':{ja:'好きな歌詞のワンフレーズをメモする',en:'Jot down your favorite line'},
  '给今天的推比心':{ja:'今日の推しに指ハートを作る',en:'Send a finger heart to today’s oshi'},
  '单曲循环到会唱':{ja:'歌えるようになるまで鬼リピする',en:'Put on repeat until you can sing it'},
  '把应援色穿上':{ja:'推しの担当カラーを身につける',en:'Wear your oshi’s member color'},
  '放进今日歌单':{ja:'今日のプレイリストに入れる',en:'Add to today’s playlist'},
  '看一眼公式照':{ja:'公式アーティスト写真を眺める',en:'Admire the official artist photo'},
  '把签名着声唱出来':{ja:'好きなメロディを口ずさむ',en:'Hum the melody out loud'},
  '把灯牌举高一点':{ja:'ペンライトを心の中で高く掲げる',en:'Hold your lightstick up high'},
  '和同担分享这张签':{ja:'推し仲間にこの処方箋を見せる',en:'Show this prescription to a friend'}
 };
 const I18N_MOTTOS={
  '今天也把副歌唱亮':{ja:'今日もサビを全力で歌おう',en:'Sing the chorus loud and proud today'},
  '小幸运落在节拍上':{ja:'ちいさな幸せはビートにのってやってくる',en:'Tiny sparks of happiness dance on the beat'},
  '把喜欢大声说出来':{ja:'「好き」の気持ちは言葉にしていい',en:'Never hesitate to say what you love'},
  '今天的推就在眼前':{ja:'今日の推しが一番近くにいる',en:'Your oshi is right here by your side'},
  '一首歌的时间刚刚好':{ja:'1曲分の時間で、心はちゃんと軽くなる',en:'One song is all it takes to reset your mood'},
  '应援色会照亮今天':{ja:'推しカラーが今日をあざやかに照らす',en:'Your oshi’s color lights up your day'},
  '走到灯下就是主角':{ja:'スポットライトの下、誰もが主役になれる',en:'Step under the lights and be the star'},
  '把心跳交给这首歌':{ja:'この鼓動をメロディに預けて',en:'Surrender your heartbeat to the melody'},
  '今天也要闪闪发光':{ja:'今日もキラキラ輝いていこう',en:'Keep shining bright all day long'},
  '同担的消息会带来好运':{ja:'ファン仲間との会話が幸運を運んでくる',en:'Kind words from fellow fans bring good luck'},
  '再听一遍运气就到':{ja:'もう1回リピートすれば運気がグングン上がる',en:'One more replay brings the good fortune'},
  '先对自己笑一个':{ja:'まずは自分自身ににっこり笑顔を',en:'Start by giving yourself a warm smile'}
 };
 const I18N_COLORS={
  '樱花粉':{ja:'桜ピンク',en:'Sakura Pink'},'草莓粉':{ja:'ストロベリーピンク',en:'Strawberry Pink'},'蜜桃':{ja:'ピーチ',en:'Peach'},
  '奶油黄':{ja:'クリームイエロー',en:'Cream Yellow'},'香芋紫':{ja:'タロパープル',en:'Taro Purple'},'薄荷绿':{ja:'ミントグリーン',en:'Mint Green'},
  '珊瑚':{ja:'コーラル',en:'Coral'},'杏子':{ja:'アプリコット',en:'Apricot'},'葡萄':{ja:'グレープ',en:'Grape'},
  '玫瑰':{ja:'ローズ',en:'Rose'},'奶白':{ja:'ミルキーホワイト',en:'Milky White'},'丁香':{ja:'ライラック',en:'Lilac'},
  '黄绿':{ja:'黄緑',en:'Yellow-Green'},'桃':{ja:'桃',en:'Pink'},'水色':{ja:'水色',en:'Light Blue'},
  '粉':{ja:'ピンク',en:'Pink'},'橙':{ja:'オレンジ',en:'Orange'},'紫':{ja:'紫',en:'Purple'},
  '绿':{ja:'緑',en:'Green'},'黄':{ja:'黄',en:'Yellow'},'青':{ja:'青',en:'Blue'},'赤':{ja:'赤',en:'Red'},'白':{ja:'白',en:'White'}
 };
 const getKMeta=k=>KICHI_META[k]||KICHI_META['吉'];
 const trItem=(item,l=currentLang)=>(l!=='zh'&&I18N_ITEMS[item]?.[l])||item||'';
 const trAct=(act,l=currentLang)=>(l!=='zh'&&I18N_ACTS[act]?.[l])||act||'';
 const trMotto=(motto,l=currentLang)=>(l!=='zh'&&I18N_MOTTOS[motto]?.[l])||motto||'';
 const trColor=(c,l=currentLang)=>{
  if(!c)return '';
  const s=String(c).trim();
  if(l==='zh'){
   if(s==='粉（ピンク）')return '粉';
   if(s==='橙（オレンジ）')return '橙';
   if(s==='桃（粉）')return '桃';
   if(s==='緑')return '绿';
   if(s==='黄→緑')return '黄→绿';
   if(s==='黒→緑')return '黑→绿';
   return s;
  }
  if(l==='ja'){
   if(s==='粉（ピンク）'||s==='粉')return 'ピンク';
   if(s==='橙（オレンジ）'||s==='橙')return 'オレンジ';
   if(s==='桃（粉）'||s==='桃')return '桃';
   if(s==='绿')return '緑';
   if(s==='黄→绿')return '黄→緑';
   if(s==='黑→绿')return '黒→緑';
   return (I18N_COLORS[s]?.ja)||s;
  }
  if(l==='en'){
   if(s==='粉（ピンク）'||s==='粉'||s==='桃（粉）'||s==='桃')return 'Pink';
   if(s==='橙（オレンジ）'||s==='橙')return 'Orange';
   if(s==='水色')return 'Light Blue';
   if(s==='赤')return 'Red';
   if(s==='紫')return 'Purple';
   if(s==='白')return 'White';
   if(s==='緑'||s==='绿')return 'Green';
   if(s==='黄')return 'Yellow';
   if(s==='青')return 'Blue';
   if(s==='黄→緑'||s==='黄→绿')return 'Yellow → Green';
   if(s==='黒→緑'||s==='黑→绿')return 'Black → Green';
   return (I18N_COLORS[s]?.en)||s;
  }
  return s;
 };

 const bottleSvg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 280" class="bottle-svg"><defs><linearGradient id="omikujiGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffffff" stop-opacity=".96"/><stop offset="50%" stop-color="#fff0f6" stop-opacity=".94"/><stop offset="100%" stop-color="#ffd6e8" stop-opacity=".96"/></linearGradient><linearGradient id="omikujiCap" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff99c4"/><stop offset="100%" stop-color="#e4007f"/></linearGradient></defs><ellipse cx="110" cy="266" rx="62" ry="11" fill="#e4007f" opacity=".12"/><path d="M52 96 q0 -18 18 -22 h80 q18 4 18 22 v132 q0 30 -30 30 h-56 q-30 0 -30 -30Z" fill="url(#omikujiGlass)" stroke="#ffb3d6" stroke-width="3"/><g transform="translate(102, 34) rotate(-8)"><rect x="0" y="0" width="16" height="54" rx="3" fill="#fff" stroke="#ff8ab7" stroke-width="2"/><text x="8" y="24" text-anchor="middle" font-size="11" font-weight="900" fill="#e4007f" font-family="'Zen Maru Gothic',sans-serif">吉</text><line x1="3" y1="32" x2="13" y2="32" stroke="#ffb3d6" stroke-width="1.5"/></g><g opacity=".85"><circle cx="80" cy="180" r="10" fill="#ffb7d5"/><circle cx="114" cy="196" r="12" fill="#ffd0e6"/><circle cx="142" cy="178" r="9" fill="#ffe08a"/><circle cx="96" cy="220" r="11" fill="#b7e4c7"/><circle cx="132" cy="222" r="9" fill="#d4b4e8"/></g><path d="M88 146 l3 5 l5 3 l-5 3 l-3 5 l-3 -5 l-5 -3 l5 -3 Z" fill="#fff" opacity=".9"/><path d="M136 138 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 Z" fill="#fff" opacity=".85"/><rect x="66" y="120" width="88" height="70" rx="12" fill="#ffffff" stroke="#ffd1e6" stroke-width="2"/><text x="110" y="150" text-anchor="middle" font-size="20" fill="#e4007f" font-weight="900" font-family="'Zen Maru Gothic',sans-serif">御神籤</text><text x="110" y="172" text-anchor="middle" font-size="9.5" fill="#ff8ab7" font-weight="700" letter-spacing="2">iLiFE! DRAW</text><rect x="76" y="56" width="68" height="40" rx="12" fill="url(#omikujiCap)"/><rect x="70" y="88" width="80" height="12" rx="6" fill="#e4007f"/><rect x="86" y="64" width="10" height="22" rx="5" fill="#ffffff" opacity=".6"/></svg>`;
 const sealSvg=(kichi,first,col,l=currentLang)=>{
  const meta=getKMeta(kichi);
  const sealCol=col||meta.deep;
  const subText=first?(l==='en'?'✦ TODAY ONLY ✦':'✦ 今日限定 ✦'):(l==='en'?'PRESCRIPTION':'処方箋');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" class="seal-svg"><circle cx="80" cy="80" r="72" fill="${meta.soft}" stroke="${sealCol}" stroke-width="3" stroke-dasharray="6 6"/><circle cx="80" cy="80" r="58" fill="#ffffff" opacity=".92"/><circle cx="80" cy="80" r="52" fill="none" stroke="${sealCol}" stroke-width="1.2" opacity=".4"/><text x="80" y="58" text-anchor="middle" font-size="28">${meta.emoji}</text><text x="80" y="94" text-anchor="middle" font-size="25" font-family="'Zen Maru Gothic',sans-serif" font-weight="900" fill="${sealCol}">${esc(kichi)}</text><text x="80" y="116" text-anchor="middle" font-size="9.5" font-family="'Zen Maru Gothic',sans-serif" font-weight="700" fill="${sealCol}" letter-spacing="1.5">${subText}</text></svg>`;
 };
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
  else if(/绿|綠/.test(raw))name='绿';
  else if(/黄/.test(raw))name='黄';
  else if(/青/.test(raw))name='青';
  else if(/赤|红/.test(raw))name='赤';
  else if(/白/.test(raw))name='白';
  return name?{hex:mem.hex,name}:null;
 };
 const rollFortune=(mode,item)=>{
  const color=mode=='member'&&memberLucky(item)||PASTELS[randIndex(PASTELS.length)];
  const kichi=KICHI_POOL[randIndex(KICHI_POOL.length)];
  return {kichi,color:color.hex,colorName:color.name,item:LUCK_ITEMS[randIndex(LUCK_ITEMS.length)],action:LUCK_ACTS[randIndex(LUCK_ACTS.length)],motto:LUCK_MOTTOS[randIndex(LUCK_MOTTOS.length)]};
 };
 const packFortune=f=>{
  if(!f||typeof f!='object')return null;
  const color=/^#[0-9a-fA-F]{6}$/.test(f.color||'')?f.color:'';
  const cut=(s,n)=>typeof s==='string'?s.trim().slice(0,n):'';
  const colorName=cut(f.colorName,16),item=cut(f.item,40),action=cut(f.action,40),motto=cut(f.motto,48);
  const kichi=['大吉','中吉','小吉','吉','末吉'].includes(f.kichi)?f.kichi:(f.kichi?cut(f.kichi,8):'吉');
  return color&&colorName&&item&&action&&motto?{kichi,color,colorName,item,action,motto}:null;
 };
 st=load();
 const todayDraw=m=>{
  const today=jstDay();
  return (st.history[m]||[]).find(h=>h.day===today)||null;
 };
 const hasDrawnToday=m=>!!todayDraw(m);
 const initTodayView=m=>{
  const td=todayDraw(m);if(!td)return null;
  const item=m=='song'?songById(td.id):memberById(td.id);
  return item?{mode:m,item,first:true,day:td.day,at:td.at,hist:false,fortune:td.fortune}:null;
 };
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
  const l=currentLang;
  const who=view.mode=='song'
   ?`${view.day} ${l==='en'?'Song Draw':l==='ja'?'曲引き':'抽歌'}\n${view.item.title}${view.item.kana?'（'+view.item.kana+'）':''}`
   :`${view.day} ${l==='en'?'Oshi Draw':l==='ja'?'推し引き':'抽推'}\n${view.item.name}${view.item.kana?'（'+view.item.kana+'）':''}`;
  const kMeta=getKMeta(view.fortune&&view.fortune.kichi);
  const kLabel=kMeta.label[l]||view.fortune?.kichi||'';
  const kichi=kLabel?`【${kLabel}】`:'';
  const motto=view.fortune?`\n${kichi}${trMotto(view.fortune.motto,l)}`:'';
  const siteName=l==='en'?'iLiFE! Fan Database':l==='ja'?'iLiFE! 非公式ファンサイト':'iLiFE! 应援资料库';
  return `${siteName}\n${who}${motto}`;
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
  const l=currentLang, t=DRAW_I18N[l]||DRAW_I18N.zh;
  const W=900,H=1600,F='"Noto Sans SC",Roboto,"PingFang SC",sans-serif';
  const song=view.mode=='song',item=view.item;
  const hex=song?'#e4007f':safeHex(item.hex);
  const src=song?songSrc(item):memberSrc(item);
  const img=await loadImg(src);
  const c=document.createElement('canvas');c.width=W;c.height=H;
  const x=c.getContext('2d');
  const bg=x.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#fff8fb');bg.addColorStop(0.5,'#ffffff');bg.addColorStop(1,'#fff0f7');
  x.fillStyle=bg;x.fillRect(0,0,W,H);
  x.save();x.shadowColor='rgba(228,0,127,.14)';x.shadowBlur=28;x.shadowOffsetY=12;x.fillStyle='#fff';roundRect(x,40,48,W-80,H-96,36);x.fill();x.restore();
  x.save();roundRect(x,40,48,W-80,H-96,36);x.clip();
  x.strokeStyle='rgba(228,0,127,.09)';x.lineWidth=1;
  for(let ly=96;ly<H-70;ly+=32){x.beginPath();x.moveTo(64,ly);x.lineTo(W-64,ly);x.stroke()}
  x.restore();
  x.textAlign='center';x.textBaseline='middle';
  x.fillStyle='#8a8a8a';x.font='700 18px '+F;x.letterSpacing='6px';x.fillText(t.canvasEyebrow,W/2,102);x.letterSpacing='0px';
  x.fillStyle='#2b2b2b';x.font='500 22px '+F;x.fillText(dayLabel(view.day,l).full,W/2,142);
  x.fillStyle='#e4007f';x.font='700 16px '+F;x.letterSpacing='3px';x.fillText(song?"TODAY'S SONG":"TODAY'S OSHI",W/2,176);x.letterSpacing='0px';
  x.fillStyle='#8a8a8a';x.font='500 20px '+F;x.fillText(song?t.canvasSubSong:t.canvasSubMem,W/2,206);
  const photoW=song?480:400,photoH=song?460:480,pad=22,capH=88;
  const frameW=photoW+pad*2,frameH=pad+photoH+capH,frameX=(W-frameW)/2,frameY=236;
  x.save();x.translate(W/2,frameY);x.rotate(-1.5*Math.PI/180);x.fillStyle='rgba(255,183,213,.75)';roundRect(x,-65,-12,130,24,3);x.fill();x.restore();
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
  const kichi=(view.fortune&&view.fortune.kichi)||'吉';
  const kMeta=getKMeta(kichi);
  const sealCol=song?'#e4007f':accentOf(hex);
  x.save();x.translate(frameX+frameW-6,frameY+22);x.rotate(-8*Math.PI/180);
  x.beginPath();x.arc(0,0,46,0,Math.PI*2);x.fillStyle='rgba(255,255,255,.96)';x.fill();x.lineWidth=4;x.strokeStyle=sealCol;x.stroke();
  x.beginPath();x.arc(0,0,38,0,Math.PI*2);x.lineWidth=1.5;x.strokeStyle=sealCol;x.globalAlpha=0.4;x.stroke();x.globalAlpha=1;
  x.fillStyle=sealCol;x.textAlign='center';x.textBaseline='middle';
  if(view.first){
   x.font='700 12px '+F;x.letterSpacing='1px';x.fillText(l==='en'?'TODAY ONLY':l==='ja'?'今日限定':'今日限定',0,-14);x.letterSpacing='0px';
   x.font='900 26px '+F;x.fillText(kichi,0,11);
  }else{
   x.font='900 30px '+F;x.letterSpacing='1px';x.fillText(kichi,0,1);x.letterSpacing='0px';
  }
  x.restore();
  x.restore();
  let y=frameY+frameH+56;
  const kind=song
   ? (item.member?(l==='en'?'Solo · '+item.member:l==='ja'?'ソロ曲 ・ '+item.member:'个人曲 · '+item.member):(l==='en'?'Group Song':l==='ja'?'グループ曲':'团体曲'))
   : ((trStatus(item.status,l)||'')+(item.color?' · '+trColor(item.color,l):''));
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
   x.strokeStyle='#ffe4f0';x.lineWidth=1;
   x.beginPath();x.moveTo(110,y+h/2+14);x.lineTo(W-110,y+h/2+14);x.stroke();
   y+=h+28;
  };
  row(song?(l==='en'?'Type':l==='ja'?'区分':'类型'):(l==='en'?'Role':l==='ja'?'担当':'担当'),song?(item.member?(l==='en'?'Solo · '+item.member:l==='ja'?'ソロ曲 ・ '+item.member:'个人曲 · '+item.member):(l==='en'?'Group Song':l==='ja'?'グループ曲':'团体曲')):(item.color?(l==='en'?'Color: '+trColor(item.color,l):l==='ja'?'担当色: '+trColor(item.color,l):'担当色: '+trColor(item.color,l)):(l==='en'?'Member':l==='ja'?'メンバー':'成员')));
  if(song&&item.release)row(l==='en'?'Release':l==='ja'?'リリース':'发布时期',item.release);
  if(!song&&item.status)row(l==='en'?'Status':l==='ja'?'在籍状況':'在籍状态',trStatus(item.status,l));
  if(!song&&item.join)row(l==='en'?'Joined':l==='ja'?'加入日':'加入时间',item.join);
  const fort=view.fortune;
  if(fort){
   const kichi=fort.kichi||'吉';
   const kMeta=getKMeta(kichi);
   y+=10;x.textAlign='center';x.textBaseline='middle';x.fillStyle='#e4007f';x.font='700 16px '+F;x.letterSpacing='4px';x.fillText(t.canvasFortuneHead,W/2,y);x.letterSpacing='0px';
   y+=34;x.font='700 22px '+F;
   const mottoText=trMotto(fort.motto,l);
   const qLines=linesOf('700 22px','「'+mottoText+'」',W-240).slice(0,2);
   const qh=qLines.length*30+36;
   x.fillStyle='#fff6fb';roundRect(x,86,y-24,W-172,qh,18);x.fill();
   x.fillStyle='#e4007f';x.font='700 14px '+F;x.letterSpacing='3px';x.fillText(t.canvasMottoTag+(kMeta.label[l]||kichi),W/2,y-2);x.letterSpacing='0px';
   x.fillStyle='#2b2b2b';x.font='700 22px '+F;qLines.forEach((ln,i)=>x.fillText(ln,W/2,y+22+i*30));
   y+=qh+18;
   const luckRow=(label,value,swatch,isKichi)=>{
    x.fillStyle='#fff';roundRect(x,86,y-20,W-172,44,14);x.fill();
    x.strokeStyle='#ffe4f0';x.lineWidth=1.5;x.stroke();
    x.textAlign='left';x.fillStyle='#8a8a8a';x.font='500 17px '+F;x.fillText(label,112,y+1);
    x.font=isKichi?'900 21px '+F:'700 19px '+F;
    x.fillStyle=isKichi?sealCol:'#2b2b2b';
    x.textAlign='right';
    const vw=x.measureText(value).width;
    if(swatch){
     const cx=W-112-vw-18;
     x.beginPath();x.arc(cx,y+1,9,0,Math.PI*2);x.fillStyle=swatch;x.fill();
     if(lightHex(swatch)){x.strokeStyle='#e6dfd9';x.lineWidth=1.5;x.stroke()}
     x.fillStyle='#2b2b2b';
    }
    x.fillText(value,W-112,y+1);y+=54;
   };
   luckRow(t.canvasFortuneRow,kMeta.label[l]||kichi,null,true);
   luckRow(t.keyColor,trColor(fort.colorName,l),fort.color);
   luckRow(t.keyItem,trItem(fort.item,l));
   luckRow(t.keyAction,trAct(fort.action,l));
  }
  x.textAlign='center';x.textBaseline='middle';x.fillStyle='#2b2b2b';x.font='900 32px Roboto,sans-serif';
  const brand='iLiFE',bang='!',tail=l==='en'?' FAN DATABASE':l==='ja'?' ファンサイト':' 应援资料库';
  const bw=x.measureText(brand).width,jw=x.measureText(bang).width;
  x.font='500 22px '+F;const tw=x.measureText(tail).width;
  const start=(W-bw-jw-tw)/2;
  x.textAlign='left';x.font='900 32px Roboto,sans-serif';x.fillStyle='#2b2b2b';x.fillText(brand,start,1472);
  x.fillStyle='#e4007f';x.fillText(bang,start+bw,1472);
  x.fillStyle='#2b2b2b';x.font='500 22px '+F;x.fillText(tail,start+bw+jw,1472);
  x.textAlign='center';x.fillStyle='#b9a3ad';x.font='500 18px '+F;x.fillText(t.canvasFooter,W/2,1516);
  return c;
 };
 const downloadBlob=(blob,name)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),2500)};
 const saveCard=async()=>{
  if(!view||busy)return;
  const l=currentLang, t=DRAW_I18N[l]||DRAW_I18N.zh;
  const btn=$('#drawSave');if(btn)btn.disabled=true;
  try{
   const canvas=await buildCanvas();
   const blob=await new Promise(res=>canvas.toBlob(res,'image/png'));
   if(!blob)throw new Error('png');
   const name=fileName(),file=new File([blob],name,{type:'image/png'});
   if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
    try{
     await navigator.share({files:[file],title:'iLiFE! DRAW',text:caption()});
     toast(t.toastOpenedShare);return;
    }catch(e){if(e&&e.name=='AbortError')return}
   }
   downloadBlob(blob,name);toast(t.toastSavedCard);
  }catch(e){toast(t.toastFailedCard)}
  finally{if(btn)btn.disabled=false}
 };
 const render=()=>{
  const l=currentLang, t=DRAW_I18N[l]||DRAW_I18N.zh;
  document.title=t.pageTitle;
  const mode=st.prefs.mode,list=pool(),n=counts(),anim=enterAnim&&!reduceMotion();enterAnim=false;
  const phase=shaking?'shake':view?'show':'idle';
  const drawnToday=hasDrawnToday(mode);

  const hero=`<div class="hero">
   <p class="hero-eyebrow">${t.eyebrow}</p>
   <h1 class="hero-title">
    <span class="jp">${mode=='member'?t.heroTitleMem:t.heroTitleSong}</span>
    <span class="cn">${mode=='member'?t.heroTitleMemSub:t.heroTitleSongSub}</span>
   </h1>
   <p class="hero-desc">${t.heroDesc}</p>
   <div class="dmode" role="tablist" aria-label="抽签模式">
    <button type="button" role="tab" data-mode="member" aria-selected="${mode=='member'}"><i class="dico">🐰</i>${t.tabMember}${hasDrawnToday('member')?`<span class="dmode-tag done">${t.tagDone}</span>`:`<span class="dmode-tag">${t.tagPending}</span>`}</button>
    <button type="button" role="tab" data-mode="song" aria-selected="${mode=='song'}"><i class="dico">🎵</i>${t.tabSong}${hasDrawnToday('song')?`<span class="dmode-tag done">${t.tagDone}</span>`:`<span class="dmode-tag">${t.tagPending}</span>`}</button>
   </div>
   ${mode=='song'
    ?`<div class="dfilter-bar" role="group" aria-label="曲目范围">${[['all',t.filterAll+' '+n.all],['group',t.filterGroup+' '+n.group],['solo',t.filterSolo+' '+n.solo]].map(([k,lb])=>`<button type="button" class="pill-btn${st.prefs.songFilter==k?' active':''}" data-sf="${k}">${lb}</button>`).join('')}</div>`
    :`<div class="dfilter-bar"><button type="button" id="drawFormer" class="pill-btn${st.prefs.includeFormer?' active':''}">${st.prefs.includeFormer?`${t.filterFormer} (${n.allM})`:`${t.filterActive} (${n.active})`}</button></div>`
   }
   <div class="mascot-wrap" id="mascotHero" title="${t.mascotHeroTitle}">
    <div class="mascot-avatar-hero">
     <div class="mascot-ears"><span></span><span></span></div>
     <div class="mascot-img-wrap">
      <img src="https://img.ilifefan.dpdns.org/img/FtqqCumaEAMoGDY.jpg" alt="アイラビット">
     </div>
     <div class="mascot-badge">${t.mascotHeroBadge}</div>
    </div>
   </div>
   <button type="button" class="cta${drawnToday?' is-done':''}" id="drawGo" ${busy||(!drawnToday&&!list.length)?'disabled':''}>
    ${!drawnToday?'<span class="cta-shine"></span>':''}
    ${drawnToday?t.ctaDone:(mode=='member'?t.ctaDrawMem:t.ctaDrawSong)}
   </button>
   <p class="hero-note" id="todayNote">${drawnToday?t.noteDone:t.notePending}</p>
  </div>`;

  let stage='';
  if(shaking){
   stage=`<div class="draw-stage" id="drawStage">
    <div class="shake-wrap is-shaking">${bottleSvg}</div>
    <p class="draw-hint">${t.shakingHint}<span class="draw-dots"><span>.</span><span>.</span><span>.</span></span></p>
    <p class="draw-sub">${t.shakingSub}</p>
   </div>`;
  }else if(view){
   const isSong=view.mode=='song',item=view.item;
   const title=isSong?item.title:item.name,kana=item.kana||'';
   const href=isSong?'songs.html?s='+item.id:'members.html?m='+encodeURIComponent(item.name);
   const itemSrc=isSong?songSrc(item):memberSrc(item);
   const sub=isSong
    ?`${item.member?(l==='en'?'Solo · '+item.member:l==='ja'?'ソロ曲 ・ '+item.member:'个人曲 · '+item.member):(l==='en'?'Group Song':l==='ja'?'グループ曲':'团体曲')}${item.duration?' · '+item.duration:''}`
    :`${trStatus(item.status,l)}${item.color?' · '+trColor(item.color,l):''}${item.catch?' · '+item.catch:''}`;
   const no=isSong?(item.release?(l==='en'?'Release: '+item.release:l==='ja'?'リリース: '+item.release:'作品: '+item.release):'iLiFE! SONG'):(item.color?(l==='en'?'Color: '+trColor(item.color,l):l==='ja'?'担当色: '+trColor(item.color,l):'担当色: '+trColor(item.color,l)):(l==='en'?'iLiFE! MEMBER':l==='ja'?'iLiFE! メンバー':'iLiFE! 成员'));
   const kichi=(view.fortune&&view.fortune.kichi)||'吉';
   const kMeta=getKMeta(kichi);
   const hex=!isSong?safeHex(item.hex):'#e4007f';
   const sealCol=!isSong?accentOf(hex):'#e4007f';
   const isToday=view.day===jstDay();
   const otherMode=isSong?'member':'song';
   const otherDone=hasDrawnToday(otherMode);
   const dl=dayLabel(view.day,l);
   const switchBtnHtml=otherDone
    ?`<button type="button" class="btn" id="drawSwitchOther">${isSong?t.btnSwitchViewMem:t.btnSwitchViewSong}</button>`
    :`<button type="button" class="btn primary" id="drawSwitchOther">${isSong?t.btnSwitchDrawMem:t.btnSwitchDrawSong}</button>`;
   stage=`<div class="result" id="result">
    <div class="result-head">
     <div class="result-date"><b>${esc(dl.date)}</b><span>${esc(l==='ja'?`（${dl.wd}）`:l==='en'?` (${dl.wd})`:` · ${dl.wd}`)}</span></div>
     <div class="result-title">${isSong?t.resTitleSong:t.resTitleMem}</div>
    </div>
    <article class="prescription${anim?' is-in':''}" style="--kichi-col:${sealCol};--kichi-deep:${kMeta.deep};--kichi-soft:${kMeta.soft}">
     <div class="presc-top">
      <div class="seal-box">${sealSvg(kichi,view.first&&isToday,sealCol,l)}</div>
      <div class="fortune-side">
       <div class="fortune-tagline" style="color:${sealCol}">${esc(kMeta.tagline[l]||kMeta.tagline.zh)}</div>
       <div class="fortune-tagline-jp">${esc(kMeta.subTag[l]||kMeta.subTag.zh)}</div>
       <span class="fortune-badge" style="background:${kMeta.soft};color:${sealCol}">
        ${kMeta.emoji} ${esc(kMeta.label[l]||kichi)} · ${isSong?t.songOfToday:t.memOfToday}
       </span>
      </div>
     </div>
     <div class="photo-block">
      <div class="polaroid${!isSong?' mem':''}">
       <div class="polaroid-art">
        <a class="polaroid-link" href="${href}">
         ${itemSrc?`<img src="${esc(itemSrc)}" alt="${esc(title)}">`:`<div class="polaroid-ph"><b>${esc(title)}</b><small>${t.noPhoto}</small></div>`}
        </a>
       </div>
       <div class="polaroid-cap">
        <div class="polaroid-name">${esc(title)}</div>
        <div class="polaroid-sub">${esc(sub)}</div>
        <div class="polaroid-no">${esc(no)}</div>
       </div>
      </div>
     </div>
     <div class="rx-list">
      <div class="rx-item is-phrase">
       <div class="phrase-cn">「${esc(trMotto(view.fortune.motto,l))}」</div>
       <div class="phrase-jp">${isSong?t.phraseTitleSong:t.phraseTitleMem}</div>
       <span class="phrase-tag">${t.phraseTag}</span>
      </div>
      <div class="rx-item">
       <div class="rx-emoji">🎨</div>
       <div class="rx-key">${t.keyColor}</div>
       <div class="rx-val">
        <span class="color-chip">
         <span class="color-dot" style="background:${view.fortune.color}"></span>
         ${esc(trColor(view.fortune.colorName,l))}
        </span>
       </div>
      </div>
      <div class="rx-item">
       <div class="rx-emoji">🍬</div>
       <div class="rx-key">${t.keyItem}</div>
       <div class="rx-val">${esc(trItem(view.fortune.item,l))}</div>
      </div>
      <div class="rx-item is-action">
       <div class="rx-emoji">🐾</div>
       <div class="rx-key">${t.keyAction}</div>
       <div class="rx-val">${esc(trAct(view.fortune.action,l))}</div>
      </div>
     </div>
     <div class="share-cta${anim?' is-fresh':''}">
      <div class="share-cta-text">
       <b>${t.shareCtaHead}</b>
       <span>${t.shareCtaSub}</span>
      </div>
      <button type="button" class="btn primary" id="drawSave">${t.btnSave}</button>
     </div>
     <div class="result-actions">
      ${switchBtnHtml}
      <a class="btn" href="${href}">${t.btnProfile}</a>
      ${view.hist?`<button type="button" class="btn ghost" id="drawBackToday">${t.btnBackToday}</button>`:''}
     </div>
     <div class="sr" aria-live="polite">${t.srDrawResult.replace('{title}',esc(title))}</div>
    </article>
   </div>`;
  }

  const feats=`<div class="feature-grid">
   <div class="feature">
    <div class="feature-emoji">🍶</div>
    <h3>${t.feat1Title} <span>${t.feat1Sub}</span></h3>
    <p>${t.feat1Desc}</p>
   </div>
   <div class="feature">
    <div class="feature-emoji">🐰</div>
    <h3>${t.feat2Title} <span>${t.feat2Sub}</span></h3>
    <p>${t.feat2Desc}</p>
   </div>
   <div class="feature">
    <div class="feature-emoji">💌</div>
    <h3>${t.feat3Title} <span>${t.feat3Sub}</span></h3>
    <p>${t.feat3Desc}</p>
   </div>
  </div>`;

  const hist=st.history[mode].map(h=>{
   const item=mode=='song'?songById(h.id):memberById(h.id);if(!item)return '';
   const src=mode=='song'?songSrc(item):memberSrc(item),label=mode=='song'?item.title:item.name;
   const on=view&&!shaking&&view.at===h.at,kichi=(h.fortune&&h.fortune.kichi)||'吉';
   const isHDay=h.day===jstDay();
   const kMeta=getKMeta(kichi);
   const dl=dayLabel(h.day,l);
   return `<div class="pcard${on?' is-active':''}" data-hid="${h.id}" data-hat="${esc(h.at)}" role="button" tabindex="0">
    <div class="pcard-art">
     ${src?`<img alt="" src="${esc(src)}">`:`<b>${esc(label.slice(0,1))}</b>`}
    </div>
    <div class="pcard-meta">
     <div class="pcard-name">${esc(label)}</div>
     <div class="pcard-sub">${esc(dl.full)}</div>
     <span class="pcard-badge" style="background:${kMeta.soft};color:${kMeta.deep}">${kMeta.emoji} ${esc(kMeta.label[l]||kichi)}${isHDay?` ${t.histTodayTag}`:''}</span>
    </div>
   </div>`;
  }).join('');
  const histSec=hist?`<section class="dhist">
   <div class="dhist-head">
    <p class="dmicro">${t.histMicro}</p>
    <h3>${t.histTitle} <span>${t.histSub}</span></h3>
   </div>
   <div class="dgrid">${hist}</div>
  </section>`:'';

  const arch=`<section class="darch">
   <p class="darch-title">${t.archTitle}</p>
   <p class="darch-desc">${t.archDesc}</p>
   <div class="darch-acts">
    <button type="button" class="btn" id="drawExport">${t.btnExport}</button>
    <button type="button" class="btn" id="drawImport">${t.btnImport}</button>
    <button type="button" class="btn ghost" id="drawClear">${t.btnClear}</button>
    <input id="drawFile" type="file" accept="application/json,.json" hidden>
   </div>
  </section>`;

  m.innerHTML=`<div class="dpage" data-phase="${phase}">
   <div class="crumb"><a href="index.html">${t.crumb}</a> / ${t.crumbDraw}</div>
   ${shaking?'':hero}
   ${stage}
   ${shaking?'':feats}
   ${shaking?'':histSec}
   ${shaking?'':arch}
  </div>`;

  window.__onLangChange=()=>{
   render();
  };

  m.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{if(busy||b.dataset.mode==st.prefs.mode)return;st.prefs.mode=b.dataset.mode;view=initTodayView(st.prefs.mode);save();render()});
  m.querySelectorAll('[data-sf]').forEach(b=>b.onclick=()=>{if(busy)return;st.prefs.songFilter=b.dataset.sf;if(view&&view.mode=='song'&&!pool().some(s=>s.id==view.item.id))view=null;save();render()});
  const former=$('#drawFormer');if(former)former.onclick=()=>{if(busy)return;st.prefs.includeFormer=!st.prefs.includeFormer;if(view&&view.mode=='member'&&!pool().some(mem=>mem.id==view.item.id))view=null;save();render()};
  const go=$('#drawGo');if(go)go.onclick=()=>{
   if(drawnToday){
    const r=$('#result');if(r)r.scrollIntoView({behavior:'smooth'});
   }else{
    draw();
   }
  };
  const mascot=$('#mascotHero');if(mascot)mascot.onclick=()=>{
   burst(mode=='member'?(view&&view.item&&view.item.hex||'#e4007f'):'#e4007f');
   toast(t.mascotToast);
  };
  const sv=$('#drawSave');if(sv)sv.onclick=()=>saveCard();
  const swOther=$('#drawSwitchOther');
  if(swOther)swOther.onclick=()=>{
   const targetMode=st.prefs.mode=='member'?'song':'member';
   st.prefs.mode=targetMode;
   view=initTodayView(targetMode);
   save();render();
   window.scrollTo({top:0,behavior:'smooth'});
  };
  const bkToday=$('#drawBackToday');
  if(bkToday)bkToday.onclick=()=>{
   view=initTodayView(st.prefs.mode);
   render();
   window.scrollTo({top:0,behavior:'smooth'});
  };
  m.querySelectorAll('[data-hid]').forEach(b=>b.onclick=()=>{
   if(busy)return;
   const h=st.history[mode].find(x=>String(x.id)==b.dataset.hid&&x.at==b.dataset.hat);if(!h)return;
   const item=mode=='song'?songById(h.id):memberById(h.id);if(!item)return;
   let fortune=h.fortune;if(!fortune){fortune=rollFortune(mode,item);h.fortune=fortune;save()}
   view={mode,item,first:!!h.first,day:h.day,at:h.at,hist:true,fortune};
   render();
   const r=$('#result');if(r)r.scrollIntoView({behavior:'smooth'});
  });
  const ex=$('#drawExport');if(ex)ex.onclick=()=>{
   const blob=new Blob([JSON.stringify({key:KEY,exportedAt:new Date().toISOString(),...st},null,2)],{type:'application/json'});
   downloadBlob(blob,`ilifefan-draw-${jstDay()}.json`);toast(t.toastExported);
  };
  const im=$('#drawImport');if(im)im.onclick=()=>$('#drawFile').click();
  const file=$('#drawFile');if(file)file.onchange=()=>{
   const f=$('#drawFile').files&&$('#drawFile').files[0];$('#drawFile').value='';if(!f)return;
   const rd=new FileReader();
   rd.onload=()=>{
    try{
     const raw=JSON.parse(String(rd.result||''));
     if(!raw||typeof raw!='object'||!(raw.prefs||raw.history||raw.key==KEY))throw new Error('shape');
     st=normalize(raw);view=initTodayView(st.prefs.mode);save();render();toast(t.toastImported);
    }catch(e){toast(t.toastImportFailed)}
   };
   rd.readAsText(f);
  };
  const clr=$('#drawClear');if(clr)clr.onclick=()=>{
   if(busy)return;
   if(!confirm(t.confirmClear))return;
   const prefs=st.prefs;st=empty();st.prefs=prefs;view=null;save();render();toast(t.toastCleared);
  };
  imgDone(m);
 };
 const draw=async()=>{
  if(busy)return;
  const mode=st.prefs.mode;
  const l=currentLang, t=DRAW_I18N[l]||DRAW_I18N.zh;
  if(hasDrawnToday(mode)){
   toast(mode=='member'?t.toastDrawnLimitMem:t.toastDrawnLimitSong);
   return;
  }
  const list=pool();
  if(!list.length){toast(t.toastEmptyPool);return}
  if(!globalThis.crypto||!crypto.getRandomValues){toast(t.toastNoCrypto);return}
  busy=true;
  const reduce=reduceMotion();
  try{
   if(!reduce){shaking=true;render();window.scrollTo({top:0,behavior:'smooth'});await wait(1900)}
   const item=list[randIndex(list.length)];
   const day=jstDay();
   st.first[mode]=day;
   const at=new Date().toISOString();
   const fortune=rollFortune(mode,item);
   st.history[mode]=[{id:item.id,day,at,first:true,fortune},...st.history[mode]].slice(0,20);
   save();
   shaking=false;
   view={mode,item,first:true,day,at,hist:false,fortune};
   enterAnim=!reduce;
   render();
   if(!reduce){
    burst(mode=='member'?item.hex:'#e4007f');
    const shown=$('#result');
    if(shown)shown.scrollIntoView({block:'nearest',behavior:'smooth'});
   }
  }finally{
   const failed=shaking;
   shaking=false;busy=false;
   if(failed)render();
   else{const b=$('#drawGo');if(b)b.disabled=false}
  }
 };
 view=initTodayView(st.prefs.mode);
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

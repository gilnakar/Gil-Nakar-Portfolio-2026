
const filters=document.querySelectorAll('[data-filter]');
const cards=document.querySelectorAll('[data-tags]');
filters.forEach(btn=>btn.addEventListener('click',()=>{filters.forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;cards.forEach(c=>{c.style.display=(f==='all'||c.dataset.tags.includes(f))?'flex':'none';}); }));

const lb=document.getElementById('lightbox');
const lbImg=lb?.querySelector('.lb-img');
const lbCaption=lb?.querySelector('.lb-caption');
const lbCount=lb?.querySelector('.lb-count');
const zoomImgs=Array.from(document.querySelectorAll('img[data-zoom="true"]'));
let gallery=[];
let activeZoomImgs=zoomImgs;
function captionOf(img){
  const fc=img.closest('figure')?.querySelector('figcaption');
  if(!fc) return (img.alt||'').trim();
  const t=fc.querySelector('strong')?.textContent.trim()||'';
  const d=fc.querySelector('span')?.textContent.trim()||'';
  if(t&&d) return t+'\n'+d;
  return (fc.textContent||img.alt||'').trim();
}
function itemFromImg(img){return {src:img.dataset.zoomSrc || img.currentSrc || img.src, alt:img.alt||'', caption:captionOf(img), board:img.dataset.board==='true'};}
function setGalleryForImg(img){
  const group=img.dataset.gallery;
  activeZoomImgs = group ? zoomImgs.filter(el=>el.dataset.gallery===group) : zoomImgs;
  gallery = activeZoomImgs.map(itemFromImg);
  return activeZoomImgs.indexOf(img);
}
let currentIndex=0;
let lastFocus=null;
if(lb){lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Image viewer');lb.querySelector('.lb-close')?.setAttribute('aria-label','Close image viewer');lb.querySelector('.lb-prev')?.setAttribute('aria-label','Previous image');lb.querySelector('.lb-next')?.setAttribute('aria-label','Next image');}
let scale=1, offsetX=0, offsetY=0, dragging=false, dragStartX=0, dragStartY=0, dragStartOffsetX=0, dragStartOffsetY=0;

let fitW=0, fitH=0, maxScale=8;
// v27: zoom by resizing the image itself (not transform:scale) so the browser repaints
// real pixels at every zoom level instead of stretching a bitmap rasterized at fit size.
function measureFit(){
  if(!lbImg) return;
  ['width','height','max-width','max-height'].forEach(p=>lbImg.style.removeProperty(p));
  fitW=lbImg.offsetWidth||lbImg.naturalWidth; fitH=lbImg.offsetHeight||lbImg.naturalHeight;
  // Zoom until the file runs out of real pixels (about 2x device-pixel density), never into a smear.
  const dpr=window.devicePixelRatio||1, native=lbImg.naturalWidth/(fitW*dpr||1);
  maxScale=Math.min(10,Math.max(2,native*2));
}
function renderLb(){
  if(!lbImg) return;
  if(fitW && scale!==1){
    lbImg.style.setProperty('max-width','none','important');
    lbImg.style.setProperty('max-height','none','important');
    lbImg.style.setProperty('width',(fitW*scale)+'px','important');
    lbImg.style.setProperty('height',(fitH*scale)+'px','important');
  } else {
    ['width','height','max-width','max-height'].forEach(p=>lbImg.style.removeProperty(p));
  }
  lbImg.style.transform=`translate(${offsetX}px,${offsetY}px)`;
}

function fitImageToScreen(){
  // "Fit" is scale 1: CSS sizes the image to the viewport.
  if(!lbImg || !lb) return;
  scale = 1; offsetX = 0; offsetY = 0;
  measureFit();
  renderLb();
}

function openLbAt(index){ 
  if(!lb||!lbImg) return; 
  currentIndex=Math.max(0,Math.min(gallery.length-1,index)); 
  const item=gallery[currentIndex]; 
  scale=1; 
  offsetX=0; 
  offsetY=0; 
  lb.classList.toggle('board',!!item.board); 
  lbImg.src=item.src; 
  lbImg.alt=item.alt; 
  if(lbCaption) lbCaption.textContent=item.caption||item.alt||''; 
  if(lbCount) lbCount.textContent=gallery.length>1?`${currentIndex+1} / ${gallery.length}`:''; 
  lb.classList.add('open'); 
  lb.classList.toggle('single',gallery.length<2);
  document.documentElement.classList.add('lb-lock');
  lb.setAttribute('aria-hidden','false'); 
  lastFocus=document.activeElement;
  lb.querySelector('.lb-close')?.focus({preventScroll:true});
  
  // When image loads, fit it to screen
  lbImg.onload = () => { fitImageToScreen(); };
  if(lbImg.complete) { fitImageToScreen(); }
  renderLb(); 
}

function closeLb(){ 
  if(!lb||!lbImg) return; 
  lb.classList.remove('open'); 
  lb.classList.remove('board'); 
  lb.setAttribute('aria-hidden','true'); 
  document.documentElement.classList.remove('lb-lock');
  if(lastFocus&&lastFocus.focus) lastFocus.focus({preventScroll:true});
  lbImg.src=''; 
  scale=1; 
  offsetX=0; 
  offsetY=0; 
}

function moveLb(dir){ 
  if(!gallery.length) return; 
  const next=(currentIndex+dir+gallery.length)%gallery.length; 
  openLbAt(next); 
}

zoomImgs.forEach((img)=>img.addEventListener('click',e=>{e.preventDefault(); const i=setGalleryForImg(img); openLbAt(i>=0?i:0);}));
lb?.querySelector('.lb-close')?.addEventListener('click',closeLb);
lb?.querySelector('.lb-prev')?.addEventListener('click',e=>{e.stopPropagation(); moveLb(-1);});
lb?.querySelector('.lb-next')?.addEventListener('click',e=>{e.stopPropagation(); moveLb(1);});
lb?.addEventListener('click',e=>{if(e.target===lb) closeLb();});
document.addEventListener('keydown',e=>{if(!lb?.classList.contains('open')) return; if(e.key==='Escape') closeLb(); if(e.key==='ArrowRight') moveLb(1); if(e.key==='ArrowLeft') moveLb(-1);});

// Cursor-centered zoom with proper overflow
function zoomAtCursor(clientX, clientY, factor){ 
  if(!lbImg || !lb) return;
  
  const rect=lb.getBoundingClientRect();
  const viewportW = rect.width;
  const viewportH = rect.height;
  
  // Cursor position on screen
  const cursorX = clientX - rect.left;
  const cursorY = clientY - rect.top;
  
  // Image dimensions
  const imgW = fitW || lbImg.offsetWidth || lbImg.naturalWidth;
  const imgH = fitH || lbImg.offsetHeight || lbImg.naturalHeight;
  
  // Current scaled image dimensions
  const scaledW = imgW * scale;
  const scaledH = imgH * scale;
  
  // Current image position on screen (top-left corner)
  const imgScreenX = viewportW / 2 + offsetX - (scaledW / 2);
  const imgScreenY = viewportH / 2 + offsetY - (scaledH / 2);
  
  // Cursor position relative to image top-left
  const cursorRelX = cursorX - imgScreenX;
  const cursorRelY = cursorY - imgScreenY;
  
  // New scale
  const oldScale = scale;
  const newScale = Math.min(maxScale, Math.max(1, scale * factor));
  if(newScale === oldScale) return;
  
  // New scaled dimensions
  const newScaledW = imgW * newScale;
  const newScaledH = imgH * newScale;
  
  // Point on image that was under cursor (in image coords)
  const imgPointX = cursorRelX / oldScale;
  const imgPointY = cursorRelY / oldScale;
  
  // Where that point should be on screen after zoom
  const newImgScreenX = cursorX - (imgPointX * newScale);
  const newImgScreenY = cursorY - (imgPointY * newScale);
  
  // New offset to center image and position correctly
  offsetX = newImgScreenX - (viewportW / 2) + (newScaledW / 2);
  offsetY = newImgScreenY - (viewportH / 2) + (newScaledH / 2);
  
  scale = newScale;
  renderLb();
}

window.addEventListener('resize',()=>{ if(lb?.classList.contains('open')&&scale===1){ measureFit(); renderLb(); } });

// Zoom buttons - use center of screen
lb?.querySelector('[data-zoom="in"]')?.addEventListener('click',e=>{e.stopPropagation(); zoomAtCursor(window.innerWidth/2, window.innerHeight/2, 1.4);});
lb?.querySelector('[data-zoom="out"]')?.addEventListener('click',e=>{e.stopPropagation(); zoomAtCursor(window.innerWidth/2, window.innerHeight/2, 1/1.4);});
lb?.querySelector('[data-zoom="reset"]')?.addEventListener('click',e=>{e.stopPropagation(); fitImageToScreen();});

// Mouse wheel zoom - cursor-centered
lb?.addEventListener('wheel',e=>{
  if(!lb?.classList.contains('open')) return;
  e.preventDefault(); 
  if(e.deltaY<0) { 
    zoomAtCursor(e.clientX, e.clientY, 1.15); 
  } else { 
    zoomAtCursor(e.clientX, e.clientY, 1/1.15); 
  }
},{passive:false});

// v26 unified gestures: mouse drag, one-finger pan, two-finger pinch, swipe to navigate, double-tap zoom
function clampOffsets(){
  if(!lbImg||!lb) return;
  const vw=lb.clientWidth, vh=lb.clientHeight;
  const sw=fitW*scale, sh=fitH*scale;
  const mx=sw>vw?(sw-vw)/2+48:0, my=sh>vh?(sh-vh)/2+48:0;
  offsetX=Math.max(-mx,Math.min(mx,offsetX));
  offsetY=Math.max(-my,Math.min(my,offsetY));
}
if(lbImg){lbImg.draggable=false;lbImg.addEventListener('dragstart',e=>e.preventDefault());}
const pts=new Map();
let gStart=null, lastMid=null, lastDist=0, lastTapAt=0, lastTapX=0, lastTapY=0, touchedAt=0;
function mid(){const a=[...pts.values()];return {x:(a[0].x+a[1].x)/2,y:(a[0].y+a[1].y)/2,d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)};}
lb?.addEventListener('pointerdown',e=>{
  if(!lb.classList.contains('open')||e.target.closest('button')||e.target.closest('.lb-meta')) return;
  if(e.pointerType==='touch') touchedAt=Date.now();
  pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pts.size===1){ gStart={x:e.clientX,y:e.clientY,t:Date.now(),moved:0,ox:offsetX,oy:offsetY,onImg:e.target===lbImg}; }
  if(pts.size===2){ const m=mid(); lastMid=m; lastDist=m.d; gStart&&(gStart.moved=999); }
});
lb?.addEventListener('pointermove',e=>{
  if(!pts.has(e.pointerId)) return;
  pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pts.size>=2){
    const m=mid();
    if(lastDist>0) zoomAtCursor(m.x,m.y,m.d/lastDist);
    offsetX+=m.x-lastMid.x; offsetY+=m.y-lastMid.y;
    lastMid=m; lastDist=m.d; renderLb();
  } else if(gStart){
    const dx=e.clientX-gStart.x, dy=e.clientY-gStart.y;
    gStart.moved=Math.max(gStart.moved,Math.hypot(dx,dy));
    if(scale>1.02){ offsetX=gStart.ox+dx; offsetY=gStart.oy+dy; renderLb(); lbImg.style.cursor='grabbing'; }
  }
});
function gestureEnd(e){
  if(!pts.has(e.pointerId)) return;
  const wasSingle=pts.size===1;
  pts.delete(e.pointerId);
  if(pts.size===1){ const r=[...pts.values()][0]; gStart={x:r.x,y:r.y,t:Date.now(),moved:999,ox:offsetX,oy:offsetY}; }
  if(pts.size===0){
    if(lbImg) lbImg.style.cursor='grab';
    if(scale<1.02){ fitImageToScreen(); } else { clampOffsets(); renderLb(); }
    if(wasSingle&&gStart&&e.type==='pointerup'){
      const dx=e.clientX-gStart.x, dy=e.clientY-gStart.y, dt=Date.now()-gStart.t;
      if(scale<=1.02&&Math.abs(dx)>60&&Math.abs(dy)<80&&dt<600&&gallery.length>1){ moveLb(dx<0?1:-1); }
      else if(gStart.moved<10&&dt<350&&e.pointerType==='touch'&&e.target===lbImg){
        const now=Date.now();
        if(now-lastTapAt<320&&Math.hypot(e.clientX-lastTapX,e.clientY-lastTapY)<40){ lastTapAt=0; if(scale>1.02){fitImageToScreen();} else {zoomAtCursor(e.clientX,e.clientY,2.5); clampOffsets(); renderLb();} }
        else { lastTapAt=now; lastTapX=e.clientX; lastTapY=e.clientY; }
      }
    }
    gStart=null;
  }
}
lb?.addEventListener('pointerup',gestureEnd);
lb?.addEventListener('pointercancel',gestureEnd);

// Double-click (mouse) to toggle zoom; ignored right after a touch double-tap
lbImg?.addEventListener('dblclick',e=>{
  e.preventDefault();
  if(Date.now()-touchedAt<800) return;
  if(scale>1){ fitImageToScreen(); } else { zoomAtCursor(e.clientX, e.clientY, 2); }
});

// v9 long-board viewer: scrollable, fullscreen-capable
(function(){
  document.querySelectorAll('[data-board-viewer]').forEach(shell=>{
    const scroller=shell.querySelector('.board-scroll');
    const img=scroller?.querySelector('img');
    if(!scroller||!img) return;
    let scale=1;
    function apply(){ img.style.width=(100*scale)+'%'; }
    function zoomAt(clientX, clientY, factor){
      const old=scale;
      const next=Math.min(3.5, Math.max(.65, scale*factor));
      if(next===old) return;
      const rect=scroller.getBoundingClientRect();
      const x=clientX-rect.left+scroller.scrollLeft;
      const y=clientY-rect.top+scroller.scrollTop;
      scale=next; apply();
      scroller.scrollLeft = x*(next/old) - (clientX-rect.left);
      scroller.scrollTop = y*(next/old) - (clientY-rect.top);
    }
    shell.querySelector('[data-board-zoom="in"]')?.addEventListener('click',()=>zoomAt(scroller.getBoundingClientRect().left+scroller.clientWidth/2, scroller.getBoundingClientRect().top+scroller.clientHeight/2, 1.18));
    shell.querySelector('[data-board-zoom="out"]')?.addEventListener('click',()=>zoomAt(scroller.getBoundingClientRect().left+scroller.clientWidth/2, scroller.getBoundingClientRect().top+scroller.clientHeight/2, 1/1.18));
    shell.querySelector('[data-board-zoom="reset"]')?.addEventListener('click',()=>{scale=1;apply();scroller.scrollTop=0;scroller.scrollLeft=0;});
    shell.querySelector('[data-board-fullscreen]')?.addEventListener('click',()=>{ if(shell.requestFullscreen) shell.requestFullscreen(); });
    scroller.addEventListener('wheel',e=>{
      if(e.ctrlKey || e.metaKey){ e.preventDefault(); zoomAt(e.clientX,e.clientY,e.deltaY<0?1.12:.89); }
    }, {passive:false});
    apply();
  });
})();

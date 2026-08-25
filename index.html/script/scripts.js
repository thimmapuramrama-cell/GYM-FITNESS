(function(){
  const track = document.getElementById('track');
  const viewport = document.getElementById('viewport');
  const dotsBox = document.getElementById('dots');
  let cur = 0;
  let autoTimer;

  function visibleCount(){
    if(window.innerWidth <= 767) return 1;
    if(window.innerWidth <= 1024) return 2;
    return 3;
  }

  function cardStep(){
    return track.children[0].offsetWidth + 22; // width + gap
  }

  function totalPages(){ return Math.ceil(track.children.length - visibleCount() + 1); }

  function buildDots(){
    dotsBox.innerHTML='';
    for(let i=0;i<totalPages();i++){
      let d=document.createElement('div');
      d.className='dot'+(i===0?' active':'');
      d.onclick=()=>{ cur=i; go(); resetAuto(); };
      dotsBox.appendChild(d);
    }
  }

  function go(){
    const max = track.children.length - visibleCount();
    if(cur < 0) cur = max;
    if(cur > max) cur = 0;
    track.style.transform = `translateX(-${cur * cardStep()}px)`;
    [...dotsBox.children].forEach((d,i)=> d.className = 'dot'+(i===cur?' active':''));
  }

  function next(){ cur++; go(); }
  function prev(){ cur--; go(); }

  document.getElementById('next').onclick = ()=>{ next(); resetAuto(); };
  document.getElementById('prev').onclick = ()=>{ prev(); resetAuto(); };

  // Swipe
  let sx=0;
  track.addEventListener('touchstart', e=>{ sx=e.touches[0].clientX; clearInterval(autoTimer); }, {passive:true});
  track.addEventListener('touchend', e=>{
    let dx = e.changedTouches[0].clientX - sx;
    if(dx > 50) prev(); else if(dx < -50) next();
    startAuto();
  });

  // Auto play
  function startAuto(){ autoTimer = setInterval(next, 3000); }
  function resetAuto(){ clearInterval(autoTimer); startAuto(); }

  // Pause on hover
  viewport.addEventListener('mouseenter', ()=> clearInterval(autoTimer));
  viewport.addEventListener('mouseleave', ()=> startAuto());

  window.addEventListener('resize', ()=>{ buildDots(); go(); });

  buildDots(); go(); startAuto();
})();
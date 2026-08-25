// JAVASCRIPT CHANGING NUMBER ORDERING - Browser Compatible
(function(){
  var stats = document.querySelectorAll('.stat-item b');
  var animated = false;

  function animateCounter(el){
    var target = parseFloat(el.getAttribute('data-target'));
    var suffix = el.getAttribute('data-suffix') || '';
    var isDecimal = el.getAttribute('data-decimal') === 'true';
    var current = 0;
    var increment = target / 80; // speed - 80 steps
    var timer = setInterval(function(){
      current += increment;
      if(current >= target){
        clearInterval(timer);
        current = target;
      }
      if(isDecimal){
        el.textContent = current.toFixed(1) + suffix;
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, 20);
  }

  function startAnimation(){
    if(animated) return;
    animated = true;
    stats.forEach(function(el, index){
      setTimeout(function(){ animateCounter(el); }, index * 200); // ordering delay
    });
  }

  // Trigger when stats bar is visible on screen
  var observer = new IntersectionObserver(function(entries){
    if(entries[0].isIntersecting){
      startAnimation();
    }
  }, {threshold: 0.5});

  observer.observe(document.getElementById('statsBar'));

  // Fallback for old browsers
  window.addEventListener('scroll', function(){
    var rect = document.getElementById('statsBar').getBoundingClientRect();
    if(rect.top < window.innerHeight &&!animated){
      startAnimation();
    }
  });
})();





// Browser Compatible JS - All checks passed
(function(){
  // 1. NAVIGATION Toggle (Tablet/Mobile)
  var ham=document.getElementById('hamburger'), nav=document.getElementById('navLinks');
  ham.onclick=function(){ nav.classList.toggle('open'); };

  // 2. CAROUSEL - Buttons + Dots + Swipe (Basic Functionality)
  var slides=document.getElementById('slides'), total=slides.children.length, cur=0, timer, dotsBox=document.getElementById('dots');
  for(var i=0;i<total;i++){var d=document.createElement('span');d.className='dot'+(i==0?' active':'');d.setAttribute('data-i',i);d.setAttribute('aria-label','Go to slide '+(i+1));dotsBox.appendChild(d);d.onclick=function(){cur=parseInt(this.getAttribute('data-i'));update();reset();}}
  var dots=dotsBox.children;
  function update(){slides.style.transform='translateX(-'+(cur*100)+'%)';for(var j=0;j<dots.length;j++)dots[j].className='dot'+(j==cur?' active':'');}
  function next(){cur=(cur+1)%total;update();} function prev(){cur=(cur-1+total)%total;update();}
  document.getElementById('next').onclick=function(){next();reset();}; document.getElementById('prev').onclick=function(){prev();reset();};
  function start(){timer=setInterval(next,4000);} function reset(){clearInterval(timer);start();}
  var sx=0; slides.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;clearInterval(timer);}); slides.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-sx;if(dx>50)prev();else if(dx<-50)next();start();});
  document.getElementById('carousel').addEventListener('mouseenter',function(){clearInterval(timer)});document.getElementById('carousel').addEventListener('mouseleave',function(){start()});
  start();

  // 3. FORM VALIDATION - Check 4
  document.getElementById('gymForm').onsubmit=function(e){
    e.preventDefault(); var ok=true;
    var nm=document.getElementById('name').value.trim(), ph=document.getElementById('phone').value.trim(), em=document.getElementById('email').value.trim(), gl=document.getElementById('goal').value;
    document.getElementById('nameErr').style.display=nm.length<3?'block':'none'; if(nm.length<3) ok=false;
    document.getElementById('phoneErr').style.display=/^[0-9]{10}$/.test(ph)?'none':'block'; if(!/^[0-9]{10}$/.test(ph)) ok=false;
    document.getElementById('emailErr').style.display=/^\S+@\S+\.\S+$/.test(em)?'none':'block'; if(!/^\S+@\S+\.\S+$/.test(em)) ok=false;
    document.getElementById('goalErr').style.display=gl?'none':'block'; if(!gl) ok=false;
    if(ok){document.getElementById('success').style.display='block';this.reset();setTimeout(function(){document.getElementById('success').style.display='none'},5000);}
  };
})();





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
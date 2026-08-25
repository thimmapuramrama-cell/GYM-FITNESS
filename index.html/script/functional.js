const ham = document.getElementById('ham');
const navLinks = document.getElementById('navLinks');
ham.onclick = () => navLinks.classList.toggle('open');


const counters = document.querySelectorAll('[data-target]');
const obs = new IntersectionObserver(entries => {
 if(entries[0].isIntersecting){
  counters.forEach(c => {
   let target = +c.dataset.target, cur=0, step=target/50;
   let t = setInterval(()=>{ cur+=step; if(cur>=target){c.innerText=target; clearInterval(t)} else c.innerText=Math.floor(cur)},30);
  });
 }
},{threshold:0.5});
obs.observe(document.querySelector('.stats'));


let cur=0; const track=document.getElementById('track');
function go(){ track.style.transform=`translateX(-${cur*320}px)` }
setInterval(()=>{cur=(cur+1)%3; go()},3000);

// Swipe for mobile
let sx=0; track.addEventListener('touchstart',e=>sx=e.touches[0].clientX);
track.addEventListener('touchend',e=>{ if(e.changedTouches[0].clientX-sx < -50) cur++; else if(e.changedTouches[0].clientX-sx > 50) cur--; go() });

document.getElementById('searchInput').oninput = (e) => {
 let q = e.target.value.toLowerCase();
 document.querySelectorAll('.card').forEach(card=>{
  card.style.display = card.innerText.toLowerCase().includes(q)? 'block':'none';
 });
 // Error / Empty State
 let visible = [...document.querySelectorAll('.card')].filter(c=>c.style.display!=='none').length;
 document.getElementById('emptyState').style.display = visible==0? 'block':'none';
}


document.getElementById('gymForm').onsubmit = (e) => {
 e.preventDefault();
 let name = document.getElementById('name').value.trim();
 let phone = document.getElementById('phone').value.trim();
 if(name.length<3) return alert('Name min 3 letters');
 if(!/^\d{10}$/.test(phone)) return alert('10 digit phone');

 // ADD Action
 let members = JSON.parse(localStorage.getItem('members')||'[]');
 members.push({id:Date.now(), name, phone});
 localStorage.setItem('members', JSON.stringify(members));
 e.target.reset();
 renderMembers(); // Dynamic render
}


function renderMembers(){
 let members = JSON.parse(localStorage.getItem('members')||'[]');
 document.getElementById('list').innerHTML = members.map(m=>`
  <div>${m.name} - ${m.phone}
   <button onclick="editMember(${m.id})">Edit</button>
   <button onclick="deleteMember(${m.id})">Delete</button>
  </div>`).join('');
}
function deleteMember(id){
 let members = JSON.parse(localStorage.getItem('members')||'[]').filter(m=>m.id!==id);
 localStorage.setItem('members', JSON.stringify(members));
 renderMembers();
}
function editMember(id){
 let newName = prompt('New name:');
 let members = JSON.parse(localStorage.getItem('members')||'[]');
 let m = members.find(x=>x.id===id); m.name=newName;
 localStorage.setItem('members', JSON.stringify(members));
 renderMembers();
}


function showToast(msg){
 let t=document.createElement('div');
 t.style.cssText='position:fixed;bottom:20px;right:20px;background:#ff2a2a;color:#fff;padding:12px 18px;border-radius:8px;z-index:999';
 t.innerText=msg; document.body.appendChild(t);
 setTimeout(()=>t.remove(),2000);
}
// Use: showToast('Member Added Successfully!');





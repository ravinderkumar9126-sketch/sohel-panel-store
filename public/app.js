const $=id=>document.getElementById(id);let currentUser=null;
function toast(msg){$('toast').textContent=msg;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),1900)}
function showTab(id){document.querySelectorAll('.tab').forEach(x=>x.classList.add('hidden'));$(id).classList.remove('hidden');document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',x.dataset.tab===id))}
async function api(path,body){const r=await fetch(path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});const data=await r.json();if(!r.ok)throw Error(data.error||'Request failed');return data}
function enter(user){currentUser=user;$('loginView').classList.add('hidden');$('appView').classList.remove('hidden');$('who').textContent=user.email;$('logout').classList.remove('hidden');$('name').textContent=user.name;$('roleLabel').textContent=user.role.toUpperCase();document.querySelectorAll('.admin-only').forEach(x=>x.classList.toggle('hidden',user.role!=='admin'));showTab('overview')}
$('login').onclick=async()=>{try{const d=await api('/api/login',{email:$('email').value,password:$('password').value});enter(d.user);toast('Welcome back!')}catch(e){$('loginMsg').textContent=e.message}};
$('logout').onclick=async()=>{await api('/api/logout',{});currentUser=null;$('appView').classList.add('hidden');$('loginView').classList.remove('hidden');$('logout').classList.add('hidden');$('who').textContent='Guest mode'};
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>showTab(b.dataset.tab));document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>showTab(b.dataset.go));
$('themeBtn').onclick=()=>{const colors=['#38d9f5','#a78bfa','#fb7185','#4ade80','#fbbf24'];let i=(colors.indexOf(getComputedStyle(document.documentElement).getPropertyValue('--accent').trim())+1)%colors.length;setColor(colors[i]);};
function setColor(c){document.documentElement.style.setProperty('--accent',c);$('themeBtn').textContent='Accent: '+c;toast('Theme updated')}
document.querySelectorAll('[data-color]').forEach(b=>b.onclick=()=>setColor(b.dataset.color));
$('addProduct').onclick=()=>toast('Product form: connect your database to save listings');
$('saveApi').onclick=async()=>{try{const d=await api('/api/admin/providers',{name:$('apiName').value,baseUrl:$('apiUrl').value,secret:$('apiSecret').value});$('apiMsg').textContent='Provider saved: '+d.name+'. Add its official API adapter to enable sync.';$('apiSecret').value='';toast('API provider saved')}catch(e){$('apiMsg').textContent=e.message}};
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;b.animate([{filter:'brightness(1)'},{filter:'brightness(1.7)'},{filter:'brightness(1)'}],{duration:320})});
api('/api/me').then(d=>{if(d.user)enter(d.user)}).catch(()=>{});

"use strict";
const loginScreen=document.getElementById('loginScreen'),adminApp=document.getElementById('adminApp'),loginForm=document.getElementById('loginForm');
const sb=window.supabase.createClient(window.GANTUS_SUPABASE.url,window.GANTUS_SUPABASE.key);
window.gantusSB=sb;
function showAdmin(ok){loginScreen.hidden=ok;adminApp.hidden=!ok;if(!ok)document.getElementById('loginPass').value='';}
async function verifyAdmin(){const {data:{user},error}=await sb.auth.getUser();if(error||!user){showAdmin(false);return;}const {data, error:roleError}=await sb.from('admin_users').select('user_id').eq('user_id',user.id).maybeSingle();if(roleError||!data){await sb.auth.signOut();showAdmin(false);document.getElementById('loginError').textContent='Usuário sem permissão administrativa.';return;}showAdmin(true);if(window.gantusLoad)await window.gantusLoad();}
showAdmin(false);
loginForm.addEventListener('submit',async e=>{e.preventDefault();const btn=loginForm.querySelector('[type=submit]');btn.disabled=true;document.getElementById('loginError').textContent='';try{const {error}=await sb.auth.signInWithPassword({email:document.getElementById('loginUser').value.trim(),password:document.getElementById('loginPass').value});if(error)throw error;await verifyAdmin();}catch(err){document.getElementById('loginError').textContent=err.message||'Falha no login';}finally{btn.disabled=false;}});
document.getElementById('logoutBtn').addEventListener('click',async()=>{await sb.auth.signOut();showAdmin(false);});
verifyAdmin();

"use strict";
// ATENÇÃO: credenciais demonstrativas no navegador. NÃO é autenticação segura.
const loginScreen = document.getElementById('loginScreen');
const adminApp = document.getElementById('adminApp');
const loginForm = document.getElementById('loginForm');
function showAdmin(isLoggedIn) {
  loginScreen.hidden = isLoggedIn;
  adminApp.hidden = !isLoggedIn;
  if (!isLoggedIn) document.getElementById('loginPass').value = '';
}
showAdmin(sessionStorage.getItem('gantus_demo_logged') === 'yes');
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const user = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPass').value;
  if (user === 'Eduardo' && password === '12345') {
    sessionStorage.setItem('gantus_demo_logged', 'yes');
    document.getElementById('loginError').textContent = '';
    showAdmin(true);
  } else {
    document.getElementById('loginError').textContent = 'Usuário ou senha incorretos.';
  }
});
document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('gantus_demo_logged');
  showAdmin(false);
});

const API = 'http://localhost:3000/api';

function getUser() {
  const u = sessionStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}

function setUser(user) {
  sessionStorage.setItem('user', JSON.stringify(user));
}

function logout() {
  sessionStorage.removeItem('user');
  window.location.href = 'login.html';
}

function requireLogin() {
  if (!getUser()) window.location.href = 'login.html';
}

function updateNav() {
  const user      = getUser();
  const navUser   = document.getElementById('nav-user');
  const navLogin  = document.getElementById('nav-login');
  const navLogout = document.getElementById('nav-logout');
  const navDash   = document.getElementById('nav-dashboard');
  const navAdmin  = document.getElementById('nav-admin');

  if (user) {
    if (navUser)   navUser.textContent = '👤 ' + user.nom;
    if (navLogin)  navLogin.style.display  = 'none';
    if (navLogout) navLogout.style.display = 'inline';
    if (navDash && (user.role === 'agent' || user.role === 'administrateur')) {
      navDash.style.display = 'inline';
    }
    if (navAdmin && user.role === 'administrateur') {
      navAdmin.style.display = 'inline';
    }
  } else {
    if (navUser)   navUser.textContent = '';
    if (navLogin)  navLogin.style.display  = 'inline';
    if (navLogout) navLogout.style.display = 'none';
  }
}

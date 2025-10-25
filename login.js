// Read role from URL (default 'user')
const urlParams = new URLSearchParams(window.location.search);
const role = urlParams.get('role') || 'user';

// Update role badge
const roleBadge = document.getElementById('roleBadge');
const roleNames = {
  'master-admin': '👑 Master Admin',
  'admin': '👨‍💼 Admin',
  'student': '👨‍🎓 Student'
};
roleBadge.textContent = roleNames[role] || 'User';

// Helper: map role -> dashboard file
function dashboardForRole(r) {
  switch (r) {
    case 'master-admin': return 'master_dashboard.html';
    case 'admin': return 'admin_dashboard.html';
    case 'student': return 'student_dashboard.html';
    default: return 'index.html';
  }
}

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const usernameInput = this.querySelector('input[type="text"]');
  const passwordInput = this.querySelector('input[type="password"]');
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username) {
    alert('Please enter your email or username.');
    usernameInput.focus();
    return;
  }
  if (!password) {
    alert('Please enter your password.');
    passwordInput.focus();
    return;
  }

  // Temporary authentication chak chaka ajdflasdjflasjdfjhasf
  const isDemoAuthOk = true;

  if (!isDemoAuthOk) {
    alert('Invalid credentials.');
    return;
  }

  // Save the fucking user info
  const user = {
    username,
    role,
    loggedAt: new Date().toISOString()
  };

  try {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  } catch (err) {
    console.warn('Could not save session:', err);
  }

//redirect to selected role dooshboard i think
  const dash = dashboardForRole(role);
  const url = `${dash}?user=${encodeURIComponent(username)}`;
  window.location.href = url;
});
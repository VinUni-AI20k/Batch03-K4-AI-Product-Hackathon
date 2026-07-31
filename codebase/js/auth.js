// Auth and Session management for VLearn
(function() {
  const currentUserStr = localStorage.getItem('currentUser');
  const path = window.location.pathname;
  const isLoginPage = path.includes('login.html');
  const isIndexPage = path.endsWith('index.html') || path === '/' || path.endsWith('/');

  if (!currentUserStr) {
    // If not logged in and not on index or login page, redirect to login
    if (!isLoginPage && !isIndexPage) {
      window.location.href = 'login.html';
    }
  } else {
    // If logged in and on login page, redirect to courses list
    if (isLoginPage) {
      window.location.href = 'my-courses.html';
    }
  }
})();

// Global logout function
function logoutUser() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function() {
  const currentUserStr = localStorage.getItem('currentUser');
  if (!currentUserStr) {
    return;
  }
  const user = JSON.parse(currentUserStr);

  // 1. Update Header / Navigation for logged-in users on index.html
  const path = window.location.pathname;
  const isIndexPage = path.endsWith('index.html') || path === '/' || path.endsWith('/');
  if (isIndexPage) {
    const loginHeaderBtn = document.querySelector('.header-actions .btn-secondary');
    if (loginHeaderBtn) {
      loginHeaderBtn.href = 'my-courses.html';
      loginHeaderBtn.textContent = 'Vào học';
    }
    const heroBtn = document.querySelector('.hero-actions .btn-red');
    if (heroBtn) {
      heroBtn.href = 'my-courses.html';
    }
    const mobileLoginBtn = document.querySelector('.mobile-nav-panel .mobile-nav-link[href="login.html"]');
    if (mobileLoginBtn) {
      mobileLoginBtn.href = 'my-courses.html';
      mobileLoginBtn.textContent = 'Khóa học của tôi';
    }
  }

  // 2. Update Sidebar User profile
  const nameEl = document.querySelector('.sidebar-user-name');
  const roleEl = document.querySelector('.sidebar-user-role');
  const avatarEl = document.querySelector('.sidebar-avatar');

  if (nameEl) {
    nameEl.textContent = user.name;
  }
  if (roleEl) {
    roleEl.textContent = user.role === 'teacher' ? 'Giảng viên · VinUni' : 'Sinh viên · VinUni';
  }
  if (avatarEl) {
    const parts = user.name.split(' ');
    let initials = '';
    if (parts.length >= 2) {
      initials = parts[parts.length - 2][0] + parts[parts.length - 1][0];
    } else if (parts.length === 1) {
      initials = parts[0].substring(0, 2);
    } else {
      initials = 'SV';
    }
    avatarEl.textContent = initials.toUpperCase();
  }

  // 3. Bind Logout Button clicks
  const logoutBtns = document.querySelectorAll('.sidebar-logout');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      logoutUser();
    });
  });

  // 4. Update greeting name on dashboard.html
  const isDashboardPage = path.includes('dashboard.html');
  if (isDashboardPage) {
    const greetingNameEl = document.querySelector('.name-highlight');
    if (greetingNameEl) {
      greetingNameEl.textContent = user.name.toUpperCase() + '!';
    }
  }
});

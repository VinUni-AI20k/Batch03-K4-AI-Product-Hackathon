// --- Dark Mode ---
(function() {
  const saved = localStorage.getItem('vlearn_app_theme');
  if (saved === 'dark') {
    document.documentElement.classList.add('dark');
  }
})();

const themeBtn = document.getElementById('login-theme-toggle');
if (themeBtn) {
  themeBtn.addEventListener('click', function() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('vlearn_app_theme', isDark ? 'dark' : 'light');
    const moon = themeBtn.querySelector('.icon-moon');
    const sun = themeBtn.querySelector('.icon-sun');
    if (moon && sun) {
      moon.style.display = isDark ? 'none' : 'block';
      sun.style.display = isDark ? 'block' : 'none';
    }
  });
  // Sync icon on load
  if (document.documentElement.classList.contains('dark')) {
    const moon = themeBtn.querySelector('.icon-moon');
    const sun = themeBtn.querySelector('.icon-sun');
    if (moon && sun) {
      moon.style.display = 'none';
      sun.style.display = 'block';
    }
  }
}

// --- Password Toggle ---
const pwToggle = document.getElementById('password-toggle');
const pwInput = document.getElementById('password');
if (pwToggle && pwInput) {
  pwToggle.addEventListener('click', function() {
    const isPassword = pwInput.type === 'password';
    pwInput.type = isPassword ? 'text' : 'password';
    const eyeIcon = pwToggle.querySelector('.icon-eye');
    const eyeOffIcon = pwToggle.querySelector('.icon-eye-off');
    if (eyeIcon && eyeOffIcon) {
      eyeIcon.style.display = isPassword ? 'none' : 'block';
      eyeOffIcon.style.display = isPassword ? 'block' : 'none';
    }
  });
}

// --- Form Submit (Redirect to My Courses) ---
const form = document.getElementById('login-form');
const errorDiv = document.getElementById('login-error');
const loginBtn = document.getElementById('login-btn');

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading state and redirect to my-courses.html
    if (errorDiv) errorDiv.classList.remove('visible');
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;

    setTimeout(function() {
      window.location.href = 'my-courses.html';
    }, 800);
  });
}

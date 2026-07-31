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

// --- Form Submit (Authenticate with Backend) ---
const form = document.getElementById('login-form');
const errorDiv = document.getElementById('login-error');
const loginBtn = document.getElementById('login-btn');

function showLoginError(text) {
  if (errorDiv) {
    const errorText = errorDiv.querySelector('#error-text');
    if (errorText) errorText.textContent = text;
    errorDiv.classList.add('visible');
  }
}

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showLoginError("Vui lòng nhập đầy đủ Email và Mật khẩu.");
      return;
    }

    if (errorDiv) errorDiv.classList.remove('visible');
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;

    const apiBase = window.location.origin.includes('localhost:8080') ? '' : 'http://localhost:8080';
    fetch(`${apiBase}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email, password: password })
    })
    .then(async res => {
      let data = {};
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        if (!res.ok) {
          throw new Error(`Đăng nhập thất bại (HTTP ${res.status}): Python Backend chưa chạy hoặc trả về trang lỗi.`);
        }
      }
      if (!res.ok) {
        throw new Error(data.detail || "Đăng nhập thất bại");
      }
      return data;
    })
    .then(data => {
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      setTimeout(function() {
        window.location.href = 'my-courses.html';
      }, 500);
    })
    .catch(err => {
      loginBtn.classList.remove('loading');
      loginBtn.disabled = false;
      showLoginError(err.message);
    });
  });
}

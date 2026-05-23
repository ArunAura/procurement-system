// Login page integration

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form') || document.querySelector('form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Find fields
      const emailInput = document.getElementById('email') || loginForm.querySelector('input[type="email"]');
      const passwordInput = document.getElementById('password') || loginForm.querySelector('input[type="password"]');

      if (!emailInput || !passwordInput) {
        showToast('Form inputs could not be found!', 'error');
        return;
      }

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!email || !password) {
        showToast('Please enter both email and password.', 'error');
        return;
      }

      // Add loading state
      const loginBtn = loginForm.querySelector('button');
      const originalBtnText = loginBtn ? loginBtn.innerText : 'Login';
      if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.innerText = 'Signing in...';
      }

      try {
        const response = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showToast('Login successful! Redirecting...', 'success');
          
          // Save credentials in localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          // Redirect to dashboard
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 1000);
        } else {
          showToast(data.message || 'Invalid email or password.', 'error');
          if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.innerText = originalBtnText;
          }
        }
      } catch (error) {
        console.error('Login error:', error);
        showToast('Server connection error. Please make sure backend is running.', 'error');
        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.innerText = originalBtnText;
        }
      }
    });
  }
});

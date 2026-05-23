// Common JS helper for frontend integration

// Define base URL for api requests.
// Since we are serving the frontend statically from the backend, relative paths work perfectly.
const API_BASE = '/api';

// Simple authentication check
function checkAuth() {
  const token = localStorage.getItem('token');
  const currentPage = window.location.pathname.split('/').pop();

  // If not logged in and not on login page, redirect to login
  if (!token && currentPage !== 'login.html') {
    window.location.href = 'login.html';
  }

  // If already logged in and on login page, redirect to dashboard
  if (token && currentPage === 'login.html') {
    window.location.href = 'dashboard.html';
  }
}

// Log out the current user
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// Function to display alert messages dynamically (success or error)
function showToast(message, type = 'success') {
  // Check if a toast container already exists
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    // Style the toast container
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }

  // Create individual toast element
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerText = message;

  // Style individual toast
  toast.style.padding = '12px 24px';
  toast.style.marginBottom = '10px';
  toast.style.borderRadius = '6px';
  toast.style.color = '#ffffff';
  toast.style.fontWeight = '500';
  toast.style.fontSize = '14px';
  toast.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  toast.style.backgroundColor = type === 'success' ? '#2f855a' : '#c53030';
  toast.style.transition = 'all 0.3s ease';
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(-20px)';

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);

  // Auto remove toast after 4 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// Run auth check immediately on script load
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();

  // Wire up logout button in profile/sidebar if present
  const profileDiv = document.querySelector('.profile');
  if (profileDiv) {
    profileDiv.style.cursor = 'pointer';
    profileDiv.title = 'Click to Logout';
    profileDiv.addEventListener('click', () => {
      if (confirm('Are you sure you want to log out?')) {
        logout();
      }
    });
  }
});

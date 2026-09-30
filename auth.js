window.AuthApp = window.AuthApp || {};
window.AuthApp.authService = {
  /**
   * Mock login request handler
   * @param {Object} payload - { email, password, rememberMe, timestamp }
   * @returns {Promise<Object>}
   */
  async login(payload) {
    console.log('%c[Auth Payload - LOGIN]', 'color: #6366f1; font-weight: bold; font-size: 13px;', payload);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          success: true,
          message: 'Authentication successful. Mock token generated.',
          token: 'mock-jwt-token-xyz123',
          user: { email: payload.email }
        });
      }, 300);
    });
  },

  /**
   * Mock registration request handler
   * @param {Object} payload - { fullName, email, password, agreedToTerms, timestamp }
   * @returns {Promise<Object>}
   */
  async register(payload) {
    console.log('%c[Auth Payload - REGISTER]', 'color: #06b6d4; font-weight: bold; font-size: 13px;', payload);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 201,
          success: true,
          message: 'Account created successfully.',
          userId: 'usr_' + Math.random().toString(36).substr(2, 9),
          user: { name: payload.fullName, email: payload.email }
        });
      }, 300);
    });
  }
};
window.AuthApp.validators = {
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },

  isValidPassword(password) {
    return typeof password === 'string' && password.trim().length >= 6;
  },

  isValidName(name) {
    return typeof name === 'string' && name.trim().length >= 2;
  }
};

window.AuthApp.ui = {
  showError(inputElement, message) {
    if (!inputElement) return;
    const group = inputElement.closest('.form-group');
    if (!group) return;

    inputElement.classList.add('is-invalid');
    inputElement.classList.remove('is-valid');

    let errorSpan = group.querySelector('.error-message');
    if (!errorSpan) {
      errorSpan = document.createElement('span');
      errorSpan.className = 'error-message';
      group.appendChild(errorSpan);
    }
    errorSpan.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> ${message}`;
    group.classList.add('has-error');
  },
  clearError(inputElement) {
    if (!inputElement) return;
    const group = inputElement.closest('.form-group');
    if (!group) return;

    inputElement.classList.remove('is-invalid');
    inputElement.classList.add('is-valid');
    group.classList.remove('has-error');
  },
  resetValidation(formElement) {
    if (!formElement) return;
    const inputs = formElement.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.classList.remove('is-invalid', 'is-valid');
      const group = input.closest('.form-group');
      if (group) group.classList.remove('has-error');
    });
  },

  showToast(title, message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconSvg = type === 'success'
      ? '<svg class="toast-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
      : '<svg class="toast-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

    toast.innerHTML = `
      ${iconSvg}
      <div>
        <div class="toast-title">${title}</div>
        <div class="toast-desc">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const { validators, ui, authService } = window.AuthApp;

  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isExpanded = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });
  }

  const toggleButtons = document.querySelectorAll('.toggle-password');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
      } else {
        input.type = 'password';
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
      }
    });
  });
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('loginEmail');
      const passwordInput = document.getElementById('loginPassword');
      const rememberCheckbox = document.getElementById('rememberMe');

      let isValid = true;

      if (!validators.isValidEmail(emailInput.value)) {
        ui.showError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      } else {
        ui.clearError(emailInput);
      }

      if (!validators.isValidPassword(passwordInput.value)) {
        ui.showError(passwordInput, 'Password must be at least 6 characters.');
        isValid = false;
      } else {
        ui.clearError(passwordInput);
      }

      if (!isValid) return;

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Authenticating...</span>`;

      const payload = {
        email: emailInput.value.trim(),
        password: passwordInput.value,
        rememberMe: rememberCheckbox ? rememberCheckbox.checked : false,
        submittedAt: new Date().toISOString()
      };

      try {
        // Execute Mock Service (Logs payload & returns mock response)
        const response = await authService.login(payload);

        // Feedback Notification
        ui.showToast('Login Successful!', 'Payload logged to browser console. Form submission prevented.', 'success');

        console.log('%c[Form Submission Verified]', 'background: #10b981; color: #fff; padding: 4px 8px; border-radius: 4px; font-weight: bold;', response);
      } catch (err) {
        ui.showToast('Authentication Error', err.message || 'Something went wrong.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });

    // Real-time error clearing on input change
    loginForm.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          ui.clearError(input);
        }
      });
    });
  }

  // ==========================================
  // Register Form Submission Logic
  // ==========================================
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      // 1. Prevent default form action (no page reload)
      e.preventDefault();

      const nameInput = document.getElementById('registerName');
      const emailInput = document.getElementById('registerEmail');
      const passwordInput = document.getElementById('registerPassword');
      const confirmPasswordInput = document.getElementById('confirmPassword');
      const termsCheckbox = document.getElementById('agreeTerms');

      let isValid = true;

      // Validate Name
      if (!validators.isValidName(nameInput.value)) {
        ui.showError(nameInput, 'Full name must be at least 2 characters long.');
        isValid = false;
      } else {
        ui.clearError(nameInput);
      }

      // Validate Email
      if (!validators.isValidEmail(emailInput.value)) {
        ui.showError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      } else {
        ui.clearError(emailInput);
      }

      // Validate Password
      if (!validators.isValidPassword(passwordInput.value)) {
        ui.showError(passwordInput, 'Password must be at least 6 characters.');
        isValid = false;
      } else {
        ui.clearError(passwordInput);
      }

      // Validate Confirm Password
      if (confirmPasswordInput.value !== passwordInput.value || !confirmPasswordInput.value) {
        ui.showError(confirmPasswordInput, 'Passwords do not match.');
        isValid = false;
      } else {
        ui.clearError(confirmPasswordInput);
      }

      // Validate Terms Checkbox
      if (termsCheckbox && !termsCheckbox.checked) {
        ui.showError(termsCheckbox, 'You must accept the Terms and Conditions.');
        isValid = false;
      } else if (termsCheckbox) {
        ui.clearError(termsCheckbox);
      }

      if (!isValid) return;

      // Disable submit button temporarily
      const submitBtn = registerForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Creating Account...</span>`;

      // Construct Mock Payload
      const payload = {
        fullName: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
        agreedToTerms: termsCheckbox ? termsCheckbox.checked : true,
        submittedAt: new Date().toISOString()
      };

      try {
        // Execute Mock Service (Logs payload & returns mock response)
        const response = await authService.register(payload);

        ui.showToast('Registration Successful!', 'Account creation payload logged to console.', 'success');

        console.log('%c[Registration Verified]', 'background: #06b6d4; color: #fff; padding: 4px 8px; border-radius: 4px; font-weight: bold;', response);
      } catch (err) {
        ui.showToast('Registration Error', err.message || 'Unable to register.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });

    registerForm.querySelectorAll('.form-control, input[type="checkbox"]').forEach(input => {
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          ui.clearError(input);
        }
      });
    });
  }
});

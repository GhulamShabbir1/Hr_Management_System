<template>
  <div class="register-container">
    <div class="register-card">
      <div class="card-header">
        <div class="logo-wrapper">
          <div class="logo-icon">
            <i class="fas fa-user-plus" aria-hidden="true"></i>
          </div>
          <h1 class="logo-title">Join HRMS</h1>
          <p class="logo-subtitle">Create your employee account</p>
        </div>
      </div>
      
      <div class="card-body">
        <form @submit.prevent="handleRegister" class="register-form" novalidate>
          <div class="form-group">
            <label for="name" class="form-label">Full Name</label>
            <div class="input-group">
              <span class="input-icon">
                <i class="fas fa-user" aria-hidden="true"></i>
              </span>
              <input
                v-model="form.name"
                type="text"
                id="name"
                class="form-control"
                placeholder="Your full name"
                required
                @focus="resetError('name')"
                aria-describedby="nameHelp"
              />
            </div>
            <small id="nameHelp" class="form-text">As it appears on official documents</small>
            <p v-if="errors.name" class="error-text" role="alert">
              <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
              {{ errors.name }}
            </p>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Work Email</label>
            <div class="input-group">
              <span class="input-icon">
                <i class="fas fa-envelope" aria-hidden="true"></i>
              </span>
              <input
                v-model="form.email"
                type="email"
                id="email"
                class="form-control"
                placeholder="you@company.com"
                required
                @focus="resetError('email')"
                aria-describedby="emailHelp"
              />
            </div>
            <small id="emailHelp" class="form-text">Use your company email address</small>
            <p v-if="errors.email" class="error-text" role="alert">
              <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
              {{ errors.email }}
            </p>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <div class="input-group">
              <span class="input-icon">
                <i class="fas fa-lock" aria-hidden="true"></i>
              </span>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                class="form-control"
                placeholder="Create password"
                required
                @focus="resetError('password')"
                aria-describedby="passwordHelp"
              />
              <button 
                type="button" 
                class="password-toggle"
                @click="togglePasswordVisibility"
                aria-label="Toggle password visibility"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" aria-hidden="true"></i>
              </button>
            </div>
            <small id="passwordHelp" class="form-text">Minimum 8 characters with numbers</small>
            <div class="password-strength" :class="passwordStrengthClass">
              Password strength: {{ passwordStrength }}
            </div>
            <p v-if="errors.password" class="error-text" role="alert">
              <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
              {{ errors.password }}
            </p>
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <div class="input-group">
              <span class="input-icon">
                <i class="fas fa-lock" aria-hidden="true"></i>
              </span>
              <input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                class="form-control"
                placeholder="Re-enter password"
                required
                @focus="resetError('confirmPassword')"
              />
              <button 
                type="button" 
                class="password-toggle"
                @click="toggleConfirmPasswordVisibility"
                aria-label="Toggle password visibility"
              >
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" aria-hidden="true"></i>
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="error-text" role="alert">
              <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
              {{ errors.confirmPassword }}
            </p>
          </div>

          <div class="form-group">
            <label for="employeeId" class="form-label">Employee ID (Optional)</label>
            <div class="input-group">
              <span class="input-icon">
                <i class="fas fa-id-card" aria-hidden="true"></i>
              </span>
              <input
                v-model="form.employeeId"
                type="text"
                id="employeeId"
                class="form-control"
                placeholder="Company employee ID"
                @focus="resetError('employeeId')"
              />
            </div>
            <small class="form-text">If provided by your HR department</small>
          </div>

          <div class="form-check">
            <input 
              type="checkbox" 
              id="termsAgreement" 
              v-model="form.termsAgreed"
              class="form-check-input"
              required
            >
            <label for="termsAgreement" class="form-check-label">
              I agree to the <a href="#" @click.prevent="showTermsModal">Terms of Service</a> and 
              <a href="#" @click.prevent="showPrivacyModal">Privacy Policy</a>
            </label>
            <p v-if="errors.termsAgreed" class="error-text" role="alert">
              <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
              {{ errors.termsAgreed }}
            </p>
          </div>

          <button
            type="submit"
            class="register-btn"
            :disabled="isSubmitting"
            aria-live="polite"
          >
            <span v-if="isSubmitting">
              <span class="spinner" aria-hidden="true"></span>
              <span class="sr-only">Processing registration...</span>
              Creating Account...
            </span>
            <span v-else>
              <i class="fas fa-user-plus" aria-hidden="true"></i>
              Register Account
            </span>
          </button>

          <div class="divider">
            <span>or</span>
          </div>

          <div class="social-login">
            <button 
              type="button" 
              class="social-btn google"
              @click="socialLogin('google')"
              aria-label="Register with Google"
            >
              <i class="fab fa-google" aria-hidden="true"></i>
              Continue with Google
            </button>
            <button 
              type="button" 
              class="social-btn microsoft"
              @click="socialLogin('microsoft')"
              aria-label="Register with Microsoft"
            >
              <i class="fab fa-microsoft" aria-hidden="true"></i>
              Continue with Microsoft
            </button>
          </div>

          <div class="login-link">
            Already registered? <router-link to="/login">Sign in here</router-link>
          </div>
        </form>
      </div>
    </div>

    <!-- Terms Modal -->
    <div class="modal fade" id="termsModal" tabindex="-1" aria-labelledby="termsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="termsModalLabel" class="modal-title h5">Terms of Service</h2>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Terms content would go here -->
            <p>This HR Management System is provided for authorized company use only...</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">I Understand</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Privacy Modal -->
    <div class="modal fade" id="privacyModal" tabindex="-1" aria-labelledby="privacyModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="privacyModalLabel" class="modal-title h5">Privacy Policy</h2>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Privacy policy content would go here -->
            <p>We respect your privacy and are committed to protecting your personal data...</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">I Understand</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';

export default {
  name: "AppRegister",
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        employeeId: "",
        termsAgreed: false
      },
      errors: {},
      isSubmitting: false,
      showPassword: false,
      showConfirmPassword: false,
      termsModal: null,
      privacyModal: null
    };
  },
  computed: {
    passwordStrength() {
      if (!this.form.password) return 'None';
      if (this.form.password.length < 6) return 'Weak';
      if (this.form.password.length < 10) return 'Medium';
      if (/[A-Z]/.test(this.form.password) && /[0-9]/.test(this.form.password) && /[^A-Za-z0-9]/.test(this.form.password)) {
        return 'Strong';
      }
      return 'Good';
    },
    passwordStrengthClass() {
      return {
        'strength-weak': this.passwordStrength === 'Weak',
        'strength-medium': this.passwordStrength === 'Medium',
        'strength-good': this.passwordStrength === 'Good',
        'strength-strong': this.passwordStrength === 'Strong'
      };
    }
  },
  methods: {
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    resetError(field) {
      if (this.errors[field]) {
        this.errors = {...this.errors, [field]: null};
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    showTermsModal() {
      this.termsModal.show();
    },
    showPrivacyModal() {
      this.privacyModal.show();
    },
    validateForm() {
      this.errors = {};

      if (!this.form.name.trim()) {
        this.errors.name = "Full name is required";
      } else if (this.form.name.trim().length < 2) {
        this.errors.name = "Name must be at least 2 characters";
      }

      if (!this.form.email.trim()) {
        this.errors.email = "Email is required";
      } else if (!this.validateEmail(this.form.email)) {
        this.errors.email = "Please enter a valid email address";
      }

      if (!this.form.password) {
        this.errors.password = "Password is required";
      } else if (this.form.password.length < 8) {
        this.errors.password = "Password must be at least 8 characters";
      } else if (!/[0-9]/.test(this.form.password)) {
        this.errors.password = "Password must contain at least one number";
      }

      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = "Please confirm your password";
      } else if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = "Passwords do not match";
      }

      if (!this.form.termsAgreed) {
        this.errors.termsAgreed = "You must agree to the terms and privacy policy";
      }

      return Object.keys(this.errors).length === 0;
    },
    async handleRegister() {
      if (this.validateForm()) {
        this.isSubmitting = true;
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          this.$notify({
            type: 'success',
            title: 'Registration Successful',
            text: 'Your account has been created! Please check your email to verify your account.'
          });
          
          this.$router.push("/login");
        } catch (error) {
          this.$notify({
            type: 'error',
            title: 'Registration Failed',
            text: error.message || 'An error occurred during registration'
          });
        } finally {
          this.isSubmitting = false;
        }
      }
    },
    socialLogin(provider) {
      console.log(`Social login with ${provider}`);
      // In a real app, this would trigger OAuth flow
    }
  },
  mounted() {
    this.termsModal = new Modal(document.getElementById('termsModal'));
    this.privacyModal = new Modal(document.getElementById('privacyModal'));
  }
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  position: relative;
}

.register-card {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transform: translateY(0);
  transition: all 0.3s ease;
  z-index: 1;
}

.register-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.card-header {
  background: linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%);
  color: white;
  padding: 2.5rem 2rem;
  text-align: center;
}

.logo-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.logo-icon i {
  font-size: 1.8rem;
}

.logo-title {
  margin: 0;
  font-weight: 600;
  font-size: 1.8rem;
}

.logo-subtitle {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  opacity: 0.9;
  font-weight: 300;
}

.card-body {
  padding: 2.5rem 2rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.95rem;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #6c757d;
  font-size: 1rem;
}

.form-control {
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 1rem;
  width: 100%;
}

.form-control:focus {
  border-color: #4ca1af;
  box-shadow: 0 0 0 3px rgba(76, 161, 175, 0.2);
  outline: none;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 1rem;
}

.password-toggle:hover {
  color: #2c3e50;
}

.form-text {
  font-size: 0.8rem;
  color: #6c757d;
}

.password-strength {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-top: 0.25rem;
  text-align: center;
}

.strength-weak {
  background-color: #ffe3e3;
  color: #c92a2a;
}

.strength-medium {
  background-color: #fff3bf;
  color: #e67700;
}

.strength-good {
  background-color: #d3f9d8;
  color: #2b8a3e;
}

.strength-strong {
  background-color: #d0ebff;
  color: #1864ab;
}

.error-text {
  color: #ff4757;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

.form-check {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 1rem 0;
}

.form-check-input {
  margin-top: 0.2rem;
}

.form-check-label {
  font-size: 0.9rem;
  color: #495057;
  cursor: pointer;
}

.form-check-label a {
  color: #4ca1af;
  text-decoration: none;
}

.form-check-label a:hover {
  text-decoration: underline;
}

.register-btn {
  background: linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.register-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #4ca1af 0%, #2c3e50 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.divider {
  display: flex;
  align-items: center;
  color: #6c757d;
  font-size: 0.9rem;
  margin: 1rem 0;
  text-align: center;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.divider::before {
  margin-right: 1rem;
}

.divider::after {
  margin-left: 1rem;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #ddd;
  background: white;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.social-btn.google {
  color: #DB4437;
  border-color: #DB4437;
}

.social-btn.microsoft {
  color: #00A4EF;
  border-color: #00A4EF;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #495057;
}

.login-link a {
  color: #4ca1af;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .register-container {
    padding: 1rem;
  }
  
  .card-header {
    padding: 1.5rem 1rem;
  }
  
  .card-body {
    padding: 1.5rem 1rem;
  }
  
  .logo-title {
    font-size: 1.5rem;
  }
  
  .logo-subtitle {
    font-size: 0.8rem;
  }
  
  .social-btn {
    font-size: 0.85rem;
  }
}
</style>
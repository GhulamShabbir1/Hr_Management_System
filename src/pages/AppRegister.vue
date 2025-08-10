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
          <!-- Full Name -->
          <div class="form-group">
            <label for="name" class="form-label">Full Name</label>
            <div class="input-group">
              <span class="input-icon">
                <i class="fas fa-user" aria-hidden="true"></i>
              </span>
              <input v-model="form.name" type="text" id="name" class="form-control" placeholder="Your full name"
                required @focus="resetError('name')" aria-describedby="nameHelp" />
            </div>
            <small id="nameHelp" class="form-text">As it appears on official documents</small>
            <p v-if="errors.name" class="error-text" role="alert">
              <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
              {{ errors.name }}
            </p>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="email" class="form-label">Work Email</label>
            <div class="input-group">
              <span class="input-icon">
                <i class="fas fa-envelope" aria-hidden="true"></i>
              </span>
              <input v-model="form.email" type="email" id="email" class="form-control" placeholder="you@company.com"
                required @focus="resetError('email')" aria-describedby="emailHelp" />
            </div>
            <small id="emailHelp" class="form-text">Use your company email address</small>
            <p v-if="errors.email" class="error-text" role="alert">
              <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
              {{ errors.email }}
            </p>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <div class="input-group">
              <span class="input-icon">
                <i class="fas fa-lock" aria-hidden="true"></i>
              </span>
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'" id="password"
                class="form-control" placeholder="Create password" required @focus="resetError('password')"
                aria-describedby="passwordHelp" />
              <button type="button" class="password-toggle" @click="togglePasswordVisibility"
                aria-label="Toggle password visibility">
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

          <!-- Confirm Password -->
          <!-- <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <div class="input-group">
              <span class="input-icon">
                <i class="fas fa-lock" aria-hidden="true"></i>
              </span>
              <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword" class="form-control" placeholder="Re-enter password" 
                @focus="resetError('confirmPassword')" />
              <button type="button" class="password-toggle" @click="toggleConfirmPasswordVisibility"
                aria-label="Toggle password visibility">
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" aria-hidden="true"></i>
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="error-text" role="alert">
              <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
              {{ errors.confirmPassword }}
            </p>
          </div> -->

          <!-- Phone Number -->
          <div class="form-group">
            <label for="phoneNo" class="form-label">Employee Phone No (Optional)</label>
            <div class="input-group">
              <span class="input-icon">
                <i class="fas fa-id-card" aria-hidden="true"></i>
              </span>
              <input v-model="form.phoneNo" type="tel" id="phoneNo" class="form-control"
                placeholder="Company employee phone number" @focus="resetError('phoneNo')" />
            </div>
            <small class="form-text">If provided by your HR department</small>
          </div>

          <!-- Profile URL -->
          <div class="form-group">
            <label for="profileUrl" class="form-label">Profile URL (Optional)</label>
            <div class="input-group">
              <span class="input-icon">
                <i class="fas fa-link" aria-hidden="true"></i>
              </span>
              <input v-model="form.profileUrl" type="url" id="profileUrl" class="form-control"
                placeholder="https://example.com/profile" @focus="resetError('profileUrl')" />
            </div>
            <small class="form-text">Link to your professional profile (LinkedIn, portfolio, etc.)</small>
            <p v-if="errors.profileUrl" class="error-text" role="alert">
              <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
              {{ errors.profileUrl }}
            </p>
          </div>

          <!-- Role -->
          <div class="form-group">
            <label for="role" class="form-label">Role</label>
            <div class="input-group">
              <span class="input-icon">
                <i class="fas fa-user" aria-hidden="true"></i>
              </span>
              <select v-model="form.role" id="role" class="form-control" required @focus="resetError('role')">
                <option value="" disabled selected>Select your role</option>
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
                <option value="HR">HR</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <p v-if="errors.role" class="error-text" role="alert">
              <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
              {{ errors.role }}
            </p>
          </div>

          <!-- Terms -->
          <div class="form-check">
            <input type="checkbox" id="termsAgreement" v-model="form.termsAgreed" class="form-check-input" required>
            <label for="termsAgreement" class="form-check-label">
              I agree to the <a href="#" @click.prevent="showTermsModal">Terms of Service</a> and
              <a href="#" @click.prevent="showPrivacyModal">Privacy Policy</a>
            </label>
            <p v-if="errors.termsAgreed" class="error-text" role="alert">
              <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
              {{ errors.termsAgreed }}
            </p>
          </div>

          <!-- Submit -->
          <button type="submit" class="register-btn" :disabled="isSubmitting" aria-live="polite">
            <span v-if="isSubmitting">
              <span class="spinner" aria-hidden="true"></span>
              Creating Account...
            </span>
            <span v-else>
              <i class="fas fa-user-plus" aria-hidden="true"></i>
              Register Account
            </span>
          </button>
         
          <div class="divider"><span>or</span></div>

          <!-- Social Login -->
          <div class="social-login">
            <button type="button" class="social-btn google" @click="socialLogin('google')">
              <i class="fab fa-google" aria-hidden="true"></i>
              Continue with Google
            </button>
            <button type="button" class="social-btn microsoft" @click="socialLogin('microsoft')">
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
    <div class="modal fade" id="termsModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title h5">Terms of Service</h2>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>This HR Management System is provided for authorized company use only...</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">I Understand</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Privacy Modal -->
    <div class="modal fade" id="privacyModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title h5">Privacy Policy</h2>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
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
import { mapActions } from 'vuex';

export default {
  name: "AppRegister",
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        phoneNo: "",
        profileUrl: "",
        role: "",
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
    ...mapActions('auth', ['register']),
    
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    validateUrl(url) {
      if (!url) return true; // Optional field
      try {
        new URL(url);
        return true;
      } catch (e) {
        return false;
      }
    },
    resetError(field) {
      if (this.errors[field]) {
        this.errors = { ...this.errors, [field]: null };
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

      // Commented out confirm password validation since the field is commented out
      // if (!this.form.confirmPassword) {
      //   this.errors.confirmPassword = "Please confirm your password";
      // } else if (this.form.password !== this.form.confirmPassword) {
      //   this.errors.confirmPassword = "Passwords do not match";
      // }

      if (this.form.profileUrl && !this.validateUrl(this.form.profileUrl)) {
        this.errors.profileUrl = "Please enter a valid URL (e.g., https://example.com)";
      }

      if (!this.form.role) {
        this.errors.role = "Role is required";
      }

      if (!this.form.termsAgreed) {
        this.errors.termsAgreed = "You must agree to the terms and privacy policy";
      }

      return Object.keys(this.errors).length === 0;
    },
    async handleRegister() {
      console.log('handleRegister called');
      console.log('Form data:', this.form);
      
      if (!this.validateForm()) {
        console.log('Form validation failed');
        console.log('Errors:', this.errors);
        return;
      }

      console.log('Form validation passed');
      this.isSubmitting = true;
      
      try {
        const registrationData = {
          name: this.form.name,
          email: this.form.email,
          password: this.form.password,
          phone: this.form.phoneNo,
          profileUrl: this.form.profileUrl,
          role: this.form.role
        };

        console.log('Registration data:', registrationData);
        console.log('Calling register action...');
        
        const result = await this.register(registrationData);
        console.log('Register result:', result);
        
        if (result.success) {
          // Show success message and redirect
          this.$notify({
            type: 'success',
            title: 'Success',
            text: 'Registration successful! Please login with your credentials.'
          });
          
          // Clear any existing auth data to ensure clean login flow
          this.$store.commit('auth/LOGOUT');
          
          // Navigate to login page with success indicator
          this.$router.push('/login?from=register');
        } else {
          this.$notify({
            type: 'error',
            title: 'Registration Failed',
            text: result.message || 'Registration failed. Please try again.'
          });
        }
        
      } catch (error) {
        console.error("Registration error:", error);
        
        let errorMessage = "Registration failed. Please try again.";
        if (error.response) {
          if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.status === 409) {
            errorMessage = "Email already registered";
          }
        }
        
        this.$notify({
          type: 'error',
          title: 'Registration Failed',
          text: errorMessage
        });
        
      } finally {
        this.isSubmitting = false;
      }
    },
    socialLogin(provider) {
      console.log(`Social login with ${provider}`);
      // In a real app, trigger OAuth flow
      this.$toast.info(`${provider} login would be implemented in production`);
    }
  },
  mounted() {
    this.termsModal = new Modal(document.getElementById('termsModal'));
    this.privacyModal = new Modal(document.getElementById('privacyModal'));
  }
};
</script>

<style scoped>
/* Basic container */
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
  padding: 2rem;
}

/* Card */
.register-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 500px;
  overflow: hidden;
}

/* Header */
.card-header {
  text-align: center;
  padding: 2rem 1rem;
  border-bottom: 1px solid #eaeaea;
}

.logo-icon {
  font-size: 3rem;
  color: #4a90e2;
}

.logo-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-top: 1rem;
}

.logo-subtitle {
  color: #777;
  font-size: 0.9rem;
}

/* Body */
.card-body {
  padding: 2rem;
}

/* Form */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
}

.input-group {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem;
}

.input-icon {
  margin-right: 0.5rem;
  color: #777;
}

.form-control {
  border: none;
  flex: 1;
  outline: none;
  font-size: 1rem;
}

select.form-control {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1em;
}

.password-toggle {
  background: transparent;
  border: none;
  color: #777;
  cursor: pointer;
}

/* Password strength */
.password-strength {
  margin-top: 0.4rem;
  font-size: 0.85rem;
}

.strength-weak {
  color: #e53935;
}

.strength-medium {
  color: #fb8c00;
}

.strength-good {
  color: #039be5;
}

.strength-strong {
  color: #43a047;
}

/* Errors */
.error-text {
  color: #e53935;
  font-size: 0.85rem;
  margin-top: 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

/* Terms */
.form-check {
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
}

.form-check-input {
  margin-right: 0.5rem;
}

.form-check-label {
  font-size: 0.9rem;
}

.form-check-label a {
  color: #4a90e2;
  text-decoration: none;
}

.form-check-label a:hover {
  text-decoration: underline;
}

/* Submit */
.register-btn {
  width: 100%;
  padding: 0.75rem;
  background: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.register-btn:hover {
  background: #357ab8;
  transform: translateY(-1px);
}

.register-btn:active {
  transform: translateY(0);
}

.register-btn:disabled {
  background: #b0bec5;
  cursor: not-allowed;
  transform: none;
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Divider */
.divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
  color: #777;
  font-size: 0.9rem;
}

.divider span {
  background: #fff;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background: #ddd;
  z-index: 0;
}

/* Social buttons */
.social-login {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.social-btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: opacity 0.3s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.social-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.social-btn:active {
  transform: translateY(0);
}

.social-btn.google {
  background: #db4437;
  color: #fff;
}

.social-btn.microsoft {
  background: #2f2f2f;
  color: #fff;
}

/* Login link */
.login-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #555;
}

.login-link a {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

/* URL input specific styles */
.input-icon.fa-link {
  color: #4a90e2;
}

/* Phone number input */
input[type="tel"] {
  padding: 0.5rem;
}
</style>
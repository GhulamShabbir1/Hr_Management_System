<template>
  <div class="login-container">
    <div class="login-card">
      <div class="card-header">
        <div class="logo-wrapper">
          <div class="logo-icon">
            <i class="fas fa-user-shield" aria-hidden="true"></i>
          </div>
          <h1 class="logo-title">HRMS Portal</h1>
          <p class="logo-subtitle">Human Resource Management System</p>
        </div>
      </div>
      
      <div class="card-body">
        <form @submit.prevent="handleLogin" class="login-form" novalidate>
          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <div class="input-group">
              <span class="input-icon">
                <i class="fas fa-envelope" aria-hidden="true"></i>
              </span>
              <input
                v-model="email"
                type="email"
                id="email"
                class="form-control"
                placeholder="Enter your email"
                required
                @focus="resetError"
                aria-describedby="emailHelp"
              />
            </div>
            <small id="emailHelp" class="form-text">Enter your company email address</small>
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <div class="input-group">
              <span class="input-icon">
                <i class="fas fa-lock" aria-hidden="true"></i>
              </span>
              <input
                v-model="password"
                type="password"
                id="password"
                class="form-control"
                placeholder="Enter your password"
                required
                @focus="resetError"
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
            <small id="passwordHelp" class="form-text">Minimum 8 characters</small>
          </div>
          
          <div class="form-options">
            <div class="form-check">
              <input 
                type="checkbox" 
                id="rememberMe" 
                v-model="rememberMe"
                class="form-check-input"
              >
              <label for="rememberMe" class="form-check-label">Remember me</label>
            </div>
            <router-link to="/forgot-password" class="forgot-password">
              Forgot password?
            </router-link>
          </div>
          
          <div v-if="error" class="error-message" role="alert">
            <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
            <span>{{ error }}</span>
          </div>
          
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="login-btn"
            aria-live="polite"
          >
            <span v-if="isLoading">
              <span class="spinner" aria-hidden="true"></span>
              <span class="sr-only">Loading...</span>
              Authenticating...
            </span>
            <span v-else>
              <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
              Login
            </span>
          </button>
          
          <div class="social-login">
            <p class="divider">or continue with</p>
            <div class="social-buttons">
              <button 
                type="button" 
                class="social-btn google"
                @click="socialLogin('google')"
                aria-label="Login with Google"
              >
                <i class="fab fa-google" aria-hidden="true"></i>
              </button>
              <button 
                type="button" 
                class="social-btn microsoft"
                @click="socialLogin('microsoft')"
                aria-label="Login with Microsoft"
              >
                <i class="fab fa-microsoft" aria-hidden="true"></i>
              </button>
              <button 
                type="button" 
                class="social-btn github"
                @click="socialLogin('github')"
                aria-label="Login with GitHub"
              >
                <i class="fab fa-github" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          
          <div class="register-link">
            Don't have an account? <router-link to="/register">Request access</router-link>
          </div>
        </form>
      </div>
    </div>
    
    <div class="demo-credentials-container">
      <button 
        class="demo-toggle"
        @click="toggleDemoCredentials"
        aria-expanded="showDemoCredentials"
        :aria-controls="'demo-credentials'"
      >
        <i class="fas fa-info-circle" aria-hidden="true"></i>
        Demo Credentials
        <i 
          class="fas" 
          :class="showDemoCredentials ? 'fa-chevron-up' : 'fa-chevron-down'" 
          aria-hidden="true"
        ></i>
      </button>
      
      <div 
        id="demo-credentials"
        class="demo-credentials"
        :class="{ 'expanded': showDemoCredentials }"
      >
        <h6>Available Demo Accounts:</h6>
        <ul>
          <li><strong>Admin:</strong> admin@example.com / admin123</li>
          <li><strong>HR Manager:</strong> hr@example.com / hr123</li>
          <li><strong>Department Manager:</strong> manager@example.com / manager123</li>
          <li><strong>Employee:</strong> employee@example.com / employee123</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "AppLogin",
  data() {
    return {
      email: "",
      password: "",
      rememberMe: false,
      showPassword: false,
      error: null,
      isLoading: false,
      showDemoCredentials: false
    };
  },
  computed: {
    isFormValid() {
      return this.email && this.password.length >= 8;
    }
  },
  methods: {
    ...mapActions("auth", ["login", "socialLogin"]),
    resetError() {
      this.error = null;
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
      const passwordField = document.getElementById('password');
      passwordField.type = this.showPassword ? 'text' : 'password';
    },
    toggleDemoCredentials() {
      this.showDemoCredentials = !this.showDemoCredentials;
    },
    async handleLogin() {
      this.error = null;
      this.isLoading = true;
      
      try {
        const res = await this.login({ 
          email: this.email, 
          password: this.password,
          rememberMe: this.rememberMe
        });
        
        if (res.success) {
          this.$router.push("/dashboard");
        } else {
          this.error = res.message || "Invalid credentials. Please try again.";
        }
      } catch (error) {
        this.error = "An unexpected error occurred. Please try again later.";
        console.error("Login error:", error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  position: relative;
}

.login-card {
  width: 100%;
  max-width: 450px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transform: translateY(0);
  transition: all 0.3s ease;
  z-index: 1;
}

.login-card:hover {
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
  font-size: 2rem;
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

.login-form {
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -0.5rem;
}

.form-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-check-input {
  margin: 0;
}

.form-check-label {
  font-size: 0.9rem;
  color: #495057;
  cursor: pointer;
}

.forgot-password {
  font-size: 0.9rem;
  color: #4ca1af;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.error-message {
  background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
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

.error-message i {
  font-size: 1.2rem;
}

.login-btn {
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

.login-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #4ca1af 0%, #2c3e50 100%);
  transform: translateY(-2px);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: #6c757d;
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

.social-login {
  margin-top: 1rem;
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

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
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

.social-btn.github {
  color: #333;
  border-color: #333;
}

.register-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #495057;
}

.register-link a {
  color: #4ca1af;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}

.demo-credentials-container {
  width: 100%;
  max-width: 450px;
  margin-top: 1.5rem;
}

.demo-toggle {
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
}

.demo-toggle:hover {
  background: white;
}

.demo-credentials {
  background: white;
  border-radius: 0 0 8px 8px;
  padding: 0;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.demo-credentials.expanded {
  max-height: 500px;
  padding: 1.5rem;
}

.demo-credentials h6 {
  color: #6c757d;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
}

.demo-credentials ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.demo-credentials li {
  font-size: 0.85rem;
  color: #495057;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
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
  .login-container {
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
}
</style>
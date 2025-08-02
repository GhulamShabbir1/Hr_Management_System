<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card-gradient">
            <div class="card-gradient-header text-center p-4">
              <h2 class="mb-0">
                <i class="fas fa-sign-in-alt me-2"></i>
                Login
              </h2>
            </div>
            <div class="card-body p-4">
              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label class="form-label fw-semibold">Email Address</label>
                  <input
                    v-model="email"
                    type="email"
                    class="form-control"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold">Password</label>
                  <input
                    v-model="password"
                    type="password"
                    class="form-control"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                <div v-if="error" class="alert alert-gradient alert-danger" role="alert">
                  <i class="fas fa-exclamation-triangle me-2"></i>
                  {{ error }}
                </div>
                
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="btn btn-gradient-primary w-100 py-3 mb-4"
                >
                  <span v-if="isLoading">
                    <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                    Logging in...
                  </span>
                  <span v-else>
                    <i class="fas fa-sign-in-alt me-2"></i>
                    Login
                  </span>
                </button>
                
                <div class="text-center">
                  <h6 class="text-muted mb-3">Demo Credentials:</h6>
                  <div class="row text-start">
                    <div class="col-12 mb-2">
                      <small><strong>Admin:</strong> admin@example.com / admin123</small>
                    </div>
                    <div class="col-12 mb-2">
                      <small><strong>HR:</strong> hr@example.com / hr123</small>
                    </div>
                    <div class="col-12">
                      <small><strong>Employee:</strong> user@example.com / user123</small>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
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
      error: null,
      isLoading: false
    };
  },
  methods: {
    ...mapActions("auth", ["login"]),
    async handleLogin() {
      this.error = null;
      this.isLoading = true;
      
      try {
        const res = await this.login({ email: this.email, password: this.password });
        if (res.success) {
          this.$router.push("/dashboard");
        } else {
          this.error = res.message;
        }
      } catch (error) {
        this.error = "An unexpected error occurred. Please try again.";
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
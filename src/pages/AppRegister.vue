<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
      <form @submit.prevent="handleRegister" novalidate>
        <div class="mb-4">
          <label class="block mb-1 font-medium" for="name">Full Name</label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            placeholder="Your full name"
            required
            class="w-full px-3 py-2 border rounded"
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
        </div>

        <div class="mb-4">
          <label class="block mb-1 font-medium" for="email">Email</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            placeholder="you@example.com"
            required
            class="w-full px-3 py-2 border rounded"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <div class="mb-4">
          <label class="block mb-1 font-medium" for="password">Password</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            placeholder="Enter password"
            required
            class="w-full px-3 py-2 border rounded"
          />
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <div class="mb-6">
          <label class="block mb-1 font-medium" for="confirmPassword">Confirm Password</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            id="confirmPassword"
            placeholder="Confirm your password"
            required
            class="w-full px-3 py-2 border rounded"
          />
          <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">{{ errors.confirmPassword }}</p>
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
      <p class="mt-4 text-center text-gray-600">
        Already have an account?
        <router-link to="/login" class="text-blue-600 hover:underline">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      errors: {},
    };
  },
  methods: {
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    validateForm() {
      this.errors = {};

      if (!this.form.name.trim()) {
        this.errors.name = "Name is required.";
      }
      if (!this.form.email.trim()) {
        this.errors.email = "Email is required.";
      } else if (!this.validateEmail(this.form.email)) {
        this.errors.email = "Please enter a valid email address.";
      }
      if (!this.form.password) {
        this.errors.password = "Password is required.";
      } else if (this.form.password.length < 6) {
        this.errors.password = "Password must be at least 6 characters.";
      }
      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = "Confirm password is required.";
      } else if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = "Passwords do not match.";
      }

      return Object.keys(this.errors).length === 0;
    },
    handleRegister() {
      if (this.validateForm()) {
        // Call your API or Vuex action here
        // For demo, just log and redirect to login
        console.log("User registered:", this.form);
        alert("Registration successful! Please login.");
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>

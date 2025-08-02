<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-96">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <p v-if="error" class="text-red-500 mb-4">{{ error }}</p>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
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
    };
  },
  methods: {
    ...mapActions("auth", ["login"]),
    async handleLogin() {
      const res = await this.login({ email: this.email, password: this.password });
      if (res.success) {
        this.$router.push("/dashboard");
      } else {
        this.error = res.message;
      }
    },
  },
};
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Welcome, {{ user?.role }}</h1>
    <p class="text-lg">This is the main dashboard.</p>
    <button
      @click="logoutUser"
      class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Logout
    </button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AppDashboard",
  computed: {
    ...mapGetters("auth", ["userData"]),
    user() {
      return this.userData;
    },
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    logoutUser() {
      this.logout();
      this.$router.push("/login");
    },
  },
};
</script>

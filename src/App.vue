<template>
  <div id="app" class="flex">
    <!-- Sidebar only visible if user is authenticated -->
    <AppSidebar v-if="isAuthenticated" />

    <!-- Main content -->
    <div :class="isAuthenticated ? 'ml-64 w-full' : 'w-full'">
      <router-view />
    </div>
  </div>
</template>

<script>
import AppSidebar from  "./components/AppSidebar.vue";
import { mapGetters } from "vuex";

export default {
  name: "App",
  components: { AppSidebar },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"])
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>

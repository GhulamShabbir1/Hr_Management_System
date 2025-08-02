<template>
  <div id="app">
    <!-- Sidebar only visible if user is authenticated -->
    <AppSidebar v-if="isAuthenticated" />

    <!-- Main content -->
    <div :class="isAuthenticated ? 'main-content' : ''">
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
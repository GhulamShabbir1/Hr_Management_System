import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";



// Custom CSS with gradients
import "./assets/css/custom.css";

Vue.config.productionTip = false;

// Initialize authentication state from localStorage
store.dispatch('auth/initializeAuth');

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount("#app");
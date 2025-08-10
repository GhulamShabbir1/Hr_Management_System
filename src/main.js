import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// BootstrapVue
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Custom styles
import '@/assets/css/custom.css';

// Axios instance
import api from '@/services/api';

// Notifications
import Notifications from 'vue-notification';
Vue.use(Notifications);

// Safe global notification method
Vue.prototype.$notify = function (notification) {
  if (this && this.$root) {
    this.$root.$emit('show-notification', notification);
  }
};

// Use BootstrapVue plugins
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

// Inject axios instance globally
Vue.prototype.$axios = api;

// Vue config
Vue.config.productionTip = false;
Vue.config.performance = process.env.NODE_ENV === 'development';

// Global date format filter
Vue.filter('formatDate', (value) => {
  if (!value) return '';
  return new Date(value).toLocaleDateString();
});

// Setup Axios interceptors
function setupAxiosInterceptors(store) {
  api.interceptors.request.use(
    (config) => {
      if (store.getters['auth/isAuthenticated']) {
        config.headers.Authorization = `Bearer ${store.state.auth.token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        store.dispatch('auth/logout');
        if (router.currentRoute.path !== '/login') {
          router.push('/login');
        }
      }
      return Promise.reject(error);
    }
  );
}

// Error handler with component info
Vue.config.errorHandler = (err, vm, info) => {
  console.error('Vue error:', err, info);
  if (vm && vm.$options) {
    console.log('Component Name:', vm.$options.name || '(anonymous)');
    console.log('Component Options:', vm.$options);
  }
};

// Initialize app
store.dispatch('auth/initializeAuth').then(() => {
  setupAxiosInterceptors(store);

  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
});
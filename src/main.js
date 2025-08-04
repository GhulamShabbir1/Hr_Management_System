import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Bootstrap only
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// Your custom styles
import '@/assets/css/custom.css';

// Import your custom axios instance
import api from '@/services/api';
import Notifications from 'vue-notification';
Vue.use(Notifications);


Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

// Config
Vue.config.productionTip = false;
Vue.config.performance = process.env.NODE_ENV === 'development';

// Global filters (optional)
Vue.filter('formatDate', (value) => {
  if (!value) return '';
  return new Date(value).toLocaleDateString();
});

// Initialize authentication state
store.dispatch('auth/initializeAuth').then(() => {
  setupAxiosInterceptors(store);
});

// Setup Axios interceptors
function setupAxiosInterceptors(store) {
  api.interceptors.request.use(
    config => {
      if (store.getters['auth/isAuthenticated']) {
        config.headers.Authorization = `Bearer ${store.state.auth.token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        store.dispatch('auth/logout');
        router.push('/login');
      }
      return Promise.reject(error);
    }
  );
}

// Vue error handler
Vue.config.errorHandler = (err, vm, info) => {
  console.error('Vue error:', err, info);
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

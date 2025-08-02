import Vue from "vue";
import Router from "vue-router";
import store from "@/store";

import AppLogin from "@/pages/AppLogin.vue";
import AppDashboard from "@/pages/AppDashboard.vue";
import AppNotFound from "@/pages/AppNotFound.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    { path: "/", redirect: "/dashboard" },
    { path: "/login", component: AppLogin },
    { path: "/dashboard", component: AppDashboard, meta: { requiresAuth: true } },
    { path: "*", component: AppNotFound }
  ]
});

router.beforeEach((to, from, next) => {
  const isAuth = store.getters["auth/isAuthenticated"];

  if (to.meta.requiresAuth && !isAuth) {
    return next("/login");
  }
  
  next();
});

export default router;
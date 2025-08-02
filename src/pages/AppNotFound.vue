<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center">
    <div class="text-center">
      <h1 class="display-1 fw-bold text-primary">404</h1>
      <h2 class="mb-4">Page Not Found</h2>
      <p class="lead mb-4">The page you're looking for doesn't exist.</p>
      <router-link to="/dashboard" class="btn btn-gradient-primary">
        <i class="fas fa-home me-2"></i>
        Go to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppNotFound"
};
</script>
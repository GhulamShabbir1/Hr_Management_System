<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for doesn’t exist.</p>
    <router-link to="/">Go Back Home</router-link>
  </div>
</template>

<script>
export default {
  name: "AppNotFound",
};
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 100px 20px;
}
.not-found h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  color: #ff4d4f;
}
.not-found p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}
.not-found a {
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
}
</style>

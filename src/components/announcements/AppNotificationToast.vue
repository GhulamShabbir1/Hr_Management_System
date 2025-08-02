<template>
  <transition name="fade">
    <div v-if="visible" class="fixed bottom-5 right-5 bg-blue-600 text-white px-5 py-3 rounded shadow-lg flex items-center space-x-3">
      <i class="fas fa-bell"></i>
      <span>{{ message }}</span>
      <button @click="close" class="ml-auto focus:outline-none">&times;</button>
    </div>
  </transition>
</template>

<script>
export default {
  props: ["message"],
  data() {
    return {
      visible: true,
    };
  },
  methods: {
    close() {
      this.visible = false;
      this.$emit("closed");
    },
  },
  mounted() {
    setTimeout(() => this.close(), 4000);
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, 
.fade-leave-to {
  opacity: 0;
}
</style>

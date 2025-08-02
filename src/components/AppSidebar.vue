<template>
  <div class="w-64 bg-gray-800 text-white h-screen fixed">
    <h2 class="text-2xl font-bold p-4 border-b border-gray-700">HRMS</h2>
    <ul>
      <li v-for="item in menuItems" :key="item.path">
        <router-link
          :to="item.path"
          class="block p-4 hover:bg-gray-700"
          active-class="bg-gray-700"
        >
          {{ item.label }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "AppSidebar",
  data() {
    return {
      menuItems: [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Employees", path: "/employees" },
        { label: "Attendance", path: "/attendance" },
        { label: "Payroll", path: "/payroll" },
        { label: "Announcements", path: "/announcements" },
      ],
    };
  },
};
</script>

<style scoped>
.router-link-exact-active {
  background-color: #4a5568;
}
</style>

<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Employee Profile</h2>
    <div v-if="employee" class="border p-4 rounded shadow">
      <p><strong>ID:</strong> {{ employee.id }}</p>
      <p><strong>Name:</strong> {{ employee.name }}</p>
      <p><strong>Email:</strong> {{ employee.email }}</p>
      <p><strong>Role:</strong> {{ employee.role }}</p>
      <p>
        <strong>Status:</strong>
        <span :class="employee.active ? 'text-green-600' : 'text-red-600'">
          {{ employee.active ? 'Active' : 'Inactive' }}
        </span>
      </p>
    </div>
    <div v-else>
      <p class="text-red-500">Employee not found.</p>
    </div>
    <button @click="$router.push('/employees')" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
      Back to List
    </button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AppEmployeeProfile",
  computed: {
    ...mapGetters("employees", ["getEmployeeById"]),
    employee() {
      return this.getEmployeeById(this.$route.params.id);
    }
  },
  methods: {
    ...mapActions("employees", ["fetchEmployees"])
  },
  created() {
    if (!this.employee) {
      this.fetchEmployees();
    }
  }
};
</script>

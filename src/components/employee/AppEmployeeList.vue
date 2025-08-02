<template>
  <div class="p-6">
    <button @click="openForm()" class="bg-green-600 text-white px-4 py-2 mb-4 rounded">
      Add Employee
    </button>

    <AppEmployeeForm
      v-if="showForm"
      :employee="selectedEmployee"
      @save="saveEmployee"
      @close="closeForm"
    />

    <h2 class="text-2xl font-bold mb-4">Employee List</h2>
    <table class="w-full border">
      <thead class="bg-gray-200">
        <tr>
          <th class="border p-2">ID</th>
          <th class="border p-2">Name</th>
          <th class="border p-2">Email</th>
          <th class="border p-2">Role</th>
          <th class="border p-2">Status</th>
          <th class="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee in employees" :key="employee.id">
          <td class="border p-2">{{ employee.id }}</td>
          <td class="border p-2">{{ employee.name }}</td>
          <td class="border p-2">{{ employee.email }}</td>
          <td class="border p-2">{{ employee.role }}</td>
          <td class="border p-2">
            <span :class="employee.active ? 'text-green-600' : 'text-red-600'">
              {{ employee.active ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td class="border p-2 space-x-2">
            <button @click="toggleStatus(employee.id)" class="bg-yellow-500 text-white px-2 py-1 rounded">
              {{ employee.active ? 'Deactivate' : 'Activate' }}
            </button>
            <button @click="editEmployee(employee)" class="bg-blue-500 text-white px-2 py-1 rounded">
              Edit
            </button>
            <button @click="viewEmployee(employee.id)" class="bg-green-500 text-white px-2 py-1 rounded">
              View
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AppEmployeeForm from "./AppEmployeeForm.vue";

export default {
  name: "EmployeeList",
  components: { AppEmployeeForm },
  data() {
    return {
      showForm: false,
      selectedEmployee: null
    };
  },
  computed: {
    ...mapGetters("employees", ["employees"])
  },
  methods: {
    ...mapActions("employees", ["fetchEmployees", "toggleStatus", "addEmployee", "updateEmployee"]),
    openForm(employee = null) {
      this.selectedEmployee = employee;
      this.showForm = true;
    },
    closeForm() {
      this.showForm = false;
      this.selectedEmployee = null;
    },
    async saveEmployee(employee) {
      if (employee.id) {
        await this.updateEmployee({ id: employee.id, data: employee });
      } else {
        await this.addEmployee(employee);
      }
      this.closeForm();
    },
    editEmployee(employee) {
      this.openForm({ ...employee });
    },
    viewEmployee(id) {
      this.$router.push(`/employees/${id}`);
    }
  },
  created() {
    this.fetchEmployees();
  }
};
</script>

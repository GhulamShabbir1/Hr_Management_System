<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Payroll List</h2>

    <button
      @click="addPayroll"
      class="bg-green-600 text-white px-4 py-2 rounded mb-4"
    >
      Add Payroll
    </button>

    <table class="w-full border">
      <thead>
        <tr class="bg-gray-200">
          <th class="border p-2">Name</th>
          <th class="border p-2">Basic</th>
          <th class="border p-2">Bonus</th>
          <th class="border p-2">Deduction</th>
          <th class="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="payroll in payrolls" :key="payroll.id">
          <td class="border p-2">{{ payroll.name }}</td>
          <td class="border p-2">{{ payroll.basic }}</td>
          <td class="border p-2">{{ payroll.bonus }}</td>
          <td class="border p-2">{{ payroll.deduction }}</td>
          <td class="border p-2">
            <button
              @click="editPayroll(payroll)"
              class="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Payroll Form Modal -->
    <AppPayrollForm
      v-if="showForm"
      :employee="selectedPayroll"
      :mode="formMode"
      @save="savePayroll"
      @close="closeForm"
    />
  </div>
</template>

<script>
import AppPayrollForm from "./AppPayrollForm.vue";

export default {
  components: { AppPayrollForm },
  data() {
    return {
      payrolls: [
        { id: 1, name: "John Doe", basic: 5000, bonus: 500, deduction: 200 },
        { id: 2, name: "Jane Smith", basic: 6000, bonus: 700, deduction: 300 },
      ],
      selectedPayroll: null,
      showForm: false,
      formMode: "add",
    };
  },
  methods: {
    addPayroll() {
      this.formMode = "add";
      this.selectedPayroll = { name: "", basic: 0, bonus: 0, deduction: 0 };
      this.showForm = true;
    },
    editPayroll(payroll) {
      this.formMode = "edit";
      this.selectedPayroll = { ...payroll };
      this.showForm = true;
    },
    savePayroll(data) {
      if (this.formMode === "add") {
        data.id = Date.now();
        this.payrolls.push(data);
      } else {
        const index = this.payrolls.findIndex((p) => p.id === data.id);
        if (index !== -1) {
          this.payrolls.splice(index, 1, data);
        }
      }
      this.closeForm();
    },
    closeForm() {
      this.showForm = false;
      this.selectedPayroll = null;
    },
  },
};
</script>

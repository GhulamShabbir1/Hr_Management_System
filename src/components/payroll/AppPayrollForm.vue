<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-md w-96">
      <h2 class="text-xl font-bold mb-4">
        {{ mode === 'edit' ? 'Edit Payroll' : 'Add Payroll' }}
      </h2>
      <form @submit.prevent="save">
        <div class="mb-4">
          <label class="block mb-1">Name</label>
          <input
            type="text"
            v-model="localData.name"
            class="border w-full p-2 rounded"
            :disabled="mode === 'edit'"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-1">Basic Salary</label>
          <input type="number" v-model.number="localData.basic" class="border w-full p-2 rounded" />
        </div>
        <div class="mb-4">
          <label class="block mb-1">Bonuses</label>
          <input type="number" v-model.number="localData.bonus" class="border w-full p-2 rounded" />
        </div>
        <div class="mb-4">
          <label class="block mb-1">Deductions</label>
          <input type="number" v-model.number="localData.deduction" class="border w-full p-2 rounded" />
        </div>
        <div class="flex justify-end space-x-2">
          <button type="button" @click="$emit('close')" class="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">
            {{ mode === 'edit' ? 'Save' : 'Add' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppPayrollForm",
  props: {
    employee: { type: Object, default: () => ({ name: "", basic: 0, bonus: 0, deduction: 0 }) },
    mode: { type: String, default: "add" } // add or edit
  },
  data() {
    return {
      localData: { ...this.employee },
    };
  },
  methods: {
    save() {
      this.$emit("save", this.localData);
    }
  }
};
</script>

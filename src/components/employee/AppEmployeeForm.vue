<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div class="bg-white rounded-lg p-6 w-96">
      <h2 class="text-xl font-bold mb-4">
        {{ employee.id ? 'Edit Employee' : 'Add Employee' }}
      </h2>

      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label class="block mb-1 font-medium">Name</label>
          <input v-model="form.name" type="text" class="w-full border p-2 rounded" required />
        </div>
        <div class="mb-3">
          <label class="block mb-1 font-medium">Email</label>
          <input v-model="form.email" type="email" class="w-full border p-2 rounded" required />
        </div>
        <div class="mb-3">
          <label class="block mb-1 font-medium">Role</label>
          <input v-model="form.role" type="text" class="w-full border p-2 rounded" required />
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" @click="$emit('close')" class="bg-gray-400 px-4 py-2 rounded text-white">
            Cancel
          </button>
          <button type="submit" class="bg-blue-600 px-4 py-2 rounded text-white">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppEmployeeForm",
  props: {
    employee: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        id: this.employee.id || null,
        name: this.employee.name || "",
        email: this.employee.email || "",
        role: this.employee.role || "",
        active: this.employee.active ?? true
      }
    };
  },
  methods: {
    submitForm() {
      this.$emit("save", this.form);
    }
  }
};
</script>

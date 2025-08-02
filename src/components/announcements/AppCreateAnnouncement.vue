<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
    <div class="bg-white p-6 rounded shadow-lg w-96">
      <h3 class="text-xl font-bold mb-4">Create Announcement</h3>
      <form @submit.prevent="submitForm">
        <label class="block mb-2">
          Title
          <input v-model="form.title" type="text" required class="border p-2 w-full rounded" />
        </label>
        <label class="block mb-2">
          Content
          <textarea v-model="form.content" required class="border p-2 w-full rounded"></textarea>
        </label>
        <label class="block mb-4">
          Date
          <input v-model="form.date" type="date" required class="border p-2 w-full rounded" />
        </label>

        <div class="flex justify-end space-x-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 rounded border">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        title: "",
        content: "",
        date: "",
      },
    };
  },
  methods: {
    submitForm() {
      // Validate inputs if needed
      this.$emit("created", { ...this.form, emailSent: false });
    },
  },
};
</script>

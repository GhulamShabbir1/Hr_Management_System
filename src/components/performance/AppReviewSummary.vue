<template>
  <div class="p-6 max-w-3xl mx-auto border rounded shadow">
    <h2 class="text-xl font-bold mb-4">Review Summary</h2>
    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="border border-gray-300 p-2">Employee</th>
          <th class="border border-gray-300 p-2">Task</th>
          <th class="border border-gray-300 p-2">Rating</th>
          <th class="border border-gray-300 p-2">Comments</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="review in reviews" :key="review.id">
          <td class="border border-gray-300 p-2">{{ employeeName(review.employeeId) }}</td>
          <td class="border border-gray-300 p-2">{{ taskName(review.taskId) }}</td>
          <td class="border border-gray-300 p-2 text-center">
            <span v-for="n in 5" :key="n" class="inline-block text-yellow-400 text-lg">
              {{ n <= review.rating ? '★' : '☆' }}
            </span>
          </td>
          <td class="border border-gray-300 p-2">{{ review.comments || "-" }}</td>
        </tr>
        <tr v-if="reviews.length === 0">
          <td colspan="4" class="p-4 text-center text-gray-500">No reviews submitted yet.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "AppReviewSummary",
  props: {
    reviews: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      employees: [
        { id: 1, name: "Ali Khan" },
        { id: 2, name: "Sara Ahmed" },
        { id: 3, name: "Omar Malik" },
      ],
      tasks: [
        { id: 1, name: "Project Alpha" },
        { id: 2, name: "Website Redesign" },
        { id: 3, name: "Client Support" },
      ],
    };
  },
  methods: {
    employeeName(id) {
      const emp = this.employees.find((e) => e.id === id);
      return emp ? emp.name : "Unknown";
    },
    taskName(id) {
      const task = this.tasks.find((t) => t.id === id);
      return task ? task.name : "Unknown";
    },
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
}
</style>

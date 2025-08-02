<template>
  <div class="p-6 max-w-lg mx-auto border rounded shadow">
    <h2 class="text-xl font-bold mb-4">Quarterly Review Form</h2>
    <form @submit.prevent="submitReview">
      <div class="mb-4">
        <label class="block mb-1 font-semibold">Employee</label>
        <select v-model="review.employeeId" required class="w-full border p-2 rounded">
          <option disabled value="">Select Employee</option>
          <option v-for="emp in employees" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block mb-1 font-semibold">Task Completed</label>
        <select v-model="review.taskId" required class="w-full border p-2 rounded">
          <option disabled value="">Select Task</option>
          <option v-for="task in tasks" :key="task.id" :value="task.id">{{ task.name }}</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block mb-1 font-semibold">Rating (1-5)</label>
        <div class="flex space-x-2">
          <button
            v-for="n in 5"
            :key="n"
            type="button"
            :class="n <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
            @click="review.rating = n"
            class="text-2xl"
            aria-label="Rate {{n}}"
          >
            ★
          </button>
        </div>
      </div>

      <div class="mb-4">
        <label class="block mb-1 font-semibold">Comments</label>
        <textarea v-model="review.comments" rows="3" class="w-full border p-2 rounded"></textarea>
      </div>

      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >Submit Review</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "AppReviewForm",
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
      review: {
        employeeId: "",
        taskId: "",
        rating: 0,
        comments: "",
      },
      submittedReviews: [],
    };
  },
  methods: {
    submitReview() {
      if (
        !this.review.employeeId ||
        !this.review.taskId ||
        this.review.rating === 0
      ) {
        alert("Please complete all required fields and provide a rating.");
        return;
      }
      // Save review to submittedReviews array (dummy storage)
      this.submittedReviews.push({ ...this.review, id: Date.now() });
      alert("Review submitted successfully!");
      this.resetForm();
      // Optional: Emit event to update parent or store
      this.$emit("review-submitted", this.submittedReviews);
    },
    resetForm() {
      this.review = {
        employeeId: "",
        taskId: "",
        rating: 0,
        comments: "",
      };
    },
  },
};
</script>

<style scoped>
button:focus {
  outline: none;
}
</style>

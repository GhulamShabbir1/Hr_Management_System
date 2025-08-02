<template>
  <div class="p-6 max-w-lg mx-auto border rounded shadow">
    <h2 class="text-xl font-bold mb-4">Task Completion Evaluator</h2>
    <ul>
      <li v-for="task in tasks" :key="task.id" class="mb-3">
        <div class="flex justify-between items-center">
          <div>
            <strong>{{ task.name }}</strong> 
            <span class="text-sm text-gray-600">({{ task.status }})</span>
          </div>
          <button 
            @click="toggleStatus(task)" 
            :class="task.status === 'Completed' ? 'bg-red-500' : 'bg-green-500'" 
            class="text-white px-3 py-1 rounded"
          >
            {{ task.status === 'Completed' ? 'Mark Incomplete' : 'Mark Complete' }}
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "AppTaskEvaluation",
  data() {
    return {
      tasks: [
        { id: 1, name: "Project Alpha", status: "Incomplete" },
        { id: 2, name: "Website Redesign", status: "Incomplete" },
        { id: 3, name: "Client Support", status: "Incomplete" },
      ],
    };
  },
  methods: {
    toggleStatus(task) {
      task.status = task.status === "Completed" ? "Incomplete" : "Completed";
    },
  },
};
</script>

<style scoped>
</style>

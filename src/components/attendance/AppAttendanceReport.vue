<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Attendance Report</h2>

    <!-- Filters -->
    <div class="flex space-x-4 mb-4">
      <div>
        <label class="block text-gray-700">Select Month</label>
        <select v-model="selectedMonth" class="border px-3 py-2 rounded">
          <option v-for="(m, i) in months" :key="i" :value="i + 1">
            {{ m }}
          </option>
        </select>
      </div>
      <div>
        <label class="block text-gray-700">Select Year</label>
        <select v-model="selectedYear" class="border px-3 py-2 rounded">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
      <div class="flex items-end">
        <button @click="filterReport" class="bg-blue-600 text-white px-4 py-2 rounded">Filter</button>
      </div>
    </div>

    <!-- Attendance Table -->
    <table class="w-full border">
      <thead class="bg-gray-200">
        <tr>
          <th class="border p-2">Employee</th>
          <th class="border p-2">Total Days</th>
          <th class="border p-2">Present</th>
          <th class="border p-2">Absent</th>
          <th class="border p-2">Leaves</th>
          <th class="border p-2">Attendance %</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in filteredReport" :key="record.id">
          <td class="border p-2">{{ record.name }}</td>
          <td class="border p-2">{{ record.totalDays }}</td>
          <td class="border p-2">{{ record.present }}</td>
          <td class="border p-2">{{ record.absent }}</td>
          <td class="border p-2">{{ record.leaves }}</td>
          <td class="border p-2">{{ attendancePercentage(record) }}%</td>
        </tr>
      </tbody>
    </table>

    <!-- Export Button -->
    <button @click="exportToExcel" class="bg-green-600 text-white px-4 py-2 mt-4 rounded">
      Export to Excel
    </button>
  </div>
</template>

<script>
export default {
  name: "AppAttendanceReport",
  data() {
    return {
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
      months: [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
      ],
      years: [2023, 2024, 2025],
      attendanceReport: [
        { id: 1, name: "Ali Khan", totalDays: 22, present: 20, absent: 1, leaves: 1 },
        { id: 2, name: "Sara Ahmed", totalDays: 22, present: 18, absent: 2, leaves: 2 },
        { id: 3, name: "Omar Malik", totalDays: 22, present: 21, absent: 0, leaves: 1 }
      ],
      filteredReport: []
    };
  },
  mounted() {
    this.filterReport();
  },
  methods: {
    filterReport() {
      // Here you can add filtering by month/year if needed
      this.filteredReport = this.attendanceReport;
    },
    attendancePercentage(record) {
      return ((record.present / record.totalDays) * 100).toFixed(1);
    },
    exportToExcel() {
      alert("Export to Excel triggered (backend integration needed).");
    }
  }
};
</script>

<style>
table { border-collapse: collapse; }
</style>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Leave Requests</h2>

    <!-- Employee View: Submit Leave Request -->
    <div v-if="isEmployee">
      <form @submit.prevent="submitRequest" class="mb-6 p-4 border rounded shadow">
        <div class="mb-4">
          <label class="block font-semibold mb-1">Start Date</label>
          <input type="date" v-model="newRequest.startDate" required :min="today" class="border p-2 rounded w-full" />
        </div>
        <div class="mb-4">
          <label class="block font-semibold mb-1">End Date</label>
          <input type="date" v-model="newRequest.endDate" required :min="newRequest.startDate || today" class="border p-2 rounded w-full" />
        </div>
        <div class="mb-4">
          <label class="block font-semibold mb-1">Reason</label>
          <textarea v-model="newRequest.reason" required class="border p-2 rounded w-full" rows="3"></textarea>
        </div>
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit Request</button>
      </form>

      <h3 class="text-xl font-semibold mb-2">Your Leave Requests</h3>
      <table class="w-full border-collapse border border-gray-300">
        <thead class="bg-gray-200">
          <tr>
            <th class="border border-gray-300 p-2">Start Date</th>
            <th class="border border-gray-300 p-2">End Date</th>
            <th class="border border-gray-300 p-2">Reason</th>
            <th class="border border-gray-300 p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="req in employeeRequests" :key="req.id" class="text-center">
            <td class="border border-gray-300 p-2">{{ req.startDate }}</td>
            <td class="border border-gray-300 p-2">{{ req.endDate }}</td>
            <td class="border border-gray-300 p-2">{{ req.reason }}</td>
            <td class="border border-gray-300 p-2">
              <span
                :class="{
                  'text-green-600': req.status === 'Approved',
                  'text-red-600': req.status === 'Rejected',
                  'text-yellow-600': req.status === 'Pending'
                }"
              >
                {{ req.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- HR/Admin View: Approve/Reject Requests -->
    <div v-if="isHR">
      <h3 class="text-xl font-semibold mb-2">Pending Leave Requests</h3>
      <table class="w-full border-collapse border border-gray-300 mb-6">
        <thead class="bg-gray-200">
          <tr>
            <th class="border border-gray-300 p-2">Employee</th>
            <th class="border border-gray-300 p-2">Start Date</th>
            <th class="border border-gray-300 p-2">End Date</th>
            <th class="border border-gray-300 p-2">Reason</th>
            <th class="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="req in pendingRequests" :key="req.id" class="text-center">
            <td class="border border-gray-300 p-2">{{ req.employeeName }}</td>
            <td class="border border-gray-300 p-2">{{ req.startDate }}</td>
            <td class="border border-gray-300 p-2">{{ req.endDate }}</td>
            <td class="border border-gray-300 p-2">{{ req.reason }}</td>
            <td class="border border-gray-300 p-2 space-x-2">
              <button @click="updateRequestStatus(req.id, 'Approved')" class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Approve</button>
              <button @click="updateRequestStatus(req.id, 'Rejected')" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Reject</button>
            </td>
          </tr>
          <tr v-if="pendingRequests.length === 0">
            <td colspan="5" class="p-4 text-center text-gray-600">No pending requests</td>
          </tr>
        </tbody>
      </table>

      <h3 class="text-xl font-semibold mb-2">All Leave Requests</h3>
      <table class="w-full border-collapse border border-gray-300">
        <thead class="bg-gray-200">
          <tr>
            <th class="border border-gray-300 p-2">Employee</th>
            <th class="border border-gray-300 p-2">Start Date</th>
            <th class="border border-gray-300 p-2">End Date</th>
            <th class="border border-gray-300 p-2">Reason</th>
            <th class="border border-gray-300 p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="req in leaveRequests" :key="req.id" class="text-center">
            <td class="border border-gray-300 p-2">{{ req.employeeName }}</td>
            <td class="border border-gray-300 p-2">{{ req.startDate }}</td>
            <td class="border border-gray-300 p-2">{{ req.endDate }}</td>
            <td class="border border-gray-300 p-2">{{ req.reason }}</td>
            <td
              class="border border-gray-300 p-2"
              :class="{
                'text-green-600': req.status === 'Approved',
                'text-red-600': req.status === 'Rejected',
                'text-yellow-600': req.status === 'Pending'
              }"
            >
              {{ req.status }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppLeaveRequestForm",
  props: {
    userRole: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: false,
      default: "Employee",
    },
  },
  data() {
    return {
      today: new Date().toISOString().substr(0, 10),
      newRequest: {
        startDate: "",
        endDate: "",
        reason: "",
      },
      leaveRequests: [
        // dummy data
        { id: 1, employeeName: "Ali Khan", startDate: "2025-08-10", endDate: "2025-08-12", reason: "Family event", status: "Pending" },
        { id: 2, employeeName: "Sara Ahmed", startDate: "2025-08-15", endDate: "2025-08-16", reason: "Medical", status: "Approved" },
        { id: 3, employeeName: "Omar Malik", startDate: "2025-08-20", endDate: "2025-08-22", reason: "Vacation", status: "Rejected" },
      ],
      nextId: 4,
    };
  },
  computed: {
    isHR() {
      return this.userRole === "HR" || this.userRole === "Admin";
    },
    isEmployee() {
      return !this.isHR;
    },
    employeeRequests() {
      return this.leaveRequests.filter(req => req.employeeName === this.userName);
    },
    pendingRequests() {
      return this.leaveRequests.filter(req => req.status === "Pending");
    },
  },
  methods: {
    submitRequest() {
      if (!this.newRequest.startDate || !this.newRequest.endDate || !this.newRequest.reason) {
        alert("Please fill all fields");
        return;
      }
      if (this.newRequest.endDate < this.newRequest.startDate) {
        alert("End date cannot be before start date");
        return;
      }
      this.leaveRequests.push({
        id: this.nextId++,
        employeeName: this.userName,
        startDate: this.newRequest.startDate,
        endDate: this.newRequest.endDate,
        reason: this.newRequest.reason,
        status: "Pending",
      });
      this.newRequest.startDate = "";
      this.newRequest.endDate = "";
      this.newRequest.reason = "";
      alert("Leave request submitted!");
    },
    updateRequestStatus(id, status) {
      const req = this.leaveRequests.find(r => r.id === id);
      if (req) req.status = status;
    },
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ccc;
}
</style>

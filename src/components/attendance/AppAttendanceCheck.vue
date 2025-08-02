<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Attendance</h2>

    <!-- Real-time clock -->
    <div class="mb-4">
      <span class="font-semibold text-lg">Current Time:</span>
      <span class="ml-2">{{ currentTime }}</span>
    </div>

    <!-- Check-in / Check-out Buttons -->
    <div class="space-x-2">
      <button
        @click="checkIn"
        :disabled="attendance.checkedIn"
        class="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Check In
      </button>
      <button
        @click="checkOut"
        :disabled="!attendance.checkedIn || attendance.checkedOut"
        class="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Check Out
      </button>
    </div>

    <!-- Attendance log -->
    <div class="mt-6">
      <h3 class="text-xl font-semibold mb-2">Today’s Attendance</h3>
      <p><strong>Check-in:</strong> {{ attendance.checkInTime || 'Not yet' }}</p>
      <p><strong>Check-out:</strong> {{ attendance.checkOutTime || 'Not yet' }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppAttendanceCheck",
  data() {
    return {
      currentTime: "",
      attendance: {
        checkedIn: false,
        checkedOut: false,
        checkInTime: null,
        checkOutTime: null
      }
    };
  },
  created() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
  },
  methods: {
    updateTime() {
      this.currentTime = new Date().toLocaleTimeString();
    },
    checkIn() {
      this.attendance.checkedIn = true;
      this.attendance.checkInTime = new Date().toLocaleTimeString();
    },
    checkOut() {
      this.attendance.checkedOut = true;
      this.attendance.checkOutTime = new Date().toLocaleTimeString();
    }
  }
};
</script>

<style>
button:disabled {
  cursor: not-allowed;
}
</style>

<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Announcements</h2>
    <button v-if="isAdmin" @click="openCreate()" class="bg-blue-600 text-white px-4 py-2 rounded mb-4">
      Create Announcement
    </button>

    <ul>
      <li v-for="announcement in announcements" :key="announcement.id" class="border p-3 mb-2 rounded">
        <div class="flex justify-between items-center">
          <h3 class="font-semibold">{{ announcement.title }}</h3>
          <span class="text-sm text-gray-500">{{ formatDate(announcement.date) }}</span>
        </div>
        <p>{{ announcement.content }}</p>
        <div class="mt-1 text-sm text-gray-600">
          <i v-if="announcement.emailSent" class="fas fa-envelope text-green-600" title="Email sent"></i>
          <i v-else class="fas fa-envelope text-gray-300" title="Email not sent"></i>
        </div>
      </li>
    </ul>

    <AppCreateAnnouncement v-if="showCreate" @close="showCreate = false" @created="addAnnouncement" />
  </div>
</template>

<script>
import AppCreateAnnouncement from "./AppCreateAnnouncement.vue";

export default {
  components: { AppCreateAnnouncement },
  data() {
    return {
      announcements: [
        {
          id: 1,
          title: "New HR Policy",
          content: "Please review the updated HR policy effective next month.",
          date: "2025-08-01",
          emailSent: true,
        },
        {
          id: 2,
          title: "Office Maintenance",
          content: "Office will be closed for maintenance on 10th August.",
          date: "2025-07-28",
          emailSent: false,
        },
      ],
      showCreate: false,
      userRole: "Admin", // This should come from auth store but here is dummy
    };
  },
  computed: {
    isAdmin() {
      return this.userRole === "Admin";
    },
  },
  methods: {
    openCreate() {
      this.showCreate = true;
    },
    addAnnouncement(newAnnouncement) {
      newAnnouncement.id = this.announcements.length + 1;
      this.announcements.unshift(newAnnouncement);
      this.showCreate = false;
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString();
    },
  },
};
</script>

<style scoped>
.fas.fa-envelope {
  margin-left: 5px;
}
</style>

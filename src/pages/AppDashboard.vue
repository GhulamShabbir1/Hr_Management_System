<template>
  <div class="container-fluid">
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h2 class="display-6 fw-bold text-dark mb-2">Welcome back, {{ user?.name || 'User' }}!</h2>
            <p class="lead text-muted">{{ getRoleDescription() }}</p>
          </div>
          <div class="text-end">
            <small class="text-muted">{{ getCurrentDate() }}</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row mb-4">
      <div class="col-lg-3 col-md-6 mb-4">
        <div class="stat-card stat-card-1">
          <div class="d-flex align-items-center">
            <div class="icon-gradient icon-gradient-1">
              <i class="fas fa-users"></i>
            </div>
            <div class="flex-grow-1">
              <h3 class="fw-bold text-dark mb-1">{{ stats.totalEmployees }}</h3>
              <p class="text-muted mb-0">Total Employees</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6 mb-4">
        <div class="stat-card stat-card-2">
          <div class="d-flex align-items-center">
            <div class="icon-gradient icon-gradient-2">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="flex-grow-1">
              <h3 class="fw-bold text-dark mb-1">{{ stats.presentToday }}</h3>
              <p class="text-muted mb-0">Present Today</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6 mb-4">
        <div class="stat-card stat-card-3">
          <div class="d-flex align-items-center">
            <div class="icon-gradient icon-gradient-3">
              <i class="fas fa-file-alt"></i>
            </div>
            <div class="flex-grow-1">
              <h3 class="fw-bold text-dark mb-1">{{ stats.pendingRequests }}</h3>
              <p class="text-muted mb-0">Pending Requests</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6 mb-4">
        <div class="stat-card stat-card-4">
          <div class="d-flex align-items-center">
            <div class="icon-gradient icon-gradient-4">
              <i class="fas fa-calendar-alt"></i>
            </div>
            <div class="flex-grow-1">
              <h3 class="fw-bold text-dark mb-1">{{ getCurrentMonth() }}</h3>
              <p class="text-muted mb-0">Current Month</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card-gradient">
          <div class="card-gradient-header">
            <h4 class="mb-0">
              <i class="fas fa-bolt me-2"></i>
              Quick Actions
            </h4>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-3 col-md-6 mb-3" v-for="action in getQuickActions()" :key="action.path">
                <router-link :to="action.path" class="text-decoration-none">
                  <div class="btn btn-gradient-primary w-100 p-3">
                    <i :class="action.icon" class="d-block mb-2 fs-4"></i>
                    <span class="fw-semibold">{{ action.label }}</span>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="row">
      <div class="col-12">
        <div class="card-gradient">
          <div class="card-gradient-header">
            <h4 class="mb-0">
              <i class="fas fa-history me-2"></i>
              Recent Activity
            </h4>
          </div>
          <div class="card-body">
            <div class="list-group list-group-flush">
              <div v-for="activity in recentActivity" :key="activity.id" 
                   class="list-group-item border-0 px-0 py-3">
                <div class="d-flex align-items-center">
                  <div class="avatar me-3">
                    <i class="fas fa-info-circle"></i>
                  </div>
                  <div class="flex-grow-1">
                    <p class="mb-1">{{ activity.message }}</p>
                    <small class="text-muted">{{ activity.time }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AppDashboard",
  data() {
    return {
      stats: {
        totalEmployees: 42,
        presentToday: 38,
        pendingRequests: 5
      },
      recentActivity: [
        { id: 1, message: "New employee John Smith added to the system", time: "2 hours ago" },
        { id: 2, message: "Leave request approved for Jane Doe", time: "4 hours ago" },
        { id: 3, message: "Payroll processed for the month", time: "1 day ago" },
        { id: 4, message: "New announcement posted: Office Policy Update", time: "2 days ago" },
      ]
    };
  },
  computed: {
    ...mapGetters("auth", ["userData", "userRole"]),
    user() {
      return this.userData;
    },
  },
  methods: {
    getRoleDescription() {
      const descriptions = {
        'Admin': 'System Administrator - Full access to all HR functions',
        'HR': 'Human Resources Manager - Manage employees and HR processes',
        'Employee': 'Employee Portal - Access your attendance and personal information'
      };
      return descriptions[this.userRole] || 'Welcome to the HR Management System';
    },
    getQuickActions() {
      const actions = {
        'Admin': [
          { label: 'Manage Employees', path: '/employees', icon: 'fas fa-users' },
          { label: 'View Reports', path: '/attendance/report', icon: 'fas fa-chart-bar' },
          { label: 'Announcements', path: '/announcements', icon: 'fas fa-bullhorn' },
          { label: 'Payroll', path: '/payroll', icon: 'fas fa-money-bill-wave' }
        ],
        'HR': [
          { label: 'Employee List', path: '/employees', icon: 'fas fa-users' },
          { label: 'Attendance Report', path: '/attendance/report', icon: 'fas fa-chart-bar' },
          { label: 'Process Payroll', path: '/payroll', icon: 'fas fa-money-bill-wave' },
          { label: 'Performance Review', path: '/performance', icon: 'fas fa-star' }
        ],
        'Employee': [
          { label: 'Check Attendance', path: '/attendance/check', icon: 'fas fa-clock' },
          { label: 'Request Leave', path: '/attendance/leave', icon: 'fas fa-file-alt' },
          { label: 'View Announcements', path: '/announcements', icon: 'fas fa-bullhorn' }
        ]
      };
      return actions[this.userRole] || [];
    },
    getCurrentMonth() {
      return new Date().toLocaleDateString('en-US', { month: 'long' });
    },
    getCurrentDate() {
      return new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  },
};
</script>
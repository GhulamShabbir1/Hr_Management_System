<template>
  <div class="dashboard-container">
    <!-- Welcome Header -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">Welcome back, {{ user?.name || 'User' }}!</h1>
        <p class="welcome-subtitle">{{ getRoleDescription() }}</p>
      </div>
      <div class="current-date">
        <i class="fas fa-calendar-day me-2"></i>
        <span class="date-text">{{ getCurrentDate() }}</span>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-row">
      <div 
        v-for="(stat, index) in statsData" 
        :key="index" 
        class="stat-card" 
        :class="`stat-card-${index+1}`"
      >
        <div class="stat-icon" :class="`stat-icon-${index+1}`">
          <i :class="stat.icon" aria-hidden="true"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ stat.value }}</h3>
          <p class="stat-label">{{ stat.label }}</p>
          <small 
            v-if="stat.change" 
            class="stat-change" 
            :class="stat.change > 0 ? 'text-success' : 'text-danger'"
          >
            <i 
              :class="stat.change > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" 
              aria-hidden="true"
            ></i>
            {{ Math.abs(stat.change) }}% from last month
          </small>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions-section">
      <div class="section-header">
        <i class="fas fa-bolt me-2" aria-hidden="true"></i>
        <h2>Quick Actions</h2>
      </div>
      <div class="actions-grid">
        <router-link 
          v-for="action in getQuickActions()" 
          :key="action.path"
          :to="action.path" 
          class="action-card"
          :class="`action-card-${action.label.replace(/\s+/g, '-').toLowerCase()}`"
          :aria-label="action.label"
        >
          <div class="action-icon">
            <i :class="action.icon" aria-hidden="true"></i>
          </div>
          <span class="action-label">{{ action.label }}</span>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity Section -->
    <div class="recent-activity-section">
      <div class="section-header">
        <i class="fas fa-history me-2" aria-hidden="true"></i>
        <h2>Recent Activity</h2>
        <router-link to="/activity" class="ms-auto view-all-link">
          View All <i class="fas fa-chevron-right ms-1" aria-hidden="true"></i>
        </router-link>
      </div>
      <div class="activity-list">
        <div v-if="recentActivity.length === 0" class="empty-state">
          <i class="fas fa-inbox fs-1 text-muted mb-3" aria-hidden="true"></i>
          <p>No recent activity found</p>
        </div>
        <div 
          v-for="(activity, index) in recentActivity" 
          :key="index" 
          class="activity-item"
        >
          <div class="activity-icon" :class="`bg-${activity.type}`">
            <i :class="activity.icon" aria-hidden="true"></i>
          </div>
          <div class="activity-details">
            <p class="activity-message">{{ activity.message }}</p>
            <small class="activity-time text-muted">
              <i class="fas fa-clock me-1" aria-hidden="true"></i>
              {{ formatTime(activity.time) }}
            </small>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Events Section -->
    <div class="upcoming-events-section">
      <div class="section-header">
        <i class="fas fa-calendar-alt me-2" aria-hidden="true"></i>
        <h2>Upcoming Events</h2>
        <router-link to="/events" class="ms-auto view-all-link">
          View All <i class="fas fa-chevron-right ms-1" aria-hidden="true"></i>
        </router-link>
      </div>
      <div class="events-list">
        <div v-if="upcomingEvents.length === 0" class="empty-state">
          <i class="fas fa-calendar-plus fs-1 text-muted mb-3" aria-hidden="true"></i>
          <p>No upcoming events</p>
        </div>
        <div 
          v-for="(event, index) in upcomingEvents" 
          :key="index" 
          class="event-item"
        >
          <div class="event-date">
            <div class="event-day">{{ formatDay(event.date) }}</div>
            <div class="event-month">{{ formatMonth(event.date) }}</div>
          </div>
          <div class="event-details">
            <h5 class="event-title">{{ event.title }}</h5>
            <small class="event-time text-muted">
              <i class="fas fa-clock me-1" aria-hidden="true"></i>
              {{ formatTime(event.time) }}
            </small>
            <p class="event-description">{{ event.description }}</p>
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
        pendingRequests: 5,
        upcomingReviews: 3
      },
      recentActivity: [
        {
          type: "success",
          icon: "fas fa-user-check",
          message: "New employee onboarding completed",
          time: "2023-05-15T10:30:00"
        },
        {
          type: "info",
          icon: "fas fa-file-alt",
          message: "Payroll processed for current month",
          time: "2023-05-14T15:45:00"
        },
        {
          type: "warning",
          icon: "fas fa-exclamation-triangle",
          message: "3 leave requests pending approval",
          time: "2023-05-14T09:15:00"
        }
      ],
      upcomingEvents: [
        {
          title: "Quarterly Performance Reviews",
          description: "Meeting with department heads to discuss Q2 performance",
          date: "2023-05-20",
          time: "10:00"
        },
        {
          title: "HR Policy Update Meeting",
          description: "Review and update company HR policies",
          date: "2023-05-25",
          time: "14:30"
        }
      ]
    };
  },
  computed: {
    ...mapGetters("auth", ["userData", "userRole"]),
    user() {
      return this.userData;
    },
    statsData() {
      return [
        { 
          value: this.stats.totalEmployees, 
          label: 'Total Employees', 
          icon: 'fas fa-users',
          change: 5.2
        },
        { 
          value: this.stats.presentToday, 
          label: 'Present Today', 
          icon: 'fas fa-check-circle',
          change: -2.1
        },
        { 
          value: this.stats.pendingRequests, 
          label: 'Pending Requests', 
          icon: 'fas fa-file-alt',
          change: 12.7
        },
        { 
          value: this.getCurrentMonth(), 
          label: 'Current Month', 
          icon: 'fas fa-calendar-alt',
          change: 0
        }
      ];
    }
  },
  methods: {
    getRoleDescription() {
      const descriptions = {
        'Admin': 'System Administrator - Full access to all HR functions',
        'HR': 'Human Resources Manager - Manage employees and HR processes',
        'Employee': 'Employee Portal - Access your attendance and personal information',
        'Manager': 'Team Manager - View team performance and approve requests'
      };
      return descriptions[this.userRole] || 'Welcome to the HR Management System';
    },
    getQuickActions() {
      const baseActions = [
        { label: 'View Announcements', path: '/announcements', icon: 'fas fa-bullhorn' }
      ];
      
      const roleActions = {
        'Admin': [
          { label: 'Manage Employees', path: '/employees', icon: 'fas fa-users' },
          { label: 'View Reports', path: '/reports', icon: 'fas fa-chart-bar' },
          { label: 'System Settings', path: '/settings', icon: 'fas fa-cog' }
        ],
        'HR': [
          { label: 'Employee List', path: '/employees', icon: 'fas fa-users' },
          { label: 'Attendance Report', path: '/attendance/report', icon: 'fas fa-chart-bar' },
          { label: 'Process Payroll', path: '/payroll', icon: 'fas fa-money-bill-wave' },
          { label: 'Performance Review', path: '/performance', icon: 'fas fa-star' }
        ],
        'Employee': [
          { label: 'Check Attendance', path: '/attendance/check', icon: 'fas fa-clock' },
          { label: 'Request Leave', path: '/leave-requests', icon: 'fas fa-file-alt' },
          { label: 'View Payslips', path: '/payslips', icon: 'fas fa-file-invoice-dollar' }
        ],
        'Manager': [
          { label: 'Team Attendance', path: '/team-attendance', icon: 'fas fa-user-clock' },
          { label: 'Approve Requests', path: '/approvals', icon: 'fas fa-check-double' },
          { label: 'Team Performance', path: '/team-performance', icon: 'fas fa-chart-line' }
        ]
      };
      
      return [...(roleActions[this.userRole] || []), ...baseActions].slice(0, 4);
    },
    getCurrentMonth() {
      return new Date().toLocaleDateString('en-US', { month: 'long' });
    },
    getCurrentDate() {
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return new Date().toLocaleDateString('en-US', options);
    },
    formatTime(dateTime) {
      if (!dateTime) return '';
      const date = new Date(dateTime);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
    },
    formatDay(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.getDate();
    },
    formatMonth(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short' });
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Welcome Section */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.welcome-content {
  max-width: 70%;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, #2c3e50, #4ca1af);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-subtitle {
  font-size: 1.1rem;
  color: #6c757d;
}

.current-date {
  background: #f8f9fa;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.date-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: #495057;
}

/* Stats Cards */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border-left: 4px solid;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.stat-card-1 { border-left-color: #667eea; }
.stat-card-2 { border-left-color: #43e97b; }
.stat-card-3 { border-left-color: #fa709a; }
.stat-card-4 { border-left-color: #4facfe; }

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.2rem;
  color: white;
}

.stat-icon-1 { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-icon-2 { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.stat-icon-3 { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.stat-icon-4 { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
  color: #2c3e50;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.75rem;
  display: flex;
  align-items: center;
}

/* Quick Actions */
.quick-actions-section {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.section-header i {
  font-size: 1.2rem;
  color: #667eea;
}

.section-header h2 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  color: #2c3e50;
}

.view-all-link {
  font-size: 0.9rem;
  color: #667eea;
  text-decoration: none;
  transition: all 0.3s ease;
}

.view-all-link:hover {
  color: #4facfe;
  text-decoration: underline;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  border-radius: 8px;
  text-align: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 120px;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.action-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-card:hover::after {
  opacity: 1;
}

.action-icon {
  font-size: 2rem;
  margin-bottom: 0.8rem;
}

.action-label {
  font-size: 1rem;
  font-weight: 500;
}

/* Gradient backgrounds for action cards */
.action-card:nth-child(1) { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.action-card:nth-child(2) { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.action-card:nth-child(3) { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.action-card:nth-child(4) { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }

/* Recent Activity Section */
.recent-activity-section {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.activity-item:hover {
  background: #e9ecef;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
  font-size: 1rem;
  flex-shrink: 0;
}

.bg-success { background: #28a745; }
.bg-info { background: #17a2b8; }
.bg-warning { background: #ffc107; }
.bg-danger { background: #dc3545; }

.activity-details {
  flex: 1;
}

.activity-message {
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
}

.activity-time {
  font-size: 0.8rem;
  display: flex;
  align-items: center;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.empty-state p {
  margin-bottom: 0;
}

/* Upcoming Events Section */
.upcoming-events-section {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.event-item:hover {
  background: #e9ecef;
}

.event-date {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.event-day {
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1;
}

.event-month {
  font-size: 0.7rem;
  text-transform: uppercase;
  line-height: 1;
  margin-top: 0.1rem;
}

.event-details {
  flex: 1;
}

.event-title {
  font-size: 1rem;
  margin-bottom: 0.25rem;
  color: #2c3e50;
}

.event-time {
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
}

.event-description {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .dashboard-container {
    padding: 1.5rem;
  }
  
  .welcome-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .welcome-content {
    max-width: 100%;
    margin-bottom: 1rem;
  }
  
  .current-date {
    margin-top: 1rem;
  }
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: 1fr 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 576px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .welcome-title {
    font-size: 1.5rem;
  }
  
  .section-header h2 {
    font-size: 1.1rem;
  }
}
</style>
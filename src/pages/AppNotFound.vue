<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-animation">
        <div class="error-circle">
          <span class="error-number">4</span>
          <div class="error-icon">
            <i class="fas fa-question" aria-hidden="true"></i>
          </div>
          <span class="error-number">4</span>
        </div>
      </div>
      
      <h1 class="error-title">Oops! Page Not Found</h1>
      <p class="error-message">
        The page you're looking for doesn't exist or has been moved.
        <br>
        Here are some helpful links instead:
      </p>
      
      <div class="suggested-links">
        <router-link 
          v-for="link in suggestedLinks" 
          :key="link.path" 
          :to="link.path" 
          class="suggested-link"
        >
          <i :class="link.icon" aria-hidden="true"></i>
          {{ link.label }}
        </router-link>
      </div>
      
      <div class="action-buttons">
        <router-link to="/dashboard" class="home-btn">
          <i class="fas fa-home" aria-hidden="true"></i>
          <span>Go to Dashboard</span>
        </router-link>
        <button @click="goBack" class="back-btn">
          <i class="fas fa-arrow-left" aria-hidden="true"></i>
          <span>Go Back</span>
        </button>
      </div>
    </div>
    
    <div class="not-found-footer">
      <p>Need help? <router-link to="/support">Contact Support</router-link></p>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppNotFound",
  data() {
    return {
      suggestedLinks: [
        { label: 'Employee Directory', path: '/employees', icon: 'fas fa-users' },
        { label: 'Attendance', path: '/attendance', icon: 'fas fa-clock' },
        { label: 'Payroll', path: '/payroll', icon: 'fas fa-money-bill-wave' },
        { label: 'Announcements', path: '/announcements', icon: 'fas fa-bullhorn' }
      ]
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  position: relative;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.not-found-content {
  text-align: center;
  max-width: 700px;
  width: 100%;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.error-animation {
  margin-bottom: 2rem;
}

.error-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 0 auto 2rem;
  width: 220px;
  height: 220px;
}

.error-number {
  font-size: 5rem;
  font-weight: 800;
  color: #667eea;
  position: relative;
  z-index: 1;
  animation: bounce 2s infinite alternate;
}

.error-number:first-child {
  margin-right: -10px;
  animation-delay: 0.1s;
}

.error-number:last-child {
  margin-left: -10px;
  animation-delay: 0.2s;
}

.error-icon {
  position: absolute;
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  animation: pulse 2s infinite, rotate 4s infinite linear;
  z-index: 2;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #2c3e50, #4ca1af);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.error-message {
  font-size: 1.2rem;
  color: #6c757d;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.suggested-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.suggested-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-decoration: none;
  color: #495057;
  transition: all 0.3s ease;
}

.suggested-link:hover {
  background: #e9ecef;
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.suggested-link i {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #667eea;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.home-btn, .back-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  font-size: 1rem;
}

.home-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.home-btn:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(102, 126, 234, 0.4);
  color: white;
}

.back-btn {
  background: white;
  color: #495057;
  border: 1px solid #dee2e6;
}

.back-btn:hover {
  background: #f8f9fa;
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.not-found-footer {
  margin-top: 2rem;
  text-align: center;
  color: #6c757d;
  font-size: 0.9rem;
}

.not-found-footer a {
  color: #667eea;
  text-decoration: none;
}

.not-found-footer a:hover {
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .not-found-content {
    padding: 1.5rem;
  }
  
  .error-circle {
    width: 180px;
    height: 180px;
  }
  
  .error-icon {
    width: 70px;
    height: 70px;
    font-size: 2rem;
  }
  
  .error-title {
    font-size: 1.8rem;
  }
  
  .error-message {
    font-size: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .home-btn, .back-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .error-number {
    font-size: 3.5rem;
  }
  
  .error-circle {
    width: 150px;
    height: 150px;
  }
  
  .error-icon {
    width: 60px;
    height: 60px;
    font-size: 1.8rem;
  }
  
  .suggested-links {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
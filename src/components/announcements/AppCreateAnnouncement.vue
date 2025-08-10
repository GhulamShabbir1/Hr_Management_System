<template>
  <div class="modal-backdrop fade-in">
    <div class="modal-content zoom-in">
      <div class="modal-header bg-primary text-white">
        <h3 class="modal-title h5">Create Announcement</h3>
        <button type="button" class="close text-white" @click="$emit('close')">
          <span>&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="submitForm">
          <div class="mb-3 form-group">
            <label class="form-label">Title</label>
            <input 
              v-model="form.title" 
              type="text" 
              required 
              class="form-control fade-in" 
              style="--animation-order: 1"
            />
          </div>
          <div class="mb-3 form-group">
            <label class="form-label">Content</label>
            <textarea 
              v-model="form.content" 
              required 
              class="form-control fade-in" 
              rows="4"
              style="--animation-order: 2"
            ></textarea>
          </div>
          <div class="mb-4 form-group">
            <label class="form-label">Date</label>
            <input 
              v-model="form.date" 
              type="date" 
              required 
              class="form-control fade-in" 
              style="--animation-order: 3"
            />
          </div>

          <div class="d-flex justify-content-end">
            <button 
              type="button" 
              @click="$emit('close')" 
              class="btn btn-outline-secondary mr-2 fade-in-left"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary fade-in-right"
            >
              Create Announcement
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        title: "",
        message: "",
        date: "",
        is_active: true
      },
    };
  },
  methods: {
    submitForm() {
      this.$emit("created", { ...this.form, emailSent: false });
    },
  },
};
</script>

<style scoped>
/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  background-color: white;
  border-radius: 0.3rem;
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 1.5rem;
}

.close {
  font-size: 1.5rem;
  font-weight: bold;
  opacity: 0.5;
  cursor: pointer;
  background: transparent;
  border: 0;
}

.close:hover {
  opacity: 1;
}

/* Animations */
.fade-in {
  animation: fadeIn 0.5s ease forwards;
  opacity: 0;
}

.zoom-in {
  animation: zoomIn 0.3s ease forwards;
}

.fade-in-left {
  animation: fadeInLeft 0.5s ease forwards;
}

.fade-in-right {
  animation: fadeInRight 0.5s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Animation delays */
.form-group:nth-child(1) .fade-in {
  animation-delay: 0.1s;
}
.form-group:nth-child(2) .fade-in {
  animation-delay: 0.2s;
}
.form-group:nth-child(3) .fade-in {
  animation-delay: 0.3s;
}

/* Form Styles */
.form-control {
  transition: all 0.3s ease;
  border: 1px solid #ced4da;
}

.form-control:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn {
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0069d9;
  border-color: #0062cc;
}
</style>
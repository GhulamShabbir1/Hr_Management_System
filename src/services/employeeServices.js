// src/services/employeeService.js
export default {
  employees: [
    { id: 1, name: "Ali Khan", email: "ali@example.com", role: "Developer", active: true },
    { id: 2, name: "Sara Ahmed", email: "sara@example.com", role: "Designer", active: true },
    { id: 3, name: "Omar Malik", email: "omar@example.com", role: "HR", active: false },
  ],

  getAll() {
    return Promise.resolve(this.employees);
  },

  getById(id) {
    const employee = this.employees.find(e => e.id === parseInt(id));
    return Promise.resolve(employee);
  },

  add(employee) {
    employee.id = this.employees.length + 1;
    this.employees.push(employee);
    return Promise.resolve(employee);
  },

  update(id, updatedData) {
    const index = this.employees.findIndex(e => e.id === parseInt(id));
    if (index !== -1) {
      this.employees[index] = { ...this.employees[index], ...updatedData };
      return Promise.resolve(this.employees[index]);
    }
    return Promise.reject("Employee not found");
  },

  toggleStatus(id) {
    const employee = this.employees.find(e => e.id === parseInt(id));
    if (employee) {
      employee.active = !employee.active;
      return Promise.resolve(employee);
    }
    return Promise.reject("Employee not found");
  }
};

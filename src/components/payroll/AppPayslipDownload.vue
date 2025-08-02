<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">Payslip for {{ employee.name }}</h2>
    <div class="border p-4 rounded shadow-md bg-white">
      <p><strong>Employee:</strong> {{ employee.name }}</p>
      <p><strong>Basic Salary:</strong> {{ employee.basic }} PKR</p>
      <p><strong>Bonus:</strong> {{ employee.bonus }} PKR</p>
      <p><strong>Deductions:</strong> {{ employee.deduction }} PKR</p>
      <hr class="my-2" />
      <p><strong>Net Pay:</strong> {{ netPay }} PKR</p>
    </div>
    <div class="mt-4">
      <button @click="downloadPayslip" class="bg-blue-600 text-white px-4 py-2 rounded">
        Download Payslip
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppPayslipDownload",
  props: ["employee"],
  computed: {
    netPay() {
      return (this.employee.basic + this.employee.bonus - this.employee.deduction).toFixed(2);
    }
  },
  methods: {
    downloadPayslip() {
      const content = `
        Payslip for ${this.employee.name}\n
        Basic Salary: ${this.employee.basic} PKR\n
        Bonus: ${this.employee.bonus} PKR\n
        Deductions: ${this.employee.deduction} PKR\n
        Net Pay: ${this.netPay} PKR
      `;
      const blob = new Blob([content], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${this.employee.name}_Payslip.txt`;
      link.click();
    }
  }
};
</script>

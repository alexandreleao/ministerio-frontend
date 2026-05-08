<script setup>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js'

// Registrar os módulos do Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  chartOptions: {
    type: Object,
    default: () => ({
      responsive: true,
      maintainAspectRatio: false
    })
  }
})
</script>

<template>
  <div style="height: 300px; position: relative;">
    <Pie :data="props.chartData" :options="props.chartOptions" />
  </div>
</template>
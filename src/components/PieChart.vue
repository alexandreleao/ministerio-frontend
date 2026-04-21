<script setup>
import { Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

defineProps({
  chartData: Object
});
</script>

<template>
  <Pie :data="chartData" />
</template>
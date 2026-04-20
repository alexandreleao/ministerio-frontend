<script setup>
import { ref, onMounted, nextTick, computed } from "vue";
import api from "../services/api";
import Chart from "chart.js/auto";

const stats = ref(null);
const weeks = ref([]);
const selectedWeek = ref("");

let typeChart = null;
let studentChart = null;

// 📥 carregar semanas
async function loadWeeks() {
  const res = await api.get("/weeks");
  weeks.value = res.data.data;
}

// 📥 carregar stats (com filtro)
async function loadStats() {
  try {
    const url = selectedWeek.value
      ? `/assignments/stats?weekId=${selectedWeek.value}`
      : `/assignments/stats`;

    const res = await api.get(url);
    stats.value = res.data.data;

    await nextTick();
    renderCharts();

  } catch (err) {
    console.error(err);
  }
}

// 🧠 ranking ordenado
const ranking = computed(() => {
  if (!stats.value) return [];

  return Object.entries(stats.value.byStudent || {})
    .sort((a, b) => b[1] - a[1]);
});

// 📊 gráficos
function renderCharts() {
  if (!stats.value) return;

  const types = stats.value.byType || {};
  const students = stats.value.byStudent || {};

  // 🟦 BARRAS (TIPOS)
  const ctx1 = document.getElementById("typeChart");
  if (typeChart) typeChart.destroy();

  typeChart = new Chart(ctx1, {
    type: "bar",
    data: {
      labels: Object.keys(types),
      datasets: [
        {
          label: "Por Tipo",
          data: Object.values(types)
        }
      ]
    }
  });

  // 🟠 PIZZA (PARTICIPAÇÃO)
  const ctx2 = document.getElementById("studentChart");
  if (studentChart) studentChart.destroy();

  studentChart = new Chart(ctx2, {
    type: "pie",
    data: {
      labels: Object.keys(students),
      datasets: [
        {
          data: Object.values(students)
        }
      ]
    }
  });
}

onMounted(async () => {
  await loadWeeks();
  await loadStats();
});
</script>

<template>
  <div class="dashboard">
    <h1>📊 Dashboard Avançado</h1>

    <!-- 🔍 FILTRO -->
    <div class="filter">
      <label>Filtrar por semana:</label>
      <select v-model="selectedWeek" @change="loadStats">
        <option value="">Todas</option>
        <option v-for="w in weeks" :key="w.id" :value="w.id">
          {{ new Date(w.startDate).toLocaleDateString() }}
        </option>
      </select>
    </div>

    <div v-if="!stats">Carregando...</div>

    <div v-else>
      <!-- 🔢 CARDS -->
      <div class="cards">
        <div class="card">
          <h3>Total</h3>
          <p>{{ stats.totalAssignments }}</p>
        </div>

        <div class="card">
          <h3>Tipos</h3>
          <p>{{ Object.keys(stats.byType || {}).length }}</p>
        </div>

        <div class="card">
          <h3>Pessoas</h3>
          <p>{{ Object.keys(stats.byStudent || {}).length }}</p>
        </div>
      </div>

      <!-- 📊 GRÁFICOS -->
      <div class="charts">
        <div class="chart-box">
          <h3>📋 Tipos</h3>
          <canvas id="typeChart"></canvas>
        </div>

        <div class="chart-box">
          <h3>👥 Participação</h3>
          <canvas id="studentChart"></canvas>
        </div>
      </div>

      <!-- 🏆 RANKING -->
      <div class="ranking">
        <h3>🏆 Ranking de Participação</h3>
        <ul>
          <li v-for="(item, index) in ranking" :key="item[0]">
            <strong>#{{ index + 1 }}</strong>
            {{ item[0] }} - {{ item[1] }} vezes
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
}

.filter {
  margin-bottom: 20px;
}

/* CARDS */
.cards {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  font-size: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

/* GRÁFICOS */
.charts {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.chart-box {
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

/* RANKING */
.ranking {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}
</style>
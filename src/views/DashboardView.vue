<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../services/api";
import PieChart from "../components/PieChart.vue";
import { logout } from "../services/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const stats = ref(null);

function handleLogout() {
  logout();
  router.push("/login");
}

const typeChartData = computed(() => {
  if (!stats.value || !stats.value.byType) return null;
  return {
    labels: Object.keys(stats.value.byType),
    datasets: [{
      data: Object.values(stats.value.byType),
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
    }]
  };
});

const reasonChartData = computed(() => {
  if (!stats.value || !stats.value.declineReasons) return null;
  const keys = Object.keys(stats.value.declineReasons);
  if (keys.length === 0) return null;

  return {
    labels: keys,
    datasets: [{
      data: Object.values(stats.value.declineReasons),
      backgroundColor: ['#f87171', '#fb923c', '#fbbf24']
    }]
  };
});

async function loadStats() {
  try {
    const res = await api.get("/assignments/stats");
    stats.value = res.data.data;
  } catch (err) {
    console.error("Erro ao carregar stats:", err);
  }
}

onMounted(loadStats);
</script>

<template>
  <div class="dashboard-container">   
    <header class="dashboard-header">
      <h1>📊 Dashboard do Ministério</h1>
     
    </header>
      
    <div v-if="!stats" class="loading-state">
      <p>Carregando dados...</p>
    </div>

    <div v-else class="dashboard-content">

      <div class="cards-grid">
        <div class="card">
          <span class="card-label">Total de Designações</span>
          <p class="card-value">{{ stats.totalAssignments }}</p>
        </div>

        <div class="card danger">
          <span class="card-label">Recusas</span>
          <p class="card-value">{{ stats.declined }}</p>
        </div>

        <div class="card warning">
          <span class="card-label">Encorajamento</span>
          <p class="card-value">{{ stats.encouragement }}</p>
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-box">
          <h3>📋 Tipos de Designação</h3>
          <div class="chart-container">
            <PieChart v-if="typeChartData" :chartData="typeChartData" />
            <p v-else>Sem dados para exibir</p>
          </div>
        </div>

        <div class="chart-box">
          <h3>❌ Motivos de Recusa</h3>
          <div class="chart-container">
            <PieChart v-if="reasonChartData" :chartData="reasonChartData" />
            <div v-else class="empty-state">Nenhuma recusa registrada</div>
          </div>
        </div>
      </div>

      <div class="details-grid">
        <section class="details-card">
          <h2>👥 Participação</h2>
          <ul class="stats-list">
            <li v-for="(count, name) in stats.byStudent" :key="name">
              <span>{{ name }}</span>
              <strong>{{ count }}</strong>
            </li>
            <li v-if="!Object.keys(stats.byStudent).length" class="empty-text">Nenhum registro.</li>
          </ul>
        </section>

        <section class="details-card">
          <h2>⚠️ Alertas</h2>
          <div v-if="stats.encouragement > 0" class="alert-box">
            Existem {{ stats.encouragement }} pessoas que precisam de encorajamento nesta semana.
          </div>
          <div v-else class="empty-text">Tudo em dia!</div>
        </section>
      </div>

    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 25px;
  background-color: #f1f5f9;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.dashboard-header h1 {
  color: #1e293b;
  margin: 0;
}

/* Grid de Cards */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  text-align: center;
}

.card-label {
  color: #64748b;
  font-size: 0.9rem;
  text-transform: uppercase;
  font-weight: 600;
}

.card-value {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 10px 0 0;
  color: #0f172a;
}

.card.danger { border-left: 5px solid #ef4444; }
.card.warning { border-left: 5px solid #f59e0b; }

/* Gráficos */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-box {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.chart-container {
  height: 300px; /* Isso impede o gráfico de ficar gigante */
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Listas */
.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.details-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
}

.stats-list {
  list-style: none;
  padding: 0;
}

.stats-list li {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
}

.alert-box {
  padding: 15px;
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  font-weight: 500;
}

.btn-logout {
  background: #334155;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-logout:hover { background: #0f172a; }

.empty-text { color: #94a3b8; font-style: italic; }
</style>
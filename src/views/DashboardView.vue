<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";
import PieChart from "../components/PieChart.vue";
import { computed } from "vue";
import { logout } from "../services/auth";
import { useRouter } from "vue-router";

const router = useRouter();

function handleLogout() {
  logout();
  router.push("/login");
}
const typeChartData = computed(() => {
  if (!stats.value) return null;

  return {
    labels: Object.keys(stats.value.byType),
    datasets: [
      {
        data: Object.values(stats.value.byType)
      }
    ]
  };
});

const reasonChartData = computed(() => {
  if (!stats.value) return null;

  return {
    labels: Object.keys(stats.value.declineReasons),
    datasets: [
      {
        data: Object.values(stats.value.declineReasons)
      }
    ]
  };
});

const stats = ref(null);

async function loadStats() {
  try {
    const res = await api.get("/assignments/stats");
    stats.value = res.data.data;
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar dashboard");
  }
}

onMounted(loadStats);
</script>

<template>
  <div class="dashboard">   
    <h1>📊 Dashboard</h1> 
      
    <div v-if="!stats">Carregando...</div>

    <div v-else>

      <!-- 🔥 CARDS PRINCIPAIS -->
      <div class="cards">

        <div class="card">
          <h3>Total</h3>
          <p>{{ stats.totalAssignments }}</p>
        </div>

        <div class="card danger">
          <h3>Recusas</h3>
          <p>{{ stats.declined }}</p>
        </div>

        <div class="card warning">
          <h3>Encorajamento</h3>
          <p>{{ stats.encouragement }}</p>
        </div>

      </div>

      <!-- 📊 POR TIPO -->
      <div class="section">
        <h2>📋 Por Tipo</h2>
        <ul>
          <li v-for="(count, type) in stats.byType" :key="type">
            {{ type }}: <strong>{{ count }}</strong>
          </li>
        </ul>
      </div>

      <!-- 🥧 GRÁFICOS -->
<div class="charts">

  <div class="chart-box">
    <h3>📋 Tipos de Designação</h3>
    <PieChart v-if="typeChartData" :chartData="typeChartData" />
  </div>

  <div class="chart-box">
    <h3>❌ Motivos de Recusa</h3>
    <PieChart 
      v-if="reasonChartData && Object.keys(stats.declineReasons).length"
      :chartData="reasonChartData" 
    />
  </div>

</div>

      <!-- 👥 PARTICIPAÇÃO -->
      <div class="section">
        <h2>👥 Participação</h2>
        <ul>
          <li v-for="(count, name) in stats.byStudent" :key="name">
            {{ name }}: <strong>{{ count }}</strong>
          </li>
        </ul>
      </div>

      <!-- ❌ MOTIVOS DE RECUSA -->
      <div class="section">
        <h2>❌ Motivos de Recusa</h2>

        <div v-if="Object.keys(stats.declineReasons).length === 0">
          Nenhuma recusa registrada
        </div>

        <ul v-else>
          <li
            v-for="(count, reason) in stats.declineReasons"
            :key="reason"
          >
            {{ reason }}: <strong>{{ count }}</strong>
          </li>
        </ul>
      </div>

      <!-- ❤️ ALERTA -->
      <div class="alert" v-if="stats.encouragement > 0">
        ⚠️ Existem pessoas que precisam de encorajamento!
      </div>

    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
}

/* CARDS */
.cards {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.card {
  flex: 1;
  background: #f3f4f6;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
}

.card p {
  font-size: 24px;
  font-weight: bold;
}

.card.danger {
  background: #fee2e2;
  color: #991b1b;
}

.card.warning {
  background: #fef3c7;
  color: #92400e;
}

/* SEÇÕES */
.section {
  margin-top: 25px;
}

/* ALERTA */
.alert {
  margin-top: 20px;
  padding: 15px;
  background: #fca5a5;
  color: #7f1d1d;
  border-radius: 8px;
  font-weight: bold;
}



.charts {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.chart-box {
  flex: 1;
  background: white;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #eee;
}
</style>
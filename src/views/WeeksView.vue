<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const weeks = ref([]);
const loading = ref(false);
const router = useRouter();

// 📅 formatar data
function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR");
}

// 📥 carregar semanas
async function loadWeeks() {
  try {
    const response = await api.get("/weeks");
    weeks.value = response.data.data || response.data;
  } catch (err) {
    console.error("Erro ao carregar semanas:", err);
  }
}

// 🧠 pegar id independente do formato da API
function extractWeekId(response) {
  if (response.data?.data?.id) return response.data.data.id;
  if (response.data?.id) return response.data.id;

  throw new Error("Não foi possível obter o ID da semana");
}

// ⚡ gerar nova semana
async function generateWeek() {
  try {
    loading.value = true;

    const weekResponse = await api.post("/weeks");

    console.log("weekResponse:", weekResponse.data);

    const weekId = extractWeekId(weekResponse);

    await api.post("/generate-week", { weekId });

    router.push(`/week/${weekId}`);

  } catch (err) {
    console.error("Erro ao gerar semana:", err);
    alert(err.response?.data?.error || err.message || "Erro ao gerar semana");
  } finally {
    loading.value = false;
  }
}

// 🔄 regenerar semana
async function regenerateWeek(weekId) {
  if (!confirm("Deseja gerar novamente essa semana?")) return;

  try {
    loading.value = true;

    await api.post("/generate-week", { weekId });

    alert("Semana atualizada!");
    await loadWeeks();

  } catch (err) {
    console.error("Erro ao regenerar:", err);
    alert(err.response?.data?.error || "Erro ao regenerar semana");
  } finally {
    loading.value = false;
  }
}

// 👉 navegar
function goToAssignments(id) {
  router.push(`/week/${id}`);
}

onMounted(loadWeeks);
</script>

<template>
  <div style="padding: 20px">
    <h1>📅 Semanas</h1>

    <!-- BOTÃO -->
    <button @click="generateWeek" :disabled="loading">
      {{ loading ? "Gerando..." : "⚡ Gerar Nova Semana" }}
    </button>

    <hr style="margin: 20px 0" />

    <!-- LISTA -->
    <div v-if="weeks.length === 0">
      Nenhuma semana cadastrada.
    </div>

    <ul>
      <li
        v-for="week in weeks"
        :key="week.id"
        style="margin-bottom: 15px"
      >
        <strong>
          Semana de {{ formatDate(week.startDate) }}
        </strong>

        <br />

        <button @click="goToAssignments(week.id)">
          📋 Ver Designações
        </button>

        <button
          @click="regenerateWeek(week.id)"
          style="margin-left: 10px"
        >
          🔄 Regerar
        </button>
      </li>
    </ul>
  </div>
</template>
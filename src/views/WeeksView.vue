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

// 🗑️ excluir (limpar designações da semana)
async function deleteWeekAssignments(weekId) {
  if (!confirm("Deseja excluir todas as designações desta semana?")) return;

  try {
    loading.value = true;

    await api.post("/clear-week", { weekId });

    alert("Designações excluídas!");
    await loadWeeks();

  } catch (err) {
    console.error("Erro ao excluir:", err);
    alert(err.response?.data?.error || "Erro ao excluir");
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
  <div class="container">
    <h1>📅 Semanas</h1>

    <!-- BOTÃO GERAR -->
    <button class="btn primary" @click="generateWeek" :disabled="loading">
      {{ loading ? "Gerando..." : "⚡ Gerar Nova Semana" }}
    </button>

    <hr class="divider" />

    <!-- LISTA -->
    <div v-if="weeks.length === 0">
      Nenhuma semana cadastrada.
    </div>

    <ul class="list">
      <li v-for="week in weeks" :key="week.id" class="item">
        <strong>
          Semana de {{ formatDate(week.startDate) }}
        </strong>

        <div class="actions">
          <button class="btn" @click="goToAssignments(week.id)">
            📋 Ver
          </button>

          <button
            class="btn success"
            @click="regenerateWeek(week.id)"
          >
            🔄 Regenerar
          </button>

          <button
            class="btn danger"
            @click="deleteWeekAssignments(week.id)"
          >
            🗑️ Excluir
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
}

.divider {
  margin: 20px 0;
}

/* LISTA */
.list {
  list-style: none;
  padding: 0;
}

.item {
  margin-bottom: 15px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
}

/* BOTÕES */
.actions {
  margin-top: 10px;
}

.btn {
  margin-right: 10px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.primary {
  background: #3b82f6;
  color: white;
}

.success {
  background: #10b981;
  color: white;
}

.danger {
  background: #ef4444;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}
</style>
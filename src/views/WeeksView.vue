<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const weeks = ref([]);
const loading = ref(false);
const router = useRouter();

function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR");
}

async function loadWeeks() {
  try {
    const response = await api.get("/weeks");
    weeks.value = response.data.data || response.data;
  } catch (err) {
    console.error("Erro ao carregar semanas:", err);
  }
}

function goToManualCreate(weekId) {
  router.push({
    path: "/create-assignment",
    query: { weekId: weekId }
  });
}

function goToAssignments(id) {
  router.push(`/week/${id}`);
}

async function deleteFullWeek(id) {
  if (!confirm("Tem certeza que deseja excluir esta semana e todas as suas designações?")) return;
  try {
    await api.delete(`/weeks/${id}`);
    await loadWeeks();
    alert("Semana excluída!");
  } catch (err) {
    alert("Erro ao excluir semana.");
  }
}

onMounted(loadWeeks);
</script>

<template>
  <div class="container">
    <h1>📅 Gerenciar Semanas</h1>

    <button class="btn primary" @click="generateWeek" :disabled="loading">
      {{ loading ? "Gerando..." : "⚡ Gerar Semana Automática" }}
    </button>

    <hr class="divider" />

    <div v-if="weeks.length === 0">Nenhuma semana encontrada.</div>

    <ul class="list">
      <li v-for="week in weeks" :key="week.id" class="item">
        <div class="week-info">
          <strong>Semana de {{ formatDate(week.startDate) }}</strong>
          <!-- Pequeno resumo se houver designações -->
          <p v-if="week.assignments" class="summary">
            {{ week.assignments.length }} designações nesta semana.
          </p>
        </div>

        <div class="actions">
          <!-- BOTÃO VER (Visualização) -->
          <button class="btn info" @click="goToAssignments(week.id)">
            📋 Ver Detalhes
          </button>

          <!-- ➕ CRIAÇÃO MANUAL -->
          <button class="btn manual" @click="goToManualCreate(week.id)">
            ➕ Add Manual
          </button>

          <!-- EXCLUIR -->
          <button class="btn danger" @click="deleteFullWeek(week.id)">
            🗑️ Excluir
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container { padding: 20px; max-width: 900px; margin: 0 auto; }
.divider { margin: 20px 0; border: 0; border-top: 1px solid #ddd; }
.list { list-style: none; padding: 0; }
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.summary { font-size: 0.85rem; color: #64748b; margin-top: 4px; }
.actions { display: flex; gap: 8px; align-items: center; }

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.primary { background: #2563eb; color: white; }
.info { background: #475569; color: white; }
.manual { background: #7c3aed; color: white; }
.danger { background: #ef4444; color: white; }

.btn:hover { transform: translateY(-1px); filter: brightness(1.1); }
</style>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const weeks = ref([]);
const loading = ref(false);
const router = useRouter();

// 🎯 formatar data (padrão BR)
function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

// 📥 carregar semanas
async function loadWeeks() {
  try {
    const response = await api.get("/weeks");
    weeks.value = response.data.data;
  } catch (err) {
    console.error("Erro ao carregar semanas", err);
  }
}

// ⚡ gerar nova semana + designações
async function generateWeek() {
  try {
    loading.value = true;

    // cria semana com data atual
    const weekResponse = await api.post("/weeks", {
      startDate: new Date()
    });

    const weekId = weekResponse.data.id;

    // gera designações automáticas
    await api.post("/generate-week", {
      weekId
    });

    // recarrega lista
    await loadWeeks();

  } catch (err) {
    console.error("Erro ao gerar semana", err);
  } finally {
    loading.value = false;
  }
}

// 🔗 navegar para designações
function goToAssignments(id) {
  router.push(`/week/${id}`);
}

onMounted(loadWeeks);
</script>

<template>
  <div>
    <h1>📅 Semanas</h1>

    <!-- BOTÃO -->
    <button 
      @click="generateWeek" 
      :disabled="loading"
      style="
        margin-bottom: 20px;
        padding: 10px;
        cursor: pointer;
      "
    >
      {{ loading ? "Gerando..." : "⚡ Gerar Nova Semana" }}
    </button>

    <!-- LISTA -->
    <div v-if="weeks.length === 0">
      Nenhuma semana cadastrada.
    </div>

    <div
      v-for="week in weeks"
      :key="week.id"
      style="
        border: 1px solid #ddd;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      "
    >
      <strong>
        Semana de {{ formatDate(week.startDate) }}
      </strong>

      <button 
        @click="goToAssignments(week.id)"
        style="cursor: pointer;"
      >
        Ver Designações
      </button>
    </div>
  </div>
</template>
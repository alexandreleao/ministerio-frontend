<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const weeks = ref([]);
const loading = ref(false);
const router = useRouter();

// 📅 Formatar data para o padrão brasileiro
function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR");
}

// 📥 Carregar a lista de semanas do Banco de Dados
async function loadWeeks() {
  try {
    const response = await api.get("/weeks");
    weeks.value = response.data.data || response.data;
  } catch (err) {
    console.error("Erro ao carregar semanas:", err);
  }
}

/**
 * ➕ NAVEGAÇÃO PARA CRIAÇÃO MANUAL
 * Esta função envia o usuário para o formulário que você criou,
 * passando o ID da semana na URL (query string).
 */
function goToManualCreate(weekId) {
  router.push({
    path: "/create-assignment", // Verifique se este é o path no seu router/index.js
    query: { weekId: weekId }
  });
}

// 📋 Ir para a visualização das designações já existentes
function goToAssignments(id) {
  router.push(`/week/${id}`);
}

// Restante das suas funções (generateWeek, deleteFullWeek, etc.) mantidas...

onMounted(loadWeeks);
</script>

<template>
  <div class="container">
    <h1>📅 Gerenciar Semanas</h1>

    <!-- Botão para gerar via algoritmo (automático) -->
    <button class="btn primary" @click="generateWeek" :disabled="loading">
      {{ loading ? "Gerando..." : "⚡ Gerar Semana Automática" }}
    </button>

    <hr class="divider" />

    <div v-if="weeks.length === 0">Nenhuma semana encontrada.</div>

    <ul class="list">
      <li v-for="week in weeks" :key="week.id" class="item">
        <div class="week-info">
          <strong>Semana de {{ formatDate(week.startDate) }}</strong>
        </div>

        <div class="actions">
          <!-- BOTÃO VER (Visualização) -->
          <button class="btn info" @click="goToAssignments(week.id)">
            📋 Ver Detalhes
          </button>

          <!-- ➕ NOVO BOTÃO: CRIAÇÃO MANUAL -->
          <button class="btn manual" @click="goToManualCreate(week.id)">
            ➕ Add Manual
          </button>

          <!-- Outros botões de controle -->
          <button class="btn danger" @click="deleteFullWeek(week.id)">
            🗑️ Excluir
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container { padding: 20px; max-width: 800px; margin: 0 auto; }
.divider { margin: 20px 0; border: 0; border-top: 1px solid #ddd; }
.list { list-style: none; padding: 0; }
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #eee;
  border-radius: 10px;
  background: #fdfdfd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.actions { display: flex; gap: 8px; }

.btn {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.primary { background: #3b82f6; color: white; }
.info { background: #64748b; color: white; }

/* Estilo do novo botão manual */
.manual { background: #8b5cf6; color: white; } 
.manual:hover { background: #7c3aed; }

.danger { background: #ef4444; color: white; }

.btn:hover { opacity: 0.9; }
</style>
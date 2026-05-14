<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "../services/api";

const route = useRoute();
// ✅ Inicializar sempre com array vazio para evitar erro de .length
const assignments = ref([]); 
const loading = ref(false);

// 📥 carregar designações
async function loadAssignments() {
  try {
    loading.value = true;
    const res = await api.get(`/assignments?weekId=${route.params.id}`);

    /** * ✅ PROTEÇÃO DEFINITIVA: 
     * Verificamos todos os caminhos possíveis onde os dados podem estar.
     * Se o backend retornar erro 500 ou lista vazia, garantimos um array [].
     */
    if (res.data && res.data.data) {
      assignments.value = res.data.data;
    } else if (Array.isArray(res.data)) {
      assignments.value = res.data;
    } else {
      assignments.value = [];
    }

  } catch (err) {
    console.error("Erro ao carregar:", err);
    assignments.value = []; // Garante que não fique undefined no erro
  } finally {
    loading.value = false;
  }
}

function refresh() {
  loadAssignments();
}

async function clearAssignments() {
  if (!confirm("Deseja excluir TODAS as designações desta semana?")) return;

  try {
    loading.value = true;
    await api.post("/weeks/clear", {
      weekId: Number(route.params.id)
    });
    await loadAssignments();
  } catch (err) {
    alert("Erro ao excluir");
  } finally {
    loading.value = false;
  }
}

onMounted(loadAssignments);
</script>

<template>
  <div class="container">
    <h1>📋 Designações</h1>

    <div class="actions">
      <button class="btn primary" @click="refresh" :disabled="loading">
        🔄 {{ loading ? 'Carregando...' : 'Atualizar' }}
      </button>

      <button class="btn danger" @click="clearAssignments" :disabled="loading">
        🗑️ Excluir
      </button>
    </div>

    <div v-if="loading" class="loading-state">Aguarde, carregando...</div>

    <table v-else class="table">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Aluno</th>
          <th>Ajudante</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="a in (assignments || [])" :key="a?.id">
          <td>{{ a?.type || 'N/A' }}</td>
          <td>{{ a?.student?.name || 'Não atribuído' }}</td>
          <td>{{ a?.helper?.name || "-" }}</td>
        </tr>

        <tr v-if="!assignments || assignments.length === 0">
          <td colspan="3" class="empty-msg">Nenhuma designação encontrada para esta semana.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.container { padding: 20px; }
.actions { margin-bottom: 15px; }

.btn {
  margin-right: 10px;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.primary { background: #3b82f6; color: white; }
.danger { background: #ef4444; color: white; }

.table { width: 100%; border-collapse: collapse; background: white; }
.table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
.table th { background: #f3f4f6; }
.empty-msg { text-align: center; padding: 20px; color: #666; }
.loading-state { padding: 20px; font-style: italic; color: #3b82f6; }
</style>
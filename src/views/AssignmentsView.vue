<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "../services/api";

const route = useRoute();
const assignments = ref([]);
const loading = ref(false);

// 📥 carregar designações
async function loadAssignments() {
  try {
    loading.value = true;

    const res = await api.get(
      `/assignments?weekId=${route.params.id}`
    );

    assignments.value = res.data.data;

  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// 🔄 atualizar (reload)
function refresh() {
  loadAssignments();
}

// 🗑️ limpar semana
async function clearAssignments() {
  if (!confirm("Deseja excluir TODAS as designações desta semana?")) return;

  try {
    loading.value = true;

    await api.post("/clear-week", {
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

    <!-- 🔥 AÇÕES -->
    <div class="actions">
      <button class="btn primary" @click="refresh">
        🔄 Atualizar
      </button>

      <button class="btn danger" @click="clearAssignments">
        🗑️ Excluir
      </button>
    </div>

    <!-- LOADING -->
    <div v-if="loading">Carregando...</div>

    <!-- 📊 TABELA -->
    <table v-else class="table">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Aluno</th>
          <th>Ajudante</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="a in assignments" :key="a.id">
          <td>{{ a.type }}</td>
          <td>{{ a.student?.name }}</td>
          <td>{{ a.helper?.name || "-" }}</td>
        </tr>

        <tr v-if="assignments.length === 0">
          <td colspan="3">Nenhuma designação</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
}

/* BOTÕES */
.actions {
  margin-bottom: 15px;
}

.btn {
  margin-right: 10px;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.primary {
  background: #3b82f6;
  color: white;
}

.danger {
  background: #ef4444;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}

/* TABELA */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.table th {
  background: #f3f4f6;
}
</style>
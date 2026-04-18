<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();

// 📦 estados
const students = ref([]);
const weeks = ref([]);

const type = ref("Revisita");
const studentId = ref("");
const helperId = ref("");
const weekId = ref("");
const loading = ref(false);

// 🎯 tipos
const types = [
  "Iniciando Conversa",
  "Revisita",
  "Estudo Bíblico",
  "Discurso"
];

// 🧠 regra
const needsHelper = computed(() => type.value !== "Discurso");

// 📅 formatar data
function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pt-BR");
}

// 📥 carregar dados
async function loadData() {
  try {
    const s = await api.get("/students");
    students.value = s.data.data;

    const w = await api.get("/weeks");
    weeks.value = w.data.data;
  } catch (err) {
    console.error(err);
  }
}

// ➕ criar designação
async function createAssignment() {
  if (!studentId.value || !weekId.value) {
    alert("Selecione aluno e semana");
    return;
  }

  if (needsHelper.value && !helperId.value) {
    alert("Selecione um ajudante");
    return;
  }

  if (studentId.value === helperId.value) {
    alert("Aluno e ajudante não podem ser iguais");
    return;
  }

  try {
    loading.value = true;

    await api.post("/assignments", {
      type: type.value,
      title: type.value,
      duration: 5,
      studentId: Number(studentId.value),
      helperId: needsHelper.value ? Number(helperId.value) : null,
      weekId: Number(weekId.value)
    });

    // 🔥 redireciona para semana
    router.push(`/week/${weekId.value}`);

  } catch (err) {
    console.error(err);
    alert("Erro ao criar designação");
  } finally {
    loading.value = false;
  }
}

onMounted(loadData);
</script>

<template>
  <div>
    <h1>➕ Nova Designação</h1>

    <!-- TIPO -->
    <div style="margin-bottom: 10px">
      <label>Tipo:</label><br />
      <select v-model="type">
        <option v-for="t in types" :key="t" :value="t">
          {{ t }}
        </option>
      </select>
    </div>

    <!-- ALUNO -->
    <div style="margin-bottom: 10px">
      <label>Aluno:</label><br />
      <select v-model="studentId">
        <option value="">Selecione</option>
        <option v-for="s in students" :key="s.id" :value="s.id">
          {{ s.name }}
        </option>
      </select>
    </div>

    <!-- AJUDANTE -->
    <div v-if="needsHelper" style="margin-bottom: 10px">
      <label>Ajudante:</label><br />
      <select v-model="helperId">
        <option value="">Selecione</option>
        <option v-for="s in students" :key="s.id" :value="s.id">
          {{ s.name }}
        </option>
      </select>
    </div>

    <!-- SEMANA -->
    <div style="margin-bottom: 10px">
      <label>Semana:</label><br />
      <select v-model="weekId">
        <option value="">Selecione</option>
        <option v-for="w in weeks" :key="w.id" :value="w.id">
          Semana de {{ formatDate(w.startDate) }}
        </option>
      </select>
    </div>

    <br />

    <!-- BOTÃO -->
    <button @click="createAssignment" :disabled="loading">
      {{ loading ? "Salvando..." : "Salvar" }}
    </button>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../services/api";

const route = useRoute();
const router = useRouter();

const week = ref(null);
const students = ref([]);
const loading = ref(false);

const form = ref({
  type: "",
  title: "",
  duration: 5,
  studentId: "",
  helperId: ""
});

// 📥 carregar dados
async function loadData() {
  try {
    const weekRes = await api.get("/weeks");
    week.value = weekRes.data.data.find(
      w => w.id == route.query.weekId
    );

    const res = await api.get("/students");
    students.value = res.data.data;

  } catch (err) {
    console.error(err);
  }
}

// 🎯 tipos dinâmicos
const types = computed(() => {
  const list = [
    "Iniciando Conversa",
    "Revisita",
    "Estudo Bíblico"
  ];

  if (week.value?.hasDemonstration) {
    list.push("Demonstração");
  }

  list.push("Discurso");

  return list;
});

// 👨 filtrar alunos para discurso
const filteredStudents = computed(() => {
  if (form.value.type === "Discurso") {
    return students.value.filter(s => s.gender === "M");
  }
  return students.value;
});

// 🔄 se mudar tipo para discurso, remove helper
watch(() => form.value.type, (newType) => {
  if (newType === "Discurso") {
    form.value.helperId = "";
  }
});

// 💾 salvar
async function createAssignment() {
  if (!form.value.type || !form.value.studentId) {
    alert("Preencha os campos obrigatórios");
    return;
  }

  try {
    loading.value = true;

    await api.post("/assignments", {
      ...form.value,
      weekId: Number(route.query.weekId)
    });

    router.push(`/week/${route.query.weekId}`);

  } catch (err) {
    alert(err.response?.data?.error || "Erro ao salvar");
  } finally {
    loading.value = false;
  }
}

onMounted(loadData);
</script>

<template>
  <div class="container">
    <h1>➕ Nova Designação</h1>

    <div class="form">

      <!-- TIPO -->
      <label>Tipo</label>
      <select v-model="form.type">
        <option disabled value="">Selecione</option>
        <option v-for="t in types" :key="t">
          {{ t }}
        </option>
      </select>

      <!-- TÍTULO -->
      <label>Título</label>
      <input v-model="form.title" placeholder="Título" />

      <!-- DURAÇÃO -->
      <label>Duração</label>
      <input v-model="form.duration" type="number" />

      <!-- ALUNO -->
      <label>Aluno</label>
      <select v-model="form.studentId">
        <option disabled value="">Selecione</option>
        <option
          v-for="s in filteredStudents"
          :key="s.id"
          :value="s.id"
        >
          {{ s.name }}
        </option>
      </select>

      <!-- AJUDANTE -->
      <label>Ajudante</label>
      <select
        v-model="form.helperId"
        :disabled="form.type === 'Discurso'"
      >
        <option value="">Sem ajudante</option>
        <option
          v-for="s in students"
          :key="s.id"
          :value="s.id"
        >
          {{ s.name }}
        </option>
      </select>

      <!-- BOTÃO -->
      <button
        class="btn primary"
        @click="createAssignment"
        :disabled="loading"
      >
        {{ loading ? "Salvando..." : "Salvar" }}
      </button>

    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  max-width: 400px;
}

.form {
  display: flex;
  flex-direction: column;
}

label {
  margin-top: 10px;
  font-weight: bold;
}

input,
select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-top: 5px;
}

.btn {
  margin-top: 20px;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.primary {
  background: #3b82f6;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}
</style>
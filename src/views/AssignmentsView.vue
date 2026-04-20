<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import api from "../services/api";

const route = useRoute();

const assignments = ref([]);
const students = ref([]);
const loading = ref(false);

// ✏️ controle de edição
const editingId = ref(null);

const editForm = ref({
  type: "",
  studentId: "",
  helperId: ""
});

// 🎯 tipos
const types = [
  "Iniciando Conversa",
  "Revisita",
  "Estudo Bíblico",
  "Discurso"
];

// 🧠 regra ajudante
const needsHelper = computed(() => {
  return editForm.value.type !== "Discurso";
});

// 📥 carregar designações
async function loadAssignments() {
  try {
    loading.value = true;

    const weekId = route.params.id;

    const response = await api.get(`/assignments?weekId=${weekId}`);
    assignments.value = response.data.data;

  } catch (err) {
    console.error("Erro ao carregar designações", err);
  } finally {
    loading.value = false;
  }
}

// 📥 carregar estudantes
async function loadStudents() {
  try {
    const res = await api.get("/students");
    students.value = res.data.data;
  } catch (err) {
    console.error("Erro ao carregar estudantes", err);
  }
}

// 🗑 excluir
async function deleteAssignment(id) {
  if (!confirm("Deseja excluir essa designação?")) return;

  try {
    await api.delete(`/assignments/${id}`);
    loadAssignments();
  } catch (err) {
    console.error("Erro ao excluir", err);
    alert("Erro ao excluir");
  }
}

// ✏️ iniciar edição
function startEdit(a) {
  editingId.value = a.id;

  editForm.value = {
    type: a.type,
    studentId: a.studentId,
    helperId: a.helperId
  };
}

// 💾 salvar edição
async function updateAssignment(id) {
  if (editForm.value.studentId === editForm.value.helperId) {
    alert("Aluno e ajudante não podem ser iguais");
    return;
  }

  try {
    await api.put(`/assignments/${id}`, {
      type: editForm.value.type,
      title: editForm.value.type,
      duration: 5,
      studentId: Number(editForm.value.studentId),
      helperId: needsHelper.value
        ? Number(editForm.value.helperId)
        : null
    });

    editingId.value = null;
    loadAssignments();

  } catch (err) {
    console.error(err);
    alert("Erro ao atualizar");
  }
}

onMounted(() => {
  loadAssignments();
  loadStudents();
});
</script>

<template>
  <div style="padding: 20px">
    <!-- VOLTAR -->
    <button @click="$router.back()" style="margin-bottom: 10px">
      ⬅ Voltar
    </button>

    <h1>📋 Designações da Semana</h1>

    <!-- LOADING -->
    <div v-if="loading">
      Carregando...
    </div>

    <!-- SEM DADOS -->
    <div v-else-if="assignments.length === 0">
      Nenhuma designação encontrada.
    </div>

    <!-- LISTA -->
    <div
      v-for="a in assignments"
      :key="a.id"
      style="
        border: 1px solid #ccc;
        padding: 15px;
        margin: 10px 0;
        border-radius: 8px;
      "
    >
      <!-- 🔁 MODO NORMAL -->
      <div v-if="editingId !== a.id">
        <h3>{{ a.type }}</h3>

        <p><strong>Aluno:</strong> {{ a.student?.name }}</p>

        <p v-if="a.helper">
          <strong>Ajudante:</strong> {{ a.helper.name }}
        </p>

        <p><strong>Duração:</strong> {{ a.duration }} min</p>

        <button @click="startEdit(a)">✏️ Editar</button>

        <button
          @click="deleteAssignment(a.id)"
          style="margin-left: 10px; color: red"
        >
          🗑 Excluir
        </button>
      </div>

      <!-- ✏️ MODO EDIÇÃO -->
      <div v-else>
        <!-- TIPO -->
        <select v-model="editForm.type">
          <option v-for="t in types" :key="t" :value="t">
            {{ t }}
          </option>
        </select>

        <br /><br />

        <!-- ALUNO -->
        <select v-model="editForm.studentId">
          <option v-for="s in students" :key="s.id" :value="s.id">
            {{ s.name }}
          </option>
        </select>

        <br /><br />

        <!-- AJUDANTE -->
        <select v-if="needsHelper" v-model="editForm.helperId">
          <option v-for="s in students" :key="s.id" :value="s.id">
            {{ s.name }}
          </option>
        </select>

        <br /><br />

        <button @click="updateAssignment(a.id)">💾 Salvar</button>

        <button @click="editingId = null" style="margin-left: 10px">
          ❌ Cancelar
        </button>
      </div>
    </div>
  </div>
</template>
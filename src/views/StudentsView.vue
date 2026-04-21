<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../services/api";

const students = ref([]);
const name = ref("");
const gender = ref("");
const loading = ref(false);
const saving = ref(false);
const search = ref("");

// 📥 carregar
async function loadStudents() {
  try {
    loading.value = true;

    const res = await api.get("/students");
    students.value = res.data.data;

  } catch (err) {
    console.error("Erro ao carregar estudantes", err);
  } finally {
    loading.value = false;
  }
}

// ➕ adicionar
async function addStudent() {
  if (!name.value.trim() || !gender.value) {
    alert("Preencha nome e sexo");
    return;
  }

  try {
    saving.value = true;

    await api.post("/students", {
      name: name.value,
      gender: gender.value
    });

    name.value = "";
    gender.value = "";
    await loadStudents();

  } catch (err) {
    console.error(err);
    alert("Erro ao cadastrar");
  } finally {
    saving.value = false;
  }
}

// 🗑️ excluir
async function deleteStudent(id) {
  if (!confirm("Excluir este estudante?")) return;

  try {
    await api.delete(`/students/${id}`);
    await loadStudents();
  } catch (err) {
    alert("Erro ao excluir");
  }
}

// 🔎 filtro
const filteredStudents = computed(() => {
  return students.value.filter(s =>
    s.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

onMounted(loadStudents);
</script>

<template>
  <div class="container">
    <h1>👨‍🎓 Estudantes</h1>

    <!-- FORM -->
    <div class="card form">
      <input
        v-model="name"
        placeholder="Nome do estudante"
        @keyup.enter="addStudent"
      />

      <select v-model="gender">
        <option disabled value="">Sexo</option>
        <option value="M">👨 Masculino</option>
        <option value="F">👩 Feminino</option>
      </select>

      <button
        class="btn primary"
        @click="addStudent"
        :disabled="saving"
      >
        {{ saving ? "Salvando..." : "Adicionar" }}
      </button>
    </div>

    <!-- BUSCA -->
    <input
      v-model="search"
      placeholder="Buscar estudante..."
      class="search"
    />

    <!-- LOADING -->
    <div v-if="loading">Carregando...</div>

    <!-- LISTA -->
    <div v-else>
      <div v-if="filteredStudents.length === 0">
        Nenhum estudante encontrado.
      </div>

      <ul class="list">
        <li
          v-for="s in filteredStudents"
          :key="s.id"
          class="item"
        >
          <div class="info">
            <span class="name">{{ s.name }}</span>
            <span class="badge">
              {{ s.gender === "M" ? "👨" : "👩" }}
            </span>
          </div>

          <button
            class="btn danger small"
            @click="deleteStudent(s.id)"
          >
            🗑️
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  max-width: 500px;
}

/* CARD */
.card {
  background: #f9fafb;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

/* FORM */
.form {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

input,
select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

/* BUSCA */
.search {
  width: 100%;
  margin-bottom: 15px;
}

/* LISTA */
.list {
  list-style: none;
  padding: 0;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 10px;
}

/* INFO */
.info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.name {
  font-weight: 500;
}

.badge {
  font-size: 18px;
}

/* BOTÕES */
.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.small {
  padding: 4px 8px;
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
</style>
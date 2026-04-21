<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../services/api";

const students = ref([]);
const name = ref("");
const gender = ref("");
const loading = ref(false);
const saving = ref(false);
const search = ref("");
const errorMsg = ref("");

// 📥 carregar
async function loadStudents() {
  try {
    loading.value = true;
    const res = await api.get("/students");
    students.value = res.data.data;
  } catch (err) {
    console.error(err);
    errorMsg.value = "Erro ao carregar estudantes";
  } finally {
    loading.value = false;
  }
}

// ➕ adicionar
async function addStudent() {
  errorMsg.value = "";

  if (!name.value.trim() || !gender.value) {
    errorMsg.value = "Preencha nome e sexo";
    return;
  }

  try {
    saving.value = true;

    await api.post("/students", {
      name: name.value,
      gender: gender.value
    });

    // limpar form
    name.value = "";
    gender.value = "";

    await loadStudents();

  } catch (err) {
    console.error(err);
    errorMsg.value = "Erro ao cadastrar estudante";
  } finally {
    saving.value = false;
  }
}

// 🗑️ excluir
async function deleteStudent(id) {
  const confirmDelete = confirm("Tem certeza que deseja excluir?");
  if (!confirmDelete) return;

  try {
    await api.delete(`/students/${id}`);
    await loadStudents();
  } catch (err) {
    console.error(err);
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

    <!-- ALERTA -->
    <div v-if="errorMsg" class="alert">
      {{ errorMsg }}
    </div>

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
        <span v-if="saving">⏳ Salvando...</span>
        <span v-else>➕ Adicionar</span>
      </button>
    </div>

    <!-- BUSCA -->
    <input
      v-model="search"
      placeholder="🔎 Buscar estudante..."
      class="search"
    />

    <!-- LOADING -->
    <div v-if="loading" class="loading">
      Carregando estudantes...
    </div>

    <!-- LISTA -->
    <div v-else>
      <div v-if="filteredStudents.length === 0" class="empty">
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

            <span
              class="badge"
              :class="s.gender === 'M' ? 'male' : 'female'"
            >
              {{ s.gender === "M" ? "👨 Masculino" : "👩 Feminino" }}
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
  max-width: 600px;
  margin: auto;
}

/* ALERTA */
.alert {
  background: #fee2e2;
  color: #991b1b;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
}

/* CARD */
.card {
  background: #f9fafb;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
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
  flex: 1;
}

/* BUSCA */
.search {
  width: 100%;
  margin-bottom: 15px;
  padding: 8px;
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
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  background: white;
  border: 1px solid #eee;
  transition: 0.2s;
}

.item:hover {
  transform: scale(1.01);
}

/* INFO */
.info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.name {
  font-weight: 600;
}

/* BADGE */
.badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
}

.male {
  background: #dbeafe;
  color: #1e3a8a;
}

.female {
  background: #fce7f3;
  color: #9d174d;
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

/* ESTADOS */
.loading {
  text-align: center;
  color: #555;
}

.empty {
  text-align: center;
  color: #777;
}
</style>
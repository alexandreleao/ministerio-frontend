<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

const students = ref([]);
const name = ref("");
const loading = ref(false);

async function loadStudents() {
  try {
    const res = await api.get("/students");
    students.value = res.data.data;
  } catch (err) {
    console.error("Erro ao carregar estudantes", err);
  }
}

async function addStudent() {
  if (!name.value.trim()) return;

  try {
    loading.value = true;

    await api.post("/students", {
      name: name.value
    });

    name.value = "";
    await loadStudents();

  } catch (err) {
    console.error("Erro ao cadastrar", err);
  } finally {
    loading.value = false;
  }
}

onMounted(loadStudents);
</script>

<template>
  <div style="padding: 20px">

    <h1>👨‍🎓 Estudantes</h1>

    <!-- FORM -->
    <div style="margin-bottom: 20px">
      <input 
        v-model="name" 
        placeholder="Nome do estudante"
        style="padding: 8px; margin-right: 10px"
      />

      <button @click="addStudent" :disabled="loading">
        {{ loading ? "Salvando..." : "Adicionar" }}
      </button>
    </div>

    <!-- LISTA -->
    <div v-if="students.length === 0">
      Nenhum estudante cadastrado.
    </div>

    <ul>
      <li 
        v-for="s in students" 
        :key="s.id"
        style="margin: 8px 0"
      >
        {{ s.name }}
      </li>
    </ul>

  </div>
</template>
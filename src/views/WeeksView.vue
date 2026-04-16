<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const weeks = ref([]);
const router = useRouter();

async function loadWeeks() {
  try {
    const response = await api.get("/weeks");
    weeks.value = response.data.data;
  } catch (err) {
    console.error(err);
  }
}

async function generateWeek() {
  try {
    // cria nova semana (data atual)
    const weekResponse = await api.post("/weeks", {
      startDate: new Date()
    });

    const weekId = weekResponse.data.id;

    // gera designações
    await api.post("/generate-week", {
      weekId
    });

    // recarrega lista
    loadWeeks();

  } catch (err) {
    console.error(err);
  }
}

function goToAssignments(id) {
  router.push(`/week/${id}`);
}

onMounted(loadWeeks);
</script>

<template>
  <div style="padding: 20px">
    <h1>📅 Semanas</h1>

    <button @click="generateWeek">
      ⚡ Gerar Nova Semana
    </button>

    <ul>
      <li v-for="week in weeks" :key="week.id" style="margin: 10px 0">
        
        <strong>
          {{ new Date(week.startDate).toLocaleDateString() }}
        </strong>

        <button @click="goToAssignments(week.id)">
          Ver Designações
        </button>

      </li>
    </ul>
  </div>
</template>
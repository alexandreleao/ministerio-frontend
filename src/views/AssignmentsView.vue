<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "../services/api";

const route = useRoute();
const assignments = ref([]);

async function loadAssignments() {
  try {
    const weekId = route.params.id;

    const response = await api.get(`/assignments?weekId=${weekId}`);
    assignments.value = response.data.data;

  } catch (err) {
    console.error(err);
  }
}

onMounted(loadAssignments);
</script>

<<template>
  <div style="padding: 20px">

    <!-- 👇 BOTÃO AQUI -->
    <button @click="$router.back()" style="margin-bottom: 10px">
      ⬅ Voltar
    </button>

    <h1>📋 Designações da Semana</h1>

    <div v-if="assignments.length === 0">
      Nenhuma designação encontrada.
    </div>

    <div 
      v-for="a in assignments" 
      :key="a.id"
      style="border: 1px solid #ccc; padding: 15px; margin: 10px 0; border-radius: 8px"
    >
      <h3>{{ a.type }}</h3>

      <p><strong>Aluno:</strong> {{ a.student?.name }}</p>

      <p v-if="a.helper">
        <strong>Ajudante:</strong> {{ a.helper.name }}
      </p>

      <p><strong>Duração:</strong> {{ a.duration }} min</p>
    </div>
  </div>
</template>
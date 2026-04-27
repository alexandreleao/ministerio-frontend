<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const loading = ref(false);
const error = ref("");
const success = ref("");

const router = useRouter();

async function register() {
  error.value = "";
  success.value = "";

  if (!name.value || !email.value || !password.value) {
    error.value = "Preencha todos os campos";
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = "As senhas não coincidem";
    return;
  }

  try {
    loading.value = true;

    await api.post("/auth/register", {
      name: name.value,
      email: email.value,
      password: password.value
    });

    success.value = "Conta criada com sucesso!";

    setTimeout(() => {
      router.push("/login");
    }, 1500);

  } catch (err) {
    error.value = err.response?.data?.error || "Erro ao cadastrar";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="container">
    <div class="card">
      <h1>🆕 Criar Conta</h1>

      <input v-model="name" placeholder="Nome" />
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Senha" />
      <input v-model="confirmPassword" type="password" placeholder="Confirmar senha" />

      <button @click="register" :disabled="loading">
        {{ loading ? "Criando..." : "Cadastrar" }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>

      <p class="link" @click="$router.push('/login')">
        Já tem conta? Fazer login
      </p>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f3f4f6;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 340px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

button {
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #10b981;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
}

.error {
  color: #ef4444;
  font-size: 14px;
  text-align: center;
}

.success {
  color: #10b981;
  font-size: 14px;
  text-align: center;
}

.link {
  margin-top: 10px;
  text-align: center;
  color: #3b82f6;
  cursor: pointer;
  font-size: 14px;
}

.link:hover {
  text-decoration: underline;
}
</style>
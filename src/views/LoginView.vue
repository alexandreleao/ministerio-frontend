<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginRequest, saveToken } from "../services/auth";

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const router = useRouter();

async function login() {
  error.value = "";

  if (!email.value || !password.value) {
    error.value = "Preencha todos os campos";
    return;
  }

  try {
    loading.value = true;

    const data = await loginRequest(email.value, password.value);

    saveToken(data.token);

    router.push("/");

  } catch (err) {
    error.value = err.response?.data?.error || "Erro ao logar";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="container">
    <div class="card">
      <h1>🔐 Login</h1>

      <input
        v-model="email"
        placeholder="Email"
        @keyup.enter="login"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Senha"
        @keyup.enter="login"
      />

      <button @click="login" :disabled="loading">
        {{ loading ? "Entrando..." : "Entrar" }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>

      <p class="link" @click="$router.push('/register')">
        Não tem conta? Cadastre-se
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
  width: 320px;
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
  background: #3b82f6;
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
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
// Certifique-se de que o caminho abaixo está correto para sua estrutura
import { loginRequest, saveToken } from "../services/auth";

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const router = useRouter();

async function login() {
  error.value = "";

  // Validação simples antes de chamar a API
  if (!email.value || !password.value) {
    error.value = "Por favor, preencha todos os campos.";
    return;
  }

  try {
    loading.value = true;

    // 1. Faz a requisição para o Backend
    const data = await loginRequest(email.value, password.value);

    // 2. Salva o Token e o Email no localStorage (ajustado para o novo auth.js)
    // data.token deve vir do seu backend
    saveToken(data.token, email.value);

    // 3. Redireciona para a Home/Weeks após sucesso
    router.push("/");

  } catch (err) {
    console.error("Erro no login:", err);
    // Captura a mensagem de erro vinda do backend ou usa uma mensagem padrão
    error.value = err.response?.data?.error || "E-mail ou senha incorretos.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="header">
        <h1>📊 Sistema</h1>
        <p>Acesse sua conta para continuar</p>
      </div>

      <div class="form">
        <div class="input-group">
          <label>E-mail</label>
          <input
            v-model="email"
            type="email"
            placeholder="exemplo@email.com"
            @keyup.enter="login"
            :disabled="loading"
          />
        </div>

        <div class="input-group">
          <label>Senha</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            @keyup.enter="login"
            :disabled="loading"
          />
        </div>

        <button @click="login" :disabled="loading" class="btn-login">
          <span v-if="!loading">Entrar</span>
          <span v-else>Autenticando...</span>
        </button>

        <p v-if="error" class="error-message">⚠️ {{ error }}</p>
      </div>

      <div class="footer">
        <p @click="router.push('/register')" class="register-link">
          Ainda não tem conta? <span>Cadastre-se</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f7fa; /* Um tom mais profissional */
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 1.8rem;
  color: #1f2937;
  margin-bottom: 8px;
}

.header p {
  color: #6b7280;
  font-size: 0.9rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
}

input {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn-login {
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #3b82f6;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-login:hover:not(:disabled) {
  background: #2563eb;
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: #dc2626;
  font-size: 0.85rem;
  text-align: center;
  background: #fee2e2;
  padding: 10px;
  border-radius: 6px;
}

.footer {
  margin-top: 25px;
  text-align: center;
}

.register-link {
  font-size: 0.9rem;
  color: #6b7280;
  cursor: pointer;
}

.register-link span {
  color: #3b82f6;
  font-weight: 600;
}

.register-link:hover span {
  text-decoration: underline;
}
</style>
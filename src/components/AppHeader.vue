<script setup>
import { useRouter } from "vue-router";
import { logout } from "../services/auth";

const router = useRouter();

function handleLogout() {
  logout();
  router.push("/login");
}

// 🔥 pegar usuário do token
function getUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

const user = getUser();
</script>

<template>
  <div class="layout">

    <!-- SIDEBAR -->
    <aside class="sidebar">
      <h2>📊 Ministério</h2>

      <nav>
        <button @click="$router.push('/')">📅 Semanas</button>
        <button @click="$router.push('/students')">👨‍🎓 Estudantes</button>
        <button @click="$router.push('/dashboard')">📊 Dashboard</button>
      </nav>
    </aside>

    <!-- CONTEÚDO -->
    <div class="main">

      <!-- TOPBAR -->
      <header class="topbar">
        <div></div>

        <div class="user">
          <span v-if="user">👤 {{ user.email }}</span>

          <button class="logout" @click="handleLogout">
            🚪 Sair
          </button>
        </div>
      </header>

      <!-- VIEW -->
      <div class="content">
        <router-view />
      </div>

    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}

/* SIDEBAR */
.sidebar {
  width: 220px;
  background: #111827;
  color: white;
  padding: 20px;
}

.sidebar h2 {
  margin-bottom: 20px;
}

.sidebar button {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  background: none;
  border: none;
  color: white;
  text-align: left;
  cursor: pointer;
  border-radius: 6px;
}

.sidebar button:hover {
  background: #1f2937;
}

/* MAIN */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* TOPBAR */
.topbar {
  height: 60px;
  background: #f9fafb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #eee;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logout {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

/* CONTENT */
.content {
  padding: 20px;
  overflow-y: auto;
}
</style>
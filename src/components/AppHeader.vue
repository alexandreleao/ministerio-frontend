<script setup>
import { useRouter, useRoute } from "vue-router";
import { logout } from "../services/auth";
import { computed } from "vue";

const router = useRouter();
const route = useRoute();

function handleLogout() {
  logout();
  router.push("/login");
}

const user = computed(() => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
});
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <h2>📊 Ministério</h2>
    </div>
    
    <nav class="nav-menu">
      <button :class="{ active: route.path === '/' }" @click="router.push('/')">
        📅 Semanas
      </button>
      <button :class="{ active: route.path === '/students' }" @click="router.push('/students')">
        👨‍🎓 Estudantes
      </button>
      <button :class="{ active: route.path === '/dashboard' }" @click="router.push('/dashboard')">
        📊 Dashboard
      </button>
    </nav>
  </aside>

  <header class="topbar">
    <div class="user-info">
      <span v-if="user">👤 {{ user.email }}</span>
      <button class="logout-btn" @click="handleLogout">🚪 Sair</button>
    </div>
  </header>
</template>

<style scoped>
/* SIDEBAR FIXA */
.sidebar {
  width: 240px; /* Aumentei um pouco para não espremer os nomes */
  background: #111827;
  color: white;
  padding: 0;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.brand {
  padding: 20px;
  border-bottom: 1px solid #1f2937;
}

.brand h2 {
  margin: 0;
  font-size: 1.25rem;
}

.nav-menu {
  padding: 20px 10px;
}

.nav-menu button {
  display: block;
  width: 100%;
  margin-bottom: 8px;
  padding: 12px 15px;
  background: none;
  border: none;
  color: #9ca3af;
  text-align: left;
  cursor: pointer;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.nav-menu button:hover {
  background: #1f2937;
  color: white;
}

.nav-menu button.active {
  background: #374151;
  color: white;
  font-weight: 600;
}

/* TOPBAR FIXA */
.topbar {
  position: fixed;
  top: 0;
  left: 240px; /* Exatamente a largura da sidebar */
  right: 0;
  height: 64px;
  background: white;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 25px;
  border-bottom: 1px solid #e5e7eb;
  z-index: 90;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logout-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.logout-btn:hover {
  background: #dc2626;
}
</style>
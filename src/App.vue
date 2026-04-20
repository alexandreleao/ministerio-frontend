<script setup>
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <h2 class="logo">📋 Ministério</h2>

      <nav>
        <router-link to="/">📅 Semanas</router-link>
        <router-link to="/students">👥 Estudantes</router-link>
        <router-link to="/create-assignment">➕ Nova</router-link>
        <router-link to="/dashboard">📊 Dashboard</router-link>
      </nav>
    </aside>

    <div class="main">
      <header class="header">
        <h1>Sistema de Designações</h1>
      </header>

      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 220px;
  background: #111827;
  color: white;
  padding: 20px;
}

.logo {
  margin-bottom: 30px;
}

.sidebar a {
  display: block;
  margin-bottom: 10px;
  color: #d1d5db;
  text-decoration: none;
}

.sidebar a.router-link-active {
  color: white;
  background: #1f2937;
  padding: 6px;
  border-radius: 6px;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  background: white;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.content {
  padding: 20px;
}
</style>
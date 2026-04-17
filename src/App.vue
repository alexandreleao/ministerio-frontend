<script setup>
</script>

<template>
  <div>
    <!-- 🔝 NAVBAR -->
    <nav style="
  padding: 15px;
  background: #2c3e50;
  display: flex;
  gap: 10px;
">

  <button 
    @click="$router.push('/')"
    style="
      background: none;
      border: none;
      color: white;
      font-size: 16px;
      cursor: pointer;
    "
  >
    📅 Semanas
  </button>

  <button 
    @click="$router.push('/students')"
    style="
      background: none;
      border: none;
      color: white;
      font-size: 16px;
      cursor: pointer;
    "
  >
    👨‍🎓 Estudantes
  </button>

</nav>
    <!-- 📦 CONTEÚDO -->
    <div style="max-width: 800px; margin: auto; padding: 20px">
      <router-view />
    </div>
  </div>
</template>
<script setup>
import { useRoute } from "vue-router";
import AppHeader from "./components/AppHeader.vue";

const route = useRoute();
</script>

<template>
  <div id="app-container">
    <AppHeader v-if="!['/login', '/register'].includes(route.path)" />

    <main :class="{ 'with-sidebar': !['/login', '/register'].includes(route.path) }">
      <router-view />
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  background-color: #f1f5f9;
  font-family: sans-serif;
}

/* Quando tem sidebar, o conteúdo precisa de um recuo para não ficar embaixo dela */
.with-sidebar {
  margin-left: 220px; /* Largura da sidebar */
  margin-top: 60px;  /* Altura da topbar */
  padding: 20px;
  width: calc(100% - 220px);
}

main {
  min-height: 100vh;
  box-sizing: border-box;
}
</style>
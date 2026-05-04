<script setup>
import { useRoute } from "vue-router";
import AppHeader from "./components/AppHeader.vue";

const route = useRoute();
</script>

<template>
  <!-- NÃO MOSTRAR MENU NO LOGIN/REGISTER -->
  <AppHeader v-if="!['/login', '/register'].includes(route.path)" />
<main>

</main>
  
</template>
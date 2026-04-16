import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // 👈 IMPORTANTE

createApp(App)
  .use(router) // 👈 ESSENCIAL
  .mount("#app");
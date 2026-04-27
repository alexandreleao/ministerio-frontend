import { createRouter, createWebHistory } from "vue-router";
import WeeksView from "../views/WeeksView.vue";
import AssignmentsView from "../views/AssignmentsView.vue";
import StudentsView from "../views/StudentsView.vue";
import CreateAssignmentView from "../views/CreateAssignmentView.vue";
import DashboardView from "@/views/DashboardView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [

    // 🔓 públicas
    {
      path: "/login",
      name: "login",
      component: LoginView
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView
    },

    // 🔐 protegidas
    {
      path: "/",
      name: "weeks",
      component: WeeksView,
      meta: { requiresAuth: true }
    },
    {
      path: "/week/:id",
      name: "assignments",
      component: AssignmentsView,
      meta: { requiresAuth: true }
    },
    {
      path: "/students",
      name: "students",
      component: StudentsView,
      meta: { requiresAuth: true }
    },
    {
      path: "/create-assignment",
      name: "create-assignment",
      component: CreateAssignmentView,
      meta: { requiresAuth: true }
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
      meta: { requiresAuth: true }
    }
  ]
});

// 🔥 GUARD MODERNO (SEM next)
router.beforeEach((to) => {
  const token = localStorage.getItem("token");

  // 🔐 bloqueia acesso sem login
  if (to.meta.requiresAuth && !token) {
    return "/login";
  }

  // 🚫 evita usuário logado ir pro login/register
  if ((to.path === "/login" || to.path === "/register") && token) {
    return "/";
  }
});

export default router;
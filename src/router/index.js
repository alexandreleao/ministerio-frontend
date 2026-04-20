import { createRouter, createWebHistory } from "vue-router";
import WeeksView from "../views/WeeksView.vue";
import AssignmentsView from "../views/AssignmentsView.vue";
import StudentsView from "../views/StudentsView.vue";
import CreateAssignmentView from "../views/CreateAssignmentView.vue";
import DashboardView from "@/views/DashboardView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "weeks",
      component: WeeksView
    },
    {
      path: "/week/:id",
      name: "assignments",
      component: AssignmentsView
    },
    {
     path: "/students",
     name: "students",
     component: StudentsView
    },
    {
      path: "/create-assignment",
      name: "create-assignment",
      component: CreateAssignmentView 
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView
    }

  ]
});

export default router;
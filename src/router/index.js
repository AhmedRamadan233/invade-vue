import { createRouter, createWebHistory } from "vue-router";

import TaskComponent from "../components/TaskComponent.vue";
import HomeComponent from "../components/HomeComponent.vue";


const routes = [
  
  { path: '/', component: HomeComponent, meta: { title: 'Home' } },

  { path: '/tasks', component: TaskComponent, meta: { title: 'Task' } },
 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

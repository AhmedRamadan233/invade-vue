import { createRouter, createWebHistory } from 'vue-router';
import TaskComponent from '../components/TaskComponent.vue';
import HomeComponent from '../components/HomeComponent.vue';
import LoginComponent from '../components/LoginComponent.vue';
import ViewTrashedTasks from '../components/ViewTrashedTasks.vue';
import CategoryComponent from '@/components/CategoryComponent.vue';


const routes = [
  {
    path: '/',
    component: HomeComponent,
    meta: { title: 'Home', requiresAuth: true },
  },
  {
    path: '/tasks',
    component: TaskComponent,
    meta: { title: 'Tasks', requiresAuth: true },
  },
  {
    path: '/login',
    component: LoginComponent,
    meta: { title: 'Login' },
  },
  {
    path: '/view-trashed-tasks',
    component: ViewTrashedTasks,
    meta: { title: 'ViewTrashed', requiresAuth: true },
  },

  {
    path: '/categories',
    component: CategoryComponent,
    meta: { title: 'categories', requiresAuth: true },
  },

  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;

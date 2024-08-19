import { createRouter, createWebHistory } from 'vue-router'
import UserLogin from '../components/UserLogin.vue';
import UserRegistration from '../components/UserRegistration.vue';

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: UserLogin },
  { path: '/register', component: UserRegistration },
];

const router = createRouter({
  history: createWebHistory(),
  routes // short for `routes: routes`
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !localStorage.getItem('user-token')) {
    next('/login');
  } else {
    next();
  }
});

export default router

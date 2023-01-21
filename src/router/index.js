// import Vue from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
// import Meta from 'vue-meta';
import auth from './auth';
import error from './error';
import home from './home';
import setup from './setup';
import inventory from './inventory';
import Accounting from './accounting';
import POS from './pos';
import Accomodation from './accomodation';
import Settings from './settings';
import Manage from './manage';
import KDS from './kds';
import Estates from './estates';
import Outlets from './outlet';
import Verification from './verification';
import AccountRecovery from './recovery';

// Vue.use(VueRouter);
// Vue.use(Meta, {
//   refreshOnceOnNavigation: true,
// });

const routes = [
  auth,
  error,
  home,
  Accounting,
  setup,
  inventory,
  POS,
  Accomodation,
  Settings,
  Manage,
  KDS,
  Estates,
  Outlets,
  Verification,
  AccountRecovery,
  // { path: '*', component: () => import('@/views/auth/login.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition || from.meta.scrollToTop === false) {
      return savedPosition;
    } if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ selector: to.hash });
        }, 1000);
      });
    } if (to.path !== from.path) {
      return { x: 0, y: 0 };
    }
    return {};
  },
})

// router.afterEach((to, from, next) => {
//   const LoggedInUserId = localStorage.getItem('smart_user_id');
//   const userRole = localStorage.getItem('smart_user_role');
//   if (to.authrequired && !LoggedInUserId) {
//     router.push({ name: 'login' });
//     // Waiters can only access pos page
//   } else if (LoggedInUserId && (parseInt(userRole, 10) === 3) && to.name !== 'pos') {
//     router.replace({ name: 'pos' });
//   }
//   if (to.matched.length) {
//     document.title = to.meta.title || 'Smart POS';
//     next();
//   } else {
//     document.title = 'Page not found';
//     router.push({ name: 'login' });
//   }
// });

export default router;

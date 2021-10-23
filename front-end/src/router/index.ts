import { route } from 'quasar/wrappers';
import { useCurrentUser } from 'src/composables/current-user';
import { User } from 'src/ts/api';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteLocationNormalized,
  NavigationGuardNext,
} from 'vue-router';
import routes from './routes';

const { currentUser, onCurrentUserChange } = useCurrentUser();

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE),
  });

  onCurrentUserChange((user: User | undefined) => {
    if (user) {
      void Router.push('/auth/profile');
    } else {
      void Router.push('/login');
    }
  });

  Router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (!to.meta?.requiresAuth) {
      next();
      return;
    }

    if (!currentUser.value) {
      next('/login');
      return;
    }

    if (!to.meta.roles) {
      next();
      return;
    }

    if (!(to.meta.roles as string[]).every((r) => currentUser.value?.roles.includes(r))) {
      next('/login');
      return;
    }

    next();
  });

  return Router;
});

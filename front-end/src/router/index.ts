import { route } from 'quasar/wrappers';
import { useCurrentUser } from 'src/composables/current-user';
import { call, CallError, User } from 'src/ts/api';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteLocationNormalized,
  NavigationGuardNext,
} from 'vue-router';
import routes from './routes';
import { onServerNotInitialized } from '../ts/api';

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

  onServerNotInitialized(() => {
    void Router.replace('/initialize');
  });

  onCurrentUserChange(async (user: User | undefined) => {
    if (user) {
      const route = Router.currentRoute.value;
      if (['/oauth2/login', '/oauth2/register'].includes(route.path)) {
        try {
          const codeChallenge = route.query['code_challenge'] as string;
          const { authorizationCode } = await call<{ authorizationCode: string }>('/api/oauth2/authorize', {
            method: 'POST',
            body: {
              responseType: route.query['response_type'],
              scope: route.query['scope'],
              state: route.query['state'],
              clientId: route.query['client_id'],
              codeChallenge,
              codeChallengeMethod: route.query['code_challenge_method'],
            },
          });
          let url = `${
            route.query['redirect_uri'] as string
          }?code=${authorizationCode}&code_challenge=${encodeURIComponent(codeChallenge)}`;
          if (route.query['state']) {
            url += `&state=${encodeURIComponent(route.query['state'] as string)}`;
          }
          window.location.assign(url);
        } catch (e) {
          if (!(e instanceof CallError)) {
            window.location.assign(`${route.query['redirect_uri'] as string}?error=Unexpected error`);
            return;
          }
          window.location.assign(`${route.query['redirect_uri'] as string}?error=${e.message}`);
        }
      } else {
        const redirectBase64QueryParam = Router.currentRoute.value.query.redirect as string;
        if (!redirectBase64QueryParam) {
          void Router.push('/auth/profile');
          return;
        }
        void Router.push(atob(redirectBase64QueryParam));
      }
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
      next('/login?redirect=' + btoa(to.fullPath));
      return;
    }

    if (!to.meta.roles) {
      next();
      return;
    }

    if (!(to.meta.roles as string[]).every((r) => currentUser.value?.roles.includes(r))) {
      next('/auth/profile');
      return;
    }

    next();
  });

  return Router;
});

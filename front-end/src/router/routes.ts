import { useCurrentUser } from 'src/composables/current-user';
import { logout } from 'src/ts/api';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/auth/profile',
  },
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/Login.vue') }],
  },
  {
    path: '/oauth2/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Login.vue'),
        beforeEnter: (to, from, next) => {
          const requiredQueryParams = [
            'response_type',
            'scope',
            'client_id',
            'redirect_uri',
            'code_challenge',
            'code_challenge_method',
          ];
          const missingParams = requiredQueryParams.filter((p) => !to.query[p]);
          if (missingParams.length > 0) {
            next('/oauth2/error');
            return;
          }

          next();
        },
      },
    ],
  },
  {
    path: '/oauth2/error',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/OAuth2Error.vue') }],
  },
  {
    path: '/register',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/Register.vue') }],
  },
  {
    path: '/auth/profile',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/EditProfile.vue') }],
    meta: { requiresAuth: true, roles: [], title: 'My Profile', icon: 'account_circle' },
  },
  {
    path: '/auth/my-apps',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/MyApps.vue') }],
    meta: { requiresAuth: true, roles: [], title: 'My Apps', icon: 'format_list_bulleted' },
  },
  {
    path: '/auth/admin/clients',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/admin/Clients.vue') }],
    meta: { requiresAuth: true, roles: ['admin'], title: 'Clients', icon: 'dns' },
  },
  {
    path: '/auth/admin/users',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/admin/Users.vue') }],
    meta: { requiresAuth: true, roles: ['admin'], title: 'Users', icon: 'people' },
  },
  {
    path: '/auth/admin/invitation-codes',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/admin/InvitationCodes.vue') }],
    meta: { requiresAuth: true, roles: ['admin'], title: 'Invitation codes', icon: 'group_add' },
  },
  {
    path: '/auth/logout',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: async () => {
      const { currentUser } = useCurrentUser();
      try {
        await logout();
      } catch {
      } finally {
        currentUser.value = undefined;
      }
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;

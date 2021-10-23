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
    path: '/register',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/Register.vue') }],
  },
  {
    path: '/auth/profile',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/EditProfile.vue') }],
    meta: { requiresAuth: true, roles: [] },
  },
  {
    path: '/auth/admin/clients',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/admin/Clients.vue') }],
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/auth/admin/users',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/admin/Users.vue') }],
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/auth/admin/invitation-codes',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/admin/InvitationCodes.vue') }],
    meta: { requiresAuth: true, roles: ['admin'] },
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

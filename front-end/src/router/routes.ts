import { useCurrentUser } from 'src/composables/current-user';
import { logout } from 'src/ts/api';
import { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';

const oauth2Guard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
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
};

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/auth/profile',
  },
  {
    path: '/initialize',
    component: () => import('layouts/InitializeLayout.vue'),
    children: [{ path: '', component: () => import('pages/Initialize.vue') }],
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
        beforeEnter: oauth2Guard,
        meta: { isOAuth2Page: true },
      },
    ],
  },
  {
    path: '/oauth2/register',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Register.vue'),
        beforeEnter: oauth2Guard,
        meta: { isOAuth2Page: true },
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
    meta: { requiresAuth: true, roles: [], title: 'pageTitles.myProfile', icon: 'account_circle' },
  },
  {
    path: '/auth/my-apps',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/MyApps.vue') }],
    meta: { requiresAuth: true, roles: [], title: 'pageTitles.myApps', icon: 'format_list_bulleted' },
  },
  {
    path: '/auth/admin/clients',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/admin/Clients.vue') }],
    meta: { requiresAuth: true, roles: ['admin'], title: 'pageTitles.clients', icon: 'dns' },
  },
  {
    path: '/auth/admin/users',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/admin/Users.vue') }],
    meta: { requiresAuth: true, roles: ['admin'], title: 'pageTitles.users', icon: 'people' },
  },
  {
    path: '/auth/admin/invitation-codes',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/admin/InvitationCodes.vue') }],
    meta: { requiresAuth: true, roles: ['admin'], title: 'pageTitles.invitationCodes', icon: 'group_add' },
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

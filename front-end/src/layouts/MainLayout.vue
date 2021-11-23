<i18n>
{
  "en": {
    "logout": "Logout"
  },
  "fr": {
    "logout": "Déconnexion"
  }
}
</i18n>

<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>Xenia</q-toolbar-title>
        <div>
          <q-btn outline rounded @click="logout()">
            <div class="row items-center no-wrap">
              <q-icon left name="logout" />
              <div class="text-center">{{ t('logout') }}</div>
            </div>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" overlay bordered>
      <q-list>
        <q-item-label header>Menu</q-item-label>
        <MenuLink v-for="route in availableRoutes" :key="route.path" :path="route.path" v-bind="route.meta" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <div class="page-container">
        <q-card class="q-py-md q-px-lg q-mt-lg">
          <router-view />
        </q-card>
      </div>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.page-container {
  max-width: 900px;
  margin: auto;
}
</style>

<script lang="ts">
import MenuLink from 'src/components/MenuLink.vue';
import { defineComponent, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import routes from 'src/router/routes';
import { useCurrentUser } from 'src/composables/current-user';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'MainLayout',
  components: {
    MenuLink,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { t } = useI18n();
    const leftDrawerOpen = ref(false);
    const { currentUser } = useCurrentUser();

    const availableRoutes = computed(() => {
      return routes
        .filter((route) => {
          if (route.redirect) {
            return false;
          }
          if (!route.path.startsWith('/auth')) {
            return true;
          }
          if (!route.meta?.requiresAuth) {
            return true;
          }
          if (!currentUser.value) {
            return false;
          }
          if (!route.meta?.roles) {
            return true;
          }
          return (route.meta.roles as string[]).every((r: string) => currentUser.value!.roles.includes(r));
        })
        .filter((route) => route.meta?.title && route.meta?.icon);
    });

    const logout = () => {
      void router.push('/auth/logout');
    };

    return {
      availableRoutes,
      leftDrawerOpen,
      route,
      logout,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      t,
    };
  },
});
</script>

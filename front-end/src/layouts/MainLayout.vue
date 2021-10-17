<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>SSO</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" overlay bordered>
      <q-list>
        <q-item-label header>Menu</q-item-label>
        <MenuLink v-for="link in menuLinks" :key="link.title" v-bind="link" />
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

import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'MainLayout',
  components: {
    MenuLink,
  },
  setup() {
    const route = useRoute();
    const leftDrawerOpen = ref(false);

    const menuLinks = [
      {
        title: 'My Profile',
        icon: 'account_circle',
        route: '/auth/profile',
      },
      {
        title: 'Clients',
        icon: 'dns',
        route: '/auth/admin/clients',
      },
      {
        title: 'Users',
        icon: 'people',
        route: '/auth/admin/users',
      },
      {
        title: 'Logout',
        icon: 'logout',
        route: '/auth/logout',
      },
    ];

    return {
      menuLinks,
      leftDrawerOpen,
      route,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>

<template>
  <router-view />
</template>
<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, onMounted } from 'vue';
import { useCurrentUser } from './composables/current-user';

export default defineComponent({
  name: 'App',
  setup() {
    const $q = useQuasar();
    $q.dark.set(true);

    const { silentLogin } = useCurrentUser();
    onMounted(() => {
      void silentLogin();
    });
  },
});
</script>

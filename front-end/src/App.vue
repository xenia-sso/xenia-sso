<template>
  <router-view />
</template>
<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, onMounted } from 'vue';
import { init } from './ts/utils/api';

export default defineComponent({
  name: 'App',
  setup() {
    const $q = useQuasar();
    $q.dark.set(true);

    onMounted(() => {
      void init();
    });
  },
});
</script>

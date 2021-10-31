<template>
  <div class="text-h6 q-mb-sm">My Apps</div>
  <div v-for="client in clients" :key="client.id" class="row items-center q-mb-xs">
    <div class="text-subtitle1 q-mr-sm">{{ client.name }}</div>
    <div>
      <q-btn round flat color="primary" size="sm" icon="launch" />
    </div>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { Client } from 'src/models/clients';
import { call } from 'src/ts/api';
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  setup() {
    const $q = useQuasar();

    const clients = ref<Client[]>([]);
    onMounted(async () => {
      try {
        clients.value = await call<Client[]>('/api/profile/my-apps');
      } catch {
        $q.notify({
          type: 'negative',
          message: 'Unable to fetch apps.',
        });
      }
    });
    return {
      clients,
    };
  },
});
</script>

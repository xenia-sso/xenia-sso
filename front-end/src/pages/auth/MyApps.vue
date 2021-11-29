<i18n>
{
  "en": {
    "myApps": "My Apps",
    "noAppGranted": "You do not have access to any app for now.",
  },
  "fr": {
    "myApps": "Mes Applis",
    "noAppGranted": "Vous n'avez accès à aucune appli pour l'instant.",
  }
}
</i18n>

<template>
  <div class="text-h6 q-mb-sm">{{ t('myApps') }}</div>
  <div v-if="clients.length === 0" class="text-subtitle1">{{ t('noAppGranted') }}</div>
  <div v-else v-for="client in clients" :key="client.id" class="row items-center q-mb-xs">
    <div class="text-subtitle1 q-mr-sm">{{ client.name }}</div>
    <div>
      <q-btn round flat color="primary" size="sm" icon="launch" @click="openInNewTab(client.url)" />
    </div>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { Client } from 'src/models/clients';
import { call } from 'src/ts/api';
import { defineComponent, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const { t } = useI18n();

    const clients = ref<Client[]>([]);
    onMounted(async () => {
      try {
        clients.value = await call<Client[]>('/api/profile/my-apps');
      } catch {
        $q.notify({
          type: 'negative',
          message: t('errors.unableFetchApps'),
        });
      }
    });

    const openInNewTab = (url: string) => {
      window.open(url, '_blank')?.focus();
    };

    return {
      clients,
      openInNewTab,
      t,
    };
  },
});
</script>

<template>
  <div class="row items-center">
    <div class="col text-h6">Clients</div>
    <div class="col col-auto">
      <q-btn round icon="add" color="primary" @click="createOrEditClient()" />
    </div>
  </div>
  <q-table :columns="columns" :rows="clients">
    <template #body-cell-allUsers="props">
      <q-td :props="props" class="text-center">
        <q-icon
          :name="props.value ? 'gpp_bad' : 'verified_user'"
          :color="props.value ? 'warning' : 'positive'"
          size="md"
        />
      </q-td>
    </template>
    <template #body-cell-secret="props">
      <q-td :props="props" class="text-center">
        <q-btn color="grey-9" icon="vpn_key" flat round @click="editClientSecret()"></q-btn>
      </q-td>
    </template>
    <template #body-cell-edit="props">
      <q-td :props="props" class="text-center">
        <q-btn color="primary" icon="edit" flat round @click="createOrEditClient(props.row)"></q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import ClientEdit from 'src/components/dialogs/ClientEdit.vue';
import ClientSecret from 'src/components/dialogs/ClientSecret.vue';
import { Client } from 'src/models/clients';
import ClientCreated from '../../../components/dialogs/ClientCreated.vue';
import { call } from '../../../ts/api';

export default defineComponent({
  setup() {
    const $q = useQuasar();

    const editClientSecret = () => {
      $q.dialog({
        component: ClientSecret,
      }).onOk((password: string) => {
        console.log('onOK', password);
      });
    };

    const createOrEditClient = (client?: Client) => {
      $q.dialog({
        component: ClientEdit,
        componentProps: { client },
      }).onOk(async (data: { type: 'edit' | 'create' | 'delete'; client: Client }) => {
        if (data.type === 'edit') {
          return;
        } else if (data.type === 'delete') {
          const clientIndex = clients.value.findIndex((c) => c.id === data.client.id);
          if (clientIndex > -1) {
            clients.value.splice(clientIndex, 1);
          }
          return;
        }

        try {
          const { secret } = await call<{ secret: string }>(`/api/admin/clients/secret/${data.client.id}`, {
            method: 'PUT',
          });
          $q.dialog({
            component: ClientCreated,
            componentProps: { id: data.client.id, secret },
          });
          clients.value.unshift(data.client);
        } catch {
          $q.notify({ type: 'negative', message: 'Unable to get client secret.' });
        }
      });
    };

    const columns = [
      { label: 'Name', field: 'name', sortable: true, align: 'left' },
      { label: 'Id', field: 'id', sortable: true, align: 'left' },
      { name: 'secret', label: 'Secret', sortable: false, align: 'left' },
      { name: 'allUsers', label: 'Restricted', field: 'allUsers', sortable: true, align: 'left' },
      { name: 'edit', label: '', sortable: false, align: 'right' },
    ];

    const clients = ref<Client[]>([]);
    onMounted(async () => {
      clients.value = await call<Client[]>('/api/admin/clients');
    });

    return {
      columns,
      clients,
      editClientSecret,
      createOrEditClient,
    };
  },
});
</script>

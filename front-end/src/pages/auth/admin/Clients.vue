<template>
  <div class="row items-center">
    <div class="col text-h6">Clients</div>
    <div class="col col-auto">
      <q-btn round icon="add" color="primary" @click="createOrEditClient()" />
    </div>
  </div>
  <q-table :columns="columns" :rows="rows">
    <template #body-cell-allUsers="props">
      <q-td :props="props" class="text-center">
        <q-icon :name="props.value ? 'close' : 'check'" :color="props.value ? 'negative' : 'positive'" size="md" />
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
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';
import ClientEdit from 'src/components/dialogs/ClientEdit.vue';
import ClientSecret from 'src/components/dialogs/ClientSecret.vue';
import { Client } from 'src/models/clients';
import ClientCreated from '../../../components/dialogs/ClientCreated.vue';

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
      }).onOk((data: { client: Client; secret?: string }) => {
        if (!data.secret) {
          // Edition mode
          return;
        }
        $q.dialog({
          component: ClientCreated,
          componentProps: { id: data.client.id, secret: data.secret },
        });
      });
    };

    const columns = [
      { label: 'Name', field: 'name', sortable: true, align: 'left' },
      { label: 'Id', field: 'id', sortable: true, align: 'left' },
      { name: 'secret', label: 'Secret', field: 'secret', sortable: false, align: 'left' },
      { name: 'allUsers', label: 'All Users', field: 'allUsers', sortable: true, align: 'left' },
      { name: 'edit', label: '', field: 'edit', sortable: false, align: 'right' },
    ];

    const rows = [
      { name: 'Client 1', id: '9fd231bcd4f5ed5c', allUsers: true, grantedUsers: [] },
      { name: 'Client 2', id: '9fd231bcd4f6ed5c', allUsers: false, grantedUsers: [] },
    ];

    return {
      columns,
      rows,
      editClientSecret,
      createOrEditClient,
    };
  },
});
</script>

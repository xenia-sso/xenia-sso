<template>
  <q-table :columns="columns" :rows="rows">
    <template #body-cell-allUsers="props">
      <q-td :props="props" class="text-center">
        <q-icon :name="props.value ? 'close' : 'check'" :color="props.value ? 'negative' : 'positive'" size="md" />
      </q-td>
    </template>
    <template #body-cell-secret="props">
      <q-td :props="props" class="text-center">
        <q-btn color="grey-9" icon="vpn_key" flat round @click="editClientSecret"></q-btn>
      </q-td>
    </template>
    <template #body-cell-edit="props">
      <q-td :props="props" class="text-center">
        <q-btn color="primary" icon="edit" flat round @click="editClient"></q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';
import ClientEdit from 'src/components/dialogs/ClientEdit.vue';
import ClientSecret from 'src/components/dialogs/ClientSecret.vue';

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

    const editClient = () => {
      $q.dialog({
        component: ClientEdit,
      }).onOk((password: string) => {
        console.log('onOK', password);
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
      { name: 'Client 1', id: '9fd231bcd4f5ed5c', allUsers: true },
      { name: 'Client 2', id: '9fd231bcd4f6ed5c', allUsers: false },
    ];

    return {
      columns,
      rows,
      editClientSecret,
      editClient,
    };
  },
});
</script>

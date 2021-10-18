<template>
  <q-table :columns="columns" :rows="rows">
    <template #body-cell-active="props">
      <q-td :props="props" class="text-center">
        <q-toggle :model-value="props.value" @click="confirmToggleUser(props.row)"></q-toggle>
      </q-td>
    </template>
    <template #body-cell-delete="props">
      <q-td :props="props" class="text-center">
        <q-btn color="negative" icon="delete" flat round @click="confirmDeleteUser(props.row)"></q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  setup() {
    const $q = useQuasar();

    const confirmToggleUser = (user: { active: boolean; name: string }) => {
      console.log('confirmToggleUser');
      if (user.active) {
        $q.dialog({
          title: 'Warning',
          message: `Do you really want to disable user ${user.name}?`,
          persistent: false,
          ok: {
            flat: false,
            color: 'negative',
            label: 'confirm',
          },
          cancel: {
            color: 'grey-5',
            flat: true,
          },
        }).onOk(() => {
          // TODO: implement
        });
      } else {
        // TODO: implement
      }
    };

    const confirmDeleteUser = (user: { active: boolean; name: string }) => {
      console.log('confirmDeleteUser');
      $q.dialog({
        title: 'Warning',
        message: `Do you really want to remove user ${user.name}? This action cannot be undone.`,
        persistent: false,
        ok: {
          flat: false,
          color: 'negative',
          label: 'confirm',
        },
        cancel: {
          color: 'grey-5',
          flat: true,
        },
      }).onOk(() => {
        // TODO: implement
      });
    };

    const columns = [
      { label: 'Name', field: 'name', sortable: true, align: 'left' },
      { name: 'active', label: 'Active', field: 'active', sortable: false, align: 'left' },
      { name: 'delete', label: '', field: 'delete', sortable: false, align: 'right' },
    ];

    const rows = [
      { name: 'User 1', active: false },
      { name: 'User 2', active: true },
    ];

    return {
      columns,
      rows,
      confirmToggleUser,
      confirmDeleteUser,
    };
  },
});
</script>

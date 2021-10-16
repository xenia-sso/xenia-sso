<template>
  <q-table :columns="columns" :rows="rows">
    <template #body-cell-allUsers="props">
      <q-td :props="props" class="text-center">
        <q-icon :name="props.value ? 'close' : 'check'" :color="props.value ? 'negative' : 'positive'" size="md" />
      </q-td>
    </template>
    <template #body-cell-edit="props">
      <q-td :props="props" class="text-center">
        <q-btn color="primary" icon="edit" flat round></q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const columns = [
      { label: 'Name', field: 'name', sortable: true, align: 'left' },
      { label: 'Id', field: 'id', sortable: true, align: 'left' },
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
    };
  },
});
</script>

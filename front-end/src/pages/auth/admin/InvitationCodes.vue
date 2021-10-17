<template>
  <q-checkbox :model-value="anyUserCanRegister" @click="confirmToggleAnyUserCanRegister()"
    >Any user can register</q-checkbox
  >
  <q-table v-if="!anyUserCanRegister" :columns="columns" :rows="rows" row-key="code">
    <template #body-cell-delete="props">
      <q-td :props="props" class="text-center">
        <q-btn color="negative" icon="delete" flat round @click="deleteCode(props.row.code)"></q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  setup() {
    const $q = useQuasar();

    const anyUserCanRegister = ref(false);

    const confirmToggleAnyUserCanRegister = () => {
      if (!anyUserCanRegister.value) {
        $q.dialog({
          title: 'Warning',
          message: 'Do you really allow any user to register?',
          cancel: true,
          persistent: false,
        }).onOk(() => {
          // TODO: implement
        });
      } else {
        // TODO: implement
      }
    };

    const deleteCode = (code: string) => {
      console.log('deleteCode: ', code);
    };

    const columns = [
      { label: 'Code', field: 'code', sortable: true, align: 'left' },
      { name: 'delete', label: '', field: 'delete', sortable: false, align: 'right' },
    ];

    const rows = [{ code: 'vYKPtmvCAAgl26OJ' }, { code: 'lSMx1EOLl6ZYYmCf' }];

    return {
      columns,
      rows,
      deleteCode,
      anyUserCanRegister,
      confirmToggleAnyUserCanRegister,
    };
  },
});
</script>

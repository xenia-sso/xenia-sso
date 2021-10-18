<template>
  <q-checkbox :model-value="anyUserCanRegister" @click="confirmToggleAnyUserCanRegister()">
    Any user can register
  </q-checkbox>
  <template v-if="!anyUserCanRegister">
    <div class="row items-center q-mt-sm">
      <div class="col text-h6">Invitation codes</div>
      <div class="col col-auto">
        <q-btn icon="add" round color="primary" @click="createCode()" />
      </div>
    </div>
    <q-table :columns="columns" :rows="rows" row-key="code">
      <template #body-cell-delete="props">
        <q-td :props="props" class="text-center">
          <q-btn color="negative" icon="delete" flat round @click="deleteCode(props.row.code)"></q-btn>
        </q-td>
      </template>
    </q-table>
  </template>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  setup() {
    const $q = useQuasar();

    const anyUserCanRegister = ref(false);

    const confirmToggleAnyUserCanRegister = () => {
      console.log('confirmToggleAnyUserCanRegister');
      if (!anyUserCanRegister.value) {
        $q.dialog({
          title: 'Warning',
          message: 'Do you really allow any user to register?',
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

    const createCode = () => {
      console.log('Create code');
      // TODO create code & insert at 1st position (visul effect)
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
      createCode,
    };
  },
});
</script>

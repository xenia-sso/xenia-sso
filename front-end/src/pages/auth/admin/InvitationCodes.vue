<template>
  <div class="row items-center q-mt-sm">
    <div class="col text-h6">Invitation codes</div>
    <div class="col col-auto">
      <q-btn icon="add" round color="primary" :disable="isLoading" @click="createCode()" />
    </div>
  </div>
  <q-table :columns="columns" :rows="invitationCodes" row-key="code">
    <template #body-cell-link="props">
      <q-td :props="props" class="text-center">
        <q-btn color="primary" icon="link" flat round @click="copyLink(props.row.code)"></q-btn>
      </q-td>
    </template>
    <template #body-cell-delete="props">
      <q-td :props="props" class="text-center">
        <q-btn color="negative" icon="delete" flat round :disable="isLoading" @click="deleteCode(props.row)"></q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { call } from 'src/ts/api';
import { defineComponent, ref, onMounted } from 'vue';
import copy from 'copy-to-clipboard';

interface InvitationCode {
  id: string;
  code: string;
}

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const isLoading = ref(false);

    const copyLink = (code: string) => {
      const url = `${window.location.origin}/#/register?code=${code}`;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      copy(url);
      $q.notify({
        message: 'Link copied to clipboard',
        color: 'positive',
      });
    };

    const createCode = async () => {
      isLoading.value = true;
      try {
        const code = await call<InvitationCode>('/api/admin/invitation-codes', { method: 'POST' });
        // create code & insert at 1st position (visul effect)
        invitationCodes.value.unshift(code);
      } catch {
        $q.notify({ type: 'negative', message: 'Unable to create code.' });
      } finally {
        isLoading.value = false;
      }
    };

    const deleteCode = async (code: InvitationCode) => {
      isLoading.value = true;
      try {
        await call<InvitationCode>(`/api/admin/invitation-codes/${code.id}`, { method: 'DELETE' });
        const codeIndex = invitationCodes.value.findIndex((c) => c.id === code.id);
        if (codeIndex !== -1) {
          invitationCodes.value.splice(codeIndex, 1);
        }
      } catch {
        $q.notify({ type: 'negative', message: 'Unable to delete code.' });
      } finally {
        isLoading.value = false;
      }
    };

    const columns = [
      { label: 'Code', field: 'code', sortable: true, align: 'left' },
      { name: 'link', label: '', sortable: false, align: 'center' },
      { name: 'delete', label: '', sortable: false, align: 'right' },
    ];

    const invitationCodes = ref<InvitationCode[]>([]);
    onMounted(async () => {
      invitationCodes.value = await call<InvitationCode[]>('/api/admin/invitation-codes');
    });

    return {
      columns,
      invitationCodes,
      deleteCode,
      createCode,
      isLoading,
      copyLink,
    };
  },
});
</script>

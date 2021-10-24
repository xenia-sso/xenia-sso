<template>
  <q-table :columns="columns" :rows="users">
    <template #body-cell-fullname="props">
      <q-td :props="props" class="text-center">{{ props.row.firstName }}&nbsp;{{ props.row.lastName }}</q-td>
    </template>
    <template #body-cell-delete="props">
      <q-td :props="props" class="text-center">
        <q-btn color="negative" icon="delete" flat round @click="confirmDeleteUser(props.row)"></q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { call, User } from 'src/ts/api';
import { useCurrentUser } from 'src/composables/current-user';

export default defineComponent({
  setup() {
    const $q = useQuasar();

    const confirmDeleteUser = (user: User) => {
      $q.dialog({
        title: 'Warning',
        message: `Do you really want to remove user ${user.firstName} ${user.lastName}? This action cannot be undone.`,
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
      }).onOk(async () => {
        try {
          await call('/api/admin/users/' + user.id, { method: 'DELETE' });
        } catch {
          $q.notify({ type: 'negative', message: 'Unable to delete user' });
        }
      });
    };

    const columns = [
      { name: 'fullname', label: 'Name', sortable: true, align: 'left' },
      { label: 'Email', field: 'email', sortable: true, align: 'left' },
      { name: 'delete', label: '', sortable: false, align: 'right' },
    ];

    const { currentUser } = useCurrentUser();
    const users = ref<User[]>([]);
    onMounted(async () => {
      const allUsers = await call<User[]>('/api/admin/users');
      users.value = allUsers.filter((u) => u.id !== currentUser.value!.id);
    });

    return {
      columns,
      users,
      confirmDeleteUser,
    };
  },
});
</script>

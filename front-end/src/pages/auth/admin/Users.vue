<template>
  <q-table :columns="columns" :rows="users">
    <template #body-cell-fullname="props">
      <q-td :props="props" class="text-center">{{ props.row.firstName }}&nbsp;{{ props.row.lastName }}</q-td>
    </template>
    <template #body-cell-isAdmin="props">
      <q-td>
        <q-toggle
          :model-value="props.row.roles.includes('admin')"
          checked-icon="check"
          color="warning"
          unchecked-icon="clear"
          @click="toggleAdmin(props.row, !props.row.roles.includes('admin'))"
        />
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
          const userIndex = users.value.findIndex((c) => c.id === user.id);
          if (userIndex > -1) {
            users.value.splice(userIndex, 1);
          }
        } catch {
          $q.notify({ type: 'negative', message: 'Unable to delete user' });
        }
      });
    };

    const toggleAdmin = async (user: User, value: boolean) => {
      if (value) {
        const proceed = await new Promise((resolve) => {
          $q.dialog({
            title: 'Warning',
            message: `Do you really want to grant user ${user.firstName} ${user.lastName} admin role?`,
            persistent: false,
            ok: {
              flat: false,
              color: 'warning',
              label: 'confirm',
            },
            cancel: {
              color: 'grey-5',
              flat: true,
            },
          })
            .onOk(() => {
              resolve(true);
            })
            .onCancel(() => {
              resolve(false);
            })
            .onDismiss(() => {
              resolve(false);
            });
        });

        if (!proceed) {
          return;
        }
      }

      try {
        await call('/api/admin/users/set-admin/' + user.id, {
          method: 'PUT',
          body: {
            value,
          },
        });
        if (value) {
          user.roles.push('admin');
        } else {
          user.roles = user.roles.filter((r) => r !== 'admin');
        }
      } catch {
        $q.notify({ type: 'negative', message: 'Unable to edit user' });
      }
    };

    const columns = [
      { name: 'fullname', label: 'Name', sortable: true, align: 'left' },
      { label: 'Email', field: 'email', sortable: true, align: 'left' },
      { name: 'isAdmin', label: 'Is Admin?', sortable: true, align: 'left' },
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
      toggleAdmin,
      confirmDeleteUser,
    };
  },
});
</script>

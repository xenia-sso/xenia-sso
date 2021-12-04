<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin q-py-md q-px-lg">
      <q-form @submit="submit()">
        <div class="row q-col-gutter-md">
          <div class="col col-12 text-h6 row items-center">
            <div class="col">{{ isEditing ? 'Edit' : 'Create' }} client</div>
            <div class="col-auto">
              <q-btn v-if="client" flat round color="negative" icon="delete" @click="confirmDelete()" />
            </div>
          </div>

          <div class="col col-12">
            <q-input
              v-model.trim="formFields.name"
              filled
              dense
              square
              label="Name"
              lazy-rules
              :rules="[RULES.required]"
            />
          </div>

          <div class="col col-12">
            <q-input
              v-model.trim="formFields.url"
              filled
              dense
              square
              label="URL"
              lazy-rules
              :rules="[RULES.required, RULES.url]"
            />
          </div>

          <div class="col col-12">
            <q-checkbox v-model="formFields.allUsers" dense label="Grant access to all users" />
          </div>

          <div v-if="!formFields.allUsers" class="col col-12">
            <q-select
              v-model="formFields.grantedUsers"
              :options="filteredUsers"
              filled
              dense
              square
              multiple
              use-input
              use-chips
              input-debounce="0"
              label="Granted users"
              emit-value
              map-options
              @filter="filterUsers"
            />
          </div>

          <div class="col col-12 q-mt-sm">
            <q-btn type="submit" color="primary" class="full-width">Submit</q-btn>
          </div>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType, onMounted } from 'vue';
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { RULES } from 'src/ts/utils/form-validation';
import { Client } from '../../models/clients';
import { call, User } from '../../ts/api';

export default defineComponent({
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  props: {
    client: {
      type: Object as PropType<Client>,
      required: false,
    },
  },
  setup(props) {
    const $q = useQuasar();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

    const isEditing = computed(() => !!props.client);

    const formFields = ref({
      name: isEditing.value ? props.client!.name : '',
      url: isEditing.value ? props.client!.url : '',
      allUsers: isEditing.value ? props.client!.allUsers : false,
      grantedUsers: isEditing.value ? props.client!.grantedUsers.concat() : [],
    });

    const submit = async () => {
      try {
        onDialogOK({
          type: isEditing.value ? 'edit' : 'create',
          client: await call<Client>(`/api/admin/clients${isEditing.value ? `/${props.client!.id}` : ''}`, {
            method: isEditing.value ? 'PUT' : 'POST',
            body: formFields.value,
          }),
        });
      } catch {
        $q.notify({ type: 'negative', message: 'Unable to ' + (isEditing.value ? 'edit' : 'create') + ' client.' });
      }
    };

    const allUsers = ref<User[]>([]);
    const filteredUsers = ref<{ label: string; value: string }[]>([]);
    onMounted(async () => {
      allUsers.value = await call<User[]>('/api/admin/users');
      filteredUsers.value = allUsers.value.map((u) => ({
        value: u.id,
        label: `${u.firstName} ${u.lastName}`,
      }));
    });

    const filterUsers = (val: string, update: (fn: () => void) => void) => {
      update(() => {
        if (val === '') {
          filteredUsers.value = allUsers.value.map((u) => ({
            value: u.id,
            label: `${u.firstName} ${u.lastName}`,
          }));
        } else {
          const needle = val.toLowerCase();
          filteredUsers.value = allUsers.value
            .filter((u) => {
              return u.firstName.toLowerCase().includes(needle) || u.lastName.toLowerCase().includes(needle);
            })
            .map((u) => ({
              value: u.id,
              label: `${u.firstName} ${u.lastName}`,
            }));
        }
      });
    };

    const confirmDelete = () => {
      if (!props.client) {
        return;
      }
      $q.dialog({
        title: 'Warning',
        message: `Do you really want to remove client ${props.client.name}? This action cannot be undone.`,
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
          await call(`/api/admin/clients/${props.client!.id}`, { method: 'DELETE' });
          onDialogOK({ type: 'delete', client: props.client });
        } catch {
          $q.notify({ type: 'negative', message: 'Unable to delete client' });
        }
      });
    };

    return {
      dialogRef,
      onDialogHide,
      onDialogOK,
      onDialogCancel,
      RULES,
      formFields,
      submit,
      filterUsers,
      filteredUsers,
      isEditing,
      confirmDelete,
      allUsers,
    };
  },
});
</script>

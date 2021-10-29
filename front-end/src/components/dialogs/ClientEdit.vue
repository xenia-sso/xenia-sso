<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin q-py-md q-px-lg">
      <q-form @submit="submit()">
        <div class="row q-col-gutter-xs">
          <div class="col col-12 text-h6 q-mb-md row items-center">
            <div class="col">{{ isEditing ? 'Edit' : 'Create' }} client</div>
            <div class="col-auto">
              <q-btn v-if="client" flat round color="negative" icon="delete" @click="confirmDelete()" />
            </div>
          </div>

          <div class="col col-12">
            <q-input v-model.trim="formFields.name" filled dense square label="Name" :rules="[RULES.required]" />
          </div>

          <div class="col col-12 q-py-md">
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
import { defineComponent, ref, computed, PropType } from 'vue';
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { RULES } from 'src/ts/utils/form-validation';
import { Client } from '../../models/clients';
import { call } from '../../ts/api';

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

    const allUsers = ['User 1', 'User 2'];
    const filteredUsers = ref<string[]>([]);
    const filterUsers = (val: string, update: (fn: () => void) => void) => {
      update(() => {
        if (val === '') {
          filteredUsers.value = allUsers;
        } else {
          const needle = val.toLowerCase();
          filteredUsers.value = allUsers.filter((v) => v.toLowerCase().includes(needle));
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
    };
  },
});
</script>

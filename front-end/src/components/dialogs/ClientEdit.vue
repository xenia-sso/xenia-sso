<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin q-py-md q-px-lg">
      <q-form @submit="onDialogOK(formFields)">
        <div class="row q-col-gutter-xs">
          <div class="col col-12 text-h6 q-mb-md row items-center">
            <div class="col">Edit client</div>
            <div class="col-auto">
              <q-btn type="submit" flat round color="negative" icon="delete" />
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
import { defineComponent, ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { RULES } from 'src/utils/form-validation';

export default defineComponent({
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

    const formFields = ref({
      name: '',
      allUsers: false,
      grantedUsers: [],
    });

    const submit = () => {
      console.log('submit');
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
    };
  },
});
</script>

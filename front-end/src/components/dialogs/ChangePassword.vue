<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin q-py-md q-px-lg">
      <q-form @submit="submit">
        <div class="row q-col-gutter-sm">
          <div class="col col-12 text-h6 q-mb-md">Change password</div>

          <div class="col col-12">
            <q-input
              v-model="formFields.oldPassword"
              autofocus
              filled
              square
              dense
              type="password"
              label="Old password"
              lazy-rules
              :rules="[RULES.required]"
            ></q-input>
          </div>

          <div class="col col-12">
            <q-input
              v-model="formFields.password"
              filled
              square
              dense
              type="password"
              label="Password"
              lazy-rules
              :rules="[RULES.required, RULES.password]"
            ></q-input>
          </div>

          <div class="col col-12">
            <q-input
              v-model="formFields.confirmPassword"
              filled
              square
              dense
              type="password"
              label="Confirm password"
              lazy-rules
              :rules="[RULES.required, RULES.password, (v) => v === formFields.password || 'Does not match password.']"
            ></q-input>
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
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { RULES } from 'src/ts/utils/form-validation';
import { call } from 'src/ts/api';

export default defineComponent({
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup() {
    const $q = useQuasar();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

    const formFields = ref({
      oldPassword: '',
      password: '',
      confirmPassword: '',
    });

    const submit = async () => {
      try {
        await call('/api/auth/change-password', {
          method: 'PUT',
          body: {
            oldPassword: formFields.value.oldPassword,
            newPassword: formFields.value.password,
          },
        });
        $q.notify({
          type: 'positive',
          message: 'Password has been changed.',
        });
        onDialogOK(formFields);
      } catch {
        $q.notify({
          type: 'negative',
          message: 'Unable to change password.',
        });
      }
    };

    return {
      dialogRef,
      onDialogHide,
      onDialogOK,
      onDialogCancel,
      RULES,
      formFields,
      submit,
    };
  },
});
</script>

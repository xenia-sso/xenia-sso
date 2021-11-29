<i18n>
{
  "en": {
    "changePassword": "Change password",
    "passwordDoesNotMatch": "Does not match password.",
    "oldPassword": "Old password",
    "password": "Password",
    "confirmPassword": "Confirm password",
    "submit": "Submit"
  },
  "fr": {
    "changePassword": "Changer de mot de passe",
    "passwordDoesNotMatch": "Les mots de passe ne correspondent pas.",
    "oldPassword": "Mot de passe actuel",
    "password": "Nouveau mot de passe",
    "confirmPassword": "Confirmation",
    "submit": "Valider"
  }
}
</i18n>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin q-py-md q-px-lg">
      <q-form @submit="submit">
        <div class="row q-col-gutter-sm">
          <div class="col col-12 text-h6 q-mb-md">{{ t('changePassword') }}</div>

          <div class="col col-12">
            <q-input
              v-model="formFields.oldPassword"
              autofocus
              filled
              square
              dense
              type="password"
              :label="t('oldPassword')"
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
              :label="t('password')"
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
              :label="t('confirmPassword')"
              lazy-rules
              :rules="[RULES.required, RULES.password, (v) => v === formFields.password || t('passwordDoesNotMatch')]"
            ></q-input>
          </div>

          <div class="col col-12 q-mt-sm">
            <q-btn type="submit" color="primary" class="full-width">{{ t('submit') }}</q-btn>
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
import { useI18n } from 'vue-i18n';

export default defineComponent({
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup() {
    const $q = useQuasar();
    const { t } = useI18n();
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
          message: t('notifications.passwordChanged'),
        });
        onDialogOK(formFields);
      } catch {
        $q.notify({
          type: 'negative',
          message: t('errors.unableChangePassword'),
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
      t,
    };
  },
});
</script>

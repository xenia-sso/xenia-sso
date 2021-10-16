<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" :persistent="persistent">
    <q-card class="q-dialog-plugin q-py-md q-px-lg">
      <q-form @submit="onDialogOK(formFields)">
        <div class="row q-col-gutter-xs">
          <div class="col col-12 text-h6 q-mb-md">Edit client secret</div>

          <div class="col col-12">
            <q-banner inline-actions rounded class="bg-warning text-dark">
              <template #avatar>
                <q-icon name="info" color="dark" />
              </template>
              Client secrets are hased and cannot be read once stored. If you lost client secret, generate a new one.
              Please note that this will invalidate previous one.
            </q-banner>
          </div>

          <div class="col col-12 q-mt-sm">
            <q-btn color="negative" class="full-width" :loading="isFetchingSecret" @click="fetchSecret()">
              Generate a new secret
            </q-btn>
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

    const persistent = ref(false);
    const isFetchingSecret = ref(false);
    const fetchSecret = () => {
      isFetchingSecret.value = true;
      persistent.value = true;
    };

    const formFields = ref({
      oldPassword: '',
      password: '',
      confirmPassword: '',
    });

    const submit = () => {
      console.log('submit');
    };

    return {
      dialogRef,
      onDialogHide,
      onDialogOK,
      onDialogCancel,
      RULES,
      formFields,
      submit,
      isFetchingSecret,
      fetchSecret,
      persistent,
    };
  },
});
</script>

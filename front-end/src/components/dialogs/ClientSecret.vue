<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" :persistent="persistent">
    <q-card class="q-dialog-plugin q-py-md q-px-lg">
      <q-form @submit="onDialogOK(formFields)">
        <div class="row q-col-gutter-md">
          <div class="col col-12 row items-center q-mb-sm">
            <div class="col text-h6">Edit client secret</div>
            <div class="col col-auto">
              <q-btn flat round icon="close" color="grey-7" :disable="isFetchingSecret" @click="onDialogHide" />
            </div>
          </div>

          <div class="col col-12">
            <q-banner inline-actions rounded class="bg-warning text-dark">
              <template #avatar>
                <q-icon name="info" color="dark" />
              </template>
              Client secrets are hased and cannot be read once stored. If you lost client secret, generate a new one.
              Please note that this will invalidate previous one.
            </q-banner>
          </div>

          <div class="col col-12">
            <q-btn
              color="negative"
              class="full-width"
              :disable="!!newSecret"
              :loading="isFetchingSecret"
              @click="fetchSecret()"
            >
              Generate a new secret
            </q-btn>
          </div>

          <div v-if="newSecret" class="col col-12 row items-center">
            <div class="col q-mr-sm">
              <div class="q-px-md q-py-sm text-dark new-secret">{{ newSecret }}</div>
            </div>
            <div class="col col-auto">
              <q-btn flat round icon="content_copy" color="primary" @click="copySecret" />
            </div>
          </div>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.new-secret {
  border: 1px dashed $blue-9;
  background-color: $blue-2;
}
</style>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { RULES } from 'src/utils/form-validation';
import { useQuasar } from 'quasar';
import copy from 'copy-to-clipboard';

export default defineComponent({
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup() {
    const $q = useQuasar();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

    const persistent = ref(false);
    const isFetchingSecret = ref(false);
    const newSecret = ref('');
    const fetchSecret = async () => {
      isFetchingSecret.value = true;
      persistent.value = true;
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });

      newSecret.value = 'BPSndMgH6VSAqYc3';
      isFetchingSecret.value = false;
    };

    const copySecret = () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      copy(newSecret.value);
      $q.notify({
        message: 'Secret copied to clipboard',
        color: 'positive',
      });
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
      newSecret,
      copySecret,
    };
  },
});
</script>

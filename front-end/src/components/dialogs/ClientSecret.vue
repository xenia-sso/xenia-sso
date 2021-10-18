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

          <client-secret-copy v-if="newSecret" :secret="newSecret" />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { RULES } from 'src/utils/form-validation';
import ClientSecretCopy from './partials/ClientSecretCopy.vue';

export default defineComponent({
  components: { ClientSecretCopy },
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup() {
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
    };
  },
});
</script>
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

          <template v-if="newSecret">
            <div class="col col-12">New secret:</div>
            <text-copy :text="newSecret" class="q-pt-xs" />
          </template>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { RULES } from 'src/ts/utils/form-validation';
import TextCopy from 'src/components/dialogs/partials/TextCopy.vue';
import { Client } from '../../models/clients';
import { call } from '../../ts/api';

export default defineComponent({
  components: { TextCopy },
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  props: {
    client: {
      type: Object as PropType<Client>,
      required: true,
    },
  },
  setup(props) {
    const $q = useQuasar();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

    const persistent = ref(false);
    const isFetchingSecret = ref(false);
    const newSecret = ref('');
    const fetchSecret = async () => {
      isFetchingSecret.value = true;
      persistent.value = true;
      try {
        const { secret } = await call<{ secret: string }>('/api/admin/clients/secret/' + props.client.id, {
          method: 'PUT',
        });
        newSecret.value = secret;
      } catch {
        $q.notify({
          type: 'negative',
          message: 'Unable to get new secret.',
        });
      } finally {
        isFetchingSecret.value = false;
      }
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

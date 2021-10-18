<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin q-py-md q-px-lg">
      <q-form @submit="onDialogOK()">
        <div class="row q-col-gutter-md">
          <div class="col col-12 row items-center q-mb-sm">
            <div class="col text-h6">Client created</div>
            <div class="col col-auto">
              <q-btn flat round icon="close" color="grey-7" @click="onDialogHide" />
            </div>

            <div class="col col-12 q-my-sm">
              <q-banner inline-actions rounded class="bg-warning text-dark">
                <template #avatar>
                  <q-icon name="info" color="dark" />
                </template>
                Client secrets are hased and cannot be read once stored. Make sure you copied client secret before
                closing the dialog.
              </q-banner>
            </div>
            <div class="col col-12">Client ID:</div>
            <div class="col col-12 q-mb-sm">
              <text-copy :text="id" />
            </div>
            <div class="col col-12">Client secret:</div>
            <div class="col col-12">
              <text-copy :text="secret" />
            </div>
          </div>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import TextCopy from './partials/TextCopy.vue';

export default defineComponent({
  components: { TextCopy },
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  props: {
    id: {
      type: String,
      required: true,
    },
    secret: {
      type: String,
      required: true,
    },
  },
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

    return {
      dialogRef,
      onDialogHide,
      onDialogOK,
      onDialogCancel,
    };
  },
});
</script>

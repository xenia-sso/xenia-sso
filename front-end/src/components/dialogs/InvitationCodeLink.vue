<i18n>
{
  "en": {
    "shareLink": "Share invitation link",
    "redirectAfter": "Redirect after account creation?"
  },
  "fr": {
    "shareLink": "Partager le lien d'invitation",
    "redirectAfter": "Rediriger après inscription ?"
  }
}
</i18n>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin q-py-md q-px-lg">
      <div class="row items-center q-mb-md">
        <div class="col text-h6">{{ t('shareLink') }}</div>
        <div class="col-auto">
          <q-btn icon="close" flat round @click="onDialogHide" />
        </div>
      </div>
      <div class="q-px-lg q-py-lg rounded-borders">
        <div class="row justify-center">
          <qrcode :value="url" :size="180" :margin="4" level="L" />
        </div>
        <TextSeparator class="q-py-md">OR</TextSeparator>
        <TextCopy :text="url" />
      </div>
      <div v-if="invitationCode.clients.length === 1">
        <q-checkbox v-model="redirectAfterRegister">{{ t('redirectAfter') }}</q-checkbox>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { InvitationCode } from '../../models/invitationCodes';
import Qrcode from 'qrcode.vue';
import { useI18n } from 'vue-i18n';
import TextSeparator from './partials/TextSeparator.vue';
import TextCopy from './partials/TextCopy.vue';

export default defineComponent({
  components: { Qrcode, TextSeparator, TextCopy },
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  props: {
    invitationCode: {
      type: Object as PropType<InvitationCode>,
      required: true,
    },
  },
  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
    const { t } = useI18n();
    const redirectAfterRegister = ref(props.invitationCode.clients.length === 1);

    const url = computed(() => {
      let url = `${window.location.origin}/register?code=${props.invitationCode.code}`;
      if (redirectAfterRegister.value) {
        url = `${url}&app=${props.invitationCode.clients[0]}`;
      }
      return url;
    });

    return {
      dialogRef,
      onDialogHide,
      onDialogOK,
      onDialogCancel,
      t,
      redirectAfterRegister,
      url,
    };
  },
});
</script>

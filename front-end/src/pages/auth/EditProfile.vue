<i18n>
{
  "en": {
    "editProfile": "Edit profile",
    "personalInformation": "Personal information",
    "firstName": "First name",
    "lastName": "Last name",
    "submit": "Submit",
    "security": "Security",
    "changePassword": "Change password",
    "account": "Account",
    "deleteAccount": "Delete my account"
  },
  "fr": {
    "editProfile": "Edition du profil",
    "personalInformation": "Informations personnelles",
    "firstName": "Prénom",
    "lastName": "Nom",
    "submit": "Valider",
    "security": "Securité",
    "changePassword": "Changer de mot de passe",
    "account": "Compte",
    "deleteAccount": "Supprimer mon compte"
  }
}
</i18n>

<template>
  <div class="row q-col-gutter-lg">
    <div class="col col-12 text-h6">{{ t('editProfile') }}</div>

    <div class="col col-12 col-md-3 text-subtitle1">{{ t('personalInformation') }}</div>
    <div class="col col-12 col-md-9">
      <q-form @submit="submit">
        <div class="row q-col-gutter-sm">
          <div class="col col-12">
            <q-input
              v-model.trim="profileFormFields.email"
              filled
              square
              dense
              type="email"
              label="Email"
              lazy-rules
              :rules="[RULES.required, RULES.email]"
            ></q-input>
          </div>
          <div class="col col-xs-12 col-sm-6">
            <q-input
              v-model.trim="profileFormFields.firstName"
              filled
              square
              dense
              :label="t('firstName')"
              lazy-rules
              :rules="[RULES.required]"
            ></q-input>
          </div>
          <div class="col col-xs-12 col-sm-6">
            <q-input
              v-model.trim="profileFormFields.lastName"
              filled
              square
              dense
              :label="t('lastName')"
              lazy-rules
              :rules="[RULES.required]"
            ></q-input>
          </div>

          <div class="col col-12">
            <q-btn type="submit" color="primary" class="full-width q-mt-sm" :loading="isSubmitingProfileEdit">
              {{ t('submit') }}
            </q-btn>
          </div>
        </div>
      </q-form>
    </div>

    <div class="col col-12">
      <q-separator />
    </div>

    <div class="col col-12 col-md-3 text-subtitle1">{{ t('security') }}</div>
    <div class="col col-12 col-md-9">
      <q-btn color="primary" class="full-width" @click="changePassword()">{{ t('changePassword') }}</q-btn>
    </div>

    <div class="col col-12">
      <q-separator />
    </div>

    <div class="col col-12 col-md-3 text-subtitle1">{{ t('account') }}</div>
    <div class="col col-12 col-md-9">
      <q-btn color="negative" class="full-width" @click="confirmDeleteAccount()">{{ t('deleteAccount') }}</q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
import { RULES } from 'src/ts/utils/form-validation';
import ChangePassword from 'src/components/dialogs/ChangePassword.vue';
import { useCurrentUser } from '../../composables/current-user';
import { call, CallError, User } from '../../ts/api';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const { t } = useI18n();

    const { currentUser } = useCurrentUser();

    const profileFormFields = ref({
      email: currentUser.value!.email,
      firstName: currentUser.value!.firstName,
      lastName: currentUser.value!.lastName,
    });

    const isSubmitingProfileEdit = ref(false);
    const submit = async () => {
      isSubmitingProfileEdit.value = true;
      try {
        currentUser.value = await call<User>('/api/profile', { method: 'PUT', body: profileFormFields.value });
      } catch {
        $q.notify({
          type: 'negative',
          message: t('errors.unableEditProfile'),
        });
      } finally {
        isSubmitingProfileEdit.value = false;
      }
    };

    const changePassword = () => {
      $q.dialog({
        component: ChangePassword,
      }).onOk((password: string) => {
        console.log('onOK', password);
      });
    };

    const confirmDeleteAccount = () => {
      $q.dialog({
        title: t('labels.warning'),
        message: t('confirmation.deleteAccount'),
        prompt: {
          model: '',
          type: 'password',
          filled: true,
          label: t('labels.password'),
        },
        persistent: false,
        ok: {
          flat: false,
          color: 'negative',
          label: t('labels.confirm'),
        },
        cancel: {
          color: 'grey-5',
          flat: true,
        },
      }).onOk(async (password: string) => {
        try {
          await call('/api/profile', { method: 'DELETE', body: { password } });
          currentUser.value = undefined;
        } catch (e) {
          if (!(e instanceof CallError)) {
            $q.notify({ type: 'negative', message: t('errors.unexpectedError') });
            return;
          }

          let message = t('errors.unableDeleteAccount');
          if (e.status === 401) {
            message = t('errors.wrongCredentials');
          }
          $q.notify({ type: 'negative', message });
        }
      });
    };

    return {
      RULES,
      profileFormFields,
      submit,
      changePassword,
      confirmDeleteAccount,
      isSubmitingProfileEdit,
      t,
    };
  },
});
</script>

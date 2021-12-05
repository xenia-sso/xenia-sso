<template>
  <div class="text-h1 text-center q-pt-xl">Xenia</div>
  <div class="text-body1 q-mt-xl q-py-md q-px-lg banner">
    Setup your Xenia instance by creating your first admin user.
  </div>

  <q-card class="q-mt-md q-px-md q-py-md">
    <q-form class="row q-col-gutter-sm" @submit="submit">
      <div class="col col-12">
        <q-input
          v-model.trim="formFields.email"
          filled
          square
          dense
          type="email"
          label="Email"
          lazy-rules
          :rules="[RULES.required, RULES.email]"
        ></q-input>
      </div>
      <div class="col col-6">
        <q-input
          v-model.trim="formFields.firstName"
          filled
          square
          dense
          :label="t('forms.firstName')"
          lazy-rules
          :rules="[RULES.required]"
        ></q-input>
      </div>
      <div class="col col-6">
        <q-input
          v-model.trim="formFields.lastName"
          filled
          square
          dense
          :label="t('forms.lastName')"
          lazy-rules
          :rules="[RULES.required]"
        ></q-input>
      </div>

      <div class="col col-12">
        <q-separator />
      </div>

      <div class="col col-12">
        <q-input
          v-model="formFields.password"
          filled
          square
          dense
          type="password"
          :label="t('forms.password')"
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
          :label="t('forms.confirmPassword')"
          lazy-rules
          :rules="[
            RULES.required,
            RULES.password,
            (v) => v === formFields.password || t('validation.passwordDoesNotMatch'),
          ]"
        ></q-input>
      </div>

      <div class="col col-12 q-mt-xs">
        <q-btn type="submit" color="primary" class="full-width">{{ t('forms.continue') }}</q-btn>
      </div>
    </q-form>
  </q-card>
</template>

<style scoped>
.banner {
  border: 1px solid grey;
  border-left: 6px solid grey;
}
</style>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { RULES } from 'src/ts/utils/form-validation';
import { useI18n } from 'vue-i18n';
import { call, User, login, CallError, BAD_REQUEST_STATUS, EMAIL_ALREADY_EXISTS_MESSAGE } from '../ts/api';
import { useRouter } from 'vue-router';
import { useCurrentUser } from '../composables/current-user';
import { useQuasar } from 'quasar';

export default defineComponent({
  setup() {
    const router = useRouter();
    const { t } = useI18n();
    const $q = useQuasar();
    const formFields = ref({
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    });

    onMounted(async () => {
      const { initialized } = await call<{ initialized: boolean }>('/api/init/state', {
        method: 'POST',
      });
      if (initialized) {
        void router.replace('/');
      }
    });

    const submit = async () => {
      const body = {
        email: formFields.value.email,
        firstName: formFields.value.firstName,
        lastName: formFields.value.lastName,
        password: formFields.value.password,
      };

      try {
        await call<User>('/api/init/start', {
          method: 'POST',
          body,
        });
        const user = await login(body.email, body.password);
        const { currentUser } = useCurrentUser();
        currentUser.value = user;
      } catch (e) {
        if (!(e instanceof CallError)) {
          $q.notify({ type: 'negative', message: t('errors.unexpectedError') });
          return;
        }

        if (e.status === BAD_REQUEST_STATUS && e.message === EMAIL_ALREADY_EXISTS_MESSAGE) {
          $q.notify({ type: 'negative', message: t('errors.emailAlreadyExists') });
        } else {
          $q.notify({ type: 'negative', message: e.message });
        }
      }
    };

    return {
      formFields,
      RULES,
      submit,
      t,
    };
  },
});
</script>

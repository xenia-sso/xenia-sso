<i18n>
{
  "en": {
    "register": "Register",
    "invitationCode": "Invitation code",
    "firstName": "First name",
    "lastName": "Last name",
    "password": "Password",
    "confirmPassword": "Confirm password",
    "passwordDoesNotMatch": "Does not match password.",
    "alreadyHaveAccount": "Already have an account?",
    "login": "Login",
    "continue": "Continue"
  },
  "fr": {
    "register": "Inscription",
    "invitationCode": "Code d'invitation",
    "firstName": "Prénom",
    "lastName": "Nom",
    "password": "Mot de passe",
    "confirmPassword": "Confirmation",
    "passwordDoesNotMatch": "Les mots de passe ne correspondent pas.",
    "alreadyHaveAccount": "Vous avez un compte?",
    "login": "Connexion",
    "continue": "Continuer"
  }
}
</i18n>

<template>
  <q-form @submit="submit">
    <div class="row q-col-gutter-sm">
      <div class="col col-12 text-h6">{{ $t('register') }}</div>

      <div class="col col-12">
        <q-input
          v-model.trim="formFields.invitationCode"
          filled
          square
          dense
          :label="$t('invitationCode')"
          lazy-rules
          :disable="!canEditInvitationCode"
          :rules="[RULES.required]"
        ></q-input>
      </div>

      <div class="col col-12">
        <q-separator />
      </div>

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
          :label="$t('firstName')"
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
          :label="$t('lastName')"
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
          :label="$t('password')"
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
          :label="$t('confirmPassword')"
          lazy-rules
          :rules="[RULES.required, RULES.password, (v) => v === formFields.password || $t('passwordDoesNotMatch')]"
        ></q-input>
      </div>

      <div class="col col-12 text-right">
        <span class="text-grey-7">{{ $t('alreadyHaveAccount') }}&nbsp;</span>
        <router-link to="/login" class="text-primary">{{ $t('login') }}</router-link>
      </div>

      <div class="col col-12">
        <q-btn type="submit" color="primary" class="full-width q-mt-sm">{{ $t('continue') }}</q-btn>
      </div>
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { RULES } from 'src/ts/utils/form-validation';
import { useRoute } from 'vue-router';
import { call, CallError, login, User } from 'src/ts/api';
import { useQuasar } from 'quasar';
import { useCurrentUser } from 'src/composables/current-user';

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const route = useRoute();
    const canEditInvitationCode = ref(true);

    onMounted(() => {
      if (route.query.code) {
        formFields.value.invitationCode = route.query.code as string;
        canEditInvitationCode.value = false;
      }
    });

    const submit = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...payload } = formFields.value;
        await call<User>('/api/auth/register', {
          method: 'POST',
          body: payload,
        });
        const user = await login(payload.email, payload.password);
        const { currentUser } = useCurrentUser();
        currentUser.value = user;
      } catch (e) {
        if (!(e instanceof CallError)) {
          $q.notify({ type: 'negative', message: 'An unexpected error occurred. Try again later.' });
          return;
        }

        $q.notify({ type: 'negative', message: e.message });
      }
    };

    const loginLink = computed(() => {
      if (!route.meta?.isOAuth2Page) {
        return '/login';
      }
      return {
        path: '/oauth2/login',
        query: route.query,
      };
    });

    const formFields = ref({
      invitationCode: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    });

    return {
      RULES,
      formFields,
      loginLink,
      submit,
      canEditInvitationCode,
    };
  },
});
</script>

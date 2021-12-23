<template>
  <q-form @submit="submit">
    <div class="row q-col-gutter-sm">
      <div class="col col-12 text-h6">{{ t('forms.login') }}</div>

      <div class="col col-12">
        <q-input
          v-model.trim="formFields.email"
          filled
          square
          dense
          label="Email"
          lazy-rules
          :rules="[RULES.required, RULES.email]"
        ></q-input>
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
          :rules="[RULES.required]"
        ></q-input>
      </div>

      <div class="col col-12 text-right">
        <span class="text-grey-7">{{ t('forms.noAccountYet') }}&nbsp;</span>
        <router-link :to="registerLink" class="text-primary">{{ t('forms.register') }}</router-link>
      </div>

      <div class="col col-12 q-mt-sm">
        <q-btn type="submit" color="primary" :loading="isLoading" class="full-width">{{ t('forms.continue') }}</q-btn>
      </div>
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, computed } from 'vue';
import { RULES } from 'src/ts/utils/form-validation';
import { CallError, login } from 'src/ts/api';
import { useCurrentUser } from 'src/composables/current-user';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const route = useRoute();
    const { t } = useI18n();
    const isLoading = ref(false);
    const { isSilentlyLoggingIn } = useCurrentUser();

    watch(
      () => isSilentlyLoggingIn.value,
      (val: boolean) => {
        if (!val) {
          $q.loading.hide();
        }
      }
    );
    onMounted(() => {
      if (isSilentlyLoggingIn.value) {
        $q.loading.show();
      }
    });

    const formFields = ref({
      email: '',
      password: '',
    });

    const submit = async () => {
      isLoading.value = true;
      try {
        const user = await login(formFields.value.email, formFields.value.password);
        const { currentUser } = useCurrentUser();
        currentUser.value = user;
      } catch (e) {
        if (!(e instanceof CallError)) {
          $q.notify({ type: 'negative', message: t('errors.unexpectedError') });
          return;
        }

        if (e.status === 401) {
          $q.notify({ type: 'negative', message: t('errors.wrongCredentals') });
        } else {
          $q.notify({ type: 'negative', message: e.message });
        }
      }
      isLoading.value = false;
    };

    const registerLink = computed(() => {
      if (!route.meta?.isOAuth2Page) {
        return '/register';
      }
      return {
        path: '/oauth2/register',
        query: route.query,
      };
    });

    return {
      RULES,
      registerLink,
      formFields,
      submit,
      isLoading,
      t,
    };
  },
});
</script>

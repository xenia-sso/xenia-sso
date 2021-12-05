<template>
  <div class="text-h1 text-center q-pt-xl">Xenia</div>
  <div class="text-body1 q-mt-xl q-py-md q-px-lg banner">
    Setup your Xenia instance by creating your first admin user.
  </div>

  <q-card class="q-mt-md q-px-md q-py-md">
    <q-form class="row q-col-gutter-sm">
      <div class="col col-12">
        <q-input
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
        <q-input filled square dense :label="t('forms.firstName')" lazy-rules :rules="[RULES.required]"></q-input>
      </div>
      <div class="col col-6">
        <q-input filled square dense :label="t('forms.lastName')" lazy-rules :rules="[RULES.required]"></q-input>
      </div>

      <div class="col col-12">
        <q-separator />
      </div>

      <div class="col col-12">
        <q-input
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
        <q-btn color="primary" class="full-width">{{ t('forms.continue') }}</q-btn>
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
import { defineComponent, onMounted } from 'vue';
import { RULES } from 'src/ts/utils/form-validation';
import { useI18n } from 'vue-i18n';
import { call } from '../ts/api';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();
    const { t } = useI18n();

    onMounted(async () => {
      const { initialized } = await call<{ initialized: boolean }>('/api/init/state', {
        method: 'POST',
      });
      if (initialized) {
        void router.replace('/');
      }
    });

    return {
      RULES,
      t,
    };
  },
});
</script>

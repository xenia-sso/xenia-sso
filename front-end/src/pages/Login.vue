<template>
  <q-form @submit="submit">
    <div class="row q-col-gutter-sm">
      <div class="col col-12 text-h6">Login</div>

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
          label="Password"
          lazy-rules
          :rules="[RULES.required]"
        ></q-input>
      </div>

      <div class="col col-12 text-right">
        <span class="text-grey-7">No account yet? </span>
        <router-link to="/register" class="text-primary">Register</router-link>
      </div>

      <div class="col col-12 q-mt-sm">
        <q-btn type="submit" color="primary" :loading="isLoading" class="full-width">Continue</q-btn>
      </div>
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue';
import { RULES } from 'src/ts/utils/form-validation';
import { CallError, login } from 'src/ts/api';
import { useCurrentUser } from 'src/composables/current-user';
import { useQuasar } from 'quasar';

export default defineComponent({
  setup() {
    const $q = useQuasar();
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
          $q.notify({ type: 'negative', message: 'An unexpected error occurred. Try again later.' });
          return;
        }

        if (e.status === 400) {
          $q.notify({ type: 'negative', message: 'Wrong credentials.' });
        } else {
          $q.notify({ type: 'negative', message: e.message });
        }
      }
      isLoading.value = false;
    };

    return {
      RULES,
      formFields,
      submit,
      isLoading,
    };
  },
});
</script>

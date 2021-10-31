<template>
  <q-form @submit="submit">
    <div class="row q-col-gutter-sm">
      <div class="col col-12 text-h6">Login</div>

      <div v-if="error" class="col col-12">
        <q-banner class="bg-negative">
          <template v-slot:avatar>
            <q-icon name="cancel" />
          </template>
          <span>{{ error }}</span>
        </q-banner>
      </div>

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
          v-model.trim="formFields.password"
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
import { defineComponent, ref } from 'vue';
import { RULES } from 'src/ts/utils/form-validation';
import { CallError, login } from 'src/ts/api';
import { useCurrentUser } from 'src/composables/current-user';

export default defineComponent({
  setup() {
    const isLoading = ref(false);
    const error = ref('');

    const formFields = ref({
      email: '',
      password: '',
    });

    const submit = async () => {
      isLoading.value = true;
      error.value = '';
      try {
        const user = await login(formFields.value.email, formFields.value.password);
        const { currentUser } = useCurrentUser();
        currentUser.value = user;
      } catch (e) {
        if (!(e instanceof CallError)) {
          return;
        }

        if (e.status === 401) {
          error.value = 'Wrong credentials';
        } else {
          error.value = e.message;
        }
      }
      isLoading.value = false;
    };

    return {
      RULES,
      formFields,
      submit,
      error,
      isLoading,
    };
  },
});
</script>

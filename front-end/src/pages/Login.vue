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

      <div class="col col-12 q-mt-sm">
        <q-btn type="submit" color="primary" class="full-width">Continue</q-btn>
      </div>
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { RULES } from 'src/ts/utils/form-validation';
import { call, login } from 'src/ts/utils/api';

export default defineComponent({
  setup() {
    onMounted(async () => {
      try {
        const user = (await call('/api/auth/user')).data;
        console.log(user);
      } catch {
        // fail silently
      }
    });

    const formFields = ref({
      email: '',
      password: '',
    });

    const submit = async () => {
      try {
        const user = await login(formFields.value.email, formFields.value.password);
        console.log(user);
      } catch {
        // TODO: handle
      }
    };

    return {
      RULES,
      formFields,
      submit,
    };
  },
});
</script>

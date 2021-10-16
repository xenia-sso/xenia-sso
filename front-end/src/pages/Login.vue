<template>
  <q-form @submit="submit">
    <div class="row q-col-gutter-sm">
      <div class="col col-12 text-h6">Login</div>

      <div class="col col-12">
        <q-input
          v-model="formFields.email"
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

      <div class="col col-12 q-mt-sm">
        <q-btn type="submit" color="primary" class="full-width">Continue</q-btn>
      </div>
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { RULES } from 'src/utils/form-validation';

export default defineComponent({
  setup() {
    const submit = () => {
      console.log('submit');
    };

    const formFields = ref({
      email: '',
      password: '',
    });

    return {
      RULES,
      formFields,
      submit,
    };
  },
});
</script>

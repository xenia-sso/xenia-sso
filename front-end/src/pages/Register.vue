<template>
  <q-form @submit="submit">
    <div class="row q-col-gutter-sm">
      <div class="col col-12 text-h6">Register</div>

      <div class="col col-12">
        <q-input
          v-model.trim="formFields.invitationCode"
          filled
          square
          dense
          label="Invitation code"
          lazy-rules
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
          label="Firstname"
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
          label="Lastname"
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
          label="Password"
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
          label="Confirm password"
          lazy-rules
          :rules="[RULES.required, RULES.password]"
        ></q-input>
      </div>

      <div class="col col-12">
        <q-btn type="submit" color="primary" class="full-width q-mt-sm">Continue</q-btn>
      </div>
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { RULES } from 'src/ts/utils/form-validation';

export default defineComponent({
  setup() {
    const submit = () => {
      console.log('submit');
    };

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
      submit,
    };
  },
});
</script>

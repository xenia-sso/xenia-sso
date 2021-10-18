<template>
  <div class="row q-col-gutter-lg">
    <div class="col col-12 text-h6">Edit profile</div>

    <div class="col col-12 col-md-3 text-subtitle1">Personal information</div>
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
              label="Firstname"
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
              label="Lastname"
              lazy-rules
              :rules="[RULES.required]"
            ></q-input>
          </div>

          <div class="col col-12">
            <q-btn type="submit" color="primary" class="full-width q-mt-sm">Submit</q-btn>
          </div>
        </div>
      </q-form>
    </div>

    <div class="col col-12">
      <q-separator />
    </div>

    <div class="col col-12 col-md-3 text-subtitle1">Security</div>
    <div class="col col-12 col-md-9">
      <q-btn color="primary" class="full-width" @click="changePassword()">Change password</q-btn>
    </div>

    <div class="col col-12">
      <q-separator />
    </div>

    <div class="col col-12 col-md-3 text-subtitle1">Account</div>
    <div class="col col-12 col-md-9">
      <q-btn color="negative" class="full-width" @click="confirmDeleteAccount()">Delete my account</q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
import { RULES } from 'src/utils/form-validation';
import ChangePassword from 'src/components/dialogs/ChangePassword.vue';

export default defineComponent({
  setup() {
    const $q = useQuasar();

    const submit = () => {
      console.log('submit');
    };

    const profileFormFields = ref({
      email: '',
      firstName: '',
      lastName: '',
    });

    const changePassword = () => {
      $q.dialog({
        component: ChangePassword,
      }).onOk((password: string) => {
        console.log('onOK', password);
      });
    };

    const confirmDeleteAccount = () => {
      $q.dialog({
        title: 'Warning',
        message: 'You are about to delete your account. Please enter your password to confirm.',
        prompt: {
          model: '',
          type: 'password',
        },
        cancel: true,
        persistent: false,
      }).onOk((password: string) => {
        console.log('onOK', password);
      });
    };

    return {
      RULES,
      profileFormFields,
      submit,
      changePassword,
      confirmDeleteAccount,
    };
  },
});
</script>

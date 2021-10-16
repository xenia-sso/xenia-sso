<template>
  <div class="row q-col-gutter-sm">
    <div class="col col-12">
      <div class="text-h6">Register</div>
    </div>

    <div class="col col-12">
      <q-input filled square dense label="Invitation code"></q-input>
    </div>

    <div class="col col-12">
      <q-separator />
    </div>

    <div class="col col-12">
      <q-input filled square dense label="Email"></q-input>
    </div>
    <div class="col col-6">
      <q-input filled square dense label="Firstname"></q-input>
    </div>
    <div class="col col-6">
      <q-input filled square dense label="Lastname"></q-input>
    </div>

    <div class="col col-12">
      <q-separator />
    </div>

    <div class="col col-12">
      <q-input filled square dense type="password" label="Password"></q-input>
    </div>

    <div class="col col-12">
      <q-input filled square dense type="confirm-password" label="Confirm password"></q-input>
    </div>

    <div class="col col-12">
      <q-btn color="primary" class="full-width q-mt-sm">Continue</q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

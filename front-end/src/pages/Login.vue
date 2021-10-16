<template>
  <div class="row q-col-gutter-sm">
    <div class="col col-12 text-h6">Login</div>

    <div class="col col-12">
      <q-input filled square dense label="Email"></q-input>
    </div>

    <div class="col col-12">
      <q-input filled square dense type="password" label="Password"></q-input>
    </div>

    <div class="col col-12 q-mt-sm">
      <q-btn color="primary" class="full-width">Continue</q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

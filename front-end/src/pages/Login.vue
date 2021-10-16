<template>
  <div class="text-h6">Login</div>
  <q-input filled square dense label="Email" class="q-mt-sm"></q-input>
  <q-input
    filled
    square
    dense
    type="password"
    label="Password"
    class="q-mt-sm"
  ></q-input>
  <q-btn color="primary" class="full-width q-mt-md">Continue</q-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  // setup() {
  // },
});
</script>

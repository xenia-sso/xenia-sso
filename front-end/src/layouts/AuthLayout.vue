<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-card class="fixed-center q-py-md q-px-lg main-card">
        <router-view />
      </q-card>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.main-card {
  width: 350px;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AuthLayout',
});
</script>

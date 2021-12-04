<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <div class="page">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.page {
  max-width: 750px;
  margin: auto;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InitializeLayout',
});
</script>

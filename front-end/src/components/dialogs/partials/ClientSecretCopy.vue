<template>
  <div class="col col-12 row items-center">
    <div class="col q-mr-sm">
      <div class="q-px-md q-py-sm text-dark secret-section">{{ secret }}</div>
    </div>
    <div class="col col-auto">
      <q-btn flat round icon="content_copy" color="primary" @click="copySecret()" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.secret-section {
  border: 1px dashed $blue-9;
  background-color: $blue-2;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';
import copy from 'copy-to-clipboard';

export default defineComponent({
  props: {
    secret: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const $q = useQuasar();

    const copySecret = () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      copy(props.secret);
      $q.notify({
        message: 'Secret copied to clipboard',
        color: 'positive',
      });
    };

    return {
      copySecret,
    };
  },
});
</script>

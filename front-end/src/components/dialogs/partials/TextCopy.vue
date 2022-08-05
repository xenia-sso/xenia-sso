<template>
  <div class="col col-12 row items-center">
    <div class="col q-mr-sm">
      <div class="q-px-md q-py-sm text-dark secret-section">{{ text }}</div>
    </div>
    <div class="col col-auto">
      <q-btn flat round icon="content_copy" color="primary" @click="copyText()" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.secret-section {
  border: 1px dashed $blue-9;
  background-color: $blue-2;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';
import copy from 'copy-to-clipboard';

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const $q = useQuasar();

    const copyText = () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      copy(props.text);
      $q.notify({
        message: 'Text copied to clipboard',
        color: 'positive',
      });
    };

    return {
      copyText,
    };
  },
});
</script>

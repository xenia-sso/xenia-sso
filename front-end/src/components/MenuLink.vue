<template>
  <q-item clickable @click="navigate()">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: '',
    },

    path: {
      type: String,
      default: '#',
    },

    icon: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const router = useRouter();
    const navigate = () => {
      void router.push(props.path);
    };

    return {
      navigate,
    };
  },
});
</script>

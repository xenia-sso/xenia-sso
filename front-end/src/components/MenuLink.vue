<template>
  <q-item clickable :active="active" active-class="text-white bg-grey-9" @click="navigate()">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ t(title) }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

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
    const { t } = useI18n();

    const navigate = () => {
      void router.push(props.path);
    };

    const active = computed(() => {
      return router.currentRoute.value.path === props.path;
    });

    return {
      navigate,
      active,
      t,
    };
  },
});
</script>

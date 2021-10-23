import { ref, onMounted } from 'vue';
import { call, User } from 'src/ts/api';

const currentUser = ref<User>();

const init = async () => {
  try {
    const data = await call<User>('/api/auth/user');
    currentUser.value = data;
  } catch {}
};

onMounted(() => {
  void init();
});

export const useCurrentUser = () => ({
  currentUser,
});

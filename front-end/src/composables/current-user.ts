import { ref, watch } from 'vue';
import { call, User } from 'src/ts/api';

const currentUser = ref<User>();

const init = async () => {
  try {
    const data = await call<User>('/api/auth/user');
    currentUser.value = data;
  } catch {}
};

const onCurrentUserChangeCallbacks: ((user: User | undefined) => void)[] = [];
const onCurrentUserChange = (cb: (user: User | undefined) => void) => {
  onCurrentUserChangeCallbacks.push(cb);
};

watch(
  () => currentUser.value,
  () => {
    onCurrentUserChangeCallbacks.forEach((cb) => cb(currentUser.value));
  }
);

export const useCurrentUser = () => ({
  init,
  currentUser,
  onCurrentUserChange,
});

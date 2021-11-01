import { ref, watch } from 'vue';
import { call, User } from 'src/ts/api';

const currentUser = ref<User>();

const init = async () => {
  try {
    const data = await call<User>('/api/auth/user');
    currentUser.value = data;
  } catch {}
};

const onCurrentUserChangeCallbacks: ((user: User | undefined) => void | Promise<void>)[] = [];
const onCurrentUserChange = (cb: (user: User | undefined) => void | Promise<void>) => {
  onCurrentUserChangeCallbacks.push(cb);
};

watch(
  () => currentUser.value,
  () => {
    for (const cb of onCurrentUserChangeCallbacks) {
      void cb(currentUser.value);
    }
  }
);

export const useCurrentUser = () => ({
  init,
  currentUser,
  onCurrentUserChange,
});

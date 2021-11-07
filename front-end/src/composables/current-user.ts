import { ref, watch } from 'vue';
import { call, User } from 'src/ts/api';

const currentUser = ref<User>();
const isSilentlyLoggingIn = ref(false);

const silentLogin = async () => {
  isSilentlyLoggingIn.value = true;
  try {
    const data = await call<User>('/api/auth/user');
    currentUser.value = data;
  } catch {
  } finally {
    isSilentlyLoggingIn.value = false;
  }
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
  silentLogin,
  currentUser,
  isSilentlyLogin: isSilentlyLoggingIn,
  onCurrentUserChange,
});

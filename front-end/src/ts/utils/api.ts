/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue';

const UNAUTHORIZED_STATUS = 401;

export class CallError extends Error {
  public name: string;
  public status: number | undefined;

  constructor(error: { name: string; message: string; status?: number }) {
    super(error.message);
    this.name = error.name;
    this.status = error.status;
  }
}

const internalCall = async <T>(url: string, request: RequestInit = {}, token = '') => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = token;
  }

  const options: RequestInit = {
    method: request.method || 'GET',
    headers,
    credentials: 'include',
  };

  if (request.body) {
    options.body = JSON.stringify(request.body);
  }

  let res;
  try {
    res = await fetch(url, options);
  } catch (err) {
    if (err instanceof Error) {
      throw new CallError({ name: err.name, message: err.message });
    }
    throw new CallError({ name: 'NetworkError', message: 'An unexpected error occurred.' });
  }

  if (!res.ok) {
    const json = (await res.json()) as { name: string; message: string };
    throw new CallError({
      name: json.name,
      message: json.message,
      status: res.status,
    });
  }

  const json = (await res.json()) as T;
  return json;
};

const refreshToken = () => {
  return internalCall<{ token: string }>('/api/auth/refresh', { method: 'POST' });
};

let jwt = '';
export const call = async <T>(
  url: string,
  // RequestInit interface allows "any" type for body field
  // We want to restrict to object or undefined
  fetchOptions: Omit<RequestInit, 'body'> & { body?: Record<string, any> } = {},
  { authenticated = true, withRefresh = true } = {}
) => {
  try {
    return await internalCall<T>(url, fetchOptions as any, authenticated ? jwt : undefined);
  } catch (err) {
    // All errors should ever be CallError since Network Errors are transformed into Call Errors in internalCall method.
    if (!(err instanceof CallError)) {
      throw new Error('An unexpected error occurred.');
    }

    if (err.status !== UNAUTHORIZED_STATUS || !withRefresh || !authenticated) {
      throw err;
    }

    const { token } = await refreshToken();
    jwt = token;

    return internalCall<T>(url, fetchOptions as any, jwt);
  }
};

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export const currentUser = ref<User>();
export const login = async (email: string, password: string) => {
  const data = await call<{ token: string; user: User }>(
    '/api/auth/login',
    {
      method: 'POST',
      body: {
        email,
        password,
      },
    },
    {
      authenticated: false,
    }
  );

  jwt = data.token;
  currentUser.value = data.user;
};

export const init = async () => {
  try {
    const data = await call<User>('/api/auth/user');
    currentUser.value = data;
  } catch {}
};

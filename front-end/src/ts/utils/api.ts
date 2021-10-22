const UNAUTHORIZED_STATUS = 401;

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

  const res = await fetch(url, options);
  return {
    ok: res.ok,
    status: res.status,
    data: (await res.json()) as T,
  };
};

const refreshToken = async () => {
  const res = await internalCall<{ token: string }>('/api/auth/refresh', { method: 'POST' });
  if (!res.ok) {
    return {
      token: '',
    };
  }

  return {
    token: res.data.token,
  };
};

let jwt = '';
export const call = async <T>(
  url: string,
  // Allow object body
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchOptions: Omit<RequestInit, 'body'> & { body?: any } = {},
  { authenticated = true, withRefresh = true } = {}
) => {
  const res = await internalCall<T>(url, fetchOptions, authenticated ? jwt : undefined);
  if (res.ok) {
    return res;
  }

  if (res.status !== UNAUTHORIZED_STATUS || !withRefresh || !authenticated) {
    throw new Error();
  }

  const { token } = await refreshToken();
  if (!token) {
    throw new Error();
  }
  jwt = token;

  return internalCall<T>(url, fetchOptions, jwt);
};

export const login = async (email: string, password: string) => {
  const res = await call<{ token: string; user: unknown }>(
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

  if (!res.ok) {
    throw new Error();
  }

  jwt = res.data.token;
  return res.data.user;
};

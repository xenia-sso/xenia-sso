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
  fetchOptions: RequestInit = {},
  { authenticated = true, withRefresh = true } = {}
) => {
  const res = await internalCall<T>(url, fetchOptions, authenticated ? jwt : undefined);
  console.log(res.ok);
  if (res.ok) {
    return res;
  }

  if (res.status !== UNAUTHORIZED_STATUS || !withRefresh) {
    throw new Error();
  }

  const { token } = await refreshToken();
  jwt = token;
  return internalCall<T>(url, fetchOptions, authenticated ? jwt : undefined);
};

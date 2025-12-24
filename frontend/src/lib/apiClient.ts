import { router } from '@/main';
import Axios, { type InternalAxiosRequestConfig } from 'axios';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }

  config.withCredentials = true;
  return config;
}

// Prefer Vite-prefixed env var; optionally support legacy API_URL via env typing
const BASE_URL = import.meta.env.VITE_API_URL ?? import.meta.env.API_URL ?? '';

export const apiClient = Axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use(authRequestInterceptor);
apiClient.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    // TODO: add toast
    // const message = error.response?.data?.message || error.message;

    if (error.response?.status === 401) {
      const searchParams = new URLSearchParams();
      const redirectTo =
        searchParams.get('redirectTo') || window.location.pathname;
      router.navigate({
        to: '/sign-in',
        params: {
          redirectTo: redirectTo,
        },
      });
    }

    return Promise.reject(error);
  }
);

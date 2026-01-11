import { api } from '@/lib/apiClient';
import { queryClient } from '@/lib/queryClient';
import { router, userQueryKey } from '@/main';
import { type User } from '@schemas/userSchema';
import type { AxiosRequestConfig } from 'axios';

export const authService = {
  async register(user: User) {
    await api.post('/auth/register', user);
  },

  async login(credentials: { email: string; password: string }) {
    await api.post('/auth/login', credentials);
  },

  async logout() {
    await queryClient.invalidateQueries({ queryKey: [userQueryKey] });
    router.invalidate();
    await api.post('/auth/logout');
  },

  async getCurrentUser(config?: AxiosRequestConfig): Promise<User | null> {
    const { user } = await api.get<{ user: User }>('/users/me', config);

    return user;
  },
};

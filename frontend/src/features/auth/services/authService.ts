import { apiClient } from '@/lib/apiClient';
import { queryClient } from '@/lib/queryClient';
import { router, userQueryKey } from '@/main';
import { type User } from '@schemas/userSchema';
import type { AxiosRequestConfig } from 'axios';

export const authService = {
  async register(user: User) {
    await apiClient.post('/auth/register', user);
  },

  async login(credentials: { email: string; password: string }) {
    await apiClient.post('/auth/login', credentials);
  },

  async logout() {
    await queryClient.invalidateQueries({ queryKey: [userQueryKey] });
    router.invalidate();
    await apiClient.post('/auth/logout');
  },

  async getCurrentUser(config?: AxiosRequestConfig): Promise<User | null> {
    try {
      const data = (await apiClient.get<User>('/users/me', config)) as unknown as User;
      return data;
    } catch {
      return null;
    }
  },
};

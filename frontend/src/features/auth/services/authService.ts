import { apiClient } from '@/lib/apiClient';
import { queryClient } from '@/lib/queryClient';
import { router, userQueryKey } from '@/main';
import { type User } from '@schemas/userSchema';
import type { AxiosRequestConfig } from 'axios';

export const authService = {
  async register(user: User) {
    await apiClient.post('/register', user);
  },

  async login(credentials: { email: string; password: string }) {
    await apiClient.post('/login', credentials);
  },

  async logout() {
    await queryClient.invalidateQueries({ queryKey: [userQueryKey] });
    router.invalidate();
    await apiClient.post('/logout');
  },

  async getCurrentUser(config?: AxiosRequestConfig): Promise<User> {
  //   const response = await apiClient.post<User>('users/me', config);

  //   return response.data;
  // },
    return { id: 1, email: 'dev@example.com' } as unknown as User;
  },
};

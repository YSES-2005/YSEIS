export interface User {
  email: string;
  password?: string;
  role: 'admin' | 'user';
  avatar?: string;
  urgent_borrow_uses?: number;
}

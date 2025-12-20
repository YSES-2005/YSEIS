import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['admin', 'user']).optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional(),
  urgent_borrow_uses: z
    .number()
    .int()
    .min(0, 'Urgent borrow uses must be 0 or more')
    .optional(),
});

export type User = z.infer<typeof userSchema>;

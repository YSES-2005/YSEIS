import { z } from 'zod';

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const userSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['admin', 'user']).optional(),
  avatar: z.url('Avatar must be a valid URL').optional(),
  urgent_borrow_uses: z
    .number()
    .int()
    .nonnegative('Urgent borrow uses must be 0 or more')
    .optional(),
});

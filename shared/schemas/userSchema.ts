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
  preferences: z
    .object({
      emailAlerts: z.boolean().default(true),
      dueDateReminders: z.boolean().default(true),
    })
    .optional(),
});

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const userListSchema = z.object({
  _id: objectIdSchema,
  name: z.string().min(1, 'Name is required'),
});

export type UserListItem = z.infer<typeof userListSchema>;

export type User = z.infer<typeof userSchema>;

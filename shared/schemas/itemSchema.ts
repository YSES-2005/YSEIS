import { z } from 'zod';

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const itemSchema = z.object({
  id: objectIdSchema.optional(),
  avatar: z.url('Avatar must be a valid URL'),
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  quantity: z.number().int().nonnegative('Quantity must be 0 or more'),
  custodian: objectIdSchema,
  location: z.string().min(1, 'Location is required'),
  status: z.enum(['available', 'unavailable', 'deleted']),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
});

export type Item = z.infer<typeof itemSchema>;

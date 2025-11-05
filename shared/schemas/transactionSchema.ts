import { z } from 'zod';

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

const TransactionSchema = z.object({
  id: objectIdSchema.optional(),
  item: objectIdSchema,
  borrower: objectIdSchema,
  purpose: z.string().min(1, 'Purpose is required.'),
  urgency: z.boolean(),
  'return date': z.date(),
  approval_status: z.enum(['approved', 'disapproved', 'pending']),
  updated_at: z.date().optional(),
  created_at: z.date().optional(),
});

type Transaction = z.infer<typeof TransactionSchema>;

export { TransactionSchema, Transaction };

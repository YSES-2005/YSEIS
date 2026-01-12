import { z } from 'zod';

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

const dateFromString = z.preprocess(val => {
  if (val instanceof Date) return val;
  if (typeof val === 'string' || typeof val === 'number') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? val : d;
  }
  return val;
}, z.date());

// Schema for creating a new transaction
export const transactionCreateSchema = z.object({
  item: objectIdSchema,
  borrower: objectIdSchema.optional(),
  purpose: z.string().min(1, 'Purpose is required'),
  urgency: z.boolean(),
  returnDate: dateFromString,
  approvalStatus: z.enum(['approved', 'disapproved', 'pending']).optional(),
});

// Schema for updating a transaction
export const transactionUpdateSchema = z
  .object({
    approvalStatus: z.enum(['approved', 'disapproved', 'pending']).optional(),
    returnDate: dateFromString.optional(),
    purpose: z.string().min(1).optional(),
    urgency: z.boolean().optional(),
    returned: z.boolean().optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const transactionSchema = z.object({
  id: objectIdSchema.optional(),
  item: objectIdSchema,
  borrower: objectIdSchema,
  purpose: z.string().min(1, 'Purpose is required'),
  urgency: z.boolean(),
  returnDate: dateFromString,
  approvalStatus: z.enum(['approved', 'disapproved', 'pending']),
  returned: z.boolean().optional(),
  returnedAt: dateFromString.optional(),
  updated_at: z.date().optional(),
  created_at: z.date().optional(),
});

export type Transaction = z.infer<typeof transactionSchema>;
export type TransactionCreate = z.infer<typeof transactionCreateSchema>;
export type TransactionUpdate = z.infer<typeof transactionUpdateSchema>;

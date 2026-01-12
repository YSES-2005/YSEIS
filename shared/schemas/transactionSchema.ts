import { z } from 'zod';
import { Item } from './itemSchema';

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

const approvalStatusEnum = z.enum([
  'approved',
  'disapproved',
  'pending',
  'released',
  'completed',
]);

// Schema for creating a new transaction
export const transactionCreateSchema = z.object({
  item: objectIdSchema,
  borrower: objectIdSchema.optional(),
  quantity: z.coerce.number().min(1),
  purpose: z.string().min(1, 'Purpose is required'),
  urgency: z.boolean(),
  returnDate: dateFromString,
  approvalStatus: approvalStatusEnum.optional(),
});

// Schema for updating a transaction
export const transactionUpdateSchema = z
  .object({
    approvalStatus: approvalStatusEnum.optional(),
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
  quantity: z.number().min(1),
  purpose: z.string().min(1, 'Purpose is required'),
  urgency: z.boolean(),
  returnDate: dateFromString,
  approvalStatus: approvalStatusEnum,
  updated_at: z.date().optional(),
  created_at: z.date().optional(),
});

export type Transaction = z.infer<typeof transactionSchema>;
export type TransactionCreate = z.infer<typeof transactionCreateSchema>;
export type TransactionUpdate = z.infer<typeof transactionUpdateSchema>;
export type TransactionPopulated = Omit<Transaction, 'item'> & {
  item: Item;
};

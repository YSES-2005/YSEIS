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

const futureDateSchema = dateFromString.refine(date => date > new Date(), {
  message: 'Return date must be in the future',
});

export const approvalStatusEnum = z.enum([
  'approved',
  'disapproved',
  'pending',
  'released',
  'completed',
  'cancelled',
]);

export const transactionSchema = z.object({
  id: objectIdSchema.optional(),
  item: objectIdSchema,
  borrower: objectIdSchema,
  quantity: z.number().int().min(1), // ensure integer
  purpose: z.string().min(1, 'Purpose is required'),
  urgency: z.boolean().default(false),
  returnDate: dateFromString,
  approvalStatus: approvalStatusEnum.default('pending'),

  returned: z.boolean().default(false),
  returnedAt: z.date().nullable().optional(),
  // group items
  batchId: z.string().optional(),

  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
});

// for updating transactions
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

//  common fields for both modes
const baseRequestFields = z.object({
  purpose: z.string().min(1, 'Purpose is required'),
  urgency: z.boolean().default(false),
  returnDate: futureDateSchema,
  borrower: objectIdSchema.optional(),
});

export const transactionCreateSchema = z.object({
  item: objectIdSchema,
  borrower: objectIdSchema.optional(),
  quantity: z.number().int().min(1).optional().default(1),
  purpose: z.string().min(1, 'Purpose is required'),
  urgency: z.boolean(),
  returnDate: dateFromString,
  approvalStatus: z
    .enum(['approved', 'disapproved', 'pending'])
    .optional()
    .default('pending'),
});

export type Transaction = z.infer<typeof transactionSchema>;
export type TransactionCreate = z.infer<typeof transactionCreateSchema>;
export type TransactionUpdate = z.infer<typeof transactionUpdateSchema>;
export type ApprovalStatus = z.infer<typeof approvalStatusEnum>;

export type TransactionPopulated = Omit<Transaction, 'item' | 'borrower'> & {
  item: Item;
  borrower: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
};

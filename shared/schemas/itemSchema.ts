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

export const updateItemSchema = itemSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
  })
  .partial();

export type Item = z.infer<typeof itemSchema>;

export type ItemPopulated = Omit<Item, 'custodian'> & {
  custodian: { name?: string; email?: string; avatar?: string };
};

const baseBorrowSchema = z.object({
  returnDate: z
    .date()
    .optional()
    .refine(date => !!date, { message: 'Return date is required' })
    .refine(date => {
      if (!date) return true;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, 'Return date cannot be in the past')
    .refine(date => {
      if (!date) return true;

      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1);
      return date <= maxDate;
    }, 'Return date cannot be more than 1 year from today'),
  purpose: z
    .string()
    .min(1, 'Purpose is required')
    .min(5, 'Purpose must be at least 5 characters')
    .max(500, 'Purpose must not exceed 500 characters'),
  urgent: z.boolean().default(false),
});

export const borrowFormSchema = baseBorrowSchema.extend({
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1'),
});

const clientItemSchema = itemSchema.extend({
  custodian: z.union([
    z.string(),
    z.object({
      name: z.string().optional(),
      email: z.email().optional(),
    }),
  ]),
});

export const multiBorrowFormSchema = baseBorrowSchema
  .extend({
    items: z
      .array(
        z.object({
          item: clientItemSchema,
          quantity: z
            .number()
            .int('Quantity must be a whole number')
            .min(1, 'All quantities must be at least 1'),
        })
      )
      .min(1, 'At least one item is required'),
  })
  .superRefine((data, ctx) => {
    for (let i = 0; i < data.items.length; i++) {
      const entry = data.items[i];
      if (entry.quantity > entry.item.quantity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Cannot borrow more than ${entry.item.quantity} of ${entry.item.name}`,
          path: ['items', i, 'quantity'],
        });
      }
    }
  });

export type BorrowFormData = z.infer<typeof borrowFormSchema>;
export type MultiBorrowFormState = z.infer<typeof multiBorrowFormSchema>;

export const LOW_STOCK_THRESHOLD = 5;

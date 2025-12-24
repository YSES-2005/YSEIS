import { z } from 'zod';
import { itemSchema } from '@schemas/itemSchema';
import type { ItemPopulated as Item } from '@schemas/itemSchema';

const baseBorrowSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters'),
  returnDate: z
    .string()
    .min(1, 'Return date is required')
    .refine(
      (date) => {
        const d = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d >= today;
      },
      'Return date cannot be in the past'
    )
    .refine(
      (date) => {
        const d = new Date(date);
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 1);
        return d <= maxDate;
      },
      'Return date cannot be more than 1 year from today'
    ),
  purpose: z
    .string()
    .min(1, 'Purpose is required')
    .min(5, 'Purpose must be at least 5 characters')
    .max(500, 'Purpose must not exceed 500 characters'),
  urgent: z.boolean().default(false),
});

export const borrowFormSchema = baseBorrowSchema.extend({
  quantity: z.number().int('Quantity must be a whole number').min(1, 'Quantity must be at least 1'),
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
          quantity: z.number().int('Quantity must be a whole number').min(1, 'All quantities must be at least 1'),
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

export type BorrowValidationErrors = Partial<Record<keyof BorrowFormData, string>>;
export type MultiBorrowValidationErrors = Partial<Record<keyof MultiBorrowFormState, string>>;

const extractErrors = <T extends Record<string, unknown>>(fieldErrors: Record<string, string[] | undefined>): Partial<T> => {
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([key, val]) => [key, val?.[0]])
  ) as Partial<T>;
};

export const extractAllErrors = <T extends Record<string, unknown>>(fieldErrors: Record<string, string[] | undefined>): Partial<Record<keyof T, string>> => {
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([key, val]) => [key, val?.join('; ') || undefined])
  ) as Partial<Record<keyof T, string>>;
};

export const validateBorrowForm = (form: BorrowFormData, item: Item | null): BorrowValidationErrors => {
  const result = borrowFormSchema
    .refine((data) => data.quantity <= (item?.quantity || 0), {
      message: `Cannot borrow more than ${item?.quantity || 0} available`,
      path: ['quantity'],
    })
    .safeParse(form);

  if (result.success) return {};

  return extractErrors(result.error.flatten().fieldErrors);
};

export const validateMultiBorrowForm = (form: MultiBorrowFormState): MultiBorrowValidationErrors => {
  const result = multiBorrowFormSchema.safeParse(form);

  if (result.success) return {};

  return extractErrors(result.error.flatten().fieldErrors);
};

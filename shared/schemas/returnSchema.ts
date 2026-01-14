import { z } from 'zod';

export const returnCreateSchema = z.object({
    body: z.object({
        transaction: z.string().min(1, 'Transaction ID is required'),
        description: z.string().min(1, 'Description is required'),
        status: z.enum(['pending', 'completed', 'damaged']).default('pending'),
        condition: z.array(z.string()).optional(),
    }),
});

export const returnUpdateSchema = z.object({
    body: z.object({
        description: z.string().optional(),
        status: z.enum(['pending', 'completed', 'damaged']).optional(),
        condition: z.array(z.string()).optional(),
    }),
});

export type ReturnCreateInput = z.infer<typeof returnCreateSchema>['body'];
export type ReturnUpdateInput = z.infer<typeof returnUpdateSchema>['body'];

import { z } from 'zod';

export const returnCreateSchema = z.object({
    transaction: z.string().min(1, 'Transaction ID is required'),
    description: z.string().min(1, 'Description is required'),
    condition: z.array(z.string()).optional(),
    status: z.enum(['pending', 'completed', 'damaged']).optional(),
});

export const returnUpdateSchema = z.object({
    description: z.string().optional(),
    status: z.enum(['pending', 'completed', 'damaged']).optional(),
    condition: z.array(z.string()).optional(),
});

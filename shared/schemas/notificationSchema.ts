import { z } from 'zod';

export const notificationSchema = z.object({
  id: z.string(),
  recipient: z.string(), // The User ID
  type: z.enum(['INFO', 'WARNING', 'SUCCESS', 'ERROR']), // notification type
  title: z.string().min(1),
  message: z.string().min(1),
  isRead: z.boolean(),

  relatedEntityId: z.string().optional().nullable(), // e.g., Item ID or Transaction ID
  relatedModel: z.enum(['Item', 'Transaction']).optional().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().optional(),
});

export const createNotificationSchema = notificationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isRead: true,
});

export type Notification = z.infer<typeof notificationSchema>;

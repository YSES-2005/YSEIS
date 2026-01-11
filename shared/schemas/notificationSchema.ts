import { z } from 'zod';

export const NotificationSchema = z.object({
  _id: z.string(),
  recipient: z.string(), // The User ID
  type: z.enum(['INFO', 'WARNING', 'SUCCESS', 'ERROR']),
  title: z.string().min(1),
  message: z.string().min(1),
  isRead: z.boolean(),
  
  relatedEntityId: z.string().optional().nullable(), // e.g., Item ID or Transaction ID
  relatedModel: z.enum(['Item', 'Transaction']).optional().nullable(),
  createdAt: z.union([z.string(), z.date()]), 
  updatedAt: z.union([z.string(), z.date()]).optional(),
});

export type Notification = z.infer<typeof NotificationSchema>;

export const CreateNotificationSchema = NotificationSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  isRead: true 
});
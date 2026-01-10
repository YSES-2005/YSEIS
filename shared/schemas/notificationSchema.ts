import { z } from 'zod';

// Define the shape of a Notification
export const NotificationSchema = z.object({
  _id: z.string(),
  recipient: z.string(), // The User ID
  type: z.enum(['INFO', 'WARNING', 'SUCCESS', 'ERROR']),
  title: z.string().min(1),
  message: z.string().min(1),
  isRead: z.boolean(),
  
  // Optional: Links to other parts of the app
  relatedEntityId: z.string().optional().nullable(), // e.g., Item ID or Transaction ID
  relatedModel: z.enum(['Item', 'Transaction']).optional().nullable(),
  
  createdAt: z.union([z.string(), z.date()]), // Frontend might receive string, Backend uses Date
  updatedAt: z.union([z.string(), z.date()]).optional(),
});

// Export the Type to be used in frontend components and backend services
export type Notification = z.infer<typeof NotificationSchema>;

// Input schema for creating a notification (excluding auto-generated fields)
export const CreateNotificationSchema = NotificationSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  isRead: true // defaults to false
});
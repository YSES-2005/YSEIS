import mongoose, { Schema, Document } from 'mongoose';
import type { Notification } from '@schemas/notificationSchema';

export interface INotification extends Omit<Notification, '_id' | 'recipient'>, Document {
  recipient: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema(
  {
    recipient: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true 
    },
    type: { 
      type: String, 
      enum: ['INFO', 'WARNING', 'SUCCESS', 'ERROR'], 
      default: 'INFO' 
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    
    relatedEntityId: { type: Schema.Types.ObjectId },
    relatedModel: { type: String, enum: ['Item', 'Transaction'] }
  },
  { 
    timestamps: true 
  }
);

export const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema);
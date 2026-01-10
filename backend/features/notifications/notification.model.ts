import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId; // User ID
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  title: string;
  message: string;
  isRead: boolean;
  relatedEntityId?: mongoose.Types.ObjectId; // Transaction or Item ID
  relatedModel?: 'Item' | 'Transaction';
  createdAt: Date;
}

const NotificationSchema = new Schema(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['INFO', 'WARNING', 'SUCCESS', 'ERROR'],
      default: 'INFO',
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    relatedEntityId: { type: Schema.Types.ObjectId },
    relatedModel: { type: String, enum: ['Item', 'Transaction'] },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>(
  'Notification',
  NotificationSchema
);
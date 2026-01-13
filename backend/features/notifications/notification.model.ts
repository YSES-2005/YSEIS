import mongoose from 'mongoose';

const NotificationsSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['INFO', 'WARNING', 'SUCCESS', 'ERROR'],
      default: 'INFO',
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },

    relatedEntityId: { type: mongoose.Schema.Types.ObjectId },
    relatedModel: { type: String, enum: ['Item', 'Transaction'] },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

NotificationsSchema.virtual('id').get(function (this: any) {
  return this._id?.toString();
});
NotificationsSchema.set('toObject', { virtuals: true });

export default mongoose.model('Notification', NotificationsSchema);

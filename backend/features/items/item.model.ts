import mongoose from 'mongoose';

const ItemsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    avatar: { type: String },
    quantity: { type: Number, required: true, min: 0 },
    location: { type: String, required: true },
    custodian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'unavailable', 'deleted'],
      default: 'available',
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

ItemsSchema.virtual('id').get(function (this: any) {
  return this._id?.toString();
});
ItemsSchema.set('toObject', { virtuals: true });

export default mongoose.model('Item', ItemsSchema);

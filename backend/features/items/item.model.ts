import mongoose from 'mongoose';

const ItemsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    avatar: { type: String },
    quantity: { type: Number, required: true },
    location: { type: String, required: true },
    custodian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
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

export default mongoose.model('items', ItemsSchema);

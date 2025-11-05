import mongoose from 'mongoose';

const TransactionsSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'items',
      required: true,
    },
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    purpose: { type: String, required: true },
    urgency: { type: Boolean, required: true },
    return_date: { type: Date, required: true },
    approval_staus: {
      type: String,
      enum: ['approved', 'disapproved', 'pending'],
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

export default mongoose.model('transactions', TransactionsSchema);

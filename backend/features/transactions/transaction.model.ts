import mongoose from 'mongoose';

const TransactionsSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    purpose: { type: String, required: true },
    urgency: { type: Boolean, required: true },
    returnDate: { type: Date, required: true },
    approvalStatus: {
      type: String,
      enum: ['approved', 'disapproved', 'pending'],
      default: 'pending',
      required: true,
    },
    returned: { type: Boolean, default: false },
    returnedAt: { type: Date },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export default mongoose.model('Transaction', TransactionsSchema);

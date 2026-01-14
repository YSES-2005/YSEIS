import mongoose from 'mongoose';

const ReturnSchema = new mongoose.Schema(
    {
        transaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
            required: true,
        },
        description: { type: String, required: true },
        status: {
            type: String,
            enum: ['pending', 'completed', 'damaged'],
            default: 'pending',
        },
        condition: [{ type: String }],
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    }
);

ReturnSchema.virtual('id').get(function (this: any) {
    return this._id?.toString();
});
ReturnSchema.set('toObject', { virtuals: true });

export default mongoose.model('Return', ReturnSchema);

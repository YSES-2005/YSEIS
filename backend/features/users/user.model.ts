import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  avatar?: string;
  urgent_borrow_uses: number;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'user'],
      default: 'user',
    },
    avatar: { type: String },
    urgent_borrow_uses: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export const UserModel = model<UserDocument>('User', userSchema);

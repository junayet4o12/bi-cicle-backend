// models/Subscribe.model.ts
import { Schema, model } from 'mongoose';
import { ISubscribe } from './subscribe.interface';

const subscribeSchema = new Schema<ISubscribe>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Subscribe = model<ISubscribe>('Subscribe', subscribeSchema);

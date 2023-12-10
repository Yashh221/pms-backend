import mongoose, { Document, Schema } from "mongoose";

interface Otp extends Document {
  email: string;
  otpCode: string;
  expiresIn: Date;
}

const otpSchema = new Schema<Otp>(
  {
    email: {
      type: String,
      required: true,
    },
    otpCode: {
      type: String,
      required: true,
    },
    expiresIn: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Otp = mongoose.model<Otp>("Otp", otpSchema);

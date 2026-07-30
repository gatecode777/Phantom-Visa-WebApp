import mongoose, { Schema, Document } from "mongoose";

export interface IRefreshToken extends Document {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  revoked: boolean;
  createdAt: Date;
}

const RefreshTokenSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    revoked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.RefreshToken || mongoose.model<IRefreshToken>("RefreshToken", RefreshTokenSchema);

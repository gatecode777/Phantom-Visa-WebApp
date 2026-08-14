import mongoose, { Schema, Document } from "mongoose";

export interface IRefreshToken extends Document {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  revoked: boolean;
  createdAt: Date;
  // Session metadata — stamped at login
  deviceName: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastSeenAt: Date;
}

const RefreshTokenSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    revoked: { type: Boolean, default: false },
    // Device & session metadata
    deviceName: { type: String, default: "Unknown Device" },
    browser: { type: String, default: "Unknown Browser" },
    ipAddress: { type: String, default: "" },
    location: { type: String, default: "" },
    lastSeenAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.RefreshToken || mongoose.model<IRefreshToken>("RefreshToken", RefreshTokenSchema);


import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
  logId: string;
  userId?: mongoose.Types.ObjectId;
  applicantId?: string;
  userName: string;
  userEmail: string;
  activity: string;
  activityType: "Authentication" | "Application" | "KYC" | "Payment" | "Security" | "System";
  ipAddress: string;
  device: string;
  status: "Success" | "Failed";
  details?: string;
  createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema(
  {
    logId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    applicantId: { type: String },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    activity: { type: String, required: true },
    activityType: {
      type: String,
      enum: ["Authentication", "Application", "KYC", "Payment", "Security", "System"],
      default: "Authentication"
    },
    ipAddress: { type: String, default: "127.0.0.1" },
    device: { type: String, default: "Chrome / Windows" },
    status: { type: String, enum: ["Success", "Failed"], default: "Success" },
    details: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);

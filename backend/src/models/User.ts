import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  phone: string;
  email?: string;
  passwordHash?: string;
  role: "Admin" | "Applicant" | "Staff" | "Agent";
  name: string;
  isDeactivated?: boolean;
  blockReason?: string;
  blockType?: "Temporary" | "Permanent" | "Security Lockdown";
  blockedBy?: string;
  blockedOn?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    phone: { type: String, required: true, unique: true, index: true },
    email: { type: String, lowercase: true, trim: true, sparse: true },
    passwordHash: { type: String },
    role: { type: String, enum: ["Admin", "Applicant", "Staff", "Agent"], required: true, default: "Applicant" },
    name: { type: String, required: true },
    isDeactivated: { type: Boolean, default: false },
    blockReason: { type: String, default: "" },
    blockType: { type: String, default: "Temporary" },
    blockedBy: { type: String, default: "Admin" },
    blockedOn: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

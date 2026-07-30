import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  phone: string;
  role: "Admin" | "Applicant" | "Staff" | "Agent";
  name: string;
  isDeactivated?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    phone: { type: String, required: true, unique: true, index: true },
    role: { type: String, enum: ["Admin", "Applicant", "Staff", "Agent"], required: true },
    name: { type: String, required: true },
    isDeactivated: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

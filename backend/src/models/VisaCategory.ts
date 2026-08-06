import mongoose, { Schema, Document } from "mongoose";

export interface IVisaCategory extends Document {
  name: string;
  code: string;
  description?: string;
  icon?: string;
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}

const VisaCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "Globe" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);

export default mongoose.models.VisaCategory || mongoose.model<IVisaCategory>("VisaCategory", VisaCategorySchema);

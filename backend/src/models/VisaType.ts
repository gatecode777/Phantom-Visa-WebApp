import mongoose, { Schema, Document } from "mongoose";

export interface IVisaType extends Document {
  name: string;
  code: string;
  categoryId: mongoose.Types.ObjectId;
  categoryName: string;
  entryType: "Single Entry" | "Multiple Entry" | "Double Entry";
  validityMonths: number;
  maxStayDays: number;
  processingTimeDays: number;
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}

const VisaTypeSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "VisaCategory", required: true },
    categoryName: { type: String, required: true },
    entryType: { type: String, enum: ["Single Entry", "Multiple Entry", "Double Entry"], default: "Multiple Entry" },
    validityMonths: { type: Number, default: 6 },
    maxStayDays: { type: Number, default: 90 },
    processingTimeDays: { type: Number, default: 7 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);

export default mongoose.models.VisaType || mongoose.model<IVisaType>("VisaType", VisaTypeSchema);

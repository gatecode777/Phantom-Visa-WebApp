import mongoose, { Schema, Document } from "mongoose";

export interface IVisaRequirement extends Document {
  title: string;
  code: string;
  visaTypeId: mongoose.Types.ObjectId;
  visaTypeName: string;
  documentType: "PDF Document" | "Image Scan" | "Notarized Letter" | "Bank Statement";
  isMandatory: boolean;
  description?: string;
  sampleFileUrl?: string;
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}

const VisaRequirementSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    visaTypeId: { type: Schema.Types.ObjectId, ref: "VisaType", required: true },
    visaTypeName: { type: String, required: true },
    documentType: {
      type: String,
      enum: ["PDF Document", "Image Scan", "Notarized Letter", "Bank Statement"],
      default: "PDF Document"
    },
    isMandatory: { type: Boolean, default: true },
    description: { type: String, default: "" },
    sampleFileUrl: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);

export default mongoose.models.VisaRequirement || mongoose.model<IVisaRequirement>("VisaRequirement", VisaRequirementSchema);

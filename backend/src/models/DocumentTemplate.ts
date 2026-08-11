import mongoose, { Schema, Document } from "mongoose";

export interface IDocumentTemplate extends Document {
  templateId: string;
  title: string;
  category:
    | "Cover Letter"
    | "Sponsorship Letter"
    | "NOC / Leave Letter"
    | "Financial Affidavit"
    | "Self Declaration"
    | "Invitation Letter"
    | "Other";
  country: string;
  fileFormat: "DOCX" | "PDF" | "TXT";
  fileSize: string;
  downloadsCount: number;
  status: "Active" | "Draft" | "Deprecated";
  description: string;
  templateBody: string;
  placeholderFields: string[];
  createdAt: Date;
  updatedAt: Date;
}

const DocumentTemplateSchema: Schema = new Schema(
  {
    templateId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        "Cover Letter",
        "Sponsorship Letter",
        "NOC / Leave Letter",
        "Financial Affidavit",
        "Self Declaration",
        "Invitation Letter",
        "Other"
      ],
      required: true,
      default: "Cover Letter"
    },
    country: { type: String, default: "Global / All" },
    fileFormat: { type: String, enum: ["DOCX", "PDF", "TXT"], default: "DOCX" },
    fileSize: { type: String, default: "120 KB" },
    downloadsCount: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Draft", "Deprecated"], default: "Active" },
    description: { type: String, default: "" },
    templateBody: { type: String, required: true },
    placeholderFields: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.models.DocumentTemplate ||
  mongoose.model<IDocumentTemplate>("DocumentTemplate", DocumentTemplateSchema);

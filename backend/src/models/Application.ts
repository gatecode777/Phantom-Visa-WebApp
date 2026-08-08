import mongoose, { Schema, Document } from "mongoose";

export interface IApplicationDocument {
  requirementId?: string;
  title: string;
  documentType: string;
  isMandatory: boolean;
  fileUrl: string;
  status: "uploaded" | "verified" | "needs_review" | "pending";
}

export interface ICoTraveler {
  id?: string;
  name: string;
  relation: string;
  passportNo: string;
  age: number;
}

export interface IApplication extends Document {
  applicationId: string;
  userId?: mongoose.Types.ObjectId;
  countryId?: mongoose.Types.ObjectId;
  countryName: string;
  countryCode: string;
  categoryId?: mongoose.Types.ObjectId;
  categoryName: string;
  visaTypeId?: mongoose.Types.ObjectId;
  visaTypeName: string;
  processingSpeed: "standard" | "express" | "vip";
  entryType: string;
  stayValidity: string;
  personalDetails: {
    givenName: string;
    surname: string;
    dob: string;
    gender: string;
    nationality: string;
    maritalStatus: string;
    phone: string;
    email: string;
  };
  travelDetails: {
    travelDate: string;
    returnDate: string;
    stayType: string;
    hostName: string;
    hostAddress: string;
  };
  passportDetails: {
    passportType: string;
    passportNo: string;
    issuePlace: string;
    issueDate?: string;
    expiryDate: string;
  };
  employmentDetails: {
    employmentStatus: string;
    employerName: string;
    jobTitle: string;
    bankBalance: string;
  };
  uploadedDocuments: IApplicationDocument[];
  coTravelers: ICoTraveler[];
  pricing: {
    consularFee: number;
    platformFee: number;
    expressSurcharge: number;
    promoDiscount: number;
    promoCode?: string;
    totalAmount: number;
  };
  status: "Draft" | "Submitted" | "Docs Pending" | "Embassy Processing" | "Approved" | "Rejected" | "Cancelled";
  workflowStage: number; // 1 = Applicant Fills & Submits, 2 = Agent AI & OCR, 3 = Embassy Consular Submission, 4 = Visa Decision Granted
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema: Schema = new Schema(
  {
    applicationId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    countryId: { type: Schema.Types.ObjectId, ref: "Country" },
    countryName: { type: String, required: true },
    countryCode: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "VisaCategory" },
    categoryName: { type: String, required: true },
    visaTypeId: { type: Schema.Types.ObjectId, ref: "VisaType" },
    visaTypeName: { type: String, required: true },
    processingSpeed: { type: String, enum: ["standard", "express", "vip"], default: "express" },
    entryType: { type: String, default: "Single Entry" },
    stayValidity: { type: String, default: "60 Days" },
    personalDetails: {
      givenName: { type: String, required: true },
      surname: { type: String, required: true },
      dob: { type: String, required: true },
      gender: { type: String, default: "Female" },
      nationality: { type: String, required: true, default: "Indian" },
      maritalStatus: { type: String, default: "Single" },
      phone: { type: String, required: true },
      email: { type: String, required: true }
    },
    travelDetails: {
      travelDate: { type: String, required: true },
      returnDate: { type: String, required: true },
      stayType: { type: String, default: "Hotel Booking" },
      hostName: { type: String, default: "" },
      hostAddress: { type: String, default: "" }
    },
    passportDetails: {
      passportType: { type: String, default: "Ordinary / Regular" },
      passportNo: { type: String, required: true },
      issuePlace: { type: String, default: "New Delhi" },
      issueDate: { type: String },
      expiryDate: { type: String, required: true }
    },
    employmentDetails: {
      employmentStatus: { type: String, default: "Employed" },
      employerName: { type: String, default: "" },
      jobTitle: { type: String, default: "" },
      bankBalance: { type: String, default: "₹4,50,000" }
    },
    uploadedDocuments: [
      {
        requirementId: { type: String },
        title: { type: String, required: true },
        documentType: { type: String, default: "PDF Document" },
        isMandatory: { type: Boolean, default: true },
        fileUrl: { type: String, default: "" },
        status: { type: String, enum: ["uploaded", "verified", "needs_review", "pending"], default: "uploaded" }
      }
    ],
    coTravelers: [
      {
        id: { type: String },
        name: { type: String, required: true },
        relation: { type: String, default: "Spouse" },
        passportNo: { type: String, default: "" },
        age: { type: Number, default: 30 }
      }
    ],
    pricing: {
      consularFee: { type: Number, required: true },
      platformFee: { type: Number, default: 2500 },
      expressSurcharge: { type: Number, default: 0 },
      promoDiscount: { type: Number, default: 0 },
      promoCode: { type: String, default: "" },
      totalAmount: { type: Number, required: true }
    },
    status: {
      type: String,
      enum: ["Draft", "Submitted", "Docs Pending", "Embassy Processing", "Approved", "Rejected", "Cancelled"],
      default: "Submitted"
    },
    workflowStage: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema);

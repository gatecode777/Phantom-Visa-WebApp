import mongoose, { Schema, Document } from "mongoose";

export interface IApplicant extends Document {
  applicantId: string;
  userId: mongoose.Types.ObjectId;
  personalInfo: {
    fullName: string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    nationality: string;
    phone: string;
    email: string;
    country: string;
    addressLine1?: string;
    addressLine2?: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  kycDetails?: {
    kycStatus: "Pending" | "Under Audit" | "Approved" | "Rejected";
    govtIdType?: string;
    aadhaarNumber?: string;
    panCardNumber?: string;
    ssnOrNationalId?: string;
    idDocScan?: string;
    addressProofScan?: string;
    submittedAt?: Date;
    verifiedAt?: Date;
    rejectionReason?: string;
  };
  status: "Submitted" | "Active" | "Docs Uploaded" | "Docs Verified" | "Embassy Processing" | "Approved" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

const ApplicantSchema: Schema = new Schema(
  {
    applicantId: { type: String, required: true, default: () => `APP-${Math.floor(1000 + Math.random() * 9000)}`, index: true },
    userId: { type: Schema.Types.Mixed, required: false, index: true },
    personalInfo: {
      fullName: { type: String, default: "Applicant" },
      firstName: { type: String, default: "Applicant" },
      lastName: { type: String, default: "User" },
      dob: { type: String, default: "1995-01-01" },
      gender: { type: String, default: "Male" },
      nationality: { type: String, default: "Indian" },
      phone: { type: String, default: "+91 9876543210" },
      email: { type: String, default: "applicant@example.com" },
      country: { type: String, default: "India" },
      addressLine1: { type: String },
      addressLine2: { type: String },
      address: { type: String, default: "New Delhi, India" },
      city: { type: String, default: "New Delhi" },
      state: { type: String, default: "Delhi" },
      postalCode: { type: String, default: "110001" }
    },
    kycDetails: {
      kycStatus: { type: String, enum: ["Pending", "Under Audit", "Approved", "Rejected"], default: "Pending" },
      govtIdType: { type: String },
      aadhaarNumber: { type: String },
      panCardNumber: { type: String },
      ssnOrNationalId: { type: String },
      idDocScan: { type: String },
      addressProofScan: { type: String },
      submittedAt: { type: Date },
      verifiedAt: { type: Date },
      rejectionReason: { type: String }
    },
    status: {
      type: String,
      default: "Submitted"
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

export default mongoose.models.Applicant || mongoose.model<IApplicant>("Applicant", ApplicantSchema);

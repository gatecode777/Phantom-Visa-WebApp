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
    applicantId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    personalInfo: {
      fullName: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      dob: { type: String, required: true },
      gender: { type: String, default: "Male" },
      nationality: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      country: { type: String, required: true, default: "India" },
      addressLine1: { type: String },
      addressLine2: { type: String },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true }
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
      enum: ["Submitted", "Active", "Docs Uploaded", "Docs Verified", "Embassy Processing", "Approved", "Rejected"],
      default: "Submitted"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Applicant || mongoose.model<IApplicant>("Applicant", ApplicantSchema);

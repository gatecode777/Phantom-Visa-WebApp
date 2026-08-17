import mongoose, { Schema, Document } from "mongoose";

export interface ICoTraveler {
  id: string;
  fullName: string;
  relation: "Spouse" | "Child" | "Parent" | "Sibling" | "Friend" | string;
  passportNumber: string;
  dob: string;
  kycStatus: "Verified" | "Pending" | string;
}

export interface IApplicantPreferences {
  twoFactorAuth: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  passportReminder: boolean;
}

export interface IApplicantPassportDetails {
  passportNumber: string;
  passportType: string;
  dateOfIssue: string;
  dateOfExpiry: string;
  placeOfIssue: string;
  scannedStatus: string;
}

export interface IApplicant extends Document {
  applicantId: string;
  userId: mongoose.Types.ObjectId | string;
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
    occupation?: string;
    employer?: string;
  };
  passportDetails?: IApplicantPassportDetails;
  coTravelers?: ICoTraveler[];
  preferences?: IApplicantPreferences;
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

const CoTravelerSchema: Schema = new Schema(
  {
    id: { type: String, required: true },
    fullName: { type: String, required: true },
    relation: { type: String, default: "Spouse" },
    passportNumber: { type: String, required: true },
    dob: { type: String, default: "" },
    kycStatus: { type: String, default: "Pending" }
  },
  { _id: false }
);

const PassportDetailsSchema: Schema = new Schema(
  {
    passportNumber: { type: String, default: "" },
    passportType: { type: String, default: "" },
    dateOfIssue: { type: String, default: "" },
    dateOfExpiry: { type: String, default: "" },
    placeOfIssue: { type: String, default: "" },
    scannedStatus: { type: String, default: "Pending Upload" }
  },
  { _id: false }
);

const PreferencesSchema: Schema = new Schema(
  {
    twoFactorAuth: { type: Boolean, default: false },
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    passportReminder: { type: Boolean, default: false }
  },
  { _id: false }
);

const ApplicantSchema: Schema = new Schema(
  {
    applicantId: {
      type: String,
      required: true,
      default: () => `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      index: true
    },
    userId: { type: Schema.Types.Mixed, required: false, index: true },
    personalInfo: {
      fullName: { type: String, default: "" },
      firstName: { type: String, default: "" },
      lastName: { type: String, default: "" },
      dob: { type: String, default: "" },
      gender: { type: String, default: "" },
      nationality: { type: String, default: "" },
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      country: { type: String, default: "" },
      addressLine1: { type: String, default: "" },
      addressLine2: { type: String, default: "" },
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      occupation: { type: String, default: "" },
      employer: { type: String, default: "" }
    },
    passportDetails: {
      type: PassportDetailsSchema,
      default: () => ({
        passportNumber: "",
        passportType: "",
        dateOfIssue: "",
        dateOfExpiry: "",
        placeOfIssue: "",
        scannedStatus: "Pending Upload"
      })
    },
    coTravelers: {
      type: [CoTravelerSchema],
      default: () => []
    },
    preferences: {
      type: PreferencesSchema,
      default: () => ({
        twoFactorAuth: false,
        emailNotifications: true,
        smsNotifications: false,
        passportReminder: false
      })
    },
    kycDetails: {
      kycStatus: { type: String, enum: ["Pending", "Under Audit", "Approved", "Rejected"], default: "Pending" },
      govtIdType: { type: String, default: "" },
      aadhaarNumber: { type: String, default: "" },
      panCardNumber: { type: String, default: "" },
      ssnOrNationalId: { type: String, default: "" },
      idDocScan: { type: String },
      addressProofScan: { type: String },
      submittedAt: { type: Date, default: Date.now },
      verifiedAt: { type: Date },
      rejectionReason: { type: String, default: "" }
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

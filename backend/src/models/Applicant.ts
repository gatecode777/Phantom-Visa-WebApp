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
    dob: { type: String, default: "2000-01-01" },
    kycStatus: { type: String, default: "Verified" }
  },
  { _id: false }
);

const PassportDetailsSchema: Schema = new Schema(
  {
    passportNumber: { type: String, default: "Z9817264" },
    passportType: { type: String, default: "Regular Ordinary (Type P)" },
    dateOfIssue: { type: String, default: "2023-12-21" },
    dateOfExpiry: { type: String, default: "2033-12-20" },
    placeOfIssue: { type: String, default: "New Delhi" },
    scannedStatus: { type: String, default: "Verified & OCR Scanned" }
  },
  { _id: false }
);

const PreferencesSchema: Schema = new Schema(
  {
    twoFactorAuth: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: true },
    passportReminder: { type: Boolean, default: true }
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
      fullName: { type: String, default: "Vibhu Sharma" },
      firstName: { type: String, default: "Vibhu" },
      lastName: { type: String, default: "Sharma" },
      dob: { type: String, default: "1995-06-12" },
      gender: { type: String, default: "Male" },
      nationality: { type: String, default: "Indian" },
      phone: { type: String, default: "+91 98765 43210" },
      email: { type: String, default: "vibhu@phantomvisa.com" },
      country: { type: String, default: "India" },
      addressLine1: { type: String, default: "B-402, Highstreet Towers" },
      addressLine2: { type: String, default: "MG Road" },
      address: { type: String, default: "B-402, Highstreet Towers, MG Road, New Delhi, Delhi - 110001" },
      city: { type: String, default: "New Delhi" },
      state: { type: String, default: "Delhi" },
      postalCode: { type: String, default: "110001" },
      occupation: { type: String, default: "Senior Software Consultant" },
      employer: { type: String, default: "TechCorp Solutions Pvt Ltd" }
    },
    passportDetails: {
      type: PassportDetailsSchema,
      default: () => ({
        passportNumber: "Z9817264",
        passportType: "Regular Ordinary (Type P)",
        dateOfIssue: "2023-12-21",
        dateOfExpiry: "2033-12-20",
        placeOfIssue: "New Delhi",
        scannedStatus: "Verified & OCR Scanned"
      })
    },
    coTravelers: {
      type: [CoTravelerSchema],
      default: () => [
        {
          id: "TRAVELER-1",
          fullName: "Ananya Sharma",
          relation: "Spouse",
          passportNumber: "Z9817265",
          dob: "1996-05-14",
          kycStatus: "Verified"
        },
        {
          id: "TRAVELER-2",
          fullName: "Aarav Sharma",
          relation: "Child",
          passportNumber: "X1029481",
          dob: "2020-08-02",
          kycStatus: "Verified"
        }
      ]
    },
    preferences: {
      type: PreferencesSchema,
      default: () => ({
        twoFactorAuth: true,
        emailNotifications: true,
        smsNotifications: true,
        passportReminder: true
      })
    },
    kycDetails: {
      kycStatus: { type: String, enum: ["Pending", "Under Audit", "Approved", "Rejected"], default: "Approved" },
      govtIdType: { type: String, default: "National Identification & Address Proof" },
      aadhaarNumber: { type: String, default: "5489 1234 9876" },
      panCardNumber: { type: String, default: "ABCDE1234F" },
      ssnOrNationalId: { type: String },
      idDocScan: { type: String },
      addressProofScan: { type: String },
      submittedAt: { type: Date, default: Date.now },
      verifiedAt: { type: Date, default: Date.now },
      rejectionReason: { type: String, default: "" }
    },
    status: {
      type: String,
      default: "Active"
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

export default mongoose.models.Applicant || mongoose.model<IApplicant>("Applicant", ApplicantSchema);

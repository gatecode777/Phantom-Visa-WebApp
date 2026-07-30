import mongoose, { Schema, Document } from "mongoose";

export interface ITimelineStep {
  status: string;
  label: string;
  date: string;
  description: string;
  completed: boolean;
}

export interface IAppointment {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}

export interface IMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  unread: boolean;
}

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
    emergencyPhone?: string;
    passportNo: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  passportDetails: {
    passportType: string;
    passportIssueDate: string;
    passportExpiryDate: string;
    passportPlaceOfIssue: string;
    passportIssuingCountry: string;
  };
  visaInfo: {
    destinationCountry: string;
    visaCategory: string;
    visaType: string;
    purposeOfVisit: string;
    entryType: string;
    durationOfStay: string;
    expectedTravelDate: string;
    preferredEmbassy: string;
  };
  kycDetails: {
    govtIdType: string;
    govtIdNumber?: string;
    aadhaarNumber?: string;
    panCardNumber?: string;
    kycStatus: string;
    faceBiometricVerified: boolean;
    addressProofVerified: boolean;
  };
  documents: {
    passportScan?: string;
    photo?: string;
    nationalId?: string;
    bankStatement?: string;
    addressProof?: string;
    employerLetter?: string;
    coverLetter?: string;
    supportingDocs?: string;
  };
  status: "Submitted" | "Docs Uploaded" | "Docs Verified" | "Embassy Processing" | "Approved" | "Rejected";
  fees: number;
  timeline: ITimelineStep[];
  appointments: IAppointment[];
  messages: IMessage[];
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
      emergencyPhone: { type: String },
      passportNo: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, default: "India" },
      postalCode: { type: String, required: true }
    },
    passportDetails: {
      passportType: { type: String, default: "Regular" },
      passportIssueDate: { type: String },
      passportExpiryDate: { type: String, required: true },
      passportPlaceOfIssue: { type: String },
      passportIssuingCountry: { type: String, default: "India" }
    },
    visaInfo: {
      destinationCountry: { type: String, required: true },
      visaCategory: { type: String, required: true },
      visaType: { type: String, required: true },
      purposeOfVisit: { type: String },
      entryType: { type: String, default: "Multiple Entry" },
      durationOfStay: { type: String, default: "90 Days" },
      expectedTravelDate: { type: String },
      preferredEmbassy: { type: String }
    },
    kycDetails: {
      govtIdType: { type: String },
      govtIdNumber: { type: String },
      aadhaarNumber: { type: String },
      panCardNumber: { type: String },
      kycStatus: { type: String, default: "Pending Audit" },
      faceBiometricVerified: { type: Boolean, default: false },
      addressProofVerified: { type: Boolean, default: false }
    },
    documents: {
      passportScan: { type: String },
      photo: { type: String },
      nationalId: { type: String },
      bankStatement: { type: String },
      addressProof: { type: String },
      employerLetter: { type: String },
      coverLetter: { type: String },
      supportingDocs: { type: String }
    },
    status: {
      type: String,
      enum: ["Submitted", "Docs Uploaded", "Docs Verified", "Embassy Processing", "Approved", "Rejected"],
      default: "Submitted"
    },
    fees: { type: Number, default: 18500 },
    timeline: [
      {
        status: { type: String },
        label: { type: String },
        date: { type: String },
        description: { type: String },
        completed: { type: Boolean, default: false }
      }
    ],
    appointments: [
      {
        id: { type: String },
        title: { type: String },
        date: { type: String },
        time: { type: String },
        location: { type: String },
        status: { type: String, enum: ["Scheduled", "Completed", "Cancelled"], default: "Scheduled" }
      }
    ],
    messages: [
      {
        id: { type: String },
        sender: { type: String },
        text: { type: String },
        timestamp: { type: String },
        unread: { type: Boolean, default: true }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.Applicant || mongoose.model<IApplicant>("Applicant", ApplicantSchema);

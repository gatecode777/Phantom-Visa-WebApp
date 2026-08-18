import mongoose, { Schema, Document } from "mongoose";

export interface ICompanyProfile extends Document {
  companyName: string;
  tradeName?: string;
  businessType?: string;
  regDate?: string;
  tagline?: string;
  description?: string;
  streetAddress?: string;
  buildingSuite?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  officialEmail?: string;
  supportEmail?: string;
  tollFree?: string;
  directPhone?: string;
  whatsappPhone?: string;
  cinNumber?: string;
  gstinNumber?: string;
  panNumber?: string;
  tanNumber?: string;
  msmeNumber?: string;
  iecCode?: string;
  officerName?: string;
  designation?: string;
  officerEmail?: string;
  officerPhone?: string;
  dinNumber?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  ifscCode?: string;
  updatedAt: Date;
}

const CompanyProfileSchema: Schema = new Schema(
  {
    companyName: { type: String, default: "Phantom Visa Private Limited" },
    tradeName: { type: String, default: "Phantom Visa" },
    businessType: { type: String, default: "Private Limited" },
    regDate: { type: String, default: "" },
    tagline: { type: String, default: "Your Trusted Passport & Visa Partner" },
    description: {
      type: String,
      default:
        "Leading tech-enabled visa processing platform providing seamless international visa processing, agent management, and embassy appointment coordination."
    },
    streetAddress: { type: String, default: "" },
    buildingSuite: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    country: { type: String, default: "India" },
    officialEmail: { type: String, default: "contact@phantomvisa.com" },
    supportEmail: { type: String, default: "support@phantomvisa.com" },
    tollFree: { type: String, default: "" },
    directPhone: { type: String, default: "" },
    whatsappPhone: { type: String, default: "" },
    cinNumber: { type: String, default: "" },
    gstinNumber: { type: String, default: "" },
    panNumber: { type: String, default: "" },
    tanNumber: { type: String, default: "" },
    msmeNumber: { type: String, default: "" },
    iecCode: { type: String, default: "" },
    officerName: { type: String, default: "" },
    designation: { type: String, default: "" },
    officerEmail: { type: String, default: "" },
    officerPhone: { type: String, default: "" },
    dinNumber: { type: String, default: "" },
    bankName: { type: String, default: "" },
    accountName: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    ifscCode: { type: String, default: "" }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ICompanyProfile>("CompanyProfile", CompanyProfileSchema);

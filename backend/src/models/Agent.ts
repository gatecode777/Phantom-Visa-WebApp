import mongoose, { Schema, Document } from "mongoose";

export interface IAgent extends Document {
  agentId: string;
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  altPhone?: string;
  dob?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  postalCode?: string;
  agencyName: string;
  agencyRegNo?: string;
  businessLicense?: string;
  gstTaxNo?: string;
  officeAddress?: string;
  officeCity?: string;
  officeState?: string;
  officeCountry?: string;
  officePostalCode?: string;
  website?: string;
  yearsInBusiness?: string;
  agencyTypes?: string[];
  employeeCount?: string;
  monthlyCapacity?: string;
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscSwiftCode?: string;
  commissionType: string;
  commissionValue: number;
  status: "Active" | "Pending Approval" | "Inactive";
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AgentSchema: Schema = new Schema(
  {
    agentId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    altPhone: { type: String },
    dob: { type: String },
    gender: { type: String, default: "Male" },
    nationality: { type: String, default: "Indian" },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String, required: true, default: "India" },
    postalCode: { type: String },
    agencyName: { type: String, required: true },
    agencyRegNo: { type: String },
    businessLicense: { type: String },
    gstTaxNo: { type: String },
    officeAddress: { type: String },
    officeCity: { type: String },
    officeState: { type: String },
    officeCountry: { type: String, default: "India" },
    officePostalCode: { type: String },
    website: { type: String },
    yearsInBusiness: { type: String },
    agencyTypes: [{ type: String }],
    employeeCount: { type: String },
    monthlyCapacity: { type: String },
    accountHolderName: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    ifscSwiftCode: { type: String },
    commissionType: { type: String, default: "Percentage" },
    commissionValue: { type: Number, default: 15 },
    status: {
      type: String,
      enum: ["Active", "Pending Approval", "Inactive"],
      default: "Pending Approval"
    },
    adminNotes: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Agent || mongoose.model<IAgent>("Agent", AgentSchema);

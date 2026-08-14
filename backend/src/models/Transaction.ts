import mongoose, { Schema, Document } from "mongoose";

export interface ITransactionPricing {
  consularFee: number;
  serviceFee: number;
  expressSurcharge: number;
  taxableBase: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  discount: number;
  netAmount: number;
}

export interface IRefundDetails {
  status: string;
  amount: number;
  date: string;
  refNo: string;
  reason: string;
}

export interface IActionNote {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface ITransaction extends Document {
  transactionId: string;
  invoiceNo: string;
  applicationId: string;
  userId?: mongoose.Types.ObjectId;
  applicantId?: string;
  applicantName: string;
  passportNumber: string;
  nationality: string;
  country: string;
  visaType: string;
  visaCategory: "Tourist" | "Business" | "Student" | "Work" | "Medical" | "Transit";
  paidBy: "Applicant" | "Agent";
  agentName?: string;
  pricing: ITransactionPricing;
  paymentMethod: string;
  paymentGateway: string;
  paymentRef: string;
  status: "Successful" | "Pending" | "Failed" | "Refunded" | "Cancelled" | "Proforma";
  gstin: string;
  billingAddress: string;
  sacCode: string;
  refundDetails?: IRefundDetails;
  actionNotes?: IActionNote[];
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    transactionId: { type: String, required: true, unique: true, index: true },
    invoiceNo: { type: String, required: true, index: true },
    applicationId: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    applicantId: { type: String, default: "" },
    applicantName: { type: String, required: true },
    passportNumber: { type: String, required: true },
    nationality: { type: String, default: "Indian" },
    country: { type: String, required: true },
    visaType: { type: String, required: true },
    visaCategory: { type: String, default: "Tourist" },
    paidBy: { type: String, enum: ["Applicant", "Agent"], default: "Applicant" },
    agentName: { type: String, default: "" },
    pricing: {
      consularFee: { type: Number, required: true },
      serviceFee: { type: Number, default: 2500 },
      expressSurcharge: { type: Number, default: 0 },
      taxableBase: { type: Number, required: true },
      cgst: { type: Number, required: true },
      sgst: { type: Number, required: true },
      igst: { type: Number, default: 0 },
      totalTax: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      netAmount: { type: Number, required: true }
    },
    paymentMethod: { type: String, default: "UPI" },
    paymentGateway: { type: String, default: "Razorpay" },
    paymentRef: { type: String, required: true },
    status: {
      type: String,
      enum: ["Successful", "Pending", "Failed", "Refunded", "Cancelled", "Proforma"],
      default: "Successful"
    },
    gstin: { type: String, default: "27AAACG1234H1Z5" },
    billingAddress: { type: String, default: "104, Park Street, Connaught Place, New Delhi - 110001" },
    sacCode: { type: String, default: "998311" },
    refundDetails: {
      status: String,
      amount: Number,
      date: String,
      refNo: String,
      reason: String
    },
    actionNotes: [
      {
        id: String,
        author: String,
        text: String,
        date: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);

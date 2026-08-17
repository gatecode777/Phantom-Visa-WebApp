import mongoose, { Schema, Document } from "mongoose";

export interface ISystemSetting extends Document {
  appName: string;
  companyName: string;
  websiteTitle: string;
  logoUrl?: string;
  faviconUrl?: string;
  platformUrl?: string;
  supportEmail?: string;
  supportContact?: string;
  officeAddress?: string;
  repName?: string;
  repRole?: string;
  repContact?: string;
  workingDays?: string;
  workingHours?: string;
  timezone?: string;
  defaultLanguage?: string;
  dateFormat?: string;
  currencySymbol?: string;
  updatedAt: Date;
}

const SystemSettingSchema: Schema = new Schema(
  {
    appName: { type: String, default: "Phantom Forex Mart Pvt. Ltd." },
    companyName: { type: String, default: "Phantom Forex Mart Pvt. Ltd." },
    websiteTitle: { type: String, default: "Phantom Forex Mart Pvt. Ltd. | Travel & Visa Portal" },
    logoUrl: { type: String, default: "https://ik.imagekit.io/zp0tch54w/PHANTOM-VISA/Gemini_Generated_Image_fjm238fjm238fjm2-removebg-preview%20(2)_p2j9SE6bD.png" },
    faviconUrl: { type: String, default: "/favicon.png" },
    platformUrl: { type: String, default: "https://phantomvisa.com" },
    supportEmail: { type: String, default: "support@phantomvisa.com" },
    supportContact: { type: String, default: "" },
    officeAddress: { type: String, default: "42, Barakhamba Road, Connaught Place, New Delhi, Delhi 110001" },
    repName: { type: String, default: "" },
    repRole: { type: String, default: "Primary Statutory Director" },
    repContact: { type: String, default: "" },
    workingDays: { type: String, default: "Monday - Friday" },
    workingHours: { type: String, default: "09:00 AM - 06:00 PM" },
    timezone: { type: String, default: "Asia/Kolkata (IST)" },
    defaultLanguage: { type: String, default: "English" },
    dateFormat: { type: String, default: "DD/MM/YYYY" },
    currencySymbol: { type: String, default: "₹" }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ISystemSetting>("SystemSetting", SystemSettingSchema);
